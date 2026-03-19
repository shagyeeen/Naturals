"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, MessageSquareHeart, Camera, CalendarClock, Bot, Send, Search, Sparkles, ShieldCheck, Cpu } from "lucide-react";
import ARHairTryOn from "@/components/VirtualHairTryOn/ARHairTryOn";

export default function AIConsultation() {
  const [activeTab, setActiveTab] = useState<"ar" | "chat" | "booking">("ar");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Neural Interface Synchronized. I am processing your AR Styling Archive. You are eligible for a new AR Hair Colouring session. Shall we explore a new Hair Cutted simulation?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#C59ACD");
  const [selectedStyle, setSelectedStyle] = useState("Long Waves");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessages = [...messages, { role: "user", text: inputText }];
    setMessages(newMessages);
    setInputText("");

    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: "Analysis complete. Based on regional humidity variance and your recent hard-water exposure, I recommend a secondary Chlorine-Detox protocol. Accessing available procurement slots..." }]);
    }, 1000);
  };

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
          <Activity className="w-3 h-3" /> Protocol 05: Visual Intelligence
        </div>
        <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
          Diagnostic Interface & AR Calibration
        </h1>
        <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">Multi-spectral visual diagnostics for precise service alignment and predictive demand mapping.</p>
      </div>

      <div className="flex gap-2 p-1.5 rounded-2xl w-fit mb-4 bg-warm-grey/50 border border-black/5 shadow-inner">
        <TabButton id="ar" label="AR Calibration" active={activeTab} set={setActiveTab} icon={<Camera className="w-4 h-4" />} />
        <TabButton id="chat" label="Neural Assistant" active={activeTab} set={setActiveTab} icon={<Bot className="w-4 h-4" />} />
        <TabButton id="booking" label="Operational Scheduler" active={activeTab} set={setActiveTab} icon={<CalendarClock className="w-4 h-4" />} />
      </div>

      <div className="flex-1 w-full relative">
        {/* AR Try-On Panel */}
        {activeTab === "ar" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} 
            className="w-full h-full"
          >
            <ARHairTryOn />
          </motion.div>
        )}

        {/* AI Chatbot Module */}
        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto h-full glass-card overflow-hidden flex flex-col shadow-2xl border border-black/5 bg-white">
             <div className="bg-deep-grape p-8 text-white flex items-center gap-6 relative">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center p-1 shadow-2xl transform rotate-3">
                   <div className="w-full h-full rounded-xl bg-naturals-purple flex items-center justify-center text-white">
                     <Bot className="w-8 h-8" />
                   </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter">Neural Interaction Interface</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> Terminal Active • Encryption Level 04</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-naturals-purple/10 blur-[60px] rounded-full pointer-events-none" />
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#fafafa]">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-6 max-w-[70%] ${msg.role === 'user' ? 'ml-auto justify-end flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-deep-grape text-white' : 'bg-naturals-purple text-white'}`}>
                       {msg.role === 'user' ? <Activity className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                    </div>
                    <div className={`p-6 rounded-[2rem] shadow-xl text-xs font-bold uppercase tracking-widest leading-relaxed ${msg.role === 'user' ? 'bg-deep-grape text-white rounded-tr-none' : 'bg-white border border-black/5 text-deep-grape rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
             </div>

             <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-black/5 flex gap-4">
               <input 
                type="text" 
                placeholder="INPUT DIAGNOSTIC QUERY..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-warm-grey/50 border border-transparent focus:border-naturals-purple focus:bg-white rounded-2xl px-6 py-4 outline-none text-[10px] font-black tracking-widest uppercase transition-all" 
               />
               <button type="submit" className="w-16 h-16 rounded-2xl bg-deep-grape text-white flex items-center justify-center shadow-2xl hover:bg-naturals-purple transition-all">
                 <Send className="w-6 h-6" />
               </button>
             </form>
          </motion.div>
        )}

        {/* Smart Booking System */}
        {activeTab === "booking" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full glass-card p-12 flex flex-col items-center justify-center text-center max-w-4xl mx-auto bg-white border border-black/5 shadow-2xl rounded-[3rem]">
             <div className="w-24 h-24 bg-warm-grey rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-black/5">
                <CalendarClock className="w-12 h-12 text-naturals-purple" />
             </div>
             <h2 className="text-4xl font-black text-deep-grape mb-6 italic tracking-tighter">Autonomous Bandwidth Scheduler</h2>
             <p className="text-xs font-bold text-deep-grape/40 mb-12 max-w-lg mx-auto uppercase tracking-widest leading-relaxed">
               Analyzing historical throughput metrics, required personnel authority levels, and precise procedural duration to synchronize optimal operational windows.
             </p>

             <div className="w-full p-10 rounded-[2.5rem] bg-deep-grape text-white relative shadow-2xl overflow-hidden text-left border-4 border-white/5">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                 <ShieldCheck className="w-32 h-32" />
               </div>
               <div className="flex items-center gap-3 text-naturals-purple font-black text-[10px] uppercase tracking-[0.4em] mb-8 relative z-10">
                 <Sparkles className="w-4 h-4" /> Optimization Engine Active
               </div>
               <div className="grid sm:grid-cols-3 gap-10 relative z-10">
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Service Intensity</p>
                   <p className="font-black text-xl italic tracking-tighter text-naturals-purple uppercase">Molecular Repair</p>
                   <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">Duration: 150m (SOP L3)</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Authority Level</p>
                   <p className="font-black text-xl italic tracking-tighter text-white uppercase">COMMANDER (L3)</p>
                   <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">Bandwidth: RESTRICTED</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Target Optimized Slot</p>
                   <p className="font-black text-xl italic tracking-tighter text-green-400 uppercase">SUN_MAR_24 • 11:30</p>
                   <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">Status: PEAK EFFICIENCY</p>
                 </div>
               </div>
               <button onClick={() => alert("Deployment scheduled. Personnel notified.")} className="w-full mt-12 py-5 bg-white text-deep-grape font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:bg-naturals-purple hover:text-white transition-all cursor-pointer relative z-10">
                 CONFIRM DEPLOYMENT
               </button>
             </div>
          </motion.div>
        )}

      </div>
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
        <motion.div layoutId="consult-tab" className="absolute inset-0 rounded-xl bg-deep-grape shadow-2xl" style={{ zIndex: 0 }} />
      )}
      <span className="relative z-10 flex items-center gap-3 italic">{icon} {label}</span>
    </button>
  );
}
