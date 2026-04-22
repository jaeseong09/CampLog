import { useEffect, useState, useRef } from 'react'
import Lottie from 'lottie-react/build/index.es.js'
import type { LottieRefCurrentProps } from 'lottie-react'

export default function Bear() {
  const [bearData, setBearData] = useState<object | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    let isMounted = true
    fetch('/Bear.json')
      .then(r => r.json())
      .then(data => { if (isMounted) setBearData(data) })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (bearData && lottieRef.current) {
      lottieRef.current.setSpeed(0.5)
    }
  }, [bearData])

  if (!bearData) return null

  return (
    <Lottie lottieRef={lottieRef} animationData={bearData} loop style={{ width: 350, height: 350 }} />
  )
}
