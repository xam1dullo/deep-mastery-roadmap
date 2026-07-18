import { Check } from 'lucide-react'
import type { Block } from '../data/plan.types'
import { BLOCK_META } from '../lib/blocks'
import { fmtShort } from '../lib/date'
import { blockKey, type DayEntry } from '../lib/plan'
import { Badge } from './ui'

function BlockRow({
  block,
  done,
  onToggle,
}: {
  block: Block
  done: boolean
  onToggle: () => void
}) {
  const meta = BLOCK_META[block.type]
  const { Icon } = meta
  return (
    <button
      onClick={onToggle}
      aria-pressed={done}
      className="group flex w-full cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--color-surface-2)]"
    >
      <span
        className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded border transition-colors"
        style={{
          borderColor: done ? meta.color : 'var(--color-border-strong)',
          background: done ? meta.color : 'transparent',
        }}
      >
        {done && <Check size={13} strokeWidth={3} color="#0a0a0f" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 flex items-center gap-1.5">
          <Icon size={13} style={{ color: meta.color }} />
          <span
            className="text-[10px] font-semibold tracking-wide uppercase"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
          {block.day && <Badge color="var(--color-faint)">{block.day}</Badge>}
        </span>
        <span
          className={`block text-[13px] leading-snug ${
            done ? 'text-[var(--color-faint)] line-through' : 'text-[var(--color-fg)]'
          }`}
        >
          {block.text}
        </span>
      </span>
    </button>
  )
}

export function DayCard({
  entry,
  done,
  onToggle,
  onSetKeys,
  highlight = false,
}: {
  entry: DayEntry
  done: Record<string, true>
  onToggle: (key: string) => void
  onSetKeys: (keys: string[], value: boolean) => void
  highlight?: boolean
}) {
  const keys = entry.blocks.map((b) => blockKey(entry.day, b))
  const doneCount = keys.filter((k) => done[k]).length
  const complete = keys.length > 0 && doneCount === keys.length

  return (
    <div
      className={`rounded-xl border bg-[var(--color-surface)] p-3 transition-colors ${
        highlight
          ? 'border-[var(--color-primary)] shadow-[0_0_0_1px_var(--color-primary)]'
          : complete
            ? 'border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)]'
            : 'border-[var(--color-border)]'
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="tnum text-xs font-bold text-[var(--color-fg)]">
            Kun {entry.day}
          </span>
          <span className="text-[11px] text-[var(--color-faint)]">
            {entry.weekday} · {fmtShort(entry.date)}
          </span>
          {entry.segmentLabel && (
            <span className="hidden truncate text-[11px] text-[var(--color-muted)] sm:inline">
              {entry.segmentLabel}
            </span>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="tnum text-[11px] text-[var(--color-faint)]">
            {doneCount}/{keys.length}
          </span>
          <button
            onClick={() => onSetKeys(keys, !complete)}
            className="cursor-pointer rounded-md border border-[var(--color-border-strong)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {complete ? 'Bekor' : 'Belgilash'}
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {entry.blocks.map((b) => {
          const key = blockKey(entry.day, b)
          return (
            <BlockRow
              key={key}
              block={b}
              done={!!done[key]}
              onToggle={() => onToggle(key)}
            />
          )
        })}
      </div>
    </div>
  )
}
