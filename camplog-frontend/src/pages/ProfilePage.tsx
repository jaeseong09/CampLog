import { useEffect, useState } from 'react'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'
import { campsiteApi } from '../api/campsite'
import type { CampsiteResponse } from '../types'
import styles from './ProfilePage.module.css'

const MILESTONE_CONFIG = [
  { key: 'bear',          icon: '🐻', label: '곰',            threshold: 90  },
  { key: 'tent',          icon: '⛺', label: '텐트',          threshold: 120 },
  { key: 'lantern',       icon: '🏮', label: '랜턴',          threshold: 240 },
  { key: 'squirrel',      icon: '🐿️', label: '다람쥐',        threshold: 360 },
  { key: 'pigeon_nest',   icon: '🕊️', label: '비둘기 둥지',   threshold: 540 },
  { key: 'constellation', icon: '✨', label: '별자리 표지판', threshold: 960 },
]

export default function ProfilePage() {
  const { theme, prevTheme, fading } = useTimeOfDay()
  const { user, setUser } = useAuthStore()

  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [campsite, setCampsite] = useState<CampsiteResponse | null>(null)

  useEffect(() => {
    campsiteApi.get().then(r => setCampsite(r.data)).catch(() => {})
  }, [])

  const unlockedKeys = new Set(campsite?.unlockedItems.map(item => item.itemType) ?? [])
  const totalTime = campsite?.totalStudyTime ?? user?.totalStudyTime ?? 0
  const unlockedCount = MILESTONE_CONFIG.filter(m => unlockedKeys.has(m.key)).length

  const isDirty = nickname.trim() !== (user?.nickname ?? '')

  const handleSave = async () => {
    if (!isDirty || saving) return
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const { data } = await authApi.updateProfile(nickname.trim())
      setUser(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch {
      setError('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      {prevTheme && (
        <div className={styles.bgLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
      )}
      <div className={styles.bgLayer} style={{ background: theme.sky, opacity: 1 }} />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>프로필</h1>

        {/* 아바타 */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user?.nickname?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className={styles.avatarInfo}>
            <span className={styles.avatarName}>{user?.nickname}</span>
            <span className={styles.avatarEmail}>{user?.email}</span>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>총 공부 시간</span>
            <span className={styles.statValue}>
              {Math.floor((user?.totalStudyTime ?? 0) / 60)}h {(user?.totalStudyTime ?? 0) % 60}m
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>해금 아이템</span>
            <span className={styles.statValue}>
              {unlockedCount} / {MILESTONE_CONFIG.length}
            </span>
          </div>
        </div>

        {/* 캠프 아이템 해금 현황 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>캠프 성장</h2>
          <div className={styles.milestoneList}>
            {MILESTONE_CONFIG.map((m, i) => {
              const done = unlockedKeys.has(m.key)
              const progress = done ? 100 : Math.min(99, Math.round((totalTime / m.threshold) * 100))
              const inProgress = !done && progress > 0

              return (
                <div key={m.key} className={styles.milestoneItem}>
                  <div className={styles.milestoneLeft}>
                    <div className={`${styles.milestoneDot} ${done ? styles.dotDone : inProgress ? styles.dotProgress : styles.dotLocked}`}>
                      {done && '✓'}
                    </div>
                    {i < MILESTONE_CONFIG.length - 1 && <div className={styles.milestoneLine} />}
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneRow}>
                      <span className={styles.milestoneIcon}>{m.icon}</span>
                      <span className={`${styles.milestoneLabel} ${done ? styles.labelDone : inProgress ? styles.labelProgress : styles.labelLocked}`}>
                        {m.label}
                      </span>
                      <span className={`${styles.milestoneDesc} ${done ? styles.descDone : inProgress ? styles.descProgress : styles.descLocked}`}>
                        {done ? '— 달성' : inProgress ? `— 진행 중 ${progress}%` : `— ${Math.floor(m.threshold / 60)}h~`}
                      </span>
                    </div>
                    {inProgress && (
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 닉네임 변경 */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>닉네임 변경</h2>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
              placeholder="새 닉네임 입력"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              className={`${styles.saveBtn} ${!isDirty || saving ? styles.saveBtnDisabled : ''}`}
              onClick={handleSave}
              disabled={!isDirty || saving}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
          {success && <p className={styles.successMsg}>닉네임이 변경되었습니다.</p>}
          {error   && <p className={styles.errorMsg}>{error}</p>}
        </div>
      </div>
    </div>
  )
}