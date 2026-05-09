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
  Clock,
  Search,
  Copy,
  Check
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

  useEffect(() => {
    if (!loading && !user) {
      const search = window.location.search;
      router.push(`/login${search}`);
    }
  }, [user, loading, router]);

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
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Primary Action: Book Now */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="md:col-span-2 bg-naturals-purple rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-naturals-purple/30 group"
      >
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        <div className="relative z-10 h-full flex flex-col justify-between">
           <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6">
                 <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black italic mb-4">Book Your Next Look</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                Choose from our elite stylists and signature services.
              </p>
           </div>
           <Link href="/dashboard/booking" className="mt-12 inline-flex items-center gap-3 px-8 py-4 bg-white text-naturals-purple rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lavender transition-all w-fit">
              Schedule Appointment <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
        <Scissors className="absolute bottom-[-20px] right-[-10px] w-48 h-48 text-white/5 rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-700" />
      </motion.div>

      {/* Quick Stats Sidebar */}
      <div className="space-y-8">
         <motion.div 
           whileHover={{ scale: 1.02, y: -5 }} 
           className="bg-gradient-to-br from-[#8E3E96] via-[#2F0137] to-black rounded-[2.5rem] p-8 shadow-2xl shadow-[#8E3E96]/30 border border-white/10 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
               <Star className="w-16 h-16 text-white" />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20">
                  <Star className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-[#8E3E96] bg-white px-3 py-1 rounded-full uppercase shadow-md">Loyalty</span>
            </div>
            <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1 relative z-10">Membership Status</p>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter relative z-10">Platinum Elite</h3>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full relative z-10 overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '0%' }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="absolute inset-0 bg-white" 
               />
            </div>
         </motion.div>

         <motion.div 
            whileHover={{ scale: 1.02, y: -5 }} 
            onClick={() => router.push('/dashboard/passport')}
            className="bg-gradient-to-br from-[#2F0137] via-[#8E3E96] to-[#2F0137] rounded-[2.5rem] p-8 text-white shadow-2xl cursor-pointer group relative overflow-hidden border border-white/10"
         >
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            <div className="flex items-center justify-between mb-6 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/10">
                  <Target className="w-5 h-5" />
               </div>
               <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1 relative z-10">Intelligence Archive</p>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter relative z-10">Beauty Passport</h3>
            <div className="mt-8 flex items-center justify-between relative z-10">
               <div className="text-[9px] font-black uppercase tracking-widest text-[#8E3E96] px-4 py-2 bg-white rounded-xl shadow-xl">
                  View Profile
               </div>
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#2F0137] bg-white/10" />
                  ))}
               </div>
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
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.1em]">Protocol Simulation</p>
               </div>
            </div>
            <p className="text-xs font-bold text-deep-grape/50 leading-relaxed mb-8">
               Generate style recommendations based on your unique facial features and historical preferences.
            </p>
            <Link href="/dashboard/assistant" className="text-[9px] font-black uppercase tracking-widest text-naturals-purple flex items-center gap-2 group">
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
            <Link href="/dashboard/appointments" className="text-[9px] font-black uppercase tracking-widest text-naturals-purple flex items-center gap-2 group">
               View Schedule <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>

      {/* Signature Protocol Vouchers */}
      <div className="md:col-span-3">
         <div className="bg-white border border-black/5 rounded-[3rem] p-12 relative overflow-hidden group shadow-xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Flame className="w-3 h-3 animate-pulse" /> Trending Protocols
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
                        <span className="text-xs font-black text-deep-grape uppercase">ANTI-AGEING FACIAL</span>
                     </div>
                  </div>
               </div>
               <Link 
                  href={`/dashboard/booking?service=${encodeURIComponent('Anti-Ageing Facial')}&discount=1000`}
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
                     <div 
                        onClick={() => handleCopyCode('BAE-2026-PREMIUM')}
                        className="px-6 py-4 bg-white rounded-2xl border border-black/5 flex flex-col gap-1 cursor-pointer hover:bg-naturals-purple/5 transition-all group/copy"
                     >
                        <div className="flex justify-between items-center w-full">
                           <span className="text-[8px] font-black uppercase text-deep-grape/30">Discount Code</span>
                           {copied ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-deep-grape/20 group-hover/copy:text-naturals-purple" />}
                        </div>
                        <span className="text-xs font-black text-naturals-purple uppercase flex items-center gap-2">
                           {copied ? 'COPIED!' : 'BAE-2026-PREMIUM'}
                        </span>
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
