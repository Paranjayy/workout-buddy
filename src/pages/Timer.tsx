import { useState, useEffect, useRef, useCallback } from 'react'

type TimerTab = 'rest' | 'stopwatch' | 'tabata' | 'activity'

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
  const mins = Math.floor(abs / 60)
  const secs = abs % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatTimeLong(s: number) {
  const mins = Math.floor(s / 60)
  const secs = s % 60
  if (mins === 0) return `${secs} seconds`
  if (secs === 0) return `${mins} minute${mins > 1 ? 's' : ''}`
  return `${mins} minute${mins > 1 ? 's' : ''} ${secs} seconds`
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 1.1; u.pitch = 1.0; u.volume = 0.9
  window.speechSynthesis.speak(u)
}

/* ── Rest Timer ─────────────────────────────────────────────── */
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
        <button className="btn btn--primary" style={{ minWidth: 120 }} onClick={running ? stop : start}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>
      {done && (
        <div style={{ textAlign: 'center', padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', color: 'var(--clr-accent-d)' }}>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-xl)', fontWeight: 700 }}>Time's up! 💪</div>
        </div>
      )}
    </div>
  )
}

/* ── Stopwatch ──────────────────────────────────────────────── */
function Stopwatch() {
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => { intRef.current = setInterval(() => setSecs(p => p + 1), 1000); setRunning(true) }
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

/* ── Tabata ──────────────────────────────────────────────────── */
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
      curSecs--; setSecs(curSecs)
      if (curSecs <= 0) {
        playBeep()
        if (curIsWork) { curIsWork = false; curSecs = rest; setIsWork(false); setSecs(rest) }
        else {
          curRound++
          if (curRound > rounds) { clearInterval(intRef.current!); setRunning(false); setDone(true); setCurrent(0); return }
          curIsWork = true; curSecs = work; setIsWork(true); setSecs(work); setCurrent(curRound)
        }
      }
    }, 1000)
  }

  useEffect(() => () => clearInterval(intRef.current!), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-7)' }}>
      <div className="timer-display" style={{ color: done ? 'var(--clr-accent)' : isWork ? 'var(--clr-accent)' : 'var(--clr-amber)' }}>{formatTime(secs)}</div>
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

/* ── Activity Timer (Speaking + Flags + Visualizer) ─────────── */
interface Flag {
  time: number
  label: string
}

