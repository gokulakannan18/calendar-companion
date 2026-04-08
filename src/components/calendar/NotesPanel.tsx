import { useState, useCallback, memo } from "react";
import { Plus, Trash2, Calendar, X, Undo2 } from "lucide-react";
import type { DateRange, CalendarNote, NotesMap } from "@/types/calendar";
import { formatDateKey, formatDisplayDate } from "@/utils/date";

interface NotesPanelProps {
  range: DateRange;
  notes: NotesMap;
  onAddNote: (dateKey: string, text: string) => void;
  onDeleteNote: (dateKey: string, noteId: string) => void;
  onClearRange: () => void;
  onUndo: () => void;
}

export const NotesPanel = memo(function NotesPanel({
  range,
  notes,
  onAddNote,
  onDeleteNote,
  onClearRange,
  onUndo,
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState("");

  const selectedDateKey = range.start ? formatDateKey(range.start) : null;

  const relevantNotes: { key: string; notes: CalendarNote[] }[] = (() => {
    if (!range.start) return [];
    if (!range.end) {
      const key = formatDateKey(range.start);
      return [{ key, notes: notes[key] ?? [] }];
    }
    const result: { key: string; notes: CalendarNote[] }[] = [];
    const s = new Date(Math.min(range.start.getTime(), range.end.getTime()));
    const e = new Date(Math.max(range.start.getTime(), range.end.getTime()));
    const cur = new Date(s);
    while (cur <= e) {
      const k = formatDateKey(cur);
      if (notes[k]?.length) {
        result.push({ key: k, notes: notes[k] });
      }
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  })();

  const handleAddNote = useCallback(() => {
    if (!newNote.trim() || !selectedDateKey) return;
    onAddNote(selectedDateKey, newNote.trim());
    setNewNote("");
  }, [newNote, selectedDateKey, onAddNote]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddNote();
      }
    },
    [handleAddNote],
  );

  if (!range.start) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <Calendar className="mb-3 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          Select a date to view or add notes
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Click once for a single date, or drag to select a range
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {range.end
              ? `${formatDisplayDate(range.start!)} — ${formatDisplayDate(range.end)}`
              : formatDisplayDate(range.start!)}
          </h2>
          {range.end && (
            <p className="text-xs text-muted-foreground">Date range selected</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            className="rounded-md p-1 text-muted-foreground calendar-transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Undo last selection"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={onClearRange}
            className="rounded-md p-1 text-muted-foreground calendar-transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-b p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note..."
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Note text"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground calendar-transition hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Add note"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {relevantNotes.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            No notes yet for this {range.end ? "range" : "date"}.
          </p>
        )}
        {relevantNotes.map(({ key, notes: dateNotes }) => (
          <div key={key} className="mb-4 last:mb-0">
            {range.end && (
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {key}
              </p>
            )}
            <ul className="space-y-2">
              {dateNotes.map((note) => (
                <li
                  key={note.id}
                  className="group flex items-start gap-2 rounded-lg border bg-card p-3 calendar-transition hover:shadow-sm"
                >
                  <p className="flex-1 text-sm text-card-foreground">
                    {note.text}
                  </p>
                  <button
                    onClick={() => onDeleteNote(key, note.id)}
                    className="shrink-0 rounded p-1 text-muted-foreground opacity-0 calendar-transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Delete note: ${note.text}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});
