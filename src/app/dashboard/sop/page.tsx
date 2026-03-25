"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ClipboardCheck, Video, Activity, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SOPAuditSystem() {
  const [activeTab, setActiveTab] = useState<"workflow" | "audit">("audit");
  const [currentStep, setCurrentStep] = useState(2);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert("Service Workflow Completed and Logged to Central Hub.");
      setCurrentStep(1);
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      alert("Audit Report for 'Adyar Branch - Cam 04' generated successfully.");
      setIsGeneratingReport(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-xs font-bold mb-2 border border-naturals-purple/20">
            <ShieldCheck className="w-3 h-3" /> Protocol 01: SOP Standardisation
          </div>
          <h1 className="text-3xl font-bold text-deep-grape mb-2 flex items-center gap-3 italic">
             AI Compliance & Audit System
          </h1>
          <p className="text-deep-grape/60">Real-time operational auditing and remote workflow calibration.</p>
        </div>
        
        <div className="glass flex gap-2 p-1.5 rounded-2xl bg-warm-grey/50 shadow-md border border-blue-500/10">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "audit" 
                ? "bg-white text-blue-500 shadow-sm" 
                : "text-deep-grape/60"
            }`}
          >
            Manager Remote Audit
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "workflow" 
                ? "bg-white text-blue-500 shadow-sm" 
                : "text-deep-grape/60"
            }`}
          >
            Stylist Tablet View
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Manager Remote Audit Dashboard */}
        {activeTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Active Sessions Live Feed */}
              <div className="lg:col-span-2 glass-card p-6 border-blue-500/20 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" /> Live Branch Monitors
                  </h2>
                  <span className="flex items-center gap-2 text-sm font-bold opacity-60">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 12 Active Services
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 flex-1">
                  
                  {/* Mock Video Feed 1 */}
                  <div onClick={() => alert("Expanding Adyar Live Stream...")} className="relative rounded-2xl overflow-hidden bg-black aspect-video group cursor-pointer border border-black/10 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <img src="/monitor1.png" alt="Salon cam" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 z-20 flex gap-2">
                       <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider animate-pulse">Live</span>
                       <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-md">Cam 04 • Adyar</span>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-white font-bold text-sm">Service: Keratin Treatment</p>
                      <p className="text-white/70 text-xs">Stylist: Anjali • Phase: Ironing</p>
                    </div>
                    <div className="absolute bottom-4 right-4 z-20 text-right">
                       <p className="text-green-400 font-black text-lg">98%</p>
                       <p className="text-white/50 text-[10px] uppercase">SOP Adherence</p>
                    </div>
                  </div>

                  {/* Mock Video Feed 2 (Violation Alert) */}
                  <div onClick={() => alert("Alert Logged: Patch Test Skyped at RS Puram. Manager notification sent.")} className="relative rounded-2xl overflow-hidden bg-black aspect-video group cursor-pointer border-2 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent z-10" />
                    <img src="/monitor2_violation.png" alt="Salon cam" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 grayscale mix-blend-luminosity" />
                    <div className="absolute top-3 left-3 z-20 flex gap-2">
                      <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider animate-pulse">Live</span>
                      <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-md">Cam 02 • RS Puram</span>
                    </div>
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                       <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/50 px-4 py-2 rounded-xl text-orange-200 font-bold flex items-center gap-2 animate-pulse">
                         <AlertTriangle className="w-5 h-5" /> SOP Violation Detected
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-white font-bold text-sm">Service: Global Color</p>
                      <p className="text-orange-300 font-bold text-xs uppercase tracking-wider">Patch Test Skipped</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quality Metrics */}
              <div className="glass-card p-6 flex flex-col relative overflow-hidden">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 z-10"><Activity className="w-5 h-5 text-blue-500" /> AI Quality Engine</h2>
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto border-4 border-white mb-6 relative z-10">
                   <div className="flex flex-col items-center">
                     <span className="text-3xl font-black text-white leading-none">94</span>
                     <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-1">Score</span>
                   </div>
                </div>

                <div className="space-y-4 mb-8 z-10 flex-1">
                  <div className="bg-warm-grey/50 p-3 rounded-xl border border-black/5 flex flex-col gap-1">
                    <p className="text-xs font-bold opacity-60">Avg. Service Time Variance</p>
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-black text-green-500">-4.2 mins</p>
                       <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-500">Efficient</span>
                    </div>
                  </div>
                  <div className="bg-warm-grey/50 p-3 rounded-xl border border-black/5 flex flex-col gap-1">
                    <p className="text-xs font-bold opacity-60">SOP Compliance Rate</p>
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-black text-blue-500">96.8%</p>
                       <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">Excellent</span>
                    </div>
                  </div>
                  <div className="bg-warm-grey/50 p-3 rounded-xl border border-black/5 flex flex-col gap-1">
                    <p className="text-xs font-bold opacity-60">Complaint Prediction Risk</p>
                    <div className="flex justify-between items-center">
                       <p className="text-sm font-black text-orange-500">Medium</p>
                       <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500">Monitoring Required</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="w-full py-3 bg-blue-500/10 text-blue-500 font-bold text-sm rounded-xl hover:bg-blue-500 hover:text-white transition-colors z-10 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingReport ? "Generating..." : "Generate Audit Report"}
                </button>

                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Stylist Tablet View (SOP Workflow) */}
        {activeTab === "workflow" && (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-4xl mx-auto glass-card p-2 md:p-8 rounded-[2rem] border-blue-500/20 relative"
          >
            {/* iPad Mockup Wrapper */}
            <div className="bg-black/5 rounded-3xl p-6 border-2 border-black/10 shadow-inner relative overflow-hidden">
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-6 bg-black rounded-b-3xl"></div>
               
               {/* Internal App */}
               <div className="bg-white rounded-2xl overflow-hidden min-h-[600px] flex flex-col mt-4 border border-black/5 shadow-xl">
                 
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                   <div>
                     <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Standard Operating Procedure</p>
                     <h2 className="text-2xl font-black font-sans tracking-tight">Hair Coloring • Balayage</h2>
                   </div>
                   <div className="text-right">
                     <p className="text-2xl font-mono font-bold tracking-widest flex items-center gap-2">
                       <Clock className="w-5 h-5 text-blue-200" /> 45:00
                     </p>
                     <p className="text-[10px] text-white/50 uppercase">Time Remaining</p>
                   </div>
                 </div>

                 <div className="flex-1 p-8 grid md:grid-cols-2 gap-8 relative overflow-hidden">
                   
                   {/* Steps List */}
                   <div className="space-y-6 relative z-10">
                     <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-black/10 -z-10" />
                     
                     {[ 
                       { step: 1, name: "Hair Diagnosis" },
                       { step: 2, name: "Patch Test Verification" },
                       { step: 3, name: "Sectioning & Application" },
                       { step: 4, name: "Processing Timer" },
                       { step: 5, name: "Visual Check & Wash" },
                     ].map((s) => (
                       <div key={s.step} className={`flex gap-4 items-center ${s.step < currentStep ? 'opacity-50' : s.step > currentStep ? 'opacity-30' : ''}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border-2 ${
                           s.step < currentStep ? 'bg-green-500 border-green-500 text-white' : 
                           s.step === currentStep ? 'bg-white border-blue-500 text-blue-500 ring-4 ring-blue-500/20' : 
                           'bg-white border-gray-300 text-deep-grape'
                         }`}>
                           {s.step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                         </div>
                         <p className={`font-bold ${s.step === currentStep ? 'text-blue-500 text-lg' : ''}`}>{s.name}</p>
                       </div>
                     ))}
                   </div>

                   {/* Active Step Action Panel */}
                   <div className="bg-warm-grey/50 border border-black/5 rounded-2xl p-6 flex flex-col shadow-inner">
                     <h3 className="font-bold text-xl mb-2 text-blue-500">Step {currentStep}: {
                        currentStep === 1 ? "Hair Diagnosis" :
                        currentStep === 2 ? "Patch Test" :
                        currentStep === 3 ? "Application" :
                        currentStep === 4 ? "Processing" : "Post-Service Wash"
                     }</h3>
                     <p className="text-sm opacity-70 mb-6 leading-relaxed">
                        {currentStep === 1 && "Perform initial scalp and hair texture analysis. Document any pre-existing damage."}
                        {currentStep === 2 && "Verify if the customer has completed a 24-hour patch test. If not, perform a rapid test."}
                        {currentStep === 3 && "Follow the AI Stylist recipe exactly for mixing chemicals and application patterns."}
                        {currentStep === 4 && "Ensure constant monitoring of hair condition. Use the timer for exact development."}
                        {currentStep === 5 && "Thorough rinsing until water runs clear. Apply neutralizer as per manual."}
                     </p>
                     
                     {currentStep === 2 && (
                       <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6">
                         <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1 flex gap-2"><AlertTriangle className="w-4 h-4" /> AI Warning</p>
                         <p className="text-sm text-orange-600 font-medium">Customer's Beauty Passport indicates sensitive skin on Last Visit.</p>
                       </div>
                     )}

                     <div className="mt-auto space-y-3">
                       <button 
                        onClick={handleNextStep}
                        className="w-full py-4 text-center bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform cursor-pointer"
                       >
                         {currentStep === 5 ? "Finish & Log Service" : `Confirm Step ${currentStep} Clear`}
                       </button>
                       <button onClick={() => { alert("Manager alert triggered. Service paused."); setCurrentStep(1); }} className="w-full py-4 text-center bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black text-sm uppercase tracking-widest rounded-xl transition-colors cursor-pointer">
                         Abort Service (Reaction)
                       </button>
                     </div>
                   </div>

                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
