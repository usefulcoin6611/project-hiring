"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah, formatRupiahParts } from "@/lib/format";
import { DebtStats } from "@/types/debt";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: DebtStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const renderStatsValue = (value: number, colorClass: string, showPlusSign: boolean = false) => {
    const { numberPart, isNegative, prefix } = formatRupiahParts(value);
    
    return (
      <span className={cn(colorClass, "text-[11px] xs:text-[13px] sm:text-value-lg font-bold tracking-tight")}>
        {showPlusSign && value >= 0 && "+"}
        {isNegative && "-"}
        <span className="text-[8.5px] xs:text-[10px] sm:text-value-lg font-semibold sm:font-bold mr-0.5 sm:mr-1 align-baseline">{prefix}</span>
        {numberPart}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory">
      {/* Card 1: Dihutang ke Saya (Piutang) */}
      <Card className="bg-zinc-900 relative overflow-hidden snap-start min-w-[110px] sm:min-w-0 flex flex-col justify-center [--card-spacing:--spacing(3)] sm:[--card-spacing:--spacing(4)]">
        <div className="absolute top-0 right-0 p-2 text-emerald-500/5 sm:text-emerald-500/10">
          <ArrowDownLeft className="h-12 w-12 sm:h-20 sm:w-20 -mr-1.5 -mt-1.5 sm:-mr-3 sm:-mt-3" />
        </div>
        <CardHeader>
          <CardDescription className="text-fg-muted text-[9.5px] xs:text-[10.5px] sm:text-title-sm leading-tight normal-case">
            Total dihutang ke saya
          </CardDescription>
          <CardTitle className="text-[11px] xs:text-[13px] sm:text-value-lg font-bold mt-0.5 sm:mt-1 truncate">
            {renderStatsValue(stats.owedToMe, "text-emerald-400")}
          </CardTitle>
        </CardHeader>
        <CardContent className="hidden sm:block">
          <p className="text-body-sm text-fg-subtle">Uang kamu di orang lain.</p>
        </CardContent>
      </Card>

      {/* Card 2: Saya Hutang (Utang) */}
      <Card className="bg-zinc-900 relative overflow-hidden snap-start min-w-[110px] sm:min-w-0 flex flex-col justify-center [--card-spacing:--spacing(3)] sm:[--card-spacing:--spacing(4)]">
        <div className="absolute top-0 right-0 p-2 text-rose-500/5 sm:text-rose-500/10">
          <ArrowUpRight className="h-12 w-12 sm:h-20 sm:w-20 -mr-1.5 -mt-1.5 sm:-mr-3 sm:-mt-3" />
        </div>
        <CardHeader>
          <CardDescription className="text-fg-muted text-[9.5px] xs:text-[10.5px] sm:text-title-sm leading-tight normal-case">
            Total saya hutang
          </CardDescription>
          <CardTitle className="text-[11px] xs:text-[13px] sm:text-value-lg font-bold mt-0.5 sm:mt-1 truncate">
            {renderStatsValue(stats.iOwe, "text-rose-500")}
          </CardTitle>
        </CardHeader>
        <CardContent className="hidden sm:block">
          <p className="text-body-sm text-fg-subtle">Uang orang lain di kamu.</p>
        </CardContent>
      </Card>

      {/* Card 3: Net (Selisih) */}
      <Card className="bg-zinc-900 relative overflow-hidden snap-start min-w-[110px] sm:min-w-0 flex flex-col justify-center [--card-spacing:--spacing(3)] sm:[--card-spacing:--spacing(4)]">
        <div className="absolute top-0 right-0 p-2 text-fg-subtle/5 sm:text-fg-subtle/10">
          <DollarSign className="h-12 w-12 sm:h-20 sm:w-20 -mr-1.5 -mt-1.5 sm:-mr-3 sm:-mt-3" />
        </div>
        <CardHeader>
          <CardDescription className="text-fg-muted text-[9.5px] xs:text-[10.5px] sm:text-title-sm leading-tight normal-case">Net (Selisih)</CardDescription>
          <CardTitle className="text-[11px] xs:text-[13px] sm:text-value-lg font-bold mt-0.5 sm:mt-1 truncate">
            {renderStatsValue(stats.net, stats.net >= 0 ? "text-emerald-400" : "text-rose-500", true)}
          </CardTitle>
        </CardHeader>
        <CardContent className="hidden sm:block">
          <p className="text-body-sm text-fg-subtle">Selisih bersih sisa.</p>
        </CardContent>
      </Card>
    </div>
  );

}
