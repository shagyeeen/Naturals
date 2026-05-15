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
  MapPin,
  Play,
  Bell
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StaffCheck() {
  const [activeTab, setActiveTab] = useState<"accreditation" | "audit" | "workflow">("audit");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [showAuditResult, setShowAuditResult] = useState(false);
  const [personnelGrade, setPersonnelGrade] = useState("L2_ADVANCED");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [showWorkAnalysis, setShowWorkAnalysis] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isAuditingProficiency, setIsAuditingProficiency] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [isLivePlaying, setIsLivePlaying] = useState(false);
  const [runningAppointments, setRunningAppointments] = useState<any[]>([]);
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches();
    fetchWorkflowData();
  }, []);

  useEffect(() => {
    if ((activeTab === "audit" || activeTab === "workflow") && selectedBranch) {
      fetchRealtimeAppointments();
      const interval = setInterval(fetchRealtimeAppointments, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedBranch]);

  const fetchRealtimeAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false });

      // 1. Fetch ALL confirmed appointments up to today to auto-complete
      const { data: allConfirmed, error: fetchError } = await supabase
        .from('appointments')
        .select('id, appointment_date, end_time, status')
        .lte('appointment_date', today)
        .eq('status', 'confirmed');

      if (fetchError) throw fetchError;

      // Filter for those that should be completed
      const toComplete = allConfirmed?.filter(apt => {
        if (apt.appointment_date < today) return true;
        return apt.end_time < now;
      }) || [];

      if (toComplete.length > 0) {
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .in('id', toComplete.map(apt => apt.id));
      }

      // 2. Fetch specific branch appointments for the UI
      if (!selectedBranch) return;

      const branchSearch = selectedBranch.split(' — ')[1] || selectedBranch;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          start_time,
          end_time,
          status,
          customer:customers(full_name),
          stylist:stylists!inner(full_name, branch_location),
          service:services(name)
        `)
        .eq('appointment_date', today)
        .eq('status', 'confirmed')
        .ilike('stylists.branch_location', `%${branchSearch}%`);

      if (error) throw error;

      // Filter for appointments that are actually running now
      const running = data?.filter(apt => {
        return apt.start_time <= now && apt.end_time >= now;
      }) || [];

      setRunningAppointments(running);
    } catch (err) {
      console.error("Failed to fetch realtime appointments:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      if (res.ok) {
        const data = await res.json();
        // Only keep Adyar for now as requested
        const filtered = data.filter((b: string) => b.toUpperCase().includes("ADYAR"));
        setBranches(filtered);
        if (filtered.length > 0) {
          setSelectedBranch(filtered[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  };

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

  const handleAnalyzeFootage = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      // Time-aware context selection
      const hour = new Date().getHours();
      const isNight = hour >= 21 || hour < 8;

      // Use a dark/closed placeholder if it's night time (like 4 AM)
      const mockImage = isNight
        ? "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&q=80&w=800" // Dark/Moody Salon
        : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"; // Bright/Day Salon

      const res = await fetch("/api/analyze-footage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: mockImage })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      setToastMessage("AI Vision Error: " + err.message);
      setShowSuccessToast(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendReminders = async () => {
    try {
      setToastMessage("Fetching today's appointments...");
      setShowSuccessToast(true);

      const today = new Date().toISOString().split('T')[0];
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          customer:customers(full_name, email),
          service:services(name)
        `)
        .eq('appointment_date', today)
        .eq('status', 'confirmed');

      if (error) throw error;
      if (!appointments || appointments.length === 0) {
        setToastMessage("No appointments found for today.");
        return;
      }

      setToastMessage(`Sending ${appointments.length} reminders...`);

      const promises = appointments.map(async (apt: any) => {
        // Handle Supabase returning related records as arrays
        const customer = Array.isArray(apt.customer) ? apt.customer[0] : apt.customer;
        const service = Array.isArray(apt.service) ? apt.service[0] : apt.service;

        if (!customer?.email) return;

        const formatTime = (time: string) => {
          const [h, m] = time.split(':');
          const hr = parseInt(h);
          return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
        };

        return fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: customer.email,
            subject: "📅 Reminder: Your Appointment Today at Naturals",
            html: `
              <div style="font-family: sans-serif; padding: 40px; color: #2F0137; border: 1px solid #eee; border-radius: 20px;">
                <h1 style="color: #8E3E96; font-style: italic;">Naturals Salon</h1>
                <h2>Hi ${customer.full_name},</h2>
                <p>Friendly reminder that you have an appointment with us <strong>TODAY</strong>!</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <p><strong>Service:</strong> ${service?.name}</p>
                  <p><strong>Time:</strong> ${formatTime(apt.start_time)}</p>
                </div>
                <p>We look forward to seeing you. If you're running late, please let us know!</p>
              </div>
            `
          })
        });
      });

      await Promise.all(promises);
      setToastMessage("All today's reminders sent successfully! ✨");
    } catch (err: any) {
      console.error("Reminder Error:", err);
      setToastMessage("Failed to send reminders: " + err.message);
    }
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
              { id: "audit", label: "Live Camera", icon: Video },
              { id: "workflow", label: "Current Progress", icon: ClipboardCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id
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
                        <ShieldCheck className="w-3.5 h-3.5" /> Service Quality
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-deep-grape tracking-tighter italic leading-none">
                        Live Monitoring
                      </h1>
                      <p className="text-deep-grape/40 font-bold uppercase tracking-widest text-xs max-w-2xl leading-relaxed">
                        Staff performance checks and skill tests to keep branch quality high across all locations.
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[10px] font-black text-deep-grape/20 uppercase tracking-[0.3em]">Staff Level</span>
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
                      <h3 className="text-xs font-black text-deep-grape/30 uppercase tracking-[0.4em]">Skill Level: Senior Stylist Path</h3>
                    </div>

                    <TaskItem
                      status="completed"
                      title="Basic Hair Coloring"
                      subtitle="Test Score: 92% • Valid through Q4 2026"
                      onAction={handleStartAudit}
                      actionLabel="RE-AUDIT"
                    />

                    <TaskItem
                      status="pending"
                      title="Hair Damage Repair"
                      subtitle="Expertise in chemical treatments, heat protection, and hair health checks."
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
                      title="Head Shape & Volume Styling"
                      subtitle="Unlock Level 3 status to access advanced style standards."
                      actionLabel="LOCKED"
                    />
                  </div>

                  {/* Verified Accreditations */}
                  <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-black/5 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <Star className="w-5 h-5 text-naturals-purple/60" />
                      <h3 className="text-xs font-black text-deep-grape/40 uppercase tracking-[0.3em]">Approved Work</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <BadgeCard icon={Scissors} label="Haircuts" active={activeBadge === "cutting"} onClick={() => setActiveBadge("cutting")} />
                      <BadgeCard icon={Shield} label="Checking" active={activeBadge === "sop"} onClick={() => setActiveBadge("sop")} />
                      <BadgeCard icon={Heart} label="Friendly" active={activeBadge === "cx"} onClick={() => setActiveBadge("cx")} />
                      <BadgeCard icon={Sparkles} label="Cleaning" active={activeBadge === "sterility"} onClick={() => setActiveBadge("sterility")} />
                    </div>

                    <div className="mt-8 p-6 bg-black/[0.02] border border-black/[0.03] rounded-3xl">
                      <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-4">Staff Feedback</p>
                      <p className="text-sm font-bold text-deep-grape/60 italic leading-relaxed">
                        "Staff is good at applying color but needs to work on heat styling timing."
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
                className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm relative min-h-[600px] flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-naturals-purple/5 to-transparent rounded-[2.5rem] overflow-hidden pointer-events-none" />

                {/* Audit Header with Branch Selection */}
                <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-deep-grape flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Feed: Camera View
                    </h2>
                    <p className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-[0.2em] mt-1">
                      Watching staff work in different branches.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-48">
                      <CustomDropdown
                        value={selectedBranch}
                        options={branches.map(b => ({ value: b, label: b.toUpperCase() }))}
                        onChange={(val) => setSelectedBranch(val)}
                        placeholder="Select Branch"
                      />
                    </div>
                    <button
                      onClick={handleAnalyzeFootage}
                      disabled={isAnalyzing}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAnalyzing
                          ? "bg-naturals-purple/20 text-naturals-purple animate-pulse cursor-wait"
                          : "bg-naturals-purple text-white shadow-lg shadow-naturals-purple/20 hover:scale-105 active:scale-95"
                        }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          AI Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4" />
                          Analyze Footage
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleSendReminders}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-naturals-purple border border-naturals-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-naturals-purple/5 transition-all shadow-sm"
                    >
                      <Bell className="w-4 h-4" />
                      Sync Reminders
                    </button>
                    <button className="p-3 bg-warm-grey rounded-xl border border-black/5 hover:bg-black/5 transition-all">
                      <RefreshCw className="w-4 h-4 text-naturals-purple" />
                    </button>
                  </div>
                </div>

                {isAuditingProficiency ? (
                  <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8">
                    {/* Simulated Camera Feed (Expanded) */}
                    <div className="relative aspect-video bg-[#0A0514] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                      {selectedBranch.toUpperCase().includes("ADYAR") ? (
                        <iframe
                          src="https://open.ivideon.com/embed/v3/?server=100-BxkoFjC1JSxTCjLTrQJYZs&camera=0&width=&height=&lang=en&ap=&noibw="
                          className="absolute inset-0 w-[110%] h-[115%] -left-[5%] top-0 grayscale opacity-60 mix-blend-overlay border-0"
                          allowFullScreen
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay grayscale"
                          style={{ backgroundImage: 'none' }}
                        />
                      )}

                      {!selectedBranch.toUpperCase().includes("ADYAR") && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                          <div className="w-16 h-16 border-2 border-white/10 rounded-full flex items-center justify-center mb-4">
                            <Video className="w-8 h-8 text-white/20" />
                          </div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Signal Lost: {selectedBranch.split(' — ')[1] || selectedBranch}</p>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">Connecting to branch...</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0514] to-transparent opacity-60" />

                      {selectedBranch.toUpperCase().includes("ADYAR") && (
                        <div className="absolute top-6 right-6 flex items-center gap-2 z-20 bg-red-500/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Feed</span>
                        </div>
                      )}

                      <motion.div
                        className="absolute inset-x-0 h-0.5 bg-naturals-purple shadow-[0_0_15px_rgba(142,62,150,0.8)] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      />

                      <div className="absolute inset-0 z-10 p-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">AUDIT IN PROGRESS • {selectedBranch.toUpperCase()}</span>
                            </div>
                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">ISO 400 • F/2.8 • 1/60</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-naturals-purple uppercase tracking-widest">Neural Stream v4.2</p>
                            <p className="text-[14px] font-black text-white italic">OPERATOR_391</p>
                          </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                            <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                              <div className="w-16 h-16 border-2 border-naturals-purple/40 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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

                    <div className="flex justify-center">
                      <button
                        onClick={() => setIsAuditingProficiency(false)}
                        className="px-8 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all"
                      >
                        Terminate Audit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col lg:flex-row gap-8 flex-grow py-12">
                    <div className="flex-grow flex flex-col items-center justify-center">
                      {selectedBranch && (
                        <div className="group relative w-full max-w-2xl aspect-video bg-black rounded-3xl overflow-hidden border border-black/5 shadow-2xl">
                          {isLivePlaying && selectedBranch.toUpperCase().includes("ADYAR") ? (
                            <iframe
                              src="https://open.ivideon.com/embed/v3/?server=100-BxkoFjC1JSxTCjLTrQJYZs&camera=0&width=&height=&lang=en&ap=&noibw="
                              className={`absolute inset-0 w-[110%] h-[115%] -left-[5%] top-0 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 border-0`}
                              allowFullScreen
                            />
                          ) : (
                            <div
                              className={`absolute inset-0 bg-cover bg-center grayscale opacity-20 ${!isLivePlaying && selectedBranch.toUpperCase().includes("ADYAR") ? 'blur-md' : ''}`}
                              style={{
                                backgroundImage: selectedBranch.toUpperCase().includes("ADYAR")
                                  ? `url(https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80)`
                                  : 'none'
                              }}
                            />
                          )}

                          {!isLivePlaying && selectedBranch.toUpperCase().includes("ADYAR") && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <button
                                onClick={() => setIsLivePlaying(true)}
                                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all group/play"
                              >
                                <Play className="w-8 h-8 text-white fill-white group-hover/play:scale-110 transition-transform" />
                              </button>
                            </div>
                          )}

                          {isLivePlaying && selectedBranch.toUpperCase().includes("ADYAR") && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-20 bg-red-500/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">Live</span>
                            </div>
                          )}

                          {!selectedBranch.toUpperCase().includes("ADYAR") && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No Signal</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${selectedBranch.toUpperCase().includes("ADYAR") ? "bg-red-500" : "bg-white/20"}`} />
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">
                              {selectedBranch.toUpperCase().includes("ADYAR") ? "CAM 01 - ADYAR" : `CAM 01 - ${selectedBranch.split(' — ')[1] || selectedBranch.toUpperCase()}`}
                            </span>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-white/40 tabular-nums">
                              {new Date().toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Scanning Effect */}
                          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                        </div>
                      )}

                      <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.4em]">
                          {selectedBranch.toUpperCase().includes("ADYAR") ? "Active Node: ADYAR" : "Branches Offline"}
                        </p>
                        <p className="text-[8px] font-bold text-deep-grape/20 uppercase tracking-widest mt-2">
                          {selectedBranch.toUpperCase().includes("ADYAR")
                            ? "Adyar branch is currently sending live video."
                            : "This branch is currently not sending video."}
                        </p>
                      </div>

                      {/* AI Analysis Overlay */}
                      <AnimatePresence>
                        {analysisResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-8 p-8 bg-[#1A0B2E] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-naturals-purple to-indigo-500" />
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-naturals-purple/20 flex items-center justify-center">
                                  <Cpu className="w-5 h-5 text-naturals-purple" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-black text-white italic tracking-tight">Neural Vision Reasoning</h3>
                                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Llama 4 Scout Vision</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setAnalysisResult(null)}
                                className="p-2 text-white/20 hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div className="text-sm font-medium text-white/70 leading-relaxed italic prose prose-invert prose-p:leading-relaxed prose-strong:text-naturals-purple prose-strong:font-black">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {analysisResult}
                                </ReactMarkdown>
                              </div>
                              <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                                <span className="text-[8px] font-black text-naturals-purple uppercase tracking-widest">SOP COMPLIANCE: CHECKING</span>
                                <div className="flex-1 h-px bg-white/5" />
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Confidence Index: 98.4%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
                      <h3 className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.3em]">Current Progress</h3>
                    </div>
                    <button onClick={fetchWorkflowData} className="p-2 hover:bg-black/5 rounded-xl transition-all">
                      <RefreshCw className={`w-4 h-4 text-naturals-purple ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {runningAppointments.length > 0 ? runningAppointments.map((appt, idx) => (
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
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${appt.status === 'confirmed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
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
                        onClick={() => setShowWorkAnalysis(true)}
                        className="w-full py-3 bg-warm-grey rounded-xl text-[9px] font-black text-deep-grape/40 uppercase tracking-widest hover:bg-lavender hover:text-naturals-purple transition-all"
                      >
                        Work Analysis
                      </button>
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
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Starting Staff Skill Test</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Checking recorded sessions</p>
              </div>

              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-naturals-purple to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${auditProgress}%` }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {auditProgress > 20 && <StatusTag label="PROFILE SYNC" />}
                {auditProgress > 45 && <StatusTag label="TECHNIQUE CHECK" />}
                {auditProgress > 70 && <StatusTag label="STANDARD CHECK" />}
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
        {showWorkAnalysis && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#0A0514]/80 backdrop-blur-xl" onClick={() => setShowWorkAnalysis(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative z-10 w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-warm-grey/30">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-deep-grape">Work Analysis</h3>
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">Stylist Productivity • Appointments Overview</p>
                </div>
                <button onClick={() => setShowWorkAnalysis(false)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-warm-grey/5">
                <div className="bg-white rounded-[2.5rem] border border-black/5 p-12 shadow-sm">
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h4 className="text-xl font-black italic tracking-tighter text-deep-grape">Appointments per Stylist</h4>
                      <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">Today's workload distribution</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-naturals-purple" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">Total Sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-80 flex items-end justify-around gap-2 px-12 border-b border-black/10 pb-10">
                    {/* Y-Axis Labels */}
                    <div className="absolute left-4 top-0 bottom-10 flex flex-col justify-between text-[8px] font-black text-deep-grape/20 pointer-events-none">
                      <span>10</span>
                      <span>8</span>
                      <span>6</span>
                      <span>4</span>
                      <span>2</span>
                      <span>0</span>
                    </div>

                    {activeStaff.slice(0, 10).map((staff, i) => {
                      const apptCount = liveQueue.filter(a => a.stylist_id === staff.id).length;
                      const barHeight = Math.min((apptCount / 10) * 100, 100);

                      return (
                        <div key={staff.id} className="flex flex-col items-center gap-4 group relative h-full justify-end w-16">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-6 text-[10px] font-black text-naturals-purple opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {apptCount}
                          </motion.div>

                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${barHeight}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                            className="w-10 bg-gradient-to-t from-naturals-purple to-fuchsia-500 rounded-t-xl shadow-lg shadow-naturals-purple/20 relative group-hover:brightness-110 transition-all cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>

                          <div className="absolute -bottom-8 flex justify-center w-full">
                            <p className="text-[9px] font-black uppercase tracking-tighter text-deep-grape/40 whitespace-nowrap text-center">
                              {staff.full_name.split(' ')[0]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                    <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Busyest Stylist</p>
                    <p className="text-xl font-black italic text-naturals-purple">
                      {(() => {
                        const counts = activeStaff.map(s => ({ name: s.full_name, count: liveQueue.filter(a => a.stylist_id === s.id).length }));
                        const max = counts.reduce((prev, current) => (prev.count > current.count) ? prev : current, { name: 'N/A', count: 0 });
                        return max.count > 0 ? max.name : 'No Activity';
                      })()}
                    </p>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                    <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Daily Capacity</p>
                    <p className="text-xl font-black italic text-deep-grape">
                      {Math.round((liveQueue.length / (activeStaff.length * 8)) * 100)}%
                    </p>
                  </div>
                  <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                    <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Total Throughput</p>
                    <p className="text-xl font-black italic text-deep-grape">
                      {liveQueue.length} Sessions
                    </p>
                  </div>
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
              </div>

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
      className={`relative flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${isLocked ? "bg-black/[0.01] border-black/[0.03] opacity-40 grayscale" :
          isCompleted ? "bg-white border-black/[0.03] shadow-sm" :
            "bg-white border-black/5 shadow-md"
        }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
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
      className={`aspect-square flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border transition-all p-4 cursor-pointer ${active
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
