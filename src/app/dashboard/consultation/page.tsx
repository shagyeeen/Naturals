"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquareHeart, Camera, CalendarClock, Bot, Send, Search } from "lucide-react";

export default function AIConsultation() {
  const [activeTab, setActiveTab] = useState<"ar" | "chat" | "booking">("ar");

  return (
    <div className="space-y-8 h-[calc(100vh-140px)] flex flex-col">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold mb-2 border border-indigo-500/20">
          <MessageSquareHeart className="w-3 h-3" /> Module 5: Customer Experience
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-2 flex items-center gap-3">
          AI Consultation & AR Mirror
        </h1>
        <p className="text-deep-grape/60">Immersive customer tools for hairstyle try-on, automated beauty tips, and predictive booking.</p>
      </div>

      <div className="glass flex gap-2 p-1.5 rounded-2xl w-fit mb-4 bg-warm-grey/50 shadow-md border border-indigo-500/10">
        <TabButton id="ar" label="AR Smart Mirror" active={activeTab} set={setActiveTab} icon={<Camera className="w-4 h-4" />} />
        <TabButton id="chat" label="AI Beauty Bot" active={activeTab} set={setActiveTab} icon={<Bot className="w-4 h-4" />} />
        <TabButton id="booking" label="Smart Booking" active={activeTab} set={setActiveTab} icon={<CalendarClock className="w-4 h-4" />} />
      </div>

      <div className="flex-1 w-full relative">
        {/* AR Try-On Panel */}
        {activeTab === "ar" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="w-full h-full glass-card p-6 grid md:grid-cols-3 gap-6 relative overflow-hidden"
          >
            {/* The "Mirror" View */}
            <div className="md:col-span-2 relative rounded-3xl bg-black overflow-hidden flex flex-col justify-end shadow-2xl border border-black/10 group">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80" alt="Customer Camera" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

               {/* Virtual Bounding Box - Mockup */}
               <div className="absolute inset-x-32 inset-y-16 border-2 border-dashed border-indigo-500/50 rounded-[4rem] flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                 <div className="absolute top-0 w-8 h-1 bg-indigo-500 shadow-[0_0_10px_indigo]"></div>
               </div>

               <div className="relative z-10 p-6 flex justify-between items-end">
                 <div>
                   <p className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Camera
                   </p>
                   <p className="text-indigo-300 font-semibold text-sm">Applying: Honey Blonde Balayage Filter</p>
                 </div>
                 <button className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer overflow-hidden relative">
                   <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full animate-ping opacity-50"></div>
                   <Camera className="w-6 h-6 z-10" />
                 </button>
               </div>
            </div>

            {/* Controls Palette */}
            <div className="space-y-6 flex flex-col">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <Sparkles className="text-indigo-500" /> Virtual Try-On
              </h2>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-3">Trending Hair Colors</p>
                  <div className="grid grid-cols-4 gap-3">
                    {['#C59ACD', '#8E3E96', '#FFD700', '#CD7F32', '#8B4513', '#4A0E4E', '#FFB6C1', '#000000'].map((color, i) => (
                      <button key={i} className="w-full aspect-square rounded-full border-2 border-transparent hover:border-indigo-500 transition-all shadow-sm transform hover:scale-110" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5">
                  <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-3">Haircuts & Styles</p>
                  <div className="space-y-2">
                    {['Layered Bob', 'Curtain Bangs', 'Long Waves', 'Pixie Cut'].map((style, i) => (
                      <button key={style} className={`w-full py-3 px-4 rounded-xl font-bold flex justify-between items-center transition-colors border shadow-sm ${i === 2 ? 'bg-indigo-500 text-white border-transparent' : 'bg-white/50 text-deep-grape border-black/5 hover:border-indigo-500'}`}>
                        {style} <span className="opacity-60">{i === 2 ? 'Previewing' : 'Apply'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full py-4 text-center bg-naturals-purple text-white font-bold text-sm tracking-widest uppercase rounded-xl hover:shadow-lg transition-shadow mt-auto">
                Save to Passport
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Chatbot Module */}
        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto h-full glass-card overflow-hidden flex flex-col shadow-2xl">
             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white flex items-center gap-4 relative">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-md">
                   <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                     <Bot className="w-6 h-6" />
                   </div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Naturals AI Beauty Assistant</h2>
                  <p className="text-xs font-semibold opacity-80 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online • Specialized in Skincare & Haircare</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full pointer-events-none" />
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-warm-grey/30">
                <div className="flex gap-4 max-w-[80%]">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white"><Bot className="w-4 h-4" /></div>
                   <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 text-sm">
                     Hello Subhash! I see from your Beauty Passport that you're due for a Hair Spa next week. Are you still experiencing that dry scalp issue?
                   </div>
                </div>
                
                <div className="flex gap-4 max-w-[80%] ml-auto justify-end">
                   <div className="bg-naturals-purple p-4 rounded-2xl rounded-tr-sm shadow-sm text-white text-sm">
                     Yes slightly, especially after swimming. What do you recommend?
                   </div>
                </div>

                <div className="flex gap-4 max-w-[80%]">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center text-white"><Bot className="w-4 h-4" /></div>
                   <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 text-sm">
                     <p className="mb-2">Chlorine can strip natural oils fast. I recommend adding our <strong>Deep Hydration Scalp Serum</strong> to your post-swim routine.</p>
                     <p className="mb-2">Would you like me to book a specialized Chlorine-Detox Spa instead of the regular one for your upcoming visit? It takes the same time (45 mins).</p>
                     <div className="flex gap-2 mt-3">
                       <button className="px-4 py-2 bg-indigo-500/10 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-500 hover:text-white transition-colors border border-indigo-500/20">Yes, update my booking!</button>
                       <button className="px-4 py-2 bg-warm-grey font-bold text-xs rounded-lg hover:bg-black/10 transition-colors">No, keep regular Spa</button>
                     </div>
                   </div>
                </div>
             </div>

             <div className="p-4 bg-white border-t border-black/5 flex gap-2">
               <input type="text" placeholder="Type your hair or skin query..." className="flex-1 bg-warm-grey border border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-sm" />
               <button className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:shadow-indigo-500/40 transition-shadow">
                 <Send className="w-5 h-5 ml-1" />
               </button>
             </div>
          </motion.div>
        )}

        {/* Smart Booking System */}
        {activeTab === "booking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full glass-card p-8 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
             <CalendarClock className="w-20 h-20 text-naturals-purple mb-6" />
             <h2 className="text-3xl font-bold mb-4">AI Smart Appointment Scheduling</h2>
             <p className="text-lg opacity-70 mb-8 max-w-md mx-auto">
               The engine analyzes historical crowd data, required stylist skill level, and exact service duration (via SOPs) to predict the perfect time slot for the customer.
             </p>

             <div className="w-full glass p-6 rounded-2xl border border-naturals-purple/20 text-left bg-gradient-to-br from-naturals-purple/5 to-transparent relative">
               <span className="absolute -top-3 left-6 px-3 py-1 bg-naturals-purple text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-md">Prediction Engine</span>
               <div className="grid sm:grid-cols-3 gap-6">
                 <div>
                   <p className="text-sm font-bold opacity-60 uppercase mb-1">Service Demand</p>
                   <p className="font-black text-lg text-orange-500">Keratin Smoothing</p>
                   <p className="text-xs font-semibold opacity-60">Est. Duration: 150 mins</p>
                 </div>
                 <div>
                   <p className="text-sm font-bold opacity-60 uppercase mb-1">Required Stylist</p>
                   <p className="font-black text-lg text-blue-500">L3 Master</p>
                   <p className="text-xs font-semibold opacity-60">Availability: Low (Weekend)</p>
                 </div>
                 <div>
                   <p className="text-sm font-bold opacity-60 uppercase mb-1">Optimal Slot Found</p>
                   <p className="font-black text-lg text-green-500">Sunday, 11:30 AM</p>
                   <p className="text-xs font-semibold opacity-60 mb-2">Crowd Predictor: Moderate</p>
                 </div>
               </div>
               <button className="w-full mt-6 py-4 bg-naturals-purple text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-transform">
                 Confirm Booking & Notify Stylist
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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
        isActive 
          ? "text-white" 
          : "text-deep-grape/60 hover:text-indigo-500"
      }`}
    >
      {isActive && (
        <motion.div layoutId="consult-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md" style={{ zIndex: 0 }} />
      )}
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
    </button>
  );
}
