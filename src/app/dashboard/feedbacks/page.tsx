"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { 
  Star, 
  MessageSquareQuote, 
  User, 
  Calendar, 
  Search,
  Filter,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbacksPage() {
  const { isAdmin, isFranchiseOwner, profile } = useAuth();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  useEffect(() => {
    if (isAdmin || isFranchiseOwner) {
      fetchFeedbacks();
    }
  }, [isAdmin, isFranchiseOwner]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (ratingFilter !== 'all') params.append('rating', ratingFilter.toString());
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/feedbacks/list?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch feedbacks");
      
      setFeedbacks(data || []);
    } catch (err: any) {
      console.error("[Feedbacks] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = 
      fb.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.appointment?.service?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === "all" ? true : fb.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const stats = {
    average: feedbacks.length > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) : "0.0",
    total: feedbacks.length,
    positive: feedbacks.filter(f => f.rating >= 4).length,
    negative: feedbacks.filter(f => f.rating <= 2).length
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <MessageSquareQuote className="w-3 h-3" /> Sentiment Analysis
          </div>
          <h1 className="text-4xl font-black text-deep-grape mb-2 italic tracking-tighter">
            Customer Feedback
          </h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest">
            Monitor service quality and customer satisfaction across all sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchFeedbacks}
            className="p-3 rounded-2xl bg-white border border-black/5 text-deep-grape hover:text-naturals-purple transition-all shadow-sm group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-grape/30 group-focus-within/search:text-naturals-purple transition-colors" />
            <input 
              type="text"
              placeholder="SEARCH COMMENTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-naturals-purple/30 focus:ring-4 focus:ring-naturals-purple/5 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <StatCard label="Average Rating" value={`${stats.average} / 5`} icon={<Star className="w-5 h-5 text-amber-500" />} />
         <StatCard label="Total Reviews" value={stats.total.toString()} icon={<Activity className="w-5 h-5 text-naturals-purple" />} />
         <StatCard label="Positive" value={stats.positive.toString()} icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
         <StatCard label="Critical" value={stats.negative.toString()} icon={<TrendingDown className="w-5 h-5 text-red-500" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-warm-grey/50 p-1 rounded-2xl border border-naturals-purple/5">
          <button
            onClick={() => setRatingFilter("all")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ratingFilter === "all" ? "bg-naturals-purple text-white shadow-lg" : "text-deep-grape/40"}`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ratingFilter === r ? "bg-naturals-purple text-white shadow-lg" : "text-deep-grape/40"}`}
            >
              {r} <Star className={`w-3 h-3 ${ratingFilter === r ? "fill-white" : "fill-deep-grape/10"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-naturals-purple/20" />
        </div>
      ) : filteredFeedbacks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredFeedbacks.map((fb, idx) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-10 flex flex-col hover:border-naturals-purple/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? "text-amber-500 fill-amber-500" : "text-gray-100"}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-deep-grape/20 uppercase tracking-widest">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-bold text-deep-grape italic leading-relaxed mb-10 flex-grow">
                  "{fb.comment || "No written feedback provided for this session."}"
                </p>

                <div className="space-y-4 pt-8 border-t border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Customer</p>
                      <p className="text-xs font-black text-deep-grape">{fb.customer?.full_name || "Unknown User"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center text-naturals-purple">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-deep-grape/30 uppercase tracking-widest mb-0.5">Service Session</p>
                      <p className="text-xs font-black text-deep-grape uppercase italic tracking-tight">{fb.appointment?.service?.name || "Premium Service"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-black/5">
           <MessageSquareQuote className="w-12 h-12 text-deep-grape/5 mx-auto mb-6" />
           <p className="text-xs font-black uppercase tracking-widest text-deep-grape/20">No feedback entries found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-8 bg-white/50 backdrop-blur-md hover:border-naturals-purple/20 transition-all">
       <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-warm-grey flex items-center justify-center border border-black/5">
             {icon}
          </div>
       </div>
       <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.25em] mb-1">{label}</p>
       <h4 className="text-2xl font-black text-deep-grape italic tracking-tighter">{value}</h4>
    </div>
  );
}
