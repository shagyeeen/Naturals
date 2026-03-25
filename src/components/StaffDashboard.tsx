'use client';

import { useState, useEffect } from "react";
import { supabase, Customer, Stylist, Manager, FranchiseOwner, Appointment } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { UserPlus, Search, Edit, Trash2, Eye, X, Briefcase, Users, UserCheck, Scissors, Calendar } from "lucide-react";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  experienceYears: string;
  specializations: string;
  notes: string;
  franchiseName?: string;
  franchiseAddress?: string;
  franchiseOwnerId: string;
  preferences: { [key: string]: string | string[] };
  profilePhotoUrl?: string;
  profilePhotoFile?: File | null;
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

type ModalType = 'add-customer' | 'add-stylist' | 'add-manager' | 'add-franchise' | 'edit';

export default function StaffDashboard() {
  const { isAdmin, isManager, isFranchiseOwner, isStylist, profile } = useAuth();
  
  // Default Tabs based on Role
  const initialTab = isStylist ? 'appointments' : 'stylists';
  const [activeTab, setActiveTab] = useState<'customers' | 'stylists' | 'managers' | 'franchise' | 'appointments'>(initialTab);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [franchiseOwners, setFranchiseOwners] = useState<FranchiseOwner[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [branchAssign, setBranchAssign] = useState<{id: string, table: string, current: string} | null>(null);
  const [branchInput, setBranchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add-customer');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    experienceYears: '',
    specializations: '',
    notes: '',
    franchiseName: '',
    franchiseAddress: '',
    franchiseOwnerId: '',
    preferences: {},
    profilePhotoUrl: '',
    profilePhotoFile: null
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myStylistId, setMyStylistId] = useState<string | null>(null);

  // Identify current stylist ID for filtering
  useEffect(() => {
    if (isStylist && profile?.id) {
       const getStatus = async () => {
         const { data } = await supabase.from('stylists').select('id').eq('user_id', profile.id).single();
         if (data) setMyStylistId(data.id);
       };
       getStatus();
    }
  }, [isStylist, profile]);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setCustomers(data);
  };

  const fetchStylists = async () => {
    const { data } = await supabase.from('stylists').select('*').order('full_name');
    if (data) setStylists(data);
  };

  const fetchManagers = async () => {
    const { data } = await supabase.from('managers').select('*').order('full_name');
    if (data) setManagers(data);
  }

  const fetchFranchiseOwners = async () => {
    const { data } = await supabase.from('franchise_owners').select('*').order('full_name');
    if (data) setFranchiseOwners(data as unknown as FranchiseOwner[]);
  }

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, customer:customers(*), stylist:stylists(*), service:services(*)')
      .order('appointment_date', { ascending: false });
    if (data) setAppointments(data as any);
  };

  useEffect(() => {
    fetchCustomers();
    fetchAppointments();
    fetchStylists();
    fetchManagers();
    fetchFranchiseOwners();
  }, []);

  const handleOpenModal = (type: ModalType, id?: string) => {
    setModalType(type);
    setEditingId(id || null);
    setFormData({ 
      fullName: '', phone: '', email: '', dateOfBirth: '', gender: '', 
      experienceYears: '', specializations: '', notes: '', 
      franchiseName: '', franchiseAddress: '', franchiseOwnerId: '', preferences: {}
    });
    setShowModal(true);
  };

  const handleEdit = (type: 'customer' | 'stylist' | 'manager' | 'franchise', data: any) => {
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
      specializations: data.specializations?.join(', ') || '',
      notes: data.notes || '',
      franchiseName: data.franchise_name || '',
      franchiseAddress: data.franchise_address || '',
      franchiseOwnerId: data.franchise_owner_id || '',
      preferences: data.ai_hairstyle_analysis?.questionnaire_results || {},
      profilePhotoUrl: data.profile_photo_url || '',
      profilePhotoFile: null
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        profilePhotoFile: file,
        profilePhotoUrl: URL.createObjectURL(file)
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName) errors.fullName = "Full Legal Name is required";
    if (!formData.phone) errors.phone = "Phone number is required";
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
    let profileUrl = formData.profilePhotoUrl;

    // Handle Image Upload
    if (formData.profilePhotoFile) {
      const fileExt = formData.profilePhotoFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, formData.profilePhotoFile);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        profileUrl = publicUrl;
      }
    }


    const formatDate = (dob: string) => {
      if (dob && dob.length === 10) {
        const [d, m, y] = dob.split('-').map(Number);
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
      return null;
    };

    const basePayload = {
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email || null,
      date_of_birth: formatDate(formData.dateOfBirth),
    };



    if (modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) {
      table = 'customers';
      payload = {
        ...basePayload,
        gender: formData.gender || null,
        profile_photo_url: profileUrl || null,
        notes: formData.notes,
        ai_hairstyle_analysis: {
          questionnaire_results: formData.preferences,
          staff_added_preferences: formData.notes
        }
      };
      if (modalType === 'add-customer') {
        payload.customer_code = `NAT-SHA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        payload.is_premium = false;
      }
    } else if (modalType === 'add-stylist' || (modalType === 'edit' && activeTab === 'stylists')) {
      table = 'stylists';
      payload = {
        ...basePayload,
        gender: formData.gender || null,
        profile_photo_url: profileUrl || null,
        experience_years: parseInt(formData.experienceYears) || 0,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (modalType === 'add-manager' || (modalType === 'edit' && activeTab === 'managers')) {
      table = 'managers';
      payload = {
        ...basePayload,
        franchise_owner_id: formData.franchiseOwnerId || null,
        profile_photo_url: profileUrl || null
      };
    } else if (modalType === 'add-franchise' || (modalType === 'edit' && activeTab === 'franchise')) {
      table = 'franchise_owners';
      payload = {
        ...basePayload,
        franchise_name: formData.franchiseName || null,
        franchise_address: formData.franchiseAddress || null,
        profile_photo_url: profileUrl || null
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
        alert("Updated successfully!");
        if (table === 'customers') fetchCustomers();
        else if (table === 'stylists') fetchStylists();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase.from(table).insert(payload);
      
      if (error) {
        alert(`Error adding ${modalType.split('-')[1]}: ${error.message}`);
      } else {
        alert(`${modalType.split('-')[1].replace(/^\w/, c => c.toUpperCase())} added successfully!`);
        if (modalType === 'add-customer') fetchCustomers();
        else if (modalType === 'add-stylist') fetchStylists();
        else if (modalType === 'add-manager') fetchManagers();
        else if (modalType === 'add-franchise') fetchFranchiseOwners();
        setShowModal(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (type: 'customer' | 'stylist' | 'manager' | 'franchise', id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const tableMap: Record<string, string> = { customer: 'customers', stylist: 'stylists', manager: 'managers', franchise: 'franchise_owners' };
    const table = tableMap[type];
    await supabase.from(table).delete().eq('id', id);
    if (type === 'customer') fetchCustomers();
    else if (type === 'stylist') fetchStylists();
    else if (type === 'manager') fetchManagers();
    else if (type === 'franchise') fetchFranchiseOwners();
  };

  const handleAssignBranch = async () => {
    if (!branchAssign) return;
    await supabase.from(branchAssign.table).update({ branch_name: branchInput }).eq('id', branchAssign.id);
    setBranchAssign(null);
    setBranchInput('');
    if (branchAssign.table === 'managers') fetchManagers();
    else fetchFranchiseOwners();
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
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
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-deep-grape italic tracking-tight">
            {isAdmin ? "Management Center" : 
             isFranchiseOwner ? "Franchise Oversight" :
             isManager ? "Branch Operations" :
             isStylist ? "Stylist Terminal" : "Staff Portal"}
          </h2>
          <p className="text-deep-grape/60 text-xs font-bold uppercase tracking-widest mt-1 italic">
            Authorized {isAdmin ? "Administrator" : isFranchiseOwner ? "Owner" : isManager ? "Manager" : "Stylist"} Dashboard
          </p>
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
              onClick={() => handleOpenModal('add-manager')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" /> Manager
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => handleOpenModal('add-franchise')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" /> Franchise
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-warm-grey/50 border border-black/5 shadow-inner">
        {(['customers', 'stylists', 'managers', 'franchise', 'appointments'] as const)
          .filter(tab => {
            if (isAdmin) return true;
            if (isFranchiseOwner) return ['customers', 'stylists', 'managers', 'appointments'].includes(tab);
            if (isManager) return ['customers', 'stylists', 'appointments'].includes(tab);
            if (isStylist) return ['customers', 'appointments'].includes(tab);
            return false;
          })
          .map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-deep-grape shadow-md' : 'text-deep-grape/40 hover:text-deep-grape'
              }`}
            >
              {tab === 'franchise' ? 'Franchise' : tab}
            </button>
          ))}
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
      )}

      {activeTab === 'stylists' && (
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
                  {stylist.specializations?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-naturals-purple/5 text-naturals-purple rounded-md text-[9px] font-black uppercase tracking-wide">{s}</span>
                  ))}
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
      )}

      {activeTab === 'managers' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_140px_120px] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Manager</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Email</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Branch</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Actions</span>
          </div>
          <div className="divide-y divide-black/5">
            {managers.length === 0 ? (
              <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No managers registered</div>
            ) : managers.map((m) => (
              <div key={m.id} className="grid grid-cols-[1fr_1fr_140px_120px] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="font-bold text-sm text-deep-grape">{m.full_name}</p>
                  <p className="text-[10px] text-deep-grape/40 font-bold mt-0.5">{m.phone || '—'}</p>
                </div>
                <p className="text-xs text-deep-grape/60 font-semibold">{m.email}</p>
                <button
                  onClick={() => { setBranchAssign({id: m.id, table: 'managers', current: m.branch_name || ''}); setBranchInput(m.branch_name || ''); }}
                  className="px-2 py-0.5 bg-naturals-purple/5 text-naturals-purple rounded-md text-[9px] font-black uppercase hover:bg-naturals-purple hover:text-white transition-all"
                >{m.branch_name || 'Assign Branch'}</button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit('manager', m)} className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group">
                    <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                  </button>
                  <button onClick={() => handleDelete('manager', m.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all group">
                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'franchise' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_140px_120px] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Franchise Owner</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Email</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Branch</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Actions</span>
          </div>
          <div className="divide-y divide-black/5">
            {franchiseOwners.length === 0 ? (
              <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No franchise owners registered</div>
            ) : franchiseOwners.map((fo) => (
              <div key={fo.id} className="grid grid-cols-[1fr_1fr_140px_120px] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="font-bold text-sm text-deep-grape">{fo.full_name}</p>
                  <p className="text-[10px] text-deep-grape/40 font-bold mt-0.5">{fo.phone || '—'}</p>
                </div>
                <p className="text-xs text-deep-grape/60 font-semibold">{fo.email}</p>
                <button
                  onClick={() => { setBranchAssign({id: fo.id, table: 'franchise_owners', current: fo.branch_name || ''}); setBranchInput(fo.branch_name || ''); }}
                  className="px-2 py-0.5 bg-deep-grape/5 text-deep-grape rounded-md text-[9px] font-black uppercase hover:bg-deep-grape hover:text-white transition-all"
                >{fo.branch_name || 'Assign Branch'}</button>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit('franchise', fo)} className="p-2 hover:bg-naturals-purple/10 rounded-xl transition-all group">
                    <Edit className="w-4 h-4 text-naturals-purple/60 group-hover:text-naturals-purple" />
                  </button>
                  <button onClick={() => handleDelete('franchise', fo.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all group">
                    <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {branchAssign && (
        <div className="fixed inset-0 bg-deep-grape/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setBranchAssign(null)}>
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-black/5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-deep-grape mb-1">Assign Branch</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-deep-grape/40 mb-6">Enter branch name or location code</p>
            <input
              type="text"
              value={branchInput}
              onChange={e => setBranchInput(e.target.value)}
              placeholder="e.g. Chennai-Adyar, BLR-02"
              className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-bold text-deep-grape bg-warm-grey/30 focus:outline-none focus:ring-2 focus:ring-naturals-purple/30 mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setBranchAssign(null)} className="flex-1 py-3 rounded-xl border border-black/10 text-deep-grape font-black text-xs uppercase tracking-widest hover:bg-warm-grey transition-all">Cancel</button>
              <button onClick={handleAssignBranch} className="flex-1 py-3 rounded-xl bg-naturals-purple text-white font-black text-xs uppercase tracking-widest hover:bg-deep-grape transition-all">Assign</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] px-6 py-3 bg-warm-grey/40 border-b border-black/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Date & Slot</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Client</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Specialist</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Protocol</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-deep-grape/50">Status</span>
          </div>
          <div className="divide-y divide-black/5">
            {appointments
              .filter(a => {
                if (isAdmin || isFranchiseOwner || isManager) return true;
                return (a as any).stylist_id === myStylistId;
              })
              .filter(a => {
                const search = searchQuery.toLowerCase();
                return (a as any).customer?.full_name?.toLowerCase().includes(search) || 
                       (a as any).service?.name?.toLowerCase().includes(search) ||
                       (a as any).stylist?.full_name?.toLowerCase().includes(search);
              })
              .map((a: any) => (
              <div key={a.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-warm-grey/20 transition-colors">
                <div>
                  <p className="font-bold text-xs text-deep-grape">{new Date(a.appointment_date).toLocaleDateString()}</p>
                  <p className="text-[10px] text-naturals-purple font-black">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</p>
                </div>
                <div>
                  <p className="font-bold text-xs text-deep-grape">{a.customer?.full_name}</p>
                  <p className="text-[9px] text-deep-grape/40 font-bold">{a.customer?.phone}</p>
                </div>
                <p className="text-[10px] font-black italic text-deep-grape/60">{a.stylist?.full_name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-naturals-purple">{a.service?.name}</p>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  a.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-warm-grey text-deep-grape/40 border-black/5'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
               <div className="px-6 py-10 text-center text-deep-grape/30 text-xs font-black uppercase tracking-widest">No active deployments found</div>
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic text-naturals-purple">Identity Portrait</label>
                <div className="flex items-center gap-6 p-4 bg-warm-grey/40 rounded-[2rem] border border-naturals-purple/10">
                  <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden bg-white shadow-xl flex-shrink-0 border-4 border-white">
                    {formData.profilePhotoUrl ? (
                      <img src={formData.profilePhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-naturals-purple/5">
                        <UserPlus className="w-8 h-8 text-naturals-purple/20" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-[10px] font-black text-deep-grape uppercase tracking-widest">Upload Profile Image</p>
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="inline-block px-5 py-2.5 bg-naturals-purple text-white font-black text-[9px] uppercase tracking-widest rounded-xl cursor-pointer hover:bg-deep-grape transition-all active:scale-95 shadow-lg shadow-naturals-purple/20"
                    >
                      {formData.profilePhotoFile ? 'Update Portrait' : 'Choose File'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {(modalType === 'add-customer' || (modalType === 'edit' && activeTab === 'customers')) && (
                <div className="space-y-6 pt-4 border-t border-black/5">
                  <h4 className="text-xs font-black text-naturals-purple uppercase tracking-[0.2em]">Service Questionnaire</h4>
                  
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
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Additional Preference Box</label>
                    <textarea
                      placeholder="Special instructions, product allergies, or styling notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              )}


              {(modalType === 'add-franchise' || (modalType === 'edit' && activeTab === 'franchise')) && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Franchise Name</label>
                    <input
                      type="text"
                      value={formData.franchiseName}
                      onChange={(e) => setFormData({ ...formData, franchiseName: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Franchise Address</label>
                    <input
                      type="text"
                      value={formData.franchiseAddress}
                      onChange={(e) => setFormData({ ...formData, franchiseAddress: e.target.value })}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {(modalType === 'add-manager' || (modalType === 'edit' && activeTab === 'managers')) && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Associated Franchise Owner</label>
                    <div className="relative group/sel">
                        <select 
                            className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none appearance-none cursor-pointer"
                            value={formData.franchiseOwnerId}
                            onChange={(e) => setFormData({ ...formData, franchiseOwnerId: e.target.value })}
                        >
                            <option value="">Independent / None</option>
                            {franchiseOwners.map(fo => (
                                <option key={fo.id} value={fo.id}>{fo.full_name} ({fo.franchise_name || 'No Name'})</option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-naturals-purple/40 group-hover/sel:text-naturals-purple transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {(modalType === 'add-stylist' || (modalType === 'edit' && activeTab === 'stylists')) && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Specializations</label>
                    <input
                      type="text"
                      placeholder="Cutting, Coloring, Styling..."
                      value={formData.specializations}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                      className="w-full bg-warm-grey/50 border-2 border-transparent rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple/30 transition-all outline-none"
                    />
                  </div>
                </div>
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
    </div>
  );
}
