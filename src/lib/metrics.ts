import type { Plan } from '../data/plan.types'
import { currentDayNumber, rawDayNumber } from './date'
import { blockKey, type DayEntry } from './plan'
import type { Progress } from './store'

export interface ModuleProgress {
  id: number
  title: string
  short: string
  done: number
  total: number
  pct: number
}

export interface WeekPoint {
  week: number
  done: number
  total: number
}

export interface Metrics {
  totalBlocks: number
  doneBlocks: number
  overallPct: number
  currentDay: number
  daysLeft: number
  hasStarted: boolean
  finished: boolean
  streak: number
  buildsDone: number
  buildsTotal: number
  mathDone: number
  mathTotal: number
  mocksCount: number
  todayEntry: DayEntry | null
  modules: ModuleProgress[]
  weekly: WeekPoint[]
}

/** Short label for charts (strips "& " noise, caps length). */
function shortTitle(t: string): string {
  return t.length > 22 ? t.slice(0, 21) + '…' : t
}

export function computeMetrics(
  days: DayEntry[],
  progress: Progress,
  plan: Plan,
): Metrics {
  const done = progress.done
  const currentDay = currentDayNumber(plan.meta.startDate, plan.meta.totalDays)
  const raw = rawDayNumber(plan.meta.startDate)

  let totalBlocks = 0
  let doneBlocks = 0
  const dayComplete = new Map<number, boolean>()
  const modAgg = new Map<number, { done: number; total: number; title: string }>()
  const weekAgg = new Map<number, { done: number; total: number }>()

  for (const e of days) {
    let dDone = 0
    for (const b of e.blocks) {
      totalBlocks++
      const isDone = !!done[blockKey(e.day, b)]
      if (isDone) {
        doneBlocks++
        dDone++
      }
    }
    dayComplete.set(e.day, e.blocks.length > 0 && dDone === e.blocks.length)

    const m = modAgg.get(e.moduleId) ?? { done: 0, total: 0, title: e.moduleTitle }
    m.done += dDone
    m.total += e.blocks.length
    modAgg.set(e.moduleId, m)

    const w = weekAgg.get(e.week) ?? { done: 0, total: 0 }
    w.done += dDone
    w.total += e.blocks.length
    weekAgg.set(e.week, w)
  }

  // Streak: consecutive complete days ending at today (today may still be pending).
  let streak = 0
  let d = dayComplete.get(currentDay) ? currentDay : currentDay - 1
  while (d >= 1 && dayComplete.get(d)) {
    streak++
    d--
  }

  const modules: ModuleProgress[] = plan.modules.map((mod) => {
    const a = modAgg.get(mod.id) ?? { done: 0, total: 0, title: mod.title }
    return {
      id: mod.id,
      title: mod.title,
      short: `M${mod.id} · ${shortTitle(mod.title)}`,
      done: a.done,
      total: a.total,
      pct: a.total ? Math.round((a.done / a.total) * 100) : 0,
    }
  })

  const weekly: WeekPoint[] = Array.from(weekAgg.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([week, v]) => ({ week, done: v.done, total: v.total }))

  const buildsDone = Object.keys(progress.builds).length
  const mathDone = Object.keys(progress.math).length

  return {
    totalBlocks,
    doneBlocks,
    overallPct: totalBlocks ? Math.round((doneBlocks / totalBlocks) * 100) : 0,
    currentDay,
    daysLeft: Math.max(0, plan.meta.totalDays - currentDay),
    hasStarted: raw >= 1,
    finished: raw > plan.meta.totalDays,
    streak,
    buildsDone,
    buildsTotal: plan.meta.totalBuilds,
    mathDone,
    mathTotal: plan.mathTrack.length,
    mocksCount: progress.mocks.length,
    todayEntry: days.find((e) => e.day === currentDay) ?? null,
    modules,
    weekly,
  }
}
