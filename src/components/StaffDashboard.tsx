'use client';

import { useState, useEffect } from "react";
import { supabase, Customer, Stylist, Admin, FranchiseOwner, Appointment, Service } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Edit, Trash2, Eye, X, Briefcase, Users, UserCheck, Scissors, Calendar, Sparkles, ChevronDown, ArrowUpDown, Filter, Plus, Zap, AlertCircle } from "lucide-react";

// Modular Hooks
import { useAdminCustomers } from "@/modules/admin/customers/hooks";
import { useAdminAppointments } from "@/modules/admin/appointments/hooks";
import { useBranchStaff } from "@/modules/franchise_owner/staff/hooks";
import { useBranchOverview } from "@/modules/franchise_owner/overview/hooks";
import { useAdminDashboard } from "@/modules/admin/dashboard/hooks";
import { useOffers } from "@/modules/franchise_owner/hooks";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  experienceYears: string;
  notes: string;
  franchiseName?: string;
  franchiseAddress?: string;
  franchiseOwnerId: string;
  // Service fields
  serviceName?: string;
  serviceDescription?: string;
  serviceCategory?: string;
  serviceDuration?: string;
  servicePrice?: string;
  serviceIsActive?: boolean;
  // Appointment fields
  appointmentCustomerId?: string;
  appointmentStylistId?: string;
  appointmentServiceId?: string;
  appointmentDate?: string;
  appointmentStartTime?: string;
  appointmentEndTime?: string;
  appointmentStatus?: string;
  // Offer fields
  offerTitle?: string;
  offerDescription?: string;
  offerDiscountType?: 'percentage' | 'fixed';
  offerDiscountValue?: string;
  offerExpiryDate?: string;
  offerServiceId?: string;
  offerIsActive?: boolean;
  preferences: { [key: string]: string | string[] };
}

const PREDEFINED_QUESTIONS = [
  {
    id: 'preferred_service',
    question: 'Preferred Service',
    options: ['Haircut', 'Hair Spa', 'Coloring', 'Scalp Treatment', 'Styling']
  },
  {
    id: 'hair_wash_preference',
    question: 'Prefer hairwash',
    options: ['Before SPA', 'After SPA', 'Both']
  },
  {
    id: 'hairstyle_male',
    question: 'Preferred Hairstyle (Male)',
    options: ['Classic', 'Modern Fade', 'Long Taper', 'Buzz Cut', 'Layered', 'Pompadour', 'Crew Cut'],
    gender: ['male']
  },
  {
    id: 'hairstyle_female',
    question: 'Preferred Hairstyle (Female)',
    options: ['Layered Cut', 'Straight Bob', 'Pixie Cut', 'Beach Waves', 'Wispy Bangs', 'Shag Cut', 'Wolf Cut'],
    gender: ['female']
  },
  {
    id: 'beard_mustache',
    question: 'Preferred Beard/Mustache',
    options: ['Clean Shave', 'Stubble', 'Full Beard', 'Trimmed Mustache', 'Goatee'],
    gender: ['male']
  },
  {
    id: 'water_temp',
    question: 'Water Temperature',
    options: ['Cold', 'Lukewarm', 'Warm']
  },
  {
    id: 'scalp_massage',
    question: 'Scalp Massage Intensity',
    options: ['Soft', 'Medium', 'Strong', 'None']
  },
  {
    id: 'conversation',
    question: 'Conversation Level',
    options: ['Quiet Professional', 'Friendly Chat', 'Social/Engaging']
  }
];

function calculateAge(dob: string) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

type ModalType = 'add-customer' | 'add-stylist' | 'add-service' | 'add-appointment' | 'add-offer' | 'edit';

