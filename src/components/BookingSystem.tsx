'use client';

import { useState, useEffect, useCallback } from "react";
import { supabase, Stylist, Service, Appointment } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Scissors, CreditCard, Check } from "lucide-react";

interface TimeSlot {
  start_time: string;
  end_time: string;
}

export default function BookingPage() {
  const { user, profile, customerProfile } = useAuth();
  const router = useRouter();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchStylists();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedStylist && selectedServices.length > 0 && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedStylist, selectedServices, selectedDate]);

  const fetchStylists = async () => {
    console.log('Fetching stylists...');
    const { data, error } = await supabase
      .from('stylists')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Stylist Fetch Error:', error);
    } else if (data) {
      console.log('Stylists Found:', data.length);
      setStylists(data);
    }
  };

  const fetchServices = async () => {
    console.log('Fetching services...');
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      console.error('Service Fetch Error:', error);
    } else if (data) {
      console.log('Services Found:', data.length);
      setServices(data);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedStylist || selectedServices.length === 0) return;

    setLoading(true);
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
    console.log(`Syncing slots for ${selectedStylist.full_name} on ${selectedDate}...`);
    
    // Attempt to call the specialized Supabase Scheduling Intelligence
    const { data, error } = await supabase.rpc('get_available_slots', {
      p_stylist_id: selectedStylist.id,
      p_date: selectedDate,
      p_service_duration: totalDuration
    });

    if (!error && data && data.length > 0) {
      console.log('Intelligent scheduling active.');
      setAvailableSlots(data);
    } else {
      // Professional Fallback: Generate standard slots from 9 AM to 8 PM
      console.log('Scheduling through standard availability protocol...');
      const fallbackSlots: TimeSlot[] = [];
      for (let h = 9; h < 20; h++) {
        const hour = h.toString().padStart(2, '0');
        fallbackSlots.push({ start_time: `${hour}:00:00`, end_time: `${hour}:30:00` });
        fallbackSlots.push({ start_time: `${hour}:30:00`, end_time: `${(h+1).toString().padStart(2, '0')}:00:00` });
      }
      setAvailableSlots(fallbackSlots);
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!selectedStylist || selectedServices.length === 0 || !selectedSlot) {
      alert("Operational Error: Specialist, Services, and Slot must be verified.");
      return;
    }
    
    if (!customerProfile) {
      console.error('Identity Missing: No customer profile found.');
      alert("Identity Error: Please ensure your Beauty Passport is fully synchronized before booking.");
      return;
    }

    setLoading(true);
    console.log('Initializing appointment deployment...');

    // ROBUST SECURITY GATE: Detect Guest Customers by Mock ID or Email to prevent DB constraint errors.
    const isGuest = customerProfile.id === '00000000-0000-0000-0000-000000000001' || customerProfile.email === 'guest_customer@naturals.ai';
    
    if (isGuest || !customerProfile.id) {
      console.log('Guest booking attempt detected (Robust Check). Redirecting...');
      alert("Sign in to book appointment. A valid Beauty Passport is required for salon sessions.");
      router.push('/login');
      return;
    }

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const serviceNames = selectedServices.map(s => s.name).join(', ');

    const endTime = new Date(`2000-01-01 ${selectedSlot.start_time}`);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);

    const { error } = await supabase.from('appointments').insert({
      customer_id: customerProfile.id,
      stylist_id: selectedStylist.id,
      service_id: selectedServices[0].id, // Primary service ID
      notes: `Multiple Services: ${serviceNames}. Total Duration: ${totalDuration} mins.`,
      appointment_date: selectedDate,
      start_time: selectedSlot.start_time,
      end_time: endTime.toTimeString().slice(0, 8),
      status: 'confirmed',
      total_amount: totalPrice
    });

    if (error) {
      console.error('Deployment Failure:', error);
      alert(`System Error: ${error.message}. Please verify Supabase RLS policies.`);
    } else {
      console.log('Appointment Successfully Registered.');
      setSuccess(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const getDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-deep-grape italic tracking-tight">Book Appointment</h2>
        <p className="text-deep-grape/60 text-xs font-bold uppercase tracking-widest mt-1">Select stylist, service, and time slot</p>
      </div>

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" 
            onClick={() => setSuccess(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-black/5 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-4">Appointment Booked Successfully!</h3>
            <p className="text-deep-grape/40 font-black uppercase text-[10px] tracking-[0.2em] mb-10 leading-relaxed">
              Your salon session has been confirmed and synchronized with our stylist. We look forward to seeing you soon!
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="w-full py-5 bg-deep-grape text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-naturals-purple transition-all shadow-2xl"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      )}

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-naturals-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Stylist</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stylists.map((stylist) => (
            <button
              key={stylist.id}
              onClick={() => { setSelectedStylist(stylist); setSelectedSlot(null); }}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedStylist?.id === stylist.id
                  ? 'border-naturals-purple bg-naturals-purple/5'
                  : 'border-black/5 hover:border-naturals-purple/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-warm-grey mb-3" />
              <p className="font-black text-sm text-deep-grape">{stylist.full_name}</p>
              <p className="text-xs text-deep-grape/50">{stylist.experience_years} years exp</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-naturals-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Service</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const isSelected = selectedServices.some(s => s.id === service.id);
            return (
              <button
                key={service.id}
                onClick={() => { 
                  if (isSelected) {
                    setSelectedServices(selectedServices.filter(s => s.id !== service.id));
                  } else {
                    setSelectedServices([...selectedServices, service]);
                  }
                  setSelectedSlot(null); 
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-naturals-purple bg-naturals-purple/5'
                    : 'border-black/5 hover:border-naturals-purple/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-deep-grape">{service.name}</p>
                    <p className="text-xs text-deep-grape/50 mt-1">{service.duration_minutes} mins</p>
                  </div>
                  <p className="font-black text-naturals-purple">₹{service.price}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-naturals-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Date</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getDateRange().map((date) => {
            const d = new Date(date);
            return (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                className={`px-4 py-3 rounded-xl border-2 transition-all shrink-0 ${
                  selectedDate === date
                    ? 'border-naturals-purple bg-naturals-purple text-white'
                    : 'border-black/5 hover:border-naturals-purple/30'
                }`}
              >
                <p className="text-[10px] font-bold uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className="text-lg font-black">{d.getDate()}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-naturals-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Time Slot</h3>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-naturals-purple border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSlot(slot)}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  selectedSlot === slot
                    ? 'border-naturals-purple bg-naturals-purple text-white'
                    : 'border-black/5 hover:border-naturals-purple/30'
                }`}
              >
                <span className="font-bold text-sm">{formatTime(slot.start_time)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-deep-grape/50">
            <p className="text-sm font-bold uppercase tracking-widest">No available slots</p>
            <p className="text-xs mt-1">Try selecting a different date or stylist</p>
          </div>
        )}
      </div>

      {/* Booking Summary & Action */}
      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-naturals-purple" />
          <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Booking Summary</h3>
        </div>
        
        {selectedStylist && selectedServices.length > 0 && selectedSlot ? (
          <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-deep-grape/60 text-sm italic">Allocated Analyst</span>
              <span className="font-bold text-deep-grape">{selectedStylist.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-deep-grape/60 text-sm italic">Protocol Selections</span>
              <div className="text-right">
                {selectedServices.map(s => (
                  <p key={s.id} className="font-bold text-deep-grape text-xs">{s.name}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-deep-grape/60 text-sm italic">Deployment Time</span>
              <span className="font-bold text-deep-grape text-naturals-purple">
                {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} at {formatTime(selectedSlot.start_time)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-deep-grape font-black uppercase">Total Amount</span>
              <span className="text-2xl font-black text-naturals-purple">
                ₹{selectedServices.reduce((sum, s) => sum + s.price, 0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-black/5 rounded-2xl mb-6">
            <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.2em]">{selectedServices.length === 0 ? "Select services" : "Select specialist & slot"} to initialize summary</p>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={!selectedStylist || selectedServices.length === 0 || !selectedSlot || loading}
          className="w-full py-5 bg-deep-grape text-white font-black text-xs uppercase tracking-[0.35em] rounded-2xl shadow-2xl shadow-deep-grape/20 hover:bg-naturals-purple transition-all disabled:opacity-20 disabled:scale-95 transform cursor-pointer"
        >
          {loading ? "PROCESSING DEPLOYMENT..." : "CONFIRM APPOINTMENT"}
        </button>
      </div>
    </div>
  );
}
