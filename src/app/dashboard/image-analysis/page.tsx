"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  X, 
  Loader2, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Scissors,
  User,
  Zap,
  RefreshCw,
  Layout,
  ShieldCheck,
  Bot,
  Calendar
} from "lucide-react";
import Webcam from "react-webcam";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ImageAnalysisPage() {
  const { user, customerProfile } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // Extract key info from analysis text using regex for badges
  const getBadgeInfo = (text: string) => {
    // 1. Try to find the METADATA line first
    const metadataMatch = text.match(/METADATA:\s*FACE_SHAPE=\[?([^\],]+)\]?,\s*SKIN_TYPE=\[?([^,\]\n]+)\]?,\s*FACE_SERVICE=\[?([^,\]\n]+)\]?,\s*HAIR_SERVICE=\[?([^\]\n]+)\]?/i);
    
    let faceShape = "Analyzing...";
    let skinType = "Analyzing...";
    let faceService = "";
    let hairService = "";

    if (metadataMatch) {
      faceShape = metadataMatch[1].trim();
      skinType = metadataMatch[2].trim();
      faceService = metadataMatch[3].trim();
      hairService = metadataMatch[4].trim();
    } else {
      // 2. Fallback to searching the content
      const fsMatch = text.match(/Face Shape:\s*\*?\*?([^*.\n]+)/i);
      const stMatch = text.match(/Skin Type:\s*\*?\*?([^*.\n]+)/i);
      const fsvMatch = text.match(/Recommended Face Service:\s*\*?\*?([^*.\n]+)/i);
      const hsvMatch = text.match(/Recommended Hair Service:\s*\*?\*?([^*.\n]+)/i);
      
      if (fsMatch) faceShape = fsMatch[1].trim();
      if (stMatch) skinType = stMatch[1].trim();
      if (fsvMatch) faceService = fsvMatch[1].trim();
      if (hsvMatch) hairService = hsvMatch[1].trim();
    }

    // Cleanup common filler phrases to get just the keyword
    const cleanup = (val: string) => {
      return val
        .replace(/The guest's face shape (appears to be|is|looks like)/i, "")
        .replace(/Based on visual cues, the guest's skin type (appears to be|is|looks like)/i, "")
        .replace(/Our Guest (has a|is characterized by a)/i, "")
        .replace(/The guest has a/i, "")
        .replace(/Suggest exactly ONE specific service from/i, "")
        .replace(/[\[\]]/g, "")
        .replace(/\.$/, "")
        .trim();
    };

    return { 
      faceShape: cleanup(faceShape).toUpperCase(), 
      skinType: cleanup(skinType).toUpperCase(),
      faceService: cleanup(faceService),
      hairService: cleanup(hairService)
    };
  };

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('name, category')
        .eq('is_active', true);
      
      if (!error && data) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setAnalysis(null);
        setError(null);
        setIsWebcamMode(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setAnalysis(null);
      setError(null);
      setIsWebcamMode(false);
    }
  }, [webcamRef]);

  const handleSaveAnalysis = async () => {
    if (!customerProfile?.id || !analysis) {
      setError("Please log in as a customer to save your analysis.");
      return;
    }

    setIsSaving(true);
    setSaveStatus("Saving to profile...");

    try {
      const { faceShape, skinType } = getBadgeInfo(analysis);
      
      const { error } = await supabase
        .from('customers')
        .update({
          ai_hairstyle_analysis: {
            full_report: analysis,
            face_shape: faceShape,
            skin_type: skinType,
            captured_at: new Date().toISOString(),
            model_used: "Llama 4 Scout Vision"
          }
        })
        .eq('id', customerProfile.id);

      if (error) throw error;
      setSaveStatus("Saved Successfully! ✅");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(`Failed to save: ${err.message}`);
      setSaveStatus(null);
    } finally {
      setIsSaving(false);
    }
  };

  const runAnalysis = async () => {
    if (!image) {
      setError("Please capture or upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const performAnalysis = async (retryCount = 0): Promise<void> => {
      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image,
            services
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Analysis failed');
        }

        setAnalysis(data.text);
        setError(null);
        
        const modelLabel = document.getElementById('model-version-label');
        if (modelLabel) modelLabel.innerText = `AI Precision Consultation • Llama 4 Scout Vision`;
      } catch (err: any) {
        console.error("Analysis error:", err);
        
        if (err.message?.includes("429") && retryCount < 1) {
          setError("Quota reached. Retrying automatically in 5 seconds...");
          await new Promise(resolve => setTimeout(resolve, 5000));
          return performAnalysis(retryCount + 1);
        }

        setError(`Analysis failed: ${err.message || "Unknown error"}. Please try again.`);
      } finally {
        if (retryCount === 0 || !error?.includes("Retrying")) {
          setIsAnalyzing(false);
        }
      }
    };

    performAnalysis();
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    setIsWebcamMode(false);
  };

  const { faceShape, skinType, faceService, hairService } = analysis ? getBadgeInfo(analysis) : { faceShape: "", skinType: "", faceService: "", hairService: "" };

  const handleBookNow = () => {
    if (!analysis) return;
    const servicesToBook = [faceService, hairService].filter(s => s && s !== "Analyzing...").join(",");
    if (!servicesToBook) {
      alert("No services recommended to book yet.");
      return;
    }
    router.push(`/dashboard/booking?services=${encodeURIComponent(servicesToBook)}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-naturals-purple/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-naturals-purple" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-naturals-purple italic">AI Vision Engine v2.0</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-deep-grape uppercase tracking-tighter"
          >
            Deep <span className="text-naturals-purple">Vision</span> Analysis
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-deep-grape/40 text-sm font-medium mt-2 max-w-xl"
          >
            Professional Llama 4 Scout diagnostic for Face and Hair.
          </motion.p>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsWebcamMode(!isWebcamMode)}
             className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg ${isWebcamMode ? 'bg-naturals-purple text-white shadow-naturals-purple/20' : 'bg-white text-deep-grape border border-naturals-purple/10 hover:bg-naturals-purple/5 shadow-black/5'}`}
           >
             <Camera className="w-4 h-4" />
             Webcam Mode
           </button>
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="px-6 py-3 bg-white text-deep-grape border border-naturals-purple/10 hover:bg-naturals-purple/5 rounded-2xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/5"
           >
             <Upload className="w-4 h-4" />
             Upload
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[600px]">
        {/* Left Column: Capture/Preview */}
        <div className="w-full lg:w-[42%] flex flex-col">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-[3rem] p-4 shadow-xl border border-naturals-purple/5 flex-1 flex flex-col"
          >
            {isWebcamMode ? (
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-black flex-1">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
                   <div className="flex justify-between items-start">
                      <div className="w-10 h-10 border-t-4 border-l-4 border-naturals-purple rounded-tl-2xl opacity-60" />
                      <div className="w-10 h-10 border-t-4 border-r-4 border-naturals-purple rounded-tr-2xl opacity-60" />
                   </div>
                   
                   <div className="flex flex-col items-center gap-3">
                      <div className="px-3 py-1.5 bg-naturals-purple/20 backdrop-blur-md rounded-full border border-naturals-purple/30">
                         <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white animate-pulse">Llama 4: Align Face</p>
                      </div>
                      <div className="w-48 h-64 border-[1px] border-white/20 rounded-[3rem] relative overflow-hidden">
                         <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 right-0 h-[2px] bg-naturals-purple shadow-[0_0_15px_rgba(142,62,150,1)]"
                         />
                      </div>
                   </div>

                   <div className="flex justify-between items-end">
                      <div className="w-10 h-10 border-b-4 border-l-4 border-naturals-purple rounded-bl-2xl opacity-60" />
                      <div className="w-10 h-10 border-b-4 border-r-4 border-naturals-purple rounded-br-2xl opacity-60" />
                   </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-8 flex gap-3 z-20">
                  <button 
                    onClick={capture}
                    className="flex-1 py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-naturals-purple/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  >
                    <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Capture
                  </button>
                  <button 
                    onClick={() => setIsWebcamMode(false)}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40 transition-all border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : !image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[2.5rem] border-4 border-dashed border-naturals-purple/10 bg-naturals-purple/[0.01] hover:bg-naturals-purple/[0.03] hover:border-naturals-purple/30 transition-all cursor-pointer flex flex-col items-center justify-center p-12 text-center overflow-hidden relative flex-1 group"
              >
                <div className="w-20 h-20 bg-naturals-purple/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 shadow-inner">
                  <Layout className="w-8 h-8 text-naturals-purple" />
                </div>
                <h3 className="text-lg font-black text-deep-grape uppercase tracking-tighter mb-2">No Subject</h3>
                <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest leading-relaxed">
                  Capture portrait for<br />AI diagnostic
                </p>
              </div>
            ) : (
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-inner flex-1 group">
                <img 
                  src={image} 
                  alt="Preview" 
                  className={`w-full h-full object-cover transition-all duration-1000 ${isAnalyzing ? 'scale-105 brightness-50' : 'scale-100'}`}
                />
                
                {/* Active Analysis Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center">
                    <div className="w-56 h-72 border-2 border-naturals-purple/40 rounded-[3rem] relative overflow-hidden backdrop-blur-[1px]">
                       <motion.div 
                          animate={{ top: ["-10%", "110%", "-10%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[4px] bg-naturals-purple shadow-[0_0_30px_rgba(142,62,150,1)]"
                       />
                       <div className="absolute inset-0 bg-[linear-gradient(rgba(142,62,150,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(142,62,150,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
                    </div>
                    <motion.p 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mt-6 text-[10px] font-black text-naturals-purple uppercase tracking-[0.3em]"
                    >
                      Analyzing...
                    </motion.p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-30">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsWebcamMode(true)}
                      className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/30 transition-all border border-white/20 flex items-center justify-center hover:scale-110"
                    >
                      <RefreshCw className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={reset}
                      className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/30 transition-all border border-white/20 flex items-center justify-center hover:scale-110"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {!analysis && !isAnalyzing && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-10 z-40">
                    <button 
                      onClick={runAnalysis}
                      className="w-full py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-2xl shadow-naturals-purple/40 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Run Diagnostic
                    </button>
                  </div>
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        </div>

        {/* Right Column: Results */}
        <div className="w-full lg:w-[58%] flex flex-col">
          <AnimatePresence mode="wait">
            {!analysis && !isAnalyzing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 bg-white rounded-[3rem] border border-naturals-purple/5 shadow-xl flex flex-col items-center justify-center p-12 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-naturals-purple/[0.03] blur-3xl rounded-full translate-x-1/4 -translate-y-1/4" />
                <div className="w-20 h-20 bg-warm-grey/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <User className="w-8 h-8 text-deep-grape/10" />
                </div>
                <h3 className="text-xl font-black text-deep-grape uppercase tracking-tighter mb-3">AI Intelligence</h3>
                <p className="text-[10px] font-bold text-deep-grape/30 max-w-[280px] leading-relaxed uppercase tracking-widest">
                  Capture a profile to begin neural mapping of facial symmetry and health.
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 bg-white rounded-[3rem] border border-naturals-purple/5 shadow-xl flex flex-col items-center justify-center p-12 text-center overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-naturals-purple/[0.01] animate-pulse" />
                <div className="flex flex-col items-center gap-8 relative z-10">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-full border-2 border-naturals-purple/10 border-t-naturals-purple animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Bot className="w-8 h-8 text-naturals-purple animate-pulse" />
                     </div>
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-deep-grape uppercase tracking-tighter mb-2 italic">Consulting AI</h3>
                     <p className="text-[8px] font-black uppercase tracking-[0.4em] text-naturals-purple animate-pulse">Llama 4 Scout Active</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 bg-white rounded-[3rem] border border-naturals-purple/5 shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Results Header */}
                <div className="p-6 border-b border-warm-grey/50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shadow-inner">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-deep-grape uppercase tracking-tighter">Diagnostic Report</h3>
                      <p className="text-[8px] font-black text-deep-grape/30 uppercase tracking-[0.1em] italic">Powered by Groq Llama 4</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={runAnalysis} className="p-2 hover:bg-naturals-purple/10 rounded-lg text-naturals-purple transition-all" title="Re-run">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={reset} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all" title="Reset">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Results Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {/* Quick Insight Section */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="p-4 bg-naturals-purple rounded-2xl shadow-lg shadow-naturals-purple/20 flex flex-col">
                        <span className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1 text-white">Face Shape</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white">{faceShape}</span>
                     </div>
                     <div className="p-4 bg-deep-grape rounded-2xl shadow-lg shadow-deep-grape/20 flex flex-col">
                        <span className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1 text-white">Skin Type</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-white">{skinType}</span>
                     </div>
                  </div>

                  <div className="prose prose-sm prose-p:text-deep-grape/80 prose-headings:text-deep-grape prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-naturals-purple prose-ul:list-disc prose-li:text-deep-grape/80 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysis?.replace(/^METADATA:.*?\n/i, "") || ""}
                    </ReactMarkdown>
                  </div>

                  {/* Save & Book Footer */}
                  <div className="mt-12 pt-8 border-t border-warm-grey/50">
                    <div className="bg-naturals-purple/[0.03] rounded-3xl p-6 flex flex-col gap-6 border border-naturals-purple/10">
                      <div className="text-center">
                        <h4 className="text-[10px] font-black text-deep-grape uppercase tracking-[0.3em] mb-1">I need to book these</h4>
                        <p className="text-[9px] font-bold text-deep-grape/40 uppercase tracking-widest">Instantly reserve your recommended services</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={handleBookNow}
                          className="flex-1 py-4 bg-naturals-purple text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-naturals-purple/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Book Now
                        </button>
                        
                        <button 
                          onClick={handleSaveAnalysis}
                          disabled={isSaving || !!saveStatus}
                          className={`flex-1 py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${
                            saveStatus?.includes("Success") 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'bg-white border-deep-grape/10 text-deep-grape hover:bg-deep-grape/5'
                          }`}
                        >
                          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                          {saveStatus || "Save to Cloud"}
                        </button>
                      </div>
                      
                      {!user && (
                        <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">Login required to save data</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 text-red-700 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
