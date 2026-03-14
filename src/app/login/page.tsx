"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";

const roles = ["Customer", "Stylist", "Manager", "Franchise Owner", "Admin"];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("Customer");
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-naturals-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-lavender/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1000px] glass-card overflow-hidden grid md:grid-cols-2 shadow-2xl z-10"
      >
        {/* Left Side: Branding */}
        <div className="p-12 hidden md:flex flex-col justify-between relative text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-naturals-purple to-deep-grape" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Naturals AI
              </span>
            </Link>

            <h1 className="text-4xl font-bold leading-tight mb-4">
              Welcome to the Future of Salon Intelligence
            </h1>
            <p className="text-white/80 text-lg max-w-sm">
              Sign in to access hyper-personalized insights, AI tools, and your comprehensive beauty passport.
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/20 mt-12">
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">You are logging in as</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedRole === role 
                      ? "bg-white text-deep-grape shadow-lg" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white/50 backdrop-blur-3xl p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="md:hidden flex items-center justify-center gap-2 mb-8 text-deep-grape">
            <Sparkles className="w-6 h-6 text-naturals-purple" />
            <span className="font-bold text-xl">Naturals AI</span>
          </div>

          <h2 className="text-3xl font-bold text-deep-grape mb-2">Sign In</h2>
          <p className="text-deep-grape/60 mb-8">
            Access your {selectedRole} dashboard
          </p>

          <div className="flex bg-warm-grey p-1 rounded-xl mb-8">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                loginMethod === "email" 
                  ? "bg-white text-naturals-purple shadow-sm" 
                  : "text-deep-grape/60 hover:text-deep-grape"
              }`}
            >
              Email & Password
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
                loginMethod === "otp" 
                  ? "bg-white text-naturals-purple shadow-sm" 
                  : "text-deep-grape/60 hover:text-deep-grape"
              }`}
            >
              Mobile OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={loginMethod}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); /* Mock routing to dashboards */ window.location.href='/dashboard'; }}
            >
              {loginMethod === "email" ? (
                <>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/40" />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full bg-white border border-warm-grey rounded-xl px-12 py-4 h-14 outline-none focus:border-naturals-purple focus:ring-1 focus:ring-naturals-purple transition-all placeholder:text-deep-grape/30 text-deep-grape font-medium"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/40" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full bg-white border border-warm-grey rounded-xl px-12 py-4 h-14 outline-none focus:border-naturals-purple focus:ring-1 focus:ring-naturals-purple transition-all placeholder:text-deep-grape/30 text-deep-grape font-medium"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <a href="#" className="text-sm font-semibold text-naturals-purple hover:text-lavender transition-colors">Forgot Password?</a>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/40" />
                    <input 
                      type="tel" 
                      placeholder="Mobile Number" 
                      className="w-full bg-white border border-warm-grey rounded-xl px-12 py-4 h-14 outline-none focus:border-naturals-purple focus:ring-1 focus:ring-naturals-purple transition-all placeholder:text-deep-grape/30 text-deep-grape font-medium"
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="w-full h-14 rounded-xl bg-gradient-to-r from-naturals-purple to-lavender text-white font-bold text-lg shadow-lg hover:shadow-naturals-purple/30 transition-all flex items-center justify-center gap-2 group">
                Continue to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-deep-grape/10"></div>
              <span className="flex-shrink-0 mx-4 text-sm font-medium text-deep-grape/40">Or continue with</span>
              <div className="flex-grow border-t border-deep-grape/10"></div>
            </div>

            <button className="w-full h-14 rounded-xl bg-white border border-warm-grey hover:bg-warm-grey transition-colors flex items-center justify-center gap-3 font-semibold text-deep-grape">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
