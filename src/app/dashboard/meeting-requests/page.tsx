"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Trash2, 
  RefreshCw, 
  Clock, 
  User, 
  Mail, 
  Phone,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";

export default function MeetingRequestsPage() {
  const { isAdmin, isManager, isFranchiseOwner, isStylist } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error("Error fetching meeting requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMeetingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(m => 
    m.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone?.includes(searchQuery)
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'contacted': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'scheduled': return "bg-naturals-purple/10 text-naturals-purple border-naturals-purple/20";
      case 'completed': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'cancelled': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (!(isAdmin || isManager || isFranchiseOwner || isStylist)) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-deep-grape/40 font-black uppercase tracking-widest">Unauthorized Access</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <Calendar className="w-3 h-3" /> Consultation Queue
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
            Scheduled Meetings
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">
            Manage incoming premium service consultations and meeting requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMeetings}
            className="p-3 rounded-2xl bg-white border border-black/5 text-deep-grape hover:text-naturals-purple transition-all shadow-sm group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-grape/30 group-focus-within/search:text-naturals-purple transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH REQUESTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-naturals-purple/30 focus:ring-4 focus:ring-naturals-purple/5 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: meetings.length, color: 'text-deep-grape' },
          { label: 'Pending', value: meetings.filter(m => m.status === 'pending').length, color: 'text-amber-500' },
          { label: 'Scheduled', value: meetings.filter(m => m.status === 'scheduled').length, color: 'text-naturals-purple' },
          { label: 'Completed', value: meetings.filter(m => m.status === 'completed').length, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 bg-white border border-black/5">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-deep-grape/30 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black italic ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-8 min-h-[250px] animate-pulse bg-white border border-black/5">
              <div className="h-4 w-24 bg-deep-grape/5 rounded-full mb-6" />
              <div className="h-8 w-48 bg-deep-grape/10 rounded-xl mb-4" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-deep-grape/5 rounded-full" />
                <div className="h-3 w-2/3 bg-deep-grape/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMeetings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMeetings.map((meeting, idx) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card bg-white border border-black/5 group hover:shadow-2xl hover:border-naturals-purple/20 transition-all flex flex-col"
              >
                <div className="p-8 pb-6">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(meeting.status)}`}>
                      {meeting.status === 'pending' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {meeting.status}
                    </span>
                    <span className="text-[10px] font-black text-deep-grape/20 uppercase tracking-widest">
                      {new Date(meeting.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-deep-grape italic mb-1 group-hover:text-naturals-purple transition-colors">
                    {meeting.service_name}
                  </h3>
                  <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.2em] mb-6">
                    Premium Consultation Request
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Customer</p>
                        <p className="text-xs font-black text-deep-grape">{meeting.customer_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Contact</p>
                        <p className="text-xs font-black text-deep-grape">{meeting.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Email</p>
                        <p className="text-xs font-black text-deep-grape lowercase">{meeting.email}</p>
                      </div>
                    </div>
                  </div>

                  {meeting.notes && (
                    <div className="p-4 bg-warm-grey/50 rounded-2xl border border-black/5 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-3 h-3 text-deep-grape/30" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-deep-grape/30">Customer Notes</span>
                      </div>
                      <p className="text-[10px] font-bold text-deep-grape/60 italic leading-relaxed">
                        "{meeting.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-8 pb-8 mt-auto flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest">Update Status:</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={meeting.status}
                      onChange={(e) => updateMeetingStatus(meeting.id, e.target.value)}
                      className={`col-span-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none ${getStatusStyle(meeting.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={() => deleteMeeting(meeting.id)}
                      className="col-span-2 py-3 bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Request
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto border border-black/5 bg-white shadow-xl rounded-[3rem]">
          <div className="w-24 h-24 bg-warm-grey rounded-3xl flex items-center justify-center mb-8 shadow-inner">
            <Calendar className="w-12 h-12 text-deep-grape/10" />
          </div>
          <h3 className="text-2xl font-black text-deep-grape mb-4 italic tracking-tighter">No Requests Found</h3>
          <p className="text-xs font-bold text-deep-grape/40 mb-10 uppercase tracking-widest leading-relaxed">
            There are no incoming meeting requests at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
