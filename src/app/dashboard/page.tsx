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
  ChevronRight
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
      router.push('/login');
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
         <motion.div whileHover={{ scale: 1.02 }} className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-6">
               <div className="w-10 h-10 rounded-xl bg-lavender/50 text-naturals-purple flex items-center justify-center">
                  <Star className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-naturals-purple bg-naturals-purple/10 px-3 py-1 rounded-full uppercase">Loyalty</span>
            </div>
            <p className="text-[8px] font-black text-deep-grape/30 uppercase tracking-[0.2em] mb-1">Membership</p>
            <h3 className="text-xl font-black text-deep-grape italic uppercase">Platinum Elite</h3>
         </motion.div>

         <motion.div whileHover={{ scale: 1.02 }} className="bg-deep-grape rounded-[2.5rem] p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <Target className="w-5 h-5" />
               </div>
               <ChevronRight className="w-4 h-4 text-white/30" />
            </div>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Style Insight</p>
            <h3 className="text-xl font-black italic uppercase">Beauty Passport</h3>
            <Link href="/dashboard/passport" className="mt-6 text-[9px] font-black uppercase tracking-widest text-naturals-purple flex items-center gap-2">
               View Profile
            </Link>
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

    </div>
  );
}
