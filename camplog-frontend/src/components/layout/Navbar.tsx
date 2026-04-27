import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useTimerStore } from '../../store/timerStore'
import { useAuthStore } from '../../store/authStore'
import { sessionAudio } from '../../utils/sessionAudio'

export default function Navbar() {
  const navigate = useNavigate()
  const { isRunning, getElapsedSeconds } = useTimerStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const hasActiveSession = isRunning || getElapsedSeconds() > 0
  const [muted, setMuted] = useState(() => sessionAudio.isMuted())

  const handleMute = () => {
    const next = !sessionAudio.isMuted()
    sessionAudio.setMuted(next)
    setMuted(next)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-4 ${styles.navbar}`}>
      <Link to="/" className={styles.logo}>
        <div className={styles.flexDiv}>
          <img src="/logo.svg" alt="Logo" className={styles['logoImg']} />
          <p className={styles['logo-text']}>CampLog</p>
        </div>
      </Link>

      <div className={`flex items-center gap-4 ${styles.links}`}>
        {hasActiveSession && (
          <button className={styles.muteBtn} onClick={handleMute}>
            {muted ? '소리 켜기' : '음소거'}
          </button>
        )}

        {isAuthenticated ? (
          <>
            <Link to="/ranking" className={styles.navLink}>랭킹</Link>
            <Link to="/profile" className={styles.nickname}>{user?.nickname}</Link>
            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/login?tab=signup" className={styles['signup-link']}>회원가입</Link>
            <Link to="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
              캠프 시작하기
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}