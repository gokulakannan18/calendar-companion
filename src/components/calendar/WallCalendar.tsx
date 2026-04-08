import { useCallback, useState, useTransition } from "react";
import type { NotesMap } from "@/types/calendar";
import { formatDateKey, generateId } from "@/utils/date";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDarkMode } from "@/hooks/useDarkMode";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { NotesPanel } from "./NotesPanel";

export function WallCalendar() {
  const [notes, setNotes] = useLocalStorage<NotesMap>("calendar-notes", {});
  const { theme, setTheme } = useDarkMode();
  const {
    range,
    normalizedRange,
    hoverDate,
    handleDateClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleHover,
    clearRange,
    undo,
  } = useDateRange();
  const {
    year,
    month,
    days,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
  } = useCalendar({
    range: normalizedRange,
    notes,
    hoverDate,
  });

  const [isPending, startTransition] = useTransition();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const wrappedPrev = useCallback(() => {
    startTransition(() => goToPrevMonth());
  }, [goToPrevMonth]);

  const wrappedNext = useCallback(() => {
    startTransition(() => goToNextMonth());
  }, [goToNextMonth]);

  const wrappedGoToMonth = useCallback(
    (y: number, m: number) => {
      startTransition(() => goToMonth(y, m));
    },
    [goToMonth],
  );

  const addNote = useCallback(
    (dateKey: string, text: string) => {
      setNotes((prev) => ({
        ...prev,
        [dateKey]: [
          ...(prev[dateKey] ?? []),
          {
            id: generateId(),
            date: dateKey,
            text,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (dateKey: string, noteId: string) => {
      setNotes((prev) => ({
        ...prev,
        [dateKey]: (prev[dateKey] ?? []).filter((n) => n.id !== noteId),
      }));
    },
    [setNotes],
  );

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="overflow-hidden rounded-xl border bg-card shadow-lg lg:grid lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col">
          <CalendarHeader
            year={year}
            month={month}
            onPrev={wrappedPrev}
            onNext={wrappedNext}
            onToday={goToToday}
            onGoToMonth={wrappedGoToMonth}
            theme={theme}
            onThemeChange={setTheme}
          />
          {isPending ? (
            <CalendarSkeleton />
          ) : (
            <CalendarGrid
              days={days}
              onDateClick={handleDateClick}
              onHover={handleHover}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              selectedDate={range.start}
              focusedIndex={focusedIndex}
              onFocusedIndexChange={setFocusedIndex}
            />
          )}
        </div>
        <div className="flex flex-col border-t lg:border-l lg:border-t-0">
          <NotesPanel
            range={normalizedRange}
            notes={notes}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onClearRange={clearRange}
            onUndo={undo}
          />
        </div>
      </div>
    </div>
  );
}
