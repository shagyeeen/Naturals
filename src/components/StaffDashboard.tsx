'use client';

import { useState, useEffect } from "react";
import { supabase, Customer, Stylist, Manager, Appointment } from "@/lib/supabase";
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
}

type ModalType = 'add-customer' | 'add-stylist' | 'add-manager' | 'add-franchise' | 'edit';

export default function StaffDashboard() {
  const { isAdmin, isManager, isFranchiseOwner, isStylist, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'customers' | 'stylists' | 'appointments'>('stylists');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
    franchiseAddress: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchAppointments();
    fetchStylists();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setCustomers(data);
  };

  const fetchStylists = async () => {
    const { data } = await supabase.from('stylists').select('*').order('full_name');
    if (data) setStylists(data);
  };

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*, customer:customers(*), stylist:stylists(*), service:services(*)')
      .order('appointment_date', { ascending: false });
    if (data) setAppointments(data);
  };

  const handleOpenModal = (type: ModalType, id?: string) => {
    setModalType(type);
    setEditingId(id || null);
    setFormData({ 
      fullName: '', phone: '', email: '', dateOfBirth: '', gender: '', 
      experienceYears: '', specializations: '', notes: '', 
      franchiseName: '', franchiseAddress: '' 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let table = '';
    let payload: any = {
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email || null,
      date_of_birth: formData.dateOfBirth || null,
    };

    if (modalType === 'add-customer') {
      table = 'customers';
      const customerCode = `NAT-SHA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      payload = { 
        ...payload, 
        customer_code: customerCode,
        notes: formData.notes, 
        is_premium: false 
      };
    } else if (modalType === 'add-stylist') {
      table = 'stylists';
      payload = { 
        ...payload, 
        experience_years: parseInt(formData.experienceYears) || 0,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (modalType === 'add-manager') {
      table = 'managers';
    } else if (modalType === 'add-franchise') {
      table = 'franchise_owners';
      payload = { ...payload, franchise_name: formData.franchiseName, franchise_address: formData.franchiseAddress };
    }

    const { error } = await supabase.from(table).insert(payload);
    
    if (error) {
      alert(`Error adding ${modalType.split('-')[1]}: ${error.message}`);
    } else {
      alert(`${modalType.split('-')[1].replace(/^\w/, c => c.toUpperCase())} added successfully!`);
      if (modalType === 'add-customer') fetchCustomers();
      else if (modalType === 'add-stylist') fetchStylists();
      setShowModal(false);
    }
  };

  const handleDelete = async (type: 'customer' | 'stylist', id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const table = type === 'customer' ? 'customers' : 'stylists';
    await supabase.from(table).delete().eq('id', id);
    if (type === 'customer') fetchCustomers();
    else fetchStylists();
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
          <h2 className="text-3xl font-black text-deep-grape italic tracking-tight">Management HQ</h2>
          <p className="text-deep-grape/60 text-xs font-bold uppercase tracking-widest mt-1 italic">Authorized Administrator Dashboard</p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleOpenModal('add-customer')}
              className="px-4 py-2.5 bg-naturals-purple text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              onClick={() => handleOpenModal('add-stylist')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Scissors className="w-3.5 h-3.5" /> Stylist
            </button>
            <button
              onClick={() => handleOpenModal('add-manager')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" /> Manager
            </button>
            <button
              onClick={() => handleOpenModal('add-franchise')}
              className="px-4 py-2.5 bg-deep-grape text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" /> Franchise
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 p-1.5 rounded-2xl w-fit bg-warm-grey/50 border border-black/5 shadow-inner">
        {['customers', 'stylists', 'appointments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-deep-grape shadow-md' : 'text-deep-grape/40 hover:text-deep-grape'
            }`}
          >
            {tab}
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
                        <button className="p-2 hover:bg-warm-grey rounded-xl transition-all"><Eye className="w-4 h-4 text-deep-grape/40" /></button>
                        <button onClick={() => handleDelete('customer', customer.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
        <div className="glass-card bg-white border border-black/5 shadow-xl rounded-[2rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-warm-grey/50">
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Stylist</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Expertise</th>
                  <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest text-deep-grape/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStylists.map((stylist) => (
                  <tr key={stylist.id} className="border-t border-black/5 hover:bg-warm-grey/20">
                    <td className="p-3">
                      <p className="font-bold text-sm">{stylist.full_name}</p>
                      <p className="text-[10px] text-deep-grape/40 font-bold">{stylist.phone}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {stylist.specializations?.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-naturals-purple/5 text-naturals-purple rounded text-[9px] font-black uppercase">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete('stylist', stylist.id)} className="p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="glass-card bg-white border border-black/5 shadow-xl rounded-[2rem] p-8 text-center">
          <Calendar className="w-12 h-12 text-naturals-purple/20 mx-auto mb-4" />
          <p className="text-sm font-black text-deep-grape/40 uppercase tracking-[0.2em]">Appointment Management Offline</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-deep-grape/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-black/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-deep-grape italic tracking-tight">
                {modalType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-warm-grey rounded-2xl transition-all">
                <X className="w-6 h-6 text-deep-grape/40" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-3 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    required
                  />
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

              {modalType === 'add-franchise' && (
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

              {modalType === 'add-stylist' && (
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
                className="w-full py-5 bg-deep-grape text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl hover:bg-naturals-purple transition-all mt-6"
              >
                INITIALIZE {modalType.split('-')[1].toUpperCase()}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
