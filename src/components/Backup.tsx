import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { t } from '../lib/i18n'
import type { Progress } from '../lib/store'
import { Card, SectionTitle } from './ui'

export interface Stat {
  label: string
  value: string
}

function coerce(raw: unknown): Progress | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Partial<Progress>
  return {
    done: p.done ?? {},
    builds: p.builds ?? {},
    math: p.math ?? {},
    mocks: Array.isArray(p.mocks) ? p.mocks : [],
    targetDate: p.targetDate,
  }
}

export function Backup({
  progress,
  stats,
  onReplace,
  onReset,
}: {
  progress: Progress
  stats: Stat[]
  onReplace: (p: Progress) => void
  onReset: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deep-mastery-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async (file: File) => {
    try {
      const parsed = coerce(JSON.parse(await file.text()))
      if (!parsed) throw new Error('bad shape')
      onReplace(parsed)
      setMsg({ ok: true, text: t.backup.imported })
    } catch {
      setMsg({ ok: false, text: t.backup.importFail })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-[var(--color-fg)]">{t.backup.title}</h2>
        <p className="mt-0.5 max-w-2xl text-xs text-[var(--color-muted)]">{t.backup.sub}</p>
      </Card>

      <div>
        <SectionTitle>{t.backup.stats}</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-3">
              <div className="tnum text-lg font-bold text-[var(--color-fg)]">{s.value}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{s.label}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportJson}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)]"
        >
          <Download size={16} /> {t.backup.export}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)]"
        >
          <Upload size={16} /> {t.backup.import}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) importJson(f)
            e.target.value = ''
          }}
        />
        <button
          onClick={() => {
            if (confirm(t.backup.resetConfirm)) {
              onReset()
              setMsg({ ok: true, text: '✓' })
            }
          }}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--color-danger)_45%,transparent)] px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]"
        >
          <RotateCcw size={16} /> {t.backup.reset}
        </button>
      </div>

      {msg && (
        <p
          className="text-sm"
          style={{ color: msg.ok ? 'var(--color-accent)' : 'var(--color-danger)' }}
        >
          {msg.text}
        </p>
      )}
    </div>
  )
}
