import { create } from 'zustand'

interface TimerStore {
  totalSeconds: number
  accumulatedSeconds: number  // 일시정지 전까지 누적된 초
  startedAt: number | null    // 마지막으로 시작한 시각 (Date.now())
  isRunning: boolean

  start: (totalSeconds?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  getElapsedSeconds: () => number
  getTimeLeft: () => number
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  totalSeconds: 1 * 60,
  accumulatedSeconds: 0,
  startedAt: null,
  isRunning: false,

  start: (totalSeconds = 60 * 60) => set({
    totalSeconds,
    accumulatedSeconds: 0,
    startedAt: Date.now(),
    isRunning: true,
  }),

  pause: () => {
    const { startedAt, accumulatedSeconds, isRunning } = get()
    if (!isRunning || startedAt === null) return
    const extra = (Date.now() - startedAt) / 1000
    set({ accumulatedSeconds: accumulatedSeconds + extra, startedAt: null, isRunning: false })
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
  }),

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
