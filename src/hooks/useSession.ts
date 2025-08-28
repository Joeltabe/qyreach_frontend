import { useAuth } from '../contexts/AuthContext'
import { useEffect, useCallback } from 'react'

export function useSession() {
  const { 
    isAuthenticated, 
    sessionExpiry, 
    refreshSession, 
    checkSessionExpiry, 
    clearSession 
  } = useAuth()

  // Check if session is about to expire (within 5 minutes)
  const isSessionExpiringSoon = useCallback(() => {
    if (!sessionExpiry) return false
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() > (sessionExpiry - fiveMinutes)
  }, [sessionExpiry])

  // Auto-refresh session if expiring soon
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return

    const checkInterval = setInterval(() => {
      if (checkSessionExpiry()) {
        clearSession()
      } else if (isSessionExpiringSoon()) {
        refreshSession().catch(() => {
          console.log('Failed to refresh session')
        })
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkInterval)
  }, [isAuthenticated, sessionExpiry, checkSessionExpiry, clearSession, refreshSession, isSessionExpiringSoon])

  return {
    isAuthenticated,
    sessionExpiry,
    isSessionExpiringSoon: isSessionExpiringSoon(),
    refreshSession,
    clearSession,
  }
}
