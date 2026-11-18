import { getSupabaseClient } from '../config/supabase'
import type { Material, MaterialInsert, ProjectMaterial } from '../types/database'

export async function listMaterials(): Promise<Material[]> {
  const { data, error } = await getSupabaseClient().from('materiales').select('*').order('nombre')
  if (error) throw error
  return (data ?? []) as Material[]
}

export async function createMaterial(input: Pick<MaterialInsert, 'organizacion_id' | 'nombre' | 'unidad'>): Promise<Material> {
  const { data, error } = await getSupabaseClient().from('materiales').insert(input as never).select('*').single()
  if (error) throw error
  return data as Material
}

export async function listProjectMaterials(projectId: string): Promise<ProjectMaterial[]> {
  const { data, error } = await getSupabaseClient().from('proyecto_materiales').select('*').eq('proyecto_id', projectId)
  if (error) throw error
  return (data ?? []) as ProjectMaterial[]
}

export async function upsertProjectMaterial(input: Pick<ProjectMaterial, 'proyecto_id' | 'material_id' | 'cantidad' | 'registrado_por'>): Promise<ProjectMaterial> {
  const { data, error } = await getSupabaseClient().from('proyecto_materiales').upsert(input as never, { onConflict: 'proyecto_id,material_id' }).select('*').single()
  if (error) throw error
  return data as ProjectMaterial
}
