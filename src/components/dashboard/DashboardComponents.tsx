import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  getCampaigns,
  getRecentCampaigns,
  getUsageOverview,
  getActivityFeed,
  getSystemNotifications
} from '../../utils/dashboardMetrics';
import type { 
  Campaign, 
  RecentCampaign 
} from '../../utils/dashboardMetrics';
import { TrendingUp, TrendingDown, Eye, Edit, Send, Calendar, Clock } from 'lucide-react';

// Campaign List Component
export const CampaignList: React.FC = () => {
  const campaigns = getCampaigns();
  const navigate = useNavigate();

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Sending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'Sent': return <Send className="w-4 h-4" />;
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      case 'Draft': return <Edit className="w-4 h-4" />;
      case 'Sending': return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Campaigns</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/campaigns')}
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(campaign.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </span>
                </Badge>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{campaign.name}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{campaign.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{campaign.recipients.toLocaleString()} recipients</span>
                {campaign.openRate && (
                  <span>Open Rate: {campaign.openRate}%</span>
                )}
                {campaign.clickRate && (
                  <span>Click Rate: {campaign.clickRate}%</span>
                )}
                {campaign.sentDate && (
                  <span>Sent: {campaign.sentDate}</span>
                )}
                {campaign.scheduledDate && (
                  <span>Scheduled: {campaign.scheduledDate}</span>
                )}
                {campaign.createdDate && (
                  <span>Created: {campaign.createdDate}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {campaign.status === 'Draft' && (
                <Button 
                  size="sm"
                  onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              {campaign.status === 'Scheduled' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/campaigns/${campaign.id}/schedule`)}
                >
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Enhanced Stats Grid Component
export const EnhancedStatsGrid: React.FC = () => {
  const stats = [
    {
      title: 'Total Emails Sent',
      value: '47,238',
      change: '+12%',
      trend: 'up' as const,
      description: 'From last month'
    },
    {
      title: 'Open Rate',
      value: '28.4%',
      change: '+3.2%',
      trend: 'up' as const,
      description: 'Average across campaigns'
    },
    {
      title: 'Click Rate',
      value: '6.7%',
      change: '+1.8%',
      trend: 'up' as const,
      description: 'Average across campaigns'
    },
    {
      title: 'Active Contacts',
      value: '1,287',
      change: '+289',
      trend: 'up' as const,
      description: 'New contacts this month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
            <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {stat.change}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.description}</p>
        </Card>
      ))}
    </div>
  );
};

// Recent Campaigns Table Component
export const RecentCampaignsTable: React.FC = () => {
  const campaigns = getRecentCampaigns();

  const getStatusColor = (status: RecentCampaign['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Campaigns</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Campaign</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Sent</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Opens</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{campaign.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{campaign.date}</td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {campaign.sent > 0 ? campaign.sent.toLocaleString() : '-'}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {campaign.opens > 0 ? `${campaign.opens}%` : '-'}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {campaign.clicks > 0 ? `${campaign.clicks}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Usage Overview Component
export const UsageOverviewCard: React.FC = () => {
  const usage = getUsageOverview();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Usage Overview</h3>
      
      <div className="space-y-6">
        {Object.entries(usage).map(([key, data]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {data.percentage}% used
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(data.percentage)}`}
                style={{ width: `${data.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{data.used.toLocaleString()} / {data.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Live Activity Feed Component
export const LiveActivityFeed: React.FC = () => {
  const activities = getActivityFeed();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Live Activity Feed</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <span className="text-lg">{activity.icon}</span>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// System Notifications Component
export const SystemNotificationsCard: React.FC = () => {
  const notifications = getSystemNotifications();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">System Notifications</h3>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100">{notification.message}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{notification.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
