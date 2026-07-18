import {
  Binary,
  BookOpen,
  ClipboardList,
  FileText,
  Hammer,
  Mic,
  RefreshCw,
  Sigma,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { BlockType } from '../data/plan.types'

export interface BlockMeta {
  label: string // bilingual short label
  color: string
  Icon: LucideIcon
}

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  DSA: { label: 'DSA', color: '#818cf8', Icon: Binary },
  BUILD: { label: 'Build', color: '#4ade80', Icon: Hammer },
  COURSE: { label: 'Kurs', color: '#38bdf8', Icon: BookOpen },
  MATH: { label: 'Matematika', color: '#fbbf24', Icon: Sigma },
  REVIEW: { label: 'Takror', color: '#c084fc', Icon: RefreshCw },
  MOCK: { label: 'Suhbat', color: '#fb7185', Icon: Mic },
  CV: { label: 'CV', color: '#2dd4bf', Icon: FileText },
  DRILL: { label: 'Mashq', color: '#fb923c', Icon: Target },
  PLAN: { label: 'Reja', color: '#94a3b8', Icon: ClipboardList },
}
