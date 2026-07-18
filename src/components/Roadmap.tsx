import { useMemo, useState } from 'react'
import { BookOpen, ChevronDown, Crosshair, Hammer } from 'lucide-react'
import { plan, type DayEntry } from '../lib/plan'
import { t } from '../lib/i18n'
import type { Metrics } from '../lib/metrics'
import { DayCard } from './day'
import { Badge, ProgressBar } from './ui'

export function Roadmap({
  days,
  metrics,
  done,
  onToggle,
  onSetKeys,
}: {
  days: DayEntry[]
  metrics: Metrics
  done: Record<string, true>
  onToggle: (key: string) => void
  onSetKeys: (keys: string[], value: boolean) => void
}) {
  const currentModuleId = metrics.todayEntry?.moduleId ?? 0

  const byModule = useMemo(() => {
    const map = new Map<number, DayEntry[]>()
    for (const d of days) {
      const arr = map.get(d.moduleId) ?? []
      arr.push(d)
      map.set(d.moduleId, arr)
    }
    return map
  }, [days])

  const [open, setOpen] = useState<Record<number, boolean>>({
    [currentModuleId]: true,
  })

  const toggle = (id: number) => setOpen((o) => ({ ...o, [id]: !o[id] }))
  const setAll = (v: boolean) =>
    setOpen(Object.fromEntries(plan.modules.map((m) => [m.id, v])))

  const jumpToday = () => {
    setOpen((o) => ({ ...o, [currentModuleId]: true }))
    requestAnimationFrame(() =>
      document
        .getElementById(`day-${metrics.currentDay}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={jumpToday}
          className="cursor-pointer rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
        >
          {t.roadmap.jumpToday}
        </button>
        <button
          onClick={() => setAll(true)}
          className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {t.roadmap.expandAll}
        </button>
        <button
          onClick={() => setAll(false)}
          className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {t.roadmap.collapseAll}
        </button>
      </div>

      {plan.modules.map((mod) => {
        const mp = metrics.modules.find((x) => x.id === mod.id)
        const isOpen = !!open[mod.id]
        const isCurrent = mod.id === currentModuleId
        return (
          <div
            key={mod.id}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <button
              onClick={() => toggle(mod.id)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <span className="tnum grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-[var(--color-surface-2)] text-sm font-bold text-[var(--color-primary)]">
                {mod.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-[var(--color-fg)]">
                    {mod.title}
                  </span>
                  {isCurrent && <Badge color="var(--color-primary)">joriy</Badge>}
                </span>
                <span className="text-[11px] text-[var(--color-faint)]">
                  {mod.weeksLabel}
                </span>
              </span>
              <span className="hidden w-40 flex-shrink-0 sm:block">
                <ProgressBar value={mp?.pct ?? 0} height={6} />
              </span>
              <span className="tnum w-10 flex-shrink-0 text-right text-xs font-semibold text-[var(--color-muted)]">
                {mp?.pct ?? 0}%
              </span>
              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-[var(--color-faint)] transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-[var(--color-border)] px-3 py-3">
                {(mod.summary || mod.coreBuilds || mod.dsaTarget || mod.courses.length > 0) && (
                  <div className="mb-3 flex flex-col gap-2 rounded-lg bg-[var(--color-surface-2)] p-3">
                    {mod.summary && (
                      <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                        {mod.summary}
                      </p>
                    )}
                    {mod.dsaTarget && (
                      <p className="flex items-start gap-1.5 text-xs text-[var(--color-muted)]">
                        <Crosshair size={13} className="mt-0.5 flex-shrink-0 text-[#818cf8]" />
                        <span>
                          <span className="font-semibold">{t.roadmap.dsaTarget}:</span>{' '}
                          {mod.dsaTarget}
                        </span>
                      </p>
                    )}
                    {mod.coreBuilds && (
                      <p className="flex items-start gap-1.5 text-xs text-[var(--color-muted)]">
                        <Hammer size={13} className="mt-0.5 flex-shrink-0 text-[#4ade80]" />
                        <span>
                          <span className="font-semibold">{t.roadmap.coreBuilds}:</span>{' '}
                          {mod.coreBuilds}
                        </span>
                      </p>
                    )}
                    {mod.courses.length > 0 && (
                      <div className="flex items-start gap-1.5 text-xs text-[var(--color-muted)]">
                        <BookOpen size={13} className="mt-0.5 flex-shrink-0 text-[#38bdf8]" />
                        <ul className="flex flex-col gap-0.5">
                          {mod.courses.map((c, i) => (
                            <li key={i}>
                              {c.title}
                              {c.author && (
                                <span className="text-[var(--color-faint)]"> — {c.author}</span>
                              )}
                              {c.optional && (
                                <span className="text-[var(--color-faint)]">
                                  {' '}
                                  ({t.roadmap.optional})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {(byModule.get(mod.id) ?? []).map((entry) => (
                    <div key={entry.day} id={`day-${entry.day}`} className="scroll-mt-20">
                      <DayCard
                        entry={entry}
                        done={done}
                        onToggle={onToggle}
                        onSetKeys={onSetKeys}
                        highlight={entry.day === metrics.currentDay}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
