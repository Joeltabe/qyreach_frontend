import { forwardRef } from 'react'

interface ProgressProps {
  value?: number
  max?: number
  className?: string
  animated?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, className = '', animated = false }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div
        ref={ref}
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden ${className}`}
      >
        <div
          className={`h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)

Progress.displayName = 'Progress'
