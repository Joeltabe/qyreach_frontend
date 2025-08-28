import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardMetrics,
  getMetricsWithCache,
  simulateRealTimeUpdates,
  formatNumber,
  formatPercentage,
  getTrendingIndicator,
  type DashboardMetrics
} from '../utils/dashboardMetrics';

interface UseDashboardMetricsOptions {
  enableRealTime?: boolean;
  updateInterval?: number; // in milliseconds
  useCache?: boolean;
}

interface DashboardMetricsHook {
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
  formattedMetrics: {
    totalCampaigns: string;
    activeRecipients: string;
    avgOpenRate: string;
    emailsSentToday: string;
  };
  trends: {
    totalCampaigns: { trend: 'up' | 'down' | 'neutral'; percentage: number };
    activeRecipients: { trend: 'up' | 'down' | 'neutral'; percentage: number };
    avgOpenRate: { trend: 'up' | 'down' | 'neutral'; percentage: number };
    emailsSentToday: { trend: 'up' | 'down' | 'neutral'; percentage: number };
  };
  refreshMetrics: () => void;
}

export const useDashboardMetrics = (
  options: UseDashboardMetricsOptions = {}
): DashboardMetricsHook => {
  const {
    enableRealTime = false,
    updateInterval = 30000, // 30 seconds
    useCache = true
  } = options;

  const [metrics, setMetrics] = useState<DashboardMetrics>({
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
  });

  const [previousMetrics, setPreviousMetrics] = useState<DashboardMetrics>({
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newMetrics = useCache 
        ? await getMetricsWithCache() 
        : await getDashboardMetrics();
      
      setPreviousMetrics(metrics);
      setMetrics(enableRealTime ? simulateRealTimeUpdates(newMetrics) : newMetrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard metrics';
      setError(errorMessage);
      console.error('Failed to fetch dashboard metrics:', err);
      // Keep existing metrics on error
    } finally {
      setLoading(false);
    }
  }, [useCache, enableRealTime, metrics]);

  const refreshMetrics = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Initial load
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!enableRealTime) return;

    const interval = setInterval(() => {
      const updatedMetrics = simulateRealTimeUpdates(metrics);
      setPreviousMetrics(metrics);
      setMetrics(updatedMetrics);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enableRealTime, updateInterval, metrics]);

  // Format metrics for display
  const formattedMetrics = {
    totalCampaigns: formatNumber(metrics.totalCampaigns),
    activeRecipients: formatNumber(metrics.activeRecipients),
    avgOpenRate: formatPercentage(metrics.avgOpenRate),
    emailsSentToday: formatNumber(metrics.emailsSentToday)
  };

  // Calculate trends
  const trends = {
    totalCampaigns: getTrendingIndicator(metrics.totalCampaigns, previousMetrics.totalCampaigns),
    activeRecipients: getTrendingIndicator(metrics.activeRecipients, previousMetrics.activeRecipients),
    avgOpenRate: getTrendingIndicator(metrics.avgOpenRate, previousMetrics.avgOpenRate),
    emailsSentToday: getTrendingIndicator(metrics.emailsSentToday, previousMetrics.emailsSentToday)
  };

  return {
    metrics,
    formattedMetrics,
    trends,
    loading,
    error,
    refreshMetrics
  };
};
