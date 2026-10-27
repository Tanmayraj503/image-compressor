import { useEffect, useRef } from 'react'
import site from '../site.config.js'

/*
  Renders a responsive AdSense display unit — but ONLY when a publisher ID and slot ID
  are configured. Otherwise renders nothing (no empty boxes, no placeholders), so the
  site stays clean until you are approved. Auto ads work without slots.
 */
export default function AdSlot({ slot = 'inContent', className = '' }) {
  const { client, slots } = site.adsense
  const slotId = slots?.[slot]
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || !slotId || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* ad blockers etc. */
    }
  }, [client, slotId])

  if (!client || !slotId) return null
  return (
    <aside aria-label="Advertisement" className={`my-10 ${className}`}>
      <p className="mb-1 text-center text-[13px] uppercase tracking-wider text-slate-400">Advertisement area</p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}
