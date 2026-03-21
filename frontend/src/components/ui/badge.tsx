import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClass = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
  
  const variants = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm",
    warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
    outline: "text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800",
  }

  return (
    <div className={cn(baseClass, variants[variant], className)} {...props} />
  )
}

export { Badge }
