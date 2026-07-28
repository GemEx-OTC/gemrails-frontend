"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-gray-900", className)}
      classNames={{
        ...defaultClassNames,
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
        month: "space-y-6",
        month_caption: "flex justify-center pt-2 relative items-center mb-4 px-8",
        caption_label: "text-sm font-bold text-gray-200 tracking-tight",
        nav: "flex items-center",
        button_previous: cn(
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all rounded-xl border border-gray-800 hover:bg-gray-800 absolute left-2 top-0 z-20 flex items-center justify-center"
        ),
        button_next: cn(
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all rounded-xl border border-gray-800 hover:bg-gray-800 absolute right-2 top-0 z-20 flex items-center justify-center"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7 gap-1 mb-2",
        weekday: "text-gray-500 rounded-md w-10 font-medium text-[0.7rem] uppercase tracking-widest text-center",
        weeks: "space-y-1",
        week: "grid grid-cols-7 gap-1",
        day: "p-0",
        day_button: cn(
          "h-10 w-10 p-0 font-normal hover:bg-emerald-500/20 rounded-xl transition-all text-gray-400 flex items-center justify-center cursor-pointer relative text-sm w-full outline-none"
        ),
        range_start: "bg-emerald-500 text-white rounded-l-xl rounded-r-none font-bold shadow-lg shadow-emerald-500/20",
        range_end: "bg-emerald-500 text-white rounded-r-xl rounded-l-none font-bold shadow-lg shadow-emerald-500/20",
        range_middle: "bg-emerald-500/10 text-emerald-400 rounded-none",
        selected: "bg-emerald-500 text-white font-bold",
        today: "text-emerald-400 font-bold border-b-2 border-emerald-500",
        outside: "text-gray-700 opacity-50",
        disabled: "text-gray-700 opacity-50 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        }
      }}
      fixedWeeks
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
