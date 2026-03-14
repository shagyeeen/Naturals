"use client";

import { motion } from "framer-motion";
import { TrendingUp, Instagram, MapPin, PackageOpen, AlertCircle, ArrowUp, Calendar, Hash } from "lucide-react";

export default function TrendIntelligence() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold mb-2 border border-pink-500/20">
          <TrendingUp className="w-3 h-3" /> Module 4: Prediction AI
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 mb-2 flex items-center gap-3">
          AI Trend Intelligence
        </h1>
        <p className="text-deep-grape/60">Real-time social listening and predictive regional inventory stocking.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Social Listening & Top Trends */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 flex items-center gap-4 bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F56040]/10 border-[#FD1D1D]/20">
               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] flex items-center justify-center text-white shrink-0">
                 <Instagram className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-bold uppercase tracking-widest opacity-70">Social Signal Score</p>
                 <p className="text-2xl font-black">94.8</p>
               </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-4 border-orange-500/20 bg-orange-500/5">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/40">
                 <MapPin className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-bold uppercase tracking-widest opacity-70">Regional Focus</p>
                 <select className="bg-transparent border-none outline-none font-bold text-lg -ml-1 text-orange-500 w-32 cursor-pointer">
                   <option className="text-black">Chennai</option>
                   <option className="text-black">Bangalore</option>
                   <option className="text-black">Coimbatore</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 flex-1">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ArrowUp className="w-5 h-5 text-pink-500" /> Breakout Trends (Chennai Region)</h2>

            <div className="space-y-4">
               
               <div className="p-4 rounded-xl border border-black/5 bg-white/50 flex gap-4 items-center group hover:bg-white/80 transition-colors">
                 <div className="w-16 h-16 rounded-xl bg-[url('https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?w=400&q=80')] bg-cover bg-center shrink-0 shadow-md"></div>
                 <div className="flex-1">
                   <p className="font-bold text-lg leading-tight mb-1">Glass Skin Facial Therapy</p>
                   <p className="text-xs font-bold text-pink-500 flex gap-2 items-center"><Hash className="w-3 h-3" /> kbeauty trend • high humidity adaptation</p>
                 </div>
                 <div className="text-right">
                   <p className="text-green-500 font-bold text-lg">+42%</p>
                   <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Wow</p>
                 </div>
               </div>

               <div className="p-4 rounded-xl border border-black/5 bg-white/50 flex gap-4 items-center group hover:bg-white/80 transition-colors">
                 <div className="w-16 h-16 rounded-xl bg-[url('https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80')] bg-cover bg-center shrink-0 shadow-md"></div>
                 <div className="flex-1">
                   <p className="font-bold text-lg leading-tight mb-1">Hair Botox Repair</p>
                   <p className="text-xs font-bold text-naturals-purple flex gap-2 items-center"><Hash className="w-3 h-3" /> frizzcontrol • monsoon prep</p>
                 </div>
                 <div className="text-right">
                   <p className="text-green-500 font-bold text-lg">+35%</p>
                   <p className="text-xs opacity-50 uppercase font-bold tracking-widest">MOM</p>
                 </div>
               </div>

               <div className="p-4 rounded-xl border border-black/5 bg-white/50 flex gap-4 items-center group hover:bg-white/80 transition-colors">
                 <div className="w-16 h-16 rounded-xl bg-[url('https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80')] bg-cover bg-center shrink-0 shadow-md grayscale"></div>
                 <div className="flex-1">
                   <p className="font-bold text-lg leading-tight mb-1 opacity-70">Classic Re-bonding</p>
                   <p className="text-xs font-bold text-red-400 flex gap-2 items-center"><Hash className="w-3 h-3" /> outdated • chemical damage</p>
                 </div>
                 <div className="text-right">
                   <p className="text-red-500 font-bold text-lg">-18%</p>
                   <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Drop</p>
                 </div>
               </div>

            </div>

             {/* Chart Mockup */}
             <div className="h-48 mt-6 w-full rounded-2xl bg-gradient-to-t from-black/5 to-transparent border border-black/5 relative flex items-end px-4 gap-2 pb-4 pt-12">
                <span className="absolute left-4 top-4 text-xs font-bold opacity-50">Demand Volume (30 Days)</span>
                {[40, 45, 30, 60, 80, 75, 95, 100, 110].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-pink-500/80 to-orange-400 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs font-bold px-2 py-1 rounded transition-opacity pointer-events-none">Day {i+1}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Inventory Prediction */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><PackageOpen className="w-5 h-5 text-orange-500" /> AI Inventory Forecast</h2>
            <Calendar className="w-5 h-5 opacity-40" />
          </div>

          <div className="flex-1 space-y-4">
             <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
               <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
               <div>
                 <p className="font-bold text-orange-600 mb-1">Critically Low Prediction</p>
                 <p className="text-xs font-bold opacity-80 mb-2">Based on Hair Botox trend (+35%)</p>
                 <div className="bg-white/80 rounded p-2 text-sm font-semibold border border-orange-500/20 shadow-sm">
                   <p>Stock Required: <span className="text-orange-600">Hair Botox Serum (Avlon)</span></p>
                   <p className="text-xs mt-1">Order 50 Units next week to avoid stockout.</p>
                 </div>
               </div>
             </div>

             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
               <PackageOpen className="w-6 h-6 text-blue-500 shrink-0 mt-1 hidden" />
               <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
               <div>
                 <p className="font-bold text-blue-600 mb-1">Restock Recommendation</p>
                 <p className="text-xs font-bold opacity-80 mb-2">Steady Growth: Purple Shampoo</p>
                 <div className="bg-white/80 rounded p-2 text-sm font-semibold border border-blue-500/20 shadow-sm">
                   <p>Stock Required: <span className="text-blue-600">Brass-off Mask Kits</span></p>
                   <p className="text-xs mt-1">Maintain current rate. Order 20 Units.</p>
                 </div>
               </div>
             </div>

             <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-start gap-4 hover:-translate-y-1 transition-transform opacity-60 hover:opacity-100">
               <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">3</div>
               <div>
                 <p className="font-bold text-green-700 mb-1">Optimal Stock Level</p>
                 <p className="text-xs font-bold opacity-80">Keratin Treatment Kits</p>
               </div>
             </div>
          </div>

          <button className="w-full mt-6 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-sm tracking-wider uppercase rounded-xl hover:scale-[1.02] shadow-xl shadow-orange-500/20 transition-all">
            Automate Purchase Orders
          </button>
        </div>

      </div>
    </div>
  );
}
