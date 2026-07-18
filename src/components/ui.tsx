import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionTitle({
  children,
  right,
}: {
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--color-muted)] uppercase">
        {children}
      </h2>
      {right}
    </div>
  )
}

export function StatTile({
  icon: Icon,
  value,
  label,
  sub,
  accent = 'var(--color-primary)',
}: {
  icon: LucideIcon
  value: ReactNode
  label: string
  sub?: string
  accent?: string
}) {
  return (
    <Card className="animate-fade-up p-4">
      <div className="flex items-start justify-between">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{ background: `color-mix(in srgb, ${accent} 16%, transparent)` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </span>
      </div>
      <div className="tnum mt-3 text-2xl font-bold text-[var(--color-fg)]">
        {value}
      </div>
      <div className="mt-0.5 text-xs font-medium text-[var(--color-muted)]">
        {label}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-[var(--color-faint)]">{sub}</div>}
    </Card>
  )
}

export function ProgressBar({
  value,
  color = 'var(--color-accent)',
  height = 8,
}: {
  value: number // 0..100
  color?: string
  height?: number
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  )
}

export function Ring({
  pct,
  size = 176,
  stroke = 14,
  children,
}: {
  pct: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 700ms ease-out' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function Badge({
  children,
  color = 'var(--color-muted)',
}: {
  children: ReactNode
  color?: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      {children}
    </span>
  )
}
