// Dashboard Metrics Utilities
// Frontend-based calculations using real API data

import { contactsApi, analyticsApi } from '../lib/api';

export interface DashboardMetrics {
  totalCampaigns: number;
  activeRecipients: number;
  avgOpenRate: number;
  emailsSentToday: number;
  totalEmailsSent: number;
  emailGrowth: number;
  openRate: number;
  openRateGrowth: number;
  clickRate: number;
  clickRateGrowth: number;
  activeContacts: number;
  contactsGrowth: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Sent' | 'Scheduled' | 'Draft' | 'Sending';
  description: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
  sentDate?: string;
  scheduledDate?: string;
  createdDate?: string;
}

export interface EmailPerformanceData {
  month: string;
  emails: number;
  opens: number;
  clicks: number;
}

export interface RecentCampaign {
  id: string;
  name: string;
  date: string;
  status: 'Active' | 'Completed' | 'Scheduled' | 'Draft';
  sent: number;
  opens: number;
  clicks: number;
}

export interface UsageOverview {
  emailCredits: {
    used: number;
    total: number;
    percentage: number;
  };
  aiRequests: {
    used: number;
    total: number;
    percentage: number;
  };
  contacts: {
    used: number;
    total: number;
    percentage: number;
  };
  templates: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface ActivityFeedItem {
  id: string;
  icon: string;
  message: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  message: string;
  timestamp: string;
}

// Real dashboard metrics calculation using API data
export const calculateDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    // Temporarily disable API calls until backend endpoints are implemented
    console.log('Dashboard metrics API calls disabled - using mock data');
    
    /* Uncomment when backend endpoints are ready:
    // Fetch real data from APIs
    const [contactsResponse, analyticsResponse] = await Promise.all([
      contactsApi.getContacts(1, 1), // Just to get total count
      analyticsApi.getDashboard().catch(() => null) // Gracefully handle if not available
    ]);

    const totalContacts = contactsResponse.data.data?.total || 0;
    const analytics = analyticsResponse?.data.data || {};
    */
    
    // Use mock data instead
    const totalContacts = 0;
    const analytics = {
      totalCampaigns: 0,
      avgOpenRate: 0,
      emailsSentToday: 0,
      totalEmailsSent: 0,
      emailGrowth: 0,
      openRate: 0,
      openRateGrowth: 0,
      clickRate: 0,
      clickRateGrowth: 0,
      contactsGrowth: 0
    };

    // Calculate real metrics
    return {
      totalCampaigns: analytics.totalCampaigns || 0,
      activeRecipients: totalContacts,
      avgOpenRate: analytics.avgOpenRate || 0,
      emailsSentToday: analytics.emailsSentToday || 0,
      totalEmailsSent: analytics.totalEmailsSent || 0,
      emailGrowth: analytics.emailGrowth || 0,
      openRate: analytics.openRate || 0,
      openRateGrowth: analytics.openRateGrowth || 0,
      clickRate: analytics.clickRate || 0,
      clickRateGrowth: analytics.clickRateGrowth || 0,
      activeContacts: totalContacts,
      contactsGrowth: analytics.contactsGrowth || 0
    };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    // Return zeros for real data when API fails
    return {
      totalCampaigns: 0,
      activeRecipients: 0,
      avgOpenRate: 0,
      emailsSentToday: 0,
      totalEmailsSent: 0,
      emailGrowth: 0,
      openRate: 0,
      openRateGrowth: 0,
      clickRate: 0,
      clickRateGrowth: 0,
      activeContacts: 0,
      contactsGrowth: 0
    };
  }
};

// Campaign data
export const getCampaigns = (): Campaign[] => {
  return [
    {
      id: '1',
      name: 'Welcome Series - Week 1',
      status: 'Sent',
      description: 'Welcome to Qyreach! Get started in 3 easy steps',
      recipients: 1284,
      openRate: 28.4,
      clickRate: 6.7,
      sentDate: '8/24/2024'
    },
    {
      id: '2',
      name: 'Product Update Newsletter',
      status: 'Scheduled',
      description: 'Exciting new features are here!',
      recipients: 2156,
      scheduledDate: '8/26/2024'
    },
    {
      id: '3',
      name: 'Flash Sale Announcement',
      status: 'Draft',
      description: '48 Hours Only: 50% off Premium Plan',
      recipients: 0,
      createdDate: '8/25/2024'
    },
    {
      id: '4',
      name: 'Customer Feedback Survey',
      status: 'Sending',
      description: 'Help us improve - 2 minute survey',
      recipients: 890,
      createdDate: '8/25/2024'
    }
  ];
};

// Email performance analytics data
export const getEmailPerformanceData = (): EmailPerformanceData[] => {
  return [
    { month: 'Jan', emails: 4000, opens: 1120, clicks: 280 },
    { month: 'Feb', emails: 3000, opens: 990, clicks: 198 },
    { month: 'Mar', emails: 2000, opens: 680, clicks: 136 },
    { month: 'Apr', emails: 2780, opens: 890, clicks: 167 },
    { month: 'May', emails: 1890, opens: 567, clicks: 113 },
    { month: 'Jun', emails: 2390, opens: 716, clicks: 143 },
    { month: 'Jul', emails: 3490, opens: 1047, clicks: 209 }
  ];
};

