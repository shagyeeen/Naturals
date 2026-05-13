"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { 
  MessageSquare, 
  Send, 
  History, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Plus,
  ShieldCheck,
  User,
  Search,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw
} from "lucide-react";
import { 
  createQuery, 
  getMyQueries, 
  getAllQueries, 
  updateQueryStatus,
  SupportQuery 
} from "@/modules/support/service";

export default function RaiseQueryPage() {
  const { user, profile, isAdmin, isFranchiseOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<"raise" | "view">("view");
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const isSupportStaff = isAdmin || isFranchiseOwner;
  const authKey = `${isSupportStaff}-${profile?.id || 'loading'}`;

  const fetchQueries = async () => {
    if (!profile?.id && !isSupportStaff) return;
    setLoading(true);
    const { data, error } = isSupportStaff ? await getAllQueries() : await getMyQueries(profile.id);
    if (!error && data) {
      setQueries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, [authKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !subject.trim() || !message.trim()) return;

    setSubmitting(true);
    const { error } = await createQuery(profile.id, subject, message);
    if (!error) {
      setSubject("");
      setMessage("");
      setActiveTab("view");
      fetchQueries();
    } else {
      alert("Failed to submit query. Please try again.");
    }
    setSubmitting(false);
  };

  const filteredQueries = queries.filter(q => 
    q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-naturals-purple/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-naturals-purple/3 rounded-full blur-[100px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-5xl font-black text-deep-grape italic tracking-tighter leading-none">
            {isSupportStaff ? "Queries" : "Query"}
          </h1>
        </motion.div>

        {!isSupportStaff && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex bg-white/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 shadow-xl shadow-black/5"
          >
            <button
              onClick={() => setActiveTab("view")}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group ${
                activeTab === "view" 
                  ? "bg-naturals-purple text-white shadow-lg shadow-naturals-purple/25" 
                  : "text-deep-grape/40 hover:text-naturals-purple"
              }`}
            >
              <History className={`w-4 h-4 transition-transform duration-500 ${activeTab === "view" ? "scale-110" : "group-hover:rotate-12"}`} />
              <span className="relative z-10">{isSupportStaff ? "all queries" : "my queries"}</span>
              {activeTab === "view" && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-tr from-naturals-purple to-deep-grape opacity-90" />}
            </button>
            <button
              onClick={() => setActiveTab("raise")}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group ${
                activeTab === "raise" 
                  ? "bg-naturals-purple text-white shadow-lg shadow-naturals-purple/25" 
                  : "text-deep-grape/40 hover:text-naturals-purple"
              }`}
            >
              <Plus className={`w-4 h-4 transition-transform duration-500 ${activeTab === "raise" ? "scale-110 rotate-90" : "group-hover:rotate-90"}`} />
              <span className="relative z-10">raise a query</span>
              {activeTab === "raise" && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-tr from-naturals-purple to-deep-grape opacity-90" />}
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "raise" && !isSupportStaff ? (
          <motion.div
            key="raise-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", damping: 20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-naturals-purple/20 to-deep-grape/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
              <div className="glass-card relative p-12 bg-white/90 backdrop-blur-2xl border border-white rounded-[3rem] shadow-2xl overflow-hidden">
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-[0.03]">
                   <MessageSquare className="w-64 h-64 -rotate-12" />
                </div>

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-[2rem] bg-naturals-purple text-white flex items-center justify-center shadow-2xl shadow-naturals-purple/30 rotate-3 transform transition-transform group-hover:rotate-6">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic text-deep-grape leading-none tracking-tighter uppercase">raise a query</h2>
                    <p className="text-[11px] font-bold text-deep-grape/30 uppercase tracking-[0.2em] mt-2">Tell us what happened.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-naturals-purple/50">Subject</label>
                    </div>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-naturals-purple/20 transition-colors group-focus-within/input:text-naturals-purple" />
                      </div>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What is this about?"
                        className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-warm-grey/30 border border-transparent text-sm font-bold text-deep-grape focus:outline-none focus:bg-white focus:border-naturals-purple/20 transition-all shadow-inner hover:bg-warm-grey/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-end px-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-naturals-purple/50">Message</label>
                    </div>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={6}
                      className="w-full px-8 py-6 rounded-[2rem] bg-warm-grey/30 border border-transparent text-sm font-bold text-deep-grape focus:outline-none focus:bg-white focus:border-naturals-purple/20 transition-all shadow-inner hover:bg-warm-grey/50 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 bg-deep-grape text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-deep-grape/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden disabled:opacity-50 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-naturals-purple to-transparent opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Advanced Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center bg-white/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white shadow-xl">
              <div className="relative flex-1 w-full group/search">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/20 transition-colors group-focus-within/search:text-naturals-purple" />
                <input
                  type="text"
                  placeholder={isSupportStaff ? "Search Queries..." : "Search Query..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-4 bg-warm-grey/30 rounded-[1.2rem] text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-naturals-purple/20 border border-transparent transition-all shadow-inner"
                />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                 <button 
                  onClick={fetchQueries}
                  className="p-4 bg-warm-grey/50 hover:bg-naturals-purple/10 text-deep-grape/40 hover:text-naturals-purple rounded-xl transition-all cursor-pointer shadow-sm"
                 >
                   <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                 </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-6">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-naturals-purple/10 border-t-naturals-purple rounded-full animate-spin" />
                   <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-naturals-purple/30 animate-pulse" />
                </div>
                <p className="text-[11px] font-black text-deep-grape/20 uppercase tracking-[0.3em] animate-pulse">Refreshing queries...</p>
              </div>
            ) : filteredQueries.length > 0 ? (
              <div className="grid gap-6">
                {filteredQueries.map((q, idx) => (
                  <QueryCard 
                    key={q.id} 
                    query={q} 
                    idx={idx}
                    isSupportStaff={isSupportStaff} 
                    onUpdate={fetchQueries} 
                  />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-40 bg-white/50 backdrop-blur-xl rounded-[4rem] border border-dashed border-naturals-purple/20"
              >
                <div className="w-24 h-24 bg-warm-grey/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <History className="w-10 h-10 text-deep-grape/10" />
                </div>
                <h3 className="text-2xl font-black italic text-deep-grape mb-3 tracking-tighter">No Queries</h3>
                <p className="text-[11px] font-bold text-deep-grape/30 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                  {searchQuery ? "No matches found." : "Everything looks good here."}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QueryCard({ query, idx, isSupportStaff, onUpdate }: { query: SupportQuery, idx: number, isSupportStaff: boolean, onUpdate: () => void }) {
  const [reply, setReply] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setUpdating(true);
    const { error } = await updateQueryStatus(query.id, 'resolved', reply);
    if (!error) {
      setReply("");
      onUpdate();
    }
    setUpdating(false);
  };

  const handleStatusChange = async (status: string) => {
    setUpdating(true);
    const { error } = await updateQueryStatus(query.id, status, query.admin_notes);
    if (!error) {
      onUpdate();
    }
    setUpdating(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${query.status === 'resolved' ? 'from-green-500/10 to-emerald-500/10' : 'from-naturals-purple/10 to-deep-grape/10'} rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500`} />
      <div className="relative glass-card bg-white p-8 border border-white/60 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <StatusBadge status={query.status} />
              <div className="flex items-center gap-2 px-3 py-1 bg-warm-grey/50 rounded-lg">
                 <Clock className="w-3 h-3 text-deep-grape/20" />
                 <span className="text-[9px] font-black text-deep-grape/40 uppercase tracking-widest">
                  {new Date(query.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="px-3 py-1 bg-naturals-purple/5 rounded-lg border border-naturals-purple/10">
                 <span className="text-[9px] font-black text-naturals-purple uppercase tracking-widest">#{query.id.substring(0,8).toUpperCase()}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black italic text-deep-grape tracking-tighter group-hover:text-naturals-purple transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {query.subject}
              </h3>
              <p className={`text-[13px] font-bold text-deep-grape/60 leading-relaxed max-w-4xl transition-all duration-500 ${isExpanded ? '' : 'line-clamp-2'}`}>
                {query.message}
              </p>
            </div>

            {query.admin_notes && (
              <div className="p-6 bg-gradient-to-tr from-naturals-purple/5 to-transparent border border-naturals-purple/10 rounded-[1.5rem] relative overflow-hidden group/reply">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover/reply:scale-110 transition-transform">
                   <ShieldCheck className="w-12 h-12 text-naturals-purple" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-naturals-purple flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.2em] italic">Reply</p>
                </div>
                <p className="text-sm font-bold text-deep-grape italic leading-relaxed pl-9">{query.admin_notes}</p>
              </div>
            )}

            {isSupportStaff && query.user && (
              <div className="flex items-center gap-4 pt-6 border-t border-black/5 mt-6 group/user">
                <div className="w-12 h-12 rounded-xl bg-warm-grey/50 flex items-center justify-center border border-black/5 transition-colors group-hover/user:bg-naturals-purple/10">
                  <User className="w-5 h-5 text-deep-grape/20 group-hover/user:text-naturals-purple/40" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-deep-grape uppercase leading-none mb-1.5">{query.user.full_name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-deep-grape text-white px-2 py-0.5 rounded-md uppercase tracking-widest">{query.user.role}</span>
                    <span className="text-[10px] font-bold text-deep-grape/30 truncate">{query.user.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSupportStaff && (
            <div className="flex flex-col gap-6 shrink-0 lg:w-72 bg-warm-grey/20 p-6 rounded-[1.5rem] border border-black/5 self-start">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.2em] ml-1">Status</label>
                <div className="relative">
                  <div className="group/dropdown relative">
                    <button 
                      className="w-full flex items-center justify-between pl-5 pr-4 py-4 bg-white border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-naturals-purple/20 transition-all cursor-pointer shadow-sm group-hover/dropdown:border-naturals-purple/20"
                    >
                      <span>{query.status.replace('-', ' ')}</span>
                      <ChevronRight className="w-4 h-4 rotate-90 text-deep-grape/20" />
                    </button>
                    
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/5 p-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 z-[100] transform translate-y-2 group-hover/dropdown:translate-y-0">
                      {[
                        { id: 'pending', label: 'Pending' },
                        { id: 'in-progress', label: 'In-Progress' },
                        { id: 'resolved', label: 'Resolved' },
                        { id: 'closed', label: 'Closed' }
                      ].map((status) => (
                        <button
                          key={status.id}
                          onClick={() => handleStatusChange(status.id)}
                          disabled={updating}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            query.status === status.id 
                              ? 'bg-naturals-purple text-white shadow-lg shadow-naturals-purple/20' 
                              : 'text-deep-grape/60 hover:bg-naturals-purple/5 hover:text-naturals-purple'
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {query.status !== 'resolved' && query.status !== 'closed' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.2em] ml-1">Reply</label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Provide details..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white border border-black/5 rounded-2xl text-xs font-bold text-deep-grape focus:outline-none focus:ring-2 focus:ring-naturals-purple/20 transition-all resize-none shadow-sm"
                  />
                  <button
                    onClick={handleReply}
                    disabled={updating || !reply.trim()}
                    className="w-full py-4 bg-naturals-purple text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-naturals-purple/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    {updating ? "Sending..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-amber-500 text-white shadow-amber-500/20",
    "in-progress": "bg-blue-500 text-white shadow-blue-500/20",
    resolved: "bg-emerald-500 text-white shadow-emerald-500/20",
    closed: "bg-deep-grape/40 text-white shadow-deep-grape/10"
  };

  const icons = {
    pending: Clock,
    "in-progress": AlertCircle,
    resolved: CheckCircle2,
    closed: ShieldCheck
  };

  const labels = {
    pending: "Pending",
    "in-progress": "Processing",
    resolved: "Resolved",
    closed: "Closed"
  };

  const Icon = icons[status as keyof typeof icons] || Clock;

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ${styles[status as keyof typeof styles]}`}>
      <Icon className="w-3.5 h-3.5" />
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}
