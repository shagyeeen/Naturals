"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Bot, Send, Sparkles, Wand2, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className="overflow-x-auto my-2 rounded-lg border border-black/5 bg-[#fafafa]">
            <table className="w-full border-collapse text-[10px] md:text-[11px]">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-deep-grape/5 text-deep-grape border-b border-black/5">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-black uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-t border-black/5 text-deep-grape/80 font-bold">
            {children}
          </td>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-deep-grape/[0.02] transition-colors italic">
            {children}
          </tr>
        ),
        h3: ({ children }) => (
          <h3 className="text-[11px] font-black italic tracking-tighter text-deep-grape mt-2 mb-1 uppercase flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5 text-naturals-purple" /> {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-0.5 my-1 text-deep-grape/80">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="font-bold leading-tight">
            {children}
          </li>
        ),
        p: ({ children }) => (
          <p className="leading-tight mb-1 last:mb-0">
            {children}
          </p>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default function NeuralAssistantPage() {
  const { profile, customerProfile, user } = useAuth();
  const userName = profile?.full_name || customerProfile?.full_name || user?.email?.split('@')[0] || "Guest";
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState([
    { role: "bot", text: `Welcome back, ${userName}! I've retrieved your profile and styling details. How can I assist you with your beauty journey today?` }
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
       setMessages(prev => [...prev, { role: "bot", text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment." }]);
    }
  };

  return (
    <div className="flex flex-col space-y-4 h-[calc(100vh-110px)] w-full max-w-4xl mx-auto overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
            <Zap className="w-3 h-3" /> Service 04: Beauty Intelligence
          </div>
          <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
            AI Beauty Assistant
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-[9px] tracking-[0.15em] text-left">Your personalized expert for styling, skincare, and beauty consultations.</p>
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
                  <h2 className="text-xl font-black italic tracking-tighter text-white">Naturals AI Assistant</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2 mt-1">AI Expert Online • Professional Consulting</p>
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
          className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 bg-[#fafafa] scroll-smooth custom-scrollbar"
         >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[95%] sm:max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse items-start' : 'items-start'}`}>
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-deep-grape text-white' : 'bg-naturals-purple text-white'}`}>
                        {msg.role === 'user' ? <Activity className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                     </div>
                    <div className={`p-2.5 md:p-3.5 rounded-[0.8rem] md:rounded-[1rem] shadow-sm text-[11px] md:text-[12px] font-bold leading-snug ${
                      msg.role === 'user' 
                        ? 'bg-deep-grape text-white rounded-tr-none' 
                        : 'bg-white border border-black/5 text-deep-grape rounded-tl-none shadow-md w-full'
                    }`}>
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="flex gap-4 items-center italic text-naturals-purple/40 text-[10px] font-bold uppercase tracking-[0.2em] ml-14">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Assistant is thinking...
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-black/5 flex gap-3 shrink-0">
           <input 
            type="text" 
            placeholder="Ask me anything about beauty, styling, or your next look..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-warm-grey/50 border border-transparent focus:border-naturals-purple focus:bg-white rounded-2xl px-8 py-5 outline-none text-xs font-bold text-deep-grape transition-all shadow-inner" 
           />
           <button type="submit" className="w-14 h-14 rounded-2xl bg-deep-grape text-white flex items-center justify-center shadow-2xl hover:bg-naturals-purple transition-all group shrink-0">
             <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
         </form>
      </div>
    </div>
  );
}
