"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { User, Activity, Calendar, Award, Droplets, Sun, Sparkles, Map as MapIcon, Leaf, Search, ShieldCheck, Edit2, Loader2, Check } from "lucide-react";

const questionnaireData = [
  { id: 'hair_wash_preference', question: 'Prefer hairwash', options: ['Before SPA', 'After SPA', 'Both'] },
  { id: 'hairstyle_male', question: 'Preferred Hairstyle (Male)', options: ['Classic', 'Modern Fade', 'Long Taper', 'Buzz Cut', 'Layered', 'Pompadour', 'Crew Cut'], gender: ['male'] },
  { id: 'hairstyle_female', question: 'Preferred Hairstyle (Female)', options: ['Layered Cut', 'Straight Bob', 'Pixie Cut', 'Beach Waves', 'Wispy Bangs', 'Shag Cut', 'Wolf Cut'], gender: ['female'] },
  { id: 'beard_mustache', question: 'Preferred Beard/Mustache', options: ['Clean Shave', 'Stubble', 'Full Beard', 'Trimmed Mustache', 'Goatee'], gender: ['male'] },
  { id: 'water_temp', question: 'Water Temperature', options: ['Cold', 'Lukewarm', 'Warm'] },
  { id: 'scalp_massage', question: 'Scalp Massage Intensity', options: ['Soft', 'Medium', 'Strong', 'None'] },
  { id: 'conversation', question: 'Conversation Level', options: ['Quiet Professional', 'Friendly Chat', 'Social/Engaging'] }
];

