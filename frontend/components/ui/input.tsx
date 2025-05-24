import { cn } from "@/lib/utils"
import * as React from "react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base - Ultra minimal
          "flex h-11 w-full bg-transparent px-0 py-3",
          // Typography clean
          "text-base text-foreground placeholder:text-muted-foreground/60",
          // Border bottom only - Clean underline
          "border-0 border-b border-border/40",
          // Focus - Minimal but elegant
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:border-primary",
          // Hover subtle
          "hover:border-border/60",
          // File input clean
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Mobile responsive
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
