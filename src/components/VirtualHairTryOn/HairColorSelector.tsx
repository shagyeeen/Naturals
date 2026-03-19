"use client";

import React from "react";
import { Palette } from "lucide-react";

export interface HairColor {
  id: string;
  name: string;
  hue: number;
  saturation: number;
  brightness: number;
  hex: string;
}

export const hairColors: HairColor[] = [
  { id: "black", name: "Black", hue: 0, saturation: 0, brightness: 0.3, hex: "#000000" },
  { id: "brown", name: "Brown", hue: 30, saturation: 0.5, brightness: 0.5, hex: "#8B4513" },
  { id: "blonde", name: "Blonde", hue: 50, saturation: 0.6, brightness: 1.2, hex: "#FFD700" },
  { id: "red", name: "Red", hue: 0, saturation: 1.0, brightness: 1.0, hex: "#FF0000" },
  { id: "blue", name: "Blue", hue: 200, saturation: 1.0, brightness: 1.0, hex: "#0000FF" },
  { id: "ash-gray", name: "Ash Gray", hue: 0, saturation: 0, brightness: 0.8, hex: "#808080" },
];

interface HairColorSelectorProps {
  selectedColor: string;
  onSelect: (id: string) => void;
}

const HairColorSelector: React.FC<HairColorSelectorProps> = ({ selectedColor, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape flex items-center gap-2">
        <Palette className="w-4 h-4 text-naturals-purple" /> Select Hair Color
      </h3>
      <div className="grid grid-cols-6 gap-3">
        {hairColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelect(color.id)}
            title={color.name}
            className={`w-full aspect-square rounded-xl border-4 transition-all shadow-lg transform hover:scale-110 cursor-pointer ${
              selectedColor === color.id ? "border-naturals-purple scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default HairColorSelector;
