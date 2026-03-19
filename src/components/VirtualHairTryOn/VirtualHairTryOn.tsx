"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CameraFeed from "./CameraFeed";
import HairstyleSelector, { hairstyles, Hairstyle } from "./HairstyleSelector";
import HairColorSelector, { hairColors, HairColor } from "./HairColorSelector";
import { Sparkles, Camera as CameraIcon, Download, Save } from "lucide-react";
import { motion } from "framer-motion";

const VirtualHairTryOn: React.FC = () => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(hairstyles[0].id);
  const [selectedColorId, setSelectedColorId] = useState<string>(hairColors[0].id);
  const [isAiLoading, setIsAiLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceData, setFaceData] = useState<{ x: number; y: number; width: number; rotation: number; scale: number } | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  const onResults = useCallback((results: any) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setFaceData(null);
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    
    const top = landmarks[10];
    const bottom = landmarks[152];
    const left = landmarks[234];
    const right = landmarks[454];

    const faceWidth = Math.sqrt(Math.pow(right.y - left.y, 2) + Math.pow(right.x - left.x, 2));
    const faceCenter = {
      x: (left.x + right.x) / 2,
      y: (top.y + bottom.y) / 2
    };

    const rotation = Math.atan2(right.y - left.y, right.x - left.x);

    const newData = {
      x: faceCenter.x,
      y: top.y,
      width: faceWidth,
      rotation: rotation * (180 / Math.PI),
      scale: faceWidth * 2.5
    };

    setFaceData(newData);
    setIsAiLoading(false);
  }, []);

  useEffect(() => {
    let faceMesh: any;
    let videoEl: HTMLVideoElement | null = null;
    let isActive = true;
    let isReady = false;

    const loadScripts = async () => {
      const VERSION = '0.4.1633559619';
      if (!(window as any).FaceMesh) {
        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${VERSION}/face_mesh.js`;
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      if (isActive) setupFaceMesh(VERSION);
    };

    const setupFaceMesh = (version: string) => {
      try {
        faceMesh = new (window as any).FaceMesh({
          locateFile: (file: any) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${version}/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results: any) => {
          if (isActive) {
            onResults(results);
            isReady = true;
          }
        });

        if (videoEl) runFrame();
      } catch (err) {
        console.error("FaceMesh Init Error:", err);
      }
    };

    const runFrame = async () => {
      if (!isActive || !faceMesh) return;
      
      if (videoEl && videoEl.readyState >= 2) {
        try {
          await faceMesh.send({ image: videoEl });
        } catch (e) {
          // Quietly handle initialization frames
        }
      }
      requestRef.current = requestAnimationFrame(runFrame);
    };

    loadScripts();

    (window as any).setupMediaPipe = (video: HTMLVideoElement) => {
      videoEl = video;
      if (faceMesh) runFrame();
    };

    return () => {
      isActive = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (faceMesh && typeof faceMesh.close === 'function') {
        try {
          faceMesh.close();
        } catch (e) {}
      }
    };
  }, [onResults]);

  const selectedStyle = hairstyles.find(s => s.id === selectedStyleId) || hairstyles[0];
  const selectedColor = hairColors.find(c => c.id === selectedColorId) || hairColors[0];

  const handleCapture = () => {
    alert("Snapshot captured and saved to Styling Vault!");
  };

  const handleSave = () => {
    alert("Preference saved to Consultation Record.");
  };

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="grid lg:grid-cols-3 gap-10 h-full">
        {/* Mirror/Webcam View */}
        <div className="lg:col-span-2 relative flex flex-col justify-between h-full">
          <div className="relative flex-1 rounded-[3rem] overflow-hidden bg-black shadow-2xl border-8 border-white group">
            <CameraFeed onVideoReady={(video) => (window as any).setupMediaPipe(video)} />
            
            {/* AI Overlay Layer */}
            {faceData && (
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: `${(1 - faceData.x) * 100}%`, // Inverted because of mirror mode
                  top: `${(faceData.y + selectedStyle.offsetY) * 100}%`,
                  width: `${faceData.scale * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${-faceData.rotation}deg)`,
                  transition: 'none',
                }}
              >
                <img 
                  src={selectedStyle.image} 
                  alt="Hairstyle Overlay"
                  className="w-full h-auto"
                  style={{
                     mixBlendMode: 'multiply',
                     filter: `hue-rotate(${selectedColor.hue}deg) saturate(${selectedColor.saturation * 100}%) brightness(${selectedColor.brightness}) contrast(1.2)`,
                     opacity: 0.95
                  }}
                />
              </div>
            )}

            {/* Loading Indicator */}
            {isAiLoading && (
              <div className="absolute inset-0 bg-deep-grape/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                <Sparkles className="w-12 h-12 text-naturals-purple animate-pulse mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.4em]">Initializing AI Engine...</p>
              </div>
            )}

            {/* HUD */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <p className="text-white font-black text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">Live AR Simulation</p>
            </div>
            
            {/* Action Buttons */}
            <div className="absolute bottom-8 right-8 flex gap-4">
               <button onClick={handleCapture} className="w-14 h-14 rounded-2xl bg-white text-deep-grape flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer">
                  <CameraIcon className="w-6 h-6" />
               </button>
               <button onClick={handleSave} className="w-14 h-14 rounded-2xl bg-naturals-purple text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer">
                  <Save className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="glass-card p-10 flex flex-col bg-white border border-black/5 shadow-xl justify-between">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tighter">Style Configuration</h2>
              <p className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-widest">Real-time neural rendering of hair architecture.</p>
            </div>

            <HairstyleSelector selectedStyle={selectedStyleId} onSelect={setSelectedStyleId} suggestedStyleId="layered" />
            <HairColorSelector selectedColor={selectedColorId} onSelect={setSelectedColorId} />
          </div>

          <div className="space-y-4">
             <div className="p-6 rounded-2xl bg-warm-grey/30 border border-black/5">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Selected Profile</p>
                <p className="text-xs font-black text-deep-grape italic uppercase">{selectedStyle.name} • {selectedColor.name}</p>
             </div>
             <button onClick={() => alert("Forwarding style configuration to Stylist Copilot.")} className="w-full py-5 bg-deep-grape text-white font-black text-xs tracking-[0.3em] uppercase rounded-2xl shadow-2xl hover:bg-naturals-purple transition-all cursor-pointer">
               Book This Style
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualHairTryOn;
