"use client";

import { motion } from "framer-motion";
import { BookOpen, Video, Target, Trophy, PlayCircle, Lock, CheckCircle, ChevronRight, Star } from "lucide-react";

export default function TrainingAcademy() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end bg-gradient-to-r from-teal-500/10 to-transparent p-6 rounded-3xl border border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex justify-between items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-600 text-xs font-bold mb-2">
              <BookOpen className="w-3 h-3" /> Digital Academy
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-green-500 mb-2 flex items-center gap-3">
              Stylist Training & Certification
            </h1>
            <p className="text-deep-grape/70 max-w-xl">Interactive modules, AI-graded skill tests, and real-time certification to upscale your franchise staff.</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-bold opacity-60 uppercase mb-1">Your Skill Level</p>
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-teal-500/30 shadow-lg shadow-teal-500/20">
               <Trophy className="w-6 h-6 text-yellow-500" />
               <span className="font-black text-xl text-teal-600">L2 Advanced</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Learning Journey */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-teal-500" /> Skill Journey: L3 Master Certification</h2>
          
          <div className="relative flex-1">
             <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-teal-500 via-teal-500/50 to-warm-grey rounded-full" />
             
             <div className="space-y-6 relative z-10">
               {/* Completed Step */}
               <div className="flex gap-4 group cursor-pointer hover:bg-white/50 p-2 rounded-2xl transition-colors">
                  <div className="w-12 h-12 rounded-full bg-teal-500 border-[3px] border-white flex items-center justify-center text-white shrink-0 shadow-md">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 glass-card p-4 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-bold text-lg mb-1 line-through decoration-2 decoration-teal-500">Advanced Color Theory</h3>
                      <p className="text-xs font-semibold">Score: 92% • Passed on Oct 12</p>
                    </div>
                    <button className="text-teal-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Review</button>
                  </div>
               </div>

               {/* Active Step */}
               <div className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.5)] z-10 mt-2">
                    <span className="w-4 h-4 rounded-full bg-teal-500 animate-pulse"></span>
                  </div>
                  <div className="flex-1 p-6 rounded-2xl bg-gradient-to-r from-teal-500/10 to-transparent border border-teal-500/30 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-teal-500/20 to-transparent flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-8 h-8 text-teal-500" />
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-600 rounded">Trending Need</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-600 rounded">Practical Test Required</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-teal-600">Keratin Smoothing Mastery</h3>
                    <p className="text-sm opacity-80 mb-6 max-w-sm">Learn the exact chemical application techniques, heat protection strategies, and AI damage assessment for Keratin treatments.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/60 p-3 rounded-xl border border-black/5 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                          <PlayCircle className="w-5 h-5 ml-0.5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">Video Tutorial</p>
                          <p className="text-[10px] opacity-60">42 mins</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 p-3 rounded-xl border border-black/5 flex items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight text-yellow-600">Simulate Test</p>
                          <p className="text-[10px] opacity-60">AI Evaluated</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="flex justify-between text-xs font-bold opacity-60 mb-1">
                        <span>Module Progress</span> <span>45%</span>
                      </div>
                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>
               </div>

               {/* Locked Step */}
               <div className="flex gap-4 mt-6 opacity-40">
                  <div className="w-12 h-12 rounded-full bg-warm-grey border-2 border-dashed border-black/20 flex items-center justify-center shrink-0 z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 p-6 rounded-2xl border border-black/10 border-dashed bg-white/10">
                    <h3 className="font-bold text-lg mb-1">Color Correction Dynamics</h3>
                    <p className="text-xs font-semibold">Requires passing Keratin Mastery to unlock.</p>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: AI Live Tests & Badges */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-yellow-500/20">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Earned Certifications
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { n: 'Basic Cuts', c: 'bg-[#8E3E96] text-white', icon: '✂️' },
                 { n: 'SOP Expert', c: 'bg-blue-500 text-white', icon: '🛡️' },
                 { n: 'Client Care', c: 'bg-pink-500 text-white', icon: '❤️' },
                 { n: 'Hygiene', c: 'bg-green-500 text-white', icon: '✨' },
               ].map((badge, i) => (
                 <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/50 rounded-xl border border-black/5 text-center group cursor-pointer hover:shadow-lg transition-all">
                   <div className={`w-12 h-12 rounded-full ${badge.c} flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                     {badge.icon}
                   </div>
                   <p className="text-xs font-bold uppercase tracking-wide">{badge.n}</p>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold rounded-xl border-2 border-dashed border-black/20 hover:bg-black/5 transition-colors">
              View Franchise Ranking
            </button>
          </div>

          <div className="glass-card p-6 bg-gradient-to-b from-indigo-500/10 to-transparent">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-500">
              <Video className="w-5 h-5" /> Live Skill Assessment
            </h2>
            <p className="text-sm opacity-80 mb-6">Connect your iPad camera to perform a physical technique assessment (e.g. foil wrapping). The AI will evaluate your speed and precision automatically.</p>
            
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative mb-4 shadow-inner border border-black/10 group cursor-pointer">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 group-hover:bg-black/20 transition-colors">
                <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform mb-2" />
                <span className="text-white font-bold text-sm tracking-widest uppercase">Start Camera Setup</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
