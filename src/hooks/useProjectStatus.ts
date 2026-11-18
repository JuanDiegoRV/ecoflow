import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProjectStatus } from '../services/projectService'
import type { ProjectStatus } from '../types/database'

export function useProjectStatus(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (status: ProjectStatus) => updateProjectStatus(projectId, status), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['project', projectId] }), queryClient.invalidateQueries({ queryKey: ['projects'] })]) } })
}
