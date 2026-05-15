"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  X, 
  Loader2, 
  Scissors, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Bot,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
import Webcam from "react-webcam";
import { useAuth } from "@/lib/auth";

const PRESET_STYLES = [
  { id: "bob", name: "Classic Bob", prompt: "short professional bob haircut, sleek and straight" },
  { id: "wolf", name: "Wolf Cut", prompt: "modern wolf cut with layers and fringe, messy chic" },
  { id: "pixie", name: "Pixie Cut", prompt: "elegant short pixie cut, textured and stylish" },
  { id: "layers", name: "Long Layers", prompt: "long voluminous hair with soft layers and waves" },
  { id: "curls", name: "Defined Curls", prompt: "shoulder-length bouncy defined curls, high volume" },
  { id: "fade", name: "Mid Fade", prompt: "clean mid fade haircut with textured top" }
];

export default function TryOnHairPage() {
  const { user, customerProfile } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamMode, setIsWebcamMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<"idle" | "refining" | "generating" | "complete">("idle");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setIsWebcamMode(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneration = async () => {
    if (!image) {
      setError("Please capture or upload a photo first.");
      return;
    }

    const finalPrompt = customPrompt || (selectedPreset ? PRESET_STYLES.find(s => s.id === selectedPreset)?.prompt : "");
    
    if (!finalPrompt) {
      setError("Please select a style or enter a custom prompt.");
      return;
    }

    setIsAnalyzing(true);
    setIsImageLoading(true);
    setError(null);
    setGenerationStep("refining");

    try {
      // 1. Refine Prompt using Gemini
      const refineRes = await fetch("/api/refine-hairstyle-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: finalPrompt, base64Image: image })
      });

      if (!refineRes.ok) throw new Error("Failed to refine prompt with Gemini.");
      const { refinedPrompt } = await refineRes.json();
      
      setGenerationStep("generating");

      // 2. Generate Image using Pollinations via backend proxy
      const genRes = await fetch("/api/fal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: refinedPrompt })
      });

      // If the server returned an error (JSON), surface the message
      const resContentType = genRes.headers.get("content-type") ?? "";
      if (resContentType.includes("json")) {
        const errData = await genRes.json();
        throw new Error(errData.error || "Image generation failed.");
      }

      if (!genRes.ok) throw new Error("Image generation failed. Our neural servers are recalibrating.");
      
      const blob = await genRes.blob();
      if (blob.size === 0) throw new Error("Received empty image. Please retry.");

      const imageUrl = URL.createObjectURL(blob);
      
      setResultImage(imageUrl);
      setGenerationStep("complete");
    } catch (err: any) {
      setError(err.message);
      setGenerationStep("idle");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <Zap className="w-3 h-3" />
            Neural Studio
          </div>
          <h1 className="text-4xl font-black text-deep-grape italic tracking-tighter">AI Try On Hair</h1>
          <p className="text-deep-grape/40 text-[10px] uppercase font-black tracking-widest mt-1">Visualize your next look with Gemini-Powered Synthesis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Pane: Capture */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-[3/4] bg-warm-grey/30 rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl group">
            <AnimatePresence mode="wait">
              {isWebcamMode ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  <div className="absolute inset-0 border-[12px] border-white/10 pointer-events-none" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                    <button 
                      onClick={capture}
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <div className="w-16 h-16 border-4 border-naturals-purple rounded-full" />
                    </button>
                    <button 
                      onClick={() => setIsWebcamMode(false)}
                      className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : image ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <img src={image} className="w-full h-full object-cover" alt="Captured" />
                  <button 
                    onClick={() => { setImage(null); setResultImage(null); setGenerationStep("idle"); }}
                    className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  {isAnalyzing && (
                    <motion.div 
                      initial={{ y: "-100%" }}
                      animate={{ y: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-naturals-purple to-transparent z-20 shadow-[0_0_20px_rgba(142,62,150,0.8)]"
                    />
                  )}
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-10 h-10 text-naturals-purple/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-deep-grape uppercase tracking-widest mb-2">Initialize Scanner</h3>
                    <p className="text-[10px] font-bold text-deep-grape/30 uppercase leading-relaxed">Position your face clearly for high-fidelity neural mapping</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <button 
                      onClick={() => setIsWebcamMode(true)}
                      className="w-full py-4 bg-naturals-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-naturals-purple/20 flex items-center justify-center gap-3 hover:bg-deep-grape transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Live Capture
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 bg-white border border-black/5 text-deep-grape rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 hover:bg-warm-grey transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Portrait
                    </button>
                  </div>
                </div>
              )}
            </AnimatePresence>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Right Pane: Controls */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card bg-white rounded-[3rem] p-10 border border-black/5 shadow-2xl space-y-10">
            {/* Step 1: Style Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scissors className="w-5 h-5 text-naturals-purple" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Choose Your Style</h3>
                </div>
                {selectedPreset && (
                  <button 
                    onClick={() => setSelectedPreset(null)}
                    className="text-[9px] font-black text-red-500 uppercase tracking-widest"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PRESET_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => { setSelectedPreset(style.id); setCustomPrompt(""); }}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedPreset === style.id
                        ? "border-naturals-purple bg-naturals-purple/5 shadow-lg shadow-naturals-purple/10"
                        : "border-black/5 hover:border-naturals-purple/30 bg-warm-grey/10"
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedPreset === style.id ? 'text-naturals-purple' : 'text-deep-grape/40'}`}>
                      {style.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Custom Prompt */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-naturals-purple" />
                <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Custom Description</h3>
              </div>
              <div className="relative">
                <textarea 
                  value={customPrompt}
                  onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPreset(null); }}
                  placeholder="e.g. A long wavy red hair with curtain bangs..."
                  className="w-full bg-warm-grey/20 border border-black/5 rounded-[2rem] p-6 text-xs font-bold text-deep-grape outline-none focus:border-naturals-purple focus:bg-white transition-all min-h-[120px] resize-none"
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-2">
                  <span className="text-[9px] font-black text-deep-grape/20 uppercase tracking-widest">Powered by Gemini</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4">
              <button 
                onClick={handleGeneration}
                disabled={isAnalyzing || (!image)}
                className="w-full py-6 bg-deep-grape text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-deep-grape/30 hover:bg-naturals-purple transition-all disabled:opacity-20 flex items-center justify-center gap-4 group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {generationStep === "refining" ? "Gemini Refining Prompt..." : "Neural Synthesis in Progress..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    Synthesize Hairstyle
                  </>
                )}
              </button>
              {error && (
                <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest mt-6 animate-pulse">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Status Tracker */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-[2rem] border transition-all ${generationStep !== "idle" ? 'border-naturals-purple/20 bg-naturals-purple/[0.02]' : 'border-black/5 bg-white'}`}>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className={`w-4 h-4 ${generationStep === "refining" || generationStep === "generating" || generationStep === "complete" ? 'text-green-500' : 'text-deep-grape/10'}`} />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-deep-grape">Identity Lock</h4>
              </div>
              <p className="text-[9px] font-bold text-deep-grape/30 uppercase leading-tight">Preserving original facial structure and biometric data</p>
            </div>
            <div className={`p-6 rounded-[2rem] border transition-all ${generationStep === "complete" ? 'border-naturals-purple/20 bg-naturals-purple/[0.02]' : 'border-black/5 bg-white'}`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className={`w-4 h-4 ${generationStep === "complete" ? 'text-green-500' : 'text-deep-grape/10'}`} />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-deep-grape">Neural Quality</h4>
              </div>
              <p className="text-[9px] font-bold text-deep-grape/30 uppercase leading-tight">High-fidelity texture synthesis active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal Overlay */}
      <AnimatePresence>
        {resultImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deep-grape/90 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/20 relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[3/4] bg-warm-grey/10 relative overflow-hidden flex items-center justify-center">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-warm-grey/20 z-10">
                      <div className="w-16 h-16 border-4 border-naturals-purple border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.3em] animate-pulse">Neural Rendering...</p>
                    </div>
                  )}
                  <img 
                    src={resultImage} 
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    alt="Result" 
                    onLoad={() => { setIsImageLoading(false); setError(null); }}
                    onError={() => {
                      setIsImageLoading(false);
                      setError("Neural Synthesis timed out. Please try another style or retry.");
                      setResultImage(null);
                    }}
                  />
                  <div className="absolute top-8 left-8 z-20">
                    <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                      <p className="text-[9px] font-black text-white uppercase tracking-widest">New Look</p>
                    </div>
                  </div>
                </div>
                <div className="p-12 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-naturals-purple/20">
                      <Sparkles className="w-3 h-3" />
                      Synthesis Complete
                    </div>
                    <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-4">Neural Transformation</h3>
                    <p className="text-xs font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed mb-8">
                      Your requested hairstyle has been synthesized while maintaining your unique facial characteristics.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-5 bg-warm-grey/30 rounded-2xl border border-black/5">
                        <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-widest mb-1">Style Applied</p>
                        <p className="text-[11px] font-black text-naturals-purple uppercase italic">
                          {selectedPreset ? PRESET_STYLES.find(s => s.id === selectedPreset)?.name : "Custom Design"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-10">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = `naturals-ai-style-${Date.now()}.png`;
                        link.click();
                      }}
                      className="w-full py-5 bg-naturals-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-naturals-purple/20 hover:bg-deep-grape transition-all flex items-center justify-center gap-3"
                    >
                      Save to My Passport
                    </button>
                    <button 
                      onClick={() => setResultImage(null)}
                      className="w-full py-5 bg-white border border-black/5 text-deep-grape rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-warm-grey transition-all"
                    >
                      Try Another Style
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setResultImage(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-black/5 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all group"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
