import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './LoginPage.module.css'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import Campfire from '../components/scene/Campfire'
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

type TreeEntry = {
  side: 'left' | 'right'
  pos: string
  height: number
  opacity: number
  src: 'main' | string
  z: number
}

const TREES: TreeEntry[] = [
  { side: 'left', pos: '-50px',  height: 620, opacity: 1.0,  src: 'main',       z: 20 },
  { side: 'left', pos: '40px',   height: 500, opacity: 0.95, src: '/tree3.png', z: 21 },
  { side: 'left', pos: '110px',  height: 560, opacity: 0.90, src: '/tree2.png', z: 20 },
  { side: 'left', pos: '225px',  height: 420, opacity: 0.82, src: 'main',       z: 19 },
  { side: 'left', pos: '265px',  height: 480, opacity: 0.78, src: '/tree.png',  z: 20 },
  { side: 'left', pos: '340px',  height: 310, opacity: 0.62, src: '/tree3.png', z: 18 },
  { side: 'left', pos: '390px',  height: 270, opacity: 0.50, src: '/tree4.png', z: 19 },
  { side: 'left', pos: '430px',  height: 210, opacity: 0.36, src: 'main',       z: 17 },

  { side: 'right', pos: '-50px',  height: 620, opacity: 1.0,  src: 'main',       z: 20 },
  { side: 'right', pos: '55px',   height: 460, opacity: 0.93, src: '/tree3.png', z: 21 },
  { side: 'right', pos: '130px',  height: 540, opacity: 0.88, src: '/tree2.png', z: 20 },
  { side: 'right', pos: '275px',  height: 420, opacity: 0.76, src: 'main',       z: 20 },
  { side: 'right', pos: '405px',  height: 290, opacity: 0.60, src: '/tree3.png', z: 18 },
  { side: 'right', pos: '450px',  height: 250, opacity: 0.46, src: '/tree4.png', z: 19 },
  { side: 'right', pos: '485px',  height: 195, opacity: 0.32, src: 'main',       z: 17 },
]

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<'login' | 'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  )
  const { theme, prevTheme, fading } = useTimeOfDay()

  // 높이 애니메이션 — 활성 패널의 실제 높이를 측정해서 컨테이너에 적용
  const loginRef  = useRef<HTMLDivElement>(null)
  const signupRef = useRef<HTMLDivElement>(null)
  const [formHeight, setFormHeight] = useState<number | undefined>(undefined) 

  useEffect(() => {
    const el = tab === 'login' ? loginRef.current : signupRef.current
    if (el) setFormHeight(el.scrollHeight)
  }, [tab])

  // 초기 마운트 시 높이 측정
  useEffect(() => {
    if (loginRef.current) setFormHeight(loginRef.current.scrollHeight)
  }, [])

  return (
    <div className={styles.scene}>

      {prevTheme && (
        <div className={styles.skyLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
      )}
      <div className={styles.skyLayer} style={{ background: theme.sky, opacity: 1 }} />

      <SkyBody showSun={theme.showSun} showMoon={theme.showMoon} />

      {theme.showStars && STARS.map((s, i) => (
        <img key={i} src="/Star.png" alt="" className={styles.star}
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }} />
      ))}

      {TREES.map((t, i) => (
        <img
          key={i}
          src={t.src === 'main' ? theme.treeImage : t.src}
          alt=""
          className={styles.tree}
          style={{ [t.side]: t.pos, height: `${t.height}px`, opacity: t.opacity, zIndex: t.z }}
        />
      ))}

      <div className={styles.campfireWrap}>
        <Campfire />
      </div>

      <div className={styles.glow} />
      <div className={styles.footer} />

      {/* 카드 */}
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="" className={styles.logo} />
          <h1 className={styles.title}>CampLog</h1>
        </div>

        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setTab('login')}
          >
            로그인
          </button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => setTab('signup')}
          >
            회원가입
          </button>
          <div
            className={styles.tabIndicator}
            style={{ transform: `translateX(${tab === 'login' ? '0%' : '100%'})` }}
          />
        </div>

        {/* 높이 애니메이션 컨테이너 */}
        <div
          className={styles.formAnimator}
          style={{ height: formHeight !== undefined ? `${formHeight}px+20px` : 'auto' }}
        >
          {/* 로그인 폼 */}
          <div
            ref={loginRef}
            className={styles.formPane}
            style={{
              opacity: tab === 'login' ? 1 : 0,
              transform: tab === 'login' ? 'translateY(0)' : 'translateY(-8px)',
              pointerEvents: tab === 'login' ? 'auto' : 'none',
              position: tab === 'login' ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0,
            }}
          >
            <LoginForm />
          </div>

          {/* 회원가입 폼 */}
          <div
            ref={signupRef}
            className={styles.formPane}
            style={{
              opacity: tab === 'signup' ? 1 : 0,
              transform: tab === 'signup' ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: tab === 'signup' ? 'auto' : 'none',
              position: tab === 'signup' ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0,
            }}
          >
            <SignupForm />
          </div>
        </div>
      </div>

    </div>
  )
}
