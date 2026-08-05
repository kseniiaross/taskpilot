/**
 * Shared date helpers for task due dates.
 *
 * Task due dates are stored as plain "YYYY-MM-DD" strings. Throughout
 * the app we consistently treat them as *local* calendar dates (not
 * UTC), so `parseDueDate` always appends a local midnight time before
 * constructing a Date. Never call `new Date(dueDateString)` directly
 * elsewhere — that parses as UTC and can shift the effective day for
 * users behind UTC.
 */

/**
 * Parses a "YYYY-MM-DD" dueDate string as local midnight. Returns NaN
 * for an empty/missing date so callers can detect "no due date" the
 * same way `Number.isNaN` would for a genuinely invalid date.
 */
export const parseDueDate = (
  dueDate: string,
): number => {

  if (!dueDate) {
    return Number.NaN;
  }

  return new Date(
    `${dueDate}T00:00:00`,
  ).getTime();

};

/**
 * Returns today's calendar date (YYYY-MM-DD) as observed in the given
 * IANA time zone. Uses the "en-CA" locale because it happens to format
 * dates as YYYY-MM-DD, matching the format dueDate is stored in, so the
 * two can be compared directly as strings.
 *
 * Falls back to the browser's local time zone if `timeZone` is empty
 * or not a recognized IANA identifier (e.g. malformed data from an
 * older stored task).
 */
export const getTodayInTimeZone = (
  timeZone: string,
): string => {

  try {

    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  } catch {

    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  }

};

/**
 * Formats a "YYYY-MM-DD" dueDate string for display, e.g. "Aug 5, 2026".
 * Returns a fallback label when there is no due date.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatDueDate = (
  dueDate: string,
): string => {

  if (!dueDate) {
    return "No due date";
  }

  return DATE_FORMATTER.format(
    new Date(`${dueDate}T00:00:00`),
  );

};