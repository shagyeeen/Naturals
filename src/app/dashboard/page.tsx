"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import StaffDashboard from "@/components/StaffDashboard";
import {
  Calendar,
  Users,
  Scissors,
  Camera,
  Loader2,
  Sparkles,
  History,
  Target,
  ArrowRight,
  Star,
  ChevronRight,
  Flame,
  Clock
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { 
    user, 
    profile, 
    loading, 
    isAdmin, 
    isManager, 
    isFranchiseOwner, 
    isStylist, 
    isCustomer,
    customerProfile
  } = useAuth();
  const router = useRouter();

  // Auth redirect is handled by dashboard/layout.tsx — no need to duplicate here

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-naturals-purple" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-naturals-purple mb-2">Authenticated Session</p>
          <h1 className="text-4xl font-black text-deep-grape italic tracking-tight">
            {isAdmin ? "Central Command" :
             isCustomer ? `Hello, ${customerProfile?.full_name?.split(' ')[0] || 'User'}` : 
             isStylist ? "Stylist Workspace" : "Management Hub"}
          </h1>
        </div>
      </div>

      {isAdmin || isManager || isFranchiseOwner || isStylist ? (
        <StaffDashboard />
      ) : (
        customerProfile && <CustomerOverview customerProfile={customerProfile} />
      )}
    </div>
  );
}

