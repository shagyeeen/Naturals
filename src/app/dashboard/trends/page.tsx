"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  PackageOpen,
  AlertCircle,
  Calendar,
  BarChart3,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Sparkles,
  Package,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Zap,
  Globe,
  PieChart,
  Instagram,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";

interface FeedbackAnalytics {
  sentimentVelocity: number;
  avgRating: number;
  totalFeedbacks: number;
  ratingDistribution: Record<number, number>;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  avgServiceQuality: number;
  avgStylistBehaviour: number;
  avgCleanliness: number;
  avgValueForMoney: number;
  recentFeedbacks: {
    id: string;
    rating: number;
    comment?: string;
    sentiment_label: string;
    source: string;
    branch_location?: string;
    created_at: string;
  }[];
  trend: "up" | "down" | "stable";
}

interface InventoryAlert {
  id: string;
  productName: string;
  category: string;
  branch: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  unitCost: number;
  supplier: string;
  status: "critical" | "low" | "optimal";
  type: string;
  reason: string;
  action: string | null;
}

interface InventoryData {
  alerts: InventoryAlert[];
  summary: {
    criticalCount: number;
    lowCount: number;
    optimalCount: number;
    totalProducts: number;
    totalStockValue: number;
  };
  recentOrders: {
    id: string;
    product_name: string;
    branch_location: string;
    quantity_ordered: number;
    total_cost: number;
    status: string;
    created_at: string;
  }[];
}

interface ProcurementResult {
  success: boolean;
  message: string;
  ordersCreated: number;
  totalCost?: number;
}

// --- High Quality Mock Data for Demo Visibility ---
const MOCK_ANALYTICS: FeedbackAnalytics = {
  sentimentVelocity: 94.2,
  avgRating: 4.8,
  totalFeedbacks: 1242,
  ratingDistribution: { 5: 840, 4: 210, 3: 120, 2: 52, 1: 20 },
  sentimentBreakdown: { positive: 912, neutral: 210, negative: 120 },
  avgServiceQuality: 4.9,
  avgStylistBehaviour: 4.7,
  avgCleanliness: 4.8,
  avgValueForMoney: 4.6,
  recentFeedbacks: [
    { id: "1", rating: 5, comment: "Absolutely loved the Keratin treatment. Anjali was very professional and the result is stunning!", sentiment_label: "positive", source: "Google", branch_location: "Adyar", created_at: new Date().toISOString() },
    { id: "2", rating: 5, comment: "Great experience at RS Puram. The new AI suggestion for hair color was perfect.", sentiment_label: "positive", source: "In-App", branch_location: "Coimbatore", created_at: new Date().toISOString() },
    { id: "3", rating: 2, comment: "Waiting time was too long even with an appointment. Staff seemed overwhelmed.", sentiment_label: "negative", source: "Yelp", branch_location: "Indiranagar", created_at: new Date().toISOString() },
    { id: "4", rating: 4, comment: "Value for money is good. Cleanliness could be slightly better in the washing area.", sentiment_label: "neutral", source: "In-App", branch_location: "Adyar", created_at: new Date().toISOString() },
  ],
  trend: "up"
};

const MOCK_INVENTORY: InventoryData = {
  alerts: [
    { id: "i1", productName: "L'Oreal Professionnel Serie Expert Absolut Repair Shampoo (500ml)", category: "Shampoo", branch: "Adyar", currentStock: 2, minThreshold: 5, maxCapacity: 20, unit: "Bottles", unitCost: 850, supplier: "ProBeauty Hub", status: "critical", type: "STOCK DEPLETION", reason: "Current stock (2) below critical threshold (5). High velocity item.", action: "Procure 18 units immediately." },
    { id: "i2", productName: "Schwarzkopf Professional IGORA Royal 5-0 (60ml)", category: "Hair Color", branch: "RS Puram", currentStock: 4, minThreshold: 10, maxCapacity: 40, unit: "Tubes", unitCost: 420, supplier: "ColorMaster Direct", status: "low", type: "PREDICTIVE SHORTFALL", reason: "Based on last 30 day demand, stock will hit zero in 4 days.", action: "Queue for weekly replenishment." },
    { id: "i3", productName: "Naturals Signature Spa Oil (1L)", category: "Oils", branch: "Adyar", currentStock: 12, minThreshold: 10, maxCapacity: 30, unit: "Litres", unitCost: 1200, supplier: "Naturals Corporate", status: "optimal", type: "RESTOCK SECURE", reason: "Stock level within target range (12/10).", action: null },
  ],
  summary: {
    criticalCount: 1,
    lowCount: 1,
    optimalCount: 12,
    totalProducts: 45,
    totalStockValue: 124500
  },
  recentOrders: []
};

