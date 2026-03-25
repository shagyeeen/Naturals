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
    isCustomer,
    customerProfile,
    signOut
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
      {(isAdmin || isManager || isFranchiseOwner || isStylist || customerProfile || profile) && (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-naturals-purple">Welcome back</p>
            <h1 className="text-3xl font-black text-deep-grape italic tracking-tight">
              {isAdmin ? "Command Dashboard" :
               isCustomer ? "Customer Dashboard" : 
               isStylist ? "Stylist Dashboard" : 
               isManager ? "Management Center" : "Dashboard"}
            </h1>
          </div>
        </div>
      )}



      {isAdmin || isManager || isFranchiseOwner || isStylist ? (
        <StaffDashboard />
      ) : (
        customerProfile && <CustomerDashboard />
      )}
    </div>
  );
}

function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1.5 rounded-2xl w-fit bg-warm-grey/50 border border-black/5 shadow-inner">
        <div className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-white shadow-md text-deep-grape flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Book Appointment
        </div>
      </div>

      <BookingPage />
    </div>
  );
}
