import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../lib/format'

// Two-thumb price slider. Commits to the parent shortly after the user stops dragging.
export default function PriceRange({ min = 0, max, value, onCommit, step = 500 }) {
  const [lo, setLo] = useState(value[0])
  const [hi, setHi] = useState(value[1])
  const first = useRef(true)

  useEffect(() => {
    setLo(value[0])
    setHi(value[1])
  }, [value[0], value[1]]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (lo === value[0] && hi === value[1]) return
    const id = setTimeout(() => onCommit([lo, hi]), 300)
    return () => clearTimeout(id)
  }, [lo, hi]) // eslint-disable-line react-hooks/exhaustive-deps

  const span = Math.max(1, max - min)
  const pct = (v) => ((v - min) / span) * 100

  return (
    <div>
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold/25" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-maroon"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          className="dual-range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum price"
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - step))}
        />
        <input
          type="range"
          className="dual-range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + step))}
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.85rem] font-medium text-maroon">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
    </div>
  )
}
