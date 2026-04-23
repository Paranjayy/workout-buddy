import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid, getLast7Days } from '../utils/time'
import type { WeightEntry, Profile } from '../types'

export function Body() {
  const [tab, setTab] = useState<'water' | 'weight'>('water')
  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">WELLNESS</p>
        <h1 className="page-header__title">Body & Hydration</h1>
      </div>
      <div className="tabs">
        <button className={`tab${tab === 'water' ? ' tab--active' : ''}`} onClick={() => setTab('water')}>Water</button>
        <button className={`tab${tab === 'weight' ? ' tab--active' : ''}`} onClick={() => setTab('weight')}>Weight</button>
      </div>
      {tab === 'water' ? <WaterTab /> : <WeightTab />}
    </div>
  )
}

function WaterTab() {
  const today = todayKey()
  const [log, setLog] = useState<Record<string, number>>(() => store.get<Record<string, number>>(KEYS.WATER_LOG, {}))
  const glasses = log[today] ?? 0
  const goal = 8

  const update = (delta: number) => {
    const next = { ...log, [today]: Math.max(0, (log[today] ?? 0) + delta) }
    store.set(KEYS.WATER_LOG, next)
    setLog(next)
  }

  const pct = Math.min(100, (glasses / goal) * 100)
  const size = 180
  const radius = size / 2 - 12
  const circ = 2 * Math.PI * radius
  const offset = circ - (circ * pct) / 100
  const days7 = getLast7Days()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-6)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="oklch(90% 0.01 240)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="oklch(62% 0.14 240)" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25,1,0.5,1)' }}/>
        <text x={size/2} y={size/2 - 8} textAnchor="middle" dominantBaseline="central"
          fontFamily="var(--ff-display)" fontSize="28" fontWeight="700" fill="oklch(22% 0.02 60)">{Math.round(pct)}%</text>
        <text x={size/2} y={size/2 + 16} textAnchor="middle" fontFamily="var(--ff-body)" fontSize="12" fill="oklch(50% 0.02 60)">hydrated</text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-2xl)', fontWeight: 700 }}>
          {glasses} <span style={{ fontSize: 'var(--fs-lg)', color: 'var(--clr-text-3)' }}>/ {goal}</span>
        </div>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)' }}>glasses today ({glasses * 250}ml)</div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
        <button className="btn btn--primary" onClick={() => update(1)}>+ Add Glass</button>
        <button className="btn btn--ghost" onClick={() => update(-1)} disabled={glasses === 0}>− Remove</button>
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300 }}>
        {Array.from({ length: goal }, (_, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', fontSize: '1rem',
            background: i < glasses ? 'oklch(62% 0.14 240 / 0.15)' : 'var(--clr-surface-2)',
            border: `1px solid ${i < glasses ? 'oklch(62% 0.14 240 / 0.3)' : 'var(--clr-border)'}`,
          }}>{i < glasses ? '💧' : ''}</div>
        ))}
      </div>
      {glasses >= goal && (
        <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', color: 'var(--clr-accent-d)', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>
          🎉 Hydration goal met! Stay awesome.
        </div>
      )}
      <div style={{ width: '100%', maxWidth: 500, marginTop: 'var(--sp-4)' }}>
        <h3 className="section-title">Last 7 Days</h3>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-end', height: 120 }}>
          {days7.map(d => {
            const count = log[d.key] ?? 0
            const barPct = Math.min(100, (count / goal) * 100)
            return (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-1)' }}>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--clr-text-2)' }}>{count}</span>
                <div style={{ width: '100%', background: 'var(--clr-surface-2)', borderRadius: 'var(--r-sm)', height: 80, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: `${barPct}%`, background: 'oklch(62% 0.14 240)', borderRadius: 'var(--r-sm)', minHeight: count > 0 ? 4 : 0, transition: 'height 0.4s cubic-bezier(0.25,1,0.5,1)' }} />
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{d.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WeightTab() {
  const [log, setLog] = useState<WeightEntry[]>(() => store.get<WeightEntry[]>(KEYS.WEIGHT_LOG, []))
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const [w, setW] = useState('')
  const [h, setH] = useState(profile.height ? String(profile.height) : '')

  const latest = log[log.length - 1]
  const calcBMI = (weight: number, ht: number) => (weight / ((ht / 100) ** 2)).toFixed(1)
  const bmiCat = (bmi: string) => {
    const b = parseFloat(bmi)
    if (b < 18.5) return 'Underweight'; if (b < 25) return 'Normal'; if (b < 30) return 'Overweight'; return 'Obese'
  }

  const save = () => {
    if (!w) return
    if (h) {
      const p = { ...profile, height: +h }
      store.set(KEYS.PROFILE, p)
    }
    const entry: WeightEntry = { id: uid(), date: todayKey(), weight: +w }
    const next = [...log, entry]
    store.set(KEYS.WEIGHT_LOG, next)
    setLog(next)
    setW('')
  }

  const bmi = latest && profile.height ? calcBMI(latest.weight, profile.height) : null
  const trend = log.length >= 2 ? +(log[log.length - 1].weight - log[log.length - 2].weight).toFixed(1) : null

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', maxWidth: 400, marginBottom: 'var(--sp-5)' }}>
        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input className="form-input" type="number" step="0.1" value={w} onChange={e => setW(e.target.value)} placeholder="72.5" />
        </div>
        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input className="form-input" type="number" value={h} onChange={e => setH(e.target.value)} placeholder="175" />
        </div>
      </div>
      <button className="btn btn--primary" onClick={save}>Log Weight</button>

      {latest && (
        <div className="stats-row" style={{ marginTop: 'var(--sp-6)' }}>
          <div className="stat-block stat-block--accent">
            <div className="stat-block__label">Current</div>
            <div className="stat-block__value">{latest.weight} kg</div>
          </div>
          {bmi && (
            <div className="stat-block stat-block--sky">
              <div className="stat-block__label">BMI</div>
              <div className="stat-block__value">{bmi}</div>
              <div className="stat-block__sub">{bmiCat(bmi)}</div>
            </div>
          )}
          {trend !== null && (
            <div className={`stat-block stat-block--${trend <= 0 ? 'accent' : 'rose'}`}>
              <div className="stat-block__label">Trend</div>
              <div className="stat-block__value">{trend > 0 ? '+' : ''}{trend} kg</div>
              <div className="stat-block__sub">since last entry</div>
            </div>
          )}
        </div>
      )}

      {log.length > 0 ? (
        <div style={{ marginTop: 'var(--sp-6)' }}>
          <h3 className="section-title">History</h3>
          <div className="workout-list">
            {[...log].reverse().slice(0, 20).map(entry => (
              <div key={entry.id} className="workout-entry">
                <div className="workout-entry__icon" style={{ background: 'var(--clr-accent-l)' }}>⚖️</div>
                <div>
                  <div className="workout-entry__name">{entry.weight} kg</div>
                  <div className="workout-entry__detail">{entry.date}</div>
                </div>
                {profile.height && <div className="workout-entry__meta">BMI {calcBMI(entry.weight, profile.height)}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: 'var(--sp-6)' }}>
          <div className="empty-state__icon">⚖️</div>
          <p className="empty-state__text">No weight entries yet. Log your weight above.</p>
        </div>
      )}
    </div>
  )
}

