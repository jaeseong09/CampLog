import { useState, useEffect } from 'react'

export type TimeOfDay = 'dawn' | 'morning' | 'day' | 'sunset' | 'night'

export interface TimeTheme {
  period: TimeOfDay
  sky: string
  showStars: boolean
  showMoon: boolean
  showSun: boolean
  showClouds: boolean
  treeOpacity: number
  treeImage: string
}

export interface SkyTransition {
  from: string
  to: string
  progress: number  // 0 ~ 1
}

function getPeriod(hour: number): TimeOfDay {
  if (hour >= 5  && hour < 7)  return 'dawn'
  if (hour >= 7  && hour < 18) return 'day'
  if (hour >= 18 && hour < 20) return 'sunset'
  return 'night'
}

export const THEMES: Record<TimeOfDay, Omit<TimeTheme, 'period'>> = {
  dawn: {
    sky: 'linear-gradient(to bottom, #0d0e2a 0%, #1a1a4a 35%, #3d2a5a 60%, #7a3a2a 80%, #c4622a 100%)',
    showStars: true,
    showMoon: true,
    showSun: false,
    showClouds: false,
    treeOpacity: 0.65,
    treeImage: '/nightTree.png',
  },
  morning: {
    sky: 'linear-gradient(to bottom, #1a1040 0%, #6b3fa0 30%, #e8824a 70%, #f5a623 100%)',
    showStars: false,
    showMoon: false,
    showSun: true,
    showClouds: true,
    treeOpacity: 0.75,
    treeImage: '/moningTree.png',
  },
  day: {
    sky: 'linear-gradient(to bottom, #1a6eb5 0%, #3a9fd4 40%, #87ceeb 100%)',
    showStars: false,
    showMoon: false,
    showSun: true,
    showClouds: true,
    treeOpacity: 0.9,
    treeImage: '/moningTree.png',
  },
  sunset: {
    sky: 'linear-gradient(to bottom, #1a1040 0%, #7b3a62 25%, #e8612a 60%, #f5a020 100%)',
    showStars: false,
    showMoon: false,
    showSun: false,
    showClouds: true,
    treeOpacity: 0.8,
    treeImage: '/sunsetTree.png',
  },
  night: {
    sky: 'linear-gradient(to bottom, #0d0e2a 0%, #1a1b3a 50%, #2a1f3d 75%, #1a1208 100%)',
    showStars: true,
    showMoon: true,
    showSun: false,
    showClouds: false,
    treeOpacity: 0.7,
    treeImage: '/nightTree.png',
  },
}

export function useTimeOfDay() {
  const [period, setPeriod] = useState<TimeOfDay>(() => getPeriod(new Date().getHours()))
  const [prevPeriod, setPrevPeriod] = useState<TimeOfDay | null>(null)
  const [fading, setFading] = useState(false)

  // 매 분마다 시간 체크
  useEffect(() => {
    const check = () => {
      const next = getPeriod(new Date().getHours())
      if (next !== period) {
        setPrevPeriod(period)
        setPeriod(next)
        setFading(true)
      }
    }
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [period])

  // fade 완료 후 정리
  useEffect(() => {
    if (!fading) return
    const id = setTimeout(() => {
      setPrevPeriod(null)
      setFading(false)
    }, 3000)
    return () => clearTimeout(id)
  }, [fading])

  const theme: TimeTheme = { period, ...THEMES[period] }
  const prevTheme = prevPeriod ? { period: prevPeriod, ...THEMES[prevPeriod] } : null

  return { theme, prevTheme, fading }
}
