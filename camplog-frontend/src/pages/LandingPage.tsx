import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'
import Campfire from '../components/scene/Campfire'
import Bear from '../components/scene/Bear'
import SkyBody from '../components/scene/SkyBody'
import { useTimeOfDay } from '../hooks/useTimeOfDay'

const STARS = [
  { top: '8%',  left: '10%', size: 18 },
  { top: '5%',  left: '28%', size: 14 },
  { top: '12%', left: '45%', size: 22 },
  { top: '6%',  left: '60%', size: 16 },
  { top: '15%', left: '72%', size: 12 },
  { top: '9%',  left: '85%', size: 20 },
  { top: '20%', left: '20%', size: 12 },
  { top: '18%', left: '55%', size: 14 },
  { top: '25%', left: '80%', size: 16 },
  { top: '22%', left: '38%', size: 10 },
]

export default function LandingPage() {
  const { theme, prevTheme, fading } = useTimeOfDay()

  return (
    <div className={styles.scene}>

      {/* 이전 배경 — fade out */}
      {prevTheme && (
        <div
          className={styles.skyLayer}
          style={{
            background: prevTheme.sky,
            opacity: fading ? 0 : 1,
          }}
        />
      )}

      {/* 현재 배경 — fade in */}
      <div
        className={styles.skyLayer}
        style={{
          background: theme.sky,
          opacity: 1
        }}
      />

      {/* 해 / 달 */}
      <SkyBody showSun={theme.showSun} showMoon={theme.showMoon} />

      {/* 구름 — showClouds일 때만 */}
      {theme.showClouds && <>
        {/* 줄 1 — 2개가 40s 간격으로 교대 */}
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '8%',  width: '180px', animationDuration: '80s', animationDelay: '0s' }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '8%',  width: '180px', animationDuration: '80s', animationDelay: '-20s' }} />
        {/* 줄 2 — 2개가 55s 간격으로 교대 */}
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '22%', width: '120px', animationDuration: '120s', animationDelay: '0s',   opacity: 0.6 }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '22%', width: '120px', animationDuration: '120s', animationDelay: '-60s',  opacity: 0.6 }} />
        {/* 줄 3 — 2개가 70s 간격으로 교대 */}
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '36%', width: '220px', animationDuration: '100s', animationDelay: '0s',   opacity: 0.5 }} />
        <img src="/cloud.svg" alt="" className={styles.cloud} style={{ top: '36%', width: '220px', animationDuration: '100s', animationDelay: '-40s',  opacity: 0.5 }} />
      </>}

      {/* 별 — 밤/새벽에만 */}
      {theme.showStars && STARS.map((s, i) => (
        <img
          key={i}
          src="/Star.png"
          alt=""
          className={styles.star}
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
        />
      ))}

      {/* 나무 왼쪽 */}
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '-20px',  height: '500px' }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '170px',  height: '400px', opacity: 0.85 }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ left: '320px',  height: '300px', opacity: 0.7 }} />

      {/* 나무 오른쪽 */}
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ right: '-20px', height: '500px' }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ right: '170px', height: '400px', opacity: 0.85 }} />
      <img src={theme.treeImage} alt="" className={styles.tree} style={{ right: '320px', height: '300px', opacity: 0.7 }} />

      {/* 돌 왼쪽 */}
      <img src="/stone.png" alt="" className={styles.stone} style={{ left: '8%', width: '140px' }} />

      {/* 돌 오른쪽 + 랜턴 (같은 위치에 고정) */}
      <div className={styles.stoneWithLantern}>
        <img src="/stone.png" alt="" className={styles.stoneInner} />
        <div className={styles.lanternWrap}>
          <div className={styles.lanternGlow} />
          <img src="/lantern.png" alt="" className={styles.lanternImg} />
        </div>
      </div>

      {/* 불빛 glow */}
      <div className={styles.glow} />

      {/* 곰 캐릭터 — 불 왼쪽 */}
      <div style={{ position: 'absolute', bottom: '5px', left: 'calc(50% - 00px)', zIndex: 4 }}>
        <Bear />
      </div>

      {/* 캠프파이어 */}
      <div className={styles.campfireWrap}>
        <Campfire />
      </div>

      {/* 텐트 */}
      <img src="/tent.png" alt="" className={styles.tent} />

      {/* 텍스트 */}
      <div className={styles.content}>
        <h1 className={styles.title}>공부할 때마다, 나만의 캠프가 피어난다</h1>
        <p className={styles.description} style={theme.period === 'day' ? { color: 'white' } : {}}>집중한 시간이 쌓일수록 텐트가 생기고, 동물이 찾아오고, 캠프가 완성됩니다</p>
        <Link to="/login" className={styles.ctaButton}>
          지금 캠프 시작하기
        </Link>
      </div>

      <div className={styles.footer} />
    </div>
  )
}
