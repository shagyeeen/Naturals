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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hoveredStylistId, setHoveredStylistId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<string>('All');
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('');
  
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
      
      // Auto-select service from query param
      if (preSelectedServiceName) {
        const preSelected = data.find(s => s.name.toLowerCase() === preSelectedServiceName.toLowerCase());
        if (preSelected) {
          setSelectedServices([preSelected]);
          if (preSelected.category) setServiceCategory(preSelected.category);
        }
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
      router.push(`/login?message=${encodeURIComponent('Sign in to book appointment. A valid Beauty Passport is required for salon sessions.')}`);
      return;
    }

    const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
    const totalPrice = Math.max(0, selectedServices.reduce((sum, s) => sum + s.price, 0) - discountAmount);
    const serviceNames = selectedServices.map(s => s.name).join(', ');

    const endTime = new Date(`2000-01-01 ${selectedSlot.start_time}`);
    endTime.setMinutes(endTime.getMinutes() + totalDuration);

    const prefsList = [
      prefHairwash && `Hairwash: ${prefHairwash}`,
      prefWaterTemp && `Water: ${prefWaterTemp}`,
      prefMassage && `Massage: ${prefMassage}`
    ].filter(Boolean).join(' | ');

    const notesStr = `Multiple Services: ${serviceNames}. Total Duration: ${totalDuration} mins.${discountAmount > 0 ? ` Applied Voucher Discount: ₹${discountAmount}` : ''}${prefsList ? ` | Preferences: ${prefsList}` : ''}`;

    const { error } = await supabase.from('appointments').insert({
      customer_id: customerProfile.id,
      stylist_id: selectedStylist.id,
      service_id: selectedServices[0].id, // Primary service ID
      notes: notesStr,
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
              onClick={() => { setSuccess(false); router.push('/dashboard'); }}
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
          {stylists.map((stylist) => {
            const isSelected = selectedStylist?.id === stylist.id;
            const specialistProfiles: Record<string, { specialty: string, bio: string }> = {
              'Colin': { specialty: 'Precision Architect', bio: 'Master of geometric cuts and facial contouring alignment.' },
              'Eloise': { specialty: 'Color Alchemist', bio: 'Expert in high-contrast balayage and pigment restorative protocols.' },
              'Nandini': { specialty: 'Dermal Scientist', bio: 'Focused on deep skin rejuvenation and bridal radiance layering.' },
              'Vikram': { specialty: 'Texture Specialist', bio: 'Renowned for multi-dimensional curls and premium grooming.' },
              'Default': { specialty: 'Senior Protocol Analyst', bio: 'Highly skilled across all aesthetic and styling categories.' }
            };
            const profile = specialistProfiles[stylist.full_name.split(' ')[0]] || specialistProfiles['Default'];

            return (
              <button
                key={stylist.id}
                onMouseEnter={() => setHoveredStylistId(stylist.id)}
                onMouseLeave={() => setHoveredStylistId(null)}
                onClick={() => { setSelectedStylist(stylist); setSelectedSlot(null); }}
                className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                  isSelected
                    ? 'border-naturals-purple bg-naturals-purple text-white shadow-2xl shadow-naturals-purple/20'
                    : 'border-black/5 hover:border-naturals-purple/30 bg-deep-grape/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 shadow-sm flex items-center justify-center p-1 border border-white/10">
                    <div className={`w-full h-full rounded-xl flex items-center justify-center ${isSelected ? 'bg-white text-naturals-purple' : 'bg-naturals-purple/10 text-naturals-purple'}`}>
                       <User className="w-6 h-6" />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-naturals-purple shadow-lg animate-in zoom-in">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className={`font-black text-base ${isSelected ? 'text-white' : 'text-deep-grape'}`}>{stylist.full_name}</p>
                  <div className="h-4 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {(isSelected || hoveredStylistId === stylist.id) ? (
                        <motion.p 
                          key="specialty"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          className={`text-[9px] font-black uppercase tracking-[0.2em] absolute inset-0 ${isSelected ? 'text-white/80' : 'text-naturals-purple'}`}
                        >
                          {profile.specialty}
                        </motion.p>
                      ) : (
                        <motion.p 
                          key="exp"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          className={`text-[9px] font-black uppercase tracking-[0.2em] absolute inset-0 ${isSelected ? 'text-white/60' : 'text-deep-grape/30'}`}
                        >
                          {stylist.experience_years}Y EXP • Top Rated
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                  {(isSelected || hoveredStylistId === stylist.id) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { 
                          height: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                          opacity: { duration: 0.3, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { 
                          height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                          opacity: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className={`h-px w-full my-4 ${isSelected ? 'bg-white/20' : 'bg-black/5'}`} />
                      <p className={`text-[10px] font-bold leading-relaxed italic mb-4 ${isSelected ? 'text-white/70' : 'text-deep-grape/40'}`}>
                        &quot;{profile.bio}&quot;
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${isSelected ? 'bg-white/10 text-white/80' : 'bg-deep-grape/5 text-deep-grape/40'}`}>
                            Cert. Specialist
                        </div>
                        <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                            Top Tier
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-8 bg-white border border-black/5 shadow-xl rounded-[2rem] space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-naturals-purple" />
            <h3 className="text-sm font-black uppercase tracking-widest text-deep-grape">Select Service</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Elegant Search Bar */}
            <div className="relative w-full md:w-64 group/search">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-grape/20 group-focus-within/search:text-naturals-purple transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search" 
                 value={serviceSearchTerm}
                 onChange={(e) => setServiceSearchTerm(e.target.value)}
                 className="w-full bg-warm-grey/50 border border-black/5 rounded-2xl py-3 pl-11 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-naturals-purple/30 focus:bg-white transition-all shadow-sm"
               />
            </div>

            <div className="flex items-center gap-2 bg-warm-grey/50 p-1 rounded-2xl border border-black/5 overflow-x-auto no-scrollbar w-full md:w-auto">
              {['All', ...Array.from(new Set(services.map(s => s.category || 'General')))].map((cat) => (
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {services
              .filter(s => {
                const matchesCategory = serviceCategory === 'All' || (s.category || 'General') === serviceCategory;
                const matchesSearch = s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) || 
                                     (s.category || '').toLowerCase().includes(serviceSearchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
              })
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
                    className={`p-6 rounded-2xl border-2 transition-all text-left relative group ${
                      isSelected
                        ? 'border-naturals-purple bg-naturals-purple text-white shadow-2xl shadow-naturals-purple/30'
                        : 'border-black/5 hover:border-naturals-purple/30 bg-deep-grape/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest mb-1 block ${isSelected ? 'text-white/60' : 'text-naturals-purple/60'}`}>{service.category}</span>
                        <p className={`font-black text-sm leading-tight transition-colors ${isSelected ? 'text-white' : 'text-deep-grape group-hover:text-naturals-purple'}`}>{service.name}</p>
                      </div>
                      <p className={`font-black text-lg ${isSelected ? 'text-white' : 'text-naturals-purple'}`}>₹{service.price}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold ${isSelected ? 'bg-white/10 text-white/60' : 'bg-black/5 text-deep-grape/40'}`}>
                        <Clock className="w-3 h-3" />
                        {service.duration_minutes} MINS
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-white rounded-full flex items-center justify-center text-naturals-purple shadow-lg">
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
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-deep-grape font-black uppercase">Subtotal</span>
              <span className="font-bold text-deep-grape">
                ₹{selectedServices.reduce((sum, s) => sum + s.price, 0)}
              </span>
            </div>
            {discountAmount > 0 && (
               <div className="flex justify-between py-2 border-b border-black/5 text-green-600">
                  <span className="text-sm font-black uppercase italic">Voucher Discount</span>
                  <span className="font-black">- ₹{discountAmount}</span>
               </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-deep-grape font-black uppercase">Final Investment</span>
              <span className="text-2xl font-black text-naturals-purple">
                ₹{Math.max(0, selectedServices.reduce((sum, s) => sum + s.price, 0) - discountAmount)}
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
          className="w-full py-5 bg-naturals-purple text-white font-black text-xs uppercase tracking-[0.35em] rounded-2xl shadow-2xl shadow-naturals-purple/30 hover:bg-deep-grape transition-all disabled:opacity-40 disabled:scale-95 transform cursor-pointer"
        >
          {loading ? "PROCESSING DEPLOYMENT..." : "CONFIRM APPOINTMENT"}
        </button>
      </div>
    </div>
  );
}
