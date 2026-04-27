import { useEffect, useState } from 'react'
import Lottie from 'lottie-react/build/index.es.js'

interface Props {
  /** 집중도 0~100, 기본값 100 */
  intensity?: number
}

export default function Campfire({ intensity = 100 }: Props) {
  const [baseData, setBaseData] = useState<object | null>(null)
  const [fireData, setFireData] = useState<object | null>(null)

  useEffect(() => {
    let isMounted = true
    Promise.all([
      fetch('/Fire crackling in a campfire.json').then(r => r.json()),
      fetch('/Fire animation.json').then(r => r.json()),
    ]).then(([base, fire]) => {
      if (isMounted) {
        setBaseData(base)
        setFireData(fire)
      }
    })
    return () => { isMounted = false }
  }, [])

  if (!baseData) return null

  const clamp = Math.max(0, Math.min(100, intensity))
  // scale · brightness · speed 모두 전체 컨테이너에 적용 → 레이아웃 불변
  const brightness = 0.35 + (clamp / 100) * 0.85  // 0.35 ~ 1.2
  const saturate   = 0.3  + (clamp / 100) * 0.7   // 0.3 ~ 1.0  (집중 낮으면 탁해짐)
  const speed      = 0.4  + (clamp / 100) * 1.2   // 0.4 ~ 1.6

  return (
    <div style={{
      position: 'relative',
      bottom: '-90px',
      width: '300px',
      height: '300px',
      filter: `brightness(${brightness}) saturate(${saturate})`,
      transition: 'filter 2s ease',
    }}>
      <Lottie animationData={baseData} loop speed={speed} style={{ width: 300, height: 300 }} />

      {fireData && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 140,
          height: 140,
          margin: '0 0 17px 0',
        }}>
          <Lottie animationData={fireData} loop speed={speed} style={{ width: 140, height: 140 }} />
        </div>
      )}
    </div>
  )
}
