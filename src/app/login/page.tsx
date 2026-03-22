"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Portal = 'customer' | 'staff';

export default function LoginPage() {
  const [portal, setPortal] = useState<Portal>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithGoogle, user, loading: authLoading, loginAsGuest } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError("");
    const result = await signInWithGoogle();
    
    // High-End Identity Initialization if new Google user
    if (result.user && !result.error) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', result.user.email)
        .single();
        
      if (!existingCustomer) {
        const customerCode = `NAT-SHA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await supabase.from('customers').upsert({
          email: result.user.email,
          phone: result.user.phoneNumber || "",
          full_name: result.user.displayName || "Google User",
          customer_code: customerCode,
          is_active: true
        }, { onConflict: 'email' });
      }
    }

    if (result.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
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
                className="object-contain object-center scale-150" 
              />
            </div>
          </Link>
          
          {/* Portal Switcher */}
          <div className="flex bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/10 w-fit mx-auto mb-8">
            <button 
              onClick={() => setPortal('customer')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${portal === 'customer' ? 'bg-white text-deep-grape shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              Customer
            </button>
            <button 
              onClick={() => setPortal('staff')}
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
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-10">
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

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className={`w-full py-5 bg-white border border-black/10 text-deep-grape font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                <path d="M12.2401 24.0008C15.4764 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                <path d="M5.50253 14.3003C5.00023 12.8099 5.00023 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.0695 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
              </svg>
              {isSubmitting ? "Authenticating..." : "Continue with Google"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest">
                <span className="bg-white px-4 text-deep-grape/40">Or Enter Guest Mode For Testing</span>
              </div>
            </div>

            {portal === 'customer' ? (
              <button
                type="button"
                onClick={() => { loginAsGuest('customer'); router.push('/dashboard/passport'); }}
                className="w-full py-4 bg-naturals-purple/5 text-naturals-purple font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-naturals-purple hover:text-white transition-all shadow-sm border border-naturals-purple/10"
              >
                Guest Customer
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { loginAsGuest('stylist'); router.push('/dashboard/stylist'); }}
                  className="py-3 bg-white text-deep-grape font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-naturals-purple hover:text-white transition-all shadow-sm border border-black/5"
                >
                  Stylist
                </button>
                <button
                  type="button"
                  onClick={() => { loginAsGuest('manager'); router.push('/dashboard/sop'); }}
                  className="py-3 bg-white text-deep-grape font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-naturals-purple hover:text-white transition-all shadow-sm border border-black/5"
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => { loginAsGuest('franchise_owner'); router.push('/dashboard'); }}
                  className="py-3 bg-white text-deep-grape font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-naturals-purple hover:text-white transition-all shadow-sm border border-black/5"
                >
                  Franchise Owner
                </button>
                <button
                  type="button"
                  onClick={() => { loginAsGuest('admin'); router.push('/dashboard'); }}
                  className="py-3 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-sm border border-deep-grape"
                >
                  System Admin
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>

        <p className="text-center text-deep-grape/30 text-[9px] font-black uppercase tracking-[0.4em] mt-8">
          Precision Beauty Intelligence • Powered by Naturals AI
        </p>
      </div>
    </div>
  );
}
