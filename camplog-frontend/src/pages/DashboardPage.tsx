import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './DashboardPage.module.css'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import { useTimerStore } from '../store/timerStore'
import { useAuthStore } from '../store/authStore'
import { sessionsApi } from '../api/sessions'
import { campsiteApi } from '../api/campsite'
import type { CampsiteResponse, SessionResponse } from '../types'
import SkyBody from '../components/scene/SkyBody'
import Campfire from '../components/scene/Campfire'
import Bear from '../components/scene/Bear'
import Squirrel from '../components/scene/Squirrel'
import PigeonNest from '../components/scene/PigeonNest'
import ConstellationSign from '../components/scene/ConstellationSign'
import UnlockModal from '../components/UnlockModal'

const DAYS_LABEL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MILESTONE_CONFIG = [
  { key: 'bear',          icon: '🐻', label: '곰',            threshold: 90  },
  { key: 'tent',          icon: '⛺', label: '텐트',          threshold: 120 },
  { key: 'lantern',       icon: '🏮', label: '랜턴',          threshold: 240 },
  { key: 'squirrel',      icon: '🐿️', label: '다람쥐',        threshold: 360 },
  { key: 'pigeon_nest',   icon: '🕊️', label: '비둘기 둥지',   threshold: 540 },
  { key: 'constellation', icon: '✨', label: '별자리 표지판', threshold: 960 },
]

const STARS = [
  { top: '12%', left: '10%', size: 14 },
  { top: '8%',  left: '30%', size: 10 },
  { top: '18%', left: '50%', size: 16 },
  { top: '10%', left: '68%', size: 12 },
  { top: '20%', left: '85%', size: 10 },
]

function buildWeeklyData(sessions: SessionResponse[]): number[] {
  const totals = Array(7).fill(0)
  const now = Date.now()
  sessions.forEach((s) => {
    if (s.duration == null || s.endedAt == null) return  // 진행중 세션 제외
    const diffMs = now - new Date(s.startedAt).getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays < 7) {
      totals[6 - diffDays] += s.duration
    }
  })
  return totals
}

function getWeeklyLabels(): string[] {
  const labels: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    labels.push(DAYS_LABEL[d.getDay() === 0 ? 6 : d.getDay() - 1])
  }
  return labels
}

