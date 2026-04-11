"use client"

import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { DateRange } from "react-day-picker"
import { motion, AnimatePresence } from "framer-motion"
import * as Popover from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"

interface DateFilterProps {
  startDate: string
  endDate: string
  onStartChange: (date: string) => void
  onEndChange: (date: string) => void
  onClear: () => void
}

export function DateFilter({ startDate, endDate, onStartChange, onEndChange, onClear }: DateFilterProps) {
  const [open, setOpen] = React.useState(false)

  // The calendar is fully controlled by local state ONLY.
  // We NEVER call parent callbacks mid-selection — doing so causes a parent
  // re-render that interrupts react-day-picker's internal two-click range machine,
  // which is why it took multiple clicks and highlights were wrong.
  const [localRange, setLocalRange] = React.useState<DateRange | undefined>(undefined)

  // Initialise local state from props only when the popover opens
  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    if (isOpen) {
      // Seed current filter into local state so the calendar shows the active range
      const start = startDate ? parseISO(startDate) : undefined
      const end = endDate ? parseISO(endDate) : undefined
      if (start && isValid(start)) {
        setLocalRange({ from: start, to: end && isValid(end) ? end : undefined })
      } else {
        setLocalRange(undefined)
      }
    }
    setOpen(isOpen)
  }, [startDate, endDate])

  const handleSelect = (range: DateRange | undefined) => {
    // Update the calendar display immediately — no parent calls here
    setLocalRange(range)

    // Only push to parent when the user has selected a COMPLETE range (both dates).
    // This ensures zero parent re-renders during the two-click selection flow.
    if (range?.from && range?.to) {
      onStartChange(format(range.from, "yyyy-MM-dd"))
      onEndChange(format(range.to, "yyyy-MM-dd"))
      // Close the popover once a complete range is committed
      setTimeout(() => setOpen(false), 150)
    }
  }

  const handleClear = () => {
    setLocalRange(undefined)
    onClear()
    setOpen(false)
  }

  // Display label comes from the committed parent values, not the in-progress local range
  const displayStart = startDate ? parseISO(startDate) : undefined
  const displayEnd = endDate ? parseISO(endDate) : undefined
  const hasFilter = !!(startDate || endDate)

  return (
    <div className="flex items-center gap-2">
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            className={cn(
              "flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 transition-all hover:bg-gray-800 focus:outline-none focus:border-emerald-500/50 min-h-[46px] group",
              hasFilter ? "text-white border-emerald-500/50 bg-emerald-500/5" : "text-gray-400"
            )}
          >
            <CalendarIcon className={cn(
              "w-4 h-4 transition-colors flex-shrink-0",
              hasFilter ? "text-emerald-400" : "text-gray-500 group-hover:text-gray-300"
            )} />
            <span className="text-[13px] font-medium tracking-tight whitespace-nowrap">
              {hasFilter && displayStart && isValid(displayStart) ? (
                displayEnd && isValid(displayEnd) ? (
                  <>{format(displayStart, "MMM dd, yyyy")} – {format(displayEnd, "MMM dd, yyyy")}</>
                ) : (
                  format(displayStart, "MMM dd, yyyy")
                )
              ) : (
                "Filter by date"
              )}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-auto max-w-[95vw] sm:max-w-[680px] bg-gray-900 border border-gray-800 p-0 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden"
            align="end"
            sideOffset={12}
            // Prevent popover from closing when clicking inside the calendar
            onInteractOutside={(e) => {
              setOpen(false)
            }}
          >
            {/* Header */}
            <div className="border-b border-gray-800 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Date Range</p>
                {localRange?.from && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {localRange.to
                      ? `${format(localRange.from, "MMM dd")} → ${format(localRange.to, "MMM dd, yyyy")}`
                      : `${format(localRange.from, "MMM dd, yyyy")} — pick an end date`}
                  </p>
                )}
              </div>
              {(hasFilter || localRange?.from) && (
                <button
                  onClick={handleClear}
                  className="text-[10px] uppercase font-black tracking-widest text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
                >
                  <X className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <Calendar
              initialFocus
              mode="range"
              defaultMonth={localRange?.from ?? new Date()}
              selected={localRange}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <AnimatePresence>
        {hasFilter && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-500 hover:text-white transition-all hover:bg-gray-800 flex items-center justify-center min-h-[46px] w-[46px]"
            title="Clear date filter"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
