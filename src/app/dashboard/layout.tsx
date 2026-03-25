"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
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
  LogOut,
  Menu,
  Activity,
  Calendar,
  Bot
} from "lucide-react";
import { Tooltip } from "@/components/Tooltip";
import Image from "next/image";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "franchise_owner", "stylist"] },
  { name: "AI Assistant", href: "/dashboard/assistant", icon: Bot, roles: ["admin", "manager", "franchise_owner", "stylist", "customer"] },
  { name: "Book Appointment", href: "/dashboard", icon: Calendar, roles: ["customer"] },
  { name: "SOP Audit", href: "/dashboard/sop", icon: ShieldCheck, roles: ["admin", "manager"] },
  { name: "Beauty Passport", href: "/dashboard/passport", icon: Target, roles: ["customer"] },
  { name: "AI Stylist Copilot", href: "/dashboard/stylist", icon: Scissors, roles: ["stylist", "admin"] },
  { name: "Trend Engine", href: "/dashboard/trends", icon: LineChart, roles: ["admin", "manager"] },
  { name: "Academy", href: "/dashboard/academy", icon: BookOpen, roles: ["admin"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, customerProfile, loading, signOut, isAdmin, isManager, isFranchiseOwner, isStylist } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('Dashboard State Debug:', {
      userRole: isAdmin ? "admin" : (profile?.role || "customer"),
      hasCustomerProfile: !!customerProfile,
      pathname,
      loading
    });
  }, [isAdmin, profile, customerProfile, pathname, loading]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    
    if (!loading && user && (isAdmin ? false : (profile?.role === 'customer')) && customerProfile) {
      const isComplete = customerProfile.phone && customerProfile.phone !== 'PENDING';
      
      if (!isComplete && pathname !== '/dashboard/onboarding') {
        router.push('/dashboard/onboarding');
      } else if (isComplete && pathname === '/dashboard/onboarding') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, profile, customerProfile, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching Protocols for: ${searchQuery}`);
      setSearchQuery("");
    }
  };

  // Use the verified role flags from the auth context
  const userRole = isAdmin ? "admin" : (profile?.role || "customer");

  const needsOnboarding = userRole === 'customer' && customerProfile && (!customerProfile.phone || customerProfile.phone === 'PENDING');

  const filteredLinks = sidebarLinks.filter(link => {
    if (userRole === "customer" && !customerProfile) return false;
    if (needsOnboarding) return false;
    return link.roles.includes(userRole);
  });

  if (loading) return null;

  if (userRole === "customer" && !customerProfile && pathname !== '/dashboard/onboarding') {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 w-full h-96 bg-naturals-purple/5 blur-[100px] pointer-events-none" />
        
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
           <div className="relative w-48 h-12">
             <Image 
              src="/naturalslogo.png" 
              alt="Naturals Logo" 
              fill 
              sizes="192px"
              className="object-contain"
              priority
            />
           </div>
        </div>
        
        <div className="p-12 text-center bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-black/5 max-w-lg mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
          <Users className="w-16 h-16 text-naturals-purple/30 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-deep-grape uppercase tracking-tighter mb-3">Welcome to Naturals AI!</h2>
          <p className="text-xs font-bold text-deep-grape/40 mb-10 uppercase tracking-widest leading-relaxed">
            Let&apos;s set up your personalized beauty profile.<br />
            Please complete your registration below.
          </p>
          <button 
            onClick={() => router.push('/dashboard/onboarding')}
            className="px-10 py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-[0_8px_30px_rgb(20,20,20,0.12)] shadow-naturals-purple/20 hover:scale-[1.02] transition-all w-full sm:w-auto"
          >
            Complete Profile Setup
          </button>
        </div>
      </div>
    );
  }

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
                sizes="192px"
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
          {isSidebarOpen && filteredLinks.length > 0 && (
            <div className="mb-6 px-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Authenticated As</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-black text-naturals-purple italic">{userRole.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#fafafa]">
        
        {/* Top Header */}
        {!(userRole === "customer" && !customerProfile) && pathname !== '/dashboard/onboarding' && (
          <header className="h-20 bg-white border-b border-naturals-purple/5 flex items-center justify-between px-8 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-warm-grey text-deep-grape hover:bg-naturals-purple hover:text-white transition-all shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-naturals-purple/5 border border-naturals-purple/10">
                <div className="w-1.5 h-1.5 rounded-full bg-naturals-purple animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-naturals-purple italic">
                  {isAdmin ? "Central Command" : (profile?.branch_name || (isFranchiseOwner ? "Adayar Branch" : "Official Branch"))}
                </span>
              </div>
            </div>

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
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30 leading-none mb-1 text-right">
                    {isAdmin ? "Command Center" : (profile?.branch_name || (isFranchiseOwner ? "Adayar Branch" : "Official Branch"))}
                  </p>
                  <p className="text-[11px] font-black text-deep-grape italic text-right">
                    {isAdmin ? "ADMINISTRATOR" : (profile?.full_name?.toUpperCase() || customerProfile?.full_name?.toUpperCase() || (user?.displayName?.toUpperCase()) || "GUEST")}
                  </p>
                </div>
                <div className="relative group/avatar">
                  <div className="w-10 h-10 rounded-xl bg-deep-grape overflow-hidden flex items-center justify-center font-black text-white shadow-lg text-[10px] italic border-2 border-transparent group-hover/avatar:border-naturals-purple transition-all">
                    {(profile?.profile_photo_url || customerProfile?.profile_photo_url || user?.photoURL) ? (
                      <img 
                        src={profile?.profile_photo_url || customerProfile?.profile_photo_url || user?.photoURL} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{profile?.full_name?.substring(0, 2).toUpperCase() || customerProfile?.full_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "NA"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 z-10 bg-[#fafafa]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