export default function DashboardPage() {
  const { theme, prevTheme, fading } = useTimeOfDay()
  const { start, isRunning, getElapsedSeconds } = useTimerStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [campsite, setCampsite] = useState<CampsiteResponse | null>(null)
  const [todaySessions, setTodaySessions] = useState<SessionResponse[]>([])
  const [weeklySessions, setWeeklySessions] = useState<SessionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [unlockedItems, setUnlockedItems] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      campsiteApi.get(),
      sessionsApi.today(),
      sessionsApi.weekly(),
    ]).then(([c, t, w]) => {
      setCampsite(c.data)
      setTodaySessions(t.data)
      setWeeklySessions(w.data)
    }).catch((err) => {
      console.error('Dashboard fetch error:', err?.response?.status, err?.response?.data || err?.message)
    }).finally(() => setLoading(false))

    // 세션 종료 후 넘어온 해금 아이템
    const state = location.state as { newlyUnlocked?: string[] } | null
    if (state?.newlyUnlocked && state.newlyUnlocked.length > 0) {
      setUnlockedItems(state.newlyUnlocked)
      window.history.replaceState({}, '')  // state 소비
    }
  }, [location.key])

  const hasActiveSession = isRunning || getElapsedSeconds() > 0

  const handleStartSession = () => {
    if (!hasActiveSession) start()
    navigate('/session')
  }

  // 오늘 통계
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  const todayHours = Math.floor(todayMinutes / 60)
  const todayMins = todayMinutes % 60
  const todayCount = todaySessions.length
  const avgFocus = todaySessions.length > 0
    ? Math.round(todaySessions.reduce((sum, s) => sum + (s.focusScore ?? 0), 0) / todaySessions.length)
    : 0

  // 주간 차트
  const weeklyData = buildWeeklyData(weeklySessions)
  const weeklyLabels = getWeeklyLabels()
  const maxTime = Math.max(...weeklyData, 1)
  const maxIndex = weeklyData.indexOf(Math.max(...weeklyData))
  const totalWeeklyMinutes = weeklyData.reduce((a, b) => a + b, 0)
  const totalWeeklyHours = Math.floor(totalWeeklyMinutes / 60)
  const totalWeeklyMins = totalWeeklyMinutes % 60

  // 캠프 성장 마일스톤
  const totalStudyTime = campsite?.totalStudyTime ?? user?.totalStudyTime ?? 0
  const unlockedKeys = new Set(campsite?.unlockedItems.map((i) => i.itemType) ?? [])
  const has = (key: string) => unlockedKeys.has(key)
  const milestones = MILESTONE_CONFIG.map((m) => {
    const done = unlockedKeys.has(m.key)
    const inProgress = !done && totalStudyTime > 0 && totalStudyTime < m.threshold
    const progress = done ? 100 : Math.min(99, Math.round((totalStudyTime / m.threshold) * 100))
    return { ...m, status: done ? 'done' : inProgress ? 'inProgress' : 'locked', progress }
  })

  return (
    <div className={styles.dashboard} style={{ background: theme.sky }}>
      <UnlockModal items={unlockedItems} onClose={() => setUnlockedItems([])} />
      <div className={styles.header}>
        {prevTheme && (
          <div className={styles.headerSkyLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
        )}
        <div className={styles.headerSkyLayer} style={{ background: theme.sky, opacity: 1 }} />

        <div className={styles.headerScene}>
          <SkyBody showSun={theme.showSun} showMoon={theme.showMoon} />

          {theme.showStars && STARS.map((s, i) => (
            <img key={i} src="/Star.png" alt="" className={styles.headerStar}
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
          ))}

          {theme.showClouds && <>
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '10%', width: '140px', animationDuration: '80s', animationDelay: '0s' }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '10%', width: '140px', animationDuration: '80s', animationDelay: '-40s' }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '35%', width: '90px',  animationDuration: '110s', animationDelay: '0s',   opacity: 0.6 }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '35%', width: '90px',  animationDuration: '110s', animationDelay: '-55s',  opacity: 0.6 }} />
          </>}

          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '-15px', height: '220px' }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '120px', height: '170px', opacity: 0.85 }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '230px', height: '130px', opacity: 0.65 }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '-15px', height: '220px' }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '120px', height: '170px', opacity: 0.85 }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '230px', height: '130px', opacity: 0.65 }} />

          <img src="/stone.png" alt="" className={styles.stone} />

          {has('lantern') && (
            <div className={styles.stoneWithLantern}>
              <img src="/stone.png" alt="" className={styles.stoneInner} />
              <div className={styles.lanternWrap}>
                <div className={styles.lanternGlow} />
                <img src="/lantern.png" alt="" className={styles.lanternImg} />
              </div>
            </div>
          )}

          {has('tent') && <img src="/tent.png" alt="" className={styles.tent} />}
          {has('squirrel') && <div className={styles.squirrelWrap}><Squirrel /></div>}
          {has('pigeon_nest') && <div className={styles.pigeonNestWrap}><PigeonNest /></div>}
          {has('constellation') && <div className={styles.constellationWrap}><ConstellationSign /></div>}

          {has('bear') && <div className={styles.bearWrap}><Bear /></div>}
          <div className={styles.campfireWrap}><Campfire /></div>
          <div className={styles.glow} />
        </div>

        <div className={styles.headerFooter}>
          <h1 className={styles.headerTitle}>{user?.nickname ?? '나'}의 캠프</h1>
        </div>
      </div>

      <div className={styles.contentList}>
        {/* 오늘 공부 */}
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>오늘 공부</h1>
          <h2 className={styles.contentSubtitle}>오늘 집중한 시간</h2>
          {loading ? (
            <p className={styles.contentData}>-</p>
          ) : (
            <p className={styles.contentData}>
              {todayHours > 0 ? `${todayHours}시간` : ''}{todayMins > 0 ? `\u00a0\u00a0\u00a0${todayMins}분` : todayHours === 0 ? '0분' : ''}
            </p>
          )}
          <div className={styles.underline}></div>
          <div className={styles.sessionText}>
            <p>집중도 &nbsp;<span>{loading ? '-' : `${avgFocus}%`}</span>&nbsp;&nbsp; | &nbsp;&nbsp;세션 &nbsp;<span>{loading ? '-' : `${todayCount}회`}</span></p>
          </div>
        </div>

        {/* 이번 주 */}
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>이번 주</h1>
          <div className={styles.weeklyChart}>
            <div className={styles.weeklyBars}>
              {weeklyLabels.map((day, i) => {
                const isMax = i === maxIndex && weeklyData[i] > 0
                const heightPct = (weeklyData[i] / maxTime) * 100
                return (
                  <div key={day + i} className={styles.weeklyBarCol}>
                    <div className={styles.weeklyBarTrack}>
                      <div
                        className={`${styles.weeklyBarFill} ${isMax ? styles.weeklyBarToday : ''}`}
                        style={{ height: loading ? '0%' : `${heightPct}%` }}
                      />
                    </div>
                    <span className={`${styles.weeklyDayLabel} ${isMax ? styles.weeklyDayToday : ''}`}>
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className={styles.weeklyTotal}>
              이번 주 총 <strong>{loading ? '-' : `${totalWeeklyHours}시간${totalWeeklyMins > 0 ? ` ${totalWeeklyMins}분` : ''}`}</strong>
            </div>
          </div>
        </div>

        {/* 캠프 성장 */}
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>캠프 성장</h1>
          <div className={styles.milestoneList}>
            {milestones.map((m, i) => {
              const dotClass =
                m.status === 'done'       ? styles.milestoneDotDone :
                m.status === 'inProgress' ? styles.milestoneDotProgress :
                styles.milestoneDotLocked
              const labelClass =
                m.status === 'done'       ? styles.milestoneLabelDone :
                m.status === 'inProgress' ? styles.milestoneLabelProgress :
                styles.milestoneLabelLocked
              const descClass =
                m.status === 'done'       ? styles.milestoneDescDone :
                m.status === 'inProgress' ? styles.milestoneDescProgress :
                styles.milestoneDescLocked

              const thresholdH = Math.floor(m.threshold / 60)
              const desc = m.status === 'done'
                ? '달성'
                : m.status === 'inProgress'
                ? `진행 중 ${m.progress}%`
                : `${thresholdH}h~`

              return (
                <div key={m.key} className={styles.milestoneItem}>
                  <div className={styles.milestoneLeft}>
                    <div className={`${styles.milestoneDot} ${dotClass}`}>
                      {m.status === 'done' && '✓'}
                    </div>
                    {i < milestones.length - 1 && <div className={styles.milestoneLine} />}
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneRow}>
                      <span className={styles.milestoneIcon}>{m.icon}</span>
                      <span className={`${styles.milestoneLabel} ${labelClass}`}>{m.label}</span>
                      <span className={`${styles.milestoneDesc} ${descClass}`}>- {desc}</span>
                    </div>
                    {m.status === 'inProgress' && (
                      <div className={styles.milestoneProgressBar}>
                        <div className={styles.milestoneProgressFill} style={{ width: `${m.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <button className={styles.newSessionButton} onClick={handleStartSession}>
        {hasActiveSession ? '캠프로 돌아가기' : '집중 세션 시작하기'}
      </button>
    </div>
  )
}