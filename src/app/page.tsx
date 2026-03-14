"use client";

import { motion } from "framer-motion";
import { Sparkles, Activity, ShieldCheck, Target, TrendingUp, Scissors, CheckCircle, Brain, LineChart, MessageSquareHeart } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-deep-grape overflow-x-hidden selection:bg-naturals-purple selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-[-100px] w-96 h-96 bg-naturals-purple/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 left-[-100px] w-96 h-96 bg-lavender/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-naturals-purple/20 text-naturals-purple font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Naturals × StartupTN AI Beauty Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.1]"
          >
            AI-Powered Beauty Ecosystem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naturals-purple to-lavender">
              For the Future of Salon Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-deep-grape/70 max-w-2xl mb-12"
          >
            Solve real-world salon challenges with hyper-personalized beauty insights, predictive trend intelligence, and seamless SOP-driven operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-naturals-purple to-lavender text-white font-bold text-lg shadow-[0_0_20px_rgba(142,62,150,0.4)] hover:shadow-[0_0_30px_rgba(142,62,150,0.6)] transition-all">
              Launch Platform
            </button>
            <button className="px-8 py-4 rounded-full glass-card hover:bg-naturals-purple/5 font-bold text-lg transition-all flex items-center justify-center gap-2">
              Book a Demo <Activity className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 max-w-6xl mx-auto relative z-10"
        >
          <div className="glass-card p-2 md:p-4 rounded-[2rem] border border-naturals-purple/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            <div className="bg-white rounded-[1.5rem] w-full aspect-video overflow-hidden border border-black/5 flex flex-col">
               {/* Mock Header */}
               <div className="h-12 border-b border-black/5 flex items-center px-4 justify-between bg-warm-grey/30">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
                 <div className="flex gap-4 opacity-50 text-xs">
                   <span>Overview</span> <span>Analytics</span> <span>Settings</span>
                 </div>
               </div>
               
               {/* Mock Content */}
               <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                 <div className="col-span-2 space-y-6">
                   <div className="h-32 bg-gradient-to-r from-naturals-purple/10 to-transparent rounded-xl border border-naturals-purple/20 p-4">
                     <p className="font-bold mb-2">Service Quality Score</p>
                     <div className="text-4xl font-black text-naturals-purple">98.4%</div>
                   </div>
                   <div className="h-48 glass-card border-dashed"></div>
                 </div>
                 <div className="space-y-6">
                   <div className="h-24 bg-lavender/10 rounded-xl border border-lavender/30"></div>
                   <div className="h-24 bg-lavender/10 rounded-xl border border-lavender/30"></div>
                   <div className="h-24 bg-lavender/10 rounded-xl border border-lavender/30"></div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* AI Modules Section */}
      <section id="features" className="py-24 bg-warm-grey/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">6 AI-Powered Intelligence Modules</h2>
            <p className="text-deep-grape/60">Built to revolutionize every aspect of salon operations and customer experience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModuleCard 
              icon={<ShieldCheck className="w-8 h-8 text-naturals-purple shrink-0" />}
              title="Standardisation SOP Engine"
              desc="Digital SOPs with AI audits ensuring consistent service quality across all franchise branches."
            />
            <ModuleCard 
              icon={<Brain className="w-8 h-8 text-lavender shrink-0" />}
              title="Staff Skill Assist AI"
              desc="AI Copilot to guide semi-skilled stylists with step-by-step chemical and processing instructions."
            />
            <ModuleCard 
              icon={<Target className="w-8 h-8 text-naturals-purple shrink-0" />}
              title="Digital Beauty Passport"
              desc="Hyper-personalized long-term beauty journey and tracking based on continuous skin & hair diagnosis."
            />
            <ModuleCard 
              icon={<TrendingUp className="w-8 h-8 text-lavender shrink-0" />}
              title="Trend Prediction Intelligence"
              desc="Analyze social media & climate data to recommend trending styling inventory and regional demands."
            />
            <ModuleCard 
              icon={<MessageSquareHeart className="w-8 h-8 text-naturals-purple shrink-0" />}
              title="Immersive Consultations"
              desc="AR Hairstyle Try-On and an AI consultant chatbot for 24/7 personalized customer interaction."
            />
            <ModuleCard 
              icon={<LineChart className="w-8 h-8 text-lavender shrink-0" />}
              title="Salon Data Intelligence"
              desc="Deep franchise analytics to track revenue predictability, staff efficiency, and predict customer churn."
            />
          </div>
        </div>
      </section>

      {/* Deep Dive Feature - Beauty Passport */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 text-naturals-purple text-sm font-semibold">
               <Target className="w-4 h-4" /> Beauty Passport
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">A Hyper-Personalized Beauty Journey for Every Customer</h2>
            <ul className="space-y-4 mb-8">
              {[
                "Continuously evolving digital skin & hair records",
                "Advanced AI visual diagnosis detecting damage and risks",
                "Long-term personalized treatment roadmaps",
                "Lifestyle and regional climate impact analysis"
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-naturals-purple shrink-0" />
                  <span className="text-lg text-deep-grape/80">{item}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-naturals-purple font-bold hover:gap-4 transition-all">
              Explore Passport Features <Activity className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-naturals-purple/20 to-lavender/20 blur-3xl rounded-full" />
            <div className="glass-card p-6 relative z-10 aspect-[4/5] flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-naturals-purple to-lavender p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xl">SM</div>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Subhash M</h3>
                  <p className="text-sm opacity-60">Status: Gold Member | LTV: High</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-warm-grey/50 border border-naturals-purple/10">
                  <p className="text-sm font-semibold mb-1">Current Hair Health Score</p>
                  <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[78%]" />
                  </div>
                  <p className="text-xs text-right mt-1 font-mono">78 / 100</p>
                </div>

                <div className="p-4 rounded-xl bg-warm-grey/50 border border-naturals-purple/10">
                  <p className="text-sm font-semibold mb-2">AI Diagnosis - Root Issue</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 text-xs rounded-md bg-red-500/10 text-red-500 font-medium">Split Ends Focus</span>
                    <span className="px-2 py-1 text-xs rounded-md bg-naturals-purple/10 text-naturals-purple font-medium">Moisture Depleted</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-naturals-purple/10 to-lavender/10 border border-naturals-purple/30">
                  <p className="text-sm font-semibold mb-1 flex justify-between">
                    <span>Next Treatment Plan</span>
                    <span className="text-naturals-purple">Month 2</span>
                  </p>
                  <p className="text-xs opacity-80">Keratin Infusion + Deep Conditioning Therapy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#120915] to-[#2F0137] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Ready to Experience Salon Intelligence?</h2>
          <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto">
            Join the elite network of intelligent salons. Transform customer satisfaction and skyrocket business predictability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-full bg-white text-deep-grape font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition-all">
              Log in to Dashboard
            </button>
            <button className="px-8 py-4 rounded-full border border-white/30 backdrop-blur-md hover:bg-white/10 font-bold text-lg transition-all">
              Request Franchise Access
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function ModuleCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 bg-white">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warm-grey to-white border border-naturals-purple/10 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-deep-grape/70 flex-1 leading-relaxed">{desc}</p>
    </div>
  );
}
