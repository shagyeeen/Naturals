'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any
  profile: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: string | null; userId: string | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isFranchiseOwner: boolean
  isManager: boolean
  isStylist: boolean
  isCustomer: boolean
  customerProfile: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [customerProfile, setCustomerProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshProfile = async (authUser: any) => {
    if (!authUser) return;
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (userData) {
        setProfile(userData)
        
        // If they are a customer, fetch their elite registry ID
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', authUser.id)
          .single()
        
        if (customerData) {
          console.log("Customer registry linked:", customerData.id)
          setCustomerProfile(customerData)
        }
      }
    } catch (e) {
      console.warn("Could not fetch profile", e)
    }
  }

  useEffect(() => {
    // Definitive initialization
    const init = async () => {
      console.log("Auth initializing...")
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          console.log("Session found for user:", session.user.id)
          setUser(session.user)
          await refreshProfile(session.user)
        } else {
          console.log("No active session found")
        }
      } catch (e) {
        console.error("Auth init fatal error:", e)
      } finally {
        console.log("Auth loading complete")
        setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event)
      if (session?.user) {
        setUser(session.user)
        if (event === 'SIGNED_IN') {
          await refreshProfile(session.user)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data.user, error: error?.message || null };
  }

  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    })

    if (error) return { error: error.message, userId: null }
    return { error: null, userId: data.user?.id || null }
  }

  const signOut = async () => {
    console.log("Terminating session...");
    setLoading(true);
    try {
      // Clear all state locally even if server-side signout fails
      setUser(null);
      setProfile(null);
      
      // Attempt server-side sign out
      await supabase.auth.signOut();
      console.log("Server session cleared.");
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      setLoading(false);
      // Force return to login
      router.replace('/login');
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    isFranchiseOwner: profile?.role === 'franchise_owner',
    isManager: profile?.role === 'manager' || profile?.role === 'franchise_owner',
    isStylist: profile?.role === 'stylist' || profile?.role === 'manager',
    isCustomer: profile?.role === 'customer',
    customerProfile
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
