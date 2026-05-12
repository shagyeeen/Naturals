"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ClipboardCheck, 
  Video, 
  Activity, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Volume2, 
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
  Sparkles
} from "lucide-react";

export default function ProtocolAccreditation() {
  const [activeTab, setActiveTab] = useState<"accreditation" | "audit" | "workflow">("accreditation");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [showAuditResult, setShowAuditResult] = useState(false);
  const [personnelGrade, setPersonnelGrade] = useState("L2_ADVANCED");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

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
                        <ShieldCheck className="w-3.5 h-3.5" /> Protocol 08: Strategic Advancement
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-deep-grape tracking-tighter italic leading-none">
                        Professional Protocol Accreditation
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
                      onAction={() => alert("Initializing Neural Proficiency Test Interface...")}
                      actionLabel="START TEST"
                    />

                    <TaskItem 
                      status="locked"
                      title="Cranial Symmetry & Volumetric Mapping"
                      subtitle="Unlock L3 Advanced status to access precision morphology protocols."
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
                      <BadgeCard icon={Sparkles} label="Sterility Protocols" active={activeBadge === "sterility"} onClick={() => setActiveBadge("sterility")} />
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
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm"
              >
                <Video className="w-16 h-16 text-naturals-purple/20 mx-auto mb-6" />
                <h2 className="text-2xl font-black italic tracking-tighter">Remote Audit Hub</h2>
                <p className="text-deep-grape/40 font-bold uppercase tracking-widest text-xs mt-2">Connecting to regional live stream network...</p>
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
