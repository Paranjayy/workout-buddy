import { useState, useEffect } from 'react'
import { getAllExercises, EXERCISES } from '../data/exercises'
import { TEMPLATES, getTemplatesByCategory } from '../data/templates'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid, formatDate } from '../utils/time'
import { useToast } from '../hooks/useToast'
import type { WorkoutEntry } from '../types'

type Tab = 'log' | 'templates' | 'history' | 'library'

export function Workout() {
  const [tab, setTab] = useState<Tab>('log')
  const { showToast } = useToast()

  // If a template was queued from Dashboard
  useEffect(() => {
    const tmpl = store.get<null>('_active_template', null)
    if (tmpl) {
      store.remove('_active_template')
      const t = tmpl as typeof TEMPLATES[0]
      t.exercises.forEach(ex => {
        store.push<WorkoutEntry>(KEYS.WORKOUTS, {
          id: uid(), date: todayKey(), exercise: ex.name,
          type: ex.type, sets: ex.sets, reps: ex.reps ?? null,
          weight: null, duration: ex.duration ?? null,
          detail: ex.isTime ? `${ex.sets} rounds · ${Math.round((ex.duration ?? 0) / 60)} min` : `${ex.sets}×${ex.reps}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        })
      })
      showToast(`${t.name} loaded — ${t.exercises.length} exercises ✓`)
    }
  }, [showToast])

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">TRAINING</p>
        <h1 className="page-header__title">Workouts</h1>
      </div>
      <div className="tabs">
        {(['log', 'templates', 'history', 'library'] as Tab[]).map(t => (
          <button key={t} className={`tab${tab === t ? ' tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'log' ? 'Log Workout' : t === 'templates' ? 'Templates' : t === 'history' ? 'History' : 'Exercise Library'}
          </button>
        ))}
      </div>
      {tab === 'log' && <LogTab showToast={showToast} />}
      {tab === 'templates' && <TemplatesTab showToast={showToast} />}
      {tab === 'history' && <HistoryTab />}
      {tab === 'library' && <LibraryTab />}
    </div>
  )
}

function LogTab({ showToast }: { showToast: (m: string) => void }) {
  const allExercises = getAllExercises()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<typeof allExercises[0] | null>(null)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)
  const [duration, setDuration] = useState(30)
  const [, forceUpdate] = useState(0)

  const results = query.length > 0
    ? allExercises.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || (e.muscle ?? '').toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  const todayLog = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())

  const save = () => {
    if (!selected) return
    store.push<WorkoutEntry>(KEYS.WORKOUTS, {
      id: uid(), date: todayKey(), exercise: selected.name,
      type: selected.type, sets, reps: selected.isTime ? null : reps,
      weight: selected.isTime ? null : weight,
      duration: selected.isTime ? duration : null,
      detail: selected.isTime ? `${sets} rounds · ${duration} min` : `${sets}×${reps} @ ${weight}kg`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })
    setSelected(null)
    setQuery('')
    forceUpdate(n => n + 1)
    showToast(`${selected.name} logged ✓`)
  }

  const quickAdd = (name: string) => {
    const ex = allExercises.find(e => e.name === name)
    if (ex) { setSelected(ex); setQuery('') }
  }

  return (
    <div style={{ paddingTop: 'var(--sp-4)' }}>
      <div className="search-bar" style={{ position: 'relative' }}>
        <input className="search-bar__input" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search exercises (bench press, squat, running…)" autoComplete="off" />
        {results.length > 0 && (
          <div className="food-results" style={{ display: 'block' }}>
            {results.map(e => (
              <div key={e.id} className="food-result" onClick={() => { setSelected(e); setQuery('') }}>
                <span className="food-item__name">{e.name}</span>
                <span className="food-item__region">{e.type}</span>
                <span className="food-item__cal">{e.muscle ?? ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <h3 className="section-title" style={{ marginBottom: 'var(--sp-3)' }}>Quick Add</h3>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          {['Push-ups', 'Squat', 'Running', 'Plank', 'Bench Press', 'Pull-ups'].map(name => (
            <button key={name} className="btn btn--ghost btn--sm" onClick={() => quickAdd(name)}>{name}</button>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-accent)', background: 'var(--clr-accent-l)', marginBottom: 'var(--sp-5)' }}>
          <h3 className="section-title">{selected.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--sp-4)' }}>
            <div className="form-group">
              <label className="form-label">Sets</label>
              <input type="number" className="form-input" value={sets} min={1} onChange={e => setSets(+e.target.value)} />
            </div>
            {!selected.isTime && (
              <>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input type="number" className="form-input" value={reps} min={1} onChange={e => setReps(+e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" className="form-input" value={weight} min={0} step={0.5} onChange={e => setWeight(+e.target.value)} />
                </div>
              </>
            )}
            {selected.isTime && (
              <div className="form-group">
                <label className="form-label">Duration (min)</label>
                <input type="number" className="form-input" value={duration} min={1} onChange={e => setDuration(+e.target.value)} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            <button className="btn btn--primary" onClick={save}>Save Exercise</button>
            <button className="btn btn--ghost" onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </div>
      )}

      <h3 className="section-title">Today's Log</h3>
      {todayLog.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🏋️</div>
          <p className="empty-state__text">No exercises logged today. Search above or use quick add.</p>
        </div>
      ) : (
        <div className="workout-list">
          {todayLog.map(w => (
            <div key={w.id} className="workout-entry">
              <div className={`workout-entry__icon workout-entry__icon--${w.type}`}>
                {w.type === 'cardio' ? '🏃' : w.type === 'yoga' ? '🧘' : w.type === 'bodyweight' ? '💪' : '🏋️'}
              </div>
              <div>
                <div className="workout-entry__name">{w.exercise}</div>
                <div className="workout-entry__detail">{w.detail}</div>
              </div>
              <div className="workout-entry__meta">{w.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TemplatesTab({ showToast }: { showToast: (m: string) => void }) {
  const cats = getTemplatesByCategory()

  const startTemplate = (id: string) => {
    const t = TEMPLATES.find(x => x.id === id)
    if (!t) return
    t.exercises.forEach(ex => {
      store.push<WorkoutEntry>(KEYS.WORKOUTS, {
        id: uid(), date: todayKey(), exercise: ex.name,
        type: ex.type, sets: ex.sets, reps: ex.reps ?? null,
        weight: null, duration: ex.duration ?? null,
        detail: ex.isTime ? `${ex.sets} rounds · ${Math.round((ex.duration ?? 0) / 60)} min` : `${ex.sets}×${ex.reps}`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      })
    })
    showToast(`${t.name} loaded — ${t.exercises.length} exercises ✓`)
  }

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      {Object.entries(cats).map(([cat, templates]) => (
        <div key={cat} style={{ marginBottom: 'var(--sp-6)' }}>
          <h3 className="section-title">{cat}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)' }}>
            {templates.map(t => (
              <div key={t.id} style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{t.name}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{t.description}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)', marginBottom: 'var(--sp-4)' }}>
                  {t.exercises.map((e, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', padding: '2px 0' }}>
                      <span>{e.name}</span>
                      <span style={{ color: 'var(--clr-text-3)' }}>
                        {e.isTime ? `${e.sets}×${Math.round((e.duration ?? 0) / 60)}min` : `${e.sets}×${e.reps}`}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="btn btn--primary btn--sm" style={{ width: '100%' }} onClick={() => startTemplate(t.id)}>
                  Start Workout
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function HistoryTab() {
  const all = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const byDate: Record<string, WorkoutEntry[]> = {}
  all.forEach(w => { (byDate[w.date] ??= []).push(w) })
  const dates = Object.keys(byDate).sort().reverse().slice(0, 14)

  if (!dates.length) return (
    <div className="empty-state"><div className="empty-state__icon">📋</div><p className="empty-state__text">No workout history yet. Start logging!</p></div>
  )

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      {dates.map(d => (
        <div key={d} style={{ marginBottom: 'var(--sp-6)' }}>
          <h3 className="section-title">{formatDate(d)}</h3>
          <div className="workout-list">
            {byDate[d].map(w => (
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
      ))}
    </div>
  )
}

function LibraryTab() {
  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      {(Object.keys(EXERCISES) as (keyof typeof EXERCISES)[]).map(cat => (
        <div key={cat} style={{ marginBottom: 'var(--sp-6)' }}>
          <h3 className="section-title" style={{ textTransform: 'capitalize' }}>
            {cat === 'bodyweight' ? '💪 Bodyweight' : cat === 'strength' ? '🏋️ Strength' : cat === 'cardio' ? '🏃 Cardio' : '🧘 Yoga'}
          </h3>
          <div className="workout-list">
            {EXERCISES[cat].map(e => (
              <div key={e.id} className="workout-entry">
                <div className={`workout-entry__icon workout-entry__icon--${cat}`}>
                  {cat === 'cardio' ? '🏃' : cat === 'yoga' ? '🧘' : cat === 'bodyweight' ? '💪' : '🏋️'}
                </div>
                <div>
                  <div className="workout-entry__name">{e.name}</div>
                  <div className="workout-entry__detail">{e.muscle ?? ''} {e.equipment ? `· ${e.equipment}` : ''}</div>
                </div>
                <div className="workout-entry__meta">{e.isTime ? 'Timed' : 'Sets/Reps'}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
