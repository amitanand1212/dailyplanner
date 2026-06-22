export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const FULL_WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Build an ISO date key ("YYYY-MM-DD") from parts. month is 0-based. */
export function toISO(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function dateToISO(d: Date) {
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

export function todayISO() {
  return dateToISO(new Date());
}

/** Parse an ISO key into a local Date (midnight). */
export function isoToDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "21 May" */
export function formatShortDate(iso: string) {
  const d = isoToDate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "21 May 2024" */
export function formatLongDate(iso: string) {
  const d = isoToDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "21 May 2024" but short month — "21 May 2024" -> field display */
export function formatMediumDate(iso: string) {
  const d = isoToDate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Wednesday, 15 May 2024" */
export function formatWeekdayLong(iso: string) {
  const d = isoToDate(iso);
  return `${FULL_WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function greetingForNow(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/** 30-minute time slots for a full day: "12:00 AM" ... "11:30 PM". */
export function buildTimeOptions() {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const ampm = h < 12 ? "AM" : "PM";
      const hr = h % 12 === 0 ? 12 : h % 12;
      out.push(`${String(hr).padStart(2, "0")}:${m === 0 ? "00" : "30"} ${ampm}`);
    }
  }
  return out;
}

/** Parse a "08:00 AM" string into 24-hour parts. */
export function parseTime(time: string): { hour: number; minute: number } {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { hour: 0, minute: 0 };
  let hour = Number(m[1]) % 12;
  if (/PM/i.test(m[3])) hour += 12;
  return { hour, minute: Number(m[2]) };
}

/** Minutes since midnight for a "08:00 AM" string. */
export function parseTimeToMinutes(time: string): number {
  const { hour, minute } = parseTime(time);
  return hour * 60 + minute;
}

/** Density-dot color bucket for a task count. */
export function dotColorForCount(count: number): string | null {
  if (count <= 0) return null;
  if (count <= 2) return "#22C55E"; // green 1-2
  if (count <= 4) return "#F59E0B"; // orange 3-4
  return "#6C5CE7"; // purple 5+
}
