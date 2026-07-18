import { useCallback, useEffect, useState } from 'react'

const BASE = 'dmr:progress:v1'
const LEGACY = 'dmr:progress:v1' // pre-multi-track single-plan key (deep-mastery only)

const keyFor = (trackId: string) => `${BASE}:${trackId}`

export interface Mock {
  id: string
  date: string // ISO
  kind: string
  note?: string
}

export interface Progress {
  done: Record<string, true> // block/lesson key -> done
  builds: Record<number, true>
  math: Record<number, true>
  mocks: Mock[]
  /** Optional self-set completion target (ISO date) for curriculum tracks. */
  targetDate?: string
}

const EMPTY: Progress = { done: {}, builds: {}, math: {}, mocks: [] }

function load(trackId: string): Progress {
  try {
    let raw = localStorage.getItem(keyFor(trackId))
    if (!raw && trackId === 'deep-mastery') raw = localStorage.getItem(LEGACY) // migrate old single-plan data
    if (!raw) return EMPTY
    const p = JSON.parse(raw) as Partial<Progress>
    return {
      done: p.done ?? {},
      builds: p.builds ?? {},
      math: p.math ?? {},
      mocks: p.mocks ?? [],
      targetDate: p.targetDate,
    }
  } catch {
    return EMPTY
  }
}

/**
 * Track-scoped progress. Reloads via the derived-state pattern when `trackId`
 * changes so state and its storage key always move together — no stale write
 * to the newly-selected track's key. (ponytail: derived state over an effect+ref
 * race; upgrade to a keyed remount only if this component grows.)
 */
export function useProgress(trackId: string) {
  const [state, setState] = useState<{ trackId: string; progress: Progress }>(() => ({
    trackId,
    progress: load(trackId),
  }))

  if (state.trackId !== trackId) {
    setState({ trackId, progress: load(trackId) })
  }
  const progress = state.progress

  useEffect(() => {
    try {
      localStorage.setItem(keyFor(state.trackId), JSON.stringify(state.progress))
    } catch {
      // storage full/blocked — keep in-memory state
    }
  }, [state.trackId, state.progress])

  const update = useCallback((fn: (p: Progress) => Progress) => {
    setState((s) => ({ ...s, progress: fn(s.progress) }))
  }, [])

  const toggleBlock = useCallback(
    (key: string) =>
      update((p) => {
        const done = { ...p.done }
        if (done[key]) delete done[key]
        else done[key] = true
        return { ...p, done }
      }),
    [update],
  )

  const setKeys = useCallback(
    (keys: string[], value: boolean) =>
      update((p) => {
        const done = { ...p.done }
        for (const k of keys) {
          if (value) done[k] = true
          else delete done[k]
        }
        return { ...p, done }
      }),
    [update],
  )

  const toggleBuild = useCallback(
    (id: number) =>
      update((p) => {
        const builds = { ...p.builds }
        if (builds[id]) delete builds[id]
        else builds[id] = true
        return { ...p, builds }
      }),
    [update],
  )

  const toggleMath = useCallback(
    (order: number) =>
      update((p) => {
        const math = { ...p.math }
        if (math[order]) delete math[order]
        else math[order] = true
        return { ...p, math }
      }),
    [update],
  )

  const addMock = useCallback(
    (m: Omit<Mock, 'id'>) =>
      update((p) => ({ ...p, mocks: [{ ...m, id: crypto.randomUUID() }, ...p.mocks] })),
    [update],
  )

  const removeMock = useCallback(
    (id: string) => update((p) => ({ ...p, mocks: p.mocks.filter((m) => m.id !== id) })),
    [update],
  )

  const setTargetDate = useCallback(
    (date?: string) => update((p) => ({ ...p, targetDate: date || undefined })),
    [update],
  )

  const reset = useCallback(() => update(() => EMPTY), [update])
  const replaceAll = useCallback((next: Progress) => update(() => next), [update])

  return {
    progress,
    toggleBlock,
    setKeys,
    toggleBuild,
    toggleMath,
    addMock,
    removeMock,
    setTargetDate,
    reset,
    replaceAll,
  }
}
