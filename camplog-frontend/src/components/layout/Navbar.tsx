import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useTimerStore } from '../../store/timerStore'
import { sessionAudio } from '../../utils/sessionAudio'

export default function Navbar() {
  const { isRunning, getElapsedSeconds } = useTimerStore()
  const hasActiveSession = isRunning || getElapsedSeconds() > 0
  const [muted, setMuted] = useState(() => sessionAudio.isMuted())

  const handleMute = () => {
    const next = !sessionAudio.isMuted()
    sessionAudio.setMuted(next)
    setMuted(next)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-4 ${styles.navbar}`}>
      <Link to="/" className={styles.logo}>
        <div className={styles.flexDiv}>
          <img src="/logo.svg" alt="Logo" className={styles['logoImg']} />
          <p className={styles['logo-text']}>CampLog</p>
        </div>
      </Link>

      {/* 네비게이션 링크 */}
      <div className={`flex items-center gap-4 ${styles.links}`}>
        {hasActiveSession && (
          <button className={styles.muteBtn} onClick={handleMute}>
            {muted ? '소리 켜기' : '음소거'}
          </button>
        )}
        <Link to="/login">로그인</Link>
        <Link to="/login?tab=signup" className={styles['signup-link']}>
          회원가입
        </Link>
        <Link to="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
          캠프 시작하기
        </Link>
      </div>
    </nav>
  )
}
