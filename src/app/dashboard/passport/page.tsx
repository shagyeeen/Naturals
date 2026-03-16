"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Activity, Calendar, Award, Droplets, Sun, Sparkles, Map as MapIcon, Leaf, Search, ShieldCheck } from "lucide-react";

export default function BeautyPassport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Accessing Encrypted Database for: ${searchQuery}`);
    }
  };

  const handleScanFace = () => {
    setIsScanning(true);
    setTimeout(() => {
      alert("Biometric Authentication Successful. Subject: Aaradhya V. • Access Granted.");
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <ShieldCheck className="w-3 h-3" /> Protocol 03: Biometric Audit Vault
          </div>
          <h1 className="text-3xl font-black text-deep-grape mb-2 italic tracking-tighter">Unified Client Biometrics</h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">High-fidelity diagnostic archival and long-term biological trend mapping.</p>
        </div>
        
        <div className="flex gap-4">
           <form onSubmit={handleSearch} className="flex items-center bg-warm-grey/50 border border-black/5 px-4 py-2 rounded-xl focus-within:bg-white transition-all shadow-inner">
             <Search className="w-4 h-4 text-deep-grape/30" />
             <input 
              type="text" 
              placeholder="CLIENT_ID / MOBILE_LINK" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest px-3 w-48 text-deep-grape placeholder:text-deep-grape/30" 
             />
           </form>
           <button 
            onClick={handleScanFace}
            disabled={isScanning}
            className="px-8 py-3 bg-deep-grape text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-naturals-purple transition-all disabled:opacity-50 cursor-pointer"
           >
             {isScanning ? "SYNCHRONIZING..." : "INITIALIZE SCAN"}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Identity */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden border border-black/5 bg-white">
             <div className="absolute top-0 right-0 left-0 h-32 bg-warm-grey" />
             <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-2xl relative z-10 overflow-hidden bg-white mt-12 mb-6 transform rotate-3">
               <img src="https://i.pravatar.cc/300" alt="Subject Profile" className="w-full h-full object-cover" />
             </div>
             <h2 className="text-2xl font-black text-deep-grape italic tracking-tighter">Aaradhya V.</h2>
             <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.3em] mb-10 flex gap-2 items-center justify-center">
               <Award className="w-4 h-4" /> Priority Tier 01
             </p>
             
             <div className="grid grid-cols-2 gap-4 w-full">
               <div className="p-4 bg-warm-grey/30 rounded-2xl border border-black/5">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Operational Visits</p>
                 <p className="text-xl font-black italic text-deep-grape">14</p>
               </div>
               <div className="p-4 bg-warm-grey/30 rounded-2xl border border-black/5">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Avg Resource Value</p>
                 <p className="text-xl font-black italic text-deep-grape">₹3,450</p>
               </div>
             </div>
          </div>

          <div className="glass-card p-10 border border-black/5 bg-white">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/30 mb-8 flex items-center gap-3"><MapIcon className="w-4 h-4 opacity-50" /> Environment Calibration</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Sun className="w-4 h-4" /> Climate Exposure</span>
                <span className="text-[10px] font-black text-orange-600 uppercase">Critical Humidity</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Droplets className="w-4 h-4" /> Resource Quality</span>
                <span className="text-[10px] font-black text-red-500 uppercase">Hard Water (Node: MAA)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Leaf className="w-4 h-4" /> Behavioral Activity</span>
                <span className="text-[10px] font-black text-green-600 uppercase">High Frequency Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Container: Diagnostics & Journey */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          {/* AI Diagnosis Scores */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass-card p-8 relative overflow-hidden group bg-white border border-black/5 shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-32 bg-naturals-purple/5 rounded-full blur-[40px]" />
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape flex gap-3 items-center"><Activity className="w-5 h-5 text-naturals-purple" /> Follicle Analysis</h3>
                 <span className="px-4 py-1.5 bg-green-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg">CALIBRATED 78/100</span>
               </div>
               
               <div className="space-y-6 relative z-10">
                 <DiagnosticMetric label="Density Index" value="Optimal" percent={60} color="bg-naturals-purple" />
                 <DiagnosticMetric label="Damage Mapping" value="Level 2 / Medial" percent={45} color="bg-orange-500" />
                 <DiagnosticMetric label="Scalp Integrity" value="High Lipid Stability" percent={85} color="bg-green-500" />
               </div>
             </div>

             <div className="glass-card p-8 relative overflow-hidden group bg-white border border-black/5 shadow-sm">
               <div className="absolute top-0 right-0 w-32 h-32 bg-deep-grape/5 rounded-full blur-[40px]" />
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape flex gap-3 items-center"><Activity className="w-5 h-5 text-deep-grape" /> Dermal Analysis</h3>
                 <span className="px-4 py-1.5 bg-yellow-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg">MONITORING 62/100</span>
               </div>
               
               <div className="space-y-6 relative z-10">
                 <DiagnosticMetric label="Hydration Rating" value="Critical Deficiency" percent={30} color="bg-red-500" />
                 <DiagnosticMetric label="Pigment Stability" value="Minimal UV Shift" percent={80} color="bg-green-500" />
                 <DiagnosticMetric label="Surface Texture" value="Irregular T-Zone" percent={50} color="bg-yellow-500" />
               </div>
             </div>
          </div>

          {/* Predictive Journey */}
          <div className="glass-card p-10 border border-black/5 bg-white">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-deep-grape/30 mb-10 italic">Predictive Protocol Path</h3>
            
            <div className="relative border-l-4 border-naturals-purple/10 ml-6 space-y-12 pl-12 pt-4 pb-4">
              
              <JourneyPhase 
                title="Phase 01: Structural Restoration" 
                desc="Autonomous correction of molecular bonds based on hard-water sediment mapping."
                salon="Bond Multiplier Therapy (L3)"
                home="Ion-Balanced Hydration Suite"
                color="naturals-purple"
                active
              />

              <JourneyPhase 
                title="Phase 02: Humidity Mitigation" 
                desc="Proactive atmospheric shielding based on predicted regional climate spikes."
                salon="Surface Tension Re-alignment"
                home="Thermal Humidity Barrier"
                color="deep-grape"
              />
              
              <JourneyPhase 
                title="Phase 03: Dermal Flux Calibration" 
                desc="Stabilizing pH levels following high-intensity humidity exposure."
                salon="Dermal Infusion Protocol"
                home="Phase-Shift Serum Suite"
                color="warm-grey"
                opacity="opacity-50"
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function DiagnosticMetric({ label, value, percent, color }: { label: string, value: string, percent: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">{label}</span>
        <span className="text-[10px] font-black text-deep-grape italic">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-warm-grey rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`} 
        />
      </div>
    </div>
  );
}

