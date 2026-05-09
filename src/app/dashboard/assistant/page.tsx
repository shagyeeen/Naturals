"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bot, Send, Sparkles, Wand2, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function NeuralAssistantPage() {
  const { profile, customerProfile, user } = useAuth();
  const userName = profile?.full_name || customerProfile?.full_name || user?.email?.split('@')[0] || "Guest";
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState([
    { role: "bot", text: `Welcome back, ${userName}. I've retrieved your profile and AR Styling archive. How can I assist you in your beauty journey today?` }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: "user", text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          customerId: customerProfile?.id,
          messages: messages.concat(userMessage).map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text
          }))
        })
      });

      const data = await response.json();
      setIsTyping(false);
      if (data.text) {
        setMessages(prev => [...prev, { role: "bot", text: data.text }]);
      } else {
        throw new Error(data.error || 'No response from AI');
      }
    } catch (error) {
       setIsTyping(false);
       console.error('Chat Error:', error);
       setMessages(prev => [...prev, { role: "bot", text: "Diagnostic Interface Error: Connection to Neural Core interrupted. Please retry." }]);
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-[calc(100vh-180px)] max-w-6xl mx-auto overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20 shadow-sm">
            <Sparkles className="w-3 h-3" /> Aesthetic AI Discovery
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
            Beauty Intelligence Oasis
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-[10px] tracking-[0.2em] text-left">Curated styling insights • Personalized skincare protocols • Precision beauty analytics</p>
        </div>
      </div>

      {/* Main Chat Interface - Larger Box */}
      <div className="flex-1 min-h-0 flex flex-col bg-white/60 backdrop-blur-3xl overflow-hidden shadow-[0_32px_100px_-20px_rgba(142,62,150,0.1)] border border-white/50 rounded-[3.5rem] relative z-10">
         <div className="bg-gradient-to-r from-deep-grape via-naturals-purple to-lavender p-8 text-white flex items-center justify-between relative shrink-0">
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center p-0.5 shadow-2xl border border-white/30 rotate-3">
                   <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center text-naturals-purple">
                     <Bot className="w-8 h-8" />
                   </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter text-white">Naturals Beauty Concierge</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-2 mt-1">Synchronizing with your Beauty Passport • Secure</p>
                </div>
            </div>
            
            <div className="hidden sm:flex gap-4 relative z-10">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors cursor-pointer">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors cursor-pointer" onClick={() => setMessages([messages[0]])}>
                  <Wand2 className="w-5 h-5" />
               </div>
            </div>
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-naturals-purple/10 blur-[80px] rounded-full pointer-events-none" />
         </div>

         <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-10 space-y-8 bg-transparent scroll-smooth custom-scrollbar"
         >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-6 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse items-start' : 'items-start'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border-2 border-white ${msg.role === 'user' ? 'bg-deep-grape text-white rotate-3' : 'bg-lavender text-naturals-purple -rotate-3'}`}>
                       {msg.role === 'user' ? <Sparkles className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
                    </div>
                    <div className={`p-8 rounded-[2.5rem] shadow-xl text-xs font-bold uppercase tracking-widest leading-loose ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-deep-grape to-black text-white rounded-tr-none' 
                        : 'bg-white/80 backdrop-blur-xl border border-white text-deep-grape rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="flex gap-4 items-center italic text-naturals-purple/60 text-[10px] font-black uppercase tracking-[0.4em] ml-20 bg-white/50 px-6 py-3 rounded-full border border-white">
                      <Sparkles className="w-4 h-4 animate-spin" /> Curating your signature look...
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <form onSubmit={handleSendMessage} className="p-8 bg-white/40 backdrop-blur-2xl border-t border-white/50 flex gap-6 shrink-0 relative z-10">
           <input 
            type="text" 
            placeholder="ASK YOUR BEAUTY CONCIERGE..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white/60 border border-white focus:border-naturals-purple focus:bg-white rounded-3xl px-8 py-5 outline-none text-[11px] font-black tracking-[0.15em] uppercase transition-all shadow-[inset_0_4px_12px_rgba(0,0,0,0.03)]" 
           />
           <button type="submit" className="w-16 h-16 rounded-3xl bg-deep-grape text-white flex items-center justify-center shadow-[0_12px_40px_-10px_rgba(40,11,44,0.4)] hover:bg-naturals-purple hover:scale-105 transition-all group shrink-0">
             <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
         </form>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
         <div className="absolute top-1/4 -left-24 w-96 h-96 bg-naturals-purple/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-lavender/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>
    </div>
  );
}
