"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, UploadCloud, Beaker, PlayCircle, ShieldAlert, Cpu } from "lucide-react";

export default function StylistCopilot() {
  const [selectedTab, setSelectedTab] = useState<"copilot" | "analyzer" | "training">("copilot");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender/10 text-lavender text-xs font-bold mb-2 border border-lavender/20">
          <Cpu className="w-3 h-3" /> Module 2: Staff Skill Assist AI
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-naturals-purple to-lavender mb-2 flex items-center gap-3">
          AI Stylist Copilot <Sparkles className="w-6 h-6 text-naturals-purple" />
        </h1>
        <p className="text-deep-grape/60">Real-time guidance and complex chemical formulation for semi-skilled stylists.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="glass flex gap-2 p-1.5 rounded-2xl w-fit mb-8 bg-warm-grey/50 shadow-md border border-naturals-purple/10">
        <TabButton id="copilot" label="AI Formulation Copilot" active={selectedTab} set={setSelectedTab} icon={<Beaker className="w-4 h-4" />} />
        <TabButton id="analyzer" label="Visual Hair Analyzer" active={selectedTab} set={setSelectedTab} icon={<UploadCloud className="w-4 h-4" />} />
        <TabButton id="training" label="Training Academy" active={selectedTab} set={setSelectedTab} icon={<PlayCircle className="w-4 h-4" />} />
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {selectedTab === "copilot" && (
          <motion.div 
            key="copilot"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Input Form */}
            <div className="glass-card p-6 space-y-6 flex flex-col">
              <h2 className="text-xl font-bold mb-2">Service Formulation</h2>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold opacity-80 mb-2">Current Hair Condition</label>
                  <select className="w-full bg-white border border-warm-grey rounded-xl p-3 outline-none focus:border-naturals-purple transition-all text-sm">
                    <option>Level 3 Damage - Chemically Treated/Dry</option>
                    <option>Level 5 Damage - Bleached/Brittle</option>
                    <option>Virgin Hair - Healthy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-80 mb-2">Previous Treatments (Last 6 Months)</label>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-naturals-purple text-white text-xs font-bold cursor-pointer transition-transform hover:scale-105">Global Color</span>
                    <span className="px-3 py-1.5 rounded-lg bg-warm-grey text-xs font-bold cursor-pointer transition-transform hover:scale-105">Keratin</span>
                    <span className="px-3 py-1.5 rounded-lg bg-warm-grey text-xs font-bold cursor-pointer transition-transform hover:scale-105">Re-bonding</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-80 mb-2">Desired Target Look / Color Level</label>
                  <input type="text" placeholder="e.g. Balayage Ash Blonde Level 9" className="w-full bg-white border border-warm-grey rounded-xl p-3 outline-none focus:border-naturals-purple transition-all text-sm" />
                </div>
              </div>
              
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-naturals-purple to-lavender text-white font-bold text-lg shadow-lg shadow-naturals-purple/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Generate AI Recipe
              </button>
            </div>

            {/* AI Output Formulations */}
            <div className="glass-card p-6 relative overflow-hidden flex flex-col bg-gradient-to-b from-naturals-purple/5 to-transparent">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldAlert className="w-32 h-32" />
               </div>
               
               <div className="flex justify-between items-center mb-6 relative z-10 border-b border-naturals-purple/20 pb-4">
                 <h3 className="font-bold text-lg flex items-center gap-2"><Beaker className="w-5 h-5 text-naturals-purple" /> AI Suggested Formulation</h3>
                 <span className="px-3 py-1 bg-green-500/10 text-green-600 font-bold rounded-full text-xs animate-pulse ring-1 ring-green-500">Live Prediction</span>
               </div>
               
               <div className="space-y-6 relative z-10 flex-1">
                 
                 <div className="p-4 rounded-xl bg-white/50 border border-black/5 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                   <p className="font-bold mb-2 text-sm">Step 1: Bleach Ratio (Pre-lightening)</p>
                   <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-1">
                     1 : 1.5
                   </p>
                   <p className="text-sm font-semibold opacity-70">30 Vol Developer. Apply mid-lengths first. Do NOT exceed 35 mins processing due to Level 3 damage.</p>
                 </div>

                 <div className="p-4 rounded-xl bg-white/50 border border-black/5 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-naturals-purple" />
                   <p className="font-bold mb-2 text-sm">Step 2: Toner Formulation</p>
                   <p className="text-2xl font-black text-naturals-purple mb-1">
                     9.1 (30g) + 9.2 (10g) + 1.5% Vol
                   </p>
                   <p className="text-sm font-semibold opacity-70">Ash and Pearl reflect to neutralize underlying warmth. 15 mins visual check.</p>
                 </div>
               </div>

               <div className="mt-6 flex gap-3 relative z-10">
                 <button className="flex-1 py-3 bg-naturals-purple/10 text-naturals-purple font-bold rounded-xl hover:bg-naturals-purple hover:text-white transition-colors">Start SOP Timer</button>
                 <button className="flex-1 py-3 bg-warm-grey font-bold rounded-xl hover:bg-black/10 transition-colors border border-black/5">Log to Passport</button>
               </div>
            </div>
          </motion.div>
        )}

        {selectedTab === "analyzer" && (
          <motion.div 
            key="analyzer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-lavender/20 flex items-center justify-center mb-6 border-2 border-dashed border-lavender">
               <UploadCloud className="w-10 h-10 text-naturals-purple" />
            </div>
             <h2 className="text-2xl font-bold mb-2">Upload Customer Hair Image</h2>
             <p className="opacity-60 mb-6 max-w-md mx-auto">AI detects damage level, split ends, dryness, and visual porosity. Use the Salon iPad for real-time capture.</p>
             <button className="px-8 py-3 bg-white rounded-xl font-bold border border-naturals-purple shadow-sm hover:shadow-naturals-purple/20 transition-all text-naturals-purple">
               Open iPad Camera
             </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function TabButton({ id, label, icon, active, set }: { id: any, label: string, icon: React.ReactNode, active: string, set: any }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
        isActive 
          ? "text-white" 
          : "text-deep-grape/60 hover:text-naturals-purple"
      }`}
    >
      {isActive && (
        <motion.div layoutId="stylist-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-naturals-purple to-lavender shadow-[0_4px_12px_rgba(142,62,150,0.3)]" style={{ zIndex: 0 }} />
      )}
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
    </button>
  );
}
