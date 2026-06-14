import { useMemo, useState, useEffect } from 'react'
import { ACHIEVEMENTS, type AchievementStats, type UnlockedAchievement } from '../data/achievements'
import { store, KEYS } from '../utils/storage'
import { todayKey } from '../utils/time'
import { launchConfetti } from '../utils/confetti'
import type { WorkoutEntry, MealEntry } from '../types'

function playFanfareSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }
    const now = ctx.currentTime
    playNote(261.63, now, 0.35)
    playNote(329.63, now + 0.08, 0.35)
    playNote(392.00, now + 0.16, 0.35)
    playNote(523.25, now + 0.24, 0.5)
    playNote(659.25, now + 0.32, 0.7)
  } catch {}
}

function calcStats(): AchievementStats {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const meals = store.get<MealEntry[]>(KEYS.MEALS, [])
  const waterLog = store.get<Record<string, number>>(KEYS.WATER_LOG, {})
  const journal = store.get<{ id: string }[]>(KEYS.JOURNAL, [])
  const weightLog = store.get<{ id: string }[]>(KEYS.WEIGHT_LOG, [])
  const templatesUsed = store.get<number>(KEYS.TEMPLATES_USED_COUNT, 0)

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
    templatesUsed,
    totalWeightEntries: weightLog.length,
    daysActive: uniqueDates.size,
  }
}

export function Achievements() {
  const stats = useMemo(calcStats, [])
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>(() => store.get<UnlockedAchievement[]>(KEYS.ACHIEVEMENTS, []))
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])

  const unlockedIds = useMemo(() => new Set(unlocked.map(u => u.id)), [unlocked])

  useEffect(() => {
    const existingIds = new Set(store.get<UnlockedAchievement[]>(KEYS.ACHIEVEMENTS, []).map(u => u.id))
    const freshUnlocks: string[] = []
    
    ACHIEVEMENTS.forEach(a => {
      if (!existingIds.has(a.id) && a.check(stats)) {
        freshUnlocks.push(a.id)
      }
    })
    
    if (freshUnlocks.length > 0) {
      const currentUnlocked = store.get<UnlockedAchievement[]>(KEYS.ACHIEVEMENTS, [])
      const updated = [...currentUnlocked, ...freshUnlocks.map(id => ({ id, unlockedAt: todayKey() }))]
      store.set(KEYS.ACHIEVEMENTS, updated)
      setUnlocked(updated)
      setNewlyUnlocked(freshUnlocks)
      
      setTimeout(() => {
        launchConfetti()
        playFanfareSound()
      }, 400)
    }
  }, [stats])

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
      {newlyUnlocked.length > 0 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)', zIndex: 10000,
          display: 'grid', placeItems: 'center', padding: 'var(--sp-4)',
          animation: 'fade-in 0.3s ease-out'
        }}>
          <div style={{
            background: 'var(--clr-surface)', border: '1px solid var(--clr-accent)',
            borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)', maxWidth: 420, width: '100%',
            textAlign: 'center', boxShadow: 'var(--sh-lg)', animation: 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--sp-2)' }}>🏆</div>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--clr-accent)', marginBottom: 'var(--sp-1)', marginTop: 0 }}>Badge Unlocked!</h2>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-5)' }}>Congratulations on hitting a new milestone!</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
              {newlyUnlocked.map(id => {
                const a = ACHIEVEMENTS.find(x => x.id === id)
                if (!a) return null
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', background: 'var(--clr-surface-2)', padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', textAlign: 'left' }}>
                    <span style={{ fontSize: '2rem' }}>{a.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{a.name}</div>
                      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{a.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button className="btn btn--primary" style={{ width: '100%' }} onClick={() => setNewlyUnlocked([])}>Awesome! 💪</button>
          </div>
          <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes pop-in { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}

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
