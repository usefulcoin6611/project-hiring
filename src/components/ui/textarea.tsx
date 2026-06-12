import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg bg-zinc-950 border border-zinc-700/80 px-3 py-2 text-sm transition-all outline-none placeholder:text-fg-faint hover:border-zinc-500 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:opacity-50 text-fg-strong",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
