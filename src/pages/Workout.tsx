import { useState, useEffect, useRef } from 'react'
import { getAllExercises, EXERCISES } from '../data/exercises'
import { TEMPLATES, getTemplatesByCategory } from '../data/templates'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid, formatDate } from '../utils/time'
import { useToast } from '../hooks/useToast'
import { launchConfetti } from '../utils/confetti'
import { MuscleMap } from '../components/MuscleMap'
import { GooeyButton } from '../components/GooeyButton'
import type { WorkoutEntry } from '../types'

type Tab = 'log' | 'templates' | 'history' | 'library'



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


// ── Wger real exercise photos (CC-BY-SA, free, no key) ────────
const wgerCache = new Map<string, string | null>()

function WgerImage({ name }: { name: string }) {
  const [url, setUrl] = useState<string | null | 'loading'>('loading')
  const q = name.replace(/[()]/g, '').trim()

  useEffect(() => {
    if (wgerCache.has(q)) { setUrl(wgerCache.get(q) ?? null); return }
    setUrl('loading')
    // Step 1: search for exercise by name
    fetch(`https://wger.de/api/v2/exercise/?format=json&language=2&name=${encodeURIComponent(q)}&limit=5`)
      .then(r => r.json())
      .then(async d => {
        const results = d.results ?? []
        if (!results.length) {
          // Try broader base-exercise search
          const r2 = await fetch(`https://wger.de/api/v2/exerciseinfo/?format=json&language=2&limit=3&name=${encodeURIComponent(q.split(' ')[0])}`)
          const d2 = await r2.json()
          const id = d2.results?.[0]?.id
          if (!id) { wgerCache.set(q, null); setUrl(null); return }
          const r3 = await fetch(`https://wger.de/api/v2/exerciseimage/?format=json&exercise_base_id=${id}&is_main=true&limit=1`)
          const d3 = await r3.json()
          const img = d3.results?.[0]?.image ?? null
          wgerCache.set(q, img); setUrl(img)
        } else {
          const baseId = results[0].id
          const r2 = await fetch(`https://wger.de/api/v2/exerciseimage/?format=json&exercise_base_id=${baseId}&is_main=true&limit=1`)
          const d2 = await r2.json()
          const img = d2.results?.[0]?.image ?? null
          wgerCache.set(q, img); setUrl(img)
        }
      })
      .catch(() => { wgerCache.set(q, null); setUrl(null) })
  }, [q])

  if (url === 'loading') return (
    <div style={{ height: 120, display: 'grid', placeItems: 'center', color: 'var(--clr-text-3)', fontSize: 'var(--fs-xs)' }}>
      Loading exercise image…
    </div>
  )
  if (!url) return null
  return (
    <div style={{ marginBottom: 'var(--sp-3)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--clr-surface-2)' }}>
      <img src={url} alt={name} style={{ width: '100%', maxHeight: 160, objectFit: 'contain', display: 'block' }} onError={() => setUrl(null)} />
      <div style={{ fontSize: '10px', color: 'var(--clr-text-3)', padding: '4px var(--sp-3)', textAlign: 'right' }}>
        Image © <a href="https://wger.de" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>wger.de</a> · CC-BY-SA
      </div>
    </div>
  )
}

