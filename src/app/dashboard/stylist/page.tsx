"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, UploadCloud, Beaker, PlayCircle, ShieldAlert, Cpu, Activity } from "lucide-react";

export default function StylistCopilot() {
  const [selectedTab, setSelectedTab] = useState<"copilot" | "analyzer" | "training">("copilot");
  const [hairCondition, setHairCondition] = useState("Level 3 Damage - Chemically Treated/Dry");
  const [targetLook, setTargetLook] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  const handleGenerateRecipe = () => {
    if (!targetLook) {
      alert("System Error: Objective target required for protocol generation.");
      return;
    }
    setIsGenerating(true);
    // Mock AI generation delay
    setTimeout(() => {
      setRecipe({
        step1: { ratio: "1 : 1.5", desc: "30 Vol Developer. Mid-lengths application priority. Do NOT exceed 35-minute operational limit." },
        step2: { formulation: "9.1 (30g) + 9.2 (10g) + 1.5% Vol", desc: "Ash/Pearl reflect synthesis for neutralization of underlying thermal warmth." }
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
          <Cpu className="w-3 h-3" /> Protocol 02: Personnel Proficiency Augmentation
        </div>
        <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
          Operational Protocol Assistant
        </h1>
        <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">High-precision chemical synthesis and real-time operational guidance for standardizing complex procedures.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl w-fit mb-8 bg-warm-grey/50 border border-black/5 shadow-inner">
        <TabButton id="copilot" label="Synthesis Assistant" active={selectedTab} set={setSelectedTab} icon={<Beaker className="w-4 h-4" />} />
        <TabButton id="analyzer" label="Diagnostic Mapping" active={selectedTab} set={setSelectedTab} icon={<UploadCloud className="w-4 h-4" />} />
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
            <div className="glass-card p-10 space-y-8 flex flex-col bg-white border border-black/5 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/30">Protocol Parameters</h2>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Biological Condition State</label>
                  <select 
                    value={hairCondition}
                    onChange={(e) => setHairCondition(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/5 rounded-xl p-4 outline-none focus:border-naturals-purple transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <option>Level 3 Damage - Medial Dehydration</option>
                    <option>Level 5 Damage - Critical Porosity</option>
                    <option>Virgin State - Optimal Integrity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Historical Treatment Index (180D)</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Global Color", "Keratin", "Re-bonding"].map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-lg bg-deep-grape text-white text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all hover:bg-naturals-purple">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Requested Target Calibration</label>
                  <input 
                    type="text" 
                    placeholder="E.G. BALAYAGE ASH BLONDE LEVEL 9" 
                    value={targetLook}
                    onChange={(e) => setTargetLook(e.target.value)}
                    className="w-full bg-[#fafafa] border border-black/5 rounded-xl p-4 outline-none focus:border-naturals-purple transition-all text-xs font-bold uppercase tracking-wider placeholder:text-deep-grape/20" 
                  />
                </div>
              </div>
              
              <button 
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
                className="w-full py-5 rounded-2xl bg-deep-grape text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-naturals-purple transition-all flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                   <span className="flex items-center gap-3 italic">SYNTHESIZING DATA... <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /></span>
                ) : (
                  <>
                    <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" /> GENERATE PROTOCOL
                  </>
                )}
              </button>
            </div>

            {/* AI Output Formulations */}
            <div className="glass-card p-10 relative overflow-hidden flex flex-col bg-white border border-black/5 shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldAlert className="w-32 h-32" />
               </div>
               
               <div className="flex justify-between items-center mb-10 relative z-10 border-b border-black/5 pb-6">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape flex items-center gap-3 italic"><Beaker className="w-5 h-5 text-naturals-purple" /> Verified Synthesis</h3>
                 {recipe && <span className="px-4 py-1.5 bg-green-500 text-white font-black text-[9px] rounded-lg animate-pulse uppercase tracking-widest">VALIDATED</span>}
               </div>
               
               <div className="space-y-8 relative z-10 flex-1">
                 {recipe ? (
                   <>
                    <div className="p-6 rounded-2xl bg-warm-grey/30 border border-black/5 shadow-inner relative overflow-hidden group hover:bg-[#fafafa] transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-naturals-purple opacity-30 group-hover:opacity-100 transition-opacity" />
                      <p className="font-black text-[10px] uppercase tracking-widest mb-3 opacity-40">Phase 01: Pre-Lightening Synthesis</p>
                      <p className="text-4xl font-black italic tracking-tighter text-deep-grape mb-2">
                        {recipe.step1.ratio}
                      </p>
                      <p className="text-[11px] font-bold text-deep-grape/60 uppercase leading-relaxed tracking-wider">{recipe.step1.desc}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-warm-grey/30 border border-black/5 shadow-inner relative overflow-hidden group hover:bg-[#fafafa] transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-naturals-purple opacity-30 group-hover:opacity-100 transition-opacity" />
                      <p className="font-black text-[10px] uppercase tracking-widest mb-3 opacity-40">Phase 02: Strategic Tonal Correction</p>
                      <p className="text-3xl font-black italic tracking-tighter text-naturals-purple mb-2">
                        {recipe.step2.formulation}
                      </p>
                      <p className="text-[11px] font-bold text-deep-grape/60 uppercase leading-relaxed tracking-wider">{recipe.step2.desc}</p>
                    </div>
                   </>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                     <Cpu className="w-20 h-20 mb-6" />
                     <p className="font-black text-[10px] uppercase tracking-[0.3em]">Initialize parameters to generate protocol</p>
                   </div>
                 )}
               </div>

               <div className="mt-10 flex gap-4 relative z-10">
                 <button onClick={() => recipe && alert("Operational Audit Active. Timer synchronized.")} className="flex-1 py-4 bg-warm-grey/50 text-deep-grape font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-deep-grape hover:text-white transition-all disabled:opacity-30 cursor-pointer" disabled={!recipe}>ACTIVATE TIMER</button>
                 <button onClick={() => recipe && alert("Transaction Logged to Client Biometric Vault.")} className="flex-1 py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-naturals-purple/20 hover:scale-[1.05] transition-all disabled:opacity-30 cursor-pointer" disabled={!recipe}>AUDIT LOG</button>
               </div>
            </div>
          </motion.div>
        )}

        {selectedTab === "analyzer" && (
          <motion.div 
            key="analyzer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-20 text-center border border-black/5 bg-white shadow-2xl rounded-[3rem]"
          >
            <div className="w-28 h-28 mx-auto rounded-[2rem] bg-warm-grey/50 flex items-center justify-center mb-10 border-2 border-dashed border-black/10 shadow-inner">
               <UploadCloud className="w-12 h-12 text-naturals-purple" />
            </div>
             <h2 className="text-3xl font-black text-deep-grape mb-4 italic tracking-tighter">High-Fidelity Follicle Diagnostics</h2>
             <p className="text-xs font-bold text-deep-grape/40 mb-10 max-w-lg mx-auto uppercase tracking-widest leading-relaxed">Integrated AI protocols for multi-spectral analysis of structural integrity, hydration variance, and biological porosity indices. Connect authorized hardware to initiate.</p>
             <button className="px-12 py-5 bg-deep-grape text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-naturals-purple transition-all cursor-pointer">
               INITIALIZE CAMERA INTERFACE
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
      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative ${
        isActive 
          ? "text-white" 
          : "text-deep-grape/40 hover:text-deep-grape"
      }`}
    >
      {isActive && (
        <motion.div layoutId="stylist-tab" className="absolute inset-0 rounded-xl bg-deep-grape shadow-2xl" style={{ zIndex: 0 }} />
      )}
      <span className="relative z-10 flex items-center gap-3 italic">{icon} {label}</span>
    </button>
  );
}
