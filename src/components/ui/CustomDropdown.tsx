"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  slim?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select option...",
  className = "",
  buttonClassName = "",
  slim = false,
  onOpenChange,
}: CustomDropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const toggleDropdown = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (onOpenChange) onOpenChange(nextState);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-2 ml-1">
          {label}
        </p>
      )}
      
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full ${slim ? 'py-2 px-3 rounded-xl' : 'py-4 px-6 rounded-2xl'} bg-white/50 backdrop-blur-md border border-black/5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between hover:border-naturals-purple/30 hover:shadow-xl hover:shadow-naturals-purple/5 transition-all focus:outline-none ${buttonClassName}`}
      >
        <span className={selectedOption?.color || "text-deep-grape"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`${slim ? 'w-3 h-3' : 'w-4 h-4'} transition-transform duration-300 text-deep-grape/30 ${
            isOpen ? 'rotate-180 text-naturals-purple' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[60]" 
              onClick={() => {
                setIsOpen(false);
                if (onOpenChange) onOpenChange(false);
              }} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full left-0 right-0 z-[70] p-1.5 bg-white/95 backdrop-blur-xl border border-black/5 ${slim ? 'rounded-xl' : 'rounded-2xl'} shadow-2xl overflow-hidden min-w-full`}
            >
              <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      if (onOpenChange) onOpenChange(false);
                    }}
                    className={`w-full ${slim ? 'p-2 rounded-lg' : 'p-3 rounded-xl'} text-[10px] font-black uppercase tracking-widest text-left transition-all flex items-center justify-between group hover:bg-naturals-purple/10 ${
                      opt.color || "text-deep-grape/70"
                    } ${value === opt.value ? 'bg-naturals-purple/5' : ''}`}
                  >
                    {opt.label}
                    {value === opt.value && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
