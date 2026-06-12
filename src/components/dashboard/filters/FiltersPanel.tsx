import React from "react";
import { Search, Plus, SlidersHorizontal, Calendar as CalendarIcon, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusFilter, SortBy } from "@/types/debt";
import { formatRupiah } from "@/lib/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AnimatePresence, motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FiltersPanelProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (val: StatusFilter) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  sortBy: SortBy;
  setSortBy: (val: SortBy) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  maxAmountFilter: number | null;
  setMaxAmountFilter: (val: number | null) => void;
  maxDebtAmount: number;
  onOpenForm: () => void;
  // data stats buat bar chart
  owedToMe: number;
  iOwe: number;
}

export function FiltersPanel({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  maxAmountFilter,
  setMaxAmountFilter,
  maxDebtAmount,
  onOpenForm,
  owedToMe,
  iOwe,
}: FiltersPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isChartOpen, setIsChartOpen] = React.useState(false);



  // Check if any advanced filters are active to highlight the button
  const hasActiveAdvancedFilters = startDate !== "" || endDate !== "" || maxAmountFilter !== null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:relative md:bottom-auto md:left-auto md:right-auto md:z-0 bg-zinc-900 p-3 md:p-4 rounded-xl border border-zinc-800/80 flex flex-row flex-wrap items-center gap-2 md:gap-4 justify-between shadow-2xl md:shadow-sm">

      {/* Search Input */}
      <div className="relative flex-1 min-w-[120px] order-1 md:order-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle" />
        <Input
          placeholder="Cari nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Dropdown Select Filters (Horizontal Scroll on Mobile) */}
      <div className="flex flex-row items-center gap-2 md:gap-4 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none snap-x snap-mandatory w-full md:w-auto order-3 md:order-1 min-w-0">

        {/* Status Filter */}
        <div className="flex-1 min-w-[110px] md:w-auto md:min-w-[128px] md:flex-initial shrink-0 snap-start">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter((val as StatusFilter) || "semua")}>
            <SelectTrigger className="bg-zinc-800 text-fg h-8 text-body-sm md:h-9 md:text-body-md">
              <SelectValue>
                {statusFilter === "semua" ? "Status" : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-fg">
              <SelectItem value="semua" className="text-body-sm sm:text-body-md">Semua</SelectItem>
              <SelectItem value="belum" className="text-body-sm sm:text-body-md">Belum</SelectItem>
              <SelectItem value="lunas" className="text-body-sm sm:text-body-md">Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="flex-1 min-w-[105px] md:w-auto md:min-w-[118px] md:flex-initial shrink-0 snap-start">
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "semua")}>
            <SelectTrigger className="bg-zinc-800 text-fg h-8 text-body-sm md:h-9 md:text-body-md">
              <SelectValue>
                {typeFilter === "semua" ? "Tipe" : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-fg">
              <SelectItem value="semua" className="text-body-sm sm:text-body-md">Semua</SelectItem>
              <SelectItem value="owed_to_me" className="text-body-sm sm:text-body-md">Dihutang</SelectItem>
              <SelectItem value="i_owe" className="text-body-sm sm:text-body-md">Saya Hutang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filter Toggle Button */}
        <button
          onClick={() => { setIsExpanded(!isExpanded); if (isChartOpen) setIsChartOpen(false); }}
          className={`h-8 px-2.5 rounded-lg text-body-sm md:h-9 md:text-body-md shrink-0 flex items-center gap-1.5 transition-all cursor-pointer outline-none border-0 ${hasActiveAdvancedFilters
            ? "border border-brand/50 text-brand bg-brand/5"
            : isExpanded
              ? "bg-zinc-700 text-fg-strong"
              : "text-fg bg-zinc-800 hover:text-fg-strong hover:bg-zinc-750"
            }`}
          title="Filter Lanjutan"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
          <span>Filter</span>
        </button>

        {/* Bar Chart Toggle Button */}
        <button
          onClick={() => { setIsChartOpen(!isChartOpen); if (isExpanded) setIsExpanded(false); }}
          className={`h-8 px-2.5 rounded-lg text-body-sm md:h-9 md:text-body-md shrink-0 flex items-center gap-1.5 transition-all cursor-pointer outline-none border-0 ${isChartOpen
            ? "bg-zinc-700 text-fg-strong"
            : "text-fg bg-zinc-800 hover:text-fg-strong hover:bg-zinc-750"
            }`}
          title="Grafik Perbandingan"
        >
          <BarChart2 className="h-3.5 w-3.5 shrink-0" />
          <span>Grafik</span>
        </button>

      </div>

      {/* Tombol Catat Baru */}
      <Button
        onClick={onOpenForm}
        className="font-bold shrink-0 text-body-sm px-3 sm:px-4 order-2 md:order-3"
      >
        <Plus className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
        <span>Catat Baru</span>
      </Button>

      {/* Collapsible Bar Chart Section */}
      <AnimatePresence initial={false}>
        {isChartOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-full mt-2 p-3 rounded-xl mobile-border md:mt-1 md:p-0 md:pt-3 md:rounded-none md:border-t md:border-zinc-800/40">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-body-sm sm:text-body-md font-semibold text-fg-strong tracking-wide">Total Dihutang vs Hutang</span>
                <span className="text-body-sm sm:text-body-md text-fg-muted">
                  Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(owedToMe + iOwe)}
                </span>
              </div>

              {/* Recharts BarChart */}
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={[
                    { name: "Dihutang", value: owedToMe, fill: "#10b981" },
                    { name: "Saya Hutang", value: iOwe, fill: "#f43f5e" },
                  ]}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#71717a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(0)}jt`
                        : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}rb`
                        : String(v)
                    }
                    tick={{ fill: "#52525b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      fontSize: 12,
                      color: "#e4e4e7",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                    formatter={(value) => [
                      typeof value === "number"
                        ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
                        : "-",
                      "",
                    ]}
                    labelStyle={{ color: "#a1a1aa", marginBottom: 2 }}
                  />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={80}>
                    {[
                      { name: "Dihutang", value: owedToMe, fill: "#10b981" },
                      { name: "Saya Hutang", value: iOwe, fill: "#f43f5e" },
                    ].map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend + Net */}
              <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-zinc-800/40">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="text-body-sm text-fg-muted">Dihutang</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-rose-500" />
                    <span className="text-body-sm text-fg-muted">Saya Hutang</span>
                  </div>
                </div>
                {owedToMe !== iOwe && (
                  <span className={`text-body-sm sm:text-body-md font-bold ${owedToMe >= iOwe ? "text-emerald-400" : "text-rose-400"}`}>
                    Net {owedToMe >= iOwe ? "+" : "-"}
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.abs(owedToMe - iOwe))}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Advanced Filters Section with Smooth Height Animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 rounded-xl mobile-border md:mt-1 md:p-0 md:pt-3 md:rounded-none md:border-t md:border-zinc-800/40">

              {/* Date Range Filter using DatePickerWithRange Component */}
              <DatePickerWithRange
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />

              {/* Amount Slider Filter */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm sm:text-body-md font-semibold text-fg-strong capitalize">Batas Nominal Kasbon</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body-sm sm:text-body-md text-brand font-semibold">
                      Maks: {formatRupiah(maxAmountFilter !== null ? maxAmountFilter : maxDebtAmount)}
                    </span>
                    {maxAmountFilter !== null && (
                      <Button
                        variant="ghost"
                        size="none"
                        onClick={() => setMaxAmountFilter(null)}
                        className="text-body-sm text-red-400 hover:text-red-300 font-semibold px-2 h-6 rounded-md hover:bg-red-500/10 transition-colors"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <span className="text-body-sm text-fg-faint shrink-0">Rp 0</span>
                  <input
                    type="range"
                    min={0}
                    max={maxDebtAmount}
                    step={Math.max(10000, Math.round(maxDebtAmount / 100))}
                    value={maxAmountFilter !== null ? maxAmountFilter : maxDebtAmount}
                    onChange={(e) => setMaxAmountFilter(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-brand outline-none border-style:none!important"
                    style={{
                      background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${((maxAmountFilter !== null ? maxAmountFilter : maxDebtAmount) / maxDebtAmount) * 100}%, rgba(255,255,255,0.05) ${((maxAmountFilter !== null ? maxAmountFilter : maxDebtAmount) / maxDebtAmount) * 100}%, rgba(255,255,255,0.05) 100%)`
                    }}
                  />
                  <span className="text-body-sm text-fg-subtle shrink-0 font-medium">
                    {formatRupiah(maxDebtAmount)}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
