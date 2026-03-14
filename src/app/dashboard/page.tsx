"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Scissors, AlertTriangle, ArrowUpRight, ArrowDownRight, MapPin, Sparkles } from "lucide-react";

// Mock Data
const revenueData = [
  { name: 'Jan', value: 4000, bookings: 2400 },
  { name: 'Feb', value: 3000, bookings: 1398 },
  { name: 'Mar', value: 2000, bookings: 4800 },
  { name: 'Apr', value: 2780, bookings: 3908 },
  { name: 'May', value: 8890, bookings: 4800 },
  { name: 'Jun', value: 10090, bookings: 3800 },
  { name: 'Jul', value: 12000, bookings: 4300 },
];

export default function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("Month");

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-naturals-purple to-lavender mb-2">Salon Intelligence Overview</h1>
          <p className="text-deep-grape/60">Real-time metrics and AI predictions for all Naturals branches.</p>
        </div>
        
        <div className="glass flex items-center p-1 rounded-xl bg-warm-grey border border-naturals-purple/10 shadow-sm">
          {["Week", "Month", "Quarter", "Year"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                timeRange === t ? "bg-white text-naturals-purple shadow-sm" : "text-deep-grape/60 hover:text-naturals-purple"
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
          title="Total Revenue" 
          value="₹8.4M" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<TrendingUp className="text-naturals-purple w-6 h-6" />} 
        />
        <KPICard 
          title="Avg. Service Quality Score" 
          value="98.2%" 
          trend="+2.4%" 
          isPositive={true} 
          icon={<AlertTriangle className="text-lavender w-6 h-6" />} 
        />
        <KPICard 
          title="Customer Retention" 
          value="84%" 
          trend="-1.2%" 
          isPositive={false} 
          icon={<Users className="text-naturals-purple w-6 h-6" />} 
        />
        <KPICard 
          title="SOP Compliance Rate" 
          value="96.8%" 
          trend="+4.1%" 
          isPositive={true} 
          icon={<Scissors className="text-lavender w-6 h-6" />} 
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-naturals-purple/5 border-white rounded-[100px] blur-[80px]" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-xl font-bold">Revenue & Bookings Trend</h2>
            <button className="text-sm font-semibold text-naturals-purple hover:text-lavender transition-colors">Export Report</button>
          </div>
          <div className="h-72 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8E3E96" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8E3E96" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C59ACD" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C59ACD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8E3E96" opacity={0.5} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#8E3E96" opacity={0.5} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '1px solid rgba(142,62,150,0.1)', color: '#2F0137' }}
                  itemStyle={{ color: '#8E3E96' }}
                />
                <Area type="monotone" dataKey="value" stroke="#8E3E96" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="bookings" stroke="#C59ACD" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Skill Gap Predictions */}
        <div className="glass-card p-6 flex flex-col h-full relative overflow-hidden">
          <div className="flex gap-2 items-center mb-6 z-10">
            <Sparkles className="w-5 h-5 text-naturals-purple" />
            <h2 className="text-xl font-bold">AI Skill Gap Prediction</h2>
          </div>
          
          <div className="flex-1 space-y-4 z-10">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm font-bold text-orange-600 mb-1 flex items-center justify-between">
                <span>High Priority Training</span>
                <span className="text-xs bg-orange-500/20 px-2 py-0.5 rounded-md">8 Branches</span>
              </p>
              <p className="text-xs text-orange-600/80">Deficiency in L2 Hair Coloring specialists predicted for Q4 Festival season.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-naturals-purple/10 border border-naturals-purple/20">
              <p className="text-sm font-bold text-naturals-purple mb-1 flex items-center justify-between">
                <span>Keratin Certification Needed</span>
                <span className="text-xs bg-naturals-purple/20 px-2 py-0.5 rounded-md">12 Staff</span>
              </p>
              <p className="text-xs text-naturals-purple/80">Upcoming trend indicates 35% spike in Keratin requests in Chennai.</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm font-bold text-blue-600 mb-1 flex items-center justify-between">
                <span>SOP Adherence Warning</span>
                <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded-md">Coimbatore</span>
              </p>
              <p className="text-xs text-blue-600/80">Average patch-test wait time dropping below SOP mandated 24 hours.</p>
            </div>
          </div>
          <button className="mt-4 w-full py-3 rounded-xl bg-white border border-naturals-purple/10 font-bold hover:bg-warm-grey transition-colors z-10 text-sm">
            Launch Training Campaign
          </button>
        </div>
      </div>

      {/* Franchise Comparison Heatmap / Grid */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Regional Franchise Analytics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-naturals-purple/5">
                <th className="py-4 px-4 font-bold opacity-60">Branch Location</th>
                <th className="py-4 px-4 font-bold opacity-60">Revenue MTD</th>
                <th className="py-4 px-4 font-bold opacity-60">SOP Quality</th>
                <th className="py-4 px-4 font-bold opacity-60">Staff Skill Index</th>
                <th className="py-4 px-4 font-bold opacity-60">Customer Retention</th>
                <th className="py-4 px-4 font-bold opacity-60">AI Health Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Chennai • Adyar", rev: "₹1.2M", sop: 99, skill: "Expert", retention: 88, score: 96 },
                { name: "Coimbatore • RS Puram", rev: "₹980K", sop: 92, skill: "Advanced", retention: 81, score: 85 },
                { name: "Madurai • KK Nagar", rev: "₹850K", sop: 95, skill: "Expert", retention: 85, score: 91 },
                { name: "Trichy • Cantonment", rev: "₹620K", sop: 88, skill: "Intermediate", retention: 76, score: 78 },
              ].map((branch, i) => (
                <tr key={i} className="border-b border-naturals-purple/5 hover:bg-warm-grey/50 transition-colors">
                  <td className="py-4 px-4 font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-naturals-purple" /> {branch.name}</td>
                  <td className="py-4 px-4 font-medium">{branch.rev}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                       <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden w-24">
                         <div className={`h-full rounded-full ${branch.sop > 95 ? 'bg-green-500' : branch.sop > 90 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${branch.sop}%`}} />
                       </div>
                       <span className="text-xs font-bold">{branch.sop}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      branch.skill === 'Expert' ? 'bg-naturals-purple/20 text-naturals-purple' : 
                      branch.skill === 'Advanced' ? 'bg-lavender/20 text-lavender' : 
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {branch.skill}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium">{branch.retention}%</td>
                  <td className="py-4 px-4">
                    <div className="w-10 h-10 rounded-full border-2 border-naturals-purple flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(142,62,150,0.3)]">
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
      whileHover={{ y: -4 }}
      className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-naturals-purple/10 to-transparent blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-500" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-white/50 rounded-xl shadow-sm border border-white/40">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-deep-grape/60 font-medium mb-1">{title}</h3>
        <p className="text-3xl font-black text-deep-grape">{value}</p>
      </div>
    </motion.div>
  );
}
