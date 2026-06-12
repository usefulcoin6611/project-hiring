"use client";

import React from "react";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { formatInputRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { id as idLocale } from "date-fns/locale";

interface DebtFormContentProps {
  formError: string;
  formType: "owed_to_me" | "i_owe";
  setFormType: (val: "owed_to_me" | "i_owe") => void;
  formName: string;
  setFormName: (val: string) => void;
  formAmount: string;
  setFormAmount: (val: string) => void;
  formDueDate: string;
  setFormDueDate: (val: string) => void;
  formNote: string;
  setFormNote: (val: string) => void;
  formLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  onCancel: () => void;
  hideFooter?: boolean;
}

export function DebtFormContent({
  formError,
  formType,
  setFormType,
  formName,
  setFormName,
  formAmount,
  setFormAmount,
  formDueDate,
  setFormDueDate,
  formNote,
  setFormNote,
  formLoading,
  onSubmit,
  onCancel,
  hideFooter = false,
}: DebtFormContentProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  // Portal kalender di-render ke dalam Dialog (kalau ada) supaya tidak rebutan
  // focus-trap & deteksi "klik di luar" dengan Radix Dialog. Di mobile (BottomSheet,
  // tanpa role="dialog") nilainya null → portal default ke body, dan itu memang aman.
  const [popoverContainer, setPopoverContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const dialog = formRef.current?.closest<HTMLElement>('[role="dialog"]') ?? null;
    setPopoverContainer(dialog);
  }, []);

  return (
    <form ref={formRef} id="debt-form" onSubmit={onSubmit} className="space-y-4 pt-2 pb-0">
      {formError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-body-md text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Radio Group Type */}
      <div className="space-y-2">
        <Label className="text-fg">Tipe Transaksi</Label>
        <RadioGroup 
          value={formType} 
          onValueChange={(val) => setFormType(val as "owed_to_me" | "i_owe")}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 rounded-lg bg-zinc-950/40 hover:bg-zinc-800/50 p-3 transition cursor-pointer">
            <RadioGroupItem value="owed_to_me" id="type-owed" className="text-emerald-500" />
            <Label htmlFor="type-owed" className="text-body-md font-medium text-emerald-400 cursor-pointer">Saya Dihutang</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-zinc-950/40 hover:bg-zinc-800/50 p-3 transition cursor-pointer">
            <RadioGroupItem value="i_owe" id="type-owe" className="text-rose-500" />
            <Label htmlFor="type-owe" className="text-body-md font-medium text-rose-400 cursor-pointer">Saya Hutang</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="form-name" className="text-fg">Nama Orang</Label>
        <Input
          id="form-name"
          placeholder="mis. Budi, Andi, Ani"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="pl-3"
        />
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="form-amount" className="text-fg">Jumlah Uang (Rupiah)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-md text-fg-subtle font-semibold">Rp</span>
          <Input
            id="form-amount"
            type="text"
            placeholder="50.000"
            value={formAmount}
            onChange={(e) => setFormAmount(formatInputRupiah(e.target.value))}
            className="pl-9"
          />
        </div>
      </div>

      {/* Transaction Date Input */}
      <div className="space-y-2 flex flex-col">
        <Label htmlFor="form-due-date" className="text-fg">Tanggal Ngutang</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger
            id="form-due-date"
            type="button"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start text-left font-normal h-9 bg-zinc-950 border border-zinc-800 text-fg-strong hover:bg-zinc-800 hover:text-fg-strong hover:border-zinc-700 focus-visible:border-brand/60 focus-visible:ring-1 focus-visible:ring-brand/20",
              !formDueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-fg-muted shrink-0" />
            {formDueDate ? (
              (() => {
                const [y, m, d] = formDueDate.split("-").map(Number);
                return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              })()
            ) : (
              <span className="text-fg-subtle text-body-md">Pilih tanggal...</span>
            )}
          </PopoverTrigger>
          <PopoverContent
            container={popoverContainer}
            className="w-auto p-0 bg-white/10 backdrop-blur-md border-0 transform transition-all duration-200 ease-out data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
            align="start"
          >
            <Calendar
              mode="single"
              locale={idLocale}
              selected={
                formDueDate
                  ? (() => {
                      const [y, m, d] = formDueDate.split("-").map(Number);
                      return new Date(y, m - 1, d);
                    })()
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const offset = date.getTimezoneOffset();
                  const localDate = new Date(date.getTime() - offset * 60 * 1000);
                  setFormDueDate(localDate.toISOString().split("T")[0]);
                  setCalendarOpen(false);
                } else {
                  setFormDueDate("");
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Note Input */}
      <div className="space-y-2">
        <Label htmlFor="form-note" className="text-fg flex justify-between">
          <span>Catatan</span>
          <span className="text-caption text-fg-subtle">{formNote.length}/200</span>
        </Label>
        <Textarea
          id="form-note"
          placeholder="mis. buat patungan makan siang bareng kemarin (opsional)"
          maxLength={200}
          value={formNote}
          onChange={(e) => setFormNote(e.target.value)}
          className="min-h-[70px] resize-none"
        />
      </div>

      {/* Submit / Cancel Buttons */}
      {!hideFooter && (
        <DialogFooter className="pt-4 flex flex-row gap-2 w-full *:flex-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-fg-muted hover:text-fg"
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-brand hover:bg-brand-hover text-brand-foreground font-bold"
            loading={formLoading}
            loadingText="Menyimpan..."
          >
            Simpan Catatan
          </Button>
        </DialogFooter>
      )}
    </form>
  );
}
