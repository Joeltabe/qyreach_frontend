import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Mail, RefreshCw } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { Button } from '../ui/Button';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';

interface DashboardMetricsProps {
  enableRealTime?: boolean;
  updateInterval?: number;
  className?: string;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  enableRealTime = false,
  updateInterval = 30000,
  className = ''
}) => {
  const { formattedMetrics, trends, loading, refreshMetrics } = useDashboardMetrics({
    enableRealTime,
    updateInterval,
    useCache: true
  });

  const metricsData = [
    {
      title: 'Total Campaigns',
      value: formattedMetrics.totalCampaigns,
      trend: trends.totalCampaigns,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'blue' as const
    },
    {
      title: 'Active Recipients',
      value: formattedMetrics.activeRecipients,
      trend: trends.activeRecipients,
      icon: <Users className="w-6 h-6" />,
      color: 'green' as const
    },
    {
      title: 'Avg Open Rate',
      value: formattedMetrics.avgOpenRate,
      trend: trends.avgOpenRate,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple' as const
    },
    {
      title: 'Emails Sent Today',
      value: formattedMetrics.emailsSentToday,
      trend: trends.emailsSentToday,
      icon: <Mail className="w-6 h-6" />,
      color: 'orange' as const
    }
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your email marketing performance
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshMetrics}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricsCard
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
              icon={metric.icon}
              color={metric.color}
              loading={loading}
            />
          </motion.div>
        ))}
      </div>

      {enableRealTime && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time updates enabled
          </div>
        </div>
      )}
    </div>
  );
};
