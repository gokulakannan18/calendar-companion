import { memo, useCallback, useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthName } from "@/utils/date";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  year: number;
  month: number;
  open: boolean;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

export const MonthPicker = memo(function MonthPicker({
  year,
  month,
  open,
  onClose,
  onSelect,
}: MonthPickerProps) {
  const [pickerYear, setPickerYear] = useState(year);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setPickerYear(year);
  }, [open, year]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  const handleSelect = useCallback(
    (m: number) => {
      onSelect(pickerYear, m);
      onClose();
    },
    [pickerYear, onSelect, onClose],
  );

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/30 backdrop-blur-sm rounded-t-xl">
      <div
        ref={panelRef}
        className="w-72 rounded-xl border bg-card p-4 shadow-xl animate-scale-in"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setPickerYear((y) => y - 1)}
            className="rounded-lg p-1.5 text-muted-foreground calendar-transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous year"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {pickerYear}
          </span>
          <button
            onClick={() => setPickerYear((y) => y + 1)}
            className="rounded-lg p-1.5 text-muted-foreground calendar-transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next year"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                "rounded-lg px-2 py-2 text-sm font-medium calendar-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === month && pickerYear === year
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-secondary",
              )}
            >
              {getMonthName(i).slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
