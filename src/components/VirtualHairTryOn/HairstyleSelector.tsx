"use client";

import React from "react";
import { Scissors } from "lucide-react";

export interface Hairstyle {
  id: string;
  name: string;
  image: string;
  offsetY: number; // For fine-tuning position
  scale: number;   // For fine-tuning size
}

export const hairstyles: Hairstyle[] = [
  { id: "none", name: "None", image: "", offsetY: 0, scale: 1.0 },
  { id: "short", name: "Short", image: "/hairstyles/short.png", offsetY: -0.35, scale: 1.1 },
  { id: "curly", name: "Curly", image: "/hairstyles/curly.png", offsetY: -0.3, scale: 1.2 },
  { id: "fade", name: "Fade", image: "/hairstyles/fade.png", offsetY: -0.35, scale: 1.0 },
  { id: "layered", name: "Layered", image: "/hairstyles/layered.png", offsetY: -0.3, scale: 1.3 },
  { id: "long", name: "Long", image: "/hairstyles/long.png", offsetY: -0.25, scale: 1.4 },
];

interface HairstyleSelectorProps {
  selectedStyle: string;
  onSelect: (id: string) => void;
  suggestedStyleId?: string;
}

const HairstyleSelector: React.FC<HairstyleSelectorProps> = ({ selectedStyle, onSelect, suggestedStyleId }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape flex items-center gap-2">
        <Scissors className="w-4 h-4 text-naturals-purple" /> Select Hairstyle
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {hairstyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border whitespace-nowrap cursor-pointer relative ${
              selectedStyle === style.id
                ? "bg-deep-grape text-white border-transparent shadow-xl"
                : "bg-white text-deep-grape border-black/5 hover:border-naturals-purple/30"
            }`}
          >
            {style.name}
            {suggestedStyleId === style.id && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-[7px] rounded-full animate-bounce">AI CHOICE</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HairstyleSelector;
