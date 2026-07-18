import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  GraduationCap,
  Layers,
  ListChecks,
} from 'lucide-react'
import type { Curriculum, Lesson } from '../data/curriculum.types'
import { lessonKey, type CurriculumMetrics } from '../lib/curriculum'
import { diffDays, parseISO, startOfToday } from '../lib/date'
import { t } from '../lib/i18n'
import { Badge, Card, ProgressBar, Ring, SectionTitle, StatTile } from './ui'

const ACCENT = '#22d3ee'

const tooltipStyle = {
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border-strong)',
  borderRadius: 10,
  fontSize: 12,
  color: 'var(--color-fg)',
}

function LessonRow({
  lesson,
  done,
  onToggle,
}: {
  lesson: Lesson
  done: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={done}
      className="group flex w-full cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--color-surface-2)]"
    >
      <span
        className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded border transition-colors"
        style={{
          borderColor: done ? ACCENT : 'var(--color-border-strong)',
          background: done ? ACCENT : 'transparent',
        }}
      >
        {done && <Check size={13} strokeWidth={3} color="#0a0a0f" />}
      </span>
      <span className="tnum mt-0.5 w-6 flex-shrink-0 text-xs font-bold text-[var(--color-faint)]">
        {lesson.n}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[13px] font-semibold ${
            done ? 'text-[var(--color-muted)]' : 'text-[var(--color-fg)]'
          }`}
        >
          {lesson.title}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-[var(--color-muted)]">
          {lesson.detail}
        </span>
        {lesson.note && (
          <span className="mt-1 block text-[11px] text-[var(--color-warn)]">⚠ {lesson.note}</span>
        )}
        {lesson.tags.length > 0 && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {lesson.tags.map((tag) => (
              <Badge key={tag} color={ACCENT}>
                {tag}
              </Badge>
            ))}
          </span>
        )}
      </span>
    </button>
  )
}

function TargetCard({
  targetDate,
  onSetTarget,
  left,
}: {
  targetDate?: string
  onSetTarget: (d?: string) => void
  left: number
}) {
  const daysLeft = targetDate ? diffDays(startOfToday(), parseISO(targetDate)) : null
  const perWeek = daysLeft && daysLeft > 0 && left > 0 ? left / (daysLeft / 7) : null
  const today = (() => {
    const n = new Date()
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
  })()

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <CalendarClock size={15} style={{ color: ACCENT }} />
        <h3 className="text-sm font-semibold text-[var(--color-fg)]">{t.devops.target.title}</h3>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          name="devops-target"
          min={today}
          value={targetDate ?? ''}
          onChange={(e) => onSetTarget(e.target.value || undefined)}
          aria-label={t.devops.target.set}
          className="flex-1 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[color:var(--color-primary)]"
        />
        {targetDate && (
          <button
            onClick={() => onSetTarget(undefined)}
            className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] px-2.5 py-2 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            {t.devops.target.clear}
          </button>
        )}
      </div>

      {!targetDate ? (
        <p className="mt-2 text-[11px] text-[var(--color-faint)]">{t.devops.target.noneHint}</p>
      ) : left === 0 ? (
        <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">{t.devops.target.done}</p>
      ) : daysLeft !== null && daysLeft < 0 ? (
        <p className="mt-3 text-sm font-medium text-[var(--color-warn)]">
          {t.devops.target.overdue} · {left} {t.devops.target.lessonsLeft}
        </p>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2 text-center">
          <div>
            <div className="tnum text-lg font-bold text-[var(--color-fg)]">{left}</div>
            <div className="text-[10px] text-[var(--color-faint)]">{t.devops.target.lessonsLeft}</div>
          </div>
          <div>
            <div className="tnum text-lg font-bold text-[var(--color-fg)]">{daysLeft}</div>
            <div className="text-[10px] text-[var(--color-faint)]">{t.devops.target.daysLeft}</div>
          </div>
          <div>
            <div className="tnum text-lg font-bold" style={{ color: ACCENT }}>
              {perWeek ? perWeek.toFixed(1) : '—'}
            </div>
            <div className="text-[10px] text-[var(--color-faint)]">{t.devops.target.perWeek}</div>
          </div>
        </div>
      )}
    </Card>
  )
}

export function DevOps({
  curriculum,
  metrics,
  done,
  onToggle,
  onSetKeys,
  targetDate,
  onSetTarget,
}: {
  curriculum: Curriculum
  metrics: CurriculumMetrics
  done: Record<string, true>
  onToggle: (key: string) => void
  onSetKeys: (keys: string[], value: boolean) => void
  targetDate?: string
  onSetTarget: (d?: string) => void
}) {
  const currentModule = metrics.modules.find((m) => m.pct < 100)?.id ?? curriculum.modules[0]?.id
  const [open, setOpen] = useState<Record<number, boolean>>({ [currentModule]: true })
  const setAll = (v: boolean) =>
    setOpen(Object.fromEntries(curriculum.modules.map((m) => [m.id, v])))

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <Card className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[var(--color-fg)]">{curriculum.meta.title}</h1>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              {curriculum.meta.subtitle} · {t.devops.author}:{' '}
              <span className="text-[var(--color-fg)]">{curriculum.meta.author}</span>
            </p>
          </div>
          <a
            href={curriculum.meta.source}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[var(--color-fg)]"
            style={{ ['--accent' as string]: ACCENT }}
          >
            {t.devops.source} ↗
          </a>
        </div>
      </Card>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          icon={GraduationCap}
          value={`${metrics.pct}%`}
          label={t.devops.overall}
          accent={ACCENT}
        />
        <StatTile
          icon={ListChecks}
          value={
            <span>
              {metrics.doneLessons}
              <span className="text-base text-[var(--color-faint)]">/{metrics.totalLessons}</span>
            </span>
          }
          label={t.devops.lessonsDone}
          accent="#38bdf8"
        />
        <StatTile
          icon={Layers}
          value={
            <span>
              {metrics.modulesDone}
              <span className="text-base text-[var(--color-faint)]">/{metrics.modulesTotal}</span>
            </span>
          }
          label={t.devops.modulesDone}
          accent="var(--color-accent)"
        />
        <StatTile
          icon={BookOpen}
          value={metrics.totalLessons - metrics.doneLessons}
          label={t.devops.lessons}
          accent="#fbbf24"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col items-center justify-center p-5">
            <Ring pct={metrics.pct}>
              <div>
                <div className="tnum text-4xl font-extrabold text-[var(--color-fg)]">
                  {metrics.pct}%
                </div>
                <div className="text-[11px] tracking-wide text-[var(--color-muted)] uppercase">
                  {metrics.doneLessons}/{metrics.totalLessons} {t.devops.lesson}
                </div>
              </div>
            </Ring>
          </Card>
          <TargetCard
            targetDate={targetDate}
            onSetTarget={onSetTarget}
            left={metrics.totalLessons - metrics.doneLessons}
          />
        </div>

        <Card className="p-4 lg:col-span-2">
          <SectionTitle>{t.devops.modules}</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={metrics.modules}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: 'var(--color-faint)', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="short"
                width={120}
                tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-surface-2)' }}
                contentStyle={tooltipStyle}
                formatter={(v: number, _n, p) => [
                  `${v}%  (${(p.payload as { done: number }).done}/${(p.payload as { total: number }).total})`,
                  t.charts.done,
                ]}
              />
              <Bar dataKey="pct" fill={ACCENT} radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* modules + lessons */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setAll(true)}
          className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {t.devops.expandAll}
        </button>
        <button
          onClick={() => setAll(false)}
          className="cursor-pointer rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {t.devops.collapseAll}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {curriculum.modules.map((mod) => {
          const mp = metrics.modules.find((x) => x.id === mod.id)
          const isOpen = !!open[mod.id]
          const keys = mod.lessons.map((l) => lessonKey(l.n))
          const complete = mp?.pct === 100
          return (
            <div
              key={mod.id}
              className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <button
                onClick={() => setOpen((o) => ({ ...o, [mod.id]: !o[mod.id] }))}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <span
                  className="tnum grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-[var(--color-surface-2)] text-sm font-bold"
                  style={{ color: ACCENT }}
                >
                  {mod.id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--color-fg)]">
                    {mod.title}
                  </span>
                  <span className="text-[11px] text-[var(--color-faint)]">
                    {t.devops.lesson} {mod.range}
                  </span>
                </span>
                <span className="hidden w-40 flex-shrink-0 sm:block">
                  <ProgressBar value={mp?.pct ?? 0} height={6} color={ACCENT} />
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
                  <div className="mb-2 flex justify-end px-1">
                    <button
                      onClick={() => onSetKeys(keys, !complete)}
                      className="cursor-pointer rounded-md border border-[var(--color-border-strong)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)] transition-colors"
                      style={{ borderColor: complete ? 'var(--color-border-strong)' : undefined }}
                    >
                      {complete ? t.devops.clearModule : t.devops.markModule}
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {mod.lessons.map((l) => (
                      <LessonRow
                        key={l.n}
                        lesson={l}
                        done={!!done[lessonKey(l.n)]}
                        onToggle={() => onToggle(lessonKey(l.n))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
