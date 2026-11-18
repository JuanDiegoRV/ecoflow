import { getSupabaseClient } from '../config/supabase'
import type { Project, ProjectInsert, ProjectStatus } from '../types/database'

export interface ProjectFilters { status?: ProjectStatus }

export async function listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  let query = getSupabaseClient().from('proyectos').select('*').order('created_at', { ascending: false })
  if (filters.status) query = query.eq('estado', filters.status)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Project[]
}

export async function getProject(projectId: string): Promise<Project> {
  const { data, error } = await getSupabaseClient().from('proyectos').select('*').eq('id', projectId).single()
  if (error) throw error
  return data as Project
}

export async function updateProjectStatus(projectId: string, estado: ProjectStatus): Promise<Project> {
  const { data, error } = await getSupabaseClient().from('proyectos').update({ estado } as never).eq('id', projectId).select('*').single()
  if (error) throw error
  return data as Project
}

export async function createProject(input: Omit<ProjectInsert, 'organizacion_id' | 'creado_por'>, profile: { organizacion_id: string; id: string }): Promise<Project> {
  const payload: ProjectInsert = { ...input, organizacion_id: profile.organizacion_id, creado_por: profile.id }
  // The current database.ts is manually derived; Supabase's generated Insert
  // metadata will remove this boundary cast when official types are generated.
  const { data, error } = await getSupabaseClient().from('proyectos').insert(payload as never).select('*').single()
  if (error) throw error
  return data as Project
}
