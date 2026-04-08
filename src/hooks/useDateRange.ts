import { useState, useCallback, useRef } from "react";
import type { DateRange } from "@/types/calendar";

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const undoStack = useRef<DateRange[]>([]);

  const handleDateClick = useCallback((date: Date) => {
    setRange((prev) => {
      undoStack.current.push({ ...prev });
      if (undoStack.current.length > 20) undoStack.current.shift();
      if (!prev.start || prev.end) {
        return { start: date, end: null };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  const handleDragStart = useCallback((date: Date) => {
    setIsDragging(true);
    setRange((prev) => {
      undoStack.current.push({ ...prev });
      return { start: date, end: null };
    });
  }, []);

  const handleDragMove = useCallback(
    (date: Date) => {
      if (!isDragging) return;
      setRange((prev) => ({ start: prev.start, end: date }));
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleHover = useCallback(
    (date: Date | null) => {
      if (isDragging) return;
      setHoverDate(date);
    },
    [isDragging],
  );

  const clearRange = useCallback(() => {
    setRange((prev) => {
      undoStack.current.push({ ...prev });
      return { start: null, end: null };
    });
    setHoverDate(null);
  }, []);

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (prev) setRange(prev);
  }, []);

  const normalizedRange: DateRange = (() => {
    if (!range.start || !range.end) return range;
    const s =
      range.start.getTime() <= range.end.getTime() ? range.start : range.end;
    const e =
      range.start.getTime() <= range.end.getTime() ? range.end : range.start;
    return { start: s, end: e };
  })();

  return {
    range,
    normalizedRange,
    hoverDate,
    isDragging,
    handleDateClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleHover,
    clearRange,
    undo,
  };
}
