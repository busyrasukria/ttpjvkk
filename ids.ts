/**
 * Unique ID helpers
 * Small helpers for generating unique serials suitable for tickets.
 */

/**
 * Generates a readable unique serial: FG-YYYYMMDD-HHMMSS-xxxx
 * - FG prefix for Finished Good
 * - Date/time for traceability
 * - 4-char base36 suffix for extra entropy
 */
export function generateTicketSerial(prefix = "FG"): string {
  const now = new Date();
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${date}-${time}-${suffix}`;
}