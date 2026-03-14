"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Scissors, LineChart, Target, ShieldCheck, 
  Settings, LogOut, Bell, Search, Sparkles, BookOpen 
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "SOP Audit", href: "/dashboard/sop", icon: ShieldCheck },
  { name: "Beauty Passport", href: "/dashboard/passport", icon: Target },
  { name: "AI Stylist Copilot", href: "/dashboard/stylist", icon: Scissors },
  { name: "Trend Engine", href: "/dashboard/trends", icon: LineChart },
  { name: "Consultation", href: "/dashboard/consultation", icon: Users },
  { name: "Academy", href: "/dashboard/academy", icon: BookOpen },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white text-deep-grape flex overflow-hidden selection:bg-naturals-purple selection:text-white">
      
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-white border-r border-naturals-purple/5 flex flex-col transition-all z-20 shrink-0 shadow-[4px_0_24px_rgba(142,62,150,0.05)]"
      >
        <div className="h-20 flex items-center justify-center border-b border-naturals-purple/5 px-6">
          <Link href="/" className="flex items-center gap-3 w-full group overflow-hidden whitespace-nowrap">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-naturals-purple to-lavender flex items-center justify-center shrink-0">
              <Sparkles className="text-white w-6 h-6 group-hover:rotate-12 transition-transform" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight opacity-100 transition-opacity">
                Naturals AI
              </span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? "bg-naturals-purple/10 text-naturals-purple font-bold" 
                    : "text-deep-grape/70 hover:bg-warm-grey"
                }`}
                title={link.name}
              >
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-naturals-purple" />
                )}
                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? "" : "group-hover:text-naturals-purple transition-colors"}`} />
                {isSidebarOpen && <span className="whitespace-nowrap">{link.name}</span>}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-naturals-purple/5 space-y-2">
          <Link href="/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-deep-grape/70 hover:bg-warm-grey transition-all">
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Settings</span>}
          </Link>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-lavender/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-xl border-b border-naturals-purple/5 flex items-center justify-between px-8 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-sm text-deep-grape lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-warm-grey/50 px-4 py-2 rounded-full w-96 border border-transparent focus-within:border-naturals-purple/30 transition-all">
            <Search className="w-4 h-4 text-deep-grape/40" />
            <input 
              type="text" 
              placeholder="Search clients, SOPs, trends..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-deep-grape/40"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-deep-grape/60 hover:text-naturals-purple transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-naturals-purple rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-black/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin Central</p>
                <p className="text-xs text-deep-grape/60">Headquarters</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-naturals-purple to-lavender flex items-center justify-center font-bold text-white shadow-md">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
