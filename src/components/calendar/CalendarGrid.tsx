import { memo, useCallback, useRef } from "react";
import type { CalendarDay } from "@/types/calendar";
import { getDayLabels, formatDateKey } from "@/utils/date";
import { getEventsForDate } from "@/utils/events";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  days: CalendarDay[];
  onDateClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
  onDragStart: (date: Date) => void;
  onDragMove: (date: Date) => void;
  onDragEnd: () => void;
  selectedDate: Date | null;
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
}

const EVENT_COLORS: Record<string, string> = {
  holiday: "bg-destructive",
  reminder: "bg-accent",
  meeting: "bg-primary",
};

const DayCell = memo(function DayCell({
  day,
  index,
  onClick,
  onHover,
  onDragStart,
  onDragMove,
  isSelected,
  isFocused,
}: {
  day: CalendarDay;
  index: number;
  onClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
  onDragStart: (date: Date) => void;
  onDragMove: (date: Date) => void;
  isSelected: boolean;
  isFocused: boolean;
}) {
  const events = day.hasEvent ? getEventsForDate(formatDateKey(day.date)) : [];
  const ref = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node && isFocused) node.focus();
    },
    [isFocused],
  );

  return (
    <button
      ref={ref}
      type="button"
      role="gridcell"
      data-index={index}
      onClick={() => onClick(day.date)}
      onMouseEnter={() => onHover(day.date)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => {
        e.preventDefault();
        onDragStart(day.date);
      }}
      onMouseOver={() => onDragMove(day.date)}
      onTouchStart={() => onDragStart(day.date)}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el) {
          const idx = (el as HTMLElement).dataset.index;
          if (idx !== undefined) onDragMove(day.date);
        }
      }}
      tabIndex={isFocused ? 0 : -1}
      aria-label={day.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      aria-selected={isSelected || day.isInRange}
      className={cn(
        "group relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium calendar-transition select-none",
        "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10",
        "active:scale-95 active:transition-transform active:duration-100",
        !day.isCurrentMonth && "text-muted-foreground/40",
        day.isCurrentMonth && "text-foreground",
        day.isHoverPreview &&
          !day.isInRange &&
          !day.isRangeStart &&
          "bg-range/50 text-range-foreground rounded-none",
        day.isToday &&
          "bg-today text-today-foreground font-bold shadow-sm hover:bg-today/90",
        day.isInRange &&
          !day.isRangeStart &&
          !day.isRangeEnd &&
          !day.isToday &&
          "bg-range text-range-foreground rounded-none",
        day.isRangeStart &&
          !day.isToday &&
          "bg-primary text-primary-foreground shadow-sm rounded-r-none",
        day.isRangeEnd &&
          !day.isRangeStart &&
          !day.isToday &&
          "bg-primary text-primary-foreground shadow-sm rounded-l-none",
        day.isRangeStart && day.isRangeEnd && "rounded-lg",
        isSelected &&
          !day.isToday &&
          !day.isRangeStart &&
          !day.isRangeEnd &&
          "ring-2 ring-primary",
      )}
    >
      {day.date.getDate()}
      {(day.hasNotes || day.hasEvent) && (
        <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {day.hasNotes && (
            <span className="h-1 w-1 rounded-full bg-note-indicator" />
          )}
          {events.map((ev, i) => (
            <span
              key={i}
              className={cn("h-1 w-1 rounded-full", EVENT_COLORS[ev.type])}
            />
          ))}
        </span>
      )}
      {events.length > 0 && (
        <span className="pointer-events-none absolute -top-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
          {events.map((e) => e.title).join(", ")}
        </span>
      )}
    </button>
  );
});

export const CalendarGrid = memo(function CalendarGrid({
  days,
  onDateClick,
  onHover,
  onDragStart,
  onDragMove,
  onDragEnd,
  selectedDate,
  focusedIndex,
  onFocusedIndexChange,
}: CalendarGridProps) {
  const labels = getDayLabels();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = focusedIndex;
      switch (e.key) {
        case "ArrowRight":
          next = Math.min(focusedIndex + 1, days.length - 1);
          break;
        case "ArrowLeft":
          next = Math.max(focusedIndex - 1, 0);
          break;
        case "ArrowDown":
          next = Math.min(focusedIndex + 7, days.length - 1);
          break;
        case "ArrowUp":
          next = Math.max(focusedIndex - 7, 0);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onDateClick(days[focusedIndex].date);
          return;
        default:
          return;
      }
      e.preventDefault();
      onFocusedIndexChange(next);
      if (e.shiftKey) {
        onDateClick(days[next].date);
      }
    },
    [focusedIndex, days, onDateClick, onFocusedIndexChange],
  );

  return (
    <div
      className="p-3 sm:p-4"
      role="grid"
      aria-label="Calendar"
      onKeyDown={handleKeyDown}
      onMouseUp={onDragEnd}
      onTouchEnd={onDragEnd}
      ref={gridRef}
    >
      <div className="mb-2 grid grid-cols-7 gap-1" role="row">
        {labels.map((label) => (
          <div
            key={label}
            role="columnheader"
            className="flex h-8 items-center justify-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="rowgroup">
        {days.map((day, i) => (
          <DayCell
            key={i}
            day={day}
            index={i}
            onClick={onDateClick}
            onHover={onHover}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            isSelected={
              selectedDate !== null &&
              day.date.getFullYear() === selectedDate.getFullYear() &&
              day.date.getMonth() === selectedDate.getMonth() &&
              day.date.getDate() === selectedDate.getDate()
            }
            isFocused={focusedIndex === i}
          />
        ))}
      </div>
    </div>
  );
});
