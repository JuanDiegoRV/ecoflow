import { getSupabaseClient } from '../config/supabase'
import type { Profile } from '../types/database'

export async function getCurrentProfile(userId: string): Promise<Profile> {
  const { data, error } = await getSupabaseClient().from('perfiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data as Profile
}
