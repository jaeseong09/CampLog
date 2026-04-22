import styles from './SkyBody.module.css'

interface Props {
  showSun: boolean
  showMoon: boolean
}

// 해: 고정 위치
const SUN  = { x: 22, y: 14 }
// 달: 고정 위치
const MOON = { x: 78, y: 12 }

export default function SkyBody({ showSun, showMoon }: Props) {
  return (
    <>
      {showSun && (
        <div
          className={styles.sun}
          style={{ left: `${SUN.x}%`, top: `${SUN.y}%` }}
        />
      )}
      {showMoon && (
        <div
          className={styles.moonWrap}
          style={{ left: `${MOON.x}%`, top: `${MOON.y}%` }}
        >
          <div className={styles.moon} />
          <div className={styles.moonShadow} />
        </div>
      )}
    </>
  )
}
