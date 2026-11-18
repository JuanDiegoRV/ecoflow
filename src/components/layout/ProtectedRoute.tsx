import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingState } from '../ui/AsyncState'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return <LoadingState label="Comprobando sesión…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
