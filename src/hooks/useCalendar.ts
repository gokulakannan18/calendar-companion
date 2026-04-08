import { useState, useMemo, useCallback } from "react";
import type { CalendarDay, DateRange, NotesMap } from "@/types/calendar";
import {
  generateCalendarGrid,
  isSameDay,
  isDateInRange,
  formatDateKey,
} from "@/utils/date";
import { hasEvent } from "@/utils/events";

interface UseCalendarOptions {
  range: DateRange;
  notes: NotesMap;
  hoverDate: Date | null;
}

export function useCalendar({ range, notes, hoverDate }: UseCalendarOptions) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const goToPrevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }, [today]);

  const goToMonth = useCallback((y: number, m: number) => {
    setYear(y);
    setMonth(m);
  }, []);

  const days: CalendarDay[] = useMemo(() => {
    const grid = generateCalendarGrid(year, month);
    return grid.map((date) => {
      const key = formatDateKey(date);
      const isToday = isSameDay(date, today);
      const inRange = isDateInRange(date, range.start, range.end);
      const isStart = range.start ? isSameDay(date, range.start) : false;
      const isEnd = range.end ? isSameDay(date, range.end) : false;

      // Hover preview: when start is selected but end isn't, show preview
      let isHoverPreview = false;
      if (range.start && !range.end && hoverDate) {
        isHoverPreview = isDateInRange(date, range.start, hoverDate);
      }

      return {
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday,
        isInRange: inRange,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
        isHoverPreview,
        hasNotes: (notes[key]?.length ?? 0) > 0,
        hasEvent: hasEvent(key),
      };
    });
  }, [year, month, today, range, notes, hoverDate]);

  return { year, month, days, goToPrevMonth, goToNextMonth, goToToday, goToMonth };
}
