import type { Curriculum } from '../data/curriculum.types'
import type { Progress } from './store'

/** Completion key for a curriculum lesson (lives in progress.done). */
export const lessonKey = (n: number) => `L${n}`

export interface CurriculumModuleProgress {
  id: number
  title: string
  short: string
  range: string
  done: number
  total: number
  pct: number
}

export interface CurriculumMetrics {
  totalLessons: number
  doneLessons: number
  pct: number
  modulesDone: number
  modulesTotal: number
  modules: CurriculumModuleProgress[]
}

export function computeCurriculumMetrics(
  cur: Curriculum,
  progress: Progress,
): CurriculumMetrics {
  const done = progress.done
  let doneLessons = 0
  let modulesDone = 0

  const modules: CurriculumModuleProgress[] = cur.modules.map((m) => {
    const d = m.lessons.filter((l) => done[lessonKey(l.n)]).length
    doneLessons += d
    if (m.lessons.length > 0 && d === m.lessons.length) modulesDone++
    return {
      id: m.id,
      title: m.title,
      short: m.short,
      range: m.range,
      done: d,
      total: m.lessons.length,
      pct: m.lessons.length ? Math.round((d / m.lessons.length) * 100) : 0,
    }
  })

  const total = cur.meta.totalLessons
  return {
    totalLessons: total,
    doneLessons,
    pct: total ? Math.round((doneLessons / total) * 100) : 0,
    modulesDone,
    modulesTotal: cur.modules.length,
    modules,
  }
}
