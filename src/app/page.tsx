"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Scissors, 
  CheckCircle, 
  Brain, 
  LineChart, 
  MessageSquareHeart,
  ChevronRight,
  Info,
  Calendar,
  Lock,
  Globe,
  Award,
  Book,
  Users,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-deep-grape overflow-x-hidden selection:bg-naturals-purple selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-[#fafafa]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-naturals-purple/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lavender/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-black/5 mb-8 shadow-sm text-deep-grape font-bold text-xs uppercase tracking-widest"
          >
            <div className="relative w-4 h-4">
              <Image src="/naturalslogo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span>Naturals × StartupTN AI Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 max-w-5xl leading-[1.05] text-deep-grape italic"
          >
            The Next Era of <br />
            <span className="text-naturals-purple not-italic">Salon Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-deep-grape/70 max-w-3xl mb-14 leading-relaxed"
          >
            Transforming salon operations through hyper-personalized beauty insights, 
            autonomous SOP audits, and predictive trend intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/login" className="px-10 py-5 rounded-full bg-deep-grape text-white font-black text-xl hover:bg-naturals-purple transition-all shadow-2xl flex items-center justify-center uppercase tracking-tighter">
              Launch Platform
            </Link>
            <Link href="/dashboard/experience" className="px-10 py-5 rounded-full bg-white border border-black/10 text-deep-grape font-black text-xl hover:bg-black/5 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
              Book Experience <ChevronRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Detailed Command Manual Section */}
      <section id="instructions" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-naturals-purple/10 text-naturals-purple text-xs font-black uppercase tracking-widest mb-6">
               <Info className="w-4 h-4" /> Operational Guide
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 italic tracking-tighter">Strategic Command Manual</h2>
            <p className="text-xl text-deep-grape/60 max-w-3xl mx-auto font-medium">
              Follow these precise coordinates to master the Naturals AI ecosystem from initial deployment to multi-node network scale.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Phase 1: Deployment - 1/4 width */}
            <div className="space-y-8 lg:col-span-1">
              <div className="flex items-center gap-4 h-12">
                <div className="w-12 h-12 rounded-2xl bg-deep-grape text-white flex items-center justify-center font-black text-xl italic shadow-lg shrink-0">01</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-deep-grape">Onboarding</h3>
              </div>
              <div className="glass-card p-6 border border-black/5 bg-white shadow-xl h-[calc(100%-80px)]">
                <div className="space-y-6">
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                    <div>
                      <p className="font-black text-[11px] uppercase tracking-wider mb-1 text-deep-grape">Launch Platform</p>
                      <p className="text-[11px] text-deep-grape/60 leading-relaxed font-bold uppercase">Click "Launch Platform" on the top right to initialize the Secure Gateway.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                    <div>
                      <p className="font-black text-[11px] uppercase tracking-wider mb-1 text-deep-grape">Role Selection</p>
                      <p className="text-[11px] text-deep-grape/60 leading-relaxed font-bold uppercase">Assign your identity (Customer, Stylist, Manager, etc.) to unlock tailored command consoles.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                    <div>
                      <p className="font-black text-[11px] uppercase tracking-wider mb-1 text-deep-grape">Authentication</p>
                      <p className="text-[11px] text-deep-grape/60 leading-relaxed font-bold uppercase">Complete secure login via Email/OTP to establish your encrypted session.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: Role Features - 3/4 width */}
            <div className="space-y-8 lg:col-span-3">
              <div className="flex items-center gap-4 h-12">
                <div className="w-12 h-12 rounded-2xl bg-naturals-purple text-white flex items-center justify-center font-black text-xl italic shadow-lg shrink-0">02</div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-deep-grape">Role-Specific Protocols</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Role 1: Customer */}
                <div className="glass-card p-6 border border-black/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-naturals-purple/10 rounded-xl text-naturals-purple"><Users className="w-5 h-5" /></div>
                    <h4 className="font-black text-sm uppercase tracking-wider italic text-deep-grape">Customer</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">Personal Diagnostic:</span> View hair/skin biometrics in "Personal Experience".</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">AI Booking:</span> Get slots tailored to your diagnostic profile.</p>
                    </li>
                  </ul>
                </div>

                {/* Role 2: Stylist */}
                <div className="glass-card p-6 border border-black/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-naturals-purple/10 rounded-xl text-naturals-purple"><Scissors className="w-5 h-5" /></div>
                    <h4 className="font-black text-sm uppercase tracking-wider italic text-deep-grape">Stylist</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">AI Copilot:</span> Get molecular precision guidance during chemical procedures.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">SOP Audits:</span> Execute digital technical audits for brand parity.</p>
                    </li>
                  </ul>
                </div>

                {/* Role 3: Manager */}
                <div className="glass-card p-6 border border-black/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-naturals-purple/10 rounded-xl text-naturals-purple"><ShieldCheck className="w-5 h-5" /></div>
                    <h4 className="font-black text-sm uppercase tracking-wider italic text-deep-grape">Manager</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">Branch Control:</span> Oversee branch compliance and staff skill matrices.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">Training Loop:</span> Trigger academy modules based on performance gaps.</p>
                    </li>
                  </ul>
                </div>

                {/* Role 4: Franchise Owner */}
                <div className="glass-card p-6 border border-black/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-naturals-purple/10 rounded-xl text-naturals-purple"><LineChart className="w-5 h-5" /></div>
                    <h4 className="font-black text-sm uppercase tracking-wider italic text-deep-grape">Franchise Owner</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">Yield View:</span> Monitor multi-node revenue and regional benchmarks.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-naturals-purple mt-0.5 shrink-0" />
                      <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase"><span className="text-deep-grape font-black">Trend Engine:</span> Automate procurement based on forecast demand.</p>
                    </li>
                  </ul>
                </div>

                {/* Role 5: Admin */}
                <div className="glass-card p-6 border border-black/5 bg-white shadow-xl hover:shadow-2xl transition-all h-full lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-naturals-purple/10 rounded-xl text-naturals-purple"><Lock className="w-5 h-5" /></div>
                    <h4 className="font-black text-sm uppercase tracking-wider italic text-deep-grape">Global Admin</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <p className="font-black text-[10px] uppercase tracking-widest text-naturals-purple border-b border-black/5 pb-1">Platform Control</p>
                       <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase">Configure global AI weights and brand SOP parameters for the entire ecosystem.</p>
                    </div>
                    <div className="space-y-3">
                       <p className="font-black text-[10px] uppercase tracking-widest text-naturals-purple border-b border-black/5 pb-1">Data Operations</p>
                       <p className="text-[11px] font-bold text-deep-grape/70 leading-relaxed uppercase">Master audit logs, encrypted database control, and multi-node authorization overrides.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Phase 3: Final Master Instructions */}
          <div className="mt-20 p-12 bg-warm-grey/40 rounded-[3rem] border border-black/5">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="w-12 h-12 rounded-2xl bg-naturals-purple text-white flex items-center justify-center font-black text-xl italic shrink-0 shadow-lg">03</div>
               <div className="flex-1">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">System Master Cycle</h3>
                 <p className="text-sm font-bold text-deep-grape/50 uppercase tracking-widest leading-relaxed">
                   The website operates on a <span className="text-naturals-purple">Feedback-Execution Loop</span>. Every customer diagnostic feeds into the stylist copilot, which in turn updates the regional trend engine, allowing managers to optimize the entire node network. Navigate through the sidebar in the dashboard to switch between these interconnected protocols.
                 </p>
               </div>
               <Link href="/login" className="px-10 py-5 bg-deep-grape text-white rounded-full font-black text-lg uppercase tracking-widest hover:bg-naturals-purple transition-all shadow-2xl shrink-0">
                  Begin Cycle
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Modules Section */}
      <section id="features" className="py-24 bg-warm-grey/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">Intelligence Modules</h2>
              <p className="text-xl text-deep-grape/60">Powering operations from technical audits to trend prediction.</p>
            </div>
            <Link href="/login" className="px-8 py-3 bg-naturals-purple text-white font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-deep-grape transition-colors">
              Access All Modules
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureItem 
              icon={<ShieldCheck className="w-10 h-10 text-naturals-purple" />}
              title="Standardisation SOP Engine"
              desc="Digital SOPs with real-time AI audits to ensure consistency across 500+ clinics."
              href="/dashboard/sop"
            />
            <FeatureItem 
              icon={<Brain className="w-10 h-10 text-naturals-purple" />}
              title="Staff Skill Assist AI"
              desc="On-field AI Copilot guiding stylists with chemical precision and step-by-step processing."
              href="/dashboard/stylist"
            />
            <FeatureItem 
              icon={<Target className="w-10 h-10 text-naturals-purple" />}
              title="Digital Beauty Passport"
              desc="Persistent hair and skin health records backed by AI visual diagnosis for personalization."
              href="/dashboard/passport"
            />
            <FeatureItem 
              icon={<TrendingUp className="w-10 h-10 text-naturals-purple" />}
              title="Trend Prediction AI"
              desc="Analyzing local demand and social shifts to automate inventory and service prep."
              href="/dashboard/trends"
            />
            <FeatureItem 
              icon={<Sparkles className="w-10 h-10 text-naturals-purple" />}
              title="Hyper-Personal Experience"
              desc="Dynamic service adaptation based on client history, lifestyle, and local climate."
              href="/dashboard/experience"
            />
            <FeatureItem 
              icon={<LineChart className="w-10 h-10 text-naturals-purple" />}
              title="Salon Business Intelligence"
              desc="Turning fragmented branch data into actionable revenue and skill gap forecasts."
              href="/dashboard"
            />
          </div>
        </div>
      </section>

      {/* Corporate Section - Goal Orientation */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-32 items-center">
          <div className="relative">
             <div className="absolute -inset-10 bg-naturals-purple/5 blur-[120px] rounded-full" />
             <div className="relative z-10 glass-card p-10 rounded-[3rem] border-black/5 shadow-2xl">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <p className="text-[10px] font-black uppercase opacity-40 mb-2 tracking-[0.2em]">Operational Dashboard</p>
                      <h3 className="text-3xl font-black">Branch Efficiency</h3>
                   </div>
                   <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-green-600 w-6 h-6" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '82%' }} className="h-full bg-naturals-purple" />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-2xl font-black">82%</p>
                         <p className="text-[10px] font-bold uppercase opacity-40">SOP Compliance</p>
                      </div>
                      <div>
                         <p className="text-2xl font-black">+14%</p>
                         <p className="text-[10px] font-bold uppercase opacity-40">Revenue Growth</p>
                      </div>
                   </div>
                </div>
                <div className="mt-12 flex gap-3">
                   <div className="w-10 h-10 rounded-full bg-warm-grey border border-black/5" />
                   <div className="w-10 h-10 rounded-full bg-warm-grey border border-black/5" />
                   <div className="w-10 h-10 rounded-full bg-warm-grey border border-black/5" />
                   <div className="flex-1" />
                   <button className="px-6 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">Connect Branch</button>
                </div>
             </div>
          </div>
          <div>
            <h2 className="text-5xl font-black mb-10 leading-tight">Scale Consistency Across Boundaries</h2>
            <p className="text-lg text-deep-grape/60 mb-12 leading-relaxed">
              Our Salon Intelligence System bridges the gap between raw branch data and executive decision-making. 
              Map staff skills to service quality, predict future gaps, and build structured growth pathways.
            </p>
            <div className="grid gap-6">
               {[
                 { t: "Revenue Predictability", d: "Forecast branch income based on local beauty trends." },
                 { t: "Skill Gap Analysis", d: "Automatically identify training needs for franchise expansion." },
                 { t: "Automated Compliance", d: "Zero-latency SOP monitoring through AI audits." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-warm-grey border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-naturals-purple/10 transition-colors">
                       <CheckCircle className="w-7 h-7 text-naturals-purple" />
                    </div>
                    <div>
                       <p className="font-black text-lg mb-1">{item.t}</p>
                       <p className="text-sm opacity-60 leading-relaxed font-medium">{item.d}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-deep-grape text-white p-12 md:p-24 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-naturals-purple/20 rounded-full blur-[120px] -mr-64 -mt-64" />
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-10 italic">Intelligence is the <br /> New Standard.</h2>
              <p className="text-xl opacity-60 mb-14 font-medium leading-relaxed">
                Join the StartupTN × Naturals ecosystem. Built for developers, designers, and innovators 
                to redefine the future of salon chains through scalable AI solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <Link href="/login" className="px-10 py-5 bg-white text-deep-grape rounded-full font-black text-xl uppercase shadow-2xl transition-all hover:scale-105 active:scale-95">
                    Enter Platform
                 </Link>
                 <Link href="/dashboard/experience" className="px-10 py-5 border border-white/20 bg-white/5 backdrop-blur-md rounded-full font-black text-xl uppercase shadow-lg transition-all hover:bg-white/10">
                    Book Consultation
                 </Link>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-20 bg-white border-t border-black/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="relative w-48 h-12 opacity-80 hover:opacity-100 transition-opacity">
                  <Image src="/naturalslogo.png" alt="Logo" fill className="object-contain object-left" />
               </div>
            </div>
            <div className="flex gap-12 text-sm font-bold uppercase tracking-widest opacity-40">
               <span className="hover:opacity-100 transition-opacity cursor-pointer">Privacy Policy</span>
               <span className="hover:opacity-100 transition-opacity cursor-pointer">Terms of Service</span>
               <span className="hover:opacity-100 transition-opacity cursor-pointer">Franchise Support</span>
            </div>
            <p className="text-xs font-bold opacity-20 tracking-widest text-center md:text-right uppercase">© 2026 Naturals Intelligence Platform</p>
         </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc, href }: { icon: React.ReactNode, title: string, desc: string, href: string }) {
  return (
    <Link href={href} className="group p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
      <div className="w-20 h-20 rounded-[1.5rem] bg-warm-grey border border-black/5 flex items-center justify-center mb-10 group-hover:bg-naturals-purple transition-all duration-500 shadow-inner group-hover:scale-90 overflow-hidden relative">
        <div className="absolute inset-0 bg-white group-hover:bg-naturals-purple transition-colors" />
        <div className="relative z-10 group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{title}</h3>
      <p className="text-deep-grape/60 mb-10 leading-relaxed font-medium">{desc}</p>
      <div className="mt-auto flex items-center gap-2 text-naturals-purple font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
        Enter Module <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
