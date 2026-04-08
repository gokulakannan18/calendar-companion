const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

export function getDayLabels(): readonly string[] {
  return DAY_LABELS;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t >= s && t <= e;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function generateCalendarGrid(year: number, month: number): Date[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const dates: Date[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push(new Date(year, month - 1, daysInPrevMonth - i));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, month, d));
  }

  const remaining = 42 - dates.length;
  for (let d = 1; d <= remaining; d++) {
    dates.push(new Date(year, month + 1, d));
  }

  return dates;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDisplayDate(date: Date): string {
  return `${getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;
}
