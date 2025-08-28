import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  placeholder?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, value, onValueChange, disabled, placeholder, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value)
  }

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
          className
        )}
        {...props}
      >
        {placeholder && <option value="" disabled hidden>{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full", className)} {...props}>
    {children}
  </div>
)

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  // This component is not used in the simple implementation
  void placeholder
  return null
}

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

const SelectItem = ({ value, children, className }: SelectItemProps) => (
  <option value={value} className={className}>
    {children}
  </option>
)

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
