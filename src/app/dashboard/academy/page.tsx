"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Video, Target, Trophy, PlayCircle, Lock, CheckCircle, ChevronRight, Star, ShieldCheck, Activity } from "lucide-react";

export default function TrainingAcademy() {
  const [activeCourse, setActiveCourse] = useState("Keratin Mastery");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartVideo = () => {
    setIsPlaying(true);
    alert(`Streaming Tutorial: ${activeCourse}. Session audit logged for Employee ID: ST-2401.`);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSimulateTest = () => {
    alert("AI Skill Simulation Initializing... Analytical diagnostics scanning technique...");
    setTimeout(() => {
      alert("Simulation Result: 88% Compliance in 'Heat Protection Protocol'. Data synchronized with Performance Dashboard.");
    }, 1500);
  };

  const handleCameraSetup = () => {
    alert("Initializing Visual Assessment Interface for Manual Proficiency Audit...");
    setTimeout(() => {
      alert("Interface Synchronized. Objective assessment of 'Sectioning Precision' is now active.");
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end bg-white p-8 rounded-[2rem] border border-black/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-naturals-purple/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
              <ShieldCheck className="w-3 h-3" /> Protocol 08: Strategic Advancement
            </div>
            <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
              Professional Protocol Accreditation
            </h1>
            <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest max-w-xl">Advanced personnel benchmarking and autonomous skill assessment for regional franchise operational parity.</p>
          </div>
          
          <div className="text-right">
            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.3em] mb-2">Personnel Grade</p>
            <div className="bg-deep-grape px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
               <Trophy className="w-6 h-6 text-naturals-purple" />
               <span className="font-black text-xl text-white italic">L2_ADVANCED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Learning Journey */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-deep-grape/30 flex items-center gap-4">
            <Activity className="w-5 h-5 text-naturals-purple" /> Progression Track: L3 Operational Authority
          </h2>
          
          <div className="relative flex-1">
             <div className="absolute left-[26px] top-4 bottom-4 w-1 bg-warm-grey/50 rounded-full" />
             
             <div className="space-y-8 relative z-10">
               {/* Completed Step */}
               <div className="flex gap-6 group cursor-pointer p-2 rounded-[2rem] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-green-500/30 flex items-center justify-center text-green-500 shrink-0 shadow-sm group-hover:bg-green-500 group-hover:text-white transition-all">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div className="flex-1 glass-card p-6 flex justify-between items-center bg-white border border-black/5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wider mb-1 text-deep-grape line-through decoration-naturals-purple decoration-2">Foundational Chromatic Theory</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape/40">Audit Score: 92% • Valid Through Q4 2026</p>
                    </div>
                    <button onClick={() => alert("Decrypting archived certification data...")} className="text-naturals-purple text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Re-Audit</button>
                  </div>
               </div>

               {/* Active Step */}
               <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-naturals-purple flex items-center justify-center shrink-0 shadow-2xl z-10 mt-1">
                    <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                  </div>
                  <div className="flex-1 p-8 rounded-[2rem] bg-white border-2 border-naturals-purple/20 shadow-2xl relative overflow-hidden group-hover:border-naturals-purple/50 transition-all">
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-naturals-purple/10 to-transparent flex items-center justify-end pr-6 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight className="w-8 h-8 text-naturals-purple" />
                    </div>
                    <div className="flex gap-3 mb-6">
                      <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-orange-500 text-white rounded">Demand Spike</span>
                      <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-deep-grape text-white rounded">Proficiency Test Pending</span>
                    </div>
                    <h3 className="font-black text-xl mb-3 text-deep-grape italic tracking-tighter">Structural Molecular Restoration</h3>
                    <p className="text-xs font-bold text-deep-grape/50 mb-8 max-w-sm leading-relaxed uppercase tracking-wider">Mastery of high-density chemical bonding, thermal mitigation strategies, and autonomous diagnostic mapping.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div onClick={handleStartVideo} className="bg-warm-grey/30 p-4 rounded-2xl border border-black/5 flex items-center gap-4 hover:-translate-y-1 transition-all cursor-pointer group/item">
                        <div className="w-10 h-10 rounded-xl bg-deep-grape text-white flex items-center justify-center shrink-0 group-hover/item:bg-naturals-purple transition-colors shadow-lg">
                          <PlayCircle className="w-5 h-5 ml-0.5" />
                        </div>
                        <div>
                          <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Methodology Vid</p>
                          <p className="text-[9px] font-bold opacity-40">42 Minutes</p>
                        </div>
                      </div>
                      
                      <div onClick={handleSimulateTest} className="bg-warm-grey/30 p-4 rounded-2xl border border-black/5 flex items-center gap-4 hover:-translate-y-1 transition-all cursor-pointer group/item">
                        <div className="w-10 h-10 rounded-xl bg-deep-grape text-white flex items-center justify-center shrink-0 group-hover/item:bg-naturals-purple transition-colors shadow-lg">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Skill Simulation</p>
                          <p className="text-[9px] font-bold opacity-40">AI-Graded</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-30">
                        <span>Module Integration Progress</span> <span>45%</span>
                      </div>
                      <div className="w-full h-1.5 bg-warm-grey rounded-full overflow-hidden">
                        <div className="h-full bg-naturals-purple rounded-full shadow-[0_0_10px_rgba(142,62,150,0.5)]" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>
               </div>

               {/* Locked Step */}
               <div className="flex gap-6 mt-4 opacity-30 grayscale">
                  <div className="w-14 h-14 rounded-2xl bg-warm-grey border-2 border-dashed border-black/20 flex items-center justify-center shrink-0 z-10">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="flex-1 p-6 rounded-[2rem] border-2 border-black/10 border-dashed bg-white">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-1 text-deep-grape">Complex Chromatic Correction</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Protocol Lock: Awaiting Structural Mastery completion.</p>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: AI Live Tests & Badges */}
        <div className="space-y-8">
          <div className="glass-card p-10 bg-white border border-black/5 shadow-xl">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-deep-grape/30 mb-10 flex items-center gap-4 font-black">
              <Star className="w-5 h-5 text-naturals-purple" /> Verified Accreditations
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { n: 'Precision Cutting', c: 'bg-deep-grape text-white', icon: '✂️' },
                 { n: 'SOP Auditor', c: 'bg-deep-grape text-naturals-purple', icon: '🛡️' },
                 { n: 'CX Optimization', c: 'bg-deep-grape text-white', icon: '❤️' },
                 { n: 'Sterility Protocols', c: 'bg-deep-grape text-white', icon: '✨' },
               ].map((badge, i) => (
                 <div key={i} onClick={() => alert(`Accreditation ID: NAT-ACC-${1000 + i}. Compliance Certified.`)} className="flex flex-col items-center justify-center p-6 bg-warm-grey/30 rounded-[2rem] border border-black/5 text-center group cursor-pointer hover:bg-white hover:shadow-2xl transition-all">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform">
                      <div className={`w-14 h-14 rounded-2xl ${badge.c} flex items-center justify-center text-xl shadow-lg font-black`}>
                        {badge.icon}
                      </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight text-deep-grape">{badge.n}</p>
                 </div>
               ))}
            </div>
            <button onClick={() => alert("Synchronizing Personnel Ledger across 500+ Nodes...")} className="w-full mt-10 py-4 text-[10px] font-black uppercase tracking-[0.25em] bg-warm-grey/50 rounded-xl hover:bg-deep-grape hover:text-white transition-all cursor-pointer">
              Franchise Authority Rank
            </button>
          </div>

          <div className="glass-card p-10 bg-deep-grape text-white relative overflow-hidden shadow-2xl rounded-[2rem]">
            <div className="absolute inset-0 bg-naturals-purple/20 blur-[80px] pointer-events-none" />
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/40 mb-10 flex items-center gap-4 relative z-10">
              <Video className="w-5 h-5 text-naturals-purple" /> Proficiency Audit
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-10 leading-relaxed relative z-10">Initialize visual monitoring interface for technical proficiency assessment. AI will audit movement precision, ergonomics, and speed.</p>
            
            <div onClick={handleCameraSetup} className="aspect-video bg-black/40 rounded-[2rem] overflow-hidden relative mb-4 border-4 border-white/5 group cursor-pointer shadow-inner">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 group-hover:bg-black/20 transition-all">
                <div className="w-16 h-16 rounded-full bg-naturals-purple flex items-center justify-center shadow-2xl mb-4 transform group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white ml-1" />
                </div>
                <span className="text-white font-black text-[10px] tracking-[0.4em] uppercase">INITIALIZE INTERFACE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
