import { useState } from 'react'
import { Plus, Trash2, Mic } from 'lucide-react'
import { fmtDate, parseISO } from '../lib/date'
import { t } from '../lib/i18n'
import type { Mock } from '../lib/store'
import { Badge, Card, SectionTitle } from './ui'

function todayISO(): string {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(
    n.getDate(),
  ).padStart(2, '0')}`
}

const inputCls =
  'rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-primary)]'

export function Interviews({
  mocks,
  onAdd,
  onRemove,
}: {
  mocks: Mock[]
  onAdd: (m: Omit<Mock, 'id'>) => void
  onRemove: (id: string) => void
}) {
  const [date, setDate] = useState(todayISO())
  const [kind, setKind] = useState<string>(t.interviews.kinds[0])
  const [note, setNote] = useState('')

  const submit = () => {
    onAdd({ date, kind, note: note.trim() || undefined })
    setNote('')
    setDate(todayISO())
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="mb-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
            <Mic size={16} className="text-[#fb7185]" />
            {t.interviews.title}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">{t.interviews.sub}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="date"
            name="mock-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
            aria-label={t.interviews.date}
          />
          <select
            name="mock-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className={inputCls}
            aria-label={t.interviews.kind}
          >
            {t.interviews.kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="mock-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={t.interviews.note}
            className={`${inputCls} flex-1`}
            aria-label={t.interviews.note}
          />
          <button
            onClick={submit}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-strong)]"
          >
            <Plus size={16} /> {t.interviews.add}
          </button>
        </div>
      </Card>

      <SectionTitle right={<Badge color="#fb7185">{mocks.length}</Badge>}>
        {t.interviews.title}
      </SectionTitle>

      {mocks.length === 0 ? (
        <Card className="p-5 text-sm text-[var(--color-muted)]">{t.interviews.empty}</Card>
      ) : (
        <div className="flex flex-col gap-2">
          {mocks.map((m) => (
            <Card key={m.id} className="flex items-center gap-3 p-3">
              <span className="tnum w-24 flex-shrink-0 text-xs text-[var(--color-faint)]">
                {fmtDate(parseISO(m.date))}
              </span>
              <span className="flex-shrink-0">
                <Badge color="#fb7185">{m.kind}</Badge>
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-fg)]">
                {m.note}
              </span>
              <button
                onClick={() => onRemove(m.id)}
                aria-label={t.interviews.del}
                className="flex-shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--color-faint)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger)]"
              >
                <Trash2 size={15} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
