"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

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
          ? "glass shadow-md"
          : "bg-transparent py-4 text-deep-grape"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-naturals-purple to-lavender flex items-center justify-center shadow-[0_0_15px_rgba(142,62,150,0.5)]">
            <Sparkles className="text-white w-6 h-6 group-hover:animate-pulse" />
          </div>
          <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? "text-deep-grape" : "text-deep-grape"}`}>
            Naturals <span className="text-naturals-purple">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="#features" className="hover:text-naturals-purple transition-colors">Platform Modules</Link>
          <Link href="#dashboards" className="hover:text-naturals-purple transition-colors">Intelligence</Link>
          <Link href="#ai" className="hover:text-naturals-purple transition-colors">Consultation</Link>
          
          <Link href="/login" className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-deep-grape text-white shadow-lg hover:shadow-naturals-purple/30 transition-shadow">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-naturals-purple to-lavender opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              Sign In <Sparkles className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-deep-grape"
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
          className="md:hidden glass absolute top-full left-0 w-full py-6 px-6 flex flex-col gap-4 text-center"
        >
          <Link href="#features" className="py-2 hover:text-naturals-purple">Platform Modules</Link>
          <Link href="#dashboards" className="py-2 hover:text-naturals-purple">Intelligence</Link>
          <Link href="#ai" className="py-2 hover:text-naturals-purple">Consultation</Link>
          <Link href="/login" className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-naturals-purple to-lavender text-white font-bold mx-auto w-full max-w-[200px]">
            Sign In
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
