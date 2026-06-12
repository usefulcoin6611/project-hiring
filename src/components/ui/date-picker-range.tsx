"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  className?: string;
}

export function DatePickerWithRange({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  className,
}: DatePickerWithRangeProps) {
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const date: DateRange | undefined = React.useMemo(() => {
    return {
      from: parseLocalDate(startDate),
      to: parseLocalDate(endDate),
    };
  }, [startDate, endDate]);

  const setDate = (range: DateRange | undefined) => {
    if (range?.from) {
      const offset = range.from.getTimezoneOffset();
      const localDate = new Date(range.from.getTime() - offset * 60 * 1000);
      setStartDate(localDate.toISOString().split("T")[0]);
    } else {
      setStartDate("");
    }
    if (range?.to) {
      const offset = range.to.getTimezoneOffset();
      const localDate = new Date(range.to.getTime() - offset * 60 * 1000);
      setEndDate(localDate.toISOString().split("T")[0]);
    } else {
      setEndDate("");
    }
  };

  return (
    <Field className={className}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="date-picker-range">Rentang Tanggal Catatan</FieldLabel>
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="none"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-body-sm text-red-400 hover:text-red-300 font-semibold px-2 h-6 rounded-md hover:bg-red-500/10 transition-colors"
          >
            Reset
          </Button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal border border-black bg-black text-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white/10 backdrop-blur-md border-0 transform transition-all duration-200 ease-out data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
