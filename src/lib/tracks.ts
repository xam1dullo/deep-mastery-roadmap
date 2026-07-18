import devopsData from '../data/devops.json'
import type { Curriculum } from '../data/curriculum.types'
import type { Plan } from '../data/plan.types'
import { plan } from './plan'

export type TrackKind = 'schedule' | 'curriculum'

interface TrackBase {
  id: string
  name: string
  short: string
  tagline: string
  kind: TrackKind
  accent: string
}

export interface ScheduleTrack extends TrackBase {
  kind: 'schedule'
  plan: Plan
}

export interface CurriculumTrack extends TrackBase {
  kind: 'curriculum'
  curriculum: Curriculum
}

export type Track = ScheduleTrack | CurriculumTrack

export const devopsCurriculum = devopsData as unknown as Curriculum

export const TRACKS: Track[] = [
  {
    id: 'deep-mastery',
    name: 'Deep Mastery',
    short: 'Backend / Fullstack',
    tagline: `${plan.meta.totalDays} kun · ${plan.meta.totalBuilds} build`,
    kind: 'schedule',
    accent: '#6366f1',
    plan,
  },
  {
    id: 'devops',
    name: 'DevOps',
    short: 'DevOps kurs',
    tagline: `${devopsCurriculum.meta.totalLessons} dars`,
    kind: 'curriculum',
    accent: '#22d3ee',
    curriculum: devopsCurriculum,
  },
]

export const DEFAULT_TRACK_ID = TRACKS[0].id

export function trackById(id: string): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]
}
