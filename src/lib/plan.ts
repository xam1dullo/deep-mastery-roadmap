import planData from '../data/plan.json'
import type { Block, Module, Plan, Segment } from '../data/plan.types'
import { dayToDate, weekdayName } from './date'

// The dataset is transcribed from the PDF; cast through unknown so minor shape
// drift in the JSON never blocks the typed app. Runtime shape is trusted.
export const plan = planData as unknown as Plan

export interface DayEntry {
  day: number // 1..364
  date: Date
  weekday: string
  moduleId: number
  moduleTitle: string
  week: number
  segmentIndex: number
  segmentLabel?: string
  segmentKind: Segment['kind']
  blocks: Block[]
}

/** Stable completion key for a single block within a day. */
export function blockKey(day: number, block: Block): string {
  return `${day}:${block.type}${block.day ? ':' + block.day : ''}`
}

function weekOf(day: number): number {
  return Math.floor((day - 1) / 7) + 1
}

/** Expand every module → segment → concrete dated days with their blocks. */
export function expandDays(p: Plan = plan): DayEntry[] {
  const out: DayEntry[] = []
  for (const mod of p.modules) {
    mod.segments.forEach((seg, segmentIndex) => {
      for (let day = seg.dayStart; day <= seg.dayEnd; day++) {
        const date = dayToDate(p.meta.startDate, day)
        let blocks: Block[]
        if (seg.kind === 'weekend') {
          // 2-day span: first day = Sat, second = Sun.
          const which = day === seg.dayStart ? 'Sat' : 'Sun'
          blocks = seg.blocks.filter((b) => !b.day || b.day === which)
        } else {
          blocks = seg.blocks
        }
        out.push({
          day,
          date,
          weekday: weekdayName(date),
          moduleId: mod.id,
          moduleTitle: mod.title,
          week: weekOf(day),
          segmentIndex,
          segmentLabel: seg.label,
          segmentKind: seg.kind,
          blocks,
        })
      }
    })
  }
  out.sort((a, b) => a.day - b.day)
  return out
}

export function moduleById(id: number, p: Plan = plan): Module | undefined {
  return p.modules.find((m) => m.id === id)
}
