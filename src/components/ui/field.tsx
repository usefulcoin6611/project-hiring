import * as React from "react"
import { cn } from "@/lib/utils"

export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 w-full", className)} {...props} />
}

export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-body-sm sm:text-body-md font-semibold text-fg-strong capitalize", className)}
      {...props}
    />
  )
}
