/**
 * Returns the Monday of the week containing the given date.
 */
export function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1, Sunday = 0 (goes back 6)
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns the Sunday of the week containing the given date.
 */
export function getWeekSunday(date: Date): Date {
  const monday = getWeekMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
}

/**
 * Formats a Date as YYYY-MM-DD using local time (no timezone shift).
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns an array of 7 dates (Monday to Sunday) for the week containing the given date.
 */
export function getWeekDays(date: Date): Date[] {
  const monday = getWeekMonday(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Returns the first day of the month for the given date.
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Returns the last day of the month for the given date.
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Returns the calendar grid dates for a month view.
 * Includes padding days from previous/next months so the grid starts on Monday
 * and ends on Sunday (complete weeks).
 */
export function getCalendarDays(date: Date): Date[] {
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);

  // Find the Monday on or before the 1st
  const calendarStart = getWeekMonday(monthStart);

  // Find the Sunday on or after the last day
  const calendarEnd = getWeekSunday(monthEnd);

  const days: Date[] = [];
  const current = new Date(calendarStart);
  while (current <= calendarEnd) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}
