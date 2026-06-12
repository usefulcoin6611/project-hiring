import * as React from "react"

import { cn } from "@/lib/utils"
function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; variant?: "default" | "empty" | "auth" | "dashboard" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl text-sm text-card-foreground [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        variant === "default" && "bg-zinc-900 border border-zinc-800/80 py-(--card-spacing)",
        variant === "empty" && "bg-zinc-900 border border-zinc-800/80 items-center justify-center text-center p-6 min-h-[250px] md:min-h-[300px]",
        variant === "auth" && "border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-6",
        variant === "dashboard" && "bg-zinc-950/65 backdrop-blur-md border! border-solid! border-white/[0.06]! md:bg-zinc-900 md:backdrop-blur-none md:border-none! p-3 sm:p-4 rounded-xl flex flex-col gap-2 sm:gap-4 h-[500px] md:h-[380px] w-full",
        className
      )}
      {...props}
    />
  )
}


function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "group-data-[variant=empty]/card:flex group-data-[variant=empty]/card:flex-col group-data-[variant=empty]/card:items-center group-data-[variant=empty]/card:pb-2",
        "group-data-[variant=auth]/card:space-y-1 group-data-[variant=auth]/card:text-center group-data-[variant=auth]/card:px-0 group-data-[variant=auth]/card:pb-2",
        "group-data-[variant=dashboard]/card:flex group-data-[variant=dashboard]/card:flex-row group-data-[variant=dashboard]/card:items-center group-data-[variant=dashboard]/card:justify-between group-data-[variant=dashboard]/card:border-b group-data-[variant=dashboard]/card:border-zinc-800/40 group-data-[variant=dashboard]/card:pb-2.5 group-data-[variant=dashboard]/card:px-0 group-data-[variant=dashboard]/card:space-y-0",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        "group-data-[variant=empty]/card:text-title-md group-data-[variant=empty]/card:text-fg",
        "group-data-[variant=auth]/card:text-display-1",
        "group-data-[variant=dashboard]/card:text-title-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-body-md text-muted-foreground",
        "group-data-[variant=empty]/card:max-w-sm group-data-[variant=empty]/card:mx-auto",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-(--card-spacing)",
        "group-data-[variant=auth]/card:px-0",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl bg-muted/50 p-(--card-spacing)",
        "group-data-[variant=auth]/card:flex group-data-[variant=auth]/card:flex-col group-data-[variant=auth]/card:gap-4 group-data-[variant=auth]/card:bg-transparent group-data-[variant=auth]/card:p-0",
        className
      )}
      {...props}
    />
  )
}

function CardIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-icon"
      className={cn(
        "p-3 rounded-full bg-zinc-950 text-fg-faint mb-2 flex items-center justify-center shrink-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardIcon,
}
