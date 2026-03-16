"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Scissors, AlertTriangle, ArrowUpRight, ArrowDownRight, MapPin, Sparkles, Activity, ShieldCheck } from "lucide-react";

// Mock Data
const revenueData = [
  { name: 'Node 01', value: 4000, bookings: 2400 },
  { name: 'Node 02', value: 3000, bookings: 1398 },
  { name: 'Node 03', value: 2000, bookings: 4800 },
  { name: 'Node 04', value: 2780, bookings: 3908 },
  { name: 'Node 05', value: 8890, bookings: 4800 },
  { name: 'Node 06', value: 10090, bookings: 3800 },
  { name: 'Node 07', value: 12000, bookings: 4300 },
];

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("Month");
  const [isExporting, setIsExporting] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`Strategic Intelligence Report (${timeRange}) encrypted and transmitted to Command Center.`);
      setIsExporting(false);
    }, 1500);
  };

  const handleLaunchCampaign = () => {
    setIsLaunching(true);
    setTimeout(() => {
      alert("Autonomous Training Modules Deployed to 25 Personnel Terminals across the Network.");
      setIsLaunching(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
            <Activity className="w-3 h-3" /> Protocol 00: Central Command Overview
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">Salon Strategic Intelligence</h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">Real-time operational metrics and autonomous predictive modeling across the franchise network.</p>
        </div>
        
        <div className="flex items-center bg-warm-grey/50 p-1.5 rounded-2xl border border-black/5 shadow-inner">
          {["P-Week", "P-Month", "P-Quarter", "P-Year"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                timeRange === t ? "bg-deep-grape text-white shadow-xl" : "text-deep-grape/40 hover:text-deep-grape"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Gross Revenue Yield" 
          value="₹8.4M" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<TrendingUp className="text-naturals-purple w-5 h-5" />} 
        />
        <KPICard 
          title="Protocol Compliance Index" 
          value="98.2%" 
          trend="+2.4%" 
          isPositive={true} 
          icon={<ShieldCheck className="text-naturals-purple w-5 h-5" />} 
        />
        <KPICard 
          title="Client Retention Velocity" 
          value="84%" 
          trend="-1.2%" 
          isPositive={false} 
          icon={<Users className="text-naturals-purple w-5 h-5" />} 
        />
        <KPICard 
          title="Operational Parity" 
          value="96.8%" 
          trend="+4.1%" 
          isPositive={true} 
          icon={<Activity className="text-naturals-purple w-5 h-5" />} 
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-10 bg-white border border-black/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp className="w-64 h-64" />
          </div>
          <div className="flex justify-between items-center mb-10 relative z-10 border-b border-black/5 pb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-deep-grape/30">Yield & Throughput Trend Analysis</h2>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="text-[10px] font-black uppercase tracking-widest text-naturals-purple hover:text-deep-grape transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting ? "TRANSMITTING..." : "GENERATE AUDIT"}
            </button>
          </div>
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8E3E96" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8E3E96" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#2F0137" opacity={0.2} tickMargin={20} axisLine={false} tickLine={false} fontSize={10} fontWeight={900} />
                <YAxis stroke="#2F0137" opacity={0.2} axisLine={false} tickLine={false} fontSize={10} fontWeight={900} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2F0137', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8E3E96" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Skill Gap Predictions */}
        <div className="glass-card p-10 flex flex-col h-full relative overflow-hidden bg-deep-grape text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-10 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex gap-4 items-center mb-10 z-10">
            <Sparkles className="w-5 h-5 text-naturals-purple" />
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/40">Autonomous Skill Allocation</h2>
          </div>
          
          <div className="flex-1 space-y-6 z-10">
            <PredictionItem 
              type="CRITICAL" 
              title="Capacity Bridge Missing" 
              desc="Deficiency in L2 Coloration Specialists predicted for Node Cycle Q4."
              count="08 Nodes"
            />
            <PredictionItem 
              type="STRATEGIC" 
              title="Calibration Required" 
              desc="Spike in Molecular Restoration demand detected at Node: MAA."
              count="12 Staff"
              color="text-naturals-purple"
            />
            <PredictionItem 
              type="AUDIT" 
              title="Protocol Variance Detection" 
              desc="Wait-time operational limits breached at Node: CJB."
              count="Delta Trigger"
              color="text-orange-400"
            />
          </div>
          <button 
            onClick={handleLaunchCampaign}
            disabled={isLaunching}
            className="mt-10 w-full py-5 rounded-2xl bg-white text-deep-grape font-black text-[10px] uppercase tracking-[0.3em] hover:bg-naturals-purple hover:text-white transition-all z-10 cursor-pointer disabled:opacity-50 shadow-2xl"
          >
            {isLaunching ? "INITIALIZING..." : "DEPLOY ACADEMY PROTOCOL"}
          </button>
        </div>
      </div>

      {/* Franchise Comparison Heatmap / Grid */}
      <div className="glass-card p-10 bg-white border border-black/5 shadow-sm overflow-hidden">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-deep-grape/30 mb-8 italic">Network Node Accountability Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-warm-grey">
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40">Operational Node</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40">Yield MTD</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40">Protocol Index</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40">Skill Authority</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40">Retention Velocity</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-deep-grape/40 italic">Audit Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { name: "Node: MAA • Alpha", rev: "₹1.2M", sop: 99, skill: "COMMAND", retention: 88, score: 96 },
                { name: "Node: CJB • Beta", rev: "₹980K", sop: 92, skill: "ADVANCED", retention: 81, score: 85 },
                { name: "Node: IXM • Gamma", rev: "₹850K", sop: 95, skill: "COMMAND", retention: 85, score: 91 },
                { name: "Node: TRZ • Delta", rev: "₹620K", sop: 88, skill: "MEDIAL", retention: 76, score: 78 },
              ].map((branch, i) => (
                <tr key={i} className="hover:bg-warm-grey/30 transition-all group">
                  <td className="py-5 px-6 font-black text-xs italic text-deep-grape flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-naturals-purple group-hover:scale-110 transition-transform" /> {branch.name}
                  </td>
                  <td className="py-5 px-6 font-black text-xs text-deep-grape/60 tracking-wider font-mono">{branch.rev}</td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                       <div className="w-32 h-1.5 bg-warm-grey rounded-full overflow-hidden shadow-inner">
                         <div className={`h-full rounded-full ${branch.sop > 95 ? 'bg-green-500' : 'bg-orange-400'}`} style={{width: `${branch.sop}%`}} />
                       </div>
                       <span className="text-[10px] font-black italic">{branch.sop}%</span>
                     </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="px-3 py-1 bg-deep-grape text-white text-[9px] font-black uppercase tracking-widest rounded-lg italic">
                      {branch.skill}
                    </span>
                  </td>
                  <td className="py-5 px-6 font-black text-xs text-deep-grape/60 italic">{branch.retention}%</td>
                  <td className="py-5 px-6">
                    <div className="w-12 h-12 rounded-xl border-4 border-deep-grape flex items-center justify-center font-black text-sm italic shadow-2xl bg-white text-deep-grape transform rotate-3 hover:rotate-0 transition-transform">
                      {branch.score}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function KPICard({ title, value, trend, isPositive, icon }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-10 border border-black/5 bg-white relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-naturals-purple opacity-[0.03] blur-[40px] rounded-full group-hover:opacity-[0.08] transition-opacity" />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3.5 bg-warm-grey/50 rounded-2xl border border-black/5 group-hover:bg-deep-grape group-hover:text-white transition-all shadow-inner">
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] font-black italic px-3 py-1 rounded-lg ${isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/30 mb-2">{title}</h3>
        <p className="text-3xl font-black text-deep-grape italic tracking-tighter">{value}</p>
      </div>
    </motion.div>
  );
}

function PredictionItem({ type, title, desc, count, color = "text-white" }: { type: string, title: string, desc: string, count: string, color?: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{type}</span>
        <span className="text-[10px] font-black bg-naturals-purple px-3 py-1 rounded-lg italic">{count}</span>
      </div>
      <h4 className="font-black text-sm uppercase tracking-wider mb-2 italic tracking-tighter">{title}</h4>
      <p className="text-[10px] font-bold text-white/50 leading-relaxed uppercase tracking-widest">{desc}</p>
    </div>
  );
}
