import { useState } from 'react'
import { FITNESS_PROGRAMS, WARMUP_ROUTINE, COOLDOWN_ROUTINE, MUSCLE_GROUPS, type FitnessProgram } from '../data/programs'
import { store, KEYS } from '../utils/storage'
import type { WorkoutEntry } from '../types'

export function Programs() {
  const [selected, setSelected] = useState<string | null>(null)
  const program = FITNESS_PROGRAMS.find(p => p.id === selected)

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">TRAINING</p>
        <h1 className="page-header__title">Fitness Programs</h1>
      </div>

      {!program ? <ProgramList onSelect={setSelected} /> : <ProgramDetail program={program} onBack={() => setSelected(null)} />}

      <div style={{ marginTop: 'var(--sp-7)' }}>
        <h2 className="section-title">Muscle Activity Heatmap</h2>
        <MuscleHeatmap />
      </div>

      <div style={{ marginTop: 'var(--sp-7)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
        <RoutineCard title="🔥 Warm Up (5–7 min)" items={WARMUP_ROUTINE} color="var(--clr-amber-l)" />
        <RoutineCard title="🧊 Cool Down (5–7 min)" items={COOLDOWN_ROUTINE} color="var(--clr-sky-l)" />
      </div>
    </div>
  )
}

function ProgramList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
      {FITNESS_PROGRAMS.map(p => (
        <button key={p.id} onClick={() => onSelect(p.id)} style={{
          textAlign: 'left', cursor: 'pointer', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', transition: 'transform var(--dur-md) var(--ease-out), box-shadow var(--dur-md)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>{p.emoji}</div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>{p.name}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-3)', lineHeight: 1.5 }}>
            {p.focus}<br />{p.duration} · {p.level}
          </div>
          <span className="btn btn--primary btn--sm">View Program →</span>
        </button>
      ))}
    </div>
  )
}

function ProgramDetail({ program, onBack }: { program: FitnessProgram; onBack: () => void }) {
  return (
    <div>
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{ marginBottom: 'var(--sp-5)' }}>← All Programs</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <span style={{ fontSize: '2.5rem' }}>{program.emoji}</span>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>{program.name}</h2>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>{program.duration} · {program.level} · {program.focus}</div>
        </div>
      </div>

      <h3 className="section-title">Weekly Schedule</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {program.schedule.map(day => (
          <div key={day.day} style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: day.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: day.exercises.length ? 'var(--sp-3)' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-2)', borderRadius: 'var(--r-sm)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>{day.day}</span>
                <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{day.label}</span>
              </div>
              {day.exercises.length > 0 && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{day.exercises.length} exercises</span>}
            </div>
            {day.exercises.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--sp-2)' }}>
                {day.exercises.map((ex, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-2)', background: 'var(--clr-surface)', borderRadius: 'var(--r-sm)', border: '1px solid var(--clr-border)' }}>
                    <span style={{ fontWeight: 500 }}>{ex.name}</span>
                    <span style={{ color: 'var(--clr-text-3)', fontVariantNumeric: 'tabular-nums' }}>{ex.sets}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
        <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
          <h4 style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>⭐ Key Rules</h4>
          <ul style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-2)', paddingLeft: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {program.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
          <h4 style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>🥗 Diet Tips</h4>
          <ul style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-2)', paddingLeft: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {program.dietTips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', fontSize: 'var(--fs-sm)', fontWeight: 600, textAlign: 'center', color: 'var(--clr-accent-d)' }}>
        "Fitness is not a destination, it's a lifestyle. Stay consistent, stay patient, your body will reward you." 💪
      </div>
    </div>
  )
}

function RoutineCard({ title, items, color }: { title: string; items: { name: string; sets: string; muscle: string }[]; color: string }) {
  return (
    <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: color }}>
      <h4 style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>{title}</h4>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) 0', borderBottom: i < items.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
          <span>{i + 1}. {item.name}</span>
          <span style={{ color: 'var(--clr-text-3)' }}>{item.sets}</span>
        </div>
      ))}
    </div>
  )
}

function MuscleHeatmap() {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const last30 = workouts.filter(w => {
    const d = new Date(w.date)
    return d >= new Date(Date.now() - 30 * 86400000)
  })

  // Map exercises to muscle groups
  const muscleMap: Record<string, string[]> = {
    'bench press': ['chest', 'triceps'], 'push ups': ['chest', 'triceps'], 'chest fly': ['chest'],
    'pull ups': ['back', 'biceps'], 'dumbbell row': ['back'], 'barbell row': ['back'], 'lat pulldown': ['back'],
    'shoulder press': ['shoulders'], 'lateral raise': ['shoulders'], 'overhead press': ['shoulders'],
    'bicep curl': ['biceps'], 'hammer curl': ['biceps'],
    'triceps dips': ['triceps'], 'tricep extension': ['triceps'], 'skull crusher': ['triceps'],
    'squats': ['quads', 'glutes'], 'lunges': ['quads', 'glutes'], 'leg press': ['quads'],
    'romanian deadlift': ['hamstrings', 'glutes'], 'leg curl': ['hamstrings'],
    'calf raises': ['calves'],
    'plank': ['core'], 'russian twist': ['core'], 'leg raises': ['core'], 'crunches': ['core'], 'sit ups': ['core'],
    'deadlift': ['back', 'hamstrings', 'glutes'],
    'running': ['cardio'], 'cycling': ['cardio'], 'jumping jacks': ['cardio'], 'burpees': ['cardio'],
    'mountain climbers': ['cardio', 'core'],
  }

  const counts: Record<string, number> = {}
  last30.forEach(w => {
    const key = w.exercise.toLowerCase()
    const muscles = muscleMap[key] ?? []
    muscles.forEach(m => { counts[m] = (counts[m] ?? 0) + 1 })
  })

  const maxCount = Math.max(1, ...Object.values(counts))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--sp-3)' }}>
      {MUSCLE_GROUPS.map(mg => {
        const count = counts[mg.id] ?? 0
        const intensity = count / maxCount
        return (
          <div key={mg.id} style={{
            padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)',
            border: '1px solid var(--clr-border)',
            background: count > 0 ? `color-mix(in oklch, var(--clr-accent) ${Math.round(intensity * 60 + 10)}%, var(--clr-surface))` : 'var(--clr-surface)',
            transition: 'all var(--dur-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
              <span>{mg.emoji}</span>
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{mg.name}</span>
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
              {count > 0 ? `${count} session${count !== 1 ? 's' : ''} (30d)` : 'No data yet'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
