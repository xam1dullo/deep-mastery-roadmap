// Contract for a "curriculum" track: a flat, topic-grouped lesson list
// (no dates/daily blocks) — e.g. the completed DevOps course. Contrast with
// the "schedule" track (Plan) which is date/day/block structured.

export interface Lesson {
  /** 1-indexed lesson number as in the source. */
  n: number
  /** Concise topic label (a few words). */
  title: string
  /** Full verbatim sub-topics from the source list. */
  detail: string
  /** Key tools / concepts touched, for filtering and tags. */
  tags: string[]
  /** Optional caveat carried from the source (e.g. free lesson, recording cut). */
  note?: string
}

export interface CurriculumModule {
  /** 1-indexed phase number. */
  id: number
  title: string
  /** Short label for charts. */
  short: string
  /** Lesson range label, e.g. "1–10". */
  range: string
  lessons: Lesson[]
}

export interface Curriculum {
  meta: {
    title: string
    subtitle: string
    author: string
    source: string
    date: string
    totalLessons: number
  }
  modules: CurriculumModule[]
}
