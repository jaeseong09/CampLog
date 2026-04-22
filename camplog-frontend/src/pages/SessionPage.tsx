import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SessionPage.module.css'
import { useTimerStore } from '../store/timerStore'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import { sessionAudio } from '../utils/sessionAudio'
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
  const { isRunning, start, pause, resume, stop, getElapsedSeconds, totalSeconds } = useTimerStore()
  const [, setTick] = useState(0)

  useEffect(() => {
    // 새 세션이면 시작 + 오디오 재생
    if (!isRunning && getElapsedSeconds() === 0) {
      start()
      sessionAudio.play()
    } else if (isRunning) {
      // 돌아왔을 때 이미 진행 중이면 오디오 재생
      sessionAudio.play()
    }
    // 1초마다 재렌더링 — 언마운트 시 인터벌만 정리 (오디오는 유지)
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

  const handleEnd = () => {
    stop()
    sessionAudio.stop()
    navigate('/dashboard')
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

      <div className={styles.glow} />

      {/* 캠프파이어 */}
      <div className={styles.campfireWrap}>
        <Campfire />
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
            <p className={styles.accumulated}>오늘 누적 <strong>2시간 30분</strong></p>
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