export default function BeautyPassport() {
  const { profile, customerProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferences, setPreferences] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customerProfile?.ai_hairstyle_analysis?.questionnaire_results) {
      setPreferences(customerProfile.ai_hairstyle_analysis.questionnaire_results);
    }
  }, [customerProfile]);

  const handleSavePreferences = async () => {
    if (!customerProfile?.id) return;
    setIsSaving(true);
    
    const updatedAnalysis = {
      ...(customerProfile.ai_hairstyle_analysis || {}),
      questionnaire_results: preferences
    };
    
    const { error } = await supabase
      .from('customers')
      .update({ ai_hairstyle_analysis: updatedAnalysis })
      .eq('id', customerProfile.id);
      
    setIsSaving(false);
    if (!error) {
      setIsEditingPreferences(false);
    } else {
      alert("Error saving preferences. Please try again.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Accessing Encrypted Database for: ${searchQuery}`);
    }
  };

  const handleScanFace = () => {
    setIsScanning(true);
    setTimeout(() => {
      alert(`Style Session Synchronization Successful. Subject: ${customerProfile?.full_name || 'User'} • Access Granted.`);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-naturals-purple/10 text-naturals-purple text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-naturals-purple/20">
            <ShieldCheck className="w-3 h-3" /> Protocol 03: AR Styling & History Vault
          </div>
          <h1 className="text-3xl font-black text-deep-grape mb-2 italic tracking-tighter">Unified Styling Archives</h1>
          <p className="text-deep-grape/40 font-bold uppercase text-xs tracking-widest text-left">AR Hair Colouring & Hair Cutted archival for precise service alignment.</p>
        </div>
        
        <div className="flex gap-4">
           <form onSubmit={handleSearch} className="flex items-center bg-warm-grey/50 border border-black/5 px-4 py-2 rounded-xl focus-within:bg-white transition-all shadow-inner">
             <Search className="w-4 h-4 text-deep-grape/30" />
             <input 
              type="text" 
              placeholder="CLIENT_ID / MOBILE_LINK" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest px-3 w-48 text-deep-grape placeholder:text-deep-grape/30" 
             />
           </form>
           <button 
            onClick={handleScanFace}
            disabled={isScanning}
            className="px-8 py-3 bg-deep-grape text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-naturals-purple transition-all disabled:opacity-50 cursor-pointer"
           >
             {isScanning ? "SYNCHRONIZING..." : "INITIALIZE SCAN"}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Customer Identity */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden border border-black/5 bg-white">
             <div className="absolute top-0 right-0 left-0 h-32 bg-warm-grey" />
             <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-2xl relative z-10 overflow-hidden bg-white mt-12 mb-6 transform rotate-3 flex items-center justify-center">
               {customerProfile?.profile_photo_url || profile?.profile_photo_url ? (
                 <img src={customerProfile?.profile_photo_url || profile?.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-naturals-purple/20" />
               )}
             </div>
             <h2 className="text-2xl font-black text-deep-grape italic tracking-tighter">{customerProfile?.full_name || profile?.full_name || "Guest User"}</h2>
             <p className="text-[10px] font-black text-naturals-purple uppercase tracking-[0.3em] mb-10 flex gap-2 items-center justify-center">
               <Award className="w-4 h-4" /> {customerProfile?.is_premium ? "Premium Member" : "Registered Client"}
             </p>
             
             <div className="grid grid-cols-2 gap-4 w-full">
               <div className="p-4 bg-warm-grey/30 rounded-2xl border border-black/5 overflow-hidden text-ellipsis">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Mobile Contact</p>
                 <p className="text-xs font-black italic text-deep-grape">{customerProfile?.phone || profile?.phone || "Not Set"}</p>
               </div>
               <div className="p-4 bg-warm-grey/30 rounded-2xl border border-black/5 overflow-hidden text-ellipsis">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Registered Email</p>
                 <p className="text-[10px] sm:text-xs font-black italic text-deep-grape truncate w-full block">{customerProfile?.email || profile?.email || "Not Set"}</p>
               </div>
             </div>
          </div>

          <div className="glass-card p-10 border border-black/5 bg-white">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/30 mb-8 flex items-center gap-3"><MapIcon className="w-4 h-4 opacity-50" /> Environment Calibration</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Sun className="w-4 h-4" /> Climate Exposure</span>
                <span className="text-[10px] font-black text-orange-600 uppercase">Critical Humidity</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Droplets className="w-4 h-4" /> Resource Quality</span>
                <span className="text-[10px] font-black text-red-500 uppercase">Hard Water (Node: MAA)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40 flex gap-3 items-center"><Leaf className="w-4 h-4" /> Behavioral Activity</span>
                <span className="text-[10px] font-black text-green-600 uppercase">High Frequency Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Container: Service Preferences */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          
          <div className="glass-card p-10 relative overflow-hidden group bg-white border border-black/5 shadow-sm min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-naturals-purple/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h3 className="text-2xl font-black italic text-deep-grape">Service Preferences</h3>
                <p className="text-xs font-bold text-deep-grape/40 uppercase tracking-widest mt-1">
                  Tailor your salon experience perfectly to your needs.
                </p>
              </div>
              
              {!isEditingPreferences ? (
                <button 
                  onClick={() => setIsEditingPreferences(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-warm-grey text-deep-grape rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:bg-naturals-purple/10 hover:text-naturals-purple transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit Preferences
                </button>
              ) : (
                <button 
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-naturals-purple text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-naturals-purple/20 hover:scale-[1.02] transition-transform disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} 
                  {isSaving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              )}
            </div>

            <div className="space-y-6 relative z-10">
              {questionnaireData
                .filter(q => !q.gender || (q.gender.includes((customerProfile?.gender || profile?.gender || '').toLowerCase())))
                .map((q) => (
                  <div key={q.id} className="p-6 rounded-2xl bg-[#fafafa] border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-widest text-deep-grape/40 mb-1">{q.question}</p>
                      {!isEditingPreferences && (
                        <p className="text-base font-black italic text-deep-grape flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-naturals-purple" /> 
                          {Array.isArray(preferences[q.id]) && preferences[q.id].length > 0 
                            ? preferences[q.id].join(", ") 
                            : preferences[q.id] 
                            ? preferences[q.id] 
                            : "Not Specified"}
                        </p>
                      )}
                    </div>
                    
                    {isEditingPreferences && (
                      <div className="flex-1 flex flex-wrap gap-2">
                        {q.options.map(option => {
                          const currentSelections = Array.isArray(preferences[q.id]) 
                            ? preferences[q.id] 
                            : (preferences[q.id] ? [preferences[q.id]] : []);
                          const isSelected = currentSelections.includes(option);

                          return (
                            <button
                              key={option}
                              onClick={() => {
                                if (isSelected) {
                                  setPreferences({ ...preferences, [q.id]: currentSelections.filter((item: string) => item !== option) });
                                } else {
                                  setPreferences({ ...preferences, [q.id]: [...currentSelections, option] });
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-naturals-purple text-white border-naturals-purple shadow-lg shadow-naturals-purple/20" 
                                  : "bg-white text-deep-grape/50 border-black/10 hover:border-naturals-purple/30"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
              ))}
              
              {!isEditingPreferences && Object.keys(preferences).length === 0 && (
                <div className="text-center py-20 px-4">
                  <div className="w-16 h-16 bg-warm-grey rounded-full flex items-center justify-center mx-auto mb-4">
                     <Activity className="w-8 h-8 text-deep-grape/20" />
                  </div>
                  <p className="text-sm font-black text-deep-grape italic mb-2">No Preferences Set</p>
                  <p className="text-[10px] font-bold text-deep-grape/40 uppercase tracking-widest max-w-sm mx-auto">
                    Click "Edit Preferences" above to customize your salon experience before your next visit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
