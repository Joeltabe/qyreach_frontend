import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';

interface MetricsCardProps {
  title: string;
  value: string;
  trend?: {
    trend: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    trend: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    trend: 'text-green-600 dark:text-green-400'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    trend: 'text-purple-600 dark:text-purple-400'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    trend: 'text-orange-600 dark:text-orange-400'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'text-red-600 dark:text-red-400'
  }
};

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  trend,
  icon,
  color = 'blue',
  loading = false
}) => {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (!trend || trend.percentage === 0) return <Minus className="w-4 h-4" />;
    
    switch (trend.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend || trend.percentage === 0) return 'text-gray-500';
    
    switch (trend.trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            
            {loading ? (
              <div className="mt-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <motion.p
                key={value}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"
              >
                {value}
              </motion.p>
            )}

            {trend && !loading && (
              <div className={`flex items-center mt-2 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium ml-1">
                  {trend.percentage > 0 && `${trend.percentage}%`}
                  {trend.percentage === 0 && 'No change'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  vs last period
                </span>
              </div>
            )}
          </div>

          {icon && (
            <div className={`p-3 rounded-lg ${colors.bg}`}>
              <div className={colors.icon}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
