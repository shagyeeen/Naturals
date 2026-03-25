'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
// import { updateCustomerProfile } from '@/lib/actions'
import { motion } from 'framer-motion'
import { UserPlus, Calendar, Loader2, Check, User, Sparkles } from 'lucide-react'
import NextImage from 'next/image'

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
]

interface FormData {
  fullName: string
  phone: string
  dateOfBirth: string
  gender: string
  preferences: { [key: string]: string | string[] }
  profilePhotoUrl: string
  profilePhotoFile: File | null
  notes: string
}

export default function OnboardingPage() {
  const { user, customerProfile, loading, isCustomer, isFranchiseOwner, isManager, refreshProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    preferences: {},
    profilePhotoUrl: '',
    profilePhotoFile: null,
    notes: ''
  })

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ''
    const [y, m, d] = dateStr.split('-')
    return `${d}-${m}-${y}`
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || prev.fullName
      }))
    }
    if (customerProfile) {
      setFormData({
        fullName: customerProfile.full_name || user?.displayName || '',
        phone: customerProfile.phone || '',
        dateOfBirth: customerProfile.date_of_birth ? formatDateForInput(customerProfile.date_of_birth) : '',
        gender: customerProfile.gender || '',
        preferences: customerProfile.ai_hairstyle_analysis?.questionnaire_results || {},
        profilePhotoUrl: customerProfile.profile_photo_url || user?.photoURL || '',
        profilePhotoFile: null,
        notes: customerProfile.notes || ''
      })
    }
  }, [user, customerProfile])

  const formatDateForDB = (dob: string) => {
    if (dob && dob.length === 10) {
      const [d, m, y] = dob.split('-').map(Number)
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    }
    return null
  }

  const calculateAge = (dob: string) => {
    if (!dob || dob.length !== 10) return null
    const [d, m, y] = dob.split('-').map(Number)
    if (!d || !m || !y || y < 1900) return null
    const birthDate = new Date(y, m - 1, d)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  const validateStep = (step: number) => {
    const errors: { [key: string]: string } = {}
    
    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = "Full Name is required"
      if (!formData.phone.trim()) errors.phone = "Phone number is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        profilePhotoFile: file,
        profilePhotoUrl: URL.createObjectURL(file)
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(1)) return
    if (!user?.email) return
    
    setIsSubmitting(true)
    
    try {
      let profileUrl = formData.profilePhotoUrl
      
      if (formData.profilePhotoFile) {
        const fileExt = formData.profilePhotoFile.name.split('.').pop()
        const fileName = `${user.uid}.${fileExt}`
        const filePath = `profiles/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData.profilePhotoFile, { upsert: true })
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)
          profileUrl = publicUrl
        }
      }

      const payload = {
        full_name: formData.fullName,
        phone: formData.phone,
        date_of_birth: formatDateForDB(formData.dateOfBirth),
        gender: formData.gender || null,
        profile_photo_url: profileUrl || null,
        notes: formData.notes,
        ai_hairstyle_analysis: {
          questionnaire_results: formData.preferences,
          onboarding_completed: true,
          onboarding_date: new Date().toISOString()
        },
        is_active: true
      }

      const updateRes = await fetch('/api/auth/action', {
        method: 'POST',
        body: JSON.stringify({
          action: 'update',
          email: user.email,
          payload
        })
      });
      const { error: updateError } = await updateRes.json();

      if (updateError) {
        alert(`Error updating profile: ${updateError}`)
        setIsSubmitting(false)
        return
      }

      // Refresh the context state
      await refreshProfile(user)

      router.push('/dashboard/passport')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('An error occurred. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF9FF] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-naturals-purple/20 border-t-naturals-purple animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F1FF] via-[#FDF9FF] to-[#FFFFFF]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="relative w-20 h-10 mx-auto mb-4">
            <NextImage 
              src="/naturalslogo.png" 
              alt="Logo" 
              fill 
              sizes="80px"
              className="object-contain object-center scale-150" 
            />
          </div>
          <h1 className="text-3xl font-black text-deep-grape italic tracking-tight mb-2">
            Complete Your Profile
          </h1>
          <p className="text-deep-grape/50 text-sm font-bold uppercase tracking-widest">
            {isCustomer 
              ? `Step ${currentStep} of 2: ${currentStep === 1 ? 'Personal Information' : 'Service Preferences'}`
              : `Profile Configuration`
            }
          </p>
        </div>

        {isCustomer && (
          <div className="flex gap-2 justify-center mb-8">
            {[1, 2].map(step => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step === currentStep 
                    ? 'w-16 bg-naturals-purple' 
                    : step < currentStep 
                      ? 'w-8 bg-naturals-purple/50' 
                      : 'w-8 bg-warm-grey'
                }`}
              />
            ))}
          </div>
        )}

        <motion.div 
          layout
          className="glass-card p-8 bg-white/80 rounded-[2.5rem] shadow-2xl border border-naturals-purple/10"
        >
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 p-4 bg-naturals-purple/5 rounded-2xl border border-naturals-purple/10 mb-6">
                <div className="w-10 h-10 rounded-xl bg-naturals-purple/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-naturals-purple" />
                </div>
                <div>
                  <p className="text-xs font-black text-deep-grape">Welcome, {user?.displayName?.split(' ')[0] || 'New User'}!</p>
                  <p className="text-[10px] text-deep-grape/50">Let&apos;s set up your Naturals profile</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value })
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' })
                  }}
                  className={`w-full bg-warm-grey/40 border rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                    formErrors.fullName ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-[10px] font-bold ml-2">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' })
                  }}
                  className={`w-full bg-warm-grey/40 border rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold transition-all outline-none ${
                    formErrors.phone ? 'border-red-500 bg-red-50/10' : 'border-naturals-purple/20 focus:bg-white focus:border-naturals-purple'
                  }`}
                  placeholder="+91 XXXXX XXXXX"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-[10px] font-bold ml-2">{formErrors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD-MM-YYYY"
                      value={formData.dateOfBirth}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        if (val.length > 8) val = val.slice(0, 8)
                        if (val.length > 4) val = val.slice(0, 2) + '-' + val.slice(2, 4) + '-' + val.slice(4)
                        else if (val.length > 2) val = val.slice(0, 2) + '-' + val.slice(2)
                        setFormData({ ...formData, dateOfBirth: val })
                      }}
                      className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-4 pl-6 pr-12 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-naturals-purple/10 rounded-lg transition-all"
                    >
                      <Calendar className="w-5 h-5 text-naturals-purple/60" />
                    </button>
                    
                    {formData.dateOfBirth.length === 10 && (
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-naturals-purple text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                        Age: {calculateAge(formData.dateOfBirth)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Gender</label>
                  <div className="flex bg-warm-grey/40 rounded-2xl p-1 border border-naturals-purple/20 h-[52px]">
                    {['male', 'female', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          formData.gender === g ? 'bg-naturals-purple text-white shadow-md' : 'text-deep-grape/40 hover:bg-white/50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isFranchiseOwner && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-naturals-purple ml-2">Registered Franchise Name</label>
                  <input
                    type="text"
                    value={formData.preferences.franchise_name as string || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, franchise_name: e.target.value } 
                    })}
                    className="w-full bg-white border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold transition-all outline-none focus:border-naturals-purple shadow-lg shadow-naturals-purple/5"
                    placeholder="e.g. Naturals Shyne Private Ltd"
                  />
                </div>
              )}

              {isManager && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-naturals-purple ml-2">Associated Franchise Owner / Company</label>
                  <select
                    value={formData.preferences.franchise_owner_id as string || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, franchise_owner_id: e.target.value } 
                    })}
                    className="w-full bg-white border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold transition-all outline-none focus:border-naturals-purple shadow-lg shadow-naturals-purple/5"
                  >
                    <option value="">Select Associated Franchise...</option>
                    <option value="Groom India Salon & Spa">Groom India Salon & Spa (Corporate)</option>
                    <option value="Naturals Beauty Wellness">Naturals Beauty Wellness Pvt Ltd</option>
                    <option value="Shyne Salon Partners">Shyne Salon Partners</option>
                    <option value="Zenith Lifestyle Management">Zenith Lifestyle Management</option>
                    <option value="South India Salon Network">South India Salon Network</option>
                    <option value="Premium Branch Holdings">Premium Branch Holdings</option>
                  </select>
                </div>
              )}

              {!isCustomer && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-naturals-purple ml-2">Assigned Branch / Location</label>
                  <select
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold transition-all outline-none focus:border-naturals-purple shadow-lg shadow-naturals-purple/5"
                  >
                    <option value="">Select a Naturals Location...</option>
                    <option value="Anna Nagar West">Anna Nagar West</option>
                    <option value="Nungambakkam High Rd">Nungambakkam High Rd</option>
                    <option value="Indiranagar 100ft Rd">Indiranagar 100ft Rd</option>
                    <option value="Koramangala 4th Block">Koramangala 4th Block</option>
                    <option value="Juhu Tara Road">Juhu Tara Road</option>
                    <option value="T. Nagar G.N. Chetty">T. Nagar G.N. Chetty</option>
                    <option value="Adyar Lattice Bridge">Adyar Lattice Bridge</option>
                    <option value="Indra Nagar Metro">Indra Nagar Metro</option>
                    <option value="Whitefield Palm Meadows">Whitefield Palm Meadows</option>
                    <option value="Independent / Other">Independent / Other</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2 italic text-naturals-purple">Profile Photo</label>
                <div className="flex items-center gap-6 p-4 bg-warm-grey/40 rounded-[2rem] border border-naturals-purple/10">
                  <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden bg-white shadow-xl flex-shrink-0 border-4 border-white">
                    {formData.profilePhotoUrl ? (
                      <img src={formData.profilePhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : user?.photoURL ? (
                      <img src={user.photoURL} alt="Google Profile" className="w-full h-full object-cover" />
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

              <button
                onClick={isCustomer ? handleNextStep : handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-naturals-purple text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-deep-grape transition-all shadow-lg shadow-naturals-purple/20"
              >
                {isSubmitting ? (
                   <span className="flex items-center justify-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
                   </span>
                ) : (
                   isCustomer ? "Continue to Preferences" : "Complete Configuration"
                )}
              </button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 p-4 bg-naturals-purple/5 rounded-2xl border border-naturals-purple/10 mb-6">
                <div className="w-10 h-10 rounded-xl bg-naturals-purple/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-naturals-purple" />
                </div>
                <div>
                  <p className="text-xs font-black text-deep-grape">Service Preferences</p>
                  <p className="text-[10px] text-deep-grape/50">Help us personalize your salon experience</p>
                </div>
              </div>

              <div className="space-y-6">
                {PREDEFINED_QUESTIONS
                  .filter(q => !q.gender || q.gender.includes(formData.gender))
                  .map((q) => (
                    <div key={q.id} className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-wider text-deep-grape/60 ml-1 italic">
                        {q.question}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const currentSelections = (Array.isArray(formData.preferences[q.id]) 
                            ? formData.preferences[q.id] 
                            : (formData.preferences[q.id] ? [formData.preferences[q.id]] : [])) as string[]
                          const isSelected = currentSelections.includes(opt)

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
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    preferences: { 
                                      ...formData.preferences, 
                                      [q.id]: [...currentSelections, opt] 
                                    }
                                  })
                                }
                              }}
                              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                isSelected 
                                  ? 'bg-naturals-purple border-naturals-purple text-white shadow-lg' 
                                  : 'border-warm-grey text-deep-grape/40 hover:border-naturals-purple/20 bg-white'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-1 pt-4 border-t border-black/5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-deep-grape/40 ml-2">Additional Notes</label>
                <textarea
                  placeholder="Any special instructions, allergies, or preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-warm-grey/40 border border-naturals-purple/20 rounded-2xl py-4 px-6 text-deep-grape text-sm font-bold focus:bg-white focus:border-naturals-purple transition-all outline-none min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-4 border border-naturals-purple/20 text-naturals-purple font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-naturals-purple/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-naturals-purple text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-deep-grape transition-all shadow-lg shadow-naturals-purple/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Complete Profile
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <p className="text-center text-deep-grape/30 text-[9px] font-black uppercase tracking-[0.4em] mt-8">
          Naturals AI • Your Beauty, Personalized
        </p>
      </div>
    </div>
  )
}
