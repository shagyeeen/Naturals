"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, User } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF9FF] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-naturals-purple/20 border-t-naturals-purple animate-spin" /></div>}>
      <CustomerLoginForm />
    </Suspense>
  );
}

function CustomerLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithGoogle, loading: authLoading, loginAsGuest, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const service = searchParams.get('service');
  const discount = searchParams.get('discount');

  const getTargetUrl = (base: string) => {
    if (service) {
      return `/dashboard/booking?service=${encodeURIComponent(service)}&discount=${discount || '0'}`;
    }
    return base;
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError("");
    const result = await signInWithGoogle();
    
    if (result.user && !result.error) {
      const profileRes = await fetch(`/api/auth/profile?email=${encodeURIComponent(result.user.email || '')}`);
      
      if (!profileRes.ok) {
        const text = await profileRes.text();
        console.error(`[Auth] Initial profile check failed with status ${profileRes.status}:`, text.substring(0, 100));
        setError(`Authentication service error (${profileRes.status}). Please try again.`);
        setIsSubmitting(false);
        return;
      }

      const { customerData: existingCustomer } = await profileRes.json();
        
      if (!existingCustomer) {
        const customerCode = `NAT-SHA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const ensureRes = await fetch('/api/auth/action', {
          method: 'POST',
          body: JSON.stringify({
            action: 'ensure',
            email: result.user.email,
            fullName: result.user.displayName,
            customerCode,
            photoURL: result.user.photoURL
          })
        });
        const { error: ensureError } = await ensureRes.json();

        if (ensureError) {
          setError(`Database configuration error: ${ensureError}`);
          setIsSubmitting(false);
          return;
        }
        
        await refreshProfile(result.user);
        router.push(getTargetUrl('/dashboard/onboarding'));
      } else {
        await refreshProfile(result.user);
        const needsOnboarding = !existingCustomer.phone || !existingCustomer.date_of_birth || !existingCustomer.gender;
        if (needsOnboarding) {
          router.push(getTargetUrl('/dashboard/onboarding'));
        } else {
          router.push(getTargetUrl('/dashboard/passport'));
        }
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
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-naturals-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-lavender/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-2">
            <div className="relative w-40 h-12">
              <NextImage 
                src="/naturalslogo.png" 
                alt="Logo" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>
          <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.4em] opacity-40">India's No.1 Hair and Beauty Salon</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 bg-white/90 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(142,62,150,0.15)] border border-naturals-purple/5"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-deep-grape mb-1 italic tracking-tight">Welcome</h2>
              <p className="text-deep-grape/40 text-[10px] uppercase font-black tracking-[0.2em]">Sign in to your experience</p>
            </div>
            <div className="w-14 h-14 rounded-[1.5rem] bg-naturals-purple/10 text-naturals-purple flex items-center justify-center shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
              <p className="text-red-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {message && !error && (
            <div className="bg-naturals-purple/5 border border-naturals-purple/10 rounded-2xl p-5 mb-8">
              <p className="text-naturals-purple text-[10px] font-black uppercase tracking-widest leading-relaxed">{message}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-5 bg-[#8E3E96] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#6B2D73] hover:shadow-xl shadow-md transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
              <path d="M12.2401 24.0008C15.4764 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
              <path d="M5.50253 14.3003C5.00023 12.8099 5.00023 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
              <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.0695 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
            </svg>
            {isSubmitting ? "Authenticating..." : "Continue with Google"}
          </button>
        </motion.div>

        <p className="text-center text-deep-grape/30 text-[8px] font-black uppercase tracking-[0.5em] mt-10">
          Precision Beauty Intelligence • Naturals AI
        </p>
      </div>
    </div>
  );
}
