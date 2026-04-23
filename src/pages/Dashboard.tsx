import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'
import { store, KEYS } from '../utils/storage'
import { getGreeting, todayKey, yearProgress, monthProgress, weekProgress, dayProgress, lifeProgress } from '../utils/time'
import { TEMPLATES } from '../data/templates'
import type { WorkoutEntry, MealEntry, Profile } from '../types'

function ActivityHeatmap() {
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
    <div style={{ marginBottom: 'var(--sp-7)' }}>
      <h2 className="section-title">Activity — Last 90 Days</h2>
      <div style={{ overflowX: 'auto', paddingBottom: 'var(--sp-2)' }}>
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
                  stroke="oklch(90% 0.01 75)" strokeWidth="0.5"
                >
                  <title>{day.key}: {day.count} activities</title>
                </rect>
              )
            })
          )}
        </svg>
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

function calcStreak(): number {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  if (!workouts.length) return 0
  const dates = [...new Set(workouts.map(w => w.date))].sort().reverse()
  let streak = 0
  const check = new Date(todayKey())
  for (const d of dates) {
    if (d === check.toISOString().slice(0, 10)) {
      streak++
      check.setDate(check.getDate() - 1)
    } else break
  }
  return streak
}

export function Dashboard() {
  const navigate = useNavigate()
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const todayWorkouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())
  const todayMeals = store.get<MealEntry[]>(KEYS.MEALS, []).filter(m => m.date === todayKey())
  const totalCal = todayMeals.reduce((s, m) => s + m.items.reduce((a, i) => a + i.cal, 0), 0)
  const waterLog = store.get<Record<string, number>>(KEYS.WATER_LOG, {})
  const waterToday = waterLog[todayKey()] ?? 0
  const lp = profile.dob ? lifeProgress(profile.dob, profile.lifeExpectancy ?? 80) : null
  const streak = useMemo(calcStreak, [])

  const handleTemplateClick = (id: string) => {
    const t = TEMPLATES.find(x => x.id === id)
    if (!t) return
    store.set('_active_template', t)
    navigate('/workout')
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">{getGreeting()}</p>
        <h1 className="page-header__title">Hey {profile.name || 'there'} 👋</h1>
      </div>

      <div className="stats-row">
        {[
          { label: "Today's Workouts", value: todayWorkouts.length, sub: 'exercises logged', mod: 'accent' },
          { label: 'Calories', value: totalCal.toLocaleString(), sub: `of ${(profile.calorieGoal ?? 2000).toLocaleString()} goal`, mod: 'amber' },
          { label: 'Hydration', value: `${waterToday}/8`, sub: 'glasses today', mod: 'sky' },
          { label: 'Streak', value: `${streak} days`, sub: 'keep it up!', mod: 'rose' },
        ].map(s => (
          <div key={s.label} className={`stat-block stat-block--${s.mod}`}>
            <div className="stat-block__label">{s.label}</div>
            <div className="stat-block__value">{s.value}</div>
            <div className="stat-block__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <h2 className="progress-section__title">Time Awareness</h2>
        <div className="progress-grid">
          {[
            { pct: dayProgress(), color: 'oklch(55% 0.18 155)', label: 'Day' },
            { pct: weekProgress(), color: 'oklch(62% 0.14 240)', label: 'Week' },
            { pct: monthProgress(), color: 'oklch(72% 0.16 75)', label: 'Month' },
            { pct: yearProgress(), color: 'oklch(62% 0.2 15)', label: 'Year' },
          ].map(r => (
            <div key={r.label} className="progress-ring-card">
              <ProgressRing percent={r.pct} color={r.color} />
              <span className="progress-ring-card__label">{r.label}</span>
            </div>
          ))}
          {lp ? (
            <div className="progress-ring-card">
              <ProgressRing percent={lp.percentLived} color="oklch(55% 0.15 300)" />
              <span className="progress-ring-card__label">Life</span>
              <span className="progress-ring-card__detail">{lp.ageYears} yrs · {lp.weeksRemaining.toLocaleString()} wks left</span>
            </div>
          ) : (
            <div className="progress-ring-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings')}>
              <div className="empty-state__icon">🎂</div>
              <span className="progress-ring-card__label">Life</span>
              <span className="progress-ring-card__detail">Add DOB in Settings</span>
            </div>
          )}
        </div>
      </div>

      <ActivityHeatmap />

      <div style={{ marginBottom: 'var(--sp-7)' }}>
        <h2 className="section-title">Quick Start a Workout</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-4)' }}>
          {TEMPLATES.slice(0, 6).map(t => (
            <button key={t.id} onClick={() => handleTemplateClick(t.id)} style={{
              padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--clr-border)', background: 'var(--clr-surface)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'transform var(--dur-md) var(--ease-out), box-shadow var(--dur-md) var(--ease-out)',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px oklch(22% 0.02 60 / 0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--sp-2)' }}>{t.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-1)' }}>{t.name}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{t.description}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', marginTop: 'var(--sp-2)' }}>{t.exercises.length} exercises</div>
            </button>
          ))}
        </div>
      </div>

      {todayWorkouts.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-7)' }}>
          <h2 className="section-title">Today's Activity</h2>
          <div className="workout-list">
            {todayWorkouts.map(w => (
              <div key={w.id} className="workout-entry">
                <div className={`workout-entry__icon workout-entry__icon--${w.type}`}>
                  {w.type === 'cardio' ? '🏃' : w.type === 'yoga' ? '🧘' : '🏋️'}
                </div>
                <div>
                  <div className="workout-entry__name">{w.exercise}</div>
                  <div className="workout-entry__detail">{w.detail}</div>
                </div>
                <div className="workout-entry__meta">{w.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
