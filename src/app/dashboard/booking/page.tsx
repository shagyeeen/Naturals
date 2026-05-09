"use client";

import BookingPage from "@/components/BookingSystem";
import { useAuth } from "@/lib/auth";
import { Loader2, Calendar } from "lucide-react";

export default function BookingRoute() {
  const { customerProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-naturals-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
          <Calendar className="w-3 h-3" />
          Salon Reservation
        </div>
        <h1 className="text-3xl font-black text-deep-grape italic tracking-tight">Book Appointment</h1>
        <p className="text-deep-grape/40 text-[10px] uppercase font-black tracking-widest mt-1">Select your service and stylist</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/5 p-8">
        <BookingPage />
      </div>
    </div>
  );
}
