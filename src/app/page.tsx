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

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<(Offer & { service?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Hair");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingService, setViewingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

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
      
      {/* Ultra-Unique Floating Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-6xl">
        <nav className="glass-card !rounded-full px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-3xl border-white/60 shadow-[0_20px_40px_-15px_rgba(47,1,55,0.05)]">
          <Link href="/" className="relative w-40 h-10 hover:scale-105 transition-transform duration-500">
            <Image 
              src="/naturalslogo.png" 
              alt="Naturals Logo" 
              fill 
              sizes="(max-width: 768px) 160px, 160px"
              className="object-contain object-left" 
              priority 
            />
          </Link>
          <div className="hidden lg:flex items-center gap-14">
            {['Services', 'Offers', 'AI Features'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '')}`} 
                className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-deep-grape/70 hover:text-naturals-purple transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-naturals-purple transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <Link href="/login" className="px-8 py-3.5 bg-[#8E3E96] text-white rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] hover:bg-[#6B2D73] hover:shadow-lg transition-all">
            Sign In
          </Link>
        </nav>
      </div>

      {/* Full-Screen Auto-Sliding Hero Carousel (Now Primary Hero) */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <HeroCarousel />
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
              img="/features/ai-diagnosis.png?v=1"
              title="Visual AI Diagnosis"
              desc="Our proprietary machine vision analyzes your hair and skin to recommend precise chemical treatments and styles."
              icon={<Sparkles className="w-6 h-6" />}
            />
            <FeatureCard 
              img="/features/beauty-journey.png?v=1"
              title="Personalized Journey"
              desc="Every visit is tracked. Every preference saved. Experience a service that evolves with your lifestyle and needs."
              icon={<Clock className="w-6 h-6" />}
              delay={0.2}
            />
            <FeatureCard 
              img="/features/beauty-passport.png?v=1"
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
                <p className="text-xs font-black uppercase tracking-[0.3em] text-deep-grape/40">Select a category to explore our services</p>
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
               <Link href="/login" className="hidden md:flex px-10 py-5 bg-[#8E3E96] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6B2D73] transition-all shadow-2xl shadow-[#8E3E96]/20">
                Book Session Now
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    onClick={() => setViewingService(service)}
                    className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl border border-black/5"
                  >
                    {/* Dynamic Service Image */}
                    <Image 
                      src={`/services/${service.id}.png?v=1`} 
                      alt={service.name} 
                      fill 
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-grape via-deep-grape/20 to-transparent" />
                    
                    {/* Category Tag */}
                    <div className={`absolute top-6 right-6 px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md border border-white/10 ${
                      service.category === 'Hair' ? 'bg-naturals-purple/20 text-white' :
                      service.category === 'Face' ? 'bg-orange-500/20 text-white' :
                      'bg-pink-500/20 text-white'
                    }`}>
                      {service.category}
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                       <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:bg-naturals-purple transition-colors text-white border border-white/10">
                          {service.category?.toLowerCase().includes('hair') ? <Scissors className="w-4 h-4" /> : 
                           service.category?.toLowerCase().includes('face') ? <Sparkles className="w-4 h-4" /> :
                           <Droplets className="w-4 h-4" />}
                       </div>
                       <h3 className="text-xl font-black italic text-white mb-2 leading-tight">{service.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">{service.duration_minutes} Minutes</p>
                       
                       <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-lg font-black text-white">₹{service.price}</span>
                             <span className="text-[8px] font-black uppercase text-white/30">+ taxes</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-naturals-purple transition-all">
                             <ChevronRight className="w-4 h-4" />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
              {searchQuery.length > 0 && services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                 <div className="col-span-full py-20 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-deep-grape/20">No matching services found for &quot;{searchQuery}&quot;</p>
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
                className="w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
              >
                {/* Image Banner Section */}
                <div className="relative w-full md:w-[45%] h-72 md:h-auto min-h-[400px]">
                   <Image 
                     src={`/services/${viewingService.id}.png?v=1`} 
                     alt={viewingService.name} 
                     fill 
                     sizes="(max-width: 768px) 100vw, 45vw"
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-deep-grape/80 via-deep-grape/20 to-transparent" />
                </div>

                <div className="flex-1 p-10 md:p-16 relative">
                   <div className="absolute top-0 right-0 p-10">
                      <button 
                        onClick={() => setViewingService(null)}
                        className="w-12 h-12 rounded-2xl bg-warm-grey hover:bg-naturals-purple/10 text-deep-grape/40 hover:text-naturals-purple flex items-center justify-center transition-all border border-black/5"
                      >
                        <X className="w-6 h-6" />
                      </button>
                   </div>

                   <div className="flex items-center gap-4 mb-8">
                      <div className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full ${
                         viewingService.category === 'Hair' ? 'bg-naturals-purple/10 text-naturals-purple' :
                         viewingService.category === 'Face' ? 'bg-orange-500/10 text-orange-600' :
                         'bg-pink-500/10 text-pink-600'
                       }`}>
                         {viewingService.category}
                       </div>
                       <span className="text-[10px] font-black text-deep-grape/20 uppercase tracking-[0.4em]">• AI Analysis</span>
                   </div>

                   <h2 className="text-4xl md:text-5xl font-black italic text-deep-grape mb-8 tracking-tight leading-none">
                     {viewingService.name}
                   </h2>

                   <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="p-6 bg-warm-grey/30 rounded-3xl border border-black/5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 mb-2">Duration</p>
                         <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-naturals-purple" />
                            <span className="text-sm font-black text-deep-grape">{viewingService.duration_minutes} Minutes</span>
                         </div>
                      </div>
                      <div className="p-6 bg-warm-grey/30 rounded-3xl border border-black/5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 mb-2">Investment</p>
                         <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-naturals-purple">₹{viewingService.price}</span>
                            <span className="text-[9px] font-black uppercase text-deep-grape/30">+ tax</span>
                         </div>
                      </div>
                   </div>

                   <div className="mb-12">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-deep-grape/40 mb-4 italic">About Service</h4>
                      <p className="text-sm font-bold text-deep-grape/60 leading-relaxed italic">
                        {viewingService.description || "Experience the pinnacle of salon precision. This professional service is designed by Naturals AI specialists to deliver optimal aesthetic results tailored to your unique features."}
                      </p>
                   </div>

                   <Link 
                      href="/login"
                      className="w-full py-6 bg-naturals-purple text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3"
                   >
                      Confirm & Book Appointment <ArrowRight className="w-5 h-5" />
                   </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                 <Link href="/login" className="px-12 py-6 bg-[#8E3E96] text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 hover:bg-[#6B2D73] transition-all">
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
               <Image 
                 src="/naturalslogo.png" 
                 alt="Logo" 
                 fill 
                 sizes="192px"
                 className="object-contain object-left" 
               />
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

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      image: "/offers/banner2.jpg?v=1",
      // banner2: Woman with glowing long brown hair — beauty/hair treatment
      tag: "Beauty Treatment",
      title: "RADIANT HAIR\n& BEAUTY",
      desc: "AI-powered scalp and skin diagnostics — restore shine, volume, and health with personalised care.",
      badge: "30% DISCOUNT",
      btnColor: "bg-rose-600",
    },
    {
      image: "/offers/banner3.jpg?v=1",
      // banner3: Couple in bridal attire — bridal styling
      tag: "Bridal Collection",
      title: "BRIDAL SIGNATURE\nGLOW",
      desc: "Make a statement on your special day — elite bridal styling curated by our aesthetic maestros.",
      badge: "ELITE ACCESS",
      btnColor: "bg-[#8E3E96]",
    },
    {
      image: "/offers/banner1.jpg?v=1",
      // banner1: Styled woman in purple/satin — hair & fashion shoot
      tag: "Hair Expertise",
      title: "EXPERT HAIR\nSTYLING",
      desc: "From precision cuts to bold transformations — crafted by Naturals' master stylists for your perfect look.",
      badge: "₹500 OFF",
      btnColor: "bg-naturals-purple",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt="Offer Banner"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />

          {/* Subtle top vignette for navbar readability only */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

          {/* Strong bottom gradient — this is where the text lives */}
          <div className="absolute bottom-0 left-0 right-0 h-[52%] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Text — anchored to bottom-left, inside the dark gradient zone */}
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-28 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-5">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80">
                {slides[current].tag}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic text-white mb-4 tracking-tighter leading-[1] whitespace-pre-line drop-shadow-2xl">
              {slides[current].title}
            </h2>

            {/* Desc */}
            <p className="text-[11px] md:text-xs text-white/60 font-bold uppercase tracking-widest max-w-md mb-8 leading-relaxed">
              {slides[current].desc}
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/login"
                className={`px-8 py-4 ${slides[current].btnColor} text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3`}
              >
                Claim This Offer <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Exclusive Reward</span>
                <span className="text-lg font-black text-white tracking-tight">{slides[current].badge}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots — bottom center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative h-1 w-14 bg-white/20 rounded-full overflow-hidden transition-all hover:bg-white/40"
          >
            {current === i && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 7, ease: "linear" }}
                className="absolute inset-0 bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 right-10 z-10 flex items-center gap-3 text-white/20">
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Discover More</span>
        <div className="w-px h-10 bg-white/20" />
      </div>
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
        <Image 
          src={img} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
        />
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
