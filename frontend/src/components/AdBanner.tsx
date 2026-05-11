import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const PUBLISHER_ID = 'ca-pub-6862900859746528'
const DEFAULT_SLOT = '2647640133'
const ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === 'true'

interface Props {
  slot?: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  style?: React.CSSProperties
  className?: string
}

export function AdBanner({
  slot = DEFAULT_SLOT,
  format = 'auto',
  style,
  className,
}: Props) {
  const insRef = useRef<HTMLModElement>(null)
  const pushCalledRef = useRef(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!ENABLED || pushCalledRef.current) return
    pushCalledRef.current = true

    // DOM が確実に描画されてから push（他リポジトリの実装パターンを踏襲）
    requestAnimationFrame(() => {
      try {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
      } catch (e) {
        console.error('AdSense push error:', e)
      }

      // push 後 2 秒で空枠なら非表示
      setTimeout(() => {
        if (insRef.current && insRef.current.offsetHeight === 0) {
          setVisible(false)
        }
      }, 2000)
    })
  }, [])

  if (!ENABLED || !visible) return null

  return (
    <div
      className={className}
      style={{
        background: '#05070A',
        textAlign: 'center',
        ...style,
      }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
