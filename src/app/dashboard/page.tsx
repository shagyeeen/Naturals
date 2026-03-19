"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import StaffDashboard from "@/components/StaffDashboard";
import BookingPage from "@/components/BookingSystem";
import ThreeDHairTryOn from "@/components/VirtualHairTryOn/ThreeDHairTryOn";
import { Calendar, Users, Scissors, Camera, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { 
    user, 
    profile, 
    loading, 
    isAdmin, 
    isManager, 
    isFranchiseOwner, 
    isStylist, 
    isCustomer 
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth session is missing and loading is finished
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-naturals-purple" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-naturals-purple">Welcome back</p>
          <h1 className="text-3xl font-black text-deep-grape italic tracking-tight">
            {!profile ? "Initializing Experience..." : 
             isCustomer ? "Customer Dashboard" : 
             isStylist ? "Stylist Dashboard" : 
             isManager ? "Manager Dashboard" : "Dashboard"}
          </h1>
        </div>
      </div>

      {!profile && (
        <div className="p-10 text-center bg-white rounded-[2.5rem] shadow-2xl border border-black/5">
          <Loader2 className="w-8 h-8 animate-spin text-naturals-purple mx-auto mb-4" />
          <p className="text-deep-grape font-black text-xs uppercase tracking-widest">
            Syncing your beauty profile...
          </p>
        </div>
      )}

      {profile && isCustomer && <CustomerDashboard />}
      {profile && (isAdmin || isManager || isFranchiseOwner || isStylist) && <StaffDashboard />}
    </div>
  );
}

function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState<'book' | 'hair'>('book');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1.5 rounded-2xl w-fit bg-warm-grey/50 border border-black/5 shadow-inner">
        <button
          onClick={() => setActiveSection('book')}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSection === 'book' ? 'bg-white shadow-md text-deep-grape' : 'text-deep-grape/40 hover:bg-white/50'
          }`}
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
        <button
          onClick={() => setActiveSection('hair')}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSection === 'hair' ? 'bg-white shadow-md text-deep-grape' : 'text-deep-grape/40 hover:bg-white/50'
          }`}
        >
          <Camera className="w-4 h-4" /> AI Hair Try-On
        </button>
      </div>

      {activeSection === 'book' && <BookingPage />}
      {activeSection === 'hair' && <ThreeDHairTryOn />}
    </div>
  );
}
