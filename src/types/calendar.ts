export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarNote {
  id: string;
  date: string;
  text: string;
  createdAt: string;
}

export type NotesMap = Record<string, CalendarNote[]>;

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isHoverPreview: boolean;
  hasNotes: boolean;
  hasEvent: boolean;
}

export interface CalendarEvent {
  date: string;
  title: string;
  type: "holiday" | "reminder" | "meeting";
}
