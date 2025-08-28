import { useSession } from '../hooks/useSession'
import { formatDistanceToNow } from 'date-fns'
import { Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

interface SessionStatusProps {
  showInHeader?: boolean
  className?: string
}

export function SessionStatus({ showInHeader = false, className = '' }: SessionStatusProps) {
  const { isAuthenticated, sessionExpiry, isSessionExpiringSoon, refreshSession } = useSession()

  if (!isAuthenticated || !sessionExpiry) {
    return null
  }

  const timeUntilExpiry = formatDistanceToNow(new Date(sessionExpiry), { addSuffix: true })
  
  const handleRefresh = () => {
    refreshSession().catch(() => {
      console.error('Failed to refresh session')
    })
  }

  if (showInHeader) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {isSessionExpiringSoon ? (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Session expiring {timeUntilExpiry}</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Expires {timeUntilExpiry}</span>
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-6 w-6 p-0"
          title="Refresh session"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-sm font-medium mb-2">Session Status</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={isSessionExpiringSoon ? "destructive" : "secondary"}>
            {isSessionExpiringSoon ? "Expiring Soon" : "Active"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Expires:</span>
          <span className="text-sm">{timeUntilExpiry}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="w-full mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Session
        </Button>
      </div>
    </div>
  )
}
