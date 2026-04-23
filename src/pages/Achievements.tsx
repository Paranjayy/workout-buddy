import { useMemo } from 'react'
import { ACHIEVEMENTS, type AchievementStats, type UnlockedAchievement } from '../data/achievements'
import { store, KEYS } from '../utils/storage'
import { todayKey } from '../utils/time'
import type { WorkoutEntry, MealEntry } from '../types'

function calcStats(): AchievementStats {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const meals = store.get<MealEntry[]>(KEYS.MEALS, [])
  const waterLog = store.get<Record<string, number>>(KEYS.WATER_LOG, {})
  const journal = store.get<{ id: string }[]>(KEYS.JOURNAL, [])
  const weightLog = store.get<{ id: string }[]>(KEYS.WEIGHT_LOG, [])

  const uniqueDates = new Set(workouts.map(w => w.date))
  const uniqueExercises = new Set(workouts.map(w => w.exercise))

  // Calculate streak
  let streak = 0
  const check = new Date(todayKey())
  const dateSet = uniqueDates
  for (let i = 0; i < 365; i++) {
    if (dateSet.has(check.toISOString().slice(0, 10))) {
      streak++
      check.setDate(check.getDate() - 1)
    } else break
  }

  // Water perfect days
  const waterPerfect = Object.values(waterLog).filter(v => v >= 8).length

  return {
    totalWorkouts: workouts.length,
    totalMeals: meals.length,
    currentStreak: streak,
    longestStreak: streak, // TODO: track historical longest
    totalExercisesLogged: workouts.length,
    uniqueExercises: uniqueExercises.size,
    waterPerfectDays: waterPerfect,
    journalEntries: journal.length,
    templatesUsed: 0, // TODO: track
    totalWeightEntries: weightLog.length,
    daysActive: uniqueDates.size,
  }
}

export function Achievements() {
  const stats = useMemo(calcStats, [])
  const unlocked = store.get<UnlockedAchievement[]>(KEYS.ACHIEVEMENTS, [])
  const unlockedIds = new Set(unlocked.map(u => u.id))

  // Check for newly unlocked
  const newUnlocks: string[] = []
  ACHIEVEMENTS.forEach(a => {
    if (!unlockedIds.has(a.id) && a.check(stats)) {
      newUnlocks.push(a.id)
    }
  })
  if (newUnlocks.length > 0) {
    const updated = [...unlocked, ...newUnlocks.map(id => ({ id, unlockedAt: todayKey() }))]
    store.set(KEYS.ACHIEVEMENTS, updated)
    newUnlocks.forEach(id => unlockedIds.add(id))
  }

  const totalUnlocked = unlockedIds.size
  const totalPossible = ACHIEVEMENTS.length
  const pct = Math.round((totalUnlocked / totalPossible) * 100)

  const categories = [
    { key: 'workout', label: '🏋️ Workout', color: 'var(--clr-accent-l)' },
    { key: 'nutrition', label: '🍎 Nutrition', color: 'var(--clr-amber-l)' },
    { key: 'consistency', label: '🔗 Consistency', color: 'var(--clr-sky-l)' },
    { key: 'wellness', label: '💧 Wellness', color: 'var(--clr-rose-l)' },
    { key: 'milestone', label: '🏅 Milestones', color: 'var(--clr-surface-2)' },
  ] as const

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">GAMIFICATION</p>
        <h1 className="page-header__title">Achievements</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', marginBottom: 'var(--sp-7)', padding: 'var(--sp-5)', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--clr-surface-2)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--clr-accent)" strokeWidth="8"
              strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 - (2 * Math.PI * 42 * pct) / 100}
              strokeLinecap="round" transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25,1,0.5,1)' }} />
            <text x="50" y="46" textAnchor="middle" dominantBaseline="central"
              fontFamily="var(--ff-display)" fontSize="22" fontWeight="700" fill="var(--clr-text)">{pct}%</text>
            <text x="50" y="64" textAnchor="middle" fontFamily="var(--ff-body)" fontSize="9" fill="var(--clr-text-3)">complete</text>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>
            {totalUnlocked} <span style={{ fontSize: 'var(--fs-lg)', color: 'var(--clr-text-3)', fontWeight: 500 }}>/ {totalPossible}</span>
          </div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-2)' }}>badges unlocked</div>
          {newUnlocks.length > 0 && (
            <div style={{ padding: 'var(--sp-1) var(--sp-3)', borderRadius: 'var(--r-sm)', background: 'var(--clr-accent-l)', color: 'var(--clr-accent-d)', fontSize: 'var(--fs-xs)', fontWeight: 600, display: 'inline-block' }}>
              🎉 {newUnlocks.length} new unlock{newUnlocks.length > 1 ? 's' : ''}!
            </div>
          )}
        </div>
      </div>

      <div className="stats-row" style={{ marginBottom: 'var(--sp-7)' }}>
        {[
          { label: 'Exercises', value: stats.totalWorkouts, mod: 'accent' },
          { label: 'Meals', value: stats.totalMeals, mod: 'amber' },
          { label: 'Streak', value: `${stats.currentStreak}d`, mod: 'sky' },
          { label: 'Active Days', value: stats.daysActive, mod: 'rose' },
        ].map(s => (
          <div key={s.label} className={`stat-block stat-block--${s.mod}`}>
            <div className="stat-block__label">{s.label}</div>
            <div className="stat-block__value">{s.value}</div>
          </div>
        ))}
      </div>

      {categories.map(cat => {
        const items = ACHIEVEMENTS.filter(a => a.category === cat.key)
        return (
          <div key={cat.key} style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 className="section-title">{cat.label}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
              {items.map(a => {
                const isUnlocked = unlockedIds.has(a.id)
                return (
                  <div key={a.id} style={{
                    padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)',
                    border: `1px solid ${isUnlocked ? 'var(--clr-accent)' : 'var(--clr-border)'}`,
                    background: isUnlocked ? cat.color : 'var(--clr-surface)',
                    opacity: isUnlocked ? 1 : 0.55,
                    transition: 'transform var(--dur-md) var(--ease-out)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                      <span style={{ fontSize: '1.5rem', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>{a.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{a.name}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{a.description}</div>
                      </div>
                      {isUnlocked && <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-xs)', color: 'var(--clr-accent)', fontWeight: 600 }}>✓</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
