import { CalendarDays, Flame, GraduationCap, Hammer, Hourglass, Sparkles } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { plan } from '../lib/plan'
import { fmtDate, parseISO, startOfToday, diffDays } from '../lib/date'
import { t } from '../lib/i18n'
import type { Metrics } from '../lib/metrics'
import { DayCard } from './day'
import { Badge, Card, ProgressBar, Ring, SectionTitle, StatTile } from './ui'

const tooltipStyle = {
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border-strong)',
  borderRadius: 10,
  fontSize: 12,
  color: 'var(--color-fg)',
}

export function Dashboard({
  metrics: m,
  done,
  onToggle,
  onSetKeys,
}: {
  metrics: Metrics
  done: Record<string, true>
  onToggle: (key: string) => void
  onSetKeys: (keys: string[], value: boolean) => void
}) {
  const currentWeek = Math.ceil(m.currentDay / 7)
  const toCheckpoint = diffDays(startOfToday(), parseISO(plan.meta.checkpoint.date))

  return (
    <div className="flex flex-col gap-5">
      {/* Today — the first thing you see: what to do right now */}
      <section className="animate-fade-up flex flex-col gap-2">
        <SectionTitle
          right={
            m.hasStarted && !m.finished && m.todayEntry ? (
              <Badge color="var(--color-primary)">Kun {m.currentDay}</Badge>
            ) : undefined
          }
        >
          {t.today.title}
        </SectionTitle>
        {!m.hasStarted ? (
          <Card className="p-5 text-sm text-[var(--color-muted)]">
            {t.today.notStarted} · {fmtDate(parseISO(plan.meta.startDate))}
          </Card>
        ) : m.finished ? (
          <Card className="p-5 text-sm font-semibold text-[var(--color-accent)]">
            {t.today.finished}
          </Card>
        ) : m.todayEntry ? (
          <>
            {m.doneBlocks === 0 && (
              <div className="flex items-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] px-4 py-3">
                <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
                <p className="text-[13px] leading-relaxed text-[var(--color-fg)]">
                  Boshlash uchun quyidagi bloklarni bajarib, ustiga bosing. Progress, streak va
                  foizlar avtomatik hisoblanadi.
                </p>
              </div>
            )}
            <DayCard
              entry={m.todayEntry}
              done={done}
              onToggle={onToggle}
              onSetKeys={onSetKeys}
              highlight
            />
          </>
        ) : (
          <Card className="p-5 text-sm text-[var(--color-muted)]">{t.today.none}</Card>
        )}
      </section>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatTile
          icon={GraduationCap}
          value={`${m.overallPct}%`}
          label={t.kpi.overall}
          sub={`${m.doneBlocks}/${m.totalBlocks} ${t.kpi.blocksDone}`}
          accent="var(--color-primary)"
        />
        <StatTile
          icon={CalendarDays}
          value={
            <span>
              {m.currentDay}
              <span className="text-base text-[var(--color-faint)]">
                /{plan.meta.totalDays}
              </span>
            </span>
          }
          label={t.kpi.currentDay}
          sub={`${t.today.week} ${currentWeek}/${plan.meta.totalWeeks}`}
          accent="#38bdf8"
        />
        <StatTile
          icon={Hourglass}
          value={m.daysLeft}
          label={t.kpi.daysLeft}
          sub={`L3 ${toCheckpoint > 0 ? `${toCheckpoint} ${t.kpi.days}` : '✓'}`}
          accent="#fbbf24"
        />
        <StatTile
          icon={Flame}
          value={m.streak}
          label={t.kpi.streak}
          sub={`${t.kpi.dayStreak}`}
          accent="#fb7185"
        />
        <StatTile
          icon={Hammer}
          value={
            <span>
              {m.buildsDone}
              <span className="text-base text-[var(--color-faint)]">
                /{m.buildsTotal}
              </span>
            </span>
          }
          label={t.kpi.builds}
          sub={`${m.mathDone}/${m.mathTotal} ${t.kpi.math} · ${m.mocksCount} ${t.kpi.mocks}`}
          accent="var(--color-accent)"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Overall ring */}
        <Card className="flex flex-col items-center justify-center p-5">
          <Ring pct={m.overallPct}>
            <div>
              <div className="tnum text-4xl font-extrabold text-[var(--color-fg)]">
                {m.overallPct}%
              </div>
              <div className="text-[11px] tracking-wide text-[var(--color-muted)] uppercase">
                {t.kpi.overall}
              </div>
            </div>
          </Ring>
          <div className="mt-2 text-center text-xs text-[var(--color-faint)]">
            {plan.meta.checkpoint.label}
          </div>
        </Card>

        {/* Charts */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card className="p-4">
            <SectionTitle>{t.charts.moduleProgress}</SectionTitle>
            <ResponsiveContainer width="100%" height={330}>
              <BarChart
                data={m.modules}
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
                  width={150}
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
                <Bar dataKey="pct" fill="var(--color-primary)" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <SectionTitle>{t.charts.weeklyActivity}</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={m.weekly}
                margin={{ left: -18, right: 12, top: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="wk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: 'var(--color-faint)', fontSize: 10 }}
                  interval={4}
                  tickFormatter={(v) => `${t.charts.week[0]}${v}`}
                />
                <YAxis tick={{ fill: 'var(--color-faint)', fontSize: 10 }} width={34} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(v) => `${t.charts.week} ${v}`}
                  formatter={(v: number) => [v, t.charts.done]}
                />
                <ReferenceLine x={currentWeek} stroke="var(--color-primary)" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="done"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#wk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Module progress list */}
      <div>
        <SectionTitle>{t.charts.moduleProgress}</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {m.modules.map((mod) => (
            <Card key={mod.id} className="p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-[var(--color-fg)]">
                  <span className="text-[var(--color-faint)]">M{mod.id}</span> {mod.title}
                </span>
                <span className="tnum flex-shrink-0 text-xs font-semibold text-[var(--color-muted)]">
                  {mod.pct}%
                </span>
              </div>
              <ProgressBar value={mod.pct} />
              <div className="tnum mt-1 text-[11px] text-[var(--color-faint)]">
                {mod.done}/{mod.total} blok
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
