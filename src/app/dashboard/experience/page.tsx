"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Stylist } from "@/lib/supabase";
import { 
  Sparkles, Heart, Star, Calendar, Clock, 
  MapPin, User, ChevronRight, Zap, Target,
  Image as ImageIcon, Wand2, History, Activity
} from "lucide-react";

const beautyGoals = [
  { id: "skin", title: "Dermal Health Index", progress: 65, status: "Protocol Optimized", icon: <Star className="w-5 h-5 text-naturals-purple" /> },
  { id: "hair", title: "Follicle Strength Metric", progress: 40, status: "Calibration Required", icon: <Zap className="w-5 h-5 text-naturals-purple" /> },
  { id: "nails", title: "Keratin Integrity", progress: 90, status: "Peak Performance", icon: <Activity className="w-5 h-5 text-naturals-purple" /> }
];

const recommendedServices = [
  {
    id: 1,
    name: "AI Dermal Diagnostic",
    description: "Multi-spectral analysis and targeted formulation delivery.",
    price: "₹2,499",
    duration: "60 mins",
    image: "https://images.unsplash.com/photo-1570172619244-92151a1d8a9d?w=400&q=80"
  },
  {
    id: 2,
    name: "Structural Keratin Bonding",
    description: "Molecular re-alignment based on hair porosity mapping.",
    price: "₹4,999",
    duration: "180 mins",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430863?w=400&q=80"
  },
  {
    id: 3,
    name: "Precision Calibration",
    description: "Style maintenance utilizing previous ergonomic logs.",
    price: "₹899",
    duration: "30 mins",
    image: "https://images.unsplash.com/photo-1522337360788-8b13df772ad5?w=400&q=80"
  }
];

