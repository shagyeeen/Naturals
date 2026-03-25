"use client";

import { motion } from "framer-motion";
import { Activity, Camera } from "lucide-react";
import ThreeDHairTryOn from "@/components/VirtualHairTryOn/ThreeDHairTryOn";

export default function AIConsultation() {
  return (
    <div className="flex flex-col space-y-6 h-[calc(100vh-180px)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
          <Activity className="w-3 h-3" /> Step 1: Visual Style Check
        </div>
        <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
          Visual Style Analysis & Try-On
        </h1>
        <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">Scan your features for precise hair style matches and virtual color simulations.</p>
      </div>

      <div className="flex-1 w-full relative min-h-0 flex flex-col">
        {/* AR Try-On Panel - Now Default & Only Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full h-full glass-card overflow-hidden shadow-2xl border border-black/5 bg-white rounded-[2.5rem]"
        >
          <div className="absolute top-0 left-0 p-8 z-10 pointer-events-none">
             <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-black/5 shadow-sm">
                <Camera className="w-4 h-4 text-naturals-purple" />
                <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape">Calibration Active</span>
             </div>
          </div>
          <ThreeDHairTryOn />
        </motion.div>
      </div>
    </div>
  );
}
