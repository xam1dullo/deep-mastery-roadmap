import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Compass,
  Layers,
  X,
  type LucideIcon,
} from 'lucide-react'

interface Step {
  Icon: LucideIcon
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    Icon: Compass,
    title: 'Deep Mastery Roadmap',
    body: "Ikki o'quv trekingizni kunma-kun kuzatadigan tracker: Deep Mastery (backend/fullstack, 364 kun) va DevOps (73 dars). Barcha progress brauzeringizda saqlanadi — ro'yxatdan o'tish shart emas.",
  },
  {
    Icon: CalendarCheck,
    title: 'Har kuni belgilang',
    body: "«Bugun» kartasidan boshlang. Har kun DSA · Build · Kurs · Matematika bloklarini bajarib, ustiga bosib belgilang. Progress, streak va foizlar avtomatik hisoblanadi.",
  },
  {
    Icon: Layers,
    title: 'Treklar va maqsad',
    body: "Chapdagi tugmadan Deep Mastery ↔ DevOps almashtiring — har biri alohida saqlanadi. DevOps'da tugatish maqsad sanasini qo'ysangiz, kerakli sur'atni ko'rsatadi. Zaxira'dan istalgan vaqt eksport qiling.",
  },
]

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const { Icon, title, body } = STEPS[step]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
      if (e.key === 'ArrowRight') setStep((s) => Math.min(STEPS.length - 1, s + 1))
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(0, s - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onDone}
        aria-hidden
      />
      <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
        {/* ambient top glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            background:
              'radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent)',
          }}
        />
        <button
          onClick={onDone}
          aria-label="Yopish"
          className="absolute top-3 right-3 z-10 cursor-pointer rounded-lg p-1.5 text-[var(--color-faint)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
        >
          <X size={18} />
        </button>

        <div className="relative px-6 pt-8 pb-6">
          <span
            className="grid h-14 w-14 place-items-center rounded-2xl"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 16%, transparent)',
              boxShadow: '0 8px 30px color-mix(in srgb, var(--color-primary) 30%, transparent)',
            }}
          >
            <Icon size={26} style={{ color: 'var(--color-primary)' }} />
          </span>

          <h2 className="mt-5 text-xl font-bold text-[var(--color-fg)]">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{body}</p>

          <div className="mt-6 flex items-center justify-between">
            {/* step dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 22 : 6,
                    background:
                      i === step ? 'var(--color-primary)' : 'var(--color-border-strong)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  aria-label="Orqaga"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <button
                onClick={() => (last ? onDone() : setStep((s) => s + 1))}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-strong)]"
              >
                {last ? 'Boshlash' : 'Keyingi'}
                {!last && <ArrowRight size={16} />}
              </button>
            </div>
          </div>

          {!last && (
            <button
              onClick={onDone}
              className="mt-3 cursor-pointer text-xs text-[var(--color-faint)] transition-colors hover:text-[var(--color-muted)]"
            >
              O'tkazib yuborish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
