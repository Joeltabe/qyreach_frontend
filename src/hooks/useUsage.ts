import { useState, useEffect } from 'react'
import { usageApi, type UsageStats, type PlanLimits } from '../lib/api'

export function useUsage() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [limits, setLimits] = useState<PlanLimits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [statsResponse, limitsResponse] = await Promise.all([
        usageApi.getStats(),
        usageApi.getLimits(),
      ])

      if (statsResponse.data.success && statsResponse.data.data) {
        setStats(statsResponse.data.data)
      }

      if (limitsResponse.data.success && limitsResponse.data.data) {
        setLimits(limitsResponse.data.data)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch usage data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [])

  const getUsagePercentage = (current: number, max: number): number => {
    if (max === -1) return 0 // Unlimited
    return Math.min((current / max) * 100, 100)
  }

  const isNearLimit = (current: number, max: number, threshold: number = 80): boolean => {
    if (max === -1) return false // Unlimited
    return (current / max) * 100 >= threshold
  }

  const isOverLimit = (current: number, max: number): boolean => {
    if (max === -1) return false // Unlimited
    return current >= max
  }

  return {
    stats,
    limits,
    isLoading,
    error,
    refetch: fetchUsage,
    getUsagePercentage,
    isNearLimit,
    isOverLimit,
  }
}
