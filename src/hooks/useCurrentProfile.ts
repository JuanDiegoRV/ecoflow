import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { getCurrentProfile } from '../services/profileService'

export function useCurrentProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getCurrentProfile(user!.id),
    enabled: Boolean(user),
    staleTime: 5 * 60 * 1000,
  })
}