function CustomerOverview({ customerProfile }: { customerProfile: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Primary Action: Book Now */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-2 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-black/20 group min-h-[350px] flex flex-col"
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-700"
          style={{ 
            backgroundImage: 'url(/banner.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-naturals-purple/80 via-naturals-purple/40 to-transparent z-1" />
        <div className="absolute inset-0 bg-black/20 z-1" />

        {/* Shine Effect */}
        <div className="absolute inset-0 z-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg]" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between flex-grow">
           <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/30">
                 <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-black italic mb-4 drop-shadow-lg">Book Your Next Look</h2>
              <p className="text-white/90 text-xs font-bold uppercase tracking-widest max-w-xs leading-relaxed drop-shadow-md">
                Choose from our elite stylists and signature services.
              </p>
           </div>
           <Link href="/dashboard/booking" className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-white text-naturals-purple rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lavender transition-all w-fit shadow-xl hover:scale-105">
              Schedule Appointment <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </motion.div>

      {/* Quick Stats Sidebar */}
      <div className="space-y-8">
         <motion.div 
           whileHover={{ scale: 1.02, y: -5 }} 
           className="bg-[#E2E2E2] border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 relative overflow-hidden group/card"
         >
            {/* Silver Metallic Texture & Shine */}
            <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-[#f5f5f5] via-[#c0c0c0] to-[#e0e0e0]" />
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-1" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            <div className="absolute inset-0 z-1 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)', backgroundSize: '200% 100%' }} />
            
            <div className="absolute inset-0 z-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md text-deep-grape flex items-center justify-center shadow-lg border border-white/50">
                    <Star className="w-5 h-5 fill-deep-grape/10" />
                 </div>
                 <span className="text-[10px] font-black text-deep-grape bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/40 shadow-sm">Loyalty</span>
              </div>
              <p className="text-[8px] font-black text-deep-grape/40 uppercase tracking-[0.3em] mb-1">Membership</p>
              <h3 className="text-xl font-black text-deep-grape italic uppercase tracking-tight drop-shadow-sm">Platinum Elite</h3>
            </div>
         </motion.div>

         <motion.div 
           whileHover={{ scale: 1.02, y: -5 }} 
           className="bg-deep-grape rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group/card border border-white/5"
         >
            {/* Digital Texture & Shine */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='0.5'/%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="absolute inset-0 bg-gradient-to-br from-deep-grape via-naturals-purple/20 to-black/40 z-0" />
            <div className="absolute inset-0 z-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 transform -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/10 shadow-lg">
                    <Target className="w-5 h-5" />
                 </div>
                 <ChevronRight className="w-4 h-4 text-white/30 group-hover/card:translate-x-1 transition-transform" />
              </div>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Style Insight</p>
              <h3 className="text-xl font-black italic uppercase tracking-tight">Beauty Passport</h3>
              <Link href="/dashboard/passport" className="mt-6 text-[9px] font-black uppercase tracking-widest text-naturals-purple flex items-center gap-2 group/link">
                 View Profile <div className="w-1 h-1 bg-naturals-purple rounded-full animate-pulse" />
              </Link>
            </div>
         </motion.div>
      </div>

      {/* Secondary Cards */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-warm-grey/30 border border-black/5 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-white text-naturals-purple flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-deep-grape uppercase tracking-widest">AI Assistance</h4>
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.1em]">Try-on Preview</p>
               </div>
            </div>
            <p className="text-xs font-bold text-deep-grape/50 leading-relaxed mb-8">
               Generate style recommendations based on your unique facial features and historical preferences.
            </p>
            <Link href="/dashboard/assistant" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8E3E96] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6B2D73] transition-all shadow-md shadow-[#8E3E96]/20 w-fit group">
               Launch Assistant <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>

         <div className="bg-warm-grey/30 border border-black/5 rounded-[2.5rem] p-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-white text-naturals-purple flex items-center justify-center shadow-sm">
                  <History className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-deep-grape uppercase tracking-widest">Appointments</h4>
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.1em]">Visit Logs</p>
               </div>
            </div>
            <p className="text-xs font-bold text-deep-grape/50 leading-relaxed mb-8">
               Review your upcoming salon sessions or re-book past signature services with one click.
            </p>
            <Link href="/dashboard/appointments" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8E3E96] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#6B2D73] transition-all shadow-md shadow-[#8E3E96]/20 w-fit group">
               View Schedule <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>

      {/* Signature Service Offers */}
      <div className="md:col-span-3">
         <div className="bg-white border border-black/5 rounded-[3rem] p-12 relative overflow-hidden group shadow-xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Flame className="w-3 h-3 animate-pulse" /> Trending Styles
                  </div>
                  <h3 className="text-4xl font-black italic text-deep-grape mb-6 tracking-tight">Signature Service Rewards</h3>
                  <p className="text-sm font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed mb-8">
                     Your Beauty Passport tier grants you access to exclusive reductions on our most requested AI-mapped services.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <div className="px-6 py-4 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-deep-grape/30">Service Reward</span>
                        <span className="text-xl font-black text-naturals-purple">₹1000 OFF</span>
                     </div>
                     <div className="px-6 py-4 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-deep-grape/30">Applicable On</span>
                        <span className="text-xs font-black text-deep-grape uppercase">ADVANCED SKIN REPAIR</span>
                     </div>
                  </div>
               </div>
               <Link 
                  href="/dashboard/booking?service=ADVANCED SKIN REPAIR&discount=1000" 
                  className="px-12 py-6 bg-deep-grape text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-naturals-purple transition-all shadow-2xl shrink-0"
               >
                  Book Appointment
               </Link>
            </div>
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]" />
         </div>
      </div>

      {/* BAE Cosmetics & Rewards */}
      <div className="md:col-span-3">
         <div className="bg-gradient-to-r from-naturals-purple/20 to-lavender/30 rounded-[3rem] p-12 border border-naturals-purple/10 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Naturals BAE Cosmetics
                  </div>
                  <h3 className="text-4xl font-black italic text-deep-grape mb-6 tracking-tight">Exclusive BAE Vouchers</h3>
                  <p className="text-sm font-bold text-deep-grape/60 uppercase tracking-widest leading-relaxed mb-8">
                     Unlock specialized rewards for our premium cosmetics line. Your Beauty Passport entitles you to early access on seasonal collections.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <div className="px-6 py-4 bg-white rounded-2xl border border-naturals-purple/10 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-deep-grape/30">Discount Code</span>
                        <span className="text-xs font-black text-naturals-purple">BAE-2026-PREMIUM</span>
                     </div>
                     <div className="px-6 py-4 bg-white rounded-2xl border border-naturals-purple/10 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-deep-grape/30">Reward Tier</span>
                        <span className="text-xs font-black text-deep-grape">25% OFF COSMETICS</span>
                     </div>
                  </div>
               </div>
               <div className="w-full lg:w-72 aspect-square relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-naturals-purple/10 flex items-center justify-center">
                     <Star className="w-20 h-20 text-naturals-purple/20 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-grape/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                     <p className="text-[10px] font-black uppercase tracking-widest italic">New Arrival</p>
                     <p className="text-xs font-bold opacity-80">Summer Gloss Kit</p>
                  </div>
               </div>
            </div>
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
         </div>
      </div>

    </div>
  );
}
