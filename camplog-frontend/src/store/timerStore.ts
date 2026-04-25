import { create } from 'zustand'

interface TimerStore {
  totalSeconds: number
  accumulatedSeconds: number
  startedAt: number | null
  isRunning: boolean
  pauseCount: number
  serverSessionId: number | null  // 백엔드 세션 ID

  start: (totalSeconds?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setServerSessionId: (id: number | null) => void
  getElapsedSeconds: () => number
  getTimeLeft: () => number
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  totalSeconds: 25 * 60,
  accumulatedSeconds: 0,
  startedAt: null,
  isRunning: false,
  pauseCount: 0,
  serverSessionId: null,

  start: (totalSeconds = 60 * 60) => set({
    totalSeconds,
    accumulatedSeconds: 0,
    startedAt: Date.now(),
    isRunning: true,
    pauseCount: 0,
  }),

  pause: () => {
    const { startedAt, accumulatedSeconds, isRunning, pauseCount } = get()
    if (!isRunning || startedAt === null) return
    const extra = (Date.now() - startedAt) / 1000
    set({
      accumulatedSeconds: accumulatedSeconds + extra,
      startedAt: null,
      isRunning: false,
      pauseCount: pauseCount + 1,
    })
  },

  resume: () => {
    if (get().isRunning) return
    set({ startedAt: Date.now(), isRunning: true })
  },

  stop: () => set({
    totalSeconds: 25 * 60,
    accumulatedSeconds: 0,
    startedAt: null,
    isRunning: false,
    pauseCount: 0,
    serverSessionId: null,
  }),

  setServerSessionId: (id) => set({ serverSessionId: id }),

  getElapsedSeconds: () => {
    const { startedAt, accumulatedSeconds, isRunning } = get()
    let elapsed = accumulatedSeconds
    if (isRunning && startedAt !== null) {
      elapsed += (Date.now() - startedAt) / 1000
    }
    return elapsed
  },

  getTimeLeft: () => {
    const { totalSeconds } = get()
    return Math.max(0, totalSeconds - get().getElapsedSeconds())
  },
}))