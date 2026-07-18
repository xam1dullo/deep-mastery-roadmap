import { Check } from 'lucide-react'
import { plan } from '../lib/plan'
import { t } from '../lib/i18n'
import { Badge, Card, ProgressBar, SectionTitle } from './ui'

const TECH_COLOR: Record<string, string> = {
  C: '#60a5fa',
  Go: '#22d3ee',
  JS: '#facc15',
  'TS/Node': '#818cf8',
  'C → Go': '#4ade80',
}

export function Builds({
  builds,
  onToggle,
}: {
  builds: Record<number, true>
  onToggle: (id: number) => void
}) {
  const doneCount = Object.keys(builds).length
  const total = plan.builds.length
  const pct = Math.round((doneCount / total) * 100)

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-fg)]">{t.builds.title}</h2>
            <p className="mt-0.5 max-w-2xl text-xs text-[var(--color-muted)]">{t.builds.sub}</p>
          </div>
          <div className="tnum text-sm font-bold text-[var(--color-accent)]">
            {doneCount}/{total}
          </div>
        </div>
        <ProgressBar value={pct} />
      </Card>

      <SectionTitle>{t.builds.title}</SectionTitle>
      <div className="grid gap-2 sm:grid-cols-2">
        {plan.builds.map((b) => {
          const isDone = !!builds[b.id]
          const color = TECH_COLOR[b.tech] ?? 'var(--color-muted)'
          return (
            <button
              key={b.id}
              onClick={() => onToggle(b.id)}
              aria-pressed={isDone}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                isDone
                  ? 'border-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <span
                className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border transition-colors"
                style={{
                  borderColor: isDone ? 'var(--color-accent)' : 'var(--color-border-strong)',
                  background: isDone ? 'var(--color-accent)' : 'transparent',
                }}
              >
                {isDone && <Check size={15} strokeWidth={3} color="#0a0a0f" />}
              </span>
              <span className="tnum w-6 flex-shrink-0 text-sm font-bold text-[var(--color-faint)]">
                {String(b.id).padStart(2, '0')}
              </span>
              <span
                className={`min-w-0 flex-1 text-[13px] leading-snug ${
                  isDone ? 'text-[var(--color-muted)]' : 'text-[var(--color-fg)]'
                }`}
              >
                {b.title}
              </span>
              {b.tech && b.tech !== '—' && (
                <span className="flex-shrink-0">
                  <Badge color={color}>{b.tech}</Badge>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
