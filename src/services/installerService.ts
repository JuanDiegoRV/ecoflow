import { getSupabaseClient } from '../config/supabase'
import type { Installer, Profile, ProjectInstaller } from '../types/database'

export interface InstallerWithProfile extends Installer { profile: Pick<Profile, 'id' | 'nombre_completo'> }

export async function listActiveInstallers(): Promise<InstallerWithProfile[]> {
  const client = getSupabaseClient()
  const { data: installers, error } = await client.from('instaladores').select('*').eq('activo', true).order('created_at')
  if (error) throw error
  const rows = (installers ?? []) as Installer[]
  if (rows.length === 0) return []
  const { data: profiles, error: profileError } = await client.from('perfiles').select('*').in('id', rows.map((installer) => installer.perfil_id))
  if (profileError) throw profileError
  const profileMap = new Map((profiles as Profile[]).map((profile) => [profile.id, profile]))
  return rows.flatMap((installer) => {
    const profile = profileMap.get(installer.perfil_id)
    return profile ? [{ ...installer, profile: { id: profile.id, nombre_completo: profile.nombre_completo } }] : []
  })
}

export async function listProjectInstallers(projectId: string): Promise<ProjectInstaller[]> {
  const { data, error } = await getSupabaseClient().from('proyecto_instaladores').select('*').eq('proyecto_id', projectId)
  if (error) throw error
  return (data ?? []) as ProjectInstaller[]
}

export async function assignInstaller(projectId: string, installerId: string, assignedBy: string): Promise<ProjectInstaller> {
  const { data, error } = await getSupabaseClient().from('proyecto_instaladores').insert({ proyecto_id: projectId, instalador_id: installerId, asignado_por: assignedBy } as never).select('*').single()
  if (error) throw error
  return data as ProjectInstaller
}
