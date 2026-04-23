import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid, getLast7Days } from '../utils/time'
import type { WeightEntry, Profile } from '../types'

export function Body() {
  const [tab, setTab] = useState<'water' | 'weight' | 'goals'>('water')
  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">WELLNESS</p>
        <h1 className="page-header__title">Body & Hydration</h1>
      </div>
      <div className="tabs">
        <button className={`tab${tab === 'water' ? ' tab--active' : ''}`} onClick={() => setTab('water')}>Water</button>
        <button className={`tab${tab === 'weight' ? ' tab--active' : ''}`} onClick={() => setTab('weight')}>Weight</button>
        <button className={`tab${tab === 'goals' ? ' tab--active' : ''}`} onClick={() => setTab('goals')}>Goals & Plan</button>
      </div>
      {tab === 'water' && <WaterTab />}
      {tab === 'weight' && <WeightTab />}
      {tab === 'goals' && <GoalsTab />}
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
    store.set(KEYS.WATER_LOG, next); setLog(next)
  }
  const pct = Math.min(100, (glasses / goal) * 100)
  const size = 180, radius = size / 2 - 12
  const circ = 2 * Math.PI * radius, offset = circ - (circ * pct) / 100
  const days7 = getLast7Days()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', paddingTop: 'var(--sp-6)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--clr-surface-2)" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--clr-sky)" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25,1,0.5,1)' }}/>
        <text x={size/2} y={size/2-8} textAnchor="middle" dominantBaseline="central"
          fontFamily="var(--ff-display)" fontSize="28" fontWeight="700" fill="var(--clr-text)">{Math.round(pct)}%</text>
        <text x={size/2} y={size/2+16} textAnchor="middle" fontFamily="var(--ff-body)" fontSize="12" fill="var(--clr-text-3)">hydrated</text>
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
          <div key={i} style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', fontSize: '1rem',
            background: i < glasses ? 'var(--clr-sky-l)' : 'var(--clr-surface-2)',
            border: `1px solid ${i < glasses ? 'var(--clr-sky)' : 'var(--clr-border)'}`, opacity: i < glasses ? 1 : 0.4,
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
                  <div style={{ width: '100%', height: `${barPct}%`, background: 'var(--clr-sky)', borderRadius: 'var(--r-sm)', minHeight: count > 0 ? 4 : 0, transition: 'height 0.4s cubic-bezier(0.25,1,0.5,1)' }} />
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
  const bmiCat = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--clr-amber)' }
    if (bmi < 25) return { label: 'Normal', color: 'var(--clr-accent)' }
    if (bmi < 30) return { label: 'Overweight', color: 'var(--clr-amber)' }
    return { label: 'Obese', color: 'var(--clr-rose)' }
  }

  const save = () => {
    if (!w) return
    if (h) store.set(KEYS.PROFILE, { ...profile, height: +h })
    const entry: WeightEntry = { id: uid(), date: todayKey(), weight: +w }
    const next = [...log, entry]
    store.set(KEYS.WEIGHT_LOG, next); setLog(next); setW('')
  }

  const bmi = latest && profile.height ? parseFloat(calcBMI(latest.weight, profile.height)) : null
  const trend = log.length >= 2 ? +(log[log.length - 1].weight - log[log.length - 2].weight).toFixed(1) : null

  // Healthy weight range for this height
  const healthyMin = profile.height ? +(18.5 * (profile.height / 100) ** 2).toFixed(1) : null
  const healthyMax = profile.height ? +(24.9 * (profile.height / 100) ** 2).toFixed(1) : null

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
            {profile.targetWeight && (
              <div className="stat-block__sub">{latest.weight > profile.targetWeight ? `${(latest.weight - profile.targetWeight).toFixed(1)} kg to go` : '🎯 At target!'}</div>
            )}
          </div>
          {bmi !== null && (
            <div className="stat-block stat-block--sky">
              <div className="stat-block__label">BMI</div>
              <div className="stat-block__value" style={{ color: bmiCat(bmi).color }}>{bmi.toFixed(1)}</div>
              <div className="stat-block__sub">{bmiCat(bmi).label}</div>
            </div>
          )}
          {trend !== null && (
            <div className={`stat-block stat-block--${trend <= 0 ? 'accent' : 'rose'}`}>
              <div className="stat-block__label">Trend</div>
              <div className="stat-block__value">{trend > 0 ? '+' : ''}{trend} kg</div>
              <div className="stat-block__sub">since last entry</div>
            </div>
          )}
          {healthyMin !== null && healthyMax !== null && (
            <div className="stat-block stat-block--amber">
              <div className="stat-block__label">Healthy Range</div>
              <div className="stat-block__value">{healthyMin}–{healthyMax}</div>
              <div className="stat-block__sub">kg for {profile.height}cm</div>
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

function GoalsTab() {
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const log = store.get<WeightEntry[]>(KEYS.WEIGHT_LOG, [])
  const latest = log[log.length - 1]
  const [target, setTarget] = useState(profile.targetWeight ? String(profile.targetWeight) : '')
  const [gender, setGender] = useState<'male'|'female'>(profile.gender ?? 'male')
  const [age, setAge] = useState(profile.age ? String(profile.age) : '')
  const [activity, setActivity] = useState(String(profile.activityLevel ?? 1.55))

  const saveGoals = () => {
    const p = { ...profile, targetWeight: target ? +target : null, gender, age: age ? +age : null, activityLevel: +activity }
    store.set(KEYS.PROFILE, p)
  }

  const currentWeight = latest?.weight ?? 0
  const ht = profile.height ?? 175
  const ageNum = +(age || '25')
  const actNum = +activity

  // Mifflin-St Jeor TDEE
  const bmr = gender === 'male'
    ? 10 * currentWeight + 6.25 * ht - 5 * ageNum + 5
    : 10 * currentWeight + 6.25 * ht - 5 * ageNum - 161
  const tdee = Math.round(bmr * actNum)

  const targetW = target ? +target : null
  const diff = targetW && currentWeight ? +(currentWeight - targetW).toFixed(1) : null
  const isLosing = diff !== null && diff > 0

  // Weight loss plan: 0.5 kg/week = 500 cal deficit/day
  const weeksToGoal = diff !== null ? Math.ceil(Math.abs(diff) / 0.5) : null
  const dailyDeficit = 500
  const targetCal = isLosing ? tdee - dailyDeficit : diff !== null && diff < 0 ? tdee + 300 : tdee

  const ACTIVITIES = [
    { val: '1.2', label: 'Sedentary (desk job)' },
    { val: '1.375', label: 'Lightly active (1-3x/week)' },
    { val: '1.55', label: 'Moderately active (3-5x/week)' },
    { val: '1.725', label: 'Very active (6-7x/week)' },
    { val: '1.9', label: 'Athlete (2x/day)' },
  ]

  return (
    <div style={{ paddingTop: 'var(--sp-5)', maxWidth: 600 }}>
      <h2 className="section-title">Body Goals</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <div className="form-group">
          <label className="form-label">Target Weight (kg)</label>
          <input className="form-input" type="number" step="0.1" value={target} onChange={e => setTarget(e.target.value)} placeholder="68" />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select className="form-input" value={gender} onChange={e => setGender(e.target.value as 'male'|'female')}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Age</label>
          <input className="form-input" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" />
        </div>
        <div className="form-group">
          <label className="form-label">Activity Level</label>
          <select className="form-input" value={activity} onChange={e => setActivity(e.target.value)}>
            {ACTIVITIES.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
          </select>
        </div>
      </div>
      <button className="btn btn--primary" onClick={saveGoals} style={{ marginBottom: 'var(--sp-6)' }}>Save Goals</button>

      {currentWeight > 0 && (
        <>
          <h2 className="section-title">Your Plan</h2>
          <div className="stats-row">
            <div className="stat-block stat-block--sky">
              <div className="stat-block__label">BMR</div>
              <div className="stat-block__value">{Math.round(bmr)}</div>
              <div className="stat-block__sub">cal/day at rest</div>
            </div>
            <div className="stat-block stat-block--accent">
              <div className="stat-block__label">TDEE</div>
              <div className="stat-block__value">{tdee}</div>
              <div className="stat-block__sub">cal/day total</div>
            </div>
            <div className="stat-block stat-block--amber">
              <div className="stat-block__label">Target Intake</div>
              <div className="stat-block__value">{targetCal}</div>
              <div className="stat-block__sub">cal/day {isLosing ? '(deficit)' : diff !== null && diff < 0 ? '(surplus)' : ''}</div>
            </div>
          </div>

          {diff !== null && diff !== 0 && (
            <div style={{ padding: 'var(--sp-5)', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', marginBottom: 'var(--sp-6)' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>
                {isLosing ? '🔥 Weight Loss' : '💪 Weight Gain'} Plan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  { label: 'Current weight', value: `${currentWeight} kg` },
                  { label: 'Target weight', value: `${targetW} kg` },
                  { label: isLosing ? 'To lose' : 'To gain', value: `${Math.abs(diff)} kg` },
                  { label: 'Rate', value: isLosing ? '0.5 kg/week (healthy)' : '0.25–0.5 kg/week' },
                  { label: 'Est. time', value: `~${weeksToGoal} weeks (${Math.ceil((weeksToGoal ?? 0) / 4)} months)` },
                  { label: 'Daily calorie target', value: `${targetCal} cal/day` },
                  { label: isLosing ? 'Daily deficit' : 'Daily surplus', value: `${isLosing ? dailyDeficit : 300} cal` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--clr-border)' }}>
                    <span style={{ color: 'var(--clr-text-3)' }}>{r.label}</span>
                    <span style={{ fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--sp-5)', padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-2)' }}>💡 Tips</div>
                <ul style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-2)', paddingLeft: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {isLosing ? (
                    <>
                      <li>Aim for 0.5 kg/week — faster isn't sustainable</li>
                      <li>Protein: 1.6–2.2g per kg bodyweight to preserve muscle</li>
                      <li>Strength train 3–4x/week to maintain lean mass</li>
                      <li>Sleep 7–9 hours — poor sleep increases hunger hormones</li>
                      <li>Track consistently — weekly averages matter more than daily</li>
                    </>
                  ) : (
                    <>
                      <li>Eat 300–500 cal above TDEE for lean gains</li>
                      <li>Protein: 1.6–2.2g per kg bodyweight</li>
                      <li>Progressive overload in training is key</li>
                      <li>Weigh yourself weekly, same time/conditions</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          <div style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-surface-2)', fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', fontStyle: 'italic' }}>
            ⚠️ These are estimates using the Mifflin-St Jeor equation. Individual metabolism varies. Consult a healthcare professional for personalized advice.
          </div>
        </>
      )}

      {currentWeight === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">⚖️</div>
          <p className="empty-state__text">Log your weight in the Weight tab first to see your personalized plan.</p>
        </div>
      )}
    </div>
  )
}
