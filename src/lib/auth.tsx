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
      console.log('[Auth] Refreshing profile via API for:', authUser.email);
      
      const res = await fetch(`/api/profile-sync?email=${encodeURIComponent(authUser.email)}`);
      
      let fullData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        fullData = await res.json();
      } else {
        const rawText = await res.text();
        console.error('[Auth] API returned non-JSON response:', {
          status: res.status,
          contentType,
          rawText: rawText.substring(0, 200) + '...'
        });
        throw new Error(`API returned ${res.status} ${res.statusText}`);
      }

      console.log('[Auth] API Response Detail:', { 
        status: res.status, 
        ok: res.ok, 
        data: fullData 
      });
      
      const { userData, customerData } = fullData;

      if (userData) {
        // Sync Google Profile Image to User record if missing
        if (!userData.profile_photo_url && authUser.photoURL) {
          await supabase.from('users').update({ profile_photo_url: authUser.photoURL }).eq('id', userData.id);
          userData.profile_photo_url = authUser.photoURL;
        }
        setProfile(userData);

        if (customerData) {
          // Sync Google Profile Image to Customer record if missing
          if (!customerData.profile_photo_url && authUser.photoURL) {
            await supabase.from('customers').update({ profile_photo_url: authUser.photoURL }).eq('id', customerData.id);
            customerData.profile_photo_url = authUser.photoURL;
          }
          setCustomerProfile(customerData);
        } else {
          setCustomerProfile(null);
        }
      } else {
        console.warn('[Auth] No user record found for:', authUser.email);
        setProfile(null);
        setCustomerProfile(null);
      }
    } catch (e) {
      console.error("[Auth] Crash in refreshProfile:", e)
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
         if (typeof window !== 'undefined') sessionStorage.setItem('naturals_auth_active', '1');
         setLoading(false);
         return;
      }

      console.log("Firebase Auth state change:", firebaseUser?.email || "Signed out")
      if (firebaseUser) {
        setUser(firebaseUser)
        await refreshProfile(firebaseUser)
        if (typeof window !== 'undefined') sessionStorage.setItem('naturals_auth_active', '1');
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
        sessionStorage.removeItem('naturals_auth_active');
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

  const ownerEmails = ['shynewebhosters@gmail.com', 'shynewebh1@gmail.com'];
  const adminEmails = ['727824tuit213@gmail.com', '727824tuit213@skct.edu.in'];
  
  const isFranchiseOwner = ownerEmails.includes(user?.email?.toLowerCase() || '') || profile?.role === 'franchise_owner';
  const isReceptionist = adminEmails.includes(user?.email?.toLowerCase() || '') || profile?.role === 'admin';
  
  const adminCheck = isFranchiseOwner || isReceptionist;
  const managerCheck = profile?.role === 'manager' || isFranchiseOwner;
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
    isFranchiseOwner: isFranchiseOwner,
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
