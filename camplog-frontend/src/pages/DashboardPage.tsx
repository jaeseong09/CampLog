import { useNavigate } from 'react-router-dom'
import styles from './DashboardPage.module.css'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import { useTimerStore } from '../store/timerStore'
import SkyBody from '../components/scene/SkyBody'
import Campfire from '../components/scene/Campfire'
import Bear from '../components/scene/Bear'

const STARS = [
  { top: '12%', left: '10%', size: 14 },
  { top: '8%',  left: '30%', size: 10 },
  { top: '18%', left: '50%', size: 16 },
  { top: '10%', left: '68%', size: 12 },
  { top: '20%', left: '85%', size: 10 },
]

const MILESTONES = [
  { icon: '⛺', label: '텐트',           status: 'done',       desc: '1h 달성',    progress: 100 },
  { icon: '🏮', label: '랜턴',           status: 'inProgress', desc: '진행 중 60%', progress: 60  },
  { icon: '🐿️', label: '다람쥐',         status: 'locked',     desc: '5h~',        progress: 0   },
  { icon: '🔥', label: '모닥불 업그레이드', status: 'locked',     desc: '10h~',       progress: 0   },
] as const

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// 더미 데이터 (분 단위) — 추후 API로 교체
const WEEKLY_DATA = [120, 90, 180, 60, 45, 150, 30]


const maxTime = Math.max(...WEEKLY_DATA)
const maxIndex = WEEKLY_DATA.indexOf(maxTime)
const totalMinutes = WEEKLY_DATA.reduce((a, b) => a + b, 0)
const totalHours = Math.floor(totalMinutes / 60)
const totalMins = totalMinutes % 60

export default function DashboardPage() {
  const { theme, prevTheme, fading } = useTimeOfDay()
  const { start, isRunning, getElapsedSeconds } = useTimerStore()
  const navigate = useNavigate()

  const hasActiveSession = isRunning || getElapsedSeconds() > 0

  const handleStartSession = () => {
    if (!hasActiveSession) start()
    navigate('/session')
  }

  return (
    <div className={styles.dashboard} style={{ background: theme.sky }}>
      <div className={styles.header}>

        {/* 배경 레이어 — crossfade */}
        {prevTheme && (
          <div className={styles.headerSkyLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
        )}
        <div className={styles.headerSkyLayer} style={{ background: theme.sky, opacity: 1 }} />

        {/* 씬 콘텐츠 영역 */}
        <div className={styles.headerScene}>

          {/* 해 / 달 */}
          <SkyBody showSun={theme.showSun} showMoon={theme.showMoon} />

          {/* 별 */}
          {theme.showStars && STARS.map((s, i) => (
            <img key={i} src="/Star.png" alt="" className={styles.headerStar}
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
          ))}

          {/* 구름 */}
          {theme.showClouds && <>
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '10%', width: '140px', animationDuration: '80s', animationDelay: '0s' }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '10%', width: '140px', animationDuration: '80s', animationDelay: '-40s' }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '35%', width: '90px',  animationDuration: '110s', animationDelay: '0s',   opacity: 0.6 }} />
            <img src="/cloud.svg" alt="" className={styles.headerCloud} style={{ top: '35%', width: '90px',  animationDuration: '110s', animationDelay: '-55s',  opacity: 0.6 }} />
          </>}

          {/* 나무 왼쪽 */}
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '-15px', height: '220px' }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '120px', height: '170px', opacity: 0.85 }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ left: '230px', height: '130px', opacity: 0.65 }} />

          {/* 나무 오른쪽 */}
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '-15px', height: '220px' }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '120px', height: '170px', opacity: 0.85 }} />
          <img src={theme.treeImage} alt="" className={styles.headerTree} style={{ right: '230px', height: '130px', opacity: 0.65 }} />
          
          {/* 돌 왼쪽 */}
          <img src="/stone.png" alt="" className={styles.stone} />

          {/* 돌 오른쪽 + 랜턴 (같은 위치에 고정) */}
          <div className={styles.stoneWithLantern}>
            <img src="/stone.png" alt="" className={styles.stoneInner} />
            <div className={styles.lanternWrap}>
              <div className={styles.lanternGlow} />
              <img src="/lantern.png" alt="" className={styles.lanternImg} />
            </div>
          </div>

          {/* 텐트 */}
          <img src="/tent.png" alt="" className={styles.tent} />

          {/* 곰 */}
          <div className={styles.bearWrap}>
            <Bear />
          </div>

          {/* 캠프파이어 */}
          <div className={styles.campfireWrap}>
            <Campfire />
          </div>
          
          {/* 글로우 효과 (캠프파이어 빛) */}
          <div className={styles.glow} />

        </div>

        {/* 하단 정보 바 */}
        <div className={styles.headerFooter}>
          <h1 className={styles.headerTitle}>나의 캠프</h1>
        </div>

      </div>
      <div className={styles.contentList}>
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>오늘 공부</h1>
          <h2 className={styles.contentSubtitle}>오늘 집중한 시간</h2>
          <p className={styles.contentData}>3시간&nbsp;&nbsp;&nbsp;20분</p>
          <div className={styles.underline}></div>
          <div className={styles.sessionText}>
            <p>집중도 &nbsp;<span>87%</span>&nbsp;&nbsp; | &nbsp;&nbsp;세션 &nbsp;<span>3회</span></p>
          </div>
        </div>
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>이번 주</h1>
          <div className={styles.weeklyChart}>
            <div className={styles.weeklyBars}>
              {DAYS.map((day, i) => {
                const isMax = i === maxIndex
                const heightPct = maxTime > 0 ? (WEEKLY_DATA[i] / maxTime) * 100 : 0
                return (
                  <div key={day} className={styles.weeklyBarCol}>
                    <div className={styles.weeklyBarTrack}>
                      <div
                        className={`${styles.weeklyBarFill} ${isMax ? styles.weeklyBarToday : ''}`}
                        style={{ height: `${heightPct}%` }}
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
              이번 주 총 <strong>{totalHours}시간 {totalMins > 0 ? `${totalMins}분` : ''}</strong>
            </div>
          </div>
        </div>
        <div className={styles.contentItem}>
          <h1 className={styles.contentTitle}>캠프 성장</h1>
          <div className={styles.milestoneList}>
            {MILESTONES.map((m, i) => {
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

              return (
                <div key={i} className={styles.milestoneItem}>
                  <div className={styles.milestoneLeft}>
                    <div className={`${styles.milestoneDot} ${dotClass}`}>
                      {m.status === 'done' && '✓'}
                    </div>
                    {i < MILESTONES.length - 1 && <div className={styles.milestoneLine} />}
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneRow}>
                      <span className={styles.milestoneIcon}>{m.icon}</span>
                      <span className={`${styles.milestoneLabel} ${labelClass}`}>{m.label}</span>
                      <span className={`${styles.milestoneDesc} ${descClass}`}>- {m.desc}</span>
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
