import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseConfigured } from '../../config/supabase'
import { getSession, signIn, signOut } from '../../services/authService'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let mounted = true
    const client = getSupabaseClient()
    void getSession().then((currentSession) => {
      if (mounted) { setSession(currentSession); setIsLoading(false) }
    }).catch(() => { if (mounted) setIsLoading(false) })
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => { if (mounted) setSession(nextSession) })
    return () => { mounted = false; data.subscription.unsubscribe() }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isLoading,
    isConfigured: isSupabaseConfigured,
    signIn: async (email, password) => { const nextSession = await signIn(email, password); setSession(nextSession) },
    signOut: async () => { await signOut(); setSession(null) },
  }), [isLoading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

