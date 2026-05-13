"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ClipboardCheck, 
  Video, 
  Activity, 
  Clock, 
  FileText, 
  Download, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Shield,
  Zap,
  Award,
  BookOpen,
  Target,
  Trophy,
  Scan,
  Cpu,
  Fingerprint,
  RefreshCw,
  MoreVertical,
  Scissors,
  UserCheck,
  Heart,
  Sparkles,
  Star,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Maximize2,
  Volume2,
  MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProtocolAccreditation() {
  const [activeTab, setActiveTab] = useState<"accreditation" | "audit" | "workflow">("accreditation");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [showAuditResult, setShowAuditResult] = useState(false);
  const [personnelGrade, setPersonnelGrade] = useState("L2_ADVANCED");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [showDeploymentMap, setShowDeploymentMap] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationLog, setOptimizationLog] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [isAuditingProficiency, setIsAuditingProficiency] = useState(false);
  const [proficiencyMetrics, setProficiencyMetrics] = useState({
    precision: 0,
    ergonomics: 0,
    speed: 0
  });
  
  // Real-time workflow data
  const [liveQueue, setLiveQueue] = useState<any[]>([]);
  const [activeStaff, setActiveStaff] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const [apptRes, staffRes, invRes] = await Promise.all([
        supabase.from('appointments').select('*, customer:customer_id(full_name), service:service_id(name)').eq('appointment_date', today).order('start_time'),
        supabase.from('stylists').select('*').eq('is_active', true),
        supabase.from('inventory').select('*').lt('current_stock', 10).limit(5)
      ]);

      setLiveQueue(apptRes.data || []);
      setActiveStaff(staffRes.data || []);
      setInventoryAlerts(invRes.data || []);
    } catch (err) {
      console.error("Workflow Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debug log to check if component renders
  useEffect(() => {
    console.log("ProtocolAccreditation Component Mounted");
  }, []);

  // --- Audit Logic ---
  const handleStartAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const steps = [5, 15, 30, 45, 60, 75, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setAuditProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAuditing(false);
          setShowAuditResult(true);
        }, 500);
      }
    }, 400);
  };

  const handleOptimizeDistribution = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setOptimizationLog([]);

    const logs = [
      "Analyzing live appointment queue...",
      "Mapping staff specialties to zone demand...",
      "Recalibrating station occupancy for peak throughput...",
      "Minimizing inter-zone transit delays...",
      "Finalizing autonomous reallocation map."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < 5) {
        setOptimizationProgress((i + 1) * 20);
        setOptimizationLog(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Simulate shuffling staff for "optimization"
          const shuffled = [...activeStaff].sort(() => Math.random() - 0.5);
          setActiveStaff(shuffled);
          setIsOptimizing(false);
          setToastMessage("Distribution Optimized: Staff reallocated to maximize throughput.");
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 5000);
        }, 800);
      }
    }, 1000);
  };

  const startProficiencyAudit = () => {
    setIsAuditingProficiency(true);
    let count = 0;
    const interval = setInterval(() => {
      if (count < 100) {
        setProficiencyMetrics({
          precision: 85 + Math.random() * 10,
          ergonomics: 78 + Math.random() * 15,
          speed: 92 + Math.random() * 5
        });
        count++;
      } else {
        clearInterval(interval);
        setIsAuditingProficiency(false);
        setToastMessage("Audit Complete: Proficiency verified at 94.2% precision.");
        setShowSuccessToast(true);
      }
    }, 100);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-naturals-purple/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-black/5 flex gap-1">
            {[
              { id: "accreditation", label: "Accreditation", icon: Award },
              { id: "audit", label: "Remote Audit", icon: Video },
              { id: "workflow", label: "Workflow", icon: ClipboardCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-naturals-purple text-white shadow-lg shadow-naturals-purple/20" 
                    : "text-deep-grape/40 hover:text-deep-grape hover:bg-black/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {activeTab === "accreditation" && (
              <motion.div
                key="accreditation-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Header Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-naturals-purple via-fuchsia-500 to-indigo-500" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-naturals-purple/5 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] border border-naturals-purple/10">
                        <ShieldCheck className="w-3.5 h-3.5" /> Service Standards
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-deep-grape tracking-tighter italic leading-none">
                        Professional Quality Audit
                      </h1>
                      <p className="text-deep-grape/40 font-bold uppercase tracking-widest text-xs max-w-2xl leading-relaxed">
                        Advanced personnel benchmarking and autonomous skill assessment for regional franchise operational parity.
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] font-black text-deep-grape/20 uppercase tracking-[0.3em]">Personnel Grade</span>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#1A0B2E] text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-900/20 flex items-center gap-4 border border-white/10 group/grade cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover/grade:bg-naturals-purple/50 transition-colors">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black italic tracking-tighter">{personnelGrade}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Progression Track */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center gap-4 mb-4 px-2">
                      <Activity className="w-5 h-5 text-naturals-purple opacity-40" />
                      <h3 className="text-xs font-black text-deep-grape/30 uppercase tracking-[0.4em]">Progression Track: L3 Operational Authority</h3>
                    </div>

                    <TaskItem 
                      status="completed"
                      title="Foundational Chromatic Theory"
                      subtitle="Audit Score: 92% • Valid through Q4 2026"
                      onAction={handleStartAudit}
                      actionLabel="RE-AUDIT"
                    />

                    <TaskItem 
                      status="pending"
                      title="Structural Molecular Restoration"
                      subtitle="Mastery of high-density chemical bonding, thermal mitigation strategies, and autonomous diagnostic mapping."
                      tags={["DEMAND SPIKE", "PROFICIENCY TEST PENDING"]}
                      onAction={() => {
                        setToastMessage("Initializing Neural Proficiency Test Interface...");
                        setShowSuccessToast(true);
                        setTimeout(() => setShowSuccessToast(false), 5000);
                      }}
                      actionLabel="START TEST"
                    />

                    <TaskItem 
                      status="locked"
                      title="Cranial Symmetry & Volumetric Mapping"
                      subtitle="Unlock L3 Advanced status to access precision style standards."
                      actionLabel="LOCKED"
                    />
                  </div>

                  {/* Verified Accreditations */}
                  <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-black/5 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <Star className="w-5 h-5 text-naturals-purple/60" />
                      <h3 className="text-xs font-black text-deep-grape/40 uppercase tracking-[0.3em]">Verified Accreditations</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <BadgeCard icon={Scissors} label="Precision Cutting" active={activeBadge === "cutting"} onClick={() => setActiveBadge("cutting")} />
                      <BadgeCard icon={Shield} label="SOP Auditor" active={activeBadge === "sop"} onClick={() => setActiveBadge("sop")} />
                      <BadgeCard icon={Heart} label="CX Optimization" active={activeBadge === "cx"} onClick={() => setActiveBadge("cx")} />
                      <BadgeCard icon={Sparkles} label="Hygiene Standards" active={activeBadge === "sterility"} onClick={() => setActiveBadge("sterility")} />
                    </div>

                    <div className="mt-8 p-6 bg-black/[0.02] border border-black/[0.03] rounded-3xl">
                      <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-4">System Insight</p>
                      <p className="text-sm font-bold text-deep-grape/60 italic leading-relaxed">
                        "Personnel demonstrates high dexterity in chemical application but requires calibration on thermal mitigation timing."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "audit" && (
              <motion.div 
                key="audit-view" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.02 }}
                className="bg-white rounded-[2.5rem] p-12 text-center border border-black/5 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-naturals-purple/5 to-transparent" />
                
                {isAuditingProficiency ? (
                  <div className="relative z-10 w-full max-w-2xl space-y-8">
                    {/* Simulated Camera Feed */}
                    <div className="relative aspect-video bg-[#0A0514] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0514] to-transparent opacity-60" />
                      
                      {/* Scanning Lines */}
                      <motion.div 
                        className="absolute inset-x-0 h-0.5 bg-naturals-purple shadow-[0_0_15px_rgba(142,62,150,0.8)] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      />

                      {/* AI Markers */}
                      <div className="absolute inset-0 z-10 p-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">REC • 1080P</span>
                            </div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">ISO 400 • F/2.8 • 1/60</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-naturals-purple uppercase tracking-widest">Neural Stream v4.2</p>
                            <p className="text-[14px] font-black text-white italic">OPERATOR_391</p>
                          </div>
                        </div>
                        
                        {/* Center Focus */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                            <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                              <div className="w-16 h-16 border-2 border-naturals-purple/40 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Telemetry */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 border border-black/5 p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Precision</p>
                        <p className="text-xl font-black text-naturals-purple italic">{proficiencyMetrics.precision.toFixed(1)}%</p>
                      </div>
                      <div className="bg-white/5 border border-black/5 p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Ergonomics</p>
                        <p className="text-xl font-black text-deep-grape italic">{proficiencyMetrics.ergonomics.toFixed(1)}%</p>
                      </div>
                      <div className="bg-white/5 border border-black/5 p-4 rounded-2xl">
                        <p className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Speed Index</p>
                        <p className="text-xl font-black text-deep-grape italic">{proficiencyMetrics.speed.toFixed(1)}x</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsAuditingProficiency(false)}
                      className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all"
                    >
                      Terminate Audit
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-lavender rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Video className="w-10 h-10 text-naturals-purple animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-deep-grape">Proficiency Audit Interface</h2>
                    <p className="text-deep-grape/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 max-w-md mx-auto leading-relaxed">
                      Initialize visual monitoring for technical proficiency assessment. AI will audit movement precision, ergonomics, and speed.
                    </p>
                    <button 
                      onClick={startProficiencyAudit}
                      className="mt-12 px-10 py-4 bg-deep-grape text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-naturals-purple transition-all shadow-2xl"
                    >
                      Initialize Interface
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "workflow" && (
              <motion.div 
                key="workflow-view" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-12 gap-8"
              >
                {/* Live Operations Queue */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      <h3 className="text-xs font-black text-deep-grape/30 uppercase tracking-[0.4em]">Live Operations Queue</h3>
                    </div>
                    <button onClick={fetchWorkflowData} className="p-2 hover:bg-black/5 rounded-xl transition-all">
                      <RefreshCw className={`w-4 h-4 text-naturals-purple ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {liveQueue.length > 0 ? liveQueue.map((appt, idx) => (
                      <div key={appt.id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex items-center justify-between group hover:border-naturals-purple/20 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-warm-grey flex items-center justify-center text-deep-grape/20 font-black italic text-xl">
                            {appt.start_time.slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-lg font-black italic tracking-tight text-deep-grape">{(appt.service as any)?.name || 'Premium Service'}</h4>
                            <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">{(appt.customer as any)?.full_name} • ID: {appt.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            appt.status === 'confirmed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                            appt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          }`}>
                            {appt.status}
                          </span>
                          <button className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-deep-grape/40 hover:bg-naturals-purple hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="bg-white/50 border border-dashed border-black/10 rounded-[2.5rem] p-20 text-center">
                        <Calendar className="w-12 h-12 text-deep-grape/5 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-deep-grape/20 uppercase tracking-[0.2em]">No active sessions in queue</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operations Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Staff Deployment */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.3em]">Staff Deployment</h3>
                      <UserCheck className="w-4 h-4 text-naturals-purple/40" />
                    </div>
                    <div className="space-y-4">
                      {activeStaff.slice(0, 4).map(staff => (
                        <div key={staff.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-naturals-purple/10 flex items-center justify-center text-naturals-purple font-black text-[10px]">
                              {staff.full_name[0]}
                            </div>
                            <span className="text-xs font-bold text-deep-grape">{staff.full_name}</span>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      ))}
                        <button 
                          onClick={() => setShowDeploymentMap(true)}
                          className="w-full py-3 bg-warm-grey rounded-xl text-[9px] font-black text-deep-grape/40 uppercase tracking-widest hover:bg-lavender hover:text-naturals-purple transition-all"
                        >
                          View Deployment Map
                        </button>
                    </div>
                  </div>

                  {/* Inventory Alerts */}
                  <div className="bg-[#1A0B2E] text-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                      <Zap className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Critical Alerts</h3>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="space-y-4">
                        {inventoryAlerts.length > 0 ? inventoryAlerts.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-tight">{item.product_name}</p>
                              <p className="text-[8px] font-bold text-white/40 uppercase">Stock: {item.current_stock} {item.unit}</p>
                            </div>
                            <button className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )) : (
                          <p className="text-[9px] font-bold text-white/30 italic text-center py-4">All logistics within threshold</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isAuditing && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#0A0514]/90 backdrop-blur-2xl" />
            <div className="relative z-10 w-full max-w-xl text-center space-y-8">
              <div className="relative inline-block">
                <motion.div 
                  className="w-32 h-32 rounded-full border-2 border-naturals-purple/30 flex items-center justify-center relative"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <Cpu className="w-12 h-12 text-naturals-purple" />
                </motion.div>
                <motion.div 
                  className="absolute inset-[-10px] rounded-full border border-naturals-purple/50 border-t-transparent"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Initializing AI Personnel Audit</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Scanning regional footage archives</p>
              </div>

              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-naturals-purple to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${auditProgress}%` }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {auditProgress > 20 && <StatusTag label="BIO-METRIC SYNC" />}
                {auditProgress > 45 && <StatusTag label="DEXTERITY MAPPING" />}
                {auditProgress > 70 && <StatusTag label="SOP VALIDATION" />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuditResult && (
          <motion.div 
            className="fixed inset-0 z-[101] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAuditResult(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden"
            >
              <div className="bg-[#1A0B2E] p-8 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter leading-none">Audit Report</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] mt-2">Foundational Chromatic Theory • Signature: ANJ-882</p>
                </div>
                <button onClick={() => setShowAuditResult(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="flex items-center gap-10">
                  <div className="w-32 h-32 rounded-[2rem] bg-naturals-purple/5 border-2 border-naturals-purple/20 flex flex-col items-center justify-center shadow-inner shrink-0">
                    <span className="text-5xl font-black text-naturals-purple tabular-nums tracking-tighter">95</span>
                    <span className="text-[10px] font-black text-naturals-purple/40 uppercase tracking-widest mt-1">Score</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h4 className="text-lg font-black italic tracking-tighter">Performance Analysis</h4>
                    <p className="text-deep-grape/60 font-medium text-sm leading-relaxed">
                      "Stylist demonstrates exceptional precision in sectional application. Neural mapping detected a 4.2% increase in dexterity."
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-[9px] font-black tracking-widest uppercase">Excellent Dexterity</span>
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 text-[9px] font-black tracking-widest uppercase">98% Compliance</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.3em]">Verified Sub-Scores</h5>
                    <div className="space-y-4">
                      <ScoreBar label="Precision" score={98} />
                      <ScoreBar label="Symmetry" score={94} />
                      <ScoreBar label="Management" score={89} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.3em]">Strategic Recommendation</h5>
                    <div className="bg-black/[0.02] border border-black/[0.05] p-5 rounded-2xl">
                      <p className="text-xs font-bold text-deep-grape/70 leading-relaxed italic">
                        Eligible for L3 Advanced Certification track upon completion of module.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-naturals-purple text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-naturals-purple/20 hover:scale-[1.02] transition-transform cursor-pointer">
                    Download Certificate
                  </button>
                  <button onClick={() => setShowAuditResult(false)} className="flex-1 py-4 border border-black/10 text-deep-grape font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black/5 transition-colors cursor-pointer">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Deployment Map Modal --- */}
      <AnimatePresence>
        {showDeploymentMap && (
          <motion.div 
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#0A0514]/80 backdrop-blur-xl" onClick={() => setShowDeploymentMap(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-warm-grey/30">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-deep-grape">Stylist Deployment Map</h3>
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">Real-time personnel distribution • Regional Hub: Chennai South</p>
                </div>
                <button onClick={() => setShowDeploymentMap(false)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-warm-grey/10">
                <div className="grid grid-cols-4 gap-8">
                  {/* Map Legend */}
                  <div className="col-span-4 flex gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-naturals-purple shadow-[0_0_10px_rgba(142,62,150,0.5)]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">Active Station</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white border border-black/10" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">Available Zone</span>
                    </div>
                  </div>

                  {/* Salon Grid Layout */}
                  {['Zone A - Hair Artistry', 'Zone B - Skin Therapy', 'Zone C - Premium Spa', 'Zone D - Diagnostics'].map((zone, zIdx) => (
                    <div key={zone} className="space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <MapPin className="w-3 h-3 text-naturals-purple" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-deep-grape/60">{zone}</h4>
                      </div>
                      <div className="grid gap-4">
                        {[1, 2, 3].map(station => {
                          const staff = activeStaff[zIdx * 3 + (station - 1)];
                          const isOccupied = !!staff;
                          return (
                            <motion.div 
                              key={station}
                              whileHover={{ y: -5 }}
                              className={`p-6 rounded-3xl border transition-all ${
                                isOccupied ? 'bg-white border-naturals-purple shadow-lg shadow-naturals-purple/5' : 'bg-white/40 border-black/5 border-dashed'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[8px] font-black text-deep-grape/20 uppercase tracking-widest">Station {zIdx + 1}-{station}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-green-500 animate-pulse' : 'bg-black/10'}`} />
                              </div>
                              
                              {isOccupied ? (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-naturals-purple text-white flex items-center justify-center font-black text-xs shadow-md">
                                      {staff.full_name[0]}
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-deep-grape">{staff.full_name}</p>
                                      <p className="text-[8px] font-black text-naturals-purple uppercase tracking-widest">{staff.specialty || 'Stylist'}</p>
                                    </div>
                                  </div>
                                  <div className="pt-3 border-t border-black/5">
                                    <span className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest block mb-1">Current Service</span>
                                    <p className="text-[10px] font-bold text-deep-grape italic">Active Engagement</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-6 text-center">
                                  <Plus className="w-5 h-5 text-deep-grape/5 mx-auto mb-2" />
                                  <p className="text-[8px] font-black text-deep-grape/20 uppercase tracking-widest">Ready for Deployment</p>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-white border-t border-black/5 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest">Occupancy Rate</span>
                    <span className="text-lg font-black text-naturals-purple">{Math.round((activeStaff.length / 12) * 100)}%</span>
                  </div>
                  <div className="px-6 py-3 bg-warm-grey rounded-2xl border border-black/5 flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-deep-grape/30 uppercase tracking-widest">Wait Time Avg</span>
                    <span className="text-lg font-black text-deep-grape">12m</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleOptimizeDistribution}
                    disabled={isOptimizing}
                    className="px-8 py-4 bg-deep-grape text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-naturals-purple transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                  >
                    {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    {isOptimizing ? 'Optimizing...' : 'Optimize Distribution'}
                  </button>
                </div>
              </div>

              {/* Optimization Overlay */}
              <AnimatePresence>
                {isOptimizing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#0A0514]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="relative mb-12">
                      <motion.div 
                        className="w-32 h-32 rounded-full border-2 border-naturals-purple/30 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      >
                        <Cpu className="w-12 h-12 text-naturals-purple" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-[-10px] rounded-full border border-naturals-purple/50 border-t-transparent"
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                      />
                    </div>

                    <div className="space-y-6 w-full max-w-md">
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Autonomous Optimization</h4>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-naturals-purple"
                            initial={{ width: 0 }}
                            animate={{ width: `${optimizationProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {optimizationLog.map((log, idx) => (
                          <motion.p 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[9px] font-black text-white/40 uppercase tracking-widest text-left"
                          >
                            <span className="text-naturals-purple mr-2">›</span> {log}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Custom In-App Toast --- */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6"
          >
            <div className="bg-deep-grape/95 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] mb-1">System Intelligence</p>
                <p className="text-sm font-bold text-white leading-relaxed">{toastMessage}</p>
              </div>
              <button 
                onClick={() => setShowSuccessToast(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskItem({ status, title, subtitle, tags, onAction, actionLabel }: any) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
        isLocked ? "bg-black/[0.01] border-black/[0.03] opacity-40 grayscale" :
        isCompleted ? "bg-white border-black/[0.03] shadow-sm" :
        "bg-white border-black/5 shadow-md"
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
        isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
        isLocked ? "bg-white border-black/10 text-black/10" :
        "bg-white border-naturals-purple text-naturals-purple"
      }`}>
        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : 
         isLocked ? <Shield className="w-6 h-6" /> : 
         <div className="w-3 h-3 rounded-full bg-naturals-purple animate-pulse" />}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <h4 className={`text-xl font-black italic tracking-tighter ${isLocked ? "text-deep-grape/30" : "text-deep-grape"}`}>{title}</h4>
          {tags?.map((tag: string) => (
            <span key={tag} className="text-[8px] font-black px-2 py-0.5 rounded bg-[#1A0B2E] text-white uppercase tracking-widest">{tag}</span>
          ))}
        </div>
        <p className={`text-sm font-bold ${isLocked ? "text-deep-grape/20" : "text-deep-grape/40"}`}>{subtitle}</p>
      </div>

      {!isLocked && (
        <button 
          onClick={onAction}
          className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer bg-white border border-black/10 hover:border-naturals-purple hover:text-naturals-purple"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

function BadgeCard({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border transition-all p-4 cursor-pointer ${
        active 
          ? "bg-[#1A0B2E] border-white/10 text-white shadow-xl shadow-indigo-900/40" 
          : "bg-white border-black/[0.03] text-deep-grape/60 hover:border-naturals-purple/30"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? "bg-white/10" : "bg-black/[0.03]"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-center">{label}</span>
    </button>
  );
}

function StatusTag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded bg-naturals-purple/20 text-naturals-purple text-[8px] font-black tracking-widest border border-naturals-purple/30">
      {label}
    </span>
  );
}

function ScoreBar({ label, score }: { label: string, score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-deep-grape tabular-nums">{score}%</span>
      </div>
      <div className="h-1 bg-black/[0.03] rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-naturals-purple"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  );
}
