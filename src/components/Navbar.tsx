"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FDF9FF]/90 backdrop-blur-md shadow-sm border-b border-naturals-purple/10"
          : "bg-transparent py-4 text-deep-grape"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
            <div className={`relative w-48 h-12 transition-all shrink-0`}>
               <Image 
                src="/naturalslogo.png" 
                alt="Naturals Logo" 
                fill 
                className={`object-contain object-left`}
                priority
              />
            </div>
          </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-semibold text-sm uppercase tracking-wider">
          <Link href="#instructions" className="hover:text-naturals-purple transition-colors">Instructions</Link>
          <Link href="#features" className="hover:text-naturals-purple transition-colors">Modules</Link>
          <Link href="#ai" className="hover:text-naturals-purple transition-colors">Intelligence</Link>
          
          <Link href="/dashboard/experience" className="text-naturals-purple font-black hover:text-lavender transition-colors border-b-2 border-naturals-purple/20 pb-0.5">
            Book Appointment
          </Link>
          
          <Link href="/login" className="px-7 py-2.5 rounded-full bg-deep-grape text-white hover:bg-naturals-purple transition-all shadow-md">
            Launch Platform
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-deep-grape p-2 hover:bg-black/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-black/5 absolute top-full left-0 w-full py-8 px-6 flex flex-col gap-6 text-center shadow-2xl"
        >
          <Link href="#instructions" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-naturals-purple transition-colors">Instructions</Link>
          <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-naturals-purple transition-colors">Modules</Link>
          <Link href="#ai" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest hover:text-naturals-purple transition-colors">Intelligence</Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 px-8 py-4 rounded-xl bg-deep-grape text-white font-bold mx-auto w-full max-w-[240px] uppercase tracking-widest transition-all hover:bg-naturals-purple">
            Launch Platform
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
