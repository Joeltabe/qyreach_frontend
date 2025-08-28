"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className
}: DatePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      onDateChange?.(new Date(value))
    } else {
      onDateChange?.(undefined)
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toISOString().split('T')[0]
  }

  return (
    <input
      type="date"
      value={formatDate(date)}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}
