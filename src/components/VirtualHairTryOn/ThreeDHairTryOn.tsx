"use client";

import React, { useState } from "react";
import { Camera as CameraIcon, Cpu } from "lucide-react";
import HairstyleSelector, { hairstyles } from "./HairstyleSelector";
import HairColorSelector, { hairColors } from "./HairColorSelector";

interface FaceData {
  x: number;
  y: number;
  width: number;
  rotation: number;
  scale: number;
}

const ThreeDHairTryOn: React.FC = () => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(hairstyles[0].id);
  const [selectedColorId, setSelectedColorId] = useState<string>(hairColors[0].id);
  const [faceData, setFaceData] = useState<FaceData>({
    x: 50,
    y: 30,
    width: 50,
    rotation: 0,
    scale: 100
  });

  const selectedStyle = hairstyles.find(s => s.id === selectedStyleId) || hairstyles[0];
  const selectedColor = hairColors.find(c => c.id === selectedColorId) || hairColors[0];

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="grid lg:grid-cols-3 gap-10 h-full">
        <div className="lg:col-span-2 relative flex flex-col justify-between h-full">
          <div className="relative flex-1 rounded-[3rem] overflow-hidden bg-black shadow-2xl border-8 border-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>

            <div 
              className="absolute pointer-events-none"
              style={{
                left: `${faceData.x}%`,
                top: `${faceData.y}%`,
                transform: `translate(-50%, -50%) rotate(${faceData.rotation}deg)`,
                width: `${faceData.scale / 2}%`,
                filter: `hue-rotate(${selectedColor.hue}deg) saturate(${selectedColor.saturation * 100}%)`,
              }}
            >
              <img
                src={selectedStyle.image}
                alt={selectedStyle.name}
                className="w-full h-auto opacity-90"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                <p className="text-white font-black text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">Hair Preview</p>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8">
               <button onClick={() => alert("Capture verified.")} className="w-14 h-14 rounded-2xl bg-white text-deep-grape flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer">
                  <CameraIcon className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 flex flex-col bg-white border border-black/5 shadow-xl justify-between overflow-y-auto">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-naturals-purple mb-2">
                <Cpu className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Hair Simulation</p>
              </div>
              <h2 className="text-2xl font-black text-deep-grape mb-2 italic tracking-tighter">Hairstyle Preview</h2>
              <p className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed">Use sliders to position hair on your face.</p>
            </div>

            <HairstyleSelector selectedStyle={selectedStyleId} onSelect={setSelectedStyleId} suggestedStyleId="layered" />
            <HairColorSelector selectedColor={selectedColorId} onSelect={setSelectedColorId} />

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape">Position Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-deep-grape/60 flex justify-between">
                    <span>Horizontal</span>
                    <span>{faceData.x}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={faceData.x}
                    onChange={(e) => setFaceData(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-warm-grey rounded-full appearance-none cursor-pointer accent-naturals-purple"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-deep-grape/60 flex justify-between">
                    <span>Vertical</span>
                    <span>{faceData.y}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={faceData.y}
                    onChange={(e) => setFaceData(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-warm-grey rounded-full appearance-none cursor-pointer accent-naturals-purple"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-deep-grape/60 flex justify-between">
                    <span>Size</span>
                    <span>{faceData.scale}%</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={faceData.scale}
                    onChange={(e) => setFaceData(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-warm-grey rounded-full appearance-none cursor-pointer accent-naturals-purple"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-deep-grape/60 flex justify-between">
                    <span>Rotation</span>
                    <span>{faceData.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={faceData.rotation}
                    onChange={(e) => setFaceData(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-warm-grey rounded-full appearance-none cursor-pointer accent-naturals-purple"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
             <button onClick={() => alert("Synchronizing with Stylist Copilot...")} className="w-full py-5 bg-deep-grape text-white font-black text-xs tracking-[0.3em] uppercase rounded-2xl shadow-2xl hover:bg-naturals-purple transition-all cursor-pointer">
               Apply These Settings
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDHairTryOn;