// ── Premium non-humanoid animated visuals ─────────────────────
function MiniExerciseIcon({ type, name }: { type: string; name: string }) {
  const n = name.toLowerCase()
  const color = type === 'cardio' ? 'var(--clr-rose)' : type === 'yoga' ? 'var(--clr-sky)' : type === 'bodyweight' ? 'var(--clr-amber)' : 'var(--clr-accent)'
  
  const anim = n.includes('run') || n.includes('walk') ? 'v-run'
    : n.includes('push') || n.includes('bench') || n.includes('press') ? 'v-push'
    : n.includes('squat') || n.includes('lunge') ? 'v-squat'
    : n.includes('curl') || n.includes('raise') ? 'v-curl'
    : n.includes('pull') || n.includes('row') ? 'v-pull'
    : n.includes('jump') || n.includes('burpee') ? 'v-jump'
    : 'v-def'

  return (
    <svg width="32" height="32" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes v-run{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
        @keyframes v-push{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes v-squat{0%,100%{transform:scaleY(1)}50%{transform:scaleY(0.8) translateY(4px)}}
        @keyframes v-curl{0%,100%{transform:rotate(0)}50%{transform:rotate(-20deg)}}
        @keyframes v-pull{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes v-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes v-def{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .v-fig{animation:${anim} 1.5s ease-in-out infinite;transform-origin:center}
      `}</style>
      <g className="v-fig">
        <rect x="16" y="10" width="8" height="16" rx="4" fill={color} opacity="0.9" />
        <circle cx="20" cy="6" r="4" fill={color} />
        <rect x="12" y="18" width="4" height="12" rx="2" fill={color} opacity="0.6" transform="rotate(15 14 18)" />
        <rect x="24" y="18" width="4" height="12" rx="2" fill={color} opacity="0.6" transform="rotate(-15 26 18)" />
      </g>
    </svg>
  )
}

function ExerciseVisual({ type, name }: { type: string; name: string }) {
  const n = name.toLowerCase()
  const color = type === 'cardio' ? 'var(--clr-rose)' : type === 'yoga' ? 'var(--clr-sky)' : type === 'bodyweight' ? 'var(--clr-amber)' : 'var(--clr-accent)'
  
  // Advanced Granular Mapping
  const getAnim = () => {
    if (n.includes('run') || n.includes('walk') || n.includes('cycle') || n.includes('sprint')) return 'hf-run'
    if (n.includes('push') || n.includes('bench') || n.includes('dip')) return 'hf-push'
    if (n.includes('squat') || n.includes('leg press') || n.includes('hack')) return 'hf-squat'
    if (n.includes('deadlift') || n.includes('swing') || n.includes('hinge') || n.includes('good morning')) return 'hf-hinge'
    if (n.includes('press') || n.includes('overhead') || n.includes('military')) return 'hf-press'
    if (n.includes('pull') || n.includes('row') || n.includes('lat') || n.includes('chin')) return 'hf-row'
    if (n.includes('curl') || n.includes('hammer')) return 'hf-curl'
    if (n.includes('fly') || n.includes('lateral') || n.includes('raise')) return 'hf-fly'
    if (n.includes('lunge') || n.includes('step') || n.includes('split')) return 'hf-lunge'
    if (n.includes('plank') || n.includes('hold') || n.includes('static')) return 'hf-core'
    if (n.includes('jump') || n.includes('burpee') || n.includes('box')) return 'hf-jump'
    if (type === 'yoga' || n.includes('yoga') || n.includes('stretch')) return 'hf-yoga'
    return 'hf-def'
  }

  const anim = getAnim()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--sp-4)', background: 'var(--clr-surface-2)', padding: 'var(--sp-6)', borderRadius: 'var(--r-xl)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 200, height: 200, background: color, filter: 'blur(80px)', opacity: 0.1, transform: 'translate(-50%, -50%)', borderRadius: '50%' }} />
      
      <svg width="160" height="160" viewBox="0 0 100 100" style={{ overflow: 'visible', zIndex: 1 }}>
        <defs>
          <linearGradient id="figGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.6 }} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <style>{`
          @keyframes hf-run { 0%, 100% { transform: rotate(-12deg) translateX(-8px); } 50% { transform: rotate(12deg) translateX(8px); } }
          @keyframes hf-push { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(18px); } }
          @keyframes hf-squat { 0%, 100% { transform: scaleY(1) translateY(0); } 50% { transform: scaleY(0.6) translateY(20px); } }
          @keyframes hf-hinge { 0%, 100% { transform: rotate(0deg) translateY(0); } 50% { transform: rotate(45deg) translateY(10px); } }
          @keyframes hf-press { 0%, 100% { transform: translateY(15px); } 50% { transform: translateY(-15px); } }
          @keyframes hf-row { 0%, 100% { transform: translateY(0) scaleX(1); } 50% { transform: translateY(-8px) scaleX(1.1); } }
          @keyframes hf-curl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-45deg); } }
          @keyframes hf-fly { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.3) translateY(-5px); } }
          @keyframes hf-lunge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px) translateX(5px); } }
          @keyframes hf-core { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.02); opacity: 1; } }
          @keyframes hf-jump { 0%, 100% { transform: translateY(5px) scaleY(1); } 50% { transform: translateY(-35px) scaleY(1.1); } }
          @keyframes hf-yoga { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
          @keyframes hf-def { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes hf-shadow { 0%, 100% { transform: scaleX(1); opacity: 0.05; } 50% { transform: scaleX(1.5); opacity: 0.1; } }
          
          .hf-fig { animation: ${anim} 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; transform-origin: center 85%; filter: url(#glow); }
          .hf-limb { stroke: url(#figGrad); stroke-width: 14; stroke-linecap: round; fill: none; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
          .hf-joint { fill: white; opacity: 0.4; }
        `}</style>
        
        <g className="hf-fig">
          <path d="M50 30 Q50 45 50 65" className="hf-limb" style={{ strokeWidth: 18 }} />
          <circle cx="50" cy="20" r="10" fill="url(#figGrad)" />
          
          <g>
            <path d={anim === 'hf-push' || anim === 'hf-row' ? "M42 35 Q20 40 15 55" : anim === 'hf-press' ? "M42 35 Q30 20 25 10" : "M42 35 Q30 35 20 50"} className="hf-limb" opacity="0.8" />
            <path d={anim === 'hf-push' || anim === 'hf-row' ? "M58 35 Q80 40 85 55" : anim === 'hf-press' ? "M58 35 Q70 20 75 10" : "M58 35 Q70 35 80 50"} className="hf-limb" opacity="0.8" />
          </g>
          
          <g>
            <path d={anim === 'hf-squat' || anim === 'hf-lunge' ? "M45 65 Q30 75 25 95" : "M45 65 Q40 80 38 98"} className="hf-limb" opacity="0.9" />
            <path d={anim === 'hf-squat' || anim === 'hf-lunge' ? "M55 65 Q70 75 75 95" : "M55 65 Q60 80 62 98"} className="hf-limb" opacity="0.9" />
          </g>
        </g>
        
        <ellipse cx="50" cy="98" rx="22" ry="4" fill="black" style={{ animation: 'hf-shadow 1.8s cubic-bezier(0.4,0,0.2,1) infinite' }} />
      </svg>
      <div style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {anim.replace('hf-', '')} pattern active
      </div>
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
  const [visualMode, setVisualMode] = useState<'hologram' | 'illustration' | 'motion' | 'youtube'>('hologram')

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (selected) {
        if (e.key === 'Enter') {
          e.preventDefault()
          save()
        }
        if (e.key === 'Escape') {
          setSelected(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [selected, sets, reps, weight, duration])

  const results = query.length > 0
    ? allExercises.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || (e.muscle ?? '').toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  const todayLog = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())

  const generateShareCard = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background
    ctx.fillStyle = '#f8f9f5' // var(--clr-bg)
    ctx.fillRect(0, 0, 600, 800)
    
    // Gradient accent
    const grad = ctx.createLinearGradient(0, 0, 600, 400)
    grad.addColorStop(0, '#50a19b') // var(--clr-accent)
    grad.addColorStop(1, '#72b1ac')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 600, 320)

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 54px Fraunces, serif'
    ctx.fillText('WORKOUT DONE', 40, 110)
    
    ctx.font = '22px Instrument Sans, sans-serif'
    ctx.fillText(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase(), 40, 150)

    // Stats box
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 40
    
    // Manual RoundRect for older engines
    const x = 40, y = 220, w = 520, h = 520, radius = 24
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0

    // Exercises
    ctx.fillStyle = '#1e1e1e'
    ctx.font = 'bold 36px Fraunces, serif'
    ctx.fillText('Session Summary', 80, 300)

    const logs = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())
    logs.slice(0, 6).forEach((w, i) => {
      const rowY = 370 + (i * 65)
      ctx.fillStyle = '#1e1e1e'
      ctx.font = '700 22px Instrument Sans, sans-serif'
      ctx.fillText(w.exercise, 80, rowY)
      
      ctx.fillStyle = '#6e6e6e'
      ctx.font = '16px Instrument Sans, sans-serif'
      ctx.fillText(w.detail, 80, rowY + 25)
    })

    if (logs.length > 6) {
      ctx.fillStyle = '#a0a0a0'
      ctx.font = 'italic 18px Instrument Sans, sans-serif'
      ctx.fillText(`+ ${logs.length - 6} more exercises`, 80, 710)
    }

    // Logo/Branding
    ctx.fillStyle = '#50a19b'
    ctx.font = 'bold 28px Instrument Sans, sans-serif'
    ctx.fillText('Workout Buddy', 40, 775)

    // Download
    const link = document.createElement('a')
    link.download = `workout-buddy-${todayKey()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('Achievement card generated! 📸')
  }

  const save = () => {
    if (!selected) return
    const allLogs = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
    const prs = store.get<Record<string, number>>(KEYS.PERSONAL_RECORDS, {})
    
    const prevBest = prs[selected.name] ?? 0
    const isPR = !selected.isTime && weight > 0 && weight > prevBest

    if (isPR) {
      prs[selected.name] = weight
      store.set(KEYS.PERSONAL_RECORDS, prs)
    }

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
    
    if (isPR) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/success-fanfare-trumpets-610.wav')
      audio.volume = 0.3
      audio.play().catch(() => {})
      launchConfetti()
    }
  }

  const quickAdd = (name: string) => {
    const ex = allExercises.find(e => e.name === name)
    if (ex) { setSelected(ex); setQuery('') }
  }

  return (
    <div style={{ paddingTop: 'var(--sp-4)' }}>
      {selected && (
        <div style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', marginBottom: 'var(--sp-6)', boxShadow: 'var(--sh-lg)' }}>
          
          {/* Visual Mode Selector */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)', background: 'var(--clr-surface-2)', padding: '4px', borderRadius: 'var(--r-md)' }}>
            {[
              { id: 'hologram', label: 'Hologram', emoji: '✨' },
              { id: 'illustration', label: 'Plate', emoji: '🎨' },
              { id: 'motion', label: 'Motion', emoji: '🎬' },
              { id: 'youtube', label: 'YouTube', emoji: '📺' },
            ].map(m => (
              <button 
                key={m.id} 
                onClick={() => setVisualMode(m.id as any)}
                style={{ 
                  flex: 1, padding: 'var(--sp-2)', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer',
                  background: visualMode === m.id ? 'var(--clr-surface)' : 'transparent',
                  color: visualMode === m.id ? 'var(--clr-accent)' : 'var(--clr-text-3)',
                  boxShadow: visualMode === m.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>

          {visualMode === 'hologram' && <ExerciseVisual type={selected.type} name={selected.name} />}
          {visualMode === 'illustration' && <WgerImage name={selected.name} />}
          {visualMode === 'motion' && (
            <div style={{ background: 'var(--clr-surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-4)' }}>Target Muscle Map</div>
              <MuscleMap targetMuscle={selected.muscle || selected.type} />
            </div>
          )}
          {visualMode === 'youtube' && (
            <div style={{ padding: 'var(--sp-6)', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>📺</div>
              <h4 style={{ fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>Search "{selected.name}" on YouTube</h4>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.name + ' exercise form')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn--primary btn--sm"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                Open YouTube Search
              </a>
            </div>
          )}

          <h3 className="section-title" style={{ textAlign: 'center', marginTop: 'var(--sp-4)' }}>{selected.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--sp-4)', margin: 'var(--sp-5) 0' }}>
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
          <div style={{ display: 'flex', gap: 'var(--sp-3)', width: '100%' }}>
            <GooeyButton style={{ flex: 2 }} onClick={save} title="Enter to save">Add to Log</GooeyButton>
            <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => setSelected(null)} title="Esc to close">Close</button>
          </div>
          <p style={{ fontSize: '9px', color: 'var(--clr-text-3)', textAlign: 'center', marginTop: 'var(--sp-3)', fontWeight: 600 }}>Tip: Press Enter to log exercise</p>
        </div>
      )}

      <div className="search-bar" style={{ position: 'relative', marginBottom: 'var(--sp-6)' }}>
        <input className="search-bar__input" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search 87+ exercises (e.g. Bench, Squat)…" autoComplete="off" />
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

      {showRestTimer && <RestTimer onDismiss={() => setShowRestTimer(false)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Today's Log</h3>
        {todayLog.length > 0 && (
          <button 
            className="btn btn--ghost btn--sm ripple" 
            onClick={generateShareCard}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', color: 'var(--clr-accent)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-md)' }}
          >
            <span style={{ fontSize: '1.25rem' }}>📸</span> 
            <span style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Share Achievement</span>
          </button>
        )}
      </div>
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
              <div className="workout-entry__meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <span>{w.time}</span>
                <button 
                  onClick={() => {
                    if (!confirm('Delete this entry?')) return
                    const allLogs = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
                    store.set(KEYS.WORKOUTS, allLogs.filter(x => x.id !== w.id))
                    forceUpdate(n => n + 1)
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                >
                  ×
                </button>
              </div>
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
  const [key, setKey] = useState(0)
  const all = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const byDate: Record<string, WorkoutEntry[]> = {}
  all.forEach(w => { (byDate[w.date] ??= []).push(w) })
  const dates = Object.keys(byDate).sort().reverse().slice(0, 14)

  if (!dates.length) return (
    <div className="empty-state"><div className="empty-state__icon">📋</div><p className="empty-state__text">No workout history yet. Start logging!</p></div>
  )

  const deleteEntry = (id: string) => {
    if (!confirm('Delete this entry?')) return
    const allLogs = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
    store.set(KEYS.WORKOUTS, allLogs.filter(x => x.id !== id))
    setKey(k => k + 1)
  }

  return (
    <div key={key} style={{ paddingTop: 'var(--sp-5)' }}>
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
                <div className="workout-entry__meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span>{w.time}</span>
                  <button onClick={() => deleteEntry(w.id)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', fontSize: '14px', padding: '4px' }}>×</button>
                </div>
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