// Recent campaigns data
export const getRecentCampaigns = (): RecentCampaign[] => {
  return [
    {
      id: '1',
      name: 'AI-Generated Welcome Series',
      date: '2024-01-20',
      status: 'Active',
      sent: 3250,
      opens: 32.4,
      clicks: 8.2
    },
    {
      id: '2',
      name: 'Product Launch Announcement',
      date: '2024-01-18',
      status: 'Completed',
      sent: 8420,
      opens: 28.1,
      clicks: 6.8
    },
    {
      id: '3',
      name: 'Weekly Newsletter #52',
      date: '2024-01-22',
      status: 'Scheduled',
      sent: 0,
      opens: 0,
      clicks: 0
    },
    {
      id: '4',
      name: 'Customer Feedback Survey',
      date: '2024-01-23',
      status: 'Draft',
      sent: 0,
      opens: 0,
      clicks: 0
    }
  ];
};

// Usage overview data
export const getUsageOverview = (): UsageOverview => {
  return {
    emailCredits: {
      used: 8234,
      total: 10000,
      percentage: 82
    },
    aiRequests: {
      used: 342,
      total: 500,
      percentage: 68
    },
    contacts: {
      used: 12847,
      total: 25000,
      percentage: 51
    },
    templates: {
      used: 23,
      total: 100,
      percentage: 23
    }
  };
};

// Live activity feed
export const getActivityFeed = (): ActivityFeedItem[] => {
  const now = new Date();
  const getTimeString = (minutesAgo: number) => {
    const time = new Date(now.getTime() - minutesAgo * 60000);
    return time.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return [
    {
      id: '1',
      icon: '👀',
      message: 'Newsletter opened by customer@domain.com',
      timestamp: getTimeString(0)
    },
    {
      id: '2',
      icon: '📧',
      message: 'Welcome email sent to new subscriber',
      timestamp: getTimeString(1)
    },
    {
      id: '3',
      icon: '👆',
      message: 'Product link clicked by user@example.com',
      timestamp: getTimeString(1)
    },
    {
      id: '4',
      icon: '👀',
      message: 'Newsletter opened by customer@domain.com',
      timestamp: getTimeString(2)
    },
    {
      id: '5',
      icon: '🎉',
      message: 'New subscriber joined from landing page',
      timestamp: getTimeString(3)
    }
  ];
};

// System notifications
export const getSystemNotifications = (): SystemNotification[] => {
  return [
    {
      id: '1',
      message: 'Campaign "Welcome Series" achieved 35% open rate!',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      message: 'AI generated 3 new email templates for you',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      message: 'Monthly usage: 82% of email credits used',
      timestamp: '1 day ago'
    }
  ];
};

// Main dashboard metrics calculation function
export const getDashboardMetrics = async (
  campaigns?: Campaign[], 
  contacts?: any[]
): Promise<DashboardMetrics> => {
  return await calculateDashboardMetrics();
};

/**
 * Format number with commas for display
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format percentage for display
 */
export const formatPercentage = (num: number): string => {
  return `${num}%`;
};

/**
 * Get trending indicator for metrics
 */
export const getTrendingIndicator = (
  currentValue: number, 
  previousValue: number
): { trend: 'up' | 'down' | 'neutral'; percentage: number } => {
  if (previousValue === 0) return { trend: 'neutral', percentage: 0 };
  
  const change = ((currentValue - previousValue) / previousValue) * 100;
  const percentage = Math.abs(Math.round(change * 10) / 10);
  
  if (change > 2) return { trend: 'up', percentage };
  if (change < -2) return { trend: 'down', percentage };
  return { trend: 'neutral', percentage };
};

/**
 * Simulate real-time updates by adding small random variations
 */
export const simulateRealTimeUpdates = (baseMetrics: DashboardMetrics): DashboardMetrics => {
  const variance = (base: number, maxChange: number = 5) => {
    const change = Math.floor(Math.random() * maxChange * 2) - maxChange;
    return Math.max(0, base + change);
  };
  
  return {
    ...baseMetrics,
    activeRecipients: variance(baseMetrics.activeRecipients, 10),
    avgOpenRate: Math.round((baseMetrics.avgOpenRate + (Math.random() - 0.5) * 2) * 10) / 10,
    emailsSentToday: variance(baseMetrics.emailsSentToday, 50)
  };
};

/**
 * Cache metrics to localStorage for persistence
 */
export const cacheMetrics = (metrics: DashboardMetrics): void => {
  try {
    localStorage.setItem('dashboardMetrics', JSON.stringify({
      ...metrics,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache metrics:', error);
  }
};

/**
 * Get cached metrics from localStorage
 */
export const getCachedMetrics = (): DashboardMetrics | null => {
  try {
    const cached = localStorage.getItem('dashboardMetrics');
    if (cached) {
      const { timestamp, ...metrics } = JSON.parse(cached);
      // Return cached metrics if less than 5 minutes old
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return metrics as DashboardMetrics;
      }
    }
  } catch (error) {
    console.warn('Failed to get cached metrics:', error);
  }
  return null;
};

/**
 * Get metrics with caching support
 */
export const getMetricsWithCache = async (
  campaigns?: Campaign[], 
  contacts?: any[]
): Promise<DashboardMetrics> => {
  // Try to get from cache first
  const cached = getCachedMetrics();
  if (cached) {
    return cached;
  }
  
  // Calculate fresh metrics
  const metrics = await getDashboardMetrics(campaigns, contacts);
  
  // Cache the results
  cacheMetrics(metrics);
  
  return metrics;
};
