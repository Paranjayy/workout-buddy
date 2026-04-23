import { useState, useEffect, useRef } from 'react'
import { getAllExercises, EXERCISES } from '../data/exercises'
import { TEMPLATES, getTemplatesByCategory } from '../data/templates'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid, formatDate } from '../utils/time'
import { useToast } from '../hooks/useToast'
import type { WorkoutEntry } from '../types'

type Tab = 'log' | 'templates' | 'history' | 'library'

// ── Mini animated SVG icon for log entries (32px) ──────────────
function MiniExerciseIcon({ type, name }: { type: string; name: string }) {
  const n = name.toLowerCase()
  const color = type === 'cardio' ? 'var(--clr-rose)' : type === 'yoga' ? 'var(--clr-sky)' : type === 'bodyweight' ? 'var(--clr-amber)' : type === 'sports' ? 'var(--clr-sky)' : 'var(--clr-accent)'
  const anim = n.includes('run') || n.includes('walk') || n.includes('sport') || n.includes('basket') || n.includes('football') || n.includes('cricket') ? 'mex-run'
    : n.includes('push') || n.includes('bench') || n.includes('press') ? 'mex-push'
    : n.includes('squat') || n.includes('lunge') ? 'mex-squat'
    : n.includes('plank') || n.includes('superman') ? 'mex-plank'
    : n.includes('curl') || n.includes('raise') ? 'mex-curl'
    : n.includes('pull') || n.includes('row') ? 'mex-pull'
    : n.includes('jump') || n.includes('burpee') ? 'mex-jump'
    : n.includes('yoga') || n.includes('warrior') || n.includes('flow') ? 'mex-yoga'
    : 'mex-def'
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" style={{ overflow: 'visible', flexShrink: 0 }}>
      <style>{`
        @keyframes mex-run{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
        @keyframes mex-push{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes mex-squat{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.82) translateY(5px)}}
        @keyframes mex-curl{0%,100%{transform:rotate(0)}50%{transform:rotate(-28deg)}}
        @keyframes mex-pull{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes mex-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes mex-yoga{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        @keyframes mex-plank{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.05)}}
        @keyframes mex-def{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .mfig{animation:${anim} 1.4s ease-in-out infinite;transform-origin:center}
      `}</style>
      <g className="mfig">
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

// ── Rest Timer ─────────────────────────────────────────────────
function RestTimer({ onDismiss }: { onDismiss: () => void }) {
  const PRESETS = [30, 60, 90, 120]
  const [dur, setDur] = useState(60)
  const [secs, setSecs] = useState(60)
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = (d?: number) => {
    const total = d ?? dur
    setSecs(total); setDur(total); setRunning(true)
    clearInterval(ref.current!)
    ref.current = setInterval(() => {
      setSecs(p => {
        if (p <= 1) {
          clearInterval(ref.current!); setRunning(false)
          // Beep
          try {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator(); const g = ctx.createGain()
            osc.connect(g); g.connect(ctx.destination)
            osc.frequency.value = 880; g.gain.setValueAtTime(0.3, ctx.currentTime)
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
            osc.start(); osc.stop(ctx.currentTime + 0.4)
          } catch {}
          return 0
        }
        return p - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(ref.current!), [])

  const pct = (secs / dur) * 100
  const r = 36, circ = 2 * Math.PI * r
  const offset = circ - (circ * pct) / 100

  return (
    <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--clr-surface-2)" strokeWidth="5"/>
        <circle cx="44" cy="44" r={r} fill="none" stroke={secs === 0 ? 'var(--clr-accent)' : 'var(--clr-amber)'}
          strokeWidth="5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 0.9s linear' }}/>
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
          fontFamily="var(--ff-display)" fontSize="20" fontWeight="700" fill="var(--clr-text)">
          {secs === 0 ? '✓' : `${secs}s`}
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-2)' }}>Rest Timer</div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
          {PRESETS.map(p => (
            <button key={p} className={`btn btn--sm ${dur === p && running ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => start(p)}>{p}s</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          {!running && secs > 0 && <button className="btn btn--primary btn--sm" onClick={() => start()}>▶ Start</button>}
          {running && <button className="btn btn--ghost btn--sm" onClick={() => { clearInterval(ref.current!); setRunning(false) }}>⏸ Pause</button>}
          <button className="btn btn--ghost btn--sm" onClick={onDismiss}>Dismiss</button>
        </div>
      </div>
    </div>
  )
}


// Animated SVG exercise visual — CSS-animated stick figure
function ExerciseVisual({ type, name }: { type: string; name: string }) {
  const n = name.toLowerCase()
  const color = type === 'cardio' ? 'var(--clr-rose)' : type === 'yoga' ? 'var(--clr-sky)' : type === 'bodyweight' ? 'var(--clr-amber)' : 'var(--clr-accent)'

  // Pick animation class based on exercise
  const anim = n.includes('run') || n.includes('walk') ? 'ex-run'
    : n.includes('push') || n.includes('bench') || n.includes('press') ? 'ex-push'
    : n.includes('squat') || n.includes('lunge') || n.includes('leg press') ? 'ex-squat'
    : n.includes('plank') || n.includes('superman') ? 'ex-plank'
    : n.includes('curl') || n.includes('raise') || n.includes('fly') ? 'ex-curl'
    : n.includes('pull') || n.includes('row') || n.includes('lat') ? 'ex-pull'
    : n.includes('jump') || n.includes('burpee') ? 'ex-jump'
    : n.includes('yoga') || n.includes('flow') || n.includes('warrior') ? 'ex-yoga'
    : 'ex-default'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-3)' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
        <style>{`
          @keyframes ex-run { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
          @keyframes ex-push { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes ex-squat { 0%,100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.85) translateY(6px); } }
          @keyframes ex-curl { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
          @keyframes ex-pull { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes ex-jump { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
          @keyframes ex-yoga { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
          @keyframes ex-plank { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(1.04); } }
          @keyframes ex-default { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          .ex-figure { animation: ${anim} 1.2s ease-in-out infinite; transform-origin: center; }
        `}</style>
        <g className="ex-figure">
          {/* Head */}
          <circle cx="40" cy="16" r="7" fill="none" stroke={color} strokeWidth="2.5" />
          {/* Body */}
          <line x1="40" y1="23" x2="40" y2="48" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {/* Arms */}
          {(n.includes('push') || n.includes('bench') || n.includes('press')) ? (
            <>
              <line x1="40" y1="30" x2="22" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="30" x2="58" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : n.includes('curl') || n.includes('raise') ? (
            <>
              <line x1="40" y1="30" x2="24" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="24" y1="36" x2="20" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="30" x2="56" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="56" y1="36" x2="60" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="40" y1="30" x2="24" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="30" x2="56" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {/* Legs */}
          {(n.includes('squat') || n.includes('lunge')) ? (
            <>
              <line x1="40" y1="48" x2="30" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="60" x2="24" y2="72" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="48" x2="50" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="50" y1="60" x2="56" y2="72" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="40" y1="48" x2="32" y2="64" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="40" y1="48" x2="48" y2="64" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </g>
        {/* Ground line */}
        <line x1="18" y1="74" x2="62" y2="74" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </svg>
    </div>
  )
}

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
  const [showRestTimer, setShowRestTimer] = useState(false)

  const results = query.length > 0
    ? allExercises.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || (e.muscle ?? '').toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  const todayLog = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())

  const save = () => {
    if (!selected) return
    // PR detection — compare weight to historical max for this exercise
    const allLogs = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
    const prevBest = allLogs
      .filter(w => w.exercise === selected.name && w.weight !== null)
      .reduce((max, w) => Math.max(max, w.weight ?? 0), 0)
    const isPR = !selected.isTime && weight > 0 && weight > prevBest

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
    setShowRestTimer(true)
    showToast(isPR ? `🏆 New PR! ${selected.name} @ ${weight}kg` : `${selected.name} logged ✓`)
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
          <ExerciseVisual type={selected.type} name={selected.name} />
          <h3 className="section-title" style={{ textAlign: 'center' }}>{selected.name}</h3>
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

      {showRestTimer && <RestTimer onDismiss={() => setShowRestTimer(false)} />}

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
              <div className={`workout-entry__icon workout-entry__icon--${w.type}`} style={{ overflow: 'hidden', background: 'transparent', padding: 0 }}>
                <MiniExerciseIcon type={w.type} name={w.exercise} />
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
            {cat === 'bodyweight' ? '💪 Bodyweight' : cat === 'strength' ? '🏋️ Strength' : cat === 'cardio' ? '🏃 Cardio' : cat === 'sports' ? '⚽ Sports & Outdoor' : '🧘 Yoga'}
          </h3>
          <div className="workout-list">
            {EXERCISES[cat].map(e => (
              <div key={e.id} className="workout-entry">
                <div className={`workout-entry__icon workout-entry__icon--${cat}`}>
                  {cat === 'cardio' ? '🏃' : cat === 'yoga' ? '🧘' : cat === 'bodyweight' ? '💪' : cat === 'sports' ? '⚽' : '🏋️'}
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

