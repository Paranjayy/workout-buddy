import { useState } from 'react'
import { FITNESS_PROGRAMS, WARMUP_ROUTINE, COOLDOWN_ROUTINE, MUSCLE_GROUPS, type FitnessProgram, type DayPlan, type ProgramExercise } from '../data/programs'
import { store, KEYS } from '../utils/storage'
import type { WorkoutEntry } from '../types'

interface CustomProgram {
  id: string
  name: string
  emoji: string
  schedule: { day: string; label: string; exercises: { name: string; sets: string }[] }[]
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export function Programs() {
  const [tab, setTab] = useState<'browse' | 'custom' | 'create'>('browse')
  const [selected, setSelected] = useState<string | null>(null)
  const program = FITNESS_PROGRAMS.find(p => p.id === selected)
  const [customs, setCustoms] = useState<CustomProgram[]>(() => store.get<CustomProgram[]>(KEYS.CUSTOM_PROGRAMS, []))

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">TRAINING</p>
        <h1 className="page-header__title">Fitness Programs</h1>
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'browse' ? ' tab--active' : ''}`} onClick={() => { setTab('browse'); setSelected(null) }}>Browse</button>
        <button className={`tab${tab === 'custom' ? ' tab--active' : ''}`} onClick={() => { setTab('custom'); setSelected(null) }}>My Programs ({customs.length})</button>
        <button className={`tab${tab === 'create' ? ' tab--active' : ''}`} onClick={() => setTab('create')}>+ Create</button>
      </div>

      {tab === 'browse' && (
        !program
          ? <ProgramList onSelect={setSelected} />
          : <ProgramDetail program={program} onBack={() => setSelected(null)} />
      )}

      {tab === 'custom' && (
        customs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', paddingTop: 'var(--sp-4)' }}>
            {customs.map(cp => (
              <div key={cp.id} style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{cp.emoji}</span>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{cp.name}</span>
                  </div>
                  <button className="btn btn--ghost btn--sm" style={{ color: 'var(--clr-rose)' }} onClick={() => {
                    if (!confirm(`Delete "${cp.name}"?`)) return
                    const next = customs.filter(c => c.id !== cp.id)
                    store.set(KEYS.CUSTOM_PROGRAMS, next); setCustoms(next)
                  }}>Delete</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {cp.schedule.filter(d => d.exercises.length > 0).map(day => (
                    <div key={day.day} style={{ display: 'flex', gap: 'var(--sp-3)', fontSize: 'var(--fs-xs)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-sm)', background: 'var(--clr-surface-2)' }}>
                      <span style={{ fontWeight: 700, minWidth: 32 }}>{day.day}</span>
                      <span style={{ fontWeight: 600 }}>{day.label}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--clr-text-3)' }}>{day.exercises.length} exercises</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: 'var(--sp-6)' }}>
            <div className="empty-state__icon">📋</div>
            <p className="empty-state__text">No custom programs yet. Create your own weekly training plan!</p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 'var(--sp-3)' }} onClick={() => setTab('create')}>Create Program</button>
          </div>
        )
      )}

      {tab === 'create' && (
        <ProgramBuilder onSave={(cp) => {
          const next = [...customs, cp]
          store.set(KEYS.CUSTOM_PROGRAMS, next); setCustoms(next); setTab('custom')
        }} />
      )}

      <div style={{ marginTop: 'var(--sp-7)' }}>
        <h2 className="section-title">Muscle Activity (30 days)</h2>
        <MuscleHeatmap />
      </div>

      <div style={{ marginTop: 'var(--sp-7)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
        <RoutineCard title="🔥 Warm Up (5–7 min)" items={WARMUP_ROUTINE} />
        <RoutineCard title="🧊 Cool Down (5–7 min)" items={COOLDOWN_ROUTINE} />
      </div>
    </div>
  )
}

/* ── Custom Program Builder ─────────────────────────────────── */
function ProgramBuilder({ onSave }: { onSave: (p: CustomProgram) => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('💪')
  const [schedule, setSchedule] = useState(() =>
    DAYS.map(d => ({ day: d, label: '', exercises: [] as { name: string; sets: string }[] }))
  )
  const [editDay, setEditDay] = useState<number | null>(null)
  const [exName, setExName] = useState('')
  const [exSets, setExSets] = useState('')

  const addExercise = (dayIdx: number) => {
    if (!exName.trim()) return
    const next = [...schedule]
    next[dayIdx] = { ...next[dayIdx], exercises: [...next[dayIdx].exercises, { name: exName.trim(), sets: exSets.trim() || '3 × 10' }] }
    setSchedule(next); setExName(''); setExSets('')
  }

  const removeExercise = (dayIdx: number, exIdx: number) => {
    const next = [...schedule]
    next[dayIdx] = { ...next[dayIdx], exercises: next[dayIdx].exercises.filter((_, i) => i !== exIdx) }
    setSchedule(next)
  }

  const save = () => {
    if (!name.trim()) return
    onSave({ id: Date.now().toString(36), name: name.trim(), emoji, schedule })
  }

  const EMOJIS = ['💪', '🏋️', '🔥', '🏠', '🏃', '⚡', '🎯', '🧘', '🥊', '🚴']

  return (
    <div style={{ paddingTop: 'var(--sp-5)', maxWidth: 600 }}>
      <h2 className="section-title">Build Your Program</h2>

      <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Program Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="My Push Pull Legs" />
        </div>
        <div className="form-group" style={{ width: 80 }}>
          <label className="form-label">Icon</label>
          <select className="form-input" value={emoji} onChange={e => setEmoji(e.target.value)}>
            {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
        {schedule.map((day, di) => (
          <div key={day.day} style={{ padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: editDay === di ? 'var(--sp-3)' : 0, cursor: 'pointer' }}
              onClick={() => setEditDay(editDay === di ? null : di)}>
              <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) var(--sp-2)', borderRadius: 'var(--r-sm)', background: 'var(--clr-surface-2)' }}>{day.day}</span>
              <input className="form-input" value={day.label} placeholder={`e.g. Upper Body, Rest Day`}
                style={{ flex: 1, padding: '4px 8px', fontSize: 'var(--fs-xs)' }}
                onClick={e => e.stopPropagation()}
                onChange={e => { const n = [...schedule]; n[di] = { ...n[di], label: e.target.value }; setSchedule(n) }} />
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
                {day.exercises.length > 0 ? `${day.exercises.length} ex` : 'rest'}
              </span>
            </div>

            {editDay === di && (
              <div>
                {day.exercises.map((ex, ei) => (
                  <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', fontSize: 'var(--fs-xs)', padding: 'var(--sp-1) 0' }}>
                    <span style={{ flex: 1 }}>{ex.name}</span>
                    <span style={{ color: 'var(--clr-text-3)' }}>{ex.sets}</span>
                    <button onClick={() => removeExercise(di, ei)} style={{ background: 'none', border: 'none', color: 'var(--clr-rose)', fontSize: 'var(--fs-xs)', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
                  <input className="form-input" value={exName} onChange={e => setExName(e.target.value)} placeholder="Exercise name" style={{ flex: 1, padding: '4px 8px', fontSize: 'var(--fs-xs)' }}
                    onKeyDown={e => { if (e.key === 'Enter') addExercise(di) }} />
                  <input className="form-input" value={exSets} onChange={e => setExSets(e.target.value)} placeholder="3 × 10" style={{ width: 80, padding: '4px 8px', fontSize: 'var(--fs-xs)' }} />
                  <button className="btn btn--primary btn--sm" onClick={() => addExercise(di)}>+</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="btn btn--primary" onClick={save} disabled={!name.trim()}>Save Program</button>
    </div>
  )
}

/* ── Browse: Program Cards ──────────────────────────────────── */
function ProgramList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-4)', paddingTop: 'var(--sp-4)' }}>
      {FITNESS_PROGRAMS.map(p => (
        <button key={p.id} onClick={() => onSelect(p.id)} style={{
          textAlign: 'left', cursor: 'pointer', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', transition: 'transform var(--dur-md) var(--ease-out)',
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

/* ── Program Detail View ────────────────────────────────────── */
function ProgramDetail({ program, onBack }: { program: FitnessProgram; onBack: () => void }) {
  return (
    <div style={{ paddingTop: 'var(--sp-4)' }}>
      <button className="btn btn--ghost btn--sm" onClick={onBack} style={{ marginBottom: 'var(--sp-5)' }}>← Back</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <span style={{ fontSize: '2.5rem' }}>{program.emoji}</span>
        <div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>{program.name}</h2>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>{program.duration} · {program.level}</div>
        </div>
      </div>

      <h3 className="section-title">Weekly Schedule</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        {program.schedule.map(day => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
        <TipCard title="⭐ Key Rules" items={program.tips} />
        <TipCard title="🥗 Diet Tips" items={program.dietTips} />
      </div>

      <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', fontSize: 'var(--fs-sm)', fontWeight: 600, textAlign: 'center', color: 'var(--clr-accent-d)' }}>
        "Stay consistent, stay patient, your body will reward you." 💪
      </div>
    </div>
  )
}

function DayCard({ day }: { day: DayPlan }) {
  return (
    <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: day.color }}>
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
  )
}

function TipCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
      <h4 style={{ fontWeight: 700, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>{title}</h4>
      <ul style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-2)', paddingLeft: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

function RoutineCard({ title, items }: { title: string; items: ProgramExercise[] }) {
  return (
    <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface-2)' }}>
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

/* ── Muscle Heatmap ─────────────────────────────────────────── */
function MuscleHeatmap() {
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const last30 = workouts.filter(w => new Date(w.date) >= new Date(Date.now() - 30 * 86400000))

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
    const muscles = muscleMap[w.exercise.toLowerCase()] ?? []
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
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
              <span>{mg.emoji}</span>
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{mg.name}</span>
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
              {count > 0 ? `${count} session${count !== 1 ? 's' : ''} (30d)` : 'No data'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
