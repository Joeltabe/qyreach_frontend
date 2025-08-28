import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'bordered'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-800 shadow-md',
      glass: 'bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/20',
      elevated: 'bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300',
      bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)}
      {...props}
    />
  )
)

CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'
