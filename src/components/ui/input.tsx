import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg bg-zinc-950 border border-zinc-700/80 px-3 py-1.5 text-sm transition-all outline-none placeholder:text-fg-faint hover:border-zinc-500 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:opacity-50 text-fg-strong",
        className
      )}
      {...props}
    />
  )
}

export { Input }

