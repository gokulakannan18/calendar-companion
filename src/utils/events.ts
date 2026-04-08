import type { CalendarEvent } from "@/types/calendar";

const EVENTS: CalendarEvent[] = [
  { date: "2026-01-01", title: "New Year's Day", type: "holiday" },
  { date: "2026-01-19", title: "Martin Luther King Jr. Day", type: "holiday" },
  { date: "2026-02-14", title: "Valentine's Day", type: "reminder" },
  { date: "2026-02-16", title: "Presidents' Day", type: "holiday" },
  { date: "2026-03-17", title: "St. Patrick's Day", type: "reminder" },
  { date: "2026-04-05", title: "Easter Sunday", type: "holiday" },
  { date: "2026-05-10", title: "Mother's Day", type: "reminder" },
  { date: "2026-05-25", title: "Memorial Day", type: "holiday" },
  { date: "2026-06-21", title: "Father's Day", type: "reminder" },
  { date: "2026-07-04", title: "Independence Day", type: "holiday" },
  { date: "2026-09-07", title: "Labor Day", type: "holiday" },
  { date: "2026-10-12", title: "Columbus Day", type: "holiday" },
  { date: "2026-10-31", title: "Halloween", type: "reminder" },
  { date: "2026-11-11", title: "Veterans Day", type: "holiday" },
  { date: "2026-11-26", title: "Thanksgiving", type: "holiday" },
  { date: "2026-12-25", title: "Christmas Day", type: "holiday" },
  { date: "2026-12-31", title: "New Year's Eve", type: "reminder" },
  { date: "2025-01-01", title: "New Year's Day", type: "holiday" },
  { date: "2025-07-04", title: "Independence Day", type: "holiday" },
  { date: "2025-12-25", title: "Christmas Day", type: "holiday" },
  { date: "2025-10-31", title: "Halloween", type: "reminder" },
  { date: "2025-11-27", title: "Thanksgiving", type: "holiday" },
  { date: "2027-01-01", title: "New Year's Day", type: "holiday" },
  { date: "2027-12-25", title: "Christmas Day", type: "holiday" },
];

const eventsMap = new Map<string, CalendarEvent[]>();
EVENTS.forEach((event) => {
  const existing = eventsMap.get(event.date) ?? [];
  existing.push(event);
  eventsMap.set(event.date, existing);
});

export function getEventsForDate(dateKey: string): CalendarEvent[] {
  return eventsMap.get(dateKey) ?? [];
}

export function hasEvent(dateKey: string): boolean {
  return eventsMap.has(dateKey);
}
