import { useMemo, useState } from 'react'
import {
  Compass,
  HardDriveDownload,
  LayoutDashboard,
  Hammer,
  Map,
  Mic,
  Sigma,
  type LucideIcon,
} from 'lucide-react'
import { Backup, type Stat } from './components/Backup'
import { Builds } from './components/Builds'
import { Dashboard } from './components/Dashboard'
import { DevOps } from './components/DevOps'
import { Interviews } from './components/Interviews'
import { MathTrack } from './components/MathTrack'
import { Onboarding } from './components/Onboarding'
import { Roadmap } from './components/Roadmap'
import { computeCurriculumMetrics } from './lib/curriculum'
import { t } from './lib/i18n'
import { computeMetrics } from './lib/metrics'
import { expandDays, plan } from './lib/plan'
import { useProgress } from './lib/store'
import { DEFAULT_TRACK_ID, TRACKS, trackById } from './lib/tracks'

type Tab = 'dashboard' | 'roadmap' | 'builds' | 'math' | 'interviews' | 'backup'

type NavItem = { id: Tab; label: string; Icon: LucideIcon }

const NAV_SCHEDULE: NavItem[] = [
  { id: 'dashboard', label: t.nav.dashboard, Icon: LayoutDashboard },
  { id: 'roadmap', label: t.nav.roadmap, Icon: Map },
  { id: 'builds', label: t.nav.builds, Icon: Hammer },
  { id: 'math', label: t.nav.math, Icon: Sigma },
  { id: 'interviews', label: t.nav.interviews, Icon: Mic },
  { id: 'backup', label: t.nav.backup, Icon: HardDriveDownload },
]

const NAV_CURRICULUM: NavItem[] = [
  { id: 'dashboard', label: t.devops.dashboard, Icon: LayoutDashboard },
  { id: 'backup', label: t.nav.backup, Icon: HardDriveDownload },
]

