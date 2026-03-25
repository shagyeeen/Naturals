"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors, Calendar, Clock, User
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function StylistCopilot() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*, customer:customers(full_name), service:services(name, duration_minutes)')
      .order('appointment_date', { ascending: true });
    
    if (data) setAppointments(data);
    setLoading(false);
  };

  const handleStartSession = async (id: string) => {
    setActiveAppointmentId(id);
    // In a real app, you'd update the DB status here
    // await supabase.from('appointments').update({ status: 'in-progress' }).eq('id', id);
    alert(`Session Initialized: Protocol Execution started for ID ${id.slice(0, 8)}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
            <Calendar className="w-3 h-3" /> Protocol 01: Active Operations Stream
          </div>
          <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
            Personnel Duty Roster
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">Real-time engagement queue for managing upcoming Naturals procedures and client sessions.</p>
        </div>
        
        {activeAppointmentId && (
          <div className="bg-naturals-purple/10 border border-naturals-purple/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-naturals-purple animate-ping" />
            <div className="text-[10px] font-black uppercase tracking-widest text-naturals-purple">
              Protocol Execution in Progress
            </div>
          </div>
        )}
      </div>

      {/* Duty Roster Content Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key="appointments"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-naturals-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appt) => {
                const isActive = activeAppointmentId === appt.id;
                return (
                  <div key={appt.id} className={`glass-card p-8 bg-white border-l-8 ${isActive ? 'border-green-500' : 'border-naturals-purple'} shadow-xl transition-all duration-500 relative overflow-hidden`}>
                    {isActive && (
                      <div className="absolute top-0 right-0 p-4">
                        <div className="px-3 py-1 bg-green-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest animate-pulse">IN PROGRESS</div>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.2em] mb-1">Upcoming Protocol</p>
                        <h4 className="font-black text-lg text-deep-grape italic leading-tight">{appt.service?.name || "Premium Procedure"}</h4>
                      </div>
                      {!isActive && <span className="px-3 py-1 bg-naturals-purple/10 text-naturals-purple text-[9px] font-black rounded-lg uppercase tracking-widest">CONFIRMED</span>}
                    </div>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-[10px] font-black text-deep-grape/60 uppercase tracking-widest italic">
                          <User className="w-4 h-4 text-naturals-purple" /> {appt.customer?.full_name || "Private Client"}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-black text-deep-grape group">
                          <Clock className="w-4 h-4 text-naturals-purple group-hover:animate-pulse" /> 
                          {new Date(appt.appointment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} at {appt.start_time.slice(0, 5)}
                       </div>
                       <div className="flex items-center gap-3 text-[10px] font-black text-deep-grape/40 uppercase tracking-widest">
                          <Scissors className="w-4 h-4" /> Duration: {appt.service?.duration_minutes || 60} mins
                       </div>
                    </div>

                    <button 
                      onClick={() => handleStartSession(appt.id)}
                      disabled={isActive}
                      className={`w-full py-4 font-black text-[10px] uppercase tracking-[0.25em] rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' 
                          : 'bg-warm-grey text-deep-grape hover:bg-deep-grape hover:text-white'
                      }`}
                    >
                       {isActive ? "SESSION ACTIVE" : "START SESSION"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center glass-card bg-white border border-black/5 opacity-40">
              <p className="font-black text-[10px] uppercase tracking-[0.3em] italic mb-2">Registry Silent</p>
              <p className="text-[10px] font-black opacity-40">No upcoming deployments detected for this analyst profile.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
