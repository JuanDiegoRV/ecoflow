import type { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '../config/supabase'

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession()
  if (error) throw error
  return data.session
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
  if (error) throw error
  if (!data.session) throw new Error('Supabase no devolvió una sesión válida.')
  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut()
  if (error) throw error
}

export function getUserLabel(user: User | null): string {
  return user?.email ?? 'Usuario autenticado'
}