function CustomSelect({ value, onChange, options, label }: { value: string, onChange: (v: string) => void, options: {value: string, label: string}[], label?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 bg-white border border-black/10 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-deep-grape outline-none focus:ring-2 focus:ring-naturals-purple/20 transition-all cursor-pointer shadow-sm hover:border-naturals-purple/30 min-w-[120px]"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-deep-grape/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 w-full min-w-[160px] bg-white border border-black/5 shadow-2xl rounded-2xl overflow-hidden z-[100]"
            >
              <div className="p-1.5 space-y-0.5">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      value === opt.value 
                        ? 'bg-naturals-purple text-white shadow-md' 
                        : 'text-deep-grape/60 hover:bg-naturals-purple/5 hover:text-naturals-purple'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StaffDashboard() {
  const { isAdmin, isManager, isFranchiseOwner, isStylist, profile } = useAuth();
  
  // Default Tabs based on Role
  const initialTab = isStylist ? 'appointments' : 'stylists';
  const [activeTab, setActiveTab] = useState<'customers' | 'stylists' | 'appointments' | 'services' | 'offers' | 'meetings' | 'skipped'>(initialTab);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add-customer');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [aptFilter, setAptFilter] = useState<{status: string, date: string}>({status: 'all', date: 'all'});
  const [aptSort, setAptSort] = useState<'date_asc' | 'date_desc' | 'client_name'>('date_desc');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    experienceYears: '',
    notes: '',
    franchiseName: '',
    franchiseAddress: '',
    franchiseOwnerId: '',
    serviceName: '',
    serviceDescription: '',
    serviceCategory: '',
    serviceDuration: '',
    servicePrice: '',
    serviceIsActive: true,
    appointmentCustomerId: '',
    appointmentStylistId: '',
    appointmentServiceId: '',
    appointmentDate: '',
    appointmentStartTime: '',
    appointmentEndTime: '',
    appointmentStatus: 'pending',
    offerTitle: '',
    offerDescription: '',
    offerDiscountType: 'percentage',
    offerDiscountValue: '',
    offerExpiryDate: '',
    offerServiceId: '',
    offerIsActive: true,
    preferences: {},
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myStylistId, setMyStylistId] = useState<string | null>(null);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [skippingId, setSkippingId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("");

  const [myFranchiseOwnerId, setMyFranchiseOwnerId] = useState<string | undefined>(undefined);

  // Identify current stylist and franchise owner IDs for filtering
  useEffect(() => {
    if (profile?.id) {
       const resolveIds = async () => {
         if (isStylist) {
           const { data } = await supabase.from('stylists').select('id').eq('user_id', profile.id).single();
           if (data) setMyStylistId(data.id);
         }
         if (isFranchiseOwner) {
           const { data } = await supabase.from('franchise_owners').select('id').eq('user_id', profile.id).single();
           if (data) setMyFranchiseOwnerId(data.id);
         } else if (isManager) {
           const { data } = await supabase.from('admins').select('franchise_owner_id').eq('user_id', profile.id).single();
           if (data?.franchise_owner_id) setMyFranchiseOwnerId(data.franchise_owner_id);
         }
       };
       resolveIds();
    }
  }, [profile, isStylist, isFranchiseOwner, isManager]);

  const { customers: hookCustomers, refresh: fetchCustomers } = useAdminCustomers();
  const { appointments: hookAppointments, refresh: fetchAppointments } = useAdminAppointments();
  
  // For Franchise Owners / Managers
  const { staff, refresh: fetchStaff } = useBranchStaff(myFranchiseOwnerId);
  const { metrics: branchMetrics, refresh: fetchBranchMetrics } = useBranchOverview(myFranchiseOwnerId);
  const { metrics: adminMetrics, refresh: fetchAdminMetrics } = useAdminDashboard();
  const { offers, refetch: fetchOffersData } = useOffers();

  const metrics = isAdmin ? adminMetrics : branchMetrics;


  // Sync hook data to local state for compatibility with existing search/filters
  useEffect(() => { if (hookCustomers) setCustomers(hookCustomers); }, [hookCustomers]);
  useEffect(() => { if (hookAppointments) setAppointments(hookAppointments); }, [hookAppointments]);

  // Use staff data from hook directly to avoid sync issues
  const stylists = staff.stylists || [];

  const fetchStylists = async () => fetchStaff();

  const fetchMeetings = async () => {
    const { data } = await supabase.from('consultation_requests').select('*').order('created_at', { ascending: false });
    if (data) setMeetings(data);
  };

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('category').order('name');
    if (data) setServices(data as unknown as Service[]);
  };

  const updateMeetingStatus = async (id: string, status: string) => {
    let updatePayload: any = { status };
    if (status === 'raised_in_admin_portal') {
      const skippedBy = profile?.full_name || profile?.email || 'Staff';
      const role = isAdmin ? 'Admin' : isFranchiseOwner ? 'Franchise Owner' : isManager ? 'Manager' : 'Staff';
      updatePayload = { status: 'cancelled', notes: `Skipped by ${skippedBy} (${role}) / Raised in Admin Portal` };
    }
    await supabase.from('consultation_requests').update(updatePayload).eq('id', id);
    fetchMeetings();
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const handleSkip = async () => {
    if (!skippingId) return;
    await supabase.from('appointments').update({ 
      status: 'skipped',
      skip_reason: skipReason || "Unspecified"
    }).eq('id', skippingId);
    fetchAppointments();
    setIsSkipModalOpen(false);
    setSkippingId(null);
    setSkipReason("");
    alert('Appointment marked as skipped. Admin will reassign soon.');
  };

  const handleReassign = (appt: any) => {
    handleEdit('appointment' as any, appt);
    // Automatically set status to pending for reassignment
    setFormData(prev => ({ ...prev, appointmentStatus: 'pending' }));
  };

  useEffect(() => {
    fetchCustomers();
    fetchAppointments();
    fetchServices();
    fetchMeetings();
    fetchOffersData();
  }, []);

  const handleOpenModal = (type: ModalType, id?: string) => {
    setModalType(type);
    setEditingId(id || null);
    setFormData({ 
      fullName: '', phone: '', email: '', dateOfBirth: '', gender: '', 
      experienceYears: '', notes: '', 
      franchiseName: '', franchiseAddress: '', franchiseOwnerId: '',
      serviceName: '', serviceDescription: '', serviceCategory: '',
      serviceDuration: '', servicePrice: '', serviceIsActive: true,
      preferences: {}
    });
    setShowModal(true);
  };

  const handleEdit = (type: 'customer' | 'stylist' | 'service' | 'appointment', data: any) => {
    setModalType('edit');
    setEditingId(data.id);
    
    // Format date from YYYY-MM-DD to DD-MM-YYYY for our custom date picker
    let formattedDob = '';
    if (data.date_of_birth) {
      const [y, m, d] = data.date_of_birth.split('-');
      formattedDob = `${d}-${m}-${y}`;
    }

    setFormData({
      fullName: data.full_name || '',
      phone: data.phone || '',
      email: data.email || '',
      dateOfBirth: formattedDob,
      gender: data.gender || '',
      experienceYears: data.experience_years?.toString() || '',
      notes: data.notes || '',
      franchiseName: data.franchise_name || '',
      franchiseAddress: data.branch_address || '',
      franchiseOwnerId: data.franchise_owner_id || '',
      serviceName: data.name || '',
      serviceDescription: data.description || '',
      serviceCategory: data.category || '',
      serviceDuration: data.duration_minutes?.toString() || '',
      servicePrice: data.price?.toString() || '',
      serviceIsActive: data.is_active ?? true,
      appointmentCustomerId: data.customer_id || '',
      appointmentStylistId: data.stylist_id || '',
      appointmentServiceId: data.service_id || '',
      appointmentDate: data.appointment_date || '',
      appointmentStartTime: data.start_time || '',
      appointmentEndTime: data.end_time || '',
      appointmentStatus: data.status || 'pending',
      offerTitle: data.title || '',
      offerDescription: data.description || '',
      offerDiscountType: data.discount_type || 'percentage',
      offerDiscountValue: data.discount_value?.toString() || '',
      offerExpiryDate: data.expiry_date || '',
      offerServiceId: data.service_id || '',
      offerIsActive: data.is_active ?? true,
      preferences: {
        ...(data.ai_hairstyle_analysis?.questionnaire_results || {}),
        image_url: data.image_url || ''
      },
    });
    setShowModal(true);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (modalType === 'add-service' || (modalType === 'edit' && activeTab === 'services')) {
      if (!formData.serviceName) errors.serviceName = "Service name is required";
      if (!formData.servicePrice) errors.servicePrice = "Price is required";
    } else {
      if (!formData.fullName) errors.fullName = "Full Legal Name is required";
      if (!formData.phone) errors.phone = "Phone number is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const ValidationError = ({ field }: { field: string }) => {
    if (!formErrors[field]) return null;
    return (
      <div className="absolute top-full left-4 z-50 mt-1 animate-in zoom-in duration-200">
        <div className="bg-naturals-purple text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_10px_20px_rgba(142,62,150,0.3)] flex items-center gap-1.5 border border-white/20">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          {formErrors[field]}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    let table = '';
    let payload: any = {};

    const formatDate = (dob: string) => {
      if (dob && dob.length === 10) {
        const [d, m, y] = dob.split('-').map(Number);
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
      return null;
    };

    const basePayload: any = {
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email || null,
    };

    if (modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) {
      basePayload.date_of_birth = formatDate(formData.dateOfBirth);
    }


    if (modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) {
      table = 'customers';
      payload = {
        ...basePayload,
        gender: formData.gender || null,
        notes: formData.notes,
        ai_hairstyle_analysis: {
          questionnaire_results: formData.preferences
        },
        hairstyle_preference: formData.preferences.hairstyle_male || formData.preferences.hairstyle_female || null
      };
    } else if (modalType === 'add-stylist' || (modalType === 'edit' && activeTab === 'stylists')) {
      table = 'stylists';
      payload = {
        ...basePayload,
        gender: formData.gender || null,
        experience_years: parseInt(formData.experienceYears) || 0,
      };

    } else if (modalType === 'add-appointment' || (modalType === 'edit' && activeTab === 'appointments')) {
      table = 'appointments';
      payload = {
        customer_id: formData.appointmentCustomerId,
        stylist_id: formData.appointmentStylistId,
        service_id: formData.appointmentServiceId,
        appointment_date: formData.appointmentDate,
        start_time: formData.appointmentStartTime,
        end_time: formData.appointmentEndTime,
        status: formData.appointmentStatus,
      };
    } else if (modalType === 'add-service' || (modalType === 'edit' && activeTab === 'services')) {
      table = 'services';
      payload = {
        name: formData.serviceName,
        description: formData.serviceDescription,
        category: formData.serviceCategory,
        duration_minutes: parseInt(formData.serviceDuration || '60'),
        price: parseFloat(formData.servicePrice || '0'),
        is_active: formData.serviceIsActive,
        image_url: (formData.preferences as any)?.image_url || null,
      };
    } else if (modalType === 'add-offer' || (modalType === 'edit' && activeTab === 'offers')) {
      table = 'offers';
      payload = {
        title: formData.offerTitle,
        description: formData.offerDescription,
        discount_type: formData.offerDiscountType,
        discount_value: parseFloat(formData.offerDiscountValue || '0'),
        expiry_date: formData.offerExpiryDate || null,
        service_id: formData.offerServiceId || null,
        is_active: formData.offerIsActive,
      };
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from(table)
        .update(payload)
        .eq('id', editingId);
      
      if (updateError) {
        alert(`Error updating record: ${updateError.message}`);
      } else {
        // Sync preferences to customer_preferences table if applicable
        if (table === 'customers') {
          const prefPayload: any = {};
          const prefs = formData.preferences;
          
          if (prefs.hair_wash_preference) prefPayload.hairwash_preference = Array.isArray(prefs.hair_wash_preference) ? prefs.hair_wash_preference[0] : prefs.hair_wash_preference;
          if (prefs.water_temp) prefPayload.water_temperature = Array.isArray(prefs.water_temp) ? prefs.water_temp[0] : prefs.water_temp;
          if (prefs.scalp_massage) prefPayload.scalp_massage_intensity = Array.isArray(prefs.scalp_massage) ? prefs.scalp_massage[0] : prefs.scalp_massage;
          if (prefs.conversation) prefPayload.conversation_level = Array.isArray(prefs.conversation) ? prefs.conversation[0] : prefs.conversation;
          
          const style = prefs.hairstyle_male || prefs.hairstyle_female;
          if (style) prefPayload.preferred_hairstyle = Array.isArray(style) ? (style as string[]).join(', ') : style;

          if (Object.keys(prefPayload).length > 0) {
            await supabase.from('customer_preferences').update(prefPayload).eq('customer_id', editingId);
          }
        }

        alert("Updated successfully!");
        if (table === 'customers') fetchCustomers();
        else if (table === 'stylists') fetchStaff();
        else if (table === 'services') fetchServices();
        else if (table === 'appointments') fetchAppointments();
        else if (table === 'offers') fetchOffersData();
        setShowModal(false);
      }
    } else {
      const { data: newData, error } = await supabase.from(table).insert(payload).select().single();
      
      if (error) {
        alert(`Error adding ${modalType.split('-')[1]}: ${error.message}`);
      } else {
        // Sync preferences to customer_preferences table for new customers
        if (table === 'customers' && newData) {
          const prefPayload: any = {};
          const prefs = formData.preferences;
          
          if (prefs.hair_wash_preference) prefPayload.hairwash_preference = Array.isArray(prefs.hair_wash_preference) ? prefs.hair_wash_preference[0] : prefs.hair_wash_preference;
          if (prefs.water_temp) prefPayload.water_temperature = Array.isArray(prefs.water_temp) ? prefs.water_temp[0] : prefs.water_temp;
          if (prefs.scalp_massage) prefPayload.scalp_massage_intensity = Array.isArray(prefs.scalp_massage) ? prefs.scalp_massage[0] : prefs.scalp_massage;
          if (prefs.conversation) prefPayload.conversation_level = Array.isArray(prefs.conversation) ? prefs.conversation[0] : prefs.conversation;
          
          const style = prefs.hairstyle_male || prefs.hairstyle_female;
          if (style) prefPayload.preferred_hairstyle = Array.isArray(style) ? (style as string[]).join(', ') : style;

          if (Object.keys(prefPayload).length > 0) {
            await supabase.from('customer_preferences').update(prefPayload).eq('customer_id', newData.id);
          }
        }

        alert(`${modalType.split('-')[1].replace(/^\w/, c => c.toUpperCase())} added successfully!`);
        if (modalType === 'add-customer') fetchCustomers();
        else if (modalType === 'add-stylist') fetchStaff();
        else if (modalType === 'add-appointment') fetchAppointments();
        else if (modalType === 'add-offer') fetchOffersData();
        setShowModal(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (type: 'customer' | 'stylist' | 'service' | 'appointment', id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const tableMap: Record<string, string> = { 
      customer: 'customers', 
      stylist: 'stylists', 
      service: 'services',
      appointment: 'appointments',
      offer: 'offers'
    };
    const table = tableMap[type];
    await supabase.from(table).delete().eq('id', id);
    if (type === 'customer') fetchCustomers();
    else if (type === 'stylist') fetchStaff();
    else if (type === 'service') fetchServices();
    else if (type === 'appointment') fetchAppointments();
    else if (type === 'offer') fetchOffersData();
  };



  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  const filteredStylists = stylists.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Stylist Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-48 rounded-[2.5rem] relative overflow-hidden shadow-2xl mb-8 group"
      >
        <div 
          className="absolute inset-0 z-0 transition-transform duration-1000"
          style={{ 
            backgroundImage: 'url(/banner.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-grape/90 via-deep-grape/40 to-transparent z-1" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 z-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                 <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
                 {isFranchiseOwner ? "Franchise Oversight" : (isAdmin ? "Management Center" : (isManager ? "Branch Operations" : "Specialist Terminal"))}
              </span>
           </div>
           <h2 className="text-4xl font-black text-white italic tracking-tight drop-shadow-lg">
             {isFranchiseOwner ? "Executive Portal" : (isAdmin ? "Central Command" : (isManager ? "Operations Hub" : "Stylist Workspace"))}
           </h2>
           <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-2">
              Authorized {isFranchiseOwner ? "Franchise Owner" : (isAdmin ? "Administrator" : (isManager ? "Manager" : "Stylist"))} Access Only
           </p>
        </div>
      </motion.div>

      {/* Pending Meetings Alert */}
      {meetings.filter(m => m.status === 'pending').length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-naturals-purple rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-naturals-purple/20 border border-white/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Urgent Protocol</p>
              <h3 className="text-xl font-black italic tracking-tight">You have {meetings.filter(m => m.status === 'pending').length} pending meeting requests</h3>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('meetings')}
            className="px-6 py-3 bg-white text-naturals-purple rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-lavender transition-all shadow-lg"
          >
            Review Requests
          </button>
        </motion.div>
      )}

      {/* Metrics Dashboard for Management Roles */}
      {(isAdmin || isFranchiseOwner || isManager) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
              <Users className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.3em] mb-1">{isAdmin ? "Network" : "Branch"} Base</p>
              <h4 className="text-3xl font-black text-deep-grape italic tracking-tighter tabular-nums">
                {isAdmin ? (metrics as any).customers : (metrics as any).stylists}
              </h4>
              <p className="text-[8px] font-bold text-naturals-purple uppercase tracking-widest mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-naturals-purple rounded-full" /> {isAdmin ? "Registered Customers" : "Active Specialists"}
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
              <Calendar className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-deep-grape/30 uppercase tracking-[0.3em] mb-1">Operational Flow</p>
              <h4 className="text-3xl font-black text-deep-grape italic tracking-tighter tabular-nums">
                {metrics.appointments}
              </h4>
              <p className="text-[8px] font-bold text-naturals-purple uppercase tracking-widest mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-naturals-purple rounded-full" /> Active Appointments
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-deep-grape text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
              <Sparkles className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Revenue Stream</p>
              <h4 className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
                ₹{metrics.revenue.toLocaleString()}
              </h4>
              <p className="text-[8px] font-bold text-lavender uppercase tracking-widest mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-lavender rounded-full" /> Performance Value
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          {/* Keep original titles for structure but make them subtle since banner is above */}
          <h2 className="text-xl font-black text-deep-grape italic tracking-tight opacity-0 h-0 overflow-hidden">
            Dashboard
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {(isAdmin || isManager || isFranchiseOwner) && (
            <button
              onClick={() => handleOpenModal('add-customer')}
              className="px-4 py-2.5 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" /> Customer
            </button>
          )}
          {(isAdmin || isManager || isFranchiseOwner) && (
            <button
              onClick={() => handleOpenModal('add-stylist')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Scissors className="w-3.5 h-3.5" /> Stylist
            </button>
          )}
          {(isAdmin || isFranchiseOwner) && (
            <button
              onClick={() => handleOpenModal('add-offer')}
              className="px-4 py-2.5 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" /> Add Offer
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-warm-grey/50 border border-black/5 shadow-inner">
        {(['customers', 'stylists', 'appointments', 'services', 'offers', 'meetings', 'skipped'] as const)
          .filter(tab => {
            if (isAdmin) return true;
            if (isFranchiseOwner) return ['customers', 'stylists', 'appointments', 'services', 'offers', 'meetings', 'skipped'].includes(tab);
            if (isManager) return ['customers', 'stylists', 'appointments', 'offers', 'meetings', 'skipped'].includes(tab);
            if (isStylist) return ['customers', 'appointments', 'meetings', 'skipped'].includes(tab);
            return false;
          })
          .map((tab) => {
            const skippedCount = appointments.filter(a => a.status === 'skipped').length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'bg-white text-deep-grape shadow-md' : 'text-deep-grape/40 hover:text-deep-grape'
                }`}
              >
                {tab === 'meetings' ? 'Meeting Requests' : tab}
                {tab === 'skipped' && skippedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white shadow-lg shadow-red-500/20 animate-pulse">
                    {skippedCount}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-grape/40" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-naturals-purple/10 rounded-2xl py-3 pl-12 pr-4 text-deep-grape text-sm font-bold placeholder:text-deep-grape/30 focus:outline-none focus:border-naturals-purple transition-all"
        />
      </div>

      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic">Customer List</h3>
            {(isAdmin || isManager || isFranchiseOwner) && (
              <button
                onClick={() => handleOpenModal('add-customer')}
                className="px-4 py-2 bg-naturals-purple text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-naturals-purple/20"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Customer
              </button>
            )}
          </div>
          <div className="glass-card bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-warm-grey/50">
                    <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Code</th>
                    <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Name</th>
                    <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Phone</th>
                    <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-t border-black/5 hover:bg-warm-grey/20">
                      <td className="p-3 font-bold text-xs">{customer.customer_code || '---'}</td>
                      <td className="p-3 font-bold text-sm text-naturals-purple">{customer.full_name}</td>
                      <td className="p-3 text-sm font-medium">{customer.phone}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit('customer', customer)}
                            className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group"
                          >
                            <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                          </button>
                          <button 
                            onClick={() => handleDelete('customer', customer.id)} 
                            className="p-2 hover:bg-red-50 rounded-xl transition-all group"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stylists' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic">Stylist List</h3>
            {(isAdmin || isManager || isFranchiseOwner) && (
              <button
                onClick={() => handleOpenModal('add-stylist')}
                className="px-4 py-2 bg-deep-grape text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-deep-grape/20"
              >
                <UserPlus className="w-3.5 h-3.5" /> Add Stylist
              </button>
            )}
          </div>
          <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr_auto] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Stylist</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Expertise</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Actions</span>
          </div>
          <div className="divide-y divide-black/5">
            {filteredStylists.map((stylist) => (
              <div key={stylist.id} className="grid grid-cols-[1fr_2fr_auto] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="font-bold text-sm text-deep-grape">{stylist.full_name}</p>
                  <p className="text-[10px] text-deep-grape/40 font-bold mt-0.5">{stylist.phone}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-naturals-purple/5 text-naturals-purple rounded-md text-[9px] font-black uppercase tracking-wide">{stylist.experience_years ?? 0} yrs exp</span>
                  {stylist.gender && <span className="px-2 py-0.5 bg-warm-grey text-deep-grape/60 rounded-md text-[9px] font-black uppercase tracking-wide">{stylist.gender}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit('stylist', stylist)}
                    className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group"
                  >
                    <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                  </button>
                  <button 
                    onClick={() => handleDelete('stylist', stylist.id)} 
                    className="p-2 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}


      {activeTab === 'appointments' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="p-4 bg-warm-grey/20 border-b border-black/5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <CustomSelect 
                value={aptFilter.status}
                onChange={v => setAptFilter({...aptFilter, status: v})}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'completed', label: 'Completed' }
                ]}
              />

              <CustomSelect 
                value={aptFilter.date}
                onChange={v => setAptFilter({...aptFilter, date: v})}
                options={[
                  { value: 'all', label: 'Any Date' },
                  { value: 'today', label: 'Today' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'past', label: 'Past' }
                ]}
              />
            </div>
            
            <button
                onClick={() => handleOpenModal('add-appointment')}
                className="px-4 py-2 bg-deep-grape text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-deep-grape/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Appointment
              </button>

            <div className="flex items-center gap-3">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-deep-grape/30">Sort By</span>
              <CustomSelect 
                value={aptSort}
                onChange={v => setAptSort(v as any)}
                options={[
                  { value: 'date_desc', label: 'Newest First' },
                  { value: 'date_asc', label: 'Oldest First' },
                  { value: 'client_name', label: 'Client Name' }
                ]}
              />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Date & Slot</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Client</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Stylist</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Service</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
          </div>
          <div className="divide-y divide-black/5">
            {appointments
              .filter((a: any) => {
                if (isAdmin || isFranchiseOwner || isManager) return true;
                return (a as any).stylist_id === myStylistId;
              })
              .filter((a: any) => {
                const search = searchQuery.toLowerCase();
                return (a as any).customer?.full_name?.toLowerCase().includes(search) || 
                       (a as any).service?.name?.toLowerCase().includes(search) ||
                       (a as any).stylist?.full_name?.toLowerCase().includes(search);
              })
              .filter((a: any) => {
                if (aptFilter.status !== 'all' && a.status.toLowerCase() !== aptFilter.status) return false;
                
                if (aptFilter.date !== 'all') {
                  const aptDate = new Date(a.appointment_date);
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  aptDate.setHours(0,0,0,0);
                  
                  if (aptFilter.date === 'today' && aptDate.getTime() !== today.getTime()) return false;
                  if (aptFilter.date === 'upcoming' && aptDate.getTime() <= today.getTime()) return false;
                  if (aptFilter.date === 'past' && aptDate.getTime() >= today.getTime()) return false;
                }
                return true;
              })
              .sort((a: any, b: any) => {
                if (aptSort === 'client_name') {
                  return (a.customer?.full_name || '').localeCompare(b.customer?.full_name || '');
                }
                const dateA = new Date(`${a.appointment_date}T${a.start_time}`).getTime();
                const dateB = new Date(`${b.appointment_date}T${b.start_time}`).getTime();
                return aptSort === 'date_asc' ? dateA - dateB : dateB - dateA;
              })
              .map((a: any) => (
              <div key={a.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="font-bold text-xs text-deep-grape">{new Date(a.appointment_date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-naturals-purple font-black">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="font-bold text-xs text-deep-grape">{a.customer?.full_name || 'Guest Client'}</p>
                  <p className="text-[9px] text-deep-grape/40 font-bold">{a.customer?.phone || 'No Phone'}</p>
                </div>
                <p className="text-[10px] font-black italic text-deep-grape/60">{a.stylist?.full_name}</p>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-naturals-purple">{a.service?.name || 'Custom Service'}</p>
                  {a.notes && <p className="text-[8px] text-deep-grape/40 font-bold uppercase mt-1 max-w-[120px] truncate">{a.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                    a.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' : 
                    a.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    a.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                    a.status === 'completed' ? 'bg-naturals-purple/5 text-naturals-purple border-naturals-purple/20' :
                    a.status === 'skipped' ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' :
                    'bg-warm-grey text-deep-grape/40 border-black/5'
                  }`}>
                    {a.status}
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    {isStylist && a.status === 'confirmed' && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEdit('appointment' as any, a)}
                          className="px-3 py-1.5 bg-naturals-purple/10 text-naturals-purple text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-naturals-purple hover:text-white transition-all border border-naturals-purple/20"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => {
                            setSkippingId(a.id);
                            setIsSkipModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                        >
                          Skip & Query
                        </button>
                      </div>
                    )}
                    {isAdmin && a.status === 'skipped' && (
                      <button 
                        onClick={() => handleReassign(a)}
                        className="px-3 py-1.5 bg-naturals-purple text-white text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-deep-grape transition-all shadow-lg shadow-naturals-purple/20"
                      >
                        Reassign
                      </button>
                    )}
                    <button onClick={() => handleEdit('appointment' as any, a)} className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group">
                      <Edit className="w-3.5 h-3.5 text-naturals-purple/60 group-hover:text-naturals-purple" />
                    </button>
                    <button onClick={() => handleDelete('appointment', a.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all group">
                      <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
               <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No active deployments found</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic">Active Promotions</h3>
            {(isAdmin || isFranchiseOwner) && (
              <button
                onClick={() => handleOpenModal('add-offer')}
                className="px-4 py-2 bg-green-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
              >
                <Zap className="w-3.5 h-3.5" /> New Offer
              </button>
            )}
          </div>
          <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Promotion</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Discount</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Expiry</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50 text-right">Actions</span>
            </div>
            <div className="divide-y divide-black/5">
              {offers
                .filter(o => {
                  const search = searchQuery.toLowerCase();
                  return o.title.toLowerCase().includes(search) || 
                         o.description?.toLowerCase().includes(search);
                })
                .map((o) => (
                <div key={o.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-deep-grape">{o.title}</p>
                    <p className="text-[9px] text-deep-grape/40 font-bold uppercase truncate max-w-[200px]">{o.description || 'No description'}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-naturals-purple italic">{o.discount_type === 'percentage' ? `${o.discount_value}% OFF` : `₹${o.discount_value} OFF`}</p>
                    <p className="text-[8px] font-bold text-deep-grape/30 uppercase">{(o as any).service?.name || 'All Services'}</p>
                  </div>
                  <p className="text-[10px] font-black text-deep-grape/60">{o.valid_until ? new Date(o.valid_until).toLocaleDateString() : 'Never'}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${o.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">
                      {o.is_active ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-1">
                    {(isAdmin || isFranchiseOwner) && (
                      <>
                        <button onClick={() => handleEdit('offer' as any, o)} className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group">
                          <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                        </button>
                        <button onClick={() => handleDelete('offer' as any, o.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all group">
                          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {offers.length === 0 && (
                 <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No active promotions in catalog</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic">Global Service Registry</h3>
            {(isAdmin || isFranchiseOwner) && (
              <button
                onClick={() => handleOpenModal('add-service')}
                className="px-4 py-2 bg-naturals-purple text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-naturals-purple/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> Add Service
              </button>
            )}
          </div>
          <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_100px_100px_120px_100px] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Service Name</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Category</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Duration</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Price</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50 text-right">Actions</span>
            </div>
            <div className="divide-y divide-black/5">
              {services
                .filter(s => {
                  const search = searchQuery.toLowerCase();
                  return s.name.toLowerCase().includes(search) || 
                         s.category?.toLowerCase().includes(search);
                })
                .map((s) => (
                <div key={s.id} className="grid grid-cols-[1.5fr_1fr_100px_100px_120px_100px] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-deep-grape">{s.name}</p>
                    <p className="text-[9px] text-deep-grape/40 font-bold uppercase truncate max-w-[200px]">{s.description || 'No description'}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-naturals-purple/5 text-naturals-purple rounded-md text-[9px] font-black uppercase tracking-wide w-fit">
                    {s.category || 'General'}
                  </span>
                  <p className="text-[10px] font-black text-deep-grape/60">{s.duration_minutes} MIN</p>
                  <p className="text-[10px] font-black text-naturals-purple italic">₹{s.price}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-deep-grape/40">
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-1">
                    {(isAdmin || isFranchiseOwner) && (
                      <>
                        <button onClick={() => handleEdit('service', s)} className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group">
                          <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                        </button>
                        <button onClick={() => handleDelete('service', s.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all group">
                          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                 <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No services available in registry</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_auto] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Requested Service</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Customer</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Requested On</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Action</span>
          </div>
          <div className="divide-y divide-black/5">
            {meetings
              .filter(c => {
                const search = searchQuery.toLowerCase();
                return c.customer_name?.toLowerCase()?.includes(search) || 
                       c.service_name?.toLowerCase()?.includes(search) ||
                       c.email?.toLowerCase()?.includes(search) ||
                       c.phone?.includes(search);
              })
              .map((c) => (
              <div key={c.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-naturals-purple">{c.service_name}</p>
                  <p className="text-[8px] text-deep-grape/40 font-bold uppercase mt-1">{c.notes || 'No extra notes'}</p>
                </div>
                <div>
                  <p className="font-bold text-xs text-deep-grape">{c.customer_name}</p>
                  <p className="text-[9px] text-deep-grape/40 font-bold">{c.email}</p>
                  <p className="text-[9px] text-naturals-purple font-black">{c.phone}</p>
                </div>
                <p className="text-[10px] font-bold text-deep-grape/60">{new Date(c.created_at).toLocaleDateString()}</p>
                <div>
                  <select 
                    value={c.status}
                    onChange={(e) => updateMeetingStatus(c.id, e.target.value)}
                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                      c.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      c.status === 'contacted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      c.status === 'scheduled' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      c.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' :
                      c.status === 'cancelled' || c.status === 'raised_in_admin_portal' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Escalated / Skipped</option>
                  </select>
                </div>
                <div className="flex justify-end h-8">
                   {requestToDelete === c.id ? (
                     <div className="flex gap-2 items-center animate-in fade-in duration-200">
                       <span className="text-[9px] font-bold text-red-500 uppercase">Skip?</span>
                       <button onClick={() => setRequestToDelete(null)} className="px-2 py-1 bg-warm-grey text-deep-grape rounded-md text-[8px] font-black uppercase hover:bg-black/10 transition-colors">No</button>
                       <button 
                         onClick={async () => {
                           await updateMeetingStatus(c.id, 'raised_in_admin_portal');
                           setRequestToDelete(null);
                         }} 
                         className="px-2 py-1 bg-red-500 text-white rounded-md text-[8px] font-black uppercase hover:bg-red-600 transition-colors shadow-sm"
                       >Yes</button>
                     </div>
                   ) : (
                     <button 
                       onClick={() => setRequestToDelete(c.id)}
                       className="p-2 hover:bg-red-50 rounded-xl transition-all group"
                     >
                       <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                     </button>
                   )}
                </div>
                </div>
            ))}
            {meetings.length === 0 && (
               <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No meeting requests found</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skipped' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Requested Service</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Customer</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Date Skipped</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Skipped By</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
          </div>
          <div className="divide-y divide-black/5">
            {meetings
              .filter(c => c.status === 'cancelled' || c.notes?.includes('Skipped'))
              .filter(c => {
                const search = searchQuery.toLowerCase();
                return c.customer_name?.toLowerCase()?.includes(search) || 
                       c.service_name?.toLowerCase()?.includes(search);
              })
              .map((c) => (
              <div key={c.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{c.service_name}</p>
                </div>
                <div>
                  <p className="font-bold text-xs text-deep-grape">{c.customer_name}</p>
                  <p className="text-[9px] text-deep-grape/40 font-bold">{c.email}</p>
                </div>
                <p className="text-[10px] font-bold text-deep-grape/60">{new Date(c.created_at).toLocaleDateString()}</p>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-deep-grape">{c.notes?.split(' / ')[0]?.replace('Skipped by ', '') || 'Unknown'}</p>
                  <p className="text-[8px] text-deep-grape/40 font-bold uppercase mt-1">Admin Portal</p>
                </div>
                <div>
                  <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Raised in Admin
                  </span>
                </div>
              </div>
            ))}
            {meetings.filter(c => c.status === 'cancelled' || c.notes?.includes('Skipped')).length === 0 && (
               <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No skipped appointments found</div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-deep-grape/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-black/5 max-h-[90vh] flex flex-col pl-4 pr-2 py-4">
            <div className="flex-1 overflow-y-auto pr-6 pl-6 py-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-deep-grape italic tracking-tight">
                {editingId ? `Update ${modalType === 'edit' ? 'Profile' : modalType.split('-')[1].toUpperCase()}` : modalType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-warm-grey rounded-2xl transition-all">
                <X className="w-6 h-6 text-deep-grape/40" />
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {(modalType === 'add-service' || (modalType === 'edit' && activeTab === 'services')) ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Service Name</label>
                    <input
                      type="text"
                      value={formData.serviceName}
                      onChange={(e) => {
                        setFormData({ ...formData, serviceName: e.target.value });
                        if (formErrors.serviceName) setFormErrors({ ...formErrors, serviceName: '' });
                      }}
                      className={`w-full bg-warm-grey/40 border rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                        formErrors.serviceName ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                      }`}
                    />
                    <ValidationError field="serviceName" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Description</label>
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. FACE, HAIR"
                        value={formData.serviceCategory}
                        onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Duration (Min)</label>
                      <input
                        type="number"
                        value={formData.serviceDuration}
                        onChange={(e) => setFormData({ ...formData, serviceDuration: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.servicePrice}
                        onChange={(e) => {
                          setFormData({ ...formData, servicePrice: e.target.value });
                          if (formErrors.servicePrice) setFormErrors({ ...formErrors, servicePrice: '' });
                        }}
                        className={`w-full bg-warm-grey/40 border rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                          formErrors.servicePrice ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                        }`}
                      />
                      <ValidationError field="servicePrice" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Active Status</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceIsActive: !formData.serviceIsActive })}
                        className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                          formData.serviceIsActive 
                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-warm-grey border-black/5 text-deep-grape/40'
                        }`}
                      >
                        {formData.serviceIsActive ? 'ACTIVE' : 'HIDDEN'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Image URL</label>
                    <input
                      type="text"
                      placeholder="/Services/filename.png"
                      value={formData.preferences?.image_url || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preferences: { ...formData.preferences, image_url: e.target.value } 
                      })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    />
                  </div>
                </div>
              ) : (modalType === 'add-offer' || (modalType === 'edit' && activeTab === 'offers')) ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Offer Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Sparkle 20% OFF"
                      value={formData.offerTitle}
                      onChange={(e) => setFormData({ ...formData, offerTitle: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Offer Description</label>
                    <textarea
                      value={formData.offerDescription}
                      onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Discount Type</label>
                      <select
                        value={formData.offerDiscountType}
                        onChange={(e) => setFormData({ ...formData, offerDiscountType: e.target.value as any })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Value</label>
                      <input
                        type="number"
                        value={formData.offerDiscountValue}
                        onChange={(e) => setFormData({ ...formData, offerDiscountValue: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Expiry Date</label>
                      <input
                        type="date"
                        value={formData.offerExpiryDate}
                        onChange={(e) => setFormData({ ...formData, offerExpiryDate: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Active Status</label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, offerIsActive: !formData.offerIsActive })}
                        className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                          formData.offerIsActive 
                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-warm-grey border-black/5 text-deep-grape/40'
                        }`}
                      >
                        {formData.offerIsActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Specific Service (Optional)</label>
                    <select
                      value={formData.offerServiceId}
                      onChange={(e) => setFormData({ ...formData, offerServiceId: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    >
                      <option value="">All Services</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                {(modalType !== 'add-appointment' || isNewCustomer) && (
                  <>
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Full Legal Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                        }}
                        className={`w-full bg-warm-grey/40 border rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                           formErrors.fullName ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                        }`}
                      />
                      <ValidationError field="fullName" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 relative">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({ ...formData, phone: e.target.value });
                              if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                            }}
                            className={`w-full bg-warm-grey/40 border rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                              formErrors.phone ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                            }`}
                          />
                          <ValidationError field="phone" />
                        </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {(modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) && (
                    <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Date of Birth</label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="DD-MM-YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 8) val = val.slice(0, 8);
                          // Auto formatting DD-MM-YYYY
                          if (val.length > 4) val = val.slice(0, 2) + '-' + val.slice(2, 4) + '-' + val.slice(4);
                          else if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2);
                          setFormData({ ...formData, dateOfBirth: val });
                        }}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 pl-6 pr-12 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-naturals-purple z-10">
                        <button 
                          type="button"
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                          className="p-1 hover:bg-naturals-purple/10 rounded-lg transition-all"
                        >
                          <Calendar className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>

                      {isDatePickerOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-white border border-naturals-purple/20 rounded-[2rem] shadow-2xl z-[150] animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-naturals-purple uppercase tracking-widest">Select Birth Date</span>
                            <button onClick={() => setIsDatePickerOpen(false)} className="text-deep-grape/40 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-deep-grape/40 ml-1">Year</label>
                              <div className="relative group/sel">
                                <select 
                                  className="w-full bg-warm-grey/50 border border-naturals-purple/10 rounded-xl py-2.5 px-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-naturals-purple focus:bg-white transition-all appearance-none cursor-pointer"
                                  onChange={(e) => {
                                    const [d, m] = (formData.dateOfBirth.split('-').length === 3 ? formData.dateOfBirth.split('-') : ['01', '01']);
                                    setFormData({ ...formData, dateOfBirth: `${d}-${m}-${e.target.value}` });
                                  }}
                                  value={formData.dateOfBirth.split('-')[2] || '2000'}
                                >
                                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-naturals-purple/40 group-hover/sel:text-naturals-purple transition-colors">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] font-black uppercase text-deep-grape/40 ml-1">Month</label>
                              <div className="relative group/sel">
                                <select 
                                  className="w-full bg-warm-grey/50 border border-naturals-purple/10 rounded-xl py-2.5 px-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-naturals-purple focus:bg-white transition-all appearance-none cursor-pointer"
                                  onChange={(e) => {
                                    const parts = formData.dateOfBirth.split('-');
                                    const d = parts[0] || '01';
                                    const y = parts[2] || '2000';
                                    setFormData({ ...formData, dateOfBirth: `${d}-${e.target.value}-${y}` });
                                  }}
                                  value={formData.dateOfBirth.split('-')[1] || '01'}
                                >
                                  {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                                    <option key={m} value={m}>{new Date(2000, parseInt(m)-1).toLocaleString('default', { month: 'long' })}</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-naturals-purple/40 group-hover/sel:text-naturals-purple transition-colors">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-7 gap-1">
                            {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const parts = formData.dateOfBirth.split('-');
                                  const m = parts[1] || '01';
                                  const y = parts[2] || '2000';
                                  setFormData({ ...formData, dateOfBirth: `${day}-${m}-${y}` });
                                  setIsDatePickerOpen(false);
                                }}
                                className={`aspect-square flex items-center justify-center text-[10px] font-black rounded-lg transition-all ${
                                  formData.dateOfBirth.startsWith(day) 
                                    ? 'bg-naturals-purple text-white shadow-lg' 
                                    : 'hover:bg-naturals-purple/10 text-deep-grape/60'
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formData.dateOfBirth.length === 10 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-naturals-purple text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                          Age: {(() => {
                            const [d, m, y] = formData.dateOfBirth.split('-').map(Number);
                            if (!d || !m || !y || y < 1900) return '---';
                            const birthDate = new Date(y, m - 1, d);
                            const today = new Date();
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const monthDiff = today.getMonth() - birthDate.getMonth();
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
                            return age;
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                  )}
                  {(modalType === 'add-customer' || modalType === 'add-stylist' || (modalType === 'edit' && (activeTab === 'customers' || activeTab === 'stylists'))) && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Gender</label>
                      <div className="flex bg-warm-grey/40 rounded-2xl p-1 border border-naturals-purple/20">
                        {['male', 'female', 'other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g })}
                            className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${
                              formData.gender === g ? 'bg-naturals-purple text-white shadow-md' : 'text-deep-grape/40'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {(modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) && (
                  <div className="space-y-6 pt-4 border-t border-black/5">
                    <h4 className="text-xs font-black text-naturals-purple uppercase tracking-[0.2em]">Service Details</h4>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {PREDEFINED_QUESTIONS.filter(q => !q.gender || q.gender.includes(formData.gender)).map((q) => (
                        <div key={q.id} className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-wider text-deep-grape/60 ml-1 italic">{q.question}</label>
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt) => {
                              const currentSelections = (Array.isArray(formData.preferences[q.id]) 
                                ? formData.preferences[q.id] 
                                : (formData.preferences[q.id] ? [formData.preferences[q.id]] : [])) as string[];
                              const isSelected = currentSelections.includes(opt);

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setFormData({
                                        ...formData,
                                        preferences: { 
                                          ...formData.preferences, 
                                          [q.id]: currentSelections.filter((item: string) => item !== opt) 
                                        }
                                      });
                                    } else {
                                      setFormData({
                                        ...formData,
                                        preferences: { 
                                          ...formData.preferences, 
                                          [q.id]: [...currentSelections, opt] 
                                        }
                                      });
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                    isSelected 
                                      ? 'bg-naturals-purple border-naturals-purple text-white shadow-lg' 
                                      : 'border-warm-grey text-deep-grape/40 hover:border-naturals-purple/20'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Extra Notes</label>
                      <textarea
                        placeholder="Special instructions, product allergies, or styling notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                )}

                {(modalType === 'add-stylist' || (modalType === 'edit' && activeTab === 'stylists')) && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Experience Years</label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                {(modalType === 'add-appointment' || (modalType === 'edit' && activeTab === 'appointments')) && (
                  <div className="space-y-4 pt-2">
                    {!editingId && (
                      <div className="flex gap-3 p-1 bg-warm-grey/20 rounded-[1.5rem] border border-black/5 mb-4">
                        <button
                          type="button"
                          onClick={() => setIsNewCustomer(false)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            !isNewCustomer ? 'bg-white text-naturals-purple shadow-lg scale-[1.02]' : 'text-deep-grape/40 hover:text-deep-grape/60'
                          }`}
                        >
                          Existing Customer
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsNewCustomer(true)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            isNewCustomer ? 'bg-white text-naturals-purple shadow-lg scale-[1.02]' : 'text-deep-grape/40 hover:text-deep-grape/60'
                          }`}
                        >
                          New Customer
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {!isNewCustomer && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Customer</label>
                          <select
                            value={formData.appointmentCustomerId || ''}
                            onChange={(e) => setFormData({ ...formData, appointmentCustomerId: e.target.value })}
                            className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                          >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                              <option key={c.id} value={c.id}>{c.full_name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className={`space-y-1 ${isNewCustomer ? 'col-span-2' : ''}`}>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Stylist</label>
                        <select
                          value={formData.appointmentStylistId || ''}
                          onChange={(e) => setFormData({ ...formData, appointmentStylistId: e.target.value })}
                          className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                        >
                          <option value="">Select Stylist</option>
                          {stylists.map(s => (
                            <option key={s.id} value={s.id}>{s.full_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Service</label>
                      <select
                        value={formData.appointmentServiceId || ''}
                        onChange={(e) => setFormData({ ...formData, appointmentServiceId: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      >
                        <option value="">Select Service</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - ₹{s.price}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Date</label>
                        <input
                          type="date"
                          value={formData.appointmentDate || ''}
                          onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                          className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Start</label>
                        <input
                          type="time"
                          value={formData.appointmentStartTime || ''}
                          onChange={(e) => setFormData({ ...formData, appointmentStartTime: e.target.value })}
                          className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">End</label>
                        <input
                          type="time"
                          value={formData.appointmentEndTime || ''}
                          onChange={(e) => setFormData({ ...formData, appointmentEndTime: e.target.value })}
                          className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Status</label>
                      <select
                        value={formData.appointmentStatus}
                        onChange={(e) => setFormData({ ...formData, appointmentStatus: e.target.value })}
                        className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="skipped">Skipped</option>
                      </select>
                    </div>
                  </div>
                )}
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 bg-deep-grape text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl hover:bg-naturals-purple transition-all mt-6 flex items-center justify-center gap-3 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  editingId ? 'UPDATE PROFILE' : `INITIALIZE ${modalType.includes('-') ? modalType.split('-')[1].toUpperCase() : modalType.toUpperCase()}`
                )}
              </button>
            </form>
            </div>
          </div>
        </div>
      )}
      {/* Skip Reason Modal */}
      {isSkipModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-deep-grape/40 backdrop-blur-md" onClick={() => setIsSkipModalOpen(false)} />
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-black/5 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-deep-grape italic tracking-tighter mb-2">Skip Appointment?</h3>
            <p className="text-deep-grape/40 font-black uppercase text-[10px] tracking-[0.2em] mb-6">Provide a reason for the admin.</p>
            
            <div className="space-y-2 mb-8">
              {["Emergency", "Equipment Failure", "Product Out of Stock", "Stylist Unavailable", "Other"].map(reason => (
                <button
                  key={reason}
                  onClick={() => setSkipReason(reason)}
                  className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    skipReason === reason 
                      ? "bg-rose-500 text-white border-rose-500" 
                      : "bg-warm-grey/50 text-deep-grape/40 border-black/5"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsSkipModalOpen(false)}
                className="flex-1 py-4 border-2 border-black/5 text-deep-grape font-black text-[10px] uppercase tracking-widest rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleSkip}
                className="flex-1 py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-rose-500/20"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}