export default function App() {
  const [trackId, setTrackId] = useState<string>(DEFAULT_TRACK_ID)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [onboard, setOnboard] = useState(() => {
    try {
      return !localStorage.getItem('dmr:onboarded:v1')
    } catch {
      return false
    }
  })
  const track = trackById(trackId)
  const store = useProgress(trackId)

  // View Transitions API — smooth crossfade on tab/track switch (progressive).
  const startVT = (fn: () => void) => {
    const d = document as Document & { startViewTransition?: (cb: () => void) => void }
    if (d.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.startViewTransition(fn)
    } else fn()
  }
  const go = (id: Tab) => startVT(() => setTab(id))
  const finishOnboard = () => {
    setOnboard(false)
    try {
      localStorage.setItem('dmr:onboarded:v1', '1')
    } catch {
      /* ignore */
    }
  }

  const days = useMemo(() => expandDays(plan), [])
  const scheduleMetrics = useMemo(
    () => computeMetrics(days, store.progress, plan),
    [days, store.progress],
  )
  const curriculumMetrics = useMemo(
    () =>
      track.kind === 'curriculum'
        ? computeCurriculumMetrics(track.curriculum, store.progress)
        : null,
    [track, store.progress],
  )

  const switchTrack = (id: string) =>
    startVT(() => {
      setTrackId(id)
      setTab('dashboard')
    })

  const nav = track.kind === 'schedule' ? NAV_SCHEDULE : NAV_CURRICULUM

  const headline =
    track.kind === 'curriculum'
      ? `${curriculumMetrics!.pct}% · ${curriculumMetrics!.doneLessons}/${curriculumMetrics!.totalLessons} ${t.devops.lesson}`
      : `${scheduleMetrics.overallPct}% · Kun ${scheduleMetrics.currentDay}/${plan.meta.totalDays}`

  const scheduleStats: Stat[] = [
    {
      label: t.kpi.blocksDone,
      value: `${scheduleMetrics.doneBlocks}/${scheduleMetrics.totalBlocks}`,
    },
    { label: t.kpi.builds, value: `${scheduleMetrics.buildsDone}/${scheduleMetrics.buildsTotal}` },
    { label: t.kpi.math, value: `${scheduleMetrics.mathDone}/${scheduleMetrics.mathTotal}` },
    { label: t.kpi.mocks, value: `${scheduleMetrics.mocksCount}` },
  ]
  const curriculumStats: Stat[] = curriculumMetrics
    ? [
        {
          label: t.devops.lessonsDone,
          value: `${curriculumMetrics.doneLessons}/${curriculumMetrics.totalLessons}`,
        },
        {
          label: t.devops.modulesDone,
          value: `${curriculumMetrics.modulesDone}/${curriculumMetrics.modulesTotal}`,
        },
        { label: t.devops.overall, value: `${curriculumMetrics.pct}%` },
      ]
    : []

  const TrackSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? 'flex gap-1.5' : 'mb-5 flex flex-col gap-1.5'}>
      {TRACKS.map((tk) => {
        const active = tk.id === trackId
        return (
          <button
            key={tk.id}
            onClick={() => switchTrack(tk.id)}
            aria-current={active}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
              compact ? 'flex-shrink-0' : 'w-full'
            } ${active ? '' : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'}`}
            style={
              active
                ? {
                    borderColor: tk.accent,
                    background: `color-mix(in srgb, ${tk.accent} 12%, transparent)`,
                  }
                : undefined
            }
          >
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: tk.accent }}
            />
            <span className="min-w-0">
              <span
                className="block text-xs font-semibold"
                style={{ color: active ? tk.accent : 'var(--color-fg)' }}
              >
                {tk.name}
              </span>
              {!compact && (
                <span className="block text-[10px] text-[var(--color-faint)]">{tk.tagline}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-on-primary)]"
      >
        Asosiy kontentga o'tish
      </a>
      {onboard && <Onboarding onDone={finishOnboard} />}
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:flex">
        <div className="mb-5 flex items-center gap-2.5 px-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg"
            style={{ background: track.accent }}
          >
            <Compass size={20} color="#fff" />
          </span>
          <span>
            <span className="block text-sm font-bold text-[var(--color-fg)]">{t.appTitle}</span>
            <span className="block text-[11px] text-[var(--color-faint)]">{t.appSub}</span>
          </span>
        </div>

        <TrackSwitcher />

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={tab === id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === id
                  ? 'text-[var(--color-fg)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]'
              }`}
              style={
                tab === id
                  ? { background: `color-mix(in srgb, ${track.accent} 16%, transparent)`, color: track.accent }
                  : undefined
              }
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="rounded-lg bg-[var(--color-surface-2)] p-3">
          <div className="tnum text-2xl font-extrabold" style={{ color: track.accent }}>
            {track.kind === 'curriculum' ? curriculumMetrics!.pct : scheduleMetrics.overallPct}%
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">{headline}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header + tabs */}
        <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] backdrop-blur lg:hidden">
          <div className="flex items-center gap-2 px-4 py-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg"
              style={{ background: track.accent }}
            >
              <Compass size={18} color="#fff" />
            </span>
            <span className="text-sm font-bold text-[var(--color-fg)]">{t.appTitle}</span>
            <span className="tnum ml-auto text-xs font-semibold text-[var(--color-muted)]">
              {headline}
            </span>
          </div>
          <div className="px-2 pb-2">
            <TrackSwitcher compact />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {nav.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={tab === id}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                style={
                  tab === id
                    ? { background: `color-mix(in srgb, ${track.accent} 16%, transparent)`, color: track.accent }
                    : { color: 'var(--color-muted)' }
                }
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 p-4 outline-none md:p-6"
        >
          {track.kind === 'curriculum' ? (
            tab === 'backup' ? (
              <Backup
                progress={store.progress}
                stats={curriculumStats}
                onReplace={store.replaceAll}
                onReset={store.reset}
              />
            ) : (
              <DevOps
                curriculum={track.curriculum}
                metrics={curriculumMetrics!}
                done={store.progress.done}
                onToggle={store.toggleBlock}
                onSetKeys={store.setKeys}
                targetDate={store.progress.targetDate}
                onSetTarget={store.setTargetDate}
              />
            )
          ) : (
            <>
              {tab === 'dashboard' && (
                <Dashboard
                  metrics={scheduleMetrics}
                  done={store.progress.done}
                  onToggle={store.toggleBlock}
                  onSetKeys={store.setKeys}
                />
              )}
              {tab === 'roadmap' && (
                <Roadmap
                  days={days}
                  metrics={scheduleMetrics}
                  done={store.progress.done}
                  onToggle={store.toggleBlock}
                  onSetKeys={store.setKeys}
                />
              )}
              {tab === 'builds' && (
                <Builds builds={store.progress.builds} onToggle={store.toggleBuild} />
              )}
              {tab === 'math' && (
                <MathTrack math={store.progress.math} onToggle={store.toggleMath} />
              )}
              {tab === 'interviews' && (
                <Interviews
                  mocks={store.progress.mocks}
                  onAdd={store.addMock}
                  onRemove={store.removeMock}
                />
              )}
              {tab === 'backup' && (
                <Backup
                  progress={store.progress}
                  stats={scheduleStats}
                  onReplace={store.replaceAll}
                  onReset={store.reset}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
