const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DAY_MS = 86_400_000

export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

/** Calendar date for a 1-indexed plan day, from the ISO start date. */
export function dayToDate(startISO: string, day: number): Date {
  return addDays(parseISO(startISO), day - 1)
}

export function startOfToday(): Date {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

/** Current plan day (1-indexed), clamped to [1, totalDays]. */
export function currentDayNumber(startISO: string, totalDays: number): number {
  const raw = diffDays(parseISO(startISO), startOfToday()) + 1
  return Math.max(1, Math.min(totalDays, raw))
}

/** Signed raw offset: <1 before start, >totalDays after end. */
export function rawDayNumber(startISO: string): number {
  return diffDays(parseISO(startISO), startOfToday()) + 1
}

export function fmtDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function fmtShort(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function weekdayName(d: Date): string {
  return WEEKDAYS[d.getDay()]
}
