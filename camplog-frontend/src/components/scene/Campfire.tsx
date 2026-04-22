import { useEffect, useState } from 'react'
import Lottie from 'lottie-react/build/index.es.js'

export default function Campfire() {
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

  return (
    <div style={{ position: 'relative', bottom: '-90px', width: '300px', height: '300px' }}>
      {/* 베이스 */}
      <Lottie animationData={baseData} loop style={{ width: 300, height: 300 }} />

      {/* 새 불꽃 오버레이 */}
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
          <Lottie animationData={fireData} loop style={{ width: 140, height: 140 }} />
        </div>
      )}
    </div>
  )
}
