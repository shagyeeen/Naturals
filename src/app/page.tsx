"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Scissors, 
  Droplets, 
  Star, 
  ChevronRight, 
  Clock, 
  Gift, 
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Flame,
  LayoutDashboard,
  Search,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/modules/franchise_owner/services/dao";
import { getAllActiveOffers } from "@/modules/franchise_owner/offers/dao";
import type { Service, Offer } from "@/lib/supabase";

export default function LandingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<(Offer & { service?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Hair");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingService, setViewingService] = useState<Service | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, offersRes] = await Promise.all([
          getServices(),
          getAllActiveOffers()
        ]);
        if (servicesRes.data) setServices(servicesRes.data);
        if (offersRes.data) setOffers(offersRes.data);
      } catch (err) {
        console.error("Error loading landing data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF9FF] text-deep-grape selection:bg-naturals-purple selection:text-white overflow-x-hidden">
      
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-naturals-purple/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="relative w-32 h-10 hover:scale-105 transition-transform duration-300">
            <Image src="/naturalslogo.png" alt="Naturals Logo" fill className="object-contain" priority />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="#services" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-naturals-purple transition-colors">Services</a>
            <a href="#offers" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-naturals-purple transition-colors">Limited Offers</a>
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-naturals-purple transition-colors">AI Features</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-8 py-3 bg-naturals-purple text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-naturals-purple/20 hover:bg-deep-grape hover:shadow-deep-grape/30 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(142,62,150,0.1),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-naturals-purple/10">
              <Sparkles className="w-3 h-3" /> Redefining Beauty with AI
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-deep-grape italic">
              Your Beauty, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-naturals-purple to-deep-grape">Intelligently</span> <br />
              Personalised.
            </h1>
            <p className="text-lg text-deep-grape/60 max-w-xl mb-12 font-bold uppercase tracking-widest leading-relaxed">
              Step into the future of salon experiences. AI-powered consultations, personalized beauty journeys, and premium service standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/login" className="px-10 py-5 bg-naturals-purple text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-naturals-purple/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                Experience Naturals AI <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#services" className="px-10 py-5 bg-white text-deep-grape border border-black/5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center">
                Explore Services
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(142,62,150,0.3)] group">
               <Image 
                src="/features/ai-diagnosis.png" 
                alt="AI Diagnosis" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-deep-grape/60 to-transparent" />
               <div className="absolute bottom-12 left-12 right-12">
                  <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                     <p className="text-white text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-naturals-purple" /> AR Diagnosis Active
                     </p>
                     <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Scanning facial geometry for optimal hairstyle alignment...</p>
                  </div>
               </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-naturals-purple/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-lavender/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </section>

      {/* Featured AI Benefits */}
      <section id="features" className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black italic text-deep-grape mb-6 tracking-tighter">Beyond a Salon. An Ecosystem.</h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-naturals-purple">Revolutionizing the Beauty Landscape</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              img="/features/ai-diagnosis.png"
              title="Visual AI Diagnosis"
              desc="Our proprietary machine vision analyzes your hair and skin to recommend precise chemical treatments and styles."
              icon={<Sparkles className="w-6 h-6" />}
            />
            <FeatureCard 
              img="/features/beauty-journey.png"
              title="Personalized Journey"
              desc="Every visit is tracked. Every preference saved. Experience a service that evolves with your lifestyle and needs."
              icon={<Clock className="w-6 h-6" />}
              delay={0.2}
            />
            <FeatureCard 
              img="/features/beauty-passport.png"
              title="Digital Passport"
              desc="Access your persistent beauty ID across any Naturals branch. Your profile follows you, ensuring consistency."
              icon={<ShieldCheck className="w-6 h-6" />}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-naturals-purple/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12 mb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black italic text-deep-grape mb-4 tracking-tighter">Services Offered</h2>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-deep-grape/40">Select a category to explore our protocols</p>
              </div>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/20" />
                <input 
                  type="text"
                  placeholder="Search for a specific treatment..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 0) setSelectedCategory(null);
                  }}
                  className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-deep-grape shadow-sm focus:outline-none focus:border-naturals-purple transition-all"
                />
              </div>
              <Link href="/login" className="hidden md:flex px-8 py-4 bg-white border border-black/5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-naturals-purple hover:text-white transition-all shadow-sm">
                Book Your Session
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full">
              {["Hair", "Face", "Nail"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`group relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 ${
                    selectedCategory === cat
                      ? "bg-naturals-purple border-naturals-purple text-white shadow-2xl shadow-naturals-purple/30 scale-105"
                      : "bg-white border-black/5 text-deep-grape hover:border-naturals-purple/30"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] relative z-10 ${selectedCategory === cat ? 'text-white' : 'text-deep-grape/40 group-hover:text-naturals-purple'}`}>
                    {cat}
                  </p>
                  <div className={`mt-2 h-1 w-0 group-hover:w-full bg-naturals-purple transition-all duration-500 ${selectedCategory === cat ? 'hidden' : 'block'}`} />
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="aspect-[3/4] bg-warm-grey animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {!selectedCategory && searchQuery.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                   <div className="w-20 h-20 bg-naturals-purple/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-naturals-purple/20" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-[0.4em] text-deep-grape/20">Please select a category or search to begin</p>
                </div>
              ) : (
                services
                  .filter(s => {
                    if (searchQuery) {
                      return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             s.category?.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return s.category === selectedCategory;
                  })
                  .map((service) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    onClick={() => setViewingService(service)}
                    className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute top-0 right-0 px-4 py-2 text-[8px] font-black uppercase tracking-widest rounded-bl-2xl ${
                      service.category === 'Hair' ? 'bg-naturals-purple/10 text-naturals-purple' :
                      service.category === 'Face' ? 'bg-orange-500/10 text-orange-600' :
                      'bg-pink-500/10 text-pink-600'
                    }`}>
                      {service.category}
                    </div>
                    <div className="w-12 h-12 bg-naturals-purple/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-naturals-purple group-hover:text-white transition-colors">
                      {service.category?.toLowerCase().includes('hair') ? <Scissors className="w-5 h-5" /> : 
                       service.category?.toLowerCase().includes('face') ? <Sparkles className="w-5 h-5" /> :
                       <Droplets className="w-5 h-5" />}
                    </div>
                    <h3 className="text-lg font-black italic text-deep-grape mb-2">{service.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape/40 mb-4">{service.duration_minutes} Minutes</p>
                    <div className="mt-auto pt-6 border-t border-black/5 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-naturals-purple">₹{service.price}</span>
                        <span className="text-[8px] font-black uppercase text-deep-grape/30">+ taxes</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </div>
                  </motion.div>
                ))
              )}
              {searchQuery.length > 0 && services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                 <div className="col-span-full py-20 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-deep-grape/20">No matching protocols found for &quot;{searchQuery}&quot;</p>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Service Detail Modal */}
        <AnimatePresence>
          {viewingService && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deep-grape/40 backdrop-blur-md"
              onClick={() => setViewingService(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-xl bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 p-8">
                   <button 
                     onClick={() => setViewingService(null)}
                     className="w-12 h-12 rounded-2xl bg-warm-grey hover:bg-naturals-purple/10 text-deep-grape/40 hover:text-naturals-purple flex items-center justify-center transition-all"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                   <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl ${
                      viewingService.category === 'Hair' ? 'bg-naturals-purple/10 text-naturals-purple' :
                      viewingService.category === 'Face' ? 'bg-orange-500/10 text-orange-600' :
                      'bg-pink-500/10 text-pink-600'
                    }`}>
                      {viewingService.category}
                    </div>
                    <span className="text-[10px] font-black text-deep-grape/20 uppercase tracking-[0.3em]">• Professional Protocol</span>
                </div>

                <h2 className="text-4xl font-black italic text-deep-grape mb-6 tracking-tight leading-none">
                  {viewingService.name}
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="p-6 bg-warm-grey/30 rounded-3xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 mb-2">Duration</p>
                      <div className="flex items-center gap-3">
                         <Clock className="w-5 h-5 text-naturals-purple" />
                         <span className="text-sm font-black text-deep-grape">{viewingService.duration_minutes} Minutes</span>
                      </div>
                   </div>
                   <div className="p-6 bg-warm-grey/30 rounded-3xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 mb-2">Investment</p>
                      <div className="flex items-center gap-3">
                         <span className="text-lg font-black text-naturals-purple">₹{viewingService.price}</span>
                         <span className="text-[8px] font-black uppercase text-deep-grape/30">+ taxes</span>
                      </div>
                   </div>
                </div>

                <div className="mb-12">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-deep-grape/40 mb-4 italic">Protocol Overview</h4>
                   <p className="text-sm font-bold text-deep-grape/60 leading-relaxed italic">
                     {viewingService.description || "Experience the pinnacle of salon precision. This professional protocol is designed by Naturals AI specialists to deliver optimal aesthetic results tailored to your unique features."}
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <Link 
                     href="/login"
                     className="flex-1 py-5 bg-naturals-purple text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-naturals-purple/20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3"
                   >
                     Confirm & Book Appointment <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Limited Offers Section */}
      <section id="offers" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-naturals-purple/5 rounded-full blur-[120px] -mr-96 -mt-96" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-orange-500/20">
              <Flame className="w-3 h-3 animate-pulse" /> Limited Time Specials
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic text-deep-grape mb-4 tracking-tighter">Exclusive Offers</h2>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-deep-grape/40">Claim your rewards before they expire</p>
          </div>

          <div className="space-y-8">
            {/* Voucher 1: Signature Hair Glow */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-deep-grape to-black rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-2xl"
            >
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="max-w-xl text-left">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/5">
                       <Scissors className="w-3 h-3" /> Signature Protocol
                     </div>
                     <h3 className="text-4xl md:text-5xl font-black italic mb-6 tracking-tight">Hair Detox & Shine</h3>
                     <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed mb-8">
                        Experience the AI-driven scalp analysis and deep conditioning treatment. Valid for first-time signature bookings.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1">
                           <span className="text-[8px] font-black uppercase text-white/30">Voucher Value</span>
                           <span className="text-xl font-black text-naturals-purple">₹500 OFF</span>
                        </div>
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1">
                           <span className="text-[8px] font-black uppercase text-white/30">Code</span>
                           <span className="text-xs font-black text-white">NATURALS-GLOW</span>
                        </div>
                     </div>
                  </div>
                  <Link href="/login" className="px-12 py-6 bg-white text-deep-grape rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-naturals-purple hover:text-white transition-all shadow-2xl shrink-0">
                     Claim Voucher
                  </Link>
               </div>
               <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-naturals-purple/10 rounded-full blur-[120px]" />
               <Gift className="absolute bottom-[-40px] left-[-20px] w-64 h-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </motion.div>

            {/* Voucher 2: Face Radiance */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-black/5 rounded-[4rem] p-12 text-deep-grape relative overflow-hidden group shadow-xl"
            >
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="max-w-xl text-left">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-orange-500/20">
                       <Sparkles className="w-3 h-3" /> Skin Science
                     </div>
                     <h3 className="text-4xl md:text-5xl font-black italic mb-6 tracking-tight text-deep-grape">Elite Face Radiance</h3>
                     <p className="text-sm font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed mb-8">
                        Our premium AI-mapped facial therapy designed for immediate luminosity. Exclusive for Platinum tier members.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        <div className="px-6 py-4 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-1">
                           <span className="text-[8px] font-black uppercase text-deep-grape/30">Voucher Value</span>
                           <span className="text-xl font-black text-orange-600">30% OFF</span>
                        </div>
                        <div className="px-6 py-4 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-1">
                           <span className="text-[8px] font-black uppercase text-deep-grape/30">Code</span>
                           <span className="text-xs font-black text-deep-grape">ELITE-GLOW-30</span>
                        </div>
                     </div>
                  </div>
                  <Link href="/login" className="px-12 py-6 bg-deep-grape text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-naturals-purple transition-all shadow-2xl shrink-0">
                     Claim Voucher
                  </Link>
               </div>
               <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[5rem] bg-gradient-to-br from-deep-grape to-black p-16 md:p-32 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black text-white italic mb-10 tracking-tighter leading-none">The Future <br /> of Beauty is Here.</h2>
              <p className="text-lg text-white/50 font-bold uppercase tracking-[0.3em] mb-16 max-w-2xl mx-auto">
                Join thousands of customers experiencing the precision of Naturals AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                 <Link href="/login" className="px-12 py-6 bg-white text-deep-grape rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Experience Naturals AI
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-black/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="relative w-48 h-12">
               <Image src="/naturalslogo.png" alt="Logo" fill className="object-contain object-left" />
            </div>
            <div className="flex gap-10">
               {['Instagram', 'Twitter', 'LinkedIn'].map(social => (
                 <span key={social} className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 hover:text-naturals-purple cursor-pointer transition-colors">{social}</span>
               ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-deep-grape/20">© 2026 Naturals Intelligence. All rights reserved.</p>
         </div>
      </footer>

    </div>
  );
}

function FeatureCard({ img, title, desc, icon, delay = 0 }: { img: string, title: string, desc: string, icon: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="group relative"
    >
      <div className="relative w-full aspect-square rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl border border-black/5">
        <Image src={img} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-grape/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-8 left-8 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black italic text-deep-grape mb-4 tracking-tight">{title}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-deep-grape/50 leading-relaxed max-w-xs">{desc}</p>
    </motion.div>
  );
}
