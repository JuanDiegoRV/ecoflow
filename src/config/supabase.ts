import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
// Supabase JS necesita la URL raíz del proyecto, no el endpoint REST /rest/v1/.
// Se normaliza el sufijo para tolerar una URL copiada desde la sección API.
const supabaseUrl = configuredSupabaseUrl?.replace(/\/rest\/v1\/?$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Null until both public environment variables exist. No service_role key is
 * accepted or referenced by the frontend configuration.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.',
    )
  }

  return supabase
}
