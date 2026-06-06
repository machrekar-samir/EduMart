import { useEffect, useState } from 'react'
import { api } from '../services/api'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target == null) return
    const start = performance.now()
    let frame

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    setValue(0)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

function formatStat(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}K+`
  return `${n}+`
}

export default function LiveStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch(() => setStats({ students: 0, listings: 0, colleges: 0 }))
  }, [])

  const students = useCountUp(stats?.students)
  const listings = useCountUp(stats?.listings)
  const colleges = useCountUp(stats?.colleges)

  const items = [
    { value: students, label: 'Active Students' },
    { value: listings, label: 'Listings' },
    { value: colleges, label: 'Colleges' },
  ]

  return (
    <div className="hero-stats" aria-live="polite">
      {items.map(({ value, label }) => (
        <div className="stat" key={label}>
          <strong>{stats ? formatStat(value) : '—'}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