function ActivityTimer() {
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const [flags, setFlags] = useState<Flag[]>([])
  const [voiceInterval, setVoiceInterval] = useState(30) // speak every N secs
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [stepCount, setStepCount] = useState(0)
  const [stepsPerFlag, setStepsPerFlag] = useState(0)
  const [activityName, setActivityName] = useState('Stairs')
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secsRef = useRef(0)

  const start = useCallback(() => {
    if (voiceEnabled) speak('Starting activity timer. Let\'s go!')
    secsRef.current = secs
    intRef.current = setInterval(() => {
      secsRef.current += 1
      setSecs(secsRef.current)
      // Voice announcement at interval
      if (voiceEnabled && secsRef.current > 0 && secsRef.current % voiceInterval === 0) {
        speak(formatTimeLong(secsRef.current))
      }
    }, 1000)
    setRunning(true)
  }, [secs, voiceInterval, voiceEnabled])

  const stop = useCallback(() => {
    clearInterval(intRef.current!)
    setRunning(false)
    if (voiceEnabled) speak('Paused')
  }, [voiceEnabled])

  const reset = useCallback(() => {
    clearInterval(intRef.current!)
    setRunning(false); setSecs(0); secsRef.current = 0
    setFlags([]); setStepCount(0); setStepsPerFlag(0)
  }, [])

  const addFlag = useCallback(() => {
    const t = secsRef.current
    const flagNum = flags.length + 1
    const label = flagNum % 2 === 1 ? `↑ Up #${Math.ceil(flagNum / 2)}` : `↓ Down #${Math.floor(flagNum / 2)}`
    setFlags(prev => [...prev, { time: t, label }])
    setStepCount(prev => prev + 1)
    setStepsPerFlag(prev => {
      const newCount = flags.length + 1
      return Math.round(t / newCount)
    })
    playBeep()
    if (voiceEnabled) {
      speak(`Flag ${flagNum}. ${formatTimeLong(t)}`)
    }
  }, [flags, voiceEnabled])

  const finish = useCallback(() => {
    clearInterval(intRef.current!)
    setRunning(false)
    if (voiceEnabled) {
      const summary = `Activity complete. Total time: ${formatTimeLong(secsRef.current)}. ${flags.length + 1} flags. Great job!`
      speak(summary)
    }
  }, [flags, voiceEnabled])

  useEffect(() => () => { clearInterval(intRef.current!); window.speechSynthesis?.cancel() }, [])

  // Pulse animation intensity
  const pulse = running ? Math.sin(secs * 0.5) * 0.5 + 0.5 : 0

  const ACTIVITIES = ['Stairs', 'Walking', 'Running', 'Cycling', 'Jump Rope', 'Other']
  const INTERVALS = [
    { val: 15, label: '15s' }, { val: 30, label: '30s' }, { val: 60, label: '1m' },
    { val: 120, label: '2m' }, { val: 300, label: '5m' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-5)', paddingTop: 'var(--sp-5)' }}>
      {/* Pulse visualizer */}
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        {running && [0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid var(--clr-accent)`,
            opacity: 0.15 + pulse * 0.2 - i * 0.05,
            transform: `scale(${1 + i * 0.15 + pulse * 0.1})`,
            transition: 'transform 0.5s ease, opacity 0.5s ease',
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          borderRadius: '50%', border: `3px solid ${running ? 'var(--clr-accent)' : 'var(--clr-border)'}`,
          background: running ? 'var(--clr-accent-l)' : 'var(--clr-surface)',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="timer-display" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}>{formatTime(secs)}</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', fontWeight: 600 }}>
              {running ? activityName.toUpperCase() : 'READY'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {(flags.length > 0 || secs > 0) && (
        <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <MiniStat label="Flags" value={flags.length} />
          <MiniStat label="Steps" value={`~${stepCount}`} />
          {stepsPerFlag > 0 && <MiniStat label="Avg/flag" value={`${stepsPerFlag}s`} />}
        </div>
      )}

      {/* Config (only when not running) */}
      {!running && secs === 0 && (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="form-group">
            <label className="form-label">Activity</label>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {ACTIVITIES.map(a => (
                <button key={a} className={`btn btn--sm ${activityName === a ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={() => setActivityName(a)}>{a}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Voice Interval</label>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              {INTERVALS.map(i => (
                <button key={i.val} className={`btn btn--sm ${voiceInterval === i.val ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={() => setVoiceInterval(i.val)}>{i.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--fs-sm)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', cursor: 'pointer' }}>
              <input type="checkbox" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} />
              🔊 Voice announcements
            </label>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn--primary" style={{ minWidth: 120 }} onClick={running ? stop : start}>
          {running ? '⏸ Pause' : secs > 0 ? '▶ Resume' : '▶ Start'}
        </button>
        {running && (
          <button className="btn btn--ghost" onClick={addFlag} style={{
            background: 'var(--clr-amber-l)', borderColor: 'var(--clr-amber)', color: 'var(--clr-text)',
            fontSize: 'var(--fs-sm)', fontWeight: 700, minWidth: 100,
          }}>
            🚩 Flag
          </button>
        )}
        {secs > 0 && !running && (
          <button className="btn btn--primary" style={{ background: 'var(--clr-accent)' }} onClick={finish}>✓ Finish</button>
        )}
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>

      {/* Flags timeline */}
      {flags.length > 0 && (
        <div style={{ width: '100%', maxWidth: 400, marginTop: 'var(--sp-3)' }}>
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-3)' }}>
            Flags Timeline
          </div>
          <div style={{ position: 'relative', paddingLeft: 'var(--sp-5)' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 8, top: 4, bottom: 4, width: 2, background: 'var(--clr-border)', borderRadius: 1 }} />
            {flags.map((f, i) => {
              const gap = i > 0 ? f.time - flags[i - 1].time : f.time
              return (
                <div key={i} style={{ position: 'relative', paddingBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  {/* Dot */}
                  <div style={{ position: 'absolute', left: -16, width: 10, height: 10, borderRadius: '50%', background: i % 2 === 0 ? 'var(--clr-accent)' : 'var(--clr-amber)', border: '2px solid var(--clr-surface)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
                      at {formatTime(f.time)} · {gap}s since {i === 0 ? 'start' : `flag ${i}`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', textAlign: 'center', maxWidth: 360, lineHeight: 1.5, marginTop: 'var(--sp-2)' }}>
        💡 Use flags to mark reps — e.g. climbing stairs: flag up ↑, flag down ↓. Voice will announce your time at every {voiceInterval}s interval.
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: 'var(--sp-2) var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', textAlign: 'center', minWidth: 80 }}>
      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 700 }}>{value}</div>
    </div>
  )
}

/* ── Main Timer Page ────────────────────────────────────────── */
export function Timer() {
  const [tab, setTab] = useState<TimerTab>('rest')
  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">FOCUS</p>
        <h1 className="page-header__title">Workout Timer</h1>
      </div>
      <div className="tabs">
        {([
          ['rest', 'Rest Timer'],
          ['stopwatch', 'Stopwatch'],
          ['tabata', 'Tabata'],
          ['activity', '🔊 Activity'],
        ] as [TimerTab, string][]).map(([t, label]) => (
          <button key={t} className={`tab${tab === t ? ' tab--active' : ''}`} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>
      {tab === 'rest' && <RestTimer />}
      {tab === 'stopwatch' && <Stopwatch />}
      {tab === 'tabata' && <Tabata />}
      {tab === 'activity' && <ActivityTimer />}
    </div>
  )
}
