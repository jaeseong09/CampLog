import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SessionPage.module.css'
import { useTimerStore } from '../store/timerStore'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import { sessionAudio } from '../utils/sessionAudio'
import { sessionsApi } from '../api/sessions'
import Campfire from '../components/scene/Campfire'
import SkyBody from '../components/scene/SkyBody'

const RADIUS = 195
const STROKE_WIDTH = 13
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const STARS = [
  { top: '8%',  left: '10%', size: 18 },
  { top: '5%',  left: '28%', size: 14 },
  { top: '12%', left: '50%', size: 22 },
  { top: '6%',  left: '65%', size: 16 },
  { top: '15%', left: '80%', size: 12 },
  { top: '9%',  left: '88%', size: 20 },
]

export default function SessionPage() {
  const navigate = useNavigate()
  const { theme, prevTheme, fading } = useTimeOfDay()
  const { isRunning, start, pause, resume, stop, getElapsedSeconds, totalSeconds, serverSessionId, setServerSessionId, pauseCount } = useTimerStore()
  const [, setTick] = useState(0)
  const [todayMinutes, setTodayMinutes] = useState(0)

  useEffect(() => {
    sessionsApi.today().then(({ data }) => {
      const total = data.reduce((sum, s) => sum + (s.duration ?? 0), 0)
      setTodayMinutes(total)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const initSession = async () => {
      if (!isRunning && getElapsedSeconds() === 0) {
        start()
      }
      sessionAudio.play()

      // serverSessionId가 없으면 항상 백엔드 세션 시작/복구 시도
      if (!serverSessionId) {
        try {
          const { data } = await sessionsApi.start()
          setServerSessionId(data.id)
        } catch {
          // 이미 서버에 진행 중인 세션이 있으면 그 ID를 가져와 재사용
          try {
            const { data } = await sessionsApi.getActive()
            if (data) setServerSessionId(data.id)
          } catch {}
        }
      }
    }
    initSession()
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // 일시정지/재개 시 오디오 동기화
  useEffect(() => {
    if (isRunning) sessionAudio.play()
    else sessionAudio.pause()
  }, [isRunning])


  const elapsed = Math.floor(getElapsedSeconds())
  const elapsedF = getElapsedSeconds()
  const lap = Math.floor(elapsedF / totalSeconds)         // 현재 몇 바퀴째 (0~)
  const lapProgress = (elapsedF % totalSeconds) / totalSeconds
  const lapOffset = CIRCUMFERENCE * (1 - lapProgress)

  // 각 바퀴 dashOffset: 해당 바퀴가 완주됐으면 0(꽉참), 진행 중이면 lapOffset
  const firstOffset  = lap >= 1 ? 0 : lapOffset
  const secondOffset = lap >= 2 ? 0 : lapOffset
  const thirdOffset  = lapOffset

  const firstLapColor = '#ffe066'

  const trackColor = theme.period === 'day'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(255, 255, 255, 0.08)'

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const handleEnd = async () => {
    const elapsed = Math.floor(getElapsedSeconds())
    const focusScore = Math.max(0, Math.min(100, 100 - pauseCount * 10))
    let newlyUnlocked: string[] = []

    if (serverSessionId) {
      try {
        const { data } = await sessionsApi.end(serverSessionId, focusScore, pauseCount)
        newlyUnlocked = data.newlyUnlockedItems ?? []
      } catch {
        // 세션 종료 실패해도 타이머는 리셋
      }
    }
    stop()
    sessionAudio.stop()
    navigate('/dashboard', { state: { elapsed, newlyUnlocked } })
  }

  return (
    <div className={styles.scene}>

      {/* 뒤로가기 버튼 — 네브바 로고 아래 */}
      <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        대시보드
      </button>

      {/* 배경 crossfade */}
      {prevTheme && (
        <div className={styles.skyLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
      )}
      <div className={styles.skyLayer} style={{ background: theme.sky, opacity: 1 }} />

      <SkyBody showSun={theme.showSun} showMoon={theme.showMoon} />

      {theme.showStars && STARS.map((s, i) => (
        <img key={i} src="/Star.png" alt="" className={styles.star}
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
      ))}

      {/* 구름 */}
      {theme.showClouds && <>
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '8%',  width: '180px', animationDuration: '80s',  animationDelay: '0s' }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '8%',  width: '180px', animationDuration: '80s',  animationDelay: '-40s' }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '22%', width: '120px', animationDuration: '110s', animationDelay: '0s',   opacity: 0.6 }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '22%', width: '120px', animationDuration: '110s', animationDelay: '-55s',  opacity: 0.6 }} />
      </>}

      {/* 나무 */}
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '-100px',  height: '600px' }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '80px',  height: '500px', opacity: 0.85 }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '240px',  height: '400px', opacity: 0.65 }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ right: '-160px', height: '640px' }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ right: '60px', height: '500px', opacity: 0.85 }} />
      <img src="/bigTree.png"    alt="" className={styles.tree} style={{ right: '100px',   height: '48em' }} />

      <div className={styles.glow} style={{
        opacity: 0.3 + (Math.max(0, Math.min(100, 100 - pauseCount * 10)) / 100) * 0.7,
        transition: 'opacity 2s ease',
      }} />

      {/* 캠프파이어 */}
      <div className={styles.campfireWrap}>
        <Campfire intensity={Math.max(0, Math.min(100, 100 - pauseCount * 10))} />
      </div>

      <div className={styles.footer} />

      {/* 타이머 오버레이 */}
      <div className={styles.timerOverlay}>
        <div className={styles.timerRing}>
          <svg width={460} height={460} viewBox="0 0 460 460">
            {/* 배경 트랙 */}
            <circle
              cx={230} cy={230} r={RADIUS}
              fill="none"
              stroke={trackColor}
              strokeWidth={STROKE_WIDTH}
            />
            {/* 1바퀴 */}
            <circle
              cx={230} cy={230} r={RADIUS}
              fill="none" stroke={firstLapColor} strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={firstOffset}
              transform="rotate(-90 230 230)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            {/* 2바퀴 — 오렌지 (1바퀴 완주 후) */}
            {lap >= 1 && (
              <circle
                cx={230} cy={230} r={RADIUS}
                fill="none" stroke="#ff5722" strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={secondOffset}
                transform="rotate(-90 230 230)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            )}
            {/* 3바퀴 — 블루 플레임 (2바퀴 완주 후) */}
            {lap >= 2 && (
              <circle
                cx={230} cy={230} r={RADIUS}
                fill="none" stroke="#38bdf8" strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={thirdOffset}
                transform="rotate(-90 230 230)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            )}
          </svg>
          <div className={styles.timerDisplay}>
            <p className={styles.sessionLabel}>집중 세션 진행 중</p>
            <span className={styles.timerTime}>{timeStr}</span>
            <p className={styles.accumulated}>오늘 누적 <strong>{Math.floor(todayMinutes / 60) > 0 ? `${Math.floor(todayMinutes / 60)}시간 ` : ''}{todayMinutes % 60 > 0 ? `${todayMinutes % 60}분` : todayMinutes === 0 ? '0분' : ''}</strong></p>
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.pauseBtn}
            onClick={() => isRunning ? pause() : resume()}
          >
            {isRunning ? '일시정지' : '재개'}
          </button>
          <button className={styles.endBtn} onClick={handleEnd}>종료</button>
        </div>
      </div>

    </div>
  )
}