function JourneyPhase({ title, desc, salon, home, color, active = false, opacity = "" }: { title: string, desc: string, salon: string, home: string, color: string, active?: boolean, opacity?: string }) {
  return (
    <div className={`relative ${opacity}`}>
      <div className={`absolute w-8 h-8 rounded-xl ${active ? 'bg-naturals-purple shadow-xl shadow-naturals-purple/20' : 'bg-warm-grey'} border-4 border-white -left-[60px] top-0 flex items-center justify-center`}>
        {active && <Sparkles className="w-4 h-4 text-white" />}
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-black text-lg text-deep-grape italic tracking-tighter mb-1">{title}</h4>
          <p className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-widest max-w-lg leading-relaxed">{desc}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
           <div className={`p-4 rounded-2xl border ${active ? 'bg-naturals-purple/5 border-naturals-purple/20' : 'bg-[#fafafa] border-black/5'} transition-all`}>
             <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Assigned Service</p>
             <p className="text-[10px] font-black text-deep-grape uppercase tracking-wider">{salon}</p>
           </div>
           {home && (
             <div className={`p-4 rounded-2xl border ${active ? 'bg-lavender/5 border-lavender/20' : 'bg-[#fafafa] border-black/5'} transition-all`}>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Prescribed Regimen</p>
               <p className="text-[10px] font-black text-deep-grape uppercase tracking-wider">{home}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