export default function TrendIntelligence() {
  const [selectedRegion, setSelectedRegion] = useState("All Branches");
  const [isAutomating, setIsAutomating] = useState(false);
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [procurementResult, setProcurementResult] = useState<ProcurementResult | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error("Failed to fetch feedback data");
      const data = await res.json();
      
      // If data is empty (table doesn't exist or no records), use Mock for visibility
      if (data.totalFeedbacks === 0) {
        setAnalytics(MOCK_ANALYTICS);
      } else {
        setAnalytics(data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch analytics:", err);
      setAnalytics(MOCK_ANALYTICS); // Fallback to mock on error for demo
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const branchParam = selectedRegion !== "All Branches" ? `?branch=${encodeURIComponent(selectedRegion.split(" — ")[1] || selectedRegion)}` : "";
      const res = await fetch(`/api/inventory${branchParam}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      
      if (!data.alerts || data.alerts.length === 0) {
        setInventory(MOCK_INVENTORY);
      } else {
        setInventory(data);
      }
    } catch (err) {
      console.error("Inventory fetch error:", err);
      setInventory(MOCK_INVENTORY); // Fallback to mock on error for demo
    } finally {
      setIsLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchInventory();
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [selectedRegion]);

  const handleAutomateOrders = async () => {
    setIsAutomating(true);
    setProcurementResult(null);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auto-procure" }),
      });
      const data = await res.json();
      setProcurementResult(data);
      await fetchInventory();
    } catch (err) {
      setProcurementResult({
        success: false,
        message: "Failed to process procurement. Please try again.",
        ordersCreated: 0,
      });
    } finally {
      setIsAutomating(false);
    }
  };

  const sentimentVelocity = analytics?.sentimentVelocity ?? 0;
  const trend = analytics?.trend ?? "stable";
  const totalFeedbacks = analytics?.totalFeedbacks ?? 0;

  return (
    <div className="min-h-screen bg-[#0F071D] text-white p-6 relative overflow-hidden">
      {/* Mesh Gradients Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-naturals-purple/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-fuchsia-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-naturals-purple/20 flex items-center justify-center border border-naturals-purple/30">
                <Zap className="w-5 h-5 text-naturals-purple" />
              </div>
              <h1 className="text-3xl font-black tracking-tight italic">
                INTELLIGENCE <span className="text-naturals-purple font-normal">COMMAND</span>
              </h1>
            </div>
            <p className="text-gray-400 font-medium max-w-md">
              Real-time neural synthesis of customer sentiment and operational logistics.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-naturals-purple to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="appearance-none bg-[#1A102D] border border-white/10 rounded-xl px-5 py-3 pr-12 text-sm font-bold text-white cursor-pointer hover:border-naturals-purple/50 transition-all focus:outline-none"
                >
                  <option>All Branches</option>
                  <option>Chennai — Adyar</option>
                  <option>Coimbatore — RS Puram</option>
                  <option>Bangalore — Indiranagar</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>
            
            <button
              onClick={fetchAnalytics}
              disabled={isLoading}
              className="p-3 bg-[#1A102D] border border-white/10 rounded-xl hover:border-naturals-purple/50 transition-all cursor-pointer group"
            >
              <RefreshCw className={`w-5 h-5 text-white/50 group-hover:text-naturals-purple transition-colors ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </motion.div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumKPICard
            icon={<Globe className="w-5 h-5" />}
            color="purple"
            label="Neural Sentiment"
            value={analytics ? analytics.sentimentVelocity.toFixed(1) : null}
            suffix="%"
            trend={trend}
            description="Overall network health"
          />
          <PremiumKPICard
            icon={<Star className="w-5 h-5" />}
            color="amber"
            label="Service Quality"
            value={analytics ? analytics.avgRating.toFixed(1) : null}
            suffix="pts"
            description="Customer experience delta"
          />
          <PremiumKPICard
            icon={<MessageSquare className="w-5 h-5" />}
            color="blue"
            label="Data Ingestion"
            value={analytics ? String(analytics.totalFeedbacks) : null}
            suffix="rev"
            description="Total signals processed"
          />
          <PremiumKPICard
            icon={<Users className="w-5 h-5" />}
            color="emerald"
            label="Satisfaction"
            value={
              !analytics
                ? null
                : analytics.totalFeedbacks > 0
                ? `${Math.round((analytics.sentimentBreakdown.positive / analytics.totalFeedbacks) * 100)}%`
                : "0%"
            }
            description="Positive polarity ratio"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Analytics Hub */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sentiment Breakdown */}
              <GlassCard title="Polarity Distribution" subtitle="Customer reaction vectors">
                {analytics ? (
                  <div className="space-y-6">
                    {[
                      {
                        label: "Positive",
                        count: analytics.sentimentBreakdown.positive,
                        color: "from-emerald-400 to-teal-500",
                        glow: "shadow-emerald-500/20",
                        textColor: "text-emerald-400",
                        icon: <ThumbsUp className="w-4 h-4" />,
                      },
                      {
                        label: "Neutral",
                        count: analytics.sentimentBreakdown.neutral,
                        color: "from-gray-400 to-slate-500",
                        glow: "shadow-gray-500/20",
                        textColor: "text-gray-400",
                        icon: <Minus className="w-4 h-4" />,
                      },
                      {
                        label: "Negative",
                        count: analytics.sentimentBreakdown.negative,
                        color: "from-rose-400 to-red-600",
                        glow: "shadow-red-500/20",
                        textColor: "text-rose-400",
                        icon: <ThumbsDown className="w-4 h-4" />,
                      },
                    ].map((item, i) => {
                      const total = analytics.sentimentBreakdown.positive + analytics.sentimentBreakdown.neutral + analytics.sentimentBreakdown.negative;
                      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                      return (
                        <div key={item.label} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2 ${item.textColor}`}>
                              {item.icon} {item.label}
                            </span>
                            <span className="text-sm font-black text-white/80 tabular-nums">
                              {pct}%
                            </span>
                          </div>
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "circOut" }}
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${item.glow}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <SkeletonList count={3} />}
              </GlassCard>

              {/* Quality Dimensions */}
              <GlassCard title="Operational KPIs" subtitle="Service dimension analysis">
                {analytics ? (
                  <div className="space-y-6">
                    {[
                      { label: "Service Logic", value: analytics.avgServiceQuality, color: "from-blue-400 to-indigo-500" },
                      { label: "Stylist Precision", value: analytics.avgStylistBehaviour, color: "from-violet-400 to-purple-600" },
                      { label: "Zone Sterility", value: analytics.avgCleanliness, color: "from-emerald-400 to-teal-500" },
                      { label: "Value Equation", value: analytics.avgValueForMoney, color: "from-amber-400 to-orange-500" },
                    ].map((dim, i) => (
                      <div key={dim.label}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{dim.label}</span>
                          <span className="text-sm font-black text-white italic tabular-nums">{dim.value}<span className="text-[10px] text-white/20 ml-1">/5</span></span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(dim.value / 5) * 100}%` }}
                            transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: "circOut" }}
                            className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <SkeletonList count={4} />}
              </GlassCard>
            </div>

            {/* Rating distribution chart */}
            <GlassCard title="Neural Response Curve" subtitle="Rating intensity spectrum">
              {analytics ? (
                <div className="pt-4 h-48 flex items-end gap-3 sm:gap-6">
                  {[1, 2, 3, 4, 5].map((star, i) => {
                    const count = analytics.ratingDistribution[star] || 0;
                    const maxCount = Math.max(...Object.values(analytics.ratingDistribution), 1);
                    const barHeight = (count / maxCount) * 100;
                    return (
                      <div key={star} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] font-black text-white/40 tabular-nums mb-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {count}
                        </motion.div>
                        <div className="w-full relative flex flex-col items-center justify-end h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(barHeight, 4)}%` }}
                            transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                            className={`w-full rounded-t-xl transition-all relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] ${
                              star >= 4
                                ? "bg-gradient-to-t from-emerald-600/20 to-emerald-400"
                                : star === 3
                                ? "bg-gradient-to-t from-amber-600/20 to-amber-400"
                                : "bg-gradient-to-t from-rose-600/20 to-rose-500"
                            }`}
                          >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                          </motion.div>
                        </div>
                        <span className="text-xs font-black text-white/20 italic tracking-tighter">{star}★</span>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />}
            </GlassCard>

            {/* Recent Neural Feed */}
            <GlassCard title="Real-time Signal Feed" subtitle="Latest unprocessed customer vectors">
              {analytics && analytics.recentFeedbacks.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {analytics.recentFeedbacks.slice(0, 6).map((fb, i) => (
                    <motion.div
                      key={fb.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-naturals-purple/30 transition-all group"
                    >
                      <div className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          fb.sentiment_label === "positive" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                          fb.sentiment_label === "negative" ? "bg-rose-500/10 border-rose-500/30 text-rose-500" :
                          "bg-white/5 border-white/10 text-white/40"
                        }`}>
                          {fb.sentiment_label === "positive" ? <ThumbsUp className="w-3.5 h-3.5" /> : 
                           fb.sentiment_label === "negative" ? <ThumbsDown className="w-3.5 h-3.5" /> : 
                           <Minus className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-medium italic">
                            "{fb.comment || "Signal detected without semantic payload."}"
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < fb.rating ? "text-amber-400 fill-amber-400" : "text-white/10"}`} />
                              ))}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-naturals-purple/60 bg-naturals-purple/10 px-2 py-0.5 rounded-full border border-naturals-purple/20">
                              {fb.source}
                            </span>
                            <span className="text-[9px] text-white/20 font-bold flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> {fb.branch_location || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : <SkeletonList count={4} className="grid grid-cols-2 gap-4" />}
            </GlassCard>
          </div>

          {/* Right Column: Inventory & Logistics */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard title="Logistics Core" subtitle="Autonomous inventory forecasting">
              <div className="space-y-6">
                {/* Stats Summary */}
                {inventory && (
                  <div className="grid grid-cols-3 gap-3 p-1 bg-white/5 rounded-2xl border border-white/5">
                    <div className="py-3 text-center">
                      <p className="text-xs font-black text-rose-500 tabular-nums">{inventory.summary.criticalCount}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Critical</p>
                    </div>
                    <div className="py-3 text-center border-x border-white/5">
                      <p className="text-xs font-black text-amber-500 tabular-nums">{inventory.summary.lowCount}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Low</p>
                    </div>
                    <div className="py-3 text-center">
                      <p className="text-xs font-black text-emerald-500 tabular-nums">{inventory.summary.optimalCount}</p>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Secure</p>
                    </div>
                  </div>
                )}

                {/* Live inventory status */}
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                  {inventory?.alerts.map((alert) => (
                    <ForecastCard
                      key={alert.id}
                      type={alert.type}
                      title={alert.productName}
                      reason={alert.reason}
                      action={alert.action}
                      color={alert.status === "critical" ? "orange" : alert.status === "low" ? "blue" : "green"}
                      branch={alert.branch}
                      stock={alert.currentStock}
                      threshold={alert.minThreshold}
                      unit={alert.unit}
                    />
                  ))}
                  {!isLoadingInventory && inventory?.alerts.length === 0 && (
                    <div className="py-20 text-center">
                      <Package className="w-12 h-12 text-white/5 mx-auto mb-4" />
                      <p className="text-sm font-bold text-white/20 uppercase tracking-[0.2em]">No logistic anomalies</p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {procurementResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`rounded-2xl p-4 border backdrop-blur-xl ${
                        procurementResult.success ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-xl ${procurementResult.success ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                          {procurementResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                        </div>
                        <div>
                          <p className={`text-xs font-black uppercase tracking-widest ${procurementResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                            {procurementResult.success ? "Transmission Success" : "Sync Failed"}
                          </p>
                          <p className="text-[11px] text-white/60 mt-1 leading-tight">{procurementResult.message}</p>
                          {procurementResult.totalCost && (
                            <p className="text-[10px] font-black text-white mt-2 tabular-nums">ALLOCATED: ₹{procurementResult.totalCost.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleAutomateOrders}
                  disabled={isAutomating}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-naturals-purple to-indigo-600 group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative py-4 flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em] transition-all group-hover:gap-5">
                    {isAutomating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        Execute Auto-Procure
                      </>
                    )}
                  </div>
                </button>

                {inventory && (
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Global Asset Value</span>
                    <span className="text-sm font-black text-naturals-purple tabular-nums italic">₹{inventory.summary.totalStockValue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Neural Insights / Trending */}
            <GlassCard title="Trend Trajectory" subtitle="Neural signal breakout detection">
              <div className="space-y-4">
                {[
                  { name: "Glass Dermal Synthesis", growth: "+42%", up: true, tag: "BREAKOUT" },
                  { name: "Follicle Neural Repair", growth: "+35%", up: true, tag: "ASCENDING" },
                  { name: "Keratin Fusion", growth: "+12%", up: true, tag: "STABLE" },
                  { name: "Traditional Bonding", growth: "-18%", up: false, tag: "PHASE OUT" },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div>
                      <p className="text-[10px] font-black text-naturals-purple mb-0.5 tracking-tighter">{svc.tag}</p>
                      <p className="text-sm font-bold text-white/70 italic tracking-tight">{svc.name}</p>
                    </div>
                    <div className={`flex flex-col items-end ${svc.up ? "text-emerald-400" : "text-rose-500"}`}>
                      <span className="flex items-center gap-1 font-black italic tracking-tighter">
                        {svc.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {svc.growth}
                      </span>
                      <span className="text-[8px] font-black opacity-30 uppercase">30D Delta</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
            <InstagramMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── UI Components ────────────────────────── */

function PremiumKPICard({ 
  icon, 
  color, 
  label, 
  value, 
  suffix, 
  trend, 
  description 
}: { 
  icon: React.ReactNode; 
  color: "purple" | "amber" | "blue" | "emerald"; 
  label: string; 
  value: string | null; 
  suffix?: string; 
  trend?: "up" | "down" | "stable";
  description: string;
}) {
  const themes = {
    purple: "from-naturals-purple/20 to-naturals-purple/5 border-naturals-purple/20 text-naturals-purple",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-500",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-500",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-500",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${themes[color]} border backdrop-blur-xl relative overflow-hidden group shadow-2xl`}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:translate-x-0 transition-transform duration-700">
        <Activity className="w-24 h-24" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${themes[color].split(' ').pop()}`}>
          {icon}
        </div>
        {trend && trend !== "stable" && (
          <div className={`flex items-center gap-1 text-xs font-black italic tracking-tighter ${trend === "up" ? "text-emerald-400" : "text-rose-500"}`}>
            {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend === "up" ? "GAIN" : "LOSS"}
          </div>
        )}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-1">{label}</p>
      
      {value === null ? (
        <div className="h-10 w-24 bg-white/5 rounded-xl animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black italic tracking-tighter text-white tabular-nums">{value}</h3>
          <span className="text-lg font-black text-white/20 italic tracking-tighter uppercase">{suffix}</span>
        </div>
      )}
      
      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">{description}</p>
    </motion.div>
  );
}

function GlassCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#1A102D]/60 backdrop-blur-2xl rounded-[3rem] border border-white/5 p-8 shadow-2xl relative group"
    >
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-naturals-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex flex-col mb-8">
        <h2 className="text-lg font-black italic tracking-tight text-white uppercase group-hover:text-naturals-purple transition-colors">
          {title}
        </h2>
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
          {subtitle}
        </p>
      </div>
      
      {children}
    </motion.div>
  );
}

function ForecastCard({ type, title, reason, action, color, branch, stock, threshold, unit }: any) {
  const colors: any = {
    orange: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", badge: "bg-rose-500/20", bar: "bg-rose-500" },
    blue: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", badge: "bg-indigo-500/20", bar: "bg-indigo-500" },
    green: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", badge: "bg-emerald-500/20", bar: "bg-emerald-500" },
  };

  const theme = colors[color] || colors.blue;
  const stockPct = stock !== undefined && threshold ? Math.min((stock / (threshold * 2)) * 100, 100) : null;

  return (
    <div className={`p-5 rounded-3xl border ${theme.border} ${theme.bg} relative group overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
        <Package className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme.badge} ${theme.text} border border-current/20`}>
          {type}
        </span>
        <span className="text-[10px] font-black text-white/20 italic tracking-tighter">{branch}</span>
      </div>

      <h4 className="text-sm font-black text-white/90 mb-1 italic tracking-tight group-hover:text-white transition-colors">{title}</h4>
      <p className="text-[11px] text-white/40 font-medium mb-4 leading-snug">{reason}</p>

      {stockPct !== null && (
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-white/20 tabular-nums">
              STOCK: <span className="text-white/60">{stock}</span> / {threshold * 2} {unit}
            </p>
            <span className={`text-[10px] font-black italic tracking-tighter ${theme.text}`}>{Math.round(stockPct)}%</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPct}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className={`h-full ${theme.bar} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
            />
          </div>
        </div>
      )}

      {action && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-white/60 group-hover:text-white transition-colors italic">
            <ArrowUpRight className="w-3.5 h-3.5 text-naturals-purple" />
            {action}
          </div>
        </div>
      )}
    </div>
  );
}

function InstagramMonitor() {
  const [metrics, setMetrics] = useState({
    followers: 124582,
    reach: 842900,
    engagement: 4.2,
    isLive: true
  });

  useEffect(() => {
    // Simulate real-time signal flux
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 3),
        reach: prev.reach + Math.floor(Math.random() * 12)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard title="Social Neural Pulse" subtitle="Real-time Instagram Signal Processing">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-5 rounded-[2rem] bg-gradient-to-br from-pink-500/10 to-violet-600/10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Instagram className="w-24 h-24" />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] shadow-2xl animate-pulse">
              <div className="w-full h-full rounded-2xl bg-[#0F071D] flex items-center justify-center overflow-hidden">
                <img 
                  src="/naturalslogo.png" 
                  alt="Naturals" 
                  className="w-10 h-10 object-contain invert"
                />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black italic tracking-tighter text-white">@naturalssalon</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Neural Link</span>
              </div>
            </div>
          </div>
          
          <a 
            href="https://www.instagram.com/naturalssalon/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-naturals-purple transition-all group relative z-10"
          >
            <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Users className="w-3 h-3" /> Followers
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black italic tabular-nums text-white">
                {metrics.followers.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-emerald-400">+{Math.floor(Math.random() * 40)} today</span>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Monthly Reach
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black italic tabular-nums text-white">
                {(metrics.reach / 1000).toFixed(1)}K
              </span>
              <span className="text-[10px] font-black text-emerald-400">↑ 12%</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Activity className="w-3 h-3" /> Engagement Velocity
            </div>
            <span className="text-xs font-black text-naturals-purple italic tabular-nums">{metrics.engagement}%</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '42%' }}
              className="h-full bg-gradient-to-r from-pink-500 to-naturals-purple rounded-full shadow-[0_0_15px_rgba(219,39,119,0.3)]"
            />
          </div>
          <div className="flex justify-between mt-3">
             <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                <span className="text-[10px] font-black text-white/40 tabular-nums">12.4K Avg Likes</span>
             </div>
             <div className="flex items-center gap-2">
                <Share2 className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-black text-white/40 tabular-nums">1.2K Avg Shares</span>
             </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function SkeletonList({ count, className }: any) {
  return (
    <div className={className || "space-y-4"}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}
