"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Appointment, AppointmentStatus } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { 
  Calendar, 
  Clock, 
  User, 
  Users,
  Scissors, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Star, 
  RefreshCw, 
  ChevronRight,
  Filter,
  MapPin,
  CreditCard,
  MessageSquare,
  History as HistoryIcon,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { autoCompleteAppointments } from "@/modules/customer/booking/service";

export default function AppointmentsPage() {
  const { profile, customerProfile, isStylist, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("confirmed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("");
  const [isReassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignAppt, setReassignAppt] = useState<Appointment | null>(null);
  const [availableStylists, setAvailableStylists] = useState<any[]>([]);
  const [loadingStylists, setLoadingStylists] = useState(false);

  useEffect(() => {
    if (customerProfile?.id || profile?.id) {
      fetchAppointments();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [customerProfile, profile, authLoading]);

  const fetchAppointments = async () => {
    if (!customerProfile?.id && !profile?.id) return;
    
    try {
      setLoading(true);
      
      // Run maintenance to mark past sessions as completed
      const userIdForMaintenance = isStylist ? profile?.id : customerProfile?.id;
      if (userIdForMaintenance) {
        await autoCompleteAppointments(userIdForMaintenance);
      }

      let query = supabase
        .from('appointments')
        .select(`
          *,
          customer:customer_id(id, full_name, phone),
          stylist:stylist_id(id, full_name, phone),
          service:service_id(id, name, duration_minutes, price, category),
          appointment_services(
            service:service_id(id, name, duration_minutes, price, category)
          )
        `);

      if (isAdmin) {
        // Admins see all appointments
      } else if (isStylist && profile?.id) {
        // We need to get the stylist record ID (not the profile/user ID)
        const { data: stylistData } = await supabase
          .from('stylists')
          .select('id')
          .eq('user_id', profile.id)
          .single();
        
        if (stylistData) {
          query = query.eq('stylist_id', stylistData.id);
        } else {
          // If no stylist record found, return empty
          setAppointments([]);
          setLoading(false);
          return;
        }
      } else if (customerProfile?.id) {
        query = query.eq('customer_id', customerProfile.id);
      }

      const { data, error } = await query
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesFilter = filter === "all" ? true : appt.status === filter;
    const matchesSearch = 
      appt.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.stylist?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    try {
      setCancellingId(id);
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'skipped',
          skip_reason: skipReason || "Unspecified"
        })
        .eq('id', id);

      if (error) throw error;
      
      // Success feedback
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'skipped' as AppointmentStatus, skip_reason: skipReason } : a));
      setCancelModalId(null);
      setSkipReason("");
    } catch (error: any) {
      console.error("Error cancelling appointment:", error);
      alert(`Failed to cancel appointment: ${error.message || "Unknown error"}`);
    } finally {
      setCancellingId(null);
    }
  };

  const fetchAvailableStylists = async (appt: Appointment) => {
    try {
      setLoadingStylists(true);
      
      // 1. Fetch all active stylists
      const { data: allStylists, error: stylistsError } = await supabase
        .from('stylists')
        .select('*')
        .eq('is_active', true);

      if (stylistsError) throw stylistsError;

      // 2. Fetch all appointments for that date to check for overlaps
      const { data: dateAppts, error: apptsError } = await supabase
        .from('appointments')
        .select('stylist_id, start_time, end_time')
        .eq('appointment_date', appt.appointment_date)
        .neq('status', 'cancelled')
        .neq('status', 'skipped');

      if (apptsError) throw apptsError;

      // 3. Filter stylists who are free during the appt time
      const freeStylists = allStylists.filter(stylist => {
        const hasOverlap = dateAppts?.some(a => {
          if (a.stylist_id !== stylist.id) return false;
          
          // Overlap logic: (start1 < end2) AND (end1 > start2)
          return (appt.start_time < a.end_time) && (appt.end_time > a.start_time);
        });
        return !hasOverlap;
      });

      setAvailableStylists(freeStylists);
    } catch (error) {
      console.error("Error fetching available stylists:", error);
    } finally {
      setLoadingStylists(false);
    }
  };

  const performReassign = async (stylistId: string) => {
    if (!reassignAppt) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ 
          stylist_id: stylistId,
          status: 'confirmed' 
        })
        .eq('id', reassignAppt.id);

      if (error) throw error;
      
      setReassignModalOpen(false);
      setReassignAppt(null);
      fetchAppointments();
      alert("Appointment successfully reassigned and confirmed!");
    } catch (error: any) {
      console.error("Error performing reassignment:", error);
      alert(`Failed to reassign: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'pending' })
        .eq('id', id);

      if (error) throw error;
      
      // Success feedback
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'pending' as AppointmentStatus } : a));
      alert("Appointment reset to Pending. You can now assign a new stylist in the Admin Dashboard.");
    } catch (error: any) {
      console.error("Error reassigning appointment:", error);
      alert(`Failed to reassign: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRebook = (appt: Appointment) => {
    router.push('/dashboard');
  };

  const handleSubmitReview = async () => {
    if (!selectedAppt) return;
    
    try {
      setIsSubmittingReview(true);
      
      const response = await fetch('/api/feedbacks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedAppt.id,
          customerId: customerProfile.id,
          rating: reviewRating,
          comment: reviewText
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit feedback");
      
      setReviewModalOpen(false);
      setReviewText("");
      setReviewRating(5);
      fetchAppointments();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'completed': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'skipped': return "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse";
      case 'pending': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'cancelled': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'skipped': return <AlertCircle className="w-3 h-3 text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <HistoryIcon className="w-3 h-3" /> Visit History & Schedule
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
            {isAdmin ? "Appointments" : isStylist ? "Staff Appointments" : "My Appointments"}
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">
            {isAdmin ? "Oversee and manage all salon service sessions." : 
             isStylist ? "Manage your daily queue and upcoming service sessions." : 
             "Manage your upcoming sessions and review past beauty journeys."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAppointments}
            className="p-3 rounded-2xl bg-white border border-black/5 text-deep-grape hover:text-naturals-purple transition-all shadow-sm group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-grape/30 group-focus-within/search:text-naturals-purple transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH SERVICES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-naturals-purple/30 focus:ring-4 focus:ring-naturals-purple/5 transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-warm-grey/50 p-1.5 rounded-[1.5rem] border border-naturals-purple/5 w-fit">
        {(["confirmed", "completed", "skipped"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
              filter === tab 
                ? "bg-naturals-purple text-white shadow-xl shadow-naturals-purple/20" 
                : "text-deep-grape/40 hover:text-deep-grape"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-8 min-h-[300px] animate-pulse">
              <div className="h-4 w-24 bg-deep-grape/5 rounded-full mb-6" />
              <div className="h-8 w-48 bg-deep-grape/10 rounded-xl mb-4" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-deep-grape/5 rounded-full" />
                <div className="h-3 w-2/3 bg-deep-grape/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAppointments.map((appt, idx) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card group hover:shadow-2xl hover:border-naturals-purple/20 transition-all flex flex-col"
              >
                {/* Status Badge */}
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(appt.status)}`}>
                      {getStatusIcon(appt.status)}
                      {appt.status}
                    </span>
                  </div>

                  {appt.status === 'skipped' && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
                        Stylist Skipped the Appointment. We'll Assign you As Soon As Possible.
                      </p>
                    </div>
                  )}

                  <h3 className="text-xl font-black text-deep-grape italic mb-1 group-hover:text-naturals-purple transition-colors line-clamp-2">
                    {appt.appointment_services && appt.appointment_services.length > 0
                      ? appt.appointment_services.map(s => s.service.name).join(' + ')
                      : appt.service?.name || "Premium Service"}
                  </h3>
                  <p className="text-[10px] font-black text-deep-grape/40 uppercase tracking-[0.2em] mb-6">
                    {appt.appointment_services && appt.appointment_services.length > 0
                      ? `${appt.appointment_services[0].service.category || 'Salon'}`
                      : appt.service?.category || "Salon"} • {appt.appointment_services && appt.appointment_services.length > 0
                        ? appt.appointment_services.reduce((acc, curr) => acc + (curr.service.duration_minutes || 0), 0)
                        : appt.service?.duration_minutes || 60} Mins
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Salon Branch</p>
                        <p className="text-xs font-black text-deep-grape">Naturals {customerProfile?.preferred_branch_location || "Official Branch"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Date & Time</p>
                        <p className="text-xs font-black text-deep-grape">
                          {new Date(appt.appointment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {appt.start_time.slice(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                        {isStylist ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">{isStylist ? "Customer" : "Assigned Stylist"}</p>
                        <p className="text-xs font-black text-deep-grape">{isStylist ? (appt.customer?.full_name || "Guest Customer") : (appt.stylist?.full_name || "Any Available")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Price & Status</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-deep-grape">₹{appt.total_amount || appt.service?.price || 0}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${appt.payment_status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {appt.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback/Review Section for Completed */}
                {appt.status === 'completed' && (
                  <div className="px-8 pb-6 border-t border-black/5 pt-6 mt-auto">
                    {appt.rating ? (
                      <div className="bg-naturals-purple/5 p-4 rounded-2xl border border-naturals-purple/10 mb-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= appt.rating! ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-deep-grape/60 italic leading-relaxed">
                          "{appt.feedback || "No comment provided."}"
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { 
                          setSelectedAppt(appt); 
                          setReviewRating(5);
                          setReviewText("");
                          setReviewModalOpen(true); 
                        }}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-naturals-purple/30 text-naturals-purple text-[10px] font-black uppercase tracking-widest hover:bg-naturals-purple/5 hover:border-naturals-purple transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-3 h-3" /> Leave Feedback
                      </button>
                    )}
                  </div>
                )}

                <div className="px-8 pb-8 flex gap-3 mt-auto">
                  {appt.status === 'confirmed' && (
                    <button 
                      onClick={() => setCancelModalId(appt.id)}
                      disabled={cancellingId === appt.id}
                      className="flex-1 py-3 bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {cancellingId === appt.id ? "SKIPPING..." : "Skip"}
                    </button>
                  )}
                  {isAdmin && appt.status === 'skipped' && (
                    <button 
                      onClick={() => {
                        setReassignAppt(appt);
                        setReassignModalOpen(true);
                        fetchAvailableStylists(appt);
                      }}
                      className="flex-1 py-3 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                    >
                      Reassign
                    </button>
                  )}
                  {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                    <button 
                      onClick={() => {
                        setSelectedAppt(appt);
                        setDetailsModalOpen(true);
                      }}
                      className="flex-1 py-3 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto border border-black/5 bg-white shadow-xl">
          <div className="w-24 h-24 bg-warm-grey rounded-3xl flex items-center justify-center mb-8 shadow-inner">
            <Calendar className="w-12 h-12 text-deep-grape/10" />
          </div>
          <h3 className="text-2xl font-black text-deep-grape mb-4 italic tracking-tighter">No Appointments Found</h3>
          <p className="text-xs font-bold text-deep-grape/40 mb-10 uppercase tracking-widest leading-relaxed">
            {filter === "all" 
              ? "You haven't scheduled any sessions yet. Start your beauty journey with us today!" 
              : `You don't have any ${filter} appointments at the moment.`}
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-10 py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-2xl transition-all hover:scale-105"
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModalId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" 
              onClick={() => setCancelModalId(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-black/5 text-center"
            >
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-2">Skip Appointment?</h3>
              <p className="text-deep-grape/40 font-black uppercase text-[10px] tracking-[0.2em] mb-6">This will move your slot for reassignment.</p>
              
              <div className="space-y-3 mb-10">
                <p className="text-[8px] font-black uppercase tracking-widest text-deep-grape/30 text-left ml-2">Reason for skip</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Emergency", "Scheduling Conflict", "Personal Reasons", "Other"].map(reason => (
                    <button
                      key={reason}
                      onClick={() => setSkipReason(reason)}
                      className={`py-2 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        skipReason === reason 
                          ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20" 
                          : "bg-warm-grey/50 text-deep-grape/40 border-black/5 hover:border-rose-500/30"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setCancelModalId(null)}
                  className="flex-1 py-4 border-2 border-black/5 text-deep-grape font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-warm-grey transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => handleCancel(cancelModalId)}
                  disabled={cancellingId === cancelModalId}
                  className="flex-1 py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-rose-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {cancellingId === cancelModalId ? "SKIPPING..." : "YES, SKIP"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" 
              onClick={() => setReviewModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-black/5"
            >
              <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-2">Share Your Experience</h3>
              <p className="text-deep-grape/40 font-black uppercase text-[10px] tracking-[0.2em] mb-10">Your feedback helps us maintain our premium standards.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.25em] opacity-40">Service Quality</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-4 uppercase tracking-[0.25em] opacity-40">Your Feedback</label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="HOW WAS YOUR SESSION?..."
                    className="w-full p-6 bg-warm-grey border border-black/5 rounded-2xl text-xs font-black tracking-widest uppercase focus:outline-none focus:border-naturals-purple/30 transition-all resize-none placeholder:opacity-20"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 py-4 border-2 border-black/5 text-deep-grape font-black text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-warm-grey transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                    className="flex-[2] py-4 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-naturals-purple/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                  >
                    {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-y-auto pt-24">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" 
              onClick={() => setDetailsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 border border-black/5 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/5">
                <div>
                  <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-0.5">Session Details</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-naturals-purple/60">Service Analysis</p>
                </div>
                <button 
                  onClick={() => setDetailsModalOpen(false)} 
                  className="w-10 h-10 bg-warm-grey/50 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group shadow-sm shrink-0"
                >
                  <XCircle className="w-5 h-5 text-deep-grape/40 group-hover:text-white transition-colors" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="bg-warm-grey/30 p-6 rounded-[2rem] border border-black/5">
                  <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-[0.2em] mb-4">Included Services</p>
                  <div className="space-y-3">
                    {(selectedAppt.appointment_services && selectedAppt.appointment_services.length > 0)
                      ? selectedAppt.appointment_services.map((as, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm group/item hover:border-naturals-purple/20 transition-all">
                          <div>
                            <p className="text-xs font-black text-deep-grape italic uppercase tracking-tight">{as.service.name}</p>
                            <p className="text-[8px] font-black text-deep-grape/20 uppercase tracking-[0.2em]">{as.service.category}</p>
                          </div>
                          <p className="text-xs font-black text-naturals-purple tracking-tighter">₹{as.service.price}</p>
                        </div>
                      ))
                      : selectedAppt.service
                        ? (
                          <div className="flex justify-between items-center p-6 bg-white rounded-3xl border border-black/5 shadow-sm">
                            <div>
                              <p className="text-sm font-black text-deep-grape italic uppercase tracking-tight">{selectedAppt.service.name}</p>
                              <p className="text-[9px] font-black text-deep-grape/20 uppercase tracking-[0.2em]">{selectedAppt.service.category || 'Service'}</p>
                            </div>
                            <p className="text-sm font-black text-naturals-purple tracking-tighter">₹{selectedAppt.service.price}</p>
                          </div>
                        )
                        : (
                          <p className="text-xs text-deep-grape/30 font-bold italic text-center py-4">No service details available</p>
                        )
                    }
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-warm-grey/30 border border-black/5 rounded-[2rem] relative overflow-hidden group/box">
                    <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.3em] mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-deep-grape italic tracking-tight">₹{selectedAppt.total_amount || 0}</p>
                    <CreditCard className="absolute top-4 right-6 w-8 h-8 text-deep-grape/5 group-hover/box:text-naturals-purple/10 transition-colors" />
                  </div>
                  <div className="p-6 bg-warm-grey/30 border border-black/5 rounded-[2rem] relative overflow-hidden group/box">
                    <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.3em] mb-1">Service Duration</p>
                    <p className="text-2xl font-black text-deep-grape italic tracking-tight">
                      {selectedAppt.appointment_services?.reduce((acc, curr) => acc + (curr.service.duration_minutes || 0), 0) || selectedAppt.service?.duration_minutes || 60}m
                    </p>
                    <Clock className="absolute top-4 right-6 w-8 h-8 text-deep-grape/5 group-hover/box:text-naturals-purple/10 transition-colors" />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-black/5 shadow-sm group hover:border-naturals-purple/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-naturals-purple/5 flex items-center justify-center text-naturals-purple shadow-inner">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-deep-grape/20 uppercase tracking-[0.2em] mb-0.5">Timeline</p>
                      <p className="text-xs font-black text-deep-grape italic tracking-tight">
                        {new Date(selectedAppt.appointment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        <span className="mx-2 opacity-10">|</span>
                        {selectedAppt.start_time.slice(0, 5)} - {selectedAppt.end_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-black/5 shadow-sm group hover:border-naturals-purple/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-naturals-purple/5 flex items-center justify-center text-naturals-purple shadow-inner">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-deep-grape/20 uppercase tracking-[0.2em] mb-0.5">Assigned Stylist</p>
                      <p className="text-xs font-black text-deep-grape italic tracking-tight">{selectedAppt.stylist?.full_name || "Any Available"}</p>
                    </div>
                  </div>
                </div>

                {selectedAppt.notes && (
                  <div className="p-5 bg-deep-grape/5 rounded-[1.5rem] border border-black/5">
                    <p className="text-[9px] font-black text-deep-grape/40 uppercase tracking-widest mb-1">Technical Notes</p>
                    <p className="text-[10px] font-bold text-deep-grape/60 leading-relaxed italic">{selectedAppt.notes}</p>
                  </div>
                )}

                <button 
                  onClick={() => setDetailsModalOpen(false)}
                  className="w-full py-4 bg-deep-grape text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all hover:bg-naturals-purple shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Reassign Modal */}
      <AnimatePresence>
        {isReassignModalOpen && reassignAppt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" 
              onClick={() => setReassignModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl relative z-10 border border-black/5"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-black/5">
                <div>
                  <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-0.5">Select New Stylist</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-naturals-purple/60">Available for {reassignAppt.start_time.slice(0, 5)} slot</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-rose-500/40 mb-1">Skip Reason</p>
                  <p className="text-[10px] font-black text-rose-500 italic">"{reassignAppt.skip_reason || 'No reason provided'}"</p>
                </div>
                <button 
                  onClick={() => setReassignModalOpen(false)} 
                  className="w-10 h-10 bg-warm-grey/50 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group shrink-0"
                >
                  <XCircle className="w-5 h-5 text-deep-grape/40 group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingStylists ? (
                  <div className="py-20 text-center">
                    <RefreshCw className="w-8 h-8 text-naturals-purple animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">Scanning Specialist Rosters...</p>
                  </div>
                ) : availableStylists.length > 0 ? (
                  availableStylists
                    .sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0)) // Sort by experience for best match
                    .map((stylist, idx) => {
                      const isBestMatch = idx === 0 && stylist.experience_years > 5;
                      return (
                        <button
                          key={stylist.id}
                          onClick={() => performReassign(stylist.id)}
                          className={`w-full flex items-center justify-between p-5 border rounded-2xl transition-all group relative overflow-hidden ${
                            isBestMatch 
                              ? "bg-naturals-purple/[0.03] border-naturals-purple/20 hover:bg-naturals-purple/5 shadow-lg shadow-naturals-purple/5" 
                              : "bg-warm-grey/30 border-black/5 hover:bg-naturals-purple/5"
                          }`}
                        >
                          {isBestMatch && (
                            <div className="absolute top-0 left-0 bg-naturals-purple text-white text-[7px] font-black uppercase tracking-widest px-3 py-1 rounded-br-xl flex items-center gap-1 shadow-lg">
                              <Sparkles className="w-2 h-2" /> Best Match
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-sm transition-all ${
                              isBestMatch ? "bg-naturals-purple text-white" : "bg-white border border-black/5 text-naturals-purple"
                            }`}>
                              {stylist.full_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black text-deep-grape italic">{stylist.full_name}</p>
                              <p className="text-[8px] font-black text-naturals-purple uppercase tracking-widest">{stylist.specialty || 'Master Stylist'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-[10px] font-black text-deep-grape">{stylist.experience_years} YRS</span>
                            </div>
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-md">Available</span>
                          </div>
                        </button>
                      );
                    })
                ) : (
                  <div className="py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-deep-grape/10 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">No specialists free for this slot</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-black/5">
                <button 
                  onClick={() => setReassignModalOpen(false)}
                  className="w-full py-4 bg-deep-grape text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all hover:bg-naturals-purple shadow-lg"
                >
                  Cancel Reassignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
