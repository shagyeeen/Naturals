"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LayoutDashboard,
  X
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedGenerateButton from "@/components/ui/animated-generate-button-shadcn-tailwind";
const CHALLENGES = [
  {
    title: "Challenge 1: Standardising Salon Experience",
    problem: [
      "Customers expect the same quality of service across all salon branches. However, service quality varies due to:",
      "• Differences in stylist skills",
      "• Inconsistent training",
      "• Manual SOP tracking",
      "• Lack of objective quality measurement"
    ],
    solution: [
      "Our AI platform successfully delivers:",
      "• Standardised customer consultation workflows",
      "• Digitised SOPs with real-time AI validation",
      "• Objective, machine-vision-backed service quality measurement",
      "• Remote audits and automated performance tracking",
      "• Reduced complaints through predictive automation"
    ],
    href: "/dashboard/sop"
  },
  {
    title: "Challenge 2: Reducing Staff Dependency",
    problem: [
      "Salon performance depends heavily on individual staff expertise. When experienced staff leave:",
      "• Quality drops",
      "• Complaints increase",
      "• Revenue declines"
    ],
    solution: [
      "Our Copilot engine empowers any stylist by:",
      "• Assisting semi-skilled staff during complex service delivery",
      "• Providing on-field AI-guided consultation and decision support",
      "• Drastically reducing training time and enabling faster onboarding",
      "• Maintaining perfect brand consistency regardless of staff changes"
    ],
    href: "/dashboard/stylist"
  },
  {
    title: "Challenge 3: Hyper-Personalised Beauty Experiences",
    problem: [
      "Beauty services are often generic, despite every customer having unique skin, hair, and lifestyle needs."
    ],
    solution: [
      "We engineered a tailored ecosystem to:",
      "• Create persistent digital beauty profiles (“Beauty Passport”)",
      "• Offer highly accurate AI-based skin and hair diagnosis",
      "• Provide hyper-personalised service recommendations",
      "• Enable predictive home-care plans and regimen tracking",
      "• Design long-term, adaptive customer beauty journeys",
      "Goal: Moving from service-based salons to personalised beauty ecosystems."
    ],
    href: "/dashboard/passport"
  },
  {
    title: "Challenge 4: AI-Based Prediction of Beauty Trends",
    problem: [
      "Beauty trends change rapidly due to:",
      "• Social media influence",
      "• Celebrity trends",
      "• Climate changes",
      "• Seasonal demand",
      "• Regional lifestyle shifts",
      "Salons currently react after trends emerge."
    ],
    solution: [
      "Our Trend Prediction AI allows salons to:",
      "• Predict emerging beauty services before they peak",
      "• Analyse social media velocity and trend data streams",
      "• Forecast highly specific region-wise branch demand",
      "• Recommend proactive inventory routing and skill preparation",
      "Goal: Helping salons proactively predict demand before it happens."
    ],
    href: "/dashboard/trends"
  },
  {
    title: "Challenge 5: AI Tools to Enhance Customer Experience",
    problem: [
      "Open Innovation Category: The need to build next-generation tools that create immersive, intelligent beauty environments."
    ],
    solution: [
      "Our breakthrough suite of AI tools is designed to:",
      "• Drastically enhance the customer experience using personalization",
      "• Improve staff productivity through autonomous scheduling",
      "• Inject deep operational intelligence into daily tasks",
      "• Create a truly immersive, interactive beauty environment"
    ],
    href: "/dashboard/experience"
  },
  {
    title: "Challenge 6: Turning Salon Data into Business Intelligence",
    problem: [
      "Salons collect massive, fragmented amounts of data:",
      "• Training records & skill assessments",
      "• Service audits & customer feedback",
      "• Revenue data",
      "However, this data is not fully utilised for strategic decision-making."
    ],
    solution: [
      "Our comprehensive Node Dashboard allows executives to:",
      "• Convert fragmented training data into actionable, real-time insights",
      "• Accurately map staff skill levels directly to service quality and revenue",
      "• Predict future skill gaps and dynamically adapt",
      "• Access real-time dashboards for holistic franchise performance",
      "• Enable structured growth pathways (L1 → L3 skill mapping)",
      "Goal: Transform raw data into smarter decisions and scalable growth."
    ],
    href: "/dashboard"
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-deep-grape overflow-x-hidden selection:bg-naturals-purple selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-28 md:pb-12 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Dynamic Background Graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(142,62,150,0.15),rgba(255,255,255,0))]" />
        
        {/* Floating Animated Orbs */}
        <motion.div 
          animate={{ y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-naturals-purple/20 to-lavender/30 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -40, 0], scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#9B51E0]/10 to-[#E0B0FF]/20 rounded-full blur-[140px] pointer-events-none" 
        />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center justify-center gap-5 px-8 py-3.5 rounded-full bg-white/70 backdrop-blur-xl border border-naturals-purple/10 mb-6 lg:mb-8 shadow-[0_8px_30px_rgb(142,62,150,0.12)] hover:shadow-[0_8px_30px_rgb(142,62,150,0.2)] hover:bg-white transition-all duration-500 group"
          >
            <div className="relative w-32 h-8 group-hover:scale-105 transition-transform duration-500">
              <Image src="/naturalslogo.png" alt="Naturals Logo" fill className="object-contain drop-shadow-sm" priority />
            </div>
            <span className="text-naturals-purple/30 font-black text-lg group-hover:text-naturals-purple/60 transition-colors duration-500">×</span>
            <div className="relative w-32 h-8 group-hover:scale-105 transition-transform duration-500">
              <Image src="/startuptn.png" alt="StartupTN Logo" fill className="object-contain drop-shadow-sm" priority />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter mb-6 max-w-[85rem] leading-[0.9] text-deep-grape"
          >
            <span className="opacity-90 tracking-tight">The <span className="italic">Next Era</span> of</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-naturals-purple via-[#B46EEB] to-deep-grape drop-shadow-[0_0_40px_rgba(142,62,150,0.3)] filter">Salon Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-base md:text-lg lg:text-xl text-deep-grape/80 max-w-5xl lg:max-w-6xl mb-8 leading-[1.6] font-bold uppercase tracking-[0.15em] px-6 bg-white/40 backdrop-blur-sm rounded-3xl py-4 border border-white/50"
          >
            Transforming salon operations through hyper-personalized beauty insights, 
            autonomous SOP audits, and predictive trend intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring", bounce: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 relative"
          >
            {/* Pulsing ring behind the button */}
            <div className="absolute inset-0 bg-naturals-purple rounded-[24px] blur-xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="relative z-10 hover:scale-105 transition-transform duration-300">
              <AnimatedGenerateButton 
                labelIdle="Launch Platform"
                labelActive="Parsing Nodes..."
                highlightHueDeg={290}
                onClick={() => router.push('/login')}
              />
            </div>
          </motion.div>
        </div>
      </section>


      {/* AI Modules Section */}
      <section id="features" className="pt-28 pb-10 bg-naturals-purple/5 relative min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4" data-aos="fade-up">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black mb-2 uppercase italic tracking-tighter">Intelligence <span className="text-naturals-purple">Modules</span></h2>
              <p className="text-sm md:text-base text-deep-grape/60 font-bold uppercase tracking-widest opacity-40">Powering operations from audits to prediction.</p>
            </div>
            <Link href="/login" className="px-8 py-3 bg-naturals-purple text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-deep-grape transition-all shadow-md hover:-translate-y-0.5">
              Access Ecosystem
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <FeatureItem 
              icon={<ShieldCheck className="w-10 h-10 text-naturals-purple" />}
              title="Standardisation SOP Engine"
              desc="Digital SOPs with real-time AI audits to ensure consistency across 500+ clinics."
              onClick={() => setActiveChallenge(0)}
            />
            <FeatureItem 
              icon={<Brain className="w-10 h-10 text-naturals-purple" />}
              title="Staff Skill Assist AI"
              desc="On-field AI Copilot guiding stylists with chemical precision and step-by-step processing."
              onClick={() => setActiveChallenge(1)}
            />
            <FeatureItem 
              icon={<Target className="w-10 h-10 text-naturals-purple" />}
              title="Digital Beauty Passport"
              desc="Persistent hair and skin health records backed by AI visual diagnosis for personalization."
              onClick={() => setActiveChallenge(2)}
            />
            <FeatureItem 
              icon={<TrendingUp className="w-10 h-10 text-naturals-purple" />}
              title="Trend Prediction AI"
              desc="Analyzing local demand and social shifts to automate inventory and service prep."
              onClick={() => setActiveChallenge(3)}
            />
            <FeatureItem 
              icon={<Sparkles className="w-10 h-10 text-naturals-purple" />}
              title="Hyper-Personal Experience"
              desc="Dynamic service adaptation based on client history, lifestyle, and local climate."
              onClick={() => setActiveChallenge(4)}
            />
            <FeatureItem 
              icon={<LineChart className="w-10 h-10 text-naturals-purple" />}
              title="Salon Business Intelligence"
              desc="Turning fragmented branch data into actionable revenue and skill gap forecasts."
              onClick={() => setActiveChallenge(5)}
            />
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

      {/* Challenge Modals */}
      <AnimatePresence>
        {activeChallenge !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deep-grape/80 backdrop-blur-md" 
            onClick={() => setActiveChallenge(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDF9FF] rounded-[3rem] pl-4 md:pl-8 py-4 md:py-8 pr-2 max-w-2xl w-full max-h-[85vh] relative shadow-2xl border border-naturals-purple/20 flex flex-col"
            >
              <button 
                onClick={() => setActiveChallenge(null)} 
                className="absolute top-8 md:top-10 right-8 md:right-10 p-3 rounded-full bg-naturals-purple/5 hover:bg-naturals-purple/10 transition-colors group z-10"
              >
                <X className="w-5 h-5 text-deep-grape group-hover:text-naturals-purple transition-colors" />
              </button>
              
              <div className="flex-1 overflow-y-auto pr-4 md:pr-8 py-4">
                <h3 className="text-2xl md:text-3xl font-black mb-8 pr-16 text-deep-grape">
                  {CHALLENGES[activeChallenge].title}
                </h3>
                
                <div className="space-y-8">
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-black/5 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-red-100">
                       Problem Statement
                    </div>
                    <div className="space-y-3 text-deep-grape/70 font-semibold leading-relaxed text-sm">
                      {CHALLENGES[activeChallenge].problem.map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? "pl-4 text-deep-grape" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-black/5 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-green-100">
                       Our Solution
                    </div>
                    <div className="space-y-3 text-deep-grape/70 font-semibold leading-relaxed text-sm">
                      {CHALLENGES[activeChallenge].solution.map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? "pl-4 text-deep-grape" : line.startsWith('Goal:') ? "mt-6 font-black text-naturals-purple" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-black/5 flex justify-end gap-3">
                  <button 
                    onClick={() => setActiveChallenge(null)} 
                    className="px-6 py-3 bg-warm-grey text-deep-grape font-black rounded-xl text-xs uppercase tracking-widest hover:bg-black/5 transition-all active:scale-95"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => router.push(CHALLENGES[activeChallenge].href)} 
                    className="px-8 py-3 bg-naturals-purple text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-deep-grape transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Launch Solution
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function FeatureItem({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      data-aos="zoom-in"
      className="group p-6 rounded-[2rem] liquid-glass hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full relative overflow-hidden text-left w-full"
    >
      <div className="w-12 h-12 rounded-[1rem] bg-warm-grey border border-black/5 flex items-center justify-center mb-5 group-hover:bg-naturals-purple transition-all duration-500 shadow-inner group-hover:scale-90 overflow-hidden relative shrink-0">
        <div className="absolute inset-0 bg-white group-hover:bg-naturals-purple transition-colors duration-500" />
        <div className="relative z-10 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:transition-colors [&>svg]:duration-500 group-hover:[&>svg]:!text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-black mb-2 uppercase tracking-tighter italic leading-tight">{title}</h3>
      <p className="text-sm text-deep-grape/60 mb-6 leading-relaxed font-medium">{desc}</p>
      <div className="mt-auto flex items-center gap-1.5 text-naturals-purple font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        View Challenge <ChevronRight className="w-3 h-3" />
      </div>
    </button>
  );
}
