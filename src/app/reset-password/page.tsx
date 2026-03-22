'use client';

import { useState, Suspense } from "react";
import { auth as firebaseAuth } from "@/lib/firebase";
import { confirmPasswordReset } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) {
      setError("Invalid or expired password reset link. Please request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await confirmPasswordReset(firebaseAuth, oobCode, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    }
    setIsSubmitting(false);
  };

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
        </div>

        <motion.div 
          layout
          className="glass-card p-10 bg-white/80 rounded-[2.5rem] shadow-2xl border border-naturals-purple/10"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="reset"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-deep-grape mb-1 italic tracking-tight">Set Access Key</h2>
                    <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em]">Enter your new secure credential</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-naturals-purple/10 text-naturals-purple flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="password"
                      placeholder="New Access Key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-naturals-purple/40" />
                    <input
                      type="password"
                      placeholder="Confirm New Key"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/20 focus:outline-none focus:border-naturals-purple transition-all"
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
                    {isSubmitting ? "UPDATING..." : "UPDATE ACCESS KEY"}
                    {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tight">Key Verified</h2>
                <p className="text-deep-grape/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Access Key Updated Successfully</p>
                <p className="text-[10px] font-black text-naturals-purple uppercase tracking-widest animate-pulse">Redirecting to login portal...</p>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF9FF] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-naturals-purple/20 border-t-naturals-purple animate-spin" />
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
