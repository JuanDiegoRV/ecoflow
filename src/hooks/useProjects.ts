import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProject, getProject, listProjects, type ProjectFilters } from '../services/projectService'
import type { ProjectInsert } from '../types/database'
import { useAuth } from './useAuth'
import { useCurrentProfile } from './useCurrentProfile'

export function useProjects(filters: ProjectFilters = {}) {
  const { user } = useAuth()
  return useQuery({ queryKey: ['projects', filters], queryFn: () => listProjects(filters), enabled: Boolean(user) })
}

export function useProject(projectId: string | undefined) {
  const { user } = useAuth()
  return useQuery({ queryKey: ['project', projectId], queryFn: () => getProject(projectId!), enabled: Boolean(user && projectId) })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const profile = useCurrentProfile()
  return useMutation({
    mutationFn: (input: Omit<ProjectInsert, 'organizacion_id' | 'creado_por'>) => {
      if (!user || !profile.data) throw new Error('No hay un perfil autenticado disponible.')
      return createProject(input, profile.data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
