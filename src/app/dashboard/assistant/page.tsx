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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
            <Zap className="w-3 h-3" /> Protocol 01: Core Intelligence
          </div>
          <h1 className="text-2xl font-black text-deep-grape mb-1 flex items-center gap-3 italic tracking-tighter">
            Neural Command Center
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-[9px] tracking-[0.15em] text-left">Advanced agentic beauty intelligence. Personalized styling, skincare, and operational consulting.</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 px-8 py-4 bg-white rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest">Neural Link State</span>
              <span className="text-[11px] font-black text-green-500 flex items-center gap-2">ACTIVE <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /></span>
           </div>
           <div className="w-px h-8 bg-black/5" />
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest">Assigned Agent</span>
              <span className="text-[11px] font-black text-naturals-purple italic font-black">NAT_L3_ASSISTANT</span>
           </div>
        </div>
      </div>

      {/* Main Chat Interface - Larger Box */}
      <div className="flex-1 min-h-0 flex flex-col bg-white glass-card overflow-hidden shadow-2xl border border-black/5 rounded-[2.5rem]">
         <div className="bg-deep-grape p-5 text-white flex items-center justify-between relative shrink-0">
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xl transform rotate-3">
                   <div className="w-full h-full rounded-lg bg-naturals-purple flex items-center justify-center text-white">
                     <Bot className="w-6 h-6" />
                   </div>
                </div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter text-white">AI Neural Assistant</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 mt-1">Terminal Active • Encryption Level 04</p>
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
          className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa] scroll-smooth"
         >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-6 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse items-start' : 'items-start'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-deep-grape text-white' : 'bg-naturals-purple text-white'}`}>
                       {msg.role === 'user' ? <Activity className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                    </div>
                    <div className={`p-6 rounded-[2rem] shadow-sm text-sm font-bold uppercase tracking-widest leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-deep-grape text-white rounded-tr-none' 
                        : 'bg-white border border-black/5 text-deep-grape rounded-tl-none shadow-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="flex gap-4 items-center italic text-naturals-purple/40 text-[9px] font-black uppercase tracking-[0.4em] ml-14">
                      <Sparkles className="w-3 h-3 animate-spin" /> Neural core processing...
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-black/5 flex gap-4 shrink-0">
           <input 
            type="text" 
            placeholder="INPUT DEEP ANALYTIC QUERY..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-warm-grey/50 border border-transparent focus:border-naturals-purple focus:bg-white rounded-2xl px-6 py-4 outline-none text-[10px] font-black tracking-[0.1em] uppercase transition-all shadow-inner" 
           />
           <button type="submit" className="w-14 h-14 rounded-2xl bg-deep-grape text-white flex items-center justify-center shadow-2xl hover:bg-naturals-purple transition-all group shrink-0">
             <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
         </form>
      </div>
    </div>
  );
}
