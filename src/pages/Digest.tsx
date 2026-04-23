import { useMemo } from 'react'
import { store, KEYS } from '../utils/storage'
import type { WorkoutEntry, MealEntry, Profile } from '../types'

interface WeekData {
  label: string
  startDate: string
  endDate: string
  workoutCount: number
  exerciseCount: number
  totalCal: number
  activeDays: number
  topExercise: string
  waterAvg: number
}

function getWeekBounds(weeksAgo: number): { start: Date; end: Date; label: string } {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // Mon=1
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1 - weeksAgo * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const label = weeksAgo === 0 ? 'This Week' : weeksAgo === 1 ? 'Last Week' : `${weeksAgo} Weeks Ago`
  return { start: monday, end: sunday, label }
}

function dateInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr)
  return d >= start && d <= end
}

function buildWeek(weeksAgo: number): WeekData {
  const { start, end, label } = getWeekBounds(weeksAgo)
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => dateInRange(w.date, start, end))
  const meals = store.get<MealEntry[]>(KEYS.MEALS, []).filter(m => dateInRange(m.date, start, end))
  const waterLog = store.get<Record<string, number>>(KEYS.WATER_LOG, {})

  const activeDays = new Set(workouts.map(w => w.date)).size
  const totalCal = meals.flatMap(m => m.items).reduce((s, i) => s + i.cal, 0)

  // Top exercise
  const exCount: Record<string, number> = {}
  workouts.forEach(w => { exCount[w.exercise] = (exCount[w.exercise] ?? 0) + 1 })
  const topExercise = Object.entries(exCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Water avg
  let waterTotal = 0, waterDays = 0
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    if (waterLog[key] !== undefined) { waterTotal += waterLog[key]; waterDays++ }
  }

  return {
    label,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    workoutCount: activeDays,
    exerciseCount: workouts.length,
    totalCal,
    activeDays,
    topExercise,
    waterAvg: waterDays > 0 ? Math.round(waterTotal / waterDays * 10) / 10 : 0,
  }
}

function WeekCard({ week, prev }: { week: WeekData; prev?: WeekData }) {
  const delta = (curr: number, old?: number) => {
    if (old === undefined || old === 0) return null
    const diff = curr - old
    if (diff === 0) return <span style={{ color: 'var(--clr-text-3)' }}>—</span>
    return <span style={{ color: diff > 0 ? 'oklch(50% 0.14 155)' : 'oklch(55% 0.18 15)', fontWeight: 600 }}>{diff > 0 ? '↑' : '↓'} {Math.abs(diff)}</span>
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', marginBottom: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--sp-4)' }}>
        <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-xl)', fontWeight: 700 }}>{week.label}</h3>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{fmtDate(week.startDate)} – {fmtDate(week.endDate)}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--sp-4)' }}>
        {[
          { label: 'Active Days', value: `${week.activeDays}/7`, delta: delta(week.activeDays, prev?.activeDays), bg: 'var(--clr-accent-l)' },
          { label: 'Exercises', value: week.exerciseCount, delta: delta(week.exerciseCount, prev?.exerciseCount), bg: 'var(--clr-amber-l)' },
          { label: 'Calories Logged', value: week.totalCal.toLocaleString(), delta: null, bg: 'var(--clr-sky-l)' },
          { label: 'Water Avg', value: `${week.waterAvg}/8`, delta: null, bg: 'var(--clr-rose-l)' },
        ].map(s => (
          <div key={s.label} style={{ padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)', background: s.bg }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-1)' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 700 }}>
              {s.value}
              {s.delta && <span style={{ fontSize: 'var(--fs-xs)', marginLeft: 'var(--sp-2)' }}>{s.delta}</span>}
            </div>
          </div>
        ))}
      </div>

      {week.topExercise !== '—' && (
        <div style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>
          Most performed: <strong style={{ color: 'var(--clr-text)' }}>{week.topExercise}</strong>
        </div>
      )}
    </div>
  )
}

export function Digest() {
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const weeks = useMemo(() => Array.from({ length: 4 }, (_, i) => buildWeek(i)), [])

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">REFLECTION</p>
        <h1 className="page-header__title">Weekly Digest</h1>
      </div>

      {profile.name && (
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-5)' }}>
          Here's how your last 4 weeks looked, {profile.name}. Trends help you see the bigger picture.
        </p>
      )}

      {weeks.map((week, i) => (
        <WeekCard key={week.startDate} week={week} prev={weeks[i + 1]} />
      ))}

      {weeks[0].activeDays === 0 && weeks[1].activeDays === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📊</div>
          <p className="empty-state__text">Start logging workouts and meals to see your weekly digest!</p>
        </div>
      )}
    </div>
  )
}
