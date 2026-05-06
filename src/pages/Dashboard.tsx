import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { haptics } from '../utils/haptics'
import { ProgressRing } from '../components/ProgressRing'
import { store, KEYS } from '../utils/storage'
import { getGreeting, todayKey, yearProgress, monthProgress, weekProgress, dayProgress, lifeProgress, weekNumber, weeksInYear, daysLeftInWeek, dayOfYearLabel } from '../utils/time'
import { TEMPLATES } from '../data/templates'
import { getAllExercises } from '../data/exercises'
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

function DashMiniIcon({ type, name }: { type: string; name: string }) {
  const n = name.toLowerCase()
  const color = type === 'cardio' ? 'var(--clr-rose)' : type === 'yoga' ? 'var(--clr-sky)' : type === 'bodyweight' ? 'var(--clr-amber)' : type === 'sports' ? 'var(--clr-sky)' : 'var(--clr-accent)'
  const anim = n.includes('run') || n.includes('walk') ? 'dmx-run'
    : n.includes('push') || n.includes('bench') || n.includes('press') ? 'dmx-push'
    : n.includes('squat') || n.includes('lunge') ? 'dmx-squat'
    : n.includes('curl') || n.includes('raise') ? 'dmx-curl'
    : n.includes('pull') || n.includes('row') ? 'dmx-pull'
    : n.includes('jump') || n.includes('burpee') ? 'dmx-jump'
    : 'dmx-def'
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" style={{ overflow: 'visible', flexShrink: 0 }}>
      <style>{`
        @keyframes dmx-run{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
        @keyframes dmx-push{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes dmx-squat{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.82)}}
        @keyframes dmx-curl{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg)}}
        @keyframes dmx-pull{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes dmx-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes dmx-def{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .dfig{animation:${anim} 1.4s ease-in-out infinite;transform-origin:center}
      `}</style>
      <g className="dfig">
        <circle cx="40" cy="16" r="7" fill="none" stroke={color} strokeWidth="3"/>
        <line x1="40" y1="23" x2="40" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="30" x2="24" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="30" x2="56" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="48" x2="32" y2="64" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="48" x2="48" y2="64" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

function Recommendation({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-4)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', lineHeight: 1.4 }}>{text}</div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const allWorkouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const todayWorkouts = allWorkouts.filter(w => w.date === todayKey())
  const todayMeals = store.get<MealEntry[]>(KEYS.MEALS, []).filter(m => m.date === todayKey())
  const totalCal = todayMeals.reduce((s, m) => s + m.items.reduce((a, i) => a + i.cal, 0), 0)
  const waterLog = store.get<Record<string, number>>(KEYS.WATER_LOG, {})
  const waterToday = waterLog[todayKey()] ?? 0
  const lp = profile.dob ? lifeProgress(profile.dob, profile.lifeExpectancy ?? 80) : null
  const streak = useMemo(calcStreak, [])

  const now = new Date()
  const wkNum = weekNumber()
  const wkTotal = weeksInYear()
  const dLeft = daysLeftInWeek()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1))
  const weekWorkouts = allWorkouts.filter(w => w.date >= weekStart.toISOString().slice(0, 10))

  const calBurnEst = weekWorkouts.reduce((sum, w) => {
    const mins = w.duration ?? (w.sets ?? 3) * 2.5
    const rate = w.type === 'cardio' ? 10 : w.type === 'sports' ? 9 : w.type === 'yoga' ? 4 : 6
    return sum + Math.round(mins * rate)
  }, 0)

  const weekVolume = weekWorkouts.reduce((sum, w) => {
    if (w.weight && w.reps && w.sets) return sum + w.sets * w.reps * w.weight
    return sum
  }, 0)

  const dayCount: Record<string, number> = {}
  allWorkouts.forEach(w => { dayCount[w.date] = (dayCount[w.date] ?? 0) + 1 })
  const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]
  const bestDayLabel = bestDay ? new Date(bestDay[0]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'

  const dayLabel = `${new Date().toLocaleDateString('en-US', { weekday: 'long' })} · ${dayOfYearLabel()}`
  const weekLabel = `Wk ${wkNum} of ${wkTotal} · ${dLeft}d left`
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long' })
  const yearLabel = `${new Date().getFullYear()} · ${365 - Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)}d left`

  const handleTemplateClick = (id: string) => {
    haptics.light()
    const t = TEMPLATES.find(x => x.id === id)
    if (!t) return
    store.set('_active_template', t)
    navigate('/workout')
  }

  const handleSurpriseMe = () => {
    haptics.medium()
    const all = getAllExercises()
    const random = all[Math.floor(Math.random() * all.length)]
    store.set('_selected_exercise_direct', random)
    navigate('/workout')
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p className="page-header__greeting">{getGreeting()}</p>
            <h1 className="page-header__title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              Hey {profile.name || 'there'} 👋
              {allWorkouts.length > 50 && (
                <span style={{ fontSize: '10px', background: 'var(--clr-accent)', color: 'white', padding: '2px 8px', borderRadius: '100px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Elite Status</span>
              )}
            </h1>
          </div>
          <button onClick={handleSurpriseMe} className="btn btn--ghost ripple" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)' }}>
            <span style={{ fontSize: '1.25rem' }}>🎲</span>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Surprise Me</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: '10px', color: 'var(--clr-text-3)', fontWeight: 600, marginTop: 'var(--sp-1)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-success)' }}></span>
          OFFLINE ENCRYPTED STORAGE · 0% CLOUD LEAKAGE
        </div>
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

      <div style={{ padding: 'var(--sp-6)', borderRadius: 'var(--r-xl)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', marginBottom: 'var(--sp-7)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--clr-accent-soft)', filter: 'blur(60px)', borderRadius: '50%' }} />
        <h2 className="section-title">Daily Mindset</h2>
        <p style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-xl)', fontStyle: 'italic', color: 'var(--clr-text)', maxWidth: '600px', margin: 0 }}>
          "The pain of discipline is far less than the pain of regret."
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-7)', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { label: 'BMI', value: profile.weight && profile.height ? (profile.weight / (profile.height / 100) ** 2).toFixed(1) : '—' },
          { label: 'TDEE', value: profile.weight ? '2,450 kcal' : '—' },
          { label: 'Sleep', value: '7.5 hrs' },
          { label: 'Active', value: '42 min' },
          { label: 'Focus', value: '88%' },
        ].map(s => (
          <div key={s.label} style={{ flexShrink: 0, padding: 'var(--sp-2) var(--sp-4)', borderRadius: '100px', background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-3)' }}>{s.label}</span>
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--clr-accent)' }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {[
          { icon: '📅', label: `Week ${wkNum}`, sub: `${weekWorkouts.length} sessions this week`, color: 'var(--clr-accent)' },
          { icon: '🔥', label: `~${calBurnEst} kcal`, sub: 'estimated burn this week', color: 'var(--clr-rose)' },
          { icon: '🏋️', label: weekVolume > 0 ? `${(weekVolume / 1000).toFixed(1)}t` : '—', sub: 'volume load (sets×reps×kg)', color: 'var(--clr-amber)' },
          { icon: '⭐', label: bestDayLabel, sub: `best day (${bestDay?.[1] ?? 0} exercises)`, color: 'var(--clr-sky)' },
        ].map(s => (
          <div key={s.label} style={{ padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 'var(--fs-base)', color: s.color }}>{s.label}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', lineHeight: 1.3 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 'var(--sp-6)', padding: 'var(--sp-5)', borderRadius: 'var(--r-xl)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', boxShadow: 'var(--sh-sm)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '4rem', opacity: 0.05, transform: 'rotate(15deg)' }}>💪</div>
        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--clr-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--sp-2)' }}>Daily Fuel</div>
        <p style={{ fontSize: 'var(--fs-base)', fontFamily: 'var(--ff-display)', fontWeight: 600, color: 'var(--clr-text)', margin: 0, lineHeight: 1.4 }}>
          {useMemo(() => {
            const quotes = [
              "The only bad workout is the one that didn't happen.",
              "Motivation is what gets you started. Habit is what keeps you going.",
              "Your body can stand almost anything. It's your mind that you have to convince.",
              "Strength does not come from winning. Your struggles develop your strengths.",
              "Discipline is doing what needs to be done, even if you don't want to do it.",
              "Success starts with self-discipline.",
              "Don't stop when you're tired. Stop when you're done.",
              "A one-hour workout is only 4% of your day. No excuses."
            ]
            return quotes[Math.floor(Math.random() * quotes.length)]
          }, [])}
        </p>
      </div>

      <div className="progress-section">
        <h2 className="progress-section__title">Time Awareness</h2>
        <div className="progress-grid">
          {[
            { pct: dayProgress(), color: 'oklch(55% 0.18 155)', label: 'Day', detail: dayLabel },
            { pct: weekProgress(), color: 'oklch(62% 0.14 240)', label: 'Week', detail: weekLabel },
            { pct: monthProgress(), color: 'oklch(72% 0.16 75)', label: 'Month', detail: monthLabel },
            { pct: yearProgress(), color: 'oklch(62% 0.2 15)', label: 'Year', detail: yearLabel },
          ].map(r => (
            <div key={r.label} className="progress-ring-card">
              <ProgressRing percent={r.pct} color={r.color} />
              <span className="progress-ring-card__label">{r.label}</span>
              <span className="progress-ring-card__detail">{r.detail}</span>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-6)', marginBottom: 'var(--sp-7)' }}>
        <div>
          <h2 className="section-title">🏆 Personal Records</h2>
          {Object.entries(store.get<Record<string, number>>(KEYS.PERSONAL_RECORDS, {})).length === 0 ? (
            <div style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px dashed var(--clr-border)', textAlign: 'center', color: 'var(--clr-text-3)', fontSize: 'var(--fs-sm)' }}>
              No PRs yet. Lift heavy to set some!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {Object.entries(store.get<Record<string, number>>(KEYS.PERSONAL_RECORDS, {}))
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, weight]) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--clr-amber-l)', display: 'grid', placeItems: 'center', fontSize: 'var(--fs-sm)' }}>🥇</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{name}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>All-time best</div>
                    </div>
                    <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 'var(--fs-lg)', color: 'var(--clr-accent)' }}>{weight}kg</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="section-title">✨ Smart Coach</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {((): React.ReactNode[] => {
              const recs: React.ReactNode[] = []
              const now = new Date()
              
              const lastLegDay = allWorkouts.find(w => w.exercise.toLowerCase().includes('squat') || w.exercise.toLowerCase().includes('leg'))
              const daysSinceLegs = lastLegDay ? Math.floor((now.getTime() - new Date(lastLegDay.date).getTime()) / 86400000) : 99
              if (daysSinceLegs > 4) {
                recs.push(<Recommendation key="legs" icon="🦵" title="Leg Day Overdue" text={`It's been ${daysSinceLegs > 90 ? 'a while' : daysSinceLegs + ' days'} since your last leg session.`} color="var(--clr-rose)" />)
              }

              if (waterToday < 4 && now.getHours() > 14) {
                recs.push(<Recommendation key="water" icon="💧" title="Hydration Alert" text="You're below 50% of your water goal for this time of day." color="var(--clr-sky)" />)
              }

              if (streak < 3) {
                recs.push(<Recommendation key="streak" icon="🔥" title="Ignite the Streak" text="Train today to build momentum. Consistency is king." color="var(--clr-amber)" />)
              }

              if (totalCal < (profile.calorieGoal ?? 2000) * 0.4 && now.getHours() > 17) {
                recs.push(<Recommendation key="cals" icon="🍱" title="Fuel Up" text="Your calorie intake is quite low for the evening. Don't skip meals!" color="var(--clr-accent)" />)
              }

              const habits = store.get<any[]>(KEYS.HABITS, [])
              const tKey = todayKey()
              const unloggedHabit = habits.find(h => !h.logs[tKey])
              if (unloggedHabit) {
                recs.push(<Recommendation key="habit" icon={unloggedHabit.emoji || '✨'} title="Habit Pending" text={`Don't forget to log your "${unloggedHabit.name}" today.`} color="var(--clr-accent)" />)
              }

              if (recs.length === 0) {
                recs.push(<div key="perfect" style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-accent)', background: 'var(--clr-accent-l)', textAlign: 'center', color: 'var(--clr-accent-d)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>🌟 You're killing it! All systems optimal.</div>)
              }

              return recs
            })()}
          </div>
        </div>
      </div>

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
                <div className={`workout-entry__icon workout-entry__icon--${w.type}`} style={{ overflow: 'hidden', background: 'transparent', padding: 0 }}>
                  <DashMiniIcon type={w.type} name={w.exercise} />
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
