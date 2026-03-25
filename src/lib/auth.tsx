'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth as firebaseAuth } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: FirebaseUser | null
  profile: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: string | null; email: string | null }>
  signInWithGoogle: () => Promise<{ user: any; error: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isFranchiseOwner: boolean
  isManager: boolean
  isStylist: boolean
  isCustomer: boolean
  customerProfile: any | null
  loginAsGuest: (role: string) => void
  refreshProfile: (authUser: FirebaseUser) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [customerProfile, setCustomerProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshProfile = async (authUser: FirebaseUser) => {
    if (!authUser || !authUser.email) return;
    try {
      console.log('Refreshing profile for:', authUser.email);
      
      // 1. Fetch via API route to bypass RLS and avoid compile-time panics
      // 1. Fetch via API route with cache: 'no-store' to ensure we get fresh data after onboarding
      const response = await fetch(`/api/auth/profile?email=${encodeURIComponent(authUser.email)}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      console.log('Profile API response:', data);
      
      const { userData, customerData } = data;
      
      if (userData) {
        setProfile(userData);
      }

      if (customerData) {
        // Sync Google Profile Image if the customer doesn't have one
        if (!customerData.profile_photo_url && authUser.photoURL) {
          await supabase.from('customers').update({ profile_photo_url: authUser.photoURL }).eq('id', customerData.id);
        }

        setCustomerProfile(customerData);
      } else {
        setCustomerProfile(null);
      }
    } catch (e) {
      console.error("Could not fetch profile", e)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      const guestRole = typeof window !== 'undefined' ? localStorage.getItem('naturals_guest_role') : null;
      
      if (guestRole) {
         console.log("Guest Auth state active:", guestRole);
         if (guestRole === 'customer') {
            setUser({ email: 'guest_customer@naturals.ai', uid: 'guest-123' } as any);
            setProfile({ role: 'customer', full_name: 'Aditi Sharma', gender: 'female' });
            setCustomerProfile({ 
               id: '00000000-0000-0000-0000-000000000001',
               full_name: 'Aditi Sharma',
               gender: 'female',
               phone: '+91 98765 43210',
               email: 'guest_customer@naturals.ai',
               hairstyle_preference: 'Long layers, Frizz control, Hydration focus',
               last_diagnosis: 'Dry scalp, Frizzy ends',
               ai_hairstyle_analysis: {
                 questionnaire_results: {
                   hair_wash_preference: 'Before SPA',
                   hairstyle_female: 'Layered Cut',
                   water_temp: 'Lukewarm',
                   scalp_massage: 'Strong',
                   conversation: 'Friendly Chat'
                 }
               }
            });
         } else {
            setUser({ email: `guest_${guestRole}@naturals.ai`, uid: 'guest-123' } as any);
            setProfile({ role: guestRole, full_name: `Guest ${guestRole}`, branch_id: 'guest-branch' });
            setCustomerProfile(null);
         }
         setLoading(false);
         return;
      }

      console.log("Firebase Auth state change:", firebaseUser?.email || "Signed out")
      if (firebaseUser) {
        setUser(firebaseUser)
        await refreshProfile(firebaseUser)
      } else {
        setUser(null)
        setProfile(null)
        setCustomerProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || "Failed to sign in" };
    }
  }

  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Attempt to send verification email
      try {
        await sendEmailVerification(userCredential.user);
      } catch (err) {
        console.warn("Could not send verification email", err);
      }

      return { error: null, email: userCredential.user.email };
    } catch (error: any) {
      return { error: error.message || "Failed to sign up", email: null };
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || "Google sign-in failed" };
    }
  }

  const loginAsGuest = (role: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naturals_guest_role', role);
    }
    if (role === 'customer') {
       setUser({ email: 'guest_customer@naturals.ai', uid: 'guest-123' } as any);
       setProfile({ role: 'customer', full_name: 'Aditi Sharma', gender: 'female' });
       setCustomerProfile({ 
          id: '00000000-0000-0000-0000-000000000001', // Mock ID
          full_name: 'Aditi Sharma',
          gender: 'female',
          phone: '+91 98765 43210',
          email: 'guest_customer@naturals.ai',
          hairstyle_preference: 'Long layers, Frizz control, Hydration focus',
          last_diagnosis: 'Dry scalp, Frizzy ends',
          ai_hairstyle_analysis: {
            questionnaire_results: {
              hair_wash_preference: 'Before SPA',
              hairstyle_female: 'Layered Cut',
              water_temp: 'Lukewarm',
              scalp_massage: 'Strong',
              conversation: 'Friendly Chat'
            }
          }
       });
    } else {
       setUser({ email: `guest_${role}@naturals.ai`, uid: 'guest-123' } as any);
       setProfile({ role: role, full_name: `Guest ${role}`, branch_id: 'guest-branch' });
       setCustomerProfile(null);
    }
  }

  const signOut = async () => {
    console.log("Terminating session...");
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('naturals_guest_role');
      }
      setUser(null);
      setProfile(null);
      setCustomerProfile(null);
      
      await firebaseSignOut(firebaseAuth);
      console.log("Firebase session cleared.");
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setLoading(false);
      router.replace('/login');
    }
  }

  const adminCheck = user?.email?.toLowerCase() === 'shynewebhosters@gmail.com' || user?.email?.toLowerCase() === 'shynewebh1@gmail.com' || profile?.role === 'admin';
  const franchiseOwnerCheck = profile?.role === 'franchise_owner';
  const managerCheck = profile?.role === 'manager' || profile?.role === 'franchise_owner';
  const stylistCheck = profile?.role === 'stylist' || profile?.role === 'manager';
  const customerCheck = (!profile || profile?.role === 'customer') && !adminCheck;

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin: adminCheck,
    isFranchiseOwner: franchiseOwnerCheck,
    isManager: managerCheck,
    isStylist: stylistCheck,
    isCustomer: customerCheck,
    customerProfile,
    loginAsGuest,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
