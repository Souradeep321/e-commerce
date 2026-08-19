
import { cn } from "@/lib/utils"

export function DotLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 justify-center", className)}>
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
    </div>
  )
}