import { store, KEYS } from '../utils/storage'
import type { WorkoutEntry, MealEntry } from '../types'

export function WorkoutHeatmap() {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const meals = store.get<MealEntry[]>(KEYS.MEALS, [])
  const activityMap: Record<string, number> = {}
  workouts.forEach(w => { activityMap[w.date] = (activityMap[w.date] ?? 0) + 1 })
  meals.forEach(m => { activityMap[m.date] = (activityMap[m.date] ?? 0) + 1 })

  const days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (89 - i))
    const key = d.toISOString().slice(0, 10)
    return { key, count: activityMap[key] ?? 0, day: d.getDay() }
  })

  const maxCount = Math.max(1, ...days.map(d => d.count))
  const cellSize = 14, gap = 3
  const weeks: (typeof days[0] | null)[][] = []
  let cur: (typeof days[0] | null)[] = []
  if (days[0].day > 0) for (let i = 0; i < days[0].day; i++) cur.push(null)
  days.forEach(d => {
    cur.push(d)
    if (d.day === 6) { weeks.push(cur); cur = [] }
  })
  if (cur.length) weeks.push(cur)

  const svgW = weeks.length * (cellSize + gap)
  const svgH = 7 * (cellSize + gap)

  return (
    <div style={{ padding: 'var(--sp-6)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--r-xl)' }}>
      <h3 className="section-title" style={{ fontSize: 'var(--fs-xs)', opacity: 0.6, marginBottom: 'var(--sp-5)' }}>
        ACTIVITY — LAST 90 DAYS
      </h3>
      <div style={{ overflowX: 'auto', paddingBottom: 'var(--sp-2)', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start', minWidth: 'max-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: gap, paddingTop: 0, marginTop: 2 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} style={{
                width: 12, height: cellSize,
                fontSize: '9px', lineHeight: `${cellSize}px`,
                color: 'var(--clr-text-3)', textAlign: 'right',
                fontFamily: 'var(--ff-body)', fontWeight: 600,
                userSelect: 'none',
              }}>{d}</div>
            ))}
          </div>
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block' }}>
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                if (!day) return null
                const intensity = day.count / maxCount
                const l = 92 - intensity * 52
                const c = (intensity * 0.18).toFixed(3)
                return (
                  <rect key={`${wi}-${di}`}
                    x={wi * (cellSize + gap)} y={di * (cellSize + gap)}
                    width={cellSize} height={cellSize} rx="3"
                    fill={`oklch(${l}% ${c} 155)`}
                    stroke="var(--clr-surface-2)" strokeWidth="0.5"
                  >
                    <title>{day.key}: {day.count} activities</title>
                  </rect>
                )
              })
            )}
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map(i => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: `oklch(${92 - i * 52}% ${(i * 0.18).toFixed(3)} 155)` }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
