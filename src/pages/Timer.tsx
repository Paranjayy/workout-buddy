import { useState, useEffect, useRef } from 'react'

type TimerTab = 'rest' | 'stopwatch' | 'tabata'

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 880; osc.type = 'sine'; gain.gain.value = 0.3
    osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.stop(ctx.currentTime + 0.5)
  } catch { /* safari ignore */ }
}

function formatTime(s: number) {
  const abs = Math.abs(s)
  return `${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
}

function RestTimer() {
  const [target, setTarget] = useState(90)
  const [secs, setSecs] = useState(90)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    setDone(false)
    intRef.current = setInterval(() => {
      setSecs(prev => {
        if (prev <= 1) {
          clearInterval(intRef.current!); setRunning(false); setDone(true); playBeep(); return 0
        }
        return prev - 1
      })
    }, 1000)
    setRunning(true)
  }

  const stop = () => { clearInterval(intRef.current!); setRunning(false) }
  const reset = () => { stop(); setSecs(target); setDone(false) }
  const setPreset = (s: number) => { setTarget(s); setSecs(s); stop(); setDone(false) }

  useEffect(() => () => clearInterval(intRef.current!), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-7)' }}>
      <div className="timer-display">{formatTime(secs)}</div>
      <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[30, 60, 90, 120, 180].map(s => (
          <button key={s} className={`btn btn--sm ${s === target ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setPreset(s)}>{s}s</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
        <button className="btn btn--primary" style={{ minWidth: 120 }} onClick={running ? stop : start}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>
      {done && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', color: 'var(--clr-accent-d)' }}>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-xl)', fontWeight: 700 }}>Time's up! 💪</div>
          <div style={{ fontSize: 'var(--fs-sm)', marginTop: 'var(--sp-1)' }}>Get back to work!</div>
        </div>
      )}
    </div>
  )
}

function Stopwatch() {
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    intRef.current = setInterval(() => setSecs(p => p + 1), 1000)
    setRunning(true)
  }
  const stop = () => { clearInterval(intRef.current!); setRunning(false) }
  const reset = () => { stop(); setSecs(0); setLaps([]) }
  const lap = () => setLaps(p => [...p, secs])
  useEffect(() => () => clearInterval(intRef.current!), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-7)' }}>
      <div className="timer-display">{formatTime(secs)}</div>
      <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
        <button className="btn btn--primary" style={{ minWidth: 120 }} onClick={running ? stop : start}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn btn--ghost" onClick={lap}>Lap</button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>
      {laps.length > 0 && (
        <div style={{ width: '100%', maxWidth: 320 }}>
          {laps.map((l, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--clr-border)', fontSize: 'var(--fs-sm)' }}>
              <span style={{ color: 'var(--clr-text-3)' }}>Lap {i + 1}</span>
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatTime(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Tabata() {
  const [work, setWork] = useState(20)
  const [rest, setRest] = useState(10)
  const [rounds, setRounds] = useState(8)
  const [current, setCurrent] = useState(0)
  const [isWork, setIsWork] = useState(true)
  const [secs, setSecs] = useState(20)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => { clearInterval(intRef.current!); setRunning(false) }
  const reset = () => { stop(); setCurrent(0); setIsWork(true); setSecs(work); setDone(false) }

  const start = () => {
    setDone(false); setCurrent(1); setIsWork(true); setSecs(work); setRunning(true)
    let curRound = 1, curIsWork = true, curSecs = work
    intRef.current = setInterval(() => {
      curSecs--
      setSecs(curSecs)
      if (curSecs <= 0) {
        playBeep()
        if (curIsWork) {
          curIsWork = false; curSecs = rest; setIsWork(false); setSecs(rest)
        } else {
          curRound++
          if (curRound > rounds) {
            clearInterval(intRef.current!); setRunning(false); setDone(true); setCurrent(0); return
          }
          curIsWork = true; curSecs = work; setIsWork(true); setSecs(work); setCurrent(curRound)
        }
      }
    }, 1000)
  }

  useEffect(() => () => clearInterval(intRef.current!), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-7)' }}>
      <div className="timer-display" style={{ color: done ? 'var(--clr-accent)' : isWork ? 'var(--clr-accent)' : 'var(--clr-amber)' }}>
        {formatTime(secs)}
      </div>
      <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, letterSpacing: '0.08em', color: done ? 'var(--clr-accent)' : isWork ? 'var(--clr-accent)' : 'var(--clr-amber)' }}>
        {done ? 'DONE! 🎉' : isWork ? 'WORK' : 'REST'}
      </div>
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>Round {current} / {rounds}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-4)', width: '100%', maxWidth: 360 }}>
        {[
          { label: 'Work (s)', val: work, set: setWork },
          { label: 'Rest (s)', val: rest, set: setRest },
          { label: 'Rounds', val: rounds, set: setRounds },
        ].map(({ label, val, set }) => (
          <div key={label} className="form-group">
            <label className="form-label">{label}</label>
            <input className="form-input" type="number" value={val} min={1} max={300} onChange={e => { set(+e.target.value); if (!running) reset() }} disabled={running} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
        <button className="btn btn--primary" style={{ minWidth: 120 }} onClick={running ? stop : start}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

export function Timer() {
  const [tab, setTab] = useState<TimerTab>('rest')
  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">FOCUS</p>
        <h1 className="page-header__title">Workout Timer</h1>
      </div>
      <div className="tabs">
        {(['rest', 'stopwatch', 'tabata'] as TimerTab[]).map(t => (
          <button key={t} className={`tab${tab === t ? ' tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'rest' ? 'Rest Timer' : t === 'stopwatch' ? 'Stopwatch' : 'Tabata'}
          </button>
        ))}
      </div>
      {tab === 'rest' && <RestTimer />}
      {tab === 'stopwatch' && <Stopwatch />}
      {tab === 'tabata' && <Tabata />}
    </div>
  )
}
