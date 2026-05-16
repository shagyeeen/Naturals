"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Video, 
  ArrowRight, 
  Flame, 
  Star,
  ChevronRight,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
  Edit2
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

const SPECIAL_SERVICES = [
  {
    id: '45f02079-0f21-464d-9877-9a7fe5182654',
    name: 'Bridal Makeup (Women)',
    description: 'Elite consultation and full trial session for your special day.',
    price: '₹20,000',
    image: '/Services/45f02079-0f21-464d-9877-9a7fe5182654.png?v=1'
  },
  {
    id: '74a587dd-0a3b-4533-bdf5-12e10a9cecc2',
    name: 'Bridal Makeup (Men)',
    description: 'Signature groom grooming and facial architecture mapping.',
    price: '₹15,000',
    image: '/Services/74a587dd-0a3b-4533-bdf5-12e10a9cecc2.png?v=1'
  },
  {
    id: '633893e2-23f6-4f0c-98b7-565a4edc8a14',
    name: 'Bridal Combo (Bride & Groom)',
    description: 'The ultimate couple package for synchronized aesthetic perfection.',
    price: '₹30,000',
    image: '/Services/633893e2-23f6-4f0c-98b7-565a4edc8a14.png?v=1'
  },
  {
    id: 'ef7a8f50-0aa8-4b91-a33c-5ab600fbfc42',
    name: 'Hairdo (Women)',
    description: 'Intricate architectural hairstyling for high-profile events.',
    price: '₹15,000',
    image: '/Services/ef7a8f50-0aa8-4b91-a33c-5ab600fbfc42.png?v=1'
  },
  {
    id: '241aa8d1-5e47-4d9f-80b9-3de762eb776a',
    name: 'Hairdo (Men)',
    description: 'Precision sculpture and high-fashion grooming for grooms.',
    price: '₹10,000',
    image: '/Services/241aa8d1-5e47-4d9f-80b9-3de762eb776a.png?v=1'
  },
  {
    id: 'b90a8431-d32c-47d2-b0ee-6ee97112eeae',
    name: 'Hairdo Combo (Bride & Groom)',
    description: 'Coordinated event hairstyling for the perfect visual harmony.',
    price: '₹20,000',
    image: '/Services/b90a8431-d32c-47d2-b0ee-6ee97112eeae.png?v=1'
  }
];

