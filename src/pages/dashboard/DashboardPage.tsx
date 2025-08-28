import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Button } from '../../components/ui/Button'
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics'
import { 
  CampaignList, 
  EnhancedStatsGrid, 
  RecentCampaignsTable, 
  UsageOverviewCard, 
  LiveActivityFeed, 
  SystemNotificationsCard 
} from '../../components/dashboard/DashboardComponents'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Sparkles,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const refreshData = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast.success('Dashboard data refreshed!')
  }

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) {
      return user.firstName
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Gradient */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-8 rounded-2xl border border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {getUserName()}! 👋
                  </h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Live
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Here's your email marketing performance at a glance
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Last updated: {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={refreshData}
                  variant="outline" 
                  size="lg"
                  disabled={refreshing}
                  className="relative"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button 
                  onClick={() => navigate('/campaigns/create')}
                  className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700" 
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <DashboardMetrics 
          enableRealTime={true}
          updateInterval={30000}
          className="mb-8"
        />

        {/* Backend Connection Test */}
        {/* <div className="mb-8">
          <TestConnection />
        </div> */}

        {/* Enhanced Stats Grid */}
        <EnhancedStatsGrid />

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Campaign List */}
            <CampaignList />
            
            {/* Recent Campaigns Table */}
            <RecentCampaignsTable />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Usage Overview */}
            <UsageOverviewCard />
            
            {/* Live Activity Feed */}
            <LiveActivityFeed />
            
            {/* System Notifications */}
            <SystemNotificationsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