export default function PersonalExperience() {
  const [activeView, setActiveView] = useState<"overview" | "booking" | "history">("overview");
  const [selectedCategory, setSelectedCategory] = useState("Haircare");
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedStylist, setSelectedStylist] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    const { data } = await supabase.from('stylists').select('*').eq('is_active', true);
    if (data && data.length > 0) {
      setStylists(data);
      setSelectedStylist(data[0].full_name);
    }
  };

  const handleConfirmBooking = () => {
    setIsBookingConfirmed(true);
    setTimeout(() => {
      alert(`Deployment Successful: ${selectedCategory} service scheduled with Analyst ${selectedStylist}.`);
      setIsBookingConfirmed(false);
      setActiveView("overview");
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <Activity className="w-3 h-3" /> Protocol 05: Personalised Intelligence
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
            Personal Diagnostic Interface
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">Autonomous analytics tailored to your unique biological profile.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-warm-grey/50 p-1.5 rounded-2xl border border-naturals-purple/5">
          <NavButton active={activeView === "overview"} onClick={() => setActiveView("overview")} label="System Overview" />
          <NavButton active={activeView === "booking"} onClick={() => setActiveView("booking")} label="Resource Allocation" />
          <NavButton active={activeView === "history"} onClick={() => setActiveView("history")} label="Operational Logs" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Main Experience Panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily AI Insight Card */}
              <div className="relative overflow-hidden rounded-[2.5rem] p-10 text-white min-h-[350px] flex flex-col justify-center group shadow-2xl">
                <div className="absolute inset-0 bg-deep-grape" />
                <div className="absolute inset-0 bg-gradient-to-br from-naturals-purple/40 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black border border-white/20 uppercase tracking-[0.3em]">Environment Analysis</span>
                  </div>
                  <h2 className="text-5xl font-black leading-tight tracking-tighter italic">
                    Humidity Threshold <br />
                    Breached: <span className="text-naturals-purple">78%</span>.
                  </h2>
                  <p className="text-white/60 max-w-md text-sm font-bold leading-relaxed uppercase tracking-wider">
                    Biological sensors indicate hair follicle expansion risk. Deployment of Anti-Frizz Protocol is mandatory for shine preservation.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => alert("Deployment Request Logged.")} className="px-8 py-4 bg-white text-deep-grape font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 transition-transform cursor-pointer">Execute Protocol</button>
                    <button onClick={() => alert("Alternative formulations scanning...")} className="px-8 py-4 bg-white/10 backdrop-blur text-white font-black text-xs uppercase tracking-widest rounded-xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">Secondary Options</button>
                  </div>
                </div>
              </div>

              {/* Recommended Services Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase tracking-[0.1em] text-deep-grape/40">Verified Recommendations</h3>
                  <button className="text-naturals-purple font-black uppercase tracking-widest flex items-center gap-2 group text-[10px]">
                    Access Full Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {recommendedServices.map((service) => (
                    <motion.div 
                      key={service.id}
                      whileHover={{ y: -5 }}
                      onClick={() => { setSelectedCategory(service.name); setActiveView("booking"); }}
                      className="glass-card overflow-hidden flex flex-col group cursor-pointer border border-black/5"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-deep-grape/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-deep-grape text-white text-[10px] font-black tracking-widest shadow-lg">
                          {service.price}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col bg-white">
                        <h4 className="font-black text-sm uppercase tracking-wider mb-2 text-deep-grape italic">{service.name}</h4>
                        <p className="text-xs font-bold text-deep-grape/50 mb-6 flex-1 leading-relaxed uppercase">{service.description}</p>
                        <div className="flex items-center gap-4 text-[9px] font-black text-naturals-purple mb-6 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
                          <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> 98% Match</span>
                        </div>
                        <button 
                          className="w-full py-3 rounded-xl border-2 border-naturals-purple text-naturals-purple font-black text-[10px] uppercase tracking-[0.2em] hover:bg-naturals-purple hover:text-white transition-all"
                        >
                          Initialize Request
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats Panel */}
            <div className="space-y-8">
              {/* Beauty Score Card */}
              <div className="glass-card p-8 border border-black/5 bg-white relative overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/30 mb-8 flex items-center gap-3">
                  <Target className="w-4 h-4" /> Biological Goal Tracking
                </h3>
                
                <div className="space-y-10">
                  {beautyGoals.map((goal) => (
                    <div key={goal.id} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-warm-grey border border-black/5">{goal.icon}</div>
                          <span className="font-black text-xs uppercase tracking-wider text-deep-grape">{goal.title}</span>
                        </div>
                        <span className="text-[10px] font-black text-naturals-purple italic">{goal.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-warm-grey rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-naturals-purple rounded-full"
                        />
                      </div>
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">{goal.status}</p>
                    </div>
                  ))}
                </div>

                <button onClick={() => alert("Re-analyzing bio-metrics...")} className="w-full mt-10 py-4 bg-warm-grey/50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-naturals-purple hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Sync Bio-Metrics <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton onClick={() => alert("Initializing Neural Mirror...")} icon={<ImageIcon className="w-6 h-6" />} label="Visual Mirror" sub="AR Diagnostics" />
                <QuickActionButton onClick={() => alert("Querying Central Passport Logs...")} icon={<History className="w-6 h-6" />} label="Passport" sub="Audit Trail" />
              </div>

              {/* Next Appointment Snippet */}
              <div className="glass-card p-8 border-t-8 border-naturals-purple bg-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.2em] mb-1">Upcoming Reservation</p>
                    <h4 className="font-black text-lg text-deep-grape italic">Structural Follicle Treatment</h4>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-deep-grape text-white flex items-center justify-center font-black text-xs italic">
                    24<br/>MAR
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-deep-grape/60">
                    <Clock className="w-4 h-4 text-naturals-purple" /> 10:30 Standard Time
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-deep-grape/60">
                    <MapPin className="w-4 h-4 text-naturals-purple" /> Node: Chennai Alpha
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-deep-grape/60">
                    <User className="w-4 h-4 text-naturals-purple" /> Analyst: Priya S.
                  </div>
                </div>
                <button onClick={() => alert("Opening Resource Management Console...")} className="w-full py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-xl shadow-xl shadow-naturals-purple/20 hover:scale-105 transition-transform cursor-pointer">Modify Allocation</button>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "booking" && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass-card overflow-hidden grid md:grid-cols-2 shadow-2xl border border-black/5 bg-white">
              <div className="p-10 md:p-14 space-y-10 bg-[#fafafa]">
                <div>
                  <h2 className="text-3xl font-black text-deep-grape mb-2 tracking-tighter italic">Resource Allocation</h2>
                  <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">Optimizing stylist bandwidth for upcoming procedures.</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.25em] opacity-40">Procedure Category</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Haircare", "Skincare", "Makeup", "Bridal"].map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                          className={`p-5 rounded-2xl bg-white border transition-all text-xs font-black uppercase tracking-widest text-left group cursor-pointer ${selectedCategory === cat ? 'border-naturals-purple text-naturals-purple bg-naturals-purple/5 shadow-inner' : 'border-black/5 hover:border-naturals-purple/30'}`}
                        >
                          {cat} <ChevronRight className={`w-4 h-4 float-right transition-all ${selectedCategory === cat ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-40'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.25em] opacity-40">Assigned Analyst</label>
                    <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide min-h-[100px]">
                      {stylists.length > 0 ? (
                        stylists.map(s => (
                          <div 
                            key={s.id} 
                            onClick={() => setSelectedStylist(s.full_name)}
                            className={`flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group`}
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all shadow-lg ${selectedStylist === s.full_name ? 'bg-naturals-purple text-white rotate-3 scale-110' : 'bg-warm-grey text-deep-grape/20 group-hover:bg-naturals-purple/20'}`}>
                              {s.full_name.charAt(0)}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest text-center ${selectedStylist === s.full_name ? 'text-naturals-purple' : 'text-deep-grape/40'}`}>{s.full_name.split(' ')[0]}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] font-black text-deep-grape/20 uppercase tracking-widest italic pt-4">No analysts currently deployed to this node.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-14 bg-white flex flex-col justify-center border-l border-black/5">
                 <div className="p-8 rounded-[2rem] bg-deep-grape text-white mb-10 relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Activity className="w-32 h-32" />
                   </div>
                   <div className="flex items-center gap-2 text-naturals-purple font-black text-[10px] uppercase tracking-[0.3em] mb-6 relative z-10">
                     <Sparkles className="w-4 h-4" /> Optimization engine
                   </div>
                   <h3 className="text-2xl font-black mb-3 italic tracking-tighter relative z-10">Slot Identified</h3>
                   <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed relative z-10">Autonomous scheduler has balanced bandwidth and stylist specialty for maximum efficiency.</p>
                   
                   <div className="space-y-4 relative z-10">
                     <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-naturals-purple" />
                          <span className="font-black text-xs uppercase tracking-widest">Sunday, 24 March</span>
                        </div>
                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest animate-pulse">Available</span>
                     </div>
                     <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4">
                          <Clock className="w-5 h-5 text-naturals-purple" />
                          <span className="font-black text-xs uppercase tracking-widest">11:30 - 13:00 GMT+5:30</span>
                        </div>
                     </div>
                   </div>
                 </div>

                 <button 
                  onClick={handleConfirmBooking}
                  disabled={isBookingConfirmed}
                  className="w-full py-5 bg-naturals-purple text-white font-black text-xs uppercase tracking-[0.35em] rounded-2xl shadow-2xl shadow-naturals-purple/20 hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer"
                 >
                   {isBookingConfirmed ? "PROCESSING..." : "CONFIRM DEPLOYMENT"}
                 </button>
                 <p className="text-center text-[9px] font-black text-deep-grape/20 uppercase tracking-widest mt-8">
                    Data transmission encrypted. <br/> Operational logs will be updated.
                 </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "history" && (
           <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
           >
             <div className="glass-card p-16 text-center max-w-2xl mx-auto border border-black/5 bg-white shadow-xl rounded-[2rem]">
                <div className="w-24 h-24 bg-warm-grey rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <History className="w-12 h-12 text-deep-grape/10" />
                </div>
                <h3 className="text-2xl font-black text-deep-grape mb-4 italic tracking-tighter">System Audit Trail</h3>
                <p className="text-xs font-bold text-deep-grape/40 mb-10 uppercase tracking-widest leading-relaxed">Encrypted diagnostic history and previous transformation logs are currently restricted. Manual validation required.</p>
                <button onClick={() => alert("Decrypting biological logs...")} className="px-10 py-4 bg-deep-grape text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-2xl transition-all hover:scale-105 cursor-pointer">Decrypt Operational Logs</button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, label }: { active: boolean, onClick: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
        active 
          ? "bg-deep-grape text-white shadow-xl shadow-deep-grape/20" 
          : "text-deep-grape/40 hover:text-deep-grape"
      }`}
    >
      {label}
    </button>
  );
}

function QuickActionButton({ icon, label, sub, onClick }: { icon: any, label: string, sub: string, onClick?: any }) {
  return (
    <button onClick={onClick} className="glass-card p-6 bg-white border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:bg-naturals-purple/5 hover:border-naturals-purple/20 transition-all group w-full cursor-pointer shadow-sm">
      <div className="text-naturals-purple group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="font-black text-[10px] uppercase tracking-widest text-deep-grape mb-1">{label}</div>
        <div className="text-[8px] font-black text-deep-grape/30 uppercase tracking-[0.2em]">{sub}</div>
      </div>
    </button>
  );
}
