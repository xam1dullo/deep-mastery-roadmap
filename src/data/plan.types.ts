// Shared data contract for the Deep Mastery Plan dataset.
// The dataset (plan.json) is transcribed from Deep-Mastery-Plan-v3-Course-Edition.pdf.
// The app computes each day's calendar date authoritatively from meta.startDate
// (day N date = startDate + (N-1) days); segment dateStart/dateEnd are for display only.

export type BlockType =
  | 'DSA'
  | 'BUILD'
  | 'COURSE'
  | 'MATH'
  | 'REVIEW'
  | 'MOCK'
  | 'CV'
  | 'DRILL'
  | 'PLAN'

export interface Block {
  type: BlockType
  text: string
  /** Only set on weekend segments to split Saturday vs Sunday content. */
  day?: 'Sat' | 'Sun'
}

export interface Segment {
  /** Global day number the segment starts on (1..364). */
  dayStart: number
  /** Global day number the segment ends on (inclusive). */
  dayEnd: number
  /** ISO date of dayStart, e.g. "2026-07-20" (display only). */
  dateStart: string
  /** ISO date of dayEnd (display only). */
  dateEnd: string
  /** weekday = Mon–Fri block, weekend = Sat/Sun split, single = one enumerated day. */
  kind: 'weekday' | 'weekend' | 'single'
  /** Optional heading, e.g. "Memory & Custom Allocator", "Weekend", "Module Wrap". */
  label?: string
  blocks: Block[]
}

export interface Course {
  title: string
  author?: string
  note?: string
  optional?: boolean
}

export interface Module {
  /** 0..12 */
  id: number
  title: string
  /** e.g. "Weeks 2–6" */
  weeksLabel: string
  weekStart: number
  weekEnd: number
  summary?: string
  coreBuilds?: string
  dsaTarget?: string
  courses: Course[]
  segments: Segment[]
}

export interface BuildItem {
  /** 1..17 */
  id: number
  title: string
  tech: string
}

export interface MathCourse {
  order: number
  title: string
  author: string
  note?: string
}

export interface RhythmBlock {
  block: string
  time: string
  what: string
}

export interface Plan {
  meta: {
    title: string
    subtitle: string
    /** ISO "2026-07-13" */
    startDate: string
    /** ISO "2027-07-11" */
    endDate: string
    totalDays: number
    totalWeeks: number
    totalBuilds: number
    hoursPerDay: number
    checkpoint: { week: number; date: string; label: string }
    languages: string[]
  }
  dailyRhythm: RhythmBlock[]
  weeklyNonNegotiables: string[]
  mathTrack: MathCourse[]
  builds: BuildItem[]
  modules: Module[]
}
