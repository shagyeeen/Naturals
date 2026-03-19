"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Mail, Lock, User, Phone, 
  Calendar, ChevronRight, ArrowRight, 
  ShieldCheck, Briefcase, Users, UserCog 
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Portal = 'customer' | 'staff';
type AuthMode = 'login' | 'new-customer' 
  | 'link-account'
  | 'resend-verification';

export default function LoginPage() {
  const [portal, setPortal] = useState<Portal>('customer');
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { signIn, signUp, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [passportId, setPassportId] = useState("");
  const [showPassportPassword, setShowPassportPassword] = useState(false);
  const [syncedEmail, setSyncedEmail] = useState("");
  const [newCustomerData, setNewCustomerData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "" as "male" | "female" | "other" | "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn(loginData.email, loginData.password);
    if (result.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  const handleNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!newCustomerData.fullName || !newCustomerData.phone || !newCustomerData.email || !newCustomerData.password) {
      setError("Name, phone, email, and password are required");
      setIsSubmitting(false);
      return;
    }

    const result = await signUp(
      newCustomerData.email, 
      newCustomerData.password,
      newCustomerData.fullName,
      newCustomerData.phone
    );
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    // High-End Identity Initialization
    if (result.userId) {
      const customerCode = passportId.trim() || `NAT-SHA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const { error: linkError } = await supabase
        .from('customers')
        .upsert({ 
          user_id: result.userId,
          email: newCustomerData.email,
          phone: newCustomerData.phone,
          full_name: newCustomerData.fullName,
          customer_code: customerCode,
          is_active: true
        }, { onConflict: 'user_id' });
      
      if (linkError) {
        console.warn("Could not initialize identity on signup", linkError);
      } else {
        console.log("Elite Identity initialized:", customerCode);
      }
    }

    setMode('login');
    setError("A verification link has been sent to your email. Please confirm it to initialize your passport.");
    setIsSubmitting(false);
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: loginData.email,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Verification email resent! Please check your inbox.");
      setMode('login');
    }
    setIsSubmitting(false);
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!showPassportPassword) {
      // Step 1: Check if ID exists
      const { data, error } = await supabase
        .from('customers')
        .select('id, email, user_id, full_name')
        .ilike('customer_code', passportId.trim())
        .single();

      if (error || !data) {
        // More helpful diagnostic for the user
        if (error?.code === 'PGRST116') {
          setError("This ID doesn't exist in our registry, or its security vault (RLS) is currently locked.");
        } else {
          setError("Invalid Customer ID. Please verify your reference code.");
        }
        setIsSubmitting(false);
        return;
      }

      // Special case: Record exists but has no user_id (unlinked account)
      if (!data.user_id) {
        setMode('new-customer');
        setNewCustomerData({
          ...newCustomerData,
          fullName: data.full_name,
        });
        setError(`Identity confirmed for ${data.full_name}! Please complete registration to link your specialized passport ID.`);
        setIsSubmitting(false);
        return;
      }

      setSyncedEmail(data.email || "");
      setShowPassportPassword(true);
      setIsSubmitting(false);
    } else {
      // Step 2: Actually sign in
      const result = await signIn(syncedEmail, loginData.password);
      if (result.error) {
        setError("Authentication failed. Invalid Access Key for this ID.");
      } else if (result.user) {
        // If sign-in is successful, update the customer record with the new user_id
        const { error: updateError } = await supabase
          .from('customers')
          .update({ user_id: result.user.id })
          .ilike('customer_code', passportId.trim());

        if (updateError) {
          console.error("Error updating customer record with user_id:", updateError);
        }
      }
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9FF] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-naturals-purple/20 border-t-naturals-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F1FF] via-[#FDF9FF] to-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-naturals-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-lavender/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-32 h-10">
              <NextImage 
                src="/naturalslogo.png" 
                alt="Logo" 
                fill 
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain object-left brightness-0 invert" 
              />
            </div>
          </Link>
          
          {/* Portal Switcher */}
          <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/10 w-fit mx-auto mb-8">
            <button 
              onClick={() => { setPortal('customer'); setMode('login'); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${portal === 'customer' ? 'bg-white text-deep-grape shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => { setPortal('staff'); setMode('login'); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${portal === 'staff' ? 'bg-naturals-purple text-white shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              Staff Portal
            </button>
          </div>
        </div>

        <motion.div 
          layout
          className="glass-card p-10 bg-white/80 rounded-[2.5rem] shadow-2xl border border-naturals-purple/10"
        >
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-deep-grape mb-1 italic tracking-tight">
                      {portal === 'customer' ? 'Welcome Back' : 'Staff Workspace'}
                    </h2>
                    <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                      {portal === 'customer' ? 'Sign in to your experience' : 'Authorized Access Only'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${portal === 'customer' ? 'bg-naturals-purple/10 text-naturals-purple' : 'bg-deep-grape text-white'}`}>
                    {portal === 'customer' ? <Sparkles className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="email"
                      placeholder="Corporate or User Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="password"
                      placeholder="Access Key"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
                      </div>
                      {(error.toLowerCase().includes('confirm') || error.toLowerCase().includes('verification')) && (
                        <button 
                          type="button"
                          onClick={() => setMode('resend-verification')}
                          className="text-[9px] font-black text-naturals-purple uppercase tracking-widest hover:underline text-left mt-1 cursor-pointer"
                        >
                          Resend Verification Link?
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer ${portal === 'customer' ? 'bg-naturals-purple shadow-naturals-purple/20' : 'bg-deep-grape shadow-deep-grape/20'}`}
                  >
                    {isSubmitting ? "AUTHENTICATING..." : portal === 'customer' ? "INITIALIZE SESSION" : "ACCESS WORKSPACE"}
                    {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                  </button>
                </form>

                {portal === 'customer' ? (
                  <div className="mt-10 pt-8 border-t border-black/5">
                    <p className="text-deep-grape/30 text-[9px] font-black uppercase tracking-[0.3em] text-center mb-6">New to the ecosystem?</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setMode('new-customer')}
                        className="py-4 border-2 border-naturals-purple/20 text-naturals-purple font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-naturals-purple hover:text-white hover:border-transparent transition-all cursor-pointer"
                      >
                        Create Profile
                      </button>
                      <button
                        onClick={() => setMode('link-account')}
                        className="py-4 border-2 border-deep-grape/10 text-deep-grape/40 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-deep-grape hover:text-white hover:border-transparent transition-all cursor-pointer"
                      >
                        Link ID
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode('resend-verification')}
                      className="w-full mt-6 py-2 text-deep-grape/30 font-black text-[9px] uppercase tracking-widest hover:text-deep-grape transition-all cursor-pointer"
                    >
                      Resend Verification Email
                    </button>
                  </div>
                ) : (
                  <div className="mt-10 pt-8 border-t border-black/5">
                    <p className="text-deep-grape/30 text-[9px] font-black uppercase tracking-[0.3em] text-center mb-6">Authorized Personnel Only</p>
                    <div className="grid grid-cols-2 gap-4 opacity-40 grayscale pointer-events-none">
                      <div className="flex flex-col items-center gap-2 p-4 bg-warm-grey rounded-2xl border border-black/5">
                        <UserCog className="w-5 h-5 text-deep-grape" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Admin</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 bg-warm-grey rounded-2xl border border-black/5">
                        <Briefcase className="w-5 h-5 text-deep-grape" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Franchise</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 bg-warm-grey rounded-2xl border border-black/5">
                        <Users className="w-5 h-5 text-deep-grape" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Manager</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 bg-warm-grey rounded-2xl border border-black/5">
                        <Briefcase className="w-5 h-5 text-deep-grape" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Stylist</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {mode === 'new-customer' && (
              <motion.div
                key="new-customer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tight">New Profile</h2>
                <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Initialize your beauty passport</p>

                <form onSubmit={handleNewCustomer} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="text"
                      placeholder="Legal Full Name"
                      value={newCustomerData.fullName}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, fullName: e.target.value })}
                      className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple/30"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="email"
                      placeholder="Security Email"
                      value={newCustomerData.email}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                      className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple/30"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="password"
                      placeholder="Secure Password"
                      value={newCustomerData.password}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, password: e.target.value })}
                      className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple/30"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                      <input
                        type="tel"
                        placeholder="Phone No"
                        value={newCustomerData.phone}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                        className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-11 pr-4 text-deep-grape text-xs font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple/30"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                      <input
                        type="date"
                        value={newCustomerData.dateOfBirth}
                        onChange={(e) => setNewCustomerData({ ...newCustomerData, dateOfBirth: e.target.value })}
                        className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-11 pr-3 text-deep-grape text-[10px] font-bold focus:outline-none focus:border-naturals-purple/30"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-naturals-purple text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-naturals-purple/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "CREATING..." : "GENERATE ACCOUNT"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <button
                  onClick={() => setMode('login')}
                  className="w-full mt-6 py-2 text-deep-grape/30 font-black text-[9px] uppercase tracking-widest hover:text-deep-grape transition-all cursor-pointer"
                >
                  Return to Portal
                </button>
              </motion.div>
            )}

            {mode === 'link-account' && (
              <motion.div
                key="link"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-warm-grey rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-black/5">
                  <Users className="w-10 h-10 text-naturals-purple" />
                </div>
                <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tight">Passport Sync</h2>
                <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Reference existing customer ID</p>

                <form onSubmit={handleSync} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="NAT-ID-XXXX-XXXX"
                      value={passportId}
                      onChange={(e) => setPassportId(e.target.value)}
                      disabled={showPassportPassword}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-5 px-6 text-deep-grape text-center text-sm font-black tracking-widest placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all disabled:opacity-50"
                    />
                  </div>

                  <AnimatePresence>
                    {showPassportPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                         <p className="text-[10px] font-black text-naturals-purple uppercase tracking-widest">Identify Confirmed. Enter Access Key:</p>
                         <div className="relative">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                           <input
                             type="password"
                             placeholder="Enter Password"
                             value={loginData.password}
                             onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                             className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all"
                             required
                           />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-deep-grape text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "SYNCHRONIZING..." : showPassportPassword ? "AUTHORIZE ACCESS" : "SYNCHRONIZE DATA"}
                    </button>
                    {!showPassportPassword && (
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest hover:text-deep-grape transition-all"
                      >
                        Back to Portal
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {mode === 'resend-verification' && (
              <motion.div
                key="resend"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tight">Verify Identity</h2>
                <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Request a new secure link</p>

                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="email"
                      placeholder="Your Security Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple/30"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-naturals-purple text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-naturals-purple/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "SENDING..." : "RESEND CONFIRMATION"}
                    {!isSubmitting && <Mail className="w-4 h-4" />}
                  </button>
                </form>

                <button
                  onClick={() => setMode('login')}
                  className="w-full mt-6 py-2 text-deep-grape/30 font-black text-[9px] uppercase tracking-widest hover:text-deep-grape transition-all cursor-pointer"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-deep-grape/30 text-[9px] font-black uppercase tracking-[0.4em] mt-8">
          Precision Beauty Intelligence • Powered by Naturals AI
        </p>
      </div>
    </div>
  );
}
