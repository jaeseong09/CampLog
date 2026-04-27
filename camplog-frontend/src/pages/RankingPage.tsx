import { useEffect, useState } from 'react'
import styles from './RankingPage.module.css'
import { rankingApi } from '../api/ranking'
import { useAuthStore } from '../store/authStore'
import { useTimeOfDay } from '../hooks/useTimeOfDay'
import type { RankingEntry } from '../types'

type Tab = 'weekly' | 'monthly' | 'allTime'

const TAB_LABELS: Record<Tab, string> = {
  weekly:  '이번 주',
  monthly: '이번 달',
  allTime: '전체',
}

const MILESTONES = [
  { label: '곰',          threshold: 90  },
  { label: '텐트',        threshold: 120 },
  { label: '랜턴',        threshold: 240 },
  { label: '다람쥐',      threshold: 360 },
  { label: '비둘기 둥지', threshold: 540 },
  { label: '별자리',      threshold: 960 },
]

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

function getCampsiteLabel(studyMinutes: number): string {
  const unlocked = MILESTONES.filter(m => studyMinutes >= m.threshold).map(m => m.label)
  if (unlocked.length === 0) return '아직 달성 없음'
  return unlocked.slice(-2).join(' · ') + ' 달성'
}

function RankNum({ rank }: { rank: number }) {
  const cls =
    rank === 1 ? styles.rank1 :
    rank === 2 ? styles.rank2 :
    rank === 3 ? styles.rank3 : styles.rankDefault
  return <span className={`${styles.rankNum} ${cls}`}>{rank}</span>
}

function RankRow({
  entry,
  isMe,
  maxMinutes,
}: {
  entry: RankingEntry
  isMe: boolean
  maxMinutes: number
}) {
  const barWidth = maxMinutes > 0 ? (entry.studyMinutes / maxMinutes) * 100 : 0

  return (
    <div className={`${styles.row} ${isMe ? styles.rowMe : ''}`}>
      <div className={styles.rankCol}>
        <RankNum rank={entry.rank} />
      </div>

      <div className={`${styles.avatarCircle} ${isMe ? styles.avatarMe : ''}`}>
        {entry.nickname.charAt(0).toUpperCase()}
      </div>

      <div className={styles.nameCol}>
        <div className={styles.nameRow}>
          <span className={styles.nickname}>{entry.nickname}</span>
          {isMe && <span className={styles.meTag}>(나)</span>}
        </div>
        <span className={styles.campsiteLabel}>{getCampsiteLabel(entry.studyMinutes)}</span>
      </div>

      <div className={styles.timeCol}>
        <span className={styles.timeText}>{formatTime(entry.studyMinutes)}</span>
        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: `${barWidth}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function RankingPage() {
  const { user } = useAuthStore()
  const { theme, prevTheme, fading } = useTimeOfDay()

  const [tab, setTab] = useState<Tab>('weekly')
  const [weeklyData, setWeeklyData] = useState<RankingEntry[]>([])
  const [lastWeekData, setLastWeekData] = useState<RankingEntry[]>([])
  const [tabData, setTabData] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  // 요약 카드용 주간/지난 주 데이터는 항상 유지
  useEffect(() => {
    rankingApi.weekly().then(res => setWeeklyData(res.data)).catch(() => {})
    rankingApi.lastWeek().then(res => setLastWeekData(res.data)).catch(() => {})
  }, [])

  // 탭 변경 시 해당 데이터 fetch
  useEffect(() => {
    setLoading(true)
    const req =
      tab === 'weekly'  ? rankingApi.weekly() :
      tab === 'monthly' ? rankingApi.monthly() :
                          rankingApi.allTime()
    req
      .then(res => setTabData(res.data))
      .catch(err => {
        console.error('Ranking fetch error:', err?.response?.status, err?.response?.data || err?.message)
        setTabData([])
      })
      .finally(() => setLoading(false))
  }, [tab])

  // 주간 기준 내 통계
  const myWeekly = weeklyData.find(e => e.userId === user?.id)
  const top1 = weeklyData[0]
  const gapToTop = top1 && myWeekly && top1.userId !== myWeekly.userId
    ? top1.studyMinutes - myWeekly.studyMinutes
    : null

  // 지난 주 대비 순위 변화
  const myLastWeek = lastWeekData.find(e => e.userId === user?.id)
  const rankChange = myWeekly && myLastWeek
    ? myLastWeek.rank - myWeekly.rank   // 양수 = 상승, 음수 = 하락
    : null

  // 현재 탭 기준
  const myTab = tabData.find(e => e.userId === user?.id)
  const maxMinutes = tabData[0]?.studyMinutes ?? 1

  return (
    <div className={styles.page}>
      {/* 배경 crossfade */}
      {prevTheme && (
        <div className={styles.bgLayer} style={{ background: prevTheme.sky, opacity: fading ? 0 : 1 }} />
      )}
      <div className={styles.bgLayer} style={{ background: theme.sky, opacity: 1 }} />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>랭킹</h1>

        {/* 요약 2열 카드 */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>내 순위</span>
            <span className={styles.summaryValue}>
              {myWeekly ? `#${myWeekly.rank}` : '—'}
            </span>
            <span className={styles.summaryMeta}>
              전체 {weeklyData.length}명 중
            </span>
            {rankChange != null ? (
              <span className={styles.summaryChange}>
                지난 주 대비 {rankChange > 0 ? `+${rankChange}` : rankChange === 0 ? '변동 없음' : `${rankChange}`}
              </span>
            ) : (
              <span className={styles.summaryChange}>지난 주 기록 없음</span>
            )}
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>이번 주</span>
            <span className={styles.summaryValue}>
              {myWeekly ? formatTime(myWeekly.studyMinutes) : '—'}
            </span>
            <span className={styles.summaryMeta}>나의 공부 시간</span>
            {gapToTop != null ? (
              <span className={styles.summaryChange}>1위까지 {formatTime(gapToTop)}</span>
            ) : myWeekly && !gapToTop ? (
              <span className={styles.summaryChange}>현재 1위</span>
            ) : (
              <span className={styles.summaryChange}>—</span>
            )}
          </div>
        </div>

        {/* 랭킹 카드 */}
        <div className={styles.rankCard}>
          {/* 세그먼트 탭 */}
          <div className={styles.segmentWrap}>
            <div className={styles.segment}>
              {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
                <button
                  key={t}
                  className={`${styles.segBtn} ${tab === t ? styles.segBtnActive : ''}`}
                  onClick={() => setTab(t)}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* 내 순위 고정 박스 */}
          {myTab && (
            <div className={styles.myPinnedBox}>
              <RankRow entry={myTab} isMe maxMinutes={maxMinutes} />
            </div>
          )}

          {/* 목록 */}
          {loading ? (
            <div className={styles.empty}>불러오는 중...</div>
          ) : tabData.length === 0 ? (
            <div className={styles.empty}>아직 기록이 없습니다.</div>
          ) : (
            <div className={styles.list}>
              {tabData.map(entry => (
                <RankRow
                  key={entry.userId}
                  entry={entry}
                  isMe={entry.userId === user?.id}
                  maxMinutes={maxMinutes}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}