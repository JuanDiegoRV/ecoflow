import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMaterial, listMaterials, listProjectMaterials, upsertProjectMaterial } from '../services/materialService'
import { useAuth } from './useAuth'
import { useCurrentProfile } from './useCurrentProfile'
import type { MaterialInsert, ProjectMaterial } from '../types/database'

export function useMaterials() {
  const { user } = useAuth()
  return useQuery({ queryKey: ['materials'], queryFn: listMaterials, enabled: Boolean(user) })
}

export function useProjectMaterials(projectId: string | undefined) {
  const { user } = useAuth()
  return useQuery({ queryKey: ['project-materials', projectId], queryFn: () => listProjectMaterials(projectId!), enabled: Boolean(user && projectId) })
}

export function useCreateMaterial() {
  const profile = useCurrentProfile()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Pick<MaterialInsert, 'nombre' | 'unidad'>) => { if (!profile.data) throw new Error('No hay un perfil autenticado disponible.'); return createMaterial({ ...input, organizacion_id: profile.data.organizacion_id }) },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['materials'] }) },
  })
}

export function useUpsertProjectMaterial(projectId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Pick<ProjectMaterial, 'material_id' | 'cantidad'>) => { if (!user) throw new Error('No hay una sesión autenticada.'); return upsertProjectMaterial({ ...input, proyecto_id: projectId, registrado_por: user.id }) },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['project-materials', projectId] }) },
  })
}