export default function MeetingPage() {
  const { customerProfile, user } = useAuth();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Editable contact info
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePhone, setEditablePhone] = useState("");

  useEffect(() => {
    if (selectedService && (customerProfile || user)) {
      setEditableEmail(customerProfile?.email || user?.email || "");
      setEditablePhone(customerProfile?.phone || "");
    }
  }, [selectedService, customerProfile, user]);

  const handleRequestMeeting = async () => {
    if (!selectedService || !customerProfile) return;
    if (!editableEmail || !editablePhone) {
      alert("Please provide both email and phone number for the consultation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('consultation_requests').insert({
        customer_id: customerProfile.id,
        service_name: selectedService.name,
        customer_name: customerProfile.full_name,
        email: editableEmail,
        phone: editablePhone,
        status: 'pending'
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedService(null);
      }, 3000);
    } catch (err) {
      console.error('Error requesting meeting:', err);
      alert('Failed to request meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Header Section */}
      <div className="relative rounded-[3rem] overflow-hidden p-12 bg-deep-grape text-white shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-naturals-purple/40 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-lavender/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/10">
            <Sparkles className="w-3 h-3 text-lavender" /> Premium Consultations
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter mb-6 leading-[0.9]">
            Specialized Service <br />
            <span className="text-naturals-purple">Meeting Scheduler</span>
          </h1>
          <p className="text-white/60 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed mb-8">
            Our most exclusive services require a personalized consultation. Schedule a 1-on-1 meeting with our expert designers to map your unique transformation.
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <Video className="w-5 h-5 text-naturals-purple" />
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Mode</p>
                  <p className="text-[10px] font-black uppercase text-white">Video Call Available</p>
                </div>
             </div>
             <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-naturals-purple" />
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Location</p>
                  <p className="text-[10px] font-black uppercase text-white">In-Salon Studio</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SPECIAL_SERVICES.map((service, index) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            <div className="h-64 relative overflow-hidden">
               <img 
                 src={service.image} 
                 alt={service.name}
                 className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-deep-grape/80 to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="text-right ml-auto">
                     <p className="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Starting From</p>
                     <p className="text-xl font-black text-white leading-none">{service.price}</p>
                  </div>
               </div>
            </div>
            
            <div className="p-10 flex-1 flex flex-col">
               <div className="flex-1">
                 <h3 className="text-xl font-black text-deep-grape italic uppercase tracking-tighter mb-4 group-hover:text-naturals-purple transition-colors">{service.name}</h3>
                 <p className="text-xs font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed">
                   {service.description}
                 </p>
               </div>
               
               <button 
                onClick={() => setSelectedService(service)}
                className="mt-10 w-full py-5 bg-warm-grey rounded-2xl flex items-center justify-center gap-3 group/btn overflow-hidden relative transition-all hover:bg-deep-grape hover:text-white group/btn"
               >
                  <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Request Meeting</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-naturals-purple transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => !isSubmitting && setSelectedService(null)}
               className="fixed inset-0 bg-deep-grape/80 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_32px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-black/5 my-auto"
             >
                {success ? (
                  <div className="p-12 text-center space-y-6">
                     <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <h3 className="text-3xl font-black text-deep-grape italic uppercase tracking-tighter">Request Sent!</h3>
                     <p className="text-xs font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed">
                        Our team will contact you shortly to confirm your consultation slot.
                     </p>
                  </div>
                ) : (
                  <>
                    <div className="p-8 border-b border-black/5 flex justify-between items-center bg-warm-grey/30">
                       <h3 className="text-sm font-black text-deep-grape uppercase tracking-widest italic">Confirm Request</h3>
                       <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-black/5 rounded-full transition-all">
                          <X className="w-5 h-5 text-deep-grape/40" />
                       </button>
                    </div>
                    
                    <div className="p-10 space-y-8">
                       <div className="flex gap-6">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-black/5 relative">
                             <Image 
                               src={selectedService.image} 
                               alt={selectedService.name} 
                               fill
                               sizes="96px"
                               className="object-cover" 
                             />
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-deep-grape italic uppercase tracking-tighter leading-tight mb-2">{selectedService.name}</h4>
                             <p className="text-[10px] font-black text-naturals-purple uppercase tracking-widest">{selectedService.price} Base Rate</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.2em]">Contact Details</p>
                             <div className="flex items-center gap-1.5 text-[8px] font-black text-naturals-purple uppercase tracking-widest bg-naturals-purple/5 px-2 py-1 rounded-lg border border-naturals-purple/10">
                                <Edit2 className="w-2.5 h-2.5" /> Edit Info
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                             <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5 z-10 transition-all group-focus-within/input:border-naturals-purple/30 group-focus-within/input:shadow-lg group-focus-within/input:shadow-naturals-purple/10">
                                   <Mail className="w-4 h-4 text-naturals-purple" />
                                </div>
                                <div className="absolute left-16 top-3 text-[8px] font-black text-deep-grape/30 uppercase tracking-widest leading-none z-10">Email Address</div>
                                <input 
                                   type="email"
                                   value={editableEmail}
                                   onChange={(e) => setEditableEmail(e.target.value)}
                                   className="w-full bg-warm-grey/50 border border-black/5 rounded-2xl pt-7 pb-3 pl-16 pr-6 text-[11px] font-black text-deep-grape italic focus:bg-white focus:border-naturals-purple focus:ring-4 focus:ring-naturals-purple/5 outline-none transition-all placeholder:text-deep-grape/20"
                                   placeholder="customer@example.com"
                                />
                             </div>

                             <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5 z-10 transition-all group-focus-within/input:border-naturals-purple/30 group-focus-within/input:shadow-lg group-focus-within/input:shadow-naturals-purple/10">
                                   <Phone className="w-4 h-4 text-naturals-purple" />
                                </div>
                                <div className="absolute left-16 top-3 text-[8px] font-black text-deep-grape/30 uppercase tracking-widest leading-none z-10">Contact Number</div>
                                <input 
                                   type="tel"
                                   value={editablePhone}
                                   onChange={(e) => setEditablePhone(e.target.value)}
                                   className="w-full bg-warm-grey/50 border border-black/5 rounded-2xl pt-7 pb-3 pl-16 pr-6 text-[11px] font-black text-deep-grape italic focus:bg-white focus:border-naturals-purple focus:ring-4 focus:ring-naturals-purple/5 outline-none transition-all placeholder:text-deep-grape/20"
                                   placeholder="+91 XXXXX XXXXX"
                                />
                             </div>
                          </div>
                       </div>

                       <button 
                        onClick={handleRequestMeeting}
                        disabled={isSubmitting}
                        className="w-full py-6 bg-naturals-purple text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-deep-grape transition-all shadow-xl shadow-naturals-purple/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                       >
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Confirm Meeting Request <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                       </button>

                       <p className="text-center text-[9px] font-black text-deep-grape/30 uppercase tracking-widest italic">
                         Your data is synced with Beauty Passport protocols
                       </p>
                    </div>
                  </>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-warm-grey/30 rounded-[3rem] p-12 border border-black/5">
           <div className="w-12 h-12 rounded-2xl bg-white text-naturals-purple flex items-center justify-center shadow-lg mb-8">
              <Users className="w-6 h-6" />
           </div>
           <h2 className="text-3xl font-black italic text-deep-grape mb-6 tracking-tight">The Personal Touch</h2>
           <p className="text-sm font-bold text-deep-grape/40 uppercase tracking-widest leading-relaxed mb-8">
             Meeting scheduling ensures that our elite team of stylists is fully prepared for your consultation. We review your Beauty Passport AI data before every call to provide the most precise recommendations.
           </p>
           <ul className="space-y-4">
              {[
                'Personalized Portfolio Mapping',
                'Virtual Feature Simulation',
                'Product Protocol Customization',
                'Team Synchronized Briefing'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-naturals-purple rounded-full" />
                   <span className="text-[10px] font-black text-deep-grape uppercase tracking-widest">{item}</span>
                </li>
              ))}
           </ul>
        </div>

        <div className="bg-gradient-to-br from-naturals-purple/10 to-lavender/20 rounded-[3rem] p-12 border border-naturals-purple/10 relative overflow-hidden group">
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                  <Star className="w-3 h-3" /> Expert Quality
                </div>
                <h2 className="text-3xl font-black italic text-deep-grape mb-6 tracking-tight">Ready for <br /> Perfection?</h2>
                <p className="text-sm font-bold text-deep-grape/60 uppercase tracking-widest leading-relaxed">
                  Once your meeting request is approved, you will receive a video link and calendar invite via your registered contact number and email.
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                 <div className="flex -space-x-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-12 h-12 rounded-xl border-4 border-white bg-warm-grey overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-deep-grape uppercase tracking-widest leading-none mb-1">50+ Experts</p>
                    <p className="text-[8px] font-black text-deep-grape/40 uppercase tracking-widest">Available for Consult</p>
                 </div>
              </div>
           </div>
           <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
