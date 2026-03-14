"use client";

import { motion } from "framer-motion";
import { User, Activity, Calendar, Award, Droplets, Sun, Sparkles, Map, Leaf, Search } from "lucide-react";

export default function BeautyPassport() {
  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-xs font-bold mb-2 border border-naturals-purple/20">
            <Sparkles className="w-3 h-3" /> Module 3: Digital Beauty Profile
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-naturals-purple to-lavender mb-2">Customer Beauty Passport</h1>
          <p className="text-deep-grape/60">Hyper-personalized diagnostics and long-term beauty journeys.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="glass flex items-center p-2 rounded-xl bg-warm-grey/50 border border-naturals-purple/10 shadow-sm">
             <Search className="w-4 h-4 text-deep-grape/40 ml-2" />
             <input type="text" placeholder="Search Customer ID or Phone" className="bg-transparent border-none outline-none text-sm px-2 w-48 text-deep-grape" />
           </div>
           <button className="px-6 py-2 bg-gradient-to-r from-naturals-purple to-lavender text-white rounded-xl font-bold shadow-md hover:shadow-naturals-purple/40 transition-shadow">
             Scan Face
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Identity */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-br from-naturals-purple to-lavender opacity-20" />
             <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl relative z-10 overflow-hidden bg-warm-grey mt-6 mb-4">
               <img src="https://i.pravatar.cc/300" alt="Customer Profile" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-2xl font-bold font-sans">Aaradhya V.</h2>
             <p className="text-sm text-naturals-purple font-semibold mb-6 flex gap-2 items-center justify-center">
               <Award className="w-4 h-4" /> Gold Tier Member
             </p>
             
             <div className="grid grid-cols-2 gap-4 w-full">
               <div className="p-3 bg-warm-grey/50 rounded-xl border border-black/5">
                 <p className="text-xs font-semibold opacity-60">Visits/Year</p>
                 <p className="text-lg font-bold">14</p>
               </div>
               <div className="p-3 bg-warm-grey/50 rounded-xl border border-black/5">
                 <p className="text-xs font-semibold opacity-60">Avg. Spend</p>
                 <p className="text-lg font-bold">₹3,450</p>
               </div>
             </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Map className="w-4 h-4 opacity-50" /> Environment Profile</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-naturals-purple/5 pb-2">
                <span className="opacity-60 flex gap-2 items-center"><Sun className="w-4 h-4" /> Climate Exposure</span>
                <span className="font-semibold text-orange-500">High Humidity / Monsoons</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-naturals-purple/5 pb-2">
                <span className="opacity-60 flex gap-2 items-center"><Droplets className="w-4 h-4" /> Water Quality</span>
                <span className="font-semibold text-red-500">Hard Water (Chennai)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60 flex gap-2 items-center"><Leaf className="w-4 h-4" /> Lifestyle</span>
                <span className="font-semibold text-green-500">Active / Swims</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Container: Diagnostics & Journey */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* AI Diagnosis Scores */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass-card p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-naturals-purple/10 rounded-full blur-[40px] group-hover:bg-naturals-purple/20 transition-colors" />
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold flex gap-2 items-center"><Sparkles className="w-5 h-5 text-naturals-purple" /> Hair Health Analysis</h3>
                 <span className="px-3 py-1 bg-green-500/10 text-green-600 font-bold text-sm rounded-full">Good 78/100</span>
               </div>
               
               <div className="space-y-4 relative z-10">
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Density</span> <span>Normal</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-naturals-purple rounded-full" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Damage Level</span> <span className="text-orange-500 font-bold">Level 2 / Frizz</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[45%] h-full bg-orange-500 rounded-full" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Scalp Condition</span> <span>Healthy / Oily</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-green-500 rounded-full" /></div>
                 </div>
               </div>
             </div>

             <div className="glass-card p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/10 rounded-full blur-[40px] group-hover:bg-lavender/20 transition-colors" />
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold flex gap-2 items-center"><Sparkles className="w-5 h-5 text-lavender" /> Skin Health Analysis</h3>
                 <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 font-bold text-sm rounded-full">Fair 62/100</span>
               </div>
               
               <div className="space-y-4 relative z-10">
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Hydration</span> <span className="text-red-500">Dry</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[30%] h-full bg-red-500 rounded-full" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Pigmentation</span> <span>Minimal UV Damage</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-green-500 rounded-full" /></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-semibold opacity-80 mb-1">
                     <span>Texture</span> <span>Uneven around T-Zone</span>
                   </div>
                   <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="w-[50%] h-full bg-yellow-500 rounded-full" /></div>
                 </div>
               </div>
             </div>
          </div>

          {/* Predictive Journey */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6">Predictive Beauty Journey</h3>
            
            <div className="relative border-l-2 border-naturals-purple/20 ml-4 space-y-8 pl-8 pt-2 pb-2">
              
              <div className="relative">
                <div className="absolute w-6 h-6 rounded-full bg-naturals-purple border-4 border-white -left-[45px] top-0 flex items-center justify-center shadow-lg"></div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Month 1: Structure Repair</h4>
                  <p className="text-sm opacity-60 mb-3">AI Recommendation based on current damage levels and Hard Water exposure.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="p-3 bg-naturals-purple/5 border border-naturals-purple/20 rounded-xl">
                       <p className="font-semibold text-sm mb-1">Salon Service</p>
                       <p className="text-xs font-bold text-naturals-purple">Olaplex Stand-Alone Treatment</p>
                     </div>
                     <div className="p-3 bg-lavender/5 border border-lavender/20 rounded-xl">
                       <p className="font-semibold text-sm mb-1">Home Care Prescribed</p>
                       <p className="text-xs font-bold text-lavender">Clarifying Shampoo + Deep Moisture Mask</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute w-6 h-6 rounded-full bg-warm-grey border-4 border-white -left-[45px] top-0 shadow-sm transition-colors hover:bg-lavender group"></div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Month 2: Smoothing Pre-Monsoon Preparation</h4>
                  <p className="text-sm opacity-60 mb-3">Predicting high humidity next month based on Chennai climate data. Anti-frizz required.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="p-3 bg-white/30 border border-black/5 rounded-xl hover:border-lavender/50 transition-colors">
                       <p className="font-semibold text-sm mb-1">Salon Service</p>
                       <p className="text-xs font-bold">Keratin/Botox Frontal Smoothing</p>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute w-6 h-6 rounded-full bg-warm-grey border-4 border-white -left-[45px] top-0 shadow-sm transition-colors hover:bg-lavender group"></div>
                <div>
                  <h4 className="font-bold text-lg mb-1 opacity-60">Month 3: Skin Hydration Focus</h4>
                  <p className="text-sm opacity-50 mb-3">Post-monsoon dry winds historically affect this skin profile.</p>
                  <div className="grid sm:grid-cols-2 gap-4 opacity-70">
                     <div className="p-3 bg-white/30 border border-black/5 rounded-xl">
                       <p className="font-semibold text-sm mb-1">Salon Service</p>
                       <p className="text-xs font-bold">HydraFacial + Vitamin C Infusion</p>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
