import { Check, Sigma } from 'lucide-react'
import { plan } from '../lib/plan'
import { t } from '../lib/i18n'
import { Card, ProgressBar, SectionTitle } from './ui'

export function MathTrack({
  math,
  onToggle,
}: {
  math: Record<number, true>
  onToggle: (order: number) => void
}) {
  const doneCount = Object.keys(math).length
  const total = plan.mathTrack.length
  const pct = Math.round((doneCount / total) * 100)

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
              <Sigma size={16} className="text-[#fbbf24]" />
              {t.math.title}
            </h2>
            <p className="mt-0.5 max-w-2xl text-xs text-[var(--color-muted)]">{t.math.sub}</p>
          </div>
          <div className="tnum text-sm font-bold text-[#fbbf24]">
            {doneCount}/{total}
          </div>
        </div>
        <ProgressBar value={pct} color="#fbbf24" />
      </Card>

      <SectionTitle>{t.math.title}</SectionTitle>
      <div className="flex flex-col gap-2">
        {plan.mathTrack.map((c) => {
          const isDone = !!math[c.order]
          return (
            <button
              key={c.order}
              onClick={() => onToggle(c.order)}
              aria-pressed={isDone}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                isDone
                  ? 'border-[color-mix(in_srgb,#fbbf24_45%,transparent)] bg-[color-mix(in_srgb,#fbbf24_8%,var(--color-surface))]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <span
                className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border transition-colors"
                style={{
                  borderColor: isDone ? '#fbbf24' : 'var(--color-border-strong)',
                  background: isDone ? '#fbbf24' : 'transparent',
                }}
              >
                {isDone && <Check size={15} strokeWidth={3} color="#0a0a0f" />}
              </span>
              <span className="tnum w-6 flex-shrink-0 text-sm font-bold text-[var(--color-faint)]">
                {c.order}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[13px] font-medium ${
                    isDone ? 'text-[var(--color-muted)]' : 'text-[var(--color-fg)]'
                  }`}
                >
                  {c.title}
                </span>
                <span className="text-[11px] text-[var(--color-faint)]">
                  {c.author}
                  {c.note ? ` · ${c.note}` : ''}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
