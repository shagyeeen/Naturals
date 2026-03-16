"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Instagram, MapPin, PackageOpen, AlertCircle, ArrowUp, Calendar, Hash, LineChart } from "lucide-react";

export default function TrendIntelligence() {
  const [selectedRegion, setSelectedRegion] = useState("Chennai");
  const [isAutomating, setIsAutomating] = useState(false);

  const handleAutomateOrders = () => {
    setIsAutomating(true);
    setTimeout(() => {
      alert(`Deployment Successful: Automated procurement cycles initiated for Node ${selectedRegion} based on predictive demand mapping.`);
      setIsAutomating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
          <LineChart className="w-3 h-3" /> Protocol 04: Predictive Intelligence
        </div>
        <h1 className="text-3xl font-black text-deep-grape mb-2 flex items-center gap-3 italic tracking-tighter">
          Strategic Trend Forecasting
        </h1>
        <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">Multi-channel data synthesis for regional demand forecasting and autonomous procurement.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Social Listening & Top Trends */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-8 flex items-center gap-6 bg-white border border-black/5 shadow-sm overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:translate-x-0 transition-transform">
                 <Instagram className="w-32 h-32" />
               </div>
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-xl">
                 <Instagram className="w-7 h-7" />
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-1">Sentiment Velocity</p>
                 <p className="text-3xl font-black italic tracking-tighter">94.8<span className="text-xs text-green-500 font-bold ml-2">↑</span></p>
               </div>
            </div>

            <div className="glass-card p-8 flex items-center gap-6 border border-black/5 bg-white shadow-sm overflow-hidden relative group">
               <div className="w-14 h-14 rounded-2xl bg-deep-grape flex items-center justify-center text-white shrink-0 shadow-xl group-hover:bg-naturals-purple transition-colors">
                 <MapPin className="w-7 h-7" />
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-1">Operational Node</p>
                 <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent border-none outline-none font-black text-xl italic -ml-1 text-deep-grape tracking-tighter cursor-pointer"
                 >
                   <option className="text-black">Chennai Alpha</option>
                   <option className="text-black">Bangalore Beta</option>
                   <option className="text-black">Coimbatore Delta</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="glass-card p-10 flex-1 bg-white border border-black/5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.25em] text-deep-grape/30 mb-10 flex items-center gap-4">
              <ArrowUp className="w-5 h-5 text-naturals-purple" /> Breakout Signal Detection ({selectedRegion})
            </h2>

            <div className="space-y-6">
               <TrendItem 
                 title="Glass Dermal Therapy" 
                 signals="K-Beauty Synthesis • High Humidity adaptation" 
                 velocity="+42%" 
                 status="Breakout"
                 img="https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?w=400&q=80"
               />
               <TrendItem 
                 title="Botox Follicle Repair" 
                 signals="Frizz Mitigation • Monsoon Calibration" 
                 velocity="+35%" 
                 status="Ascending"
                 img="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80"
                 color="text-naturals-purple"
               />
               <TrendItem 
                 title="Classic Chemical Re-bonding" 
                 signals="Structural Risk • Obsolete Protocol" 
                 velocity="-18%" 
                 status="Phase Out"
                 img="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80"
                 negative
               />
            </div>

            {/* Chart Area */}
            <div className="mt-12 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-20">Volume Index (30D Timeline)</span>
                <span className="text-[9px] font-black uppercase bg-naturals-purple/10 text-naturals-purple px-3 py-1 rounded">High Confidence Modeling</span>
              </div>
              <div className="h-64 w-full rounded-[2rem] bg-warm-grey/30 border border-black/5 flex items-end px-8 gap-3 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                {[40, 45, 30, 60, 80, 75, 95, 100, 110].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-deep-grape rounded-xl hover:bg-naturals-purple transition-all cursor-pointer relative group shadow-lg"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-deep-grape text-white text-[9px] font-black px-3 py-1 rounded transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">Node D-{i+1}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Prediction */}
        <div className="glass-card p-10 flex flex-col bg-white border border-black/5 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/30 flex items-center gap-3"><PackageOpen className="w-5 h-5" /> Resource Forecast</h2>
            <Calendar className="w-5 h-5 opacity-20" />
          </div>

          <div className="flex-1 space-y-6">
             <ForecastCard 
               type="CRITICAL" 
               title="Stock Depletion Predicted" 
               reason="Based on Follicle Repair trend (+35%)"
               action="Procure 50 Units by Node Cycle 04"
               color="orange"
             />

             <ForecastCard 
               type="OPTIMIZATION" 
               title="Restock Recommendation" 
               reason="Steady Growth: Pigment Stabilization"
               action="Procure 20 Units to maintain parity"
               color="blue"
             />

             <ForecastCard 
               type="STABLE" 
               title="Asset Level Optimal" 
               reason="Keratin Balancing Units"
               color="green"
               opacity="opacity-40 hover:opacity-100"
             />
          </div>

          <button 
            onClick={handleAutomateOrders}
            disabled={isAutomating}
            className="w-full mt-10 py-5 bg-deep-grape text-white font-black text-xs tracking-[0.3em] uppercase rounded-2xl hover:bg-naturals-purple transition-all shadow-2xl shadow-deep-grape/20 disabled:opacity-50 cursor-pointer"
          >
            {isAutomating ? "SYNCHRONIZING..." : "AUTONOMOUS PROCUREMENT"}
          </button>
        </div>

      </div>
    </div>
  );
}

function TrendItem({ title, signals, velocity, status, img, negative = false, color = "text-pink-500" }: { title: string, signals: string, velocity: string, status: string, img: string, negative?: boolean, color?: string }) {
  return (
    <div className="p-5 rounded-2xl border border-black/5 bg-white flex gap-6 items-center group hover:border-naturals-purple/20 transition-all cursor-pointer shadow-sm">
      <div className={`w-20 h-20 rounded-2xl bg-cover bg-center shrink-0 shadow-lg ${negative ? 'grayscale' : ''}`} style={{ backgroundImage: `url(${img})` }}></div>
      <div className="flex-1">
        <p className="font-black text-lg italic tracking-tighter text-deep-grape mb-1">{title}</p>
        <p className={`text-[9px] font-black uppercase tracking-widest flex gap-2 items-center ${negative ? 'text-red-400' : 'text-naturals-purple'}`}><Hash className="w-3" /> {signals}</p>
      </div>
      <div className="text-right">
        <p className={`font-black text-xl italic tracking-tighter ${negative ? 'text-red-500' : 'text-green-500'}`}>{velocity}</p>
        <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">{status}</p>
      </div>
    </div>
  );
}

function ForecastCard({ type, title, reason, action, color, opacity = "" }: { type: string, title: string, reason?: string, action?: string, color: string, opacity?: string }) {
  const colors: any = {
    orange: "bg-orange-50 border-orange-200 text-orange-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600"
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} ${opacity} transition-all space-y-4`}>
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">{type}</span>
        <AlertCircle className="w-4 h-4 opacity-50" />
      </div>
      <div>
        <p className="font-black text-sm uppercase italic tracking-tighter mb-1">{title}</p>
        {reason && <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-4">{reason}</p>}
        {action && (
          <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-[10px] font-black uppercase tracking-wider border border-current opacity-70">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
