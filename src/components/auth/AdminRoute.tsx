import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
