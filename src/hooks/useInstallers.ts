import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { assignInstaller, listActiveInstallers, listProjectInstallers } from '../services/installerService'

export function useActiveInstallers() {
  const { user } = useAuth()
  return useQuery({ queryKey: ['installers', 'active'], queryFn: listActiveInstallers, enabled: Boolean(user) })
}

export function useProjectInstallers(projectId: string | undefined) {
  const { user } = useAuth()
  return useQuery({ queryKey: ['project-installers', projectId], queryFn: () => listProjectInstallers(projectId!), enabled: Boolean(user && projectId) })
}

export function useAssignInstaller(projectId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (installerId: string) => { if (!user) throw new Error('No hay una sesión autenticada.'); return assignInstaller(projectId, installerId, user.id) },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['project-installers', projectId] }) },
  })
}
