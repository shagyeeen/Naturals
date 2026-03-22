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
      // 1. Fetch the user profile by email
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single()
      
      if (userData) {
        setProfile(userData)
        
        // 2. Fetch/Sync Customer Registry
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('email', authUser.email)
          .single()
        
        if (customerData) {
          // Sync user_id if missing (e.g. added by staff manually first)
          if (!customerData.user_id) {
            await supabase.from('customers').update({ user_id: userData.id }).eq('id', customerData.id);
          }
          
          // Sync Google Profile Image if the customer doesn't have one
          if (!customerData.profile_photo_url && authUser.photoURL) {
            await supabase.from('customers').update({ profile_photo_url: authUser.photoURL }).eq('id', customerData.id);
          }

          setCustomerProfile({ ...customerData, user_id: userData.id })
        }
      } else {
        console.warn("Firebase user has no profile in Supabase DB")
      }
    } catch (e) {
      console.warn("Could not fetch profile", e)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      const guestRole = typeof window !== 'undefined' ? localStorage.getItem('naturals_guest_role') : null;
      
      if (guestRole) {
         console.log("Guest Auth state active:", guestRole);
         setUser({ email: `guest_${guestRole}@naturals.ai`, uid: 'guest-123' } as any);
         setProfile({ role: guestRole, full_name: `Guest ${guestRole}`, branch_id: 'guest-branch' });
         if (guestRole === 'customer') {
            setCustomerProfile({ last_diagnosis: null });
         } else {
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
    setUser({ email: `guest_${role}@naturals.ai`, uid: 'guest-123' } as any);
    setProfile({ role: role, full_name: `Guest ${role}`, branch_id: 'guest-branch' });
    if (role === 'customer') {
       setCustomerProfile({ last_diagnosis: null });
    } else {
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

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin: user?.email === 'shynewebhosters@gmail.com' || profile?.role === 'admin',
    isFranchiseOwner: profile?.role === 'franchise_owner',
    isManager: profile?.role === 'manager' || profile?.role === 'franchise_owner',
    isStylist: profile?.role === 'stylist' || profile?.role === 'manager',
    isCustomer: (!profile || profile?.role === 'customer') && user?.email !== 'shynewebhosters@gmail.com' && profile?.role !== 'admin',
    customerProfile,
    loginAsGuest
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
