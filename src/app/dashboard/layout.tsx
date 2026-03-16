"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Scissors, 
  LineChart, 
  Users, 
  BookOpen, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  Activity
} from "lucide-react";
import Image from "next/image";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["Manager", "Franchise Owner", "Admin"] },
  { name: "Personal Experience", href: "/dashboard/experience", icon: Sparkles, roles: ["Customer", "Stylist", "Franchise Owner", "Admin"] },
  { name: "SOP Audit", href: "/dashboard/sop", icon: ShieldCheck, roles: ["Manager", "Stylist", "Franchise Owner", "Admin"] },
  { name: "Beauty Passport", href: "/dashboard/passport", icon: Target, roles: ["Customer", "Manager", "Franchise Owner", "Admin"] },
  { name: "AI Stylist Copilot", href: "/dashboard/stylist", icon: Scissors, roles: ["Stylist", "Franchise Owner", "Admin"] },
  { name: "Trend Engine", href: "/dashboard/trends", icon: LineChart, roles: ["Manager", "Franchise Owner", "Admin"] },
  { name: "Consultation", href: "/dashboard/consultation", icon: Activity, roles: ["Customer", "Stylist", "Manager", "Franchise Owner", "Admin"] },
  { name: "Academy", href: "/dashboard/academy", icon: BookOpen, roles: ["Stylist", "Manager", "Franchise Owner", "Admin"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.push("/login");
    } else {
      setUserRole(role);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching Protocols for: ${searchQuery}`);
      setSearchQuery("");
    }
  };

  const filteredLinks = sidebarLinks.filter(link => 
    userRole ? link.roles.includes(userRole) : false
  );

  return (
    <div className="min-h-screen bg-white text-deep-grape flex overflow-hidden selection:bg-naturals-purple selection:text-white">
      
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-white border-r border-naturals-purple/10 flex flex-col transition-all z-20 shrink-0 shadow-[4px_0_24px_rgba(142,62,150,0.05)]"
      >
        <div className="h-24 flex items-center px-6 border-b border-naturals-purple/5 bg-[#fafafa]">
          <Link href="/" className="flex items-center gap-3 w-full group overflow-hidden whitespace-nowrap">
            <div className={`relative ${isSidebarOpen ? 'w-48 h-12' : 'w-10 h-10'} transition-all shrink-0`}>
               <Image 
                src="/naturalslogo.png" 
                alt="Naturals Logo" 
                fill 
                className={`object-contain ${isSidebarOpen ? 'object-left' : 'object-center'}`}
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-10 px-4 space-y-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? "bg-naturals-purple text-white shadow-xl shadow-naturals-purple/20" 
                    : "text-deep-grape/60 hover:bg-warm-grey hover:text-deep-grape"
                }`}
                title={link.name}
              >
                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-naturals-purple transition-colors"}`} />
                {isSidebarOpen && <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-widest">{link.name}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div layoutId="active-indicator" className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            )
          })}
        </div>

        <div className="p-6 border-t border-naturals-purple/5 bg-[#fafafa] space-y-2">
          {isSidebarOpen && (
            <div className="mb-4 px-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Authenticated As</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-black text-naturals-purple italic">{userRole}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-widest">Terminate Session</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#fafafa]">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-naturals-purple/5 flex items-center justify-between px-8 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-warm-grey text-deep-grape hover:bg-naturals-purple hover:text-white transition-all shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-3 bg-warm-grey/50 px-5 py-2.5 rounded-full w-[400px] border border-black/5 shadow-inner focus-within:border-naturals-purple/30 focus-within:bg-white transition-all"
          >
            <Search className="w-4 h-4 text-deep-grape/30" />
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOLS OR CLIENT ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest w-full placeholder:text-deep-grape/30"
            />
          </form>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => alert("System Status: Operational • All AI Modules Online")}
              className="relative p-2.5 text-deep-grape/40 hover:text-naturals-purple transition-colors cursor-pointer bg-warm-grey/50 rounded-full"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-naturals-purple rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-black/5">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 leading-none mb-1">HQ Command</p>
                <p className="text-[11px] font-black text-deep-grape italic">OPERATOR_01</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-deep-grape flex items-center justify-center font-black text-white shadow-lg text-[10px] italic">
                {userRole?.substring(0, 2).toUpperCase() || "NA"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 z-10">
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
