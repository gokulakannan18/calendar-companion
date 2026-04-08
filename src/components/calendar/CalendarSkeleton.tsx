import { memo } from "react";
import { cn } from "@/lib/utils";

export const CalendarSkeleton = memo(function CalendarSkeleton() {
  return (
    <div className="p-3 sm:p-4 animate-pulse" aria-hidden="true">
      <div className="mb-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center"
          >
            <div className="h-3 w-6 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "flex h-10 items-center justify-center rounded-lg",
            )}
          >
            <div
              className="h-5 w-5 rounded bg-muted"
              style={{ animationDelay: `${i * 20}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
