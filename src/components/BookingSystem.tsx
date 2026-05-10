'use client';

import { useState, useEffect, useCallback } from "react";
import { supabase, Stylist, Service, Appointment } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Scissors, CreditCard, Check, Search, Sparkles } from "lucide-react";

import { useSearchParams } from "next/navigation";

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
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Service Preferences State
  const [prefHairwash, setPrefHairwash] = useState<string>('');
  const [prefWaterTemp, setPrefWaterTemp] = useState<string>('');
  const [prefMassage, setPrefMassage] = useState<string>('');
  
  const searchParams = useSearchParams();
  const preSelectedServiceName = searchParams.get('service');
  const discountAmount = parseInt(searchParams.get('discount') || '0');

  useEffect(() => {
    fetchStylists();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedStylist && selectedServices.length > 0 && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedStylist, selectedServices, selectedDate]);

  useEffect(() => {
    const handleBranchChange = () => {
      fetchStylists();
      setSelectedStylist(null);
      setSelectedSlot(null);
    };
    window.addEventListener('branchChanged', handleBranchChange);
    return () => window.removeEventListener('branchChanged', handleBranchChange);
  }, []);

  const fetchStylists = async () => {
    console.log('Fetching stylists...');
    const savedBranch = localStorage.getItem('selectedBranch')?.replace(' Branch', '').trim();
    
    let query = supabase
      .from('stylists')
      .select('*')
      .eq('is_active', true);
    
    if (savedBranch) {
      console.log('Filtering by branch:', savedBranch);
      query = query.ilike('branch_location', `%${savedBranch}%`);
    }

    const { data, error } = await query;
    
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
      if (data.length > 0 && serviceCategory === 'All') {
        const firstCat = data[0].category || 'General';
        setServiceCategory(firstCat);
      }
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

    if (!error && data) {
      if (data.length > 0) {
        console.log('Intelligent scheduling active.');
        setAvailableSlots(data);
      } else {
        console.log('No slots available for the selected duration/specialist.');
        setAvailableSlots([]);
      }
    } else {
      if (error) console.error('Scheduling Intelligence Error:', error);
      // Professional Fallback: Generate standard slots from 10 AM to 7 PM
      console.log('Scheduling through standard availability protocol...');
      const fallbackSlots: TimeSlot[] = [];
      for (let h = 10; h < 19; h++) {
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
      router.push(`/login?message=${encodeURIComponent('Sign in to book appointment. A valid Beauty Passport is required for salon sessions.')}`);
      return;
    }

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const serviceNames = selectedServices.map(s => s.name).join(', ');

    const endTime = new Date(`2000-01-01 ${selectedSlot.start_time}`);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);

    const prefsList = [
      prefHairwash && `Hairwash: ${prefHairwash}`,
      prefWaterTemp && `Water: ${prefWaterTemp}`,
      prefMassage && `Massage: ${prefMassage}`
    ].filter(Boolean).join(' | ');

    const notesStr = `Multiple Services: ${serviceNames}. Total Duration: ${totalDuration} mins.${discountAmount > 0 ? ` Applied Voucher Discount: ₹${discountAmount}` : ''}${prefsList ? ` | Preferences: ${prefsList}` : ''}`;

    const { data: appointmentData, error: appointmentError } = await supabase.from('appointments').insert({
      customer_id: customerProfile.id,
      stylist_id: selectedStylist.id,
      service_id: selectedServices[0].id, // Primary service ID
      notes: notesStr,
      appointment_date: selectedDate,
      start_time: selectedSlot.start_time,
      end_time: endTime.toTimeString().slice(0, 8),
      status: 'confirmed',
      total_amount: totalPrice
    }).select().single();

    if (appointmentError) {
      console.error('Deployment Failure:', appointmentError);
      alert(`System Error: ${appointmentError.message}. Please verify Supabase RLS policies.`);
    } else if (appointmentData) {
      console.log('Main Appointment Registry Confirmed. Synchronizing individual service nodes...');
      
      const serviceInserts = selectedServices.map(s => ({
        appointment_id: appointmentData.id,
        service_id: s.id
      }));

      const { error: servicesError } = await supabase.from('appointment_services').insert(serviceInserts);
      
      if (servicesError) {
        console.error('Service Sync Failure:', servicesError);
      }

      console.log('Appointment Successfully Registered with Multiple Services.');
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
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
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
              className={`p-5 rounded-[2rem] transition-all text-left relative overflow-hidden group ${
                selectedStylist?.id === stylist.id
                  ? 'bg-naturals-purple/5 ring-2 ring-naturals-purple shadow-xl shadow-naturals-purple/10 scale-[1.02] z-10'
                  : 'bg-black/[0.04] border border-black/[0.05] hover:bg-naturals-purple/10 hover:border-naturals-purple/30 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                  selectedStylist?.id === stylist.id ? 'bg-naturals-purple/5 border border-naturals-purple/10' : 'bg-white border border-black/[0.05]'
                }`}>
                  <User className={`w-6 h-6 transition-colors ${selectedStylist?.id === stylist.id ? 'text-naturals-purple' : 'text-deep-grape/10'}`} />
                </div>
                {selectedStylist?.id === stylist.id && (
                  <div className="w-6 h-6 rounded-full bg-naturals-purple flex items-center justify-center shadow-lg shadow-naturals-purple/20">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              
              <h4 className="font-black text-sm text-deep-grape mb-1">{stylist.full_name}</h4>
              <p className="text-[8px] font-black uppercase tracking-widest text-naturals-purple mb-3">{stylist.specialty || 'Master Stylist'}</p>
              
              <div className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border transition-colors w-fit ${
                selectedStylist?.id === stylist.id ? 'bg-naturals-purple/5 border-naturals-purple/10' : 'bg-white border-black/[0.03]'
              }`}>
                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span className="text-[9px] font-black text-deep-grape/40 uppercase tracking-tighter">{stylist.experience_years} YRS EXP</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-naturals-purple" />
            <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Service</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-warm-grey/50 p-1 rounded-2xl border border-black/5 overflow-x-auto no-scrollbar w-full md:w-auto">
              {Array.from(new Set(services.map(s => s.category || 'General'))).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setServiceCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    serviceCategory === cat 
                      ? 'bg-naturals-purple text-white shadow-lg' 
                      : 'text-deep-grape/40 hover:text-deep-grape'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64 group">
              <input 
                type="text"
                placeholder="SEARCH SERVICE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-warm-grey/40 border border-black/5 rounded-2xl py-2 px-10 text-[9px] font-black uppercase tracking-widest focus:bg-white focus:border-naturals-purple transition-all outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-deep-grape/20 group-focus-within:text-naturals-purple transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {services
              .filter(s => serviceCategory === 'All' || (s.category || 'General') === serviceCategory)
              .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((service) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={service.id}
                    onClick={() => { 
                      if (isSelected) {
                        setSelectedServices(selectedServices.filter(s => s.id !== service.id));
                      } else {
                        setSelectedServices([...selectedServices, service]);
                      }
                      setSelectedSlot(null); 
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all text-left relative group aspect-[4/3] flex flex-col justify-between ${
                      isSelected
                        ? 'border-naturals-purple bg-naturals-purple/5 shadow-lg shadow-naturals-purple/5'
                        : 'border-black/5 hover:border-naturals-purple/30 bg-[#fafafa]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-naturals-purple/60 mb-1 block">{service.category}</span>
                        <p className="font-black text-deep-grape text-sm leading-tight group-hover:text-naturals-purple transition-colors">{service.name}</p>
                      </div>
                      <p className="font-black text-naturals-purple text-lg">₹{service.price}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/5 text-[9px] font-bold text-deep-grape/40">
                        <Clock className="w-3 h-3" />
                        {service.duration_minutes} MINS
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-naturals-purple rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
          </AnimatePresence>
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
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-12 bg-warm-grey/20 rounded-[2rem] border border-black/5">
            <Clock className="w-8 h-8 text-deep-grape/20 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-deep-grape/40 italic">
              Specialist Fully Booked or Duration Too Long for Available Windows
            </p>
            <p className="text-[10px] text-deep-grape/20 mt-2">Try another date or specialist for this protocol.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {(() => {
              const allSlots = [];
              for (let h = 10; h < 19; h++) {
                const hour = h.toString().padStart(2, '0');
                allSlots.push(`${hour}:00:00`);
                allSlots.push(`${hour}:30:00`);
              }
              allSlots.push(`19:00:00`); // Include 7:00 PM as the final slot
              
              return allSlots.map((time, idx) => {
                const isAvailable = availableSlots.some(s => s.start_time === time);
                const isSelected = selectedSlot?.start_time === time;
                
                return (
                  <button
                    key={idx}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSlot({ start_time: time, end_time: '' })}
                    className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      isSelected
                        ? 'border-naturals-purple bg-naturals-purple text-white shadow-lg shadow-naturals-purple/20 scale-105 z-10'
                        : isAvailable
                          ? 'border-black/5 bg-white text-deep-grape hover:border-naturals-purple/30 hover:scale-105'
                          : 'border-black/5 bg-warm-grey/30 text-deep-grape/10 cursor-not-allowed opacity-50 grayscale'
                    }`}
                  >
                    {formatTime(time)}
                  </button>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Service Preferences */}
      {selectedServices.length > 0 && (() => {
        const isHairService = selectedServices.some(s => s.name.toLowerCase().includes('hair') || s.category?.toLowerCase().includes('hair') || s.name.toLowerCase().includes('cut'));
        const isSpaOrFacial = selectedServices.some(s => s.name.toLowerCase().includes('spa') || s.name.toLowerCase().includes('facial') || s.name.toLowerCase().includes('massage'));
        
        if (!isHairService && !isSpaOrFacial) return null;

        return (
          <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-naturals-purple" />
              <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Service Preferences</h3>
            </div>
            
            <div className="space-y-6">
              {isHairService && (
                <>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape mb-3">Prefer Hairwash</p>
                    <div className="flex flex-wrap gap-3">
                      {['Before Service', 'After Service', 'Both'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setPrefHairwash(opt)}
                          className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                            prefHairwash === opt
                              ? 'border-[#8E3E96] bg-[#8E3E96] text-white shadow-lg'
                              : 'border-black/5 bg-white text-deep-grape hover:border-[#8E3E96]/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape mb-3">Water Temperature</p>
                    <div className="flex flex-wrap gap-3">
                      {['Cold', 'Lukewarm', 'Warm'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setPrefWaterTemp(opt)}
                          className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                            prefWaterTemp === opt
                              ? 'border-[#8E3E96] bg-[#8E3E96] text-white shadow-lg'
                              : 'border-black/5 bg-white text-deep-grape hover:border-[#8E3E96]/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {(isSpaOrFacial || isHairService) && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape mb-3">Massage Intensity</p>
                  <div className="flex flex-wrap gap-3">
                    {['Soft', 'Medium', 'Strong', 'None'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setPrefMassage(opt)}
                        className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                          prefMassage === opt
                            ? 'border-[#8E3E96] bg-[#8E3E96] text-white shadow-lg'
                            : 'border-black/5 bg-white text-deep-grape hover:border-[#8E3E96]/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
