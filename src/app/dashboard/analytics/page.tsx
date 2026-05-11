"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Timer,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function WorkAnalytics() {
  const { profile, isAdmin, isStylist } = useAuth();
  const [stats, setStats] = useState({
    totalWorkHours: 0,
    appointmentsCount: 0,
    avgServiceTime: 0,
    activeCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [workloadData, setWorkloadData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const WORK_HOURS_PER_DAY = 9; // 10 AM to 7 PM (9 hours)

  useEffect(() => {
    if (profile?.id) {
      fetchAnalytics();
    } else if (!loading) {
      setLoading(false);
    }
  }, [profile, timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("[Analytics] Fetching for user:", profile?.id);

      // 1. Get Stylist Record
      let stylistId = null;

      if (isStylist) {
        const { data: stylistRecord, error: stylistError } = await supabase
          .from('stylists')
          .select('id')
          .eq('user_id', profile?.id)
          .single();

        if (stylistError || !stylistRecord) {
          console.error("[Analytics] Stylist record not found:", stylistError);
          setError("Stylist profile not linked. Please ensure your stylist account is properly configured.");
          setLoading(false);
          return;
        }
        stylistId = stylistRecord.id;
      } else {
        // For Admins/Managers, we'll fetch branch-wide analytics or the first available stylist
        // For now, let's just fetch the first active stylist to avoid the crash
        const { data: firstStylist } = await supabase
          .from('stylists')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();
        
        if (!firstStylist) {
          setError("No active stylists found to analyze.");
          setLoading(false);
          return;
        }
        stylistId = firstStylist.id;
      }

      const now = new Date();
      // Use local date string for consistent DB filtering
      const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
      
      let startDateStr = todayStr;
      if (timeframe === 'week') {
        const d = new Date();
        d.setDate(now.getDate() - 7);
        startDateStr = d.toLocaleDateString('en-CA');
      } else if (timeframe === 'month') {
        const d = new Date();
        d.setMonth(now.getMonth() - 1);
        startDateStr = d.toLocaleDateString('en-CA');
      }

      console.log("[Analytics] Querying from:", startDateStr, "for timeframe:", timeframe);

      // 2. Fetch Appointments
      const { data: appts, error: apptError } = await supabase
        .from('appointments')
        .select('*, services(duration_minutes)')
        .eq('stylist_id', stylistId)
        .in('status', ['completed', 'confirmed', 'pending'])
        .gte('appointment_date', timeframe === 'today' ? todayStr : startDateStr)
        .lte('appointment_date', todayStr);

      if (apptError) {
        console.error("[Analytics] Supabase Query Error:", apptError);
        throw apptError;
      }

      const validAppts = appts || [];
      console.log("[Analytics] Found appointments:", validAppts.length);

      // 3. Helper to get duration safely
      const getDuration = (appt: any) => {
        // Supabase join might return an array or object depending on relationship discovery
        const service = Array.isArray(appt.services) ? appt.services[0] : appt.services;
        return service?.duration_minutes || 60;
      };

      // 4. Process Stats
      const totalMinutes = validAppts.reduce((sum, a) => sum + getDuration(a), 0);
      const avgTime = validAppts.length > 0 ? totalMinutes / validAppts.length : 0;
      
      setStats({
        totalWorkHours: parseFloat((totalMinutes / 60).toFixed(1)),
        appointmentsCount: validAppts.length,
        avgServiceTime: Math.round(avgTime),
        activeCustomers: new Set(validAppts.map(a => a.customer_id)).size || 0
      });

      // 5. Process Chart Data
      const processWorkloadData = () => {
        if (timeframe === 'today') {
          const hourlyData: any[] = [];
          for (let hour = 10; hour <= 19; hour++) {
            const label = `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`;
            hourlyData.push({ name: label, 'Appointments': 0, 'Active Minutes': 0, hour: hour });
          }

          validAppts.forEach(a => {
            if (a.appointment_date === todayStr) {
              const startHour = parseInt(a.start_time.split(':')[0]);
              const slot = hourlyData.find(s => s.hour === startHour);
              if (slot) {
                slot['Appointments'] += 1;
                slot['Active Minutes'] += getDuration(a);
              }
            }
          });
          return hourlyData;
        } else if (timeframe === 'week') {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dataMap: any = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA');
            dataMap[dateStr] = { name: days[d.getDay()], 'Appointments': 0, 'Work Hours': 0 };
          }
          validAppts.forEach(a => {
            if (dataMap[a.appointment_date]) {
              dataMap[a.appointment_date]['Appointments'] += 1;
              dataMap[a.appointment_date]['Work Hours'] += getDuration(a) / 60;
            }
          });
          return Object.values(dataMap);
        } else {
          const data = [
            { name: 'W1', 'Appointments': 0, 'Work Hours': 0 },
            { name: 'W2', 'Appointments': 0, 'Work Hours': 0 },
            { name: 'W3', 'Appointments': 0, 'Work Hours': 0 },
            { name: 'W4', 'Appointments': 0, 'Work Hours': 0 },
          ];
          validAppts.forEach(a => {
            const apptDate = new Date(a.appointment_date);
            const weekIdx = Math.floor(apptDate.getDate() / 8);
            if (data[weekIdx]) {
              data[weekIdx]['Appointments'] += 1;
              data[weekIdx]['Work Hours'] += getDuration(a) / 60;
            }
          });
          return data;
        }
      };

      setWorkloadData(processWorkloadData());

    } catch (err: any) {
      console.error("[Analytics] Final Error Block:", err);
      setError(err.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    { name: "Total Work Hours", value: `${stats.totalWorkHours}h`, icon: Clock, trend: "Shift Total" },
    { name: "Total Appointments", value: stats.appointmentsCount, icon: Calendar, trend: "Current Period" },
    { name: "Avg Service Time", value: `${stats.avgServiceTime}m`, icon: Timer, trend: "Per Service" },
    { name: "Active Clients", value: stats.activeCustomers, icon: Users, trend: "Unique Reached", href: "/dashboard/appointments" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naturals-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center border-red-500/20 bg-red-50">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-xl font-black text-red-900 mb-2 uppercase tracking-tighter">Analytics Error</h3>
        <p className="text-red-700/60 font-medium mb-8">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="px-8 py-3 rounded-xl bg-red-500 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
            <Activity className="w-3 h-3" /> Professional Timeline
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
            {isStylist ? "Work Analytics" : "Branch Performance"}
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">
            {isStylist ? "Detailed tracking of your service volume and time utilization." : "Aggregated view of stylist efficiency and booking density."}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-warm-grey/50 p-1 rounded-xl border border-black/5">
          {(['today', 'week', 'month'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                timeframe === t 
                  ? "bg-naturals-purple text-white shadow-lg" 
                  : "text-deep-grape/40 hover:text-deep-grape"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, idx) => {
          const CardContent = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 border border-black/5 hover:border-naturals-purple/20 transition-all group h-full cursor-pointer hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-warm-grey text-naturals-purple group-hover:bg-naturals-purple group-hover:text-white transition-all">
                  <metric.icon className="w-5 h-5" />
                </div>
                <div className="text-[9px] font-black text-deep-grape/20 uppercase tracking-widest">
                  {metric.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">{metric.name}</p>
              <h3 className="text-2xl font-black text-deep-grape italic tracking-tight">{metric.value}</h3>
            </motion.div>
          );

          if (metric.href) {
            return (
              <Link href={metric.href} key={metric.name} className="block outline-none">
                {CardContent}
              </Link>
            );
          }

          return <div key={metric.name}>{CardContent}</div>;
        })}
      </div>

      {/* Main Timeline Chart */}
      <div className="glass-card p-10 border border-black/5 bg-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-deep-grape italic tracking-tighter uppercase">Booking Timeline</h3>
            <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mt-1">Operational Hours Analysis • 10:00 AM - 07:00 PM</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-naturals-purple shadow-[0_0_10px_#8E3E9640]" />
              <span className="text-[10px] font-black uppercase text-deep-grape/40 tracking-widest">Appointments</span>
            </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={workloadData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8E3E96" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#8E3E96" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#8E3E9615" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#14002D60' }} 
                dy={15}
                interval={timeframe === 'today' ? 0 : 'preserveStartEnd'}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#14002D60' }} 
                allowDecimals={false}
              />
              <RechartsTooltip 
                cursor={{ stroke: '#8E3E96', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: '1px solid rgba(142,62,150,0.1)', 
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '1.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area 
                type="linear" 
                dataKey="Appointments" 
                stroke="#8E3E96" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAppointments)" 
                animationDuration={1500}
                dot={{ r: 4, fill: '#8E3E96', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#8E3E96', stroke: '#fff', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Utilization & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 border border-black/5 bg-white shadow-xl">
           <div className="flex items-center gap-3 mb-8">
              <Timer className="w-6 h-6 text-naturals-purple" />
              <h3 className="text-xl font-black text-deep-grape italic tracking-tighter uppercase">Shift Density Analysis</h3>
           </div>
           
           {workloadData.length > 0 ? (
             <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <p className="text-[10px] font-black text-deep-grape/40 uppercase tracking-[0.2em]">Service Occupancy</p>
                         <p className="text-2xl font-black text-naturals-purple italic">
                           {(() => {
                             const possibleHours = timeframe === 'today' ? WORK_HOURS_PER_DAY : timeframe === 'week' ? WORK_HOURS_PER_DAY * 7 : WORK_HOURS_PER_DAY * 30;
                             const ratio = stats.totalWorkHours / possibleHours;
                             return `${Math.round(Math.min(ratio * 100, 100))}%`;
                           })()}
                         </p>
                      </div>
                      <div className="h-4 w-full bg-warm-grey rounded-full overflow-hidden p-1 border border-black/5">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stats.totalWorkHours / (timeframe === 'today' ? WORK_HOURS_PER_DAY : timeframe === 'week' ? WORK_HOURS_PER_DAY * 7 : WORK_HOURS_PER_DAY * 30)) * 100, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-naturals-purple rounded-full shadow-[0_0_15px_#8E3E9660]"
                         />
                      </div>
                   </div>
                   
                   <div className="p-6 rounded-3xl bg-warm-grey/40 border border-black/5 flex items-center gap-6">
                      <div className="p-4 rounded-2xl bg-white shadow-sm">
                         <Activity className="w-6 h-6 text-naturals-purple" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Peak Utilization</p>
                         <p className="text-xs font-black text-deep-grape italic">
                           {(() => {
                             const maxAppts = Math.max(...workloadData.map(d => d.Appointments || 0));
                             if (maxAppts === 0) return "No bookings detected for this period.";
                             const peakSlots = workloadData.filter(d => d.Appointments === maxAppts);
                             if (peakSlots.length === 1) return `Highest volume detected at ${peakSlots[0].name}.`;
                             if (peakSlots.length > 1 && peakSlots.length < 4) return `Peak volumes detected at ${peakSlots.map(p => p.name).join(', ')}.`;
                             return "High volume spread across multiple hours.";
                           })()}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-black/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div>
                      <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Total Hours</p>
                      <p className="text-lg font-black text-deep-grape">{stats.totalWorkHours}h</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Free {timeframe === 'today' ? 'Hours' : timeframe === 'week' ? 'Days' : 'Weeks'}</p>
                      <p className="text-lg font-black text-deep-grape">{workloadData.length - workloadData.filter(d => d.Appointments > 0).length}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Busy {timeframe === 'today' ? 'Hours' : timeframe === 'week' ? 'Days' : 'Weeks'}</p>
                      <p className="text-lg font-black text-deep-grape">{workloadData.filter(d => d.Appointments > 0).length}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Shift Efficiency</p>
                      <p className="text-lg font-black text-naturals-purple italic">
                        {(() => {
                          const possibleHours = timeframe === 'today' ? WORK_HOURS_PER_DAY : timeframe === 'week' ? WORK_HOURS_PER_DAY * 7 : WORK_HOURS_PER_DAY * 30;
                          const ratio = stats.totalWorkHours / possibleHours;
                          if (ratio === 0) return "Idle";
                          if (ratio < 0.3) return "Low";
                          if (ratio < 0.6) return "Moderate";
                          if (ratio < 0.85) return "High";
                          return "Maximum";
                        })()}
                      </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="py-12 text-center">
                <Sparkles className="w-16 h-16 text-deep-grape/5 mx-auto mb-6" />
                <p className="text-[11px] font-black text-deep-grape/40 uppercase tracking-[0.3em]">No service data found for this period.</p>
             </div>
           )}
        </div>

        <div className="glass-card p-10 border border-black/5 bg-white shadow-xl flex flex-col justify-center items-center text-center">
           <div className="w-20 h-20 rounded-[2.5rem] bg-naturals-purple/10 flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-naturals-purple" />
           </div>
           <h4 className="text-lg font-black text-deep-grape uppercase tracking-widest mb-2">Client Reach</h4>
           <p className="text-xs font-medium text-deep-grape/40 max-w-[200px] mb-8">You have managed services for {stats.activeCustomers} unique customers in this period.</p>
           <Link href="/dashboard/appointments" className="block w-full">
             <button className="w-full py-4 rounded-2xl bg-naturals-purple text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-naturals-purple/20 hover:scale-[1.02] transition-transform">
                View History
             </button>
           </Link>
        </div>
      </div>
    </div>
  );
}
