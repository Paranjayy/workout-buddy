import { useState } from 'react'
import { searchFoods } from '../data/foods'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid } from '../utils/time'
import { useToast } from '../hooks/useToast'
import type { FoodItem, MealEntry, Profile } from '../types'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export function Calories() {
  const [tab, setTab] = useState<'log' | 'history' | 'custom'>('log')
  const { showToast } = useToast()
  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">NUTRITION</p>
        <h1 className="page-header__title">Calorie Tracker</h1>
      </div>
      <div className="tabs">
        {(['log', 'history', 'custom'] as const).map(t => (
          <button key={t} className={`tab${tab === t ? ' tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'log' ? 'Log Meal' : t === 'history' ? 'History' : 'Custom Food'}
          </button>
        ))}
      </div>
      {tab === 'log' && <LogMeal showToast={showToast} />}
      {tab === 'history' && <MealHistory />}
      {tab === 'custom' && <CustomFood showToast={showToast} />}
    </div>
  )
}

function MacroRing({ pct, color, label, val }: { pct: number; color: string; label: string; val: string }) {
  const r = 28, size = 70, circ = 2 * Math.PI * r
  const offset = circ - (circ * Math.min(pct, 100)) / 100
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-1)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--clr-surface-2)" strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25,1,0.5,1)' }}/>
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          fontFamily="var(--ff-display)" fontSize="13" fontWeight="700" fill="var(--clr-text)">{val}</text>
      </svg>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{label}</span>
    </div>
  )
}

function LogMeal({ showToast }: { showToast: (m: string) => void }) {
  const [query, setQuery] = useState('')
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [staged, setStaged] = useState<(FoodItem & { qty: number })[]>([])
  const [, forceUpdate] = useState(0)
  const profile = store.get<Profile>(KEYS.PROFILE, {} as Profile)
  const today = todayKey()

  const todayMeals = store.get<MealEntry[]>(KEYS.MEALS, []).filter(m => m.date === today)
  const allItems = todayMeals.flatMap(m => m.items)
  const stagedTotals = staged.reduce((a, i) => ({ cal: a.cal + Math.round(i.cal * i.qty), protein: a.protein + Math.round(i.protein * i.qty), carbs: a.carbs + Math.round(i.carbs * i.qty), fat: a.fat + Math.round(i.fat * i.qty) }), { cal: 0, protein: 0, carbs: 0, fat: 0 })
  const totals = allItems.reduce((acc, i) => ({ cal: acc.cal + i.cal, protein: acc.protein + i.protein, carbs: acc.carbs + i.carbs, fat: acc.fat + i.fat }), stagedTotals)

  const results = query.length > 1 ? searchFoods(query) : []

  const save = () => {
    if (!staged.length) return
    store.push<MealEntry>(KEYS.MEALS, {
      id: uid(), date: today, type: mealType,
      items: staged.map(f => ({ ...f, cal: Math.round(f.cal * f.qty), protein: Math.round(f.protein * f.qty), carbs: Math.round(f.carbs * f.qty), fat: Math.round(f.fat * f.qty), serving: f.qty !== 1 ? `${f.qty}× ${f.serving ?? '1 serving'}` : (f.serving ?? '1 serving'), entryId: uid() })),
    })
    setStaged([])
    forceUpdate(n => n + 1)
    showToast(`${staged.length} item(s) logged ✓`)
  }

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--sp-6)', padding: 'var(--sp-4) var(--sp-5)', background: 'var(--clr-surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)' }}>
        <MacroRing pct={(totals.cal / (profile.calorieGoal ?? 2000)) * 100} color="oklch(62% 0.2 15)" label="Calories" val={`${totals.cal}`} />
        <MacroRing pct={(totals.protein / (profile.proteinGoal ?? 120)) * 100} color="oklch(55% 0.18 155)" label="Protein" val={`${totals.protein}g`} />
        <MacroRing pct={(totals.carbs / (profile.carbGoal ?? 250)) * 100} color="oklch(72% 0.16 75)" label="Carbs" val={`${totals.carbs}g`} />
        <MacroRing pct={(totals.fat / (profile.fatGoal ?? 65)) * 100} color="oklch(62% 0.14 240)" label="Fat" val={`${totals.fat}g`} />
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(t => (
          <button key={t} className={`btn btn--sm ${mealType === t ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setMealType(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      <div className="search-bar" style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
        <input className="search-bar__input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search 150+ global foods (biryani, sushi, tacos, croissant…)" />
        {results.length > 0 && (
          <div className="food-results" style={{ display: 'block' }}>
            {results.map((f, i) => (
              <div key={i} className="food-result" onClick={() => { setStaged(p => [...p, { ...f, qty: 1 }]); setQuery('') }}>
                <span className="food-item__name">{f.name}</span>
                <span className="food-item__region">{f.region} · {f.serving}</span>
                <span className="food-item__cal">{f.cal} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {staged.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-5)', padding: 'var(--sp-4)', background: 'var(--clr-accent-l)', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-accent-d)' }}>
          <h4 style={{ fontWeight: 600, fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-3)' }}>Staged ({staged.length})</h4>
          {staged.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--fs-xs)', padding: 'var(--sp-2) 0', borderBottom: i < staged.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 70 }}>
                <button onClick={() => setStaged(p => p.map((x, j) => j === i ? { ...x, qty: Math.max(0.25, x.qty - 0.25) } : x))} className="btn btn--ghost btn--sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>−</button>
                <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'center' }}>{f.qty}×</span>
                <button onClick={() => setStaged(p => p.map((x, j) => j === i ? { ...x, qty: x.qty + 0.25 } : x))} className="btn btn--ghost btn--sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>+</button>
              </div>
              <span style={{ flex: 1 }}>{f.name} <span style={{ color: 'var(--clr-text-3)' }}>({f.serving})</span></span>
              <span style={{ fontWeight: 600, minWidth: 50, textAlign: 'right' }}>{Math.round(f.cal * f.qty)}</span>
              <button onClick={() => setStaged(p => p.filter((_, j) => j !== i))} style={{ color: 'var(--clr-rose)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
            </div>
          ))}
          <button className="btn btn--primary btn--sm" style={{ marginTop: 'var(--sp-3)' }} onClick={save}>Save {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</button>
        </div>
      )}

      <h3 className="section-title">Today's Meals</h3>
      {todayMeals.length === 0 ? (
        <div className="empty-state"><div className="empty-state__icon">🍎</div><p className="empty-state__text">No meals logged today. Search above to get started.</p></div>
      ) : (
        <div>
          {todayMeals.map(meal => (
            <div key={meal.id} style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-2)' }}>{meal.type}</div>
              <div className="workout-list">
                {meal.items.map(item => (
                  <div key={item.entryId} className="workout-entry">
                    <div className="workout-entry__icon" style={{ background: 'var(--clr-amber-l)' }}>🍽️</div>
                    <div>
                      <div className="workout-entry__name">{item.name}</div>
                      <div className="workout-entry__detail">{item.region} · {item.serving}</div>
                    </div>
                    <div className="workout-entry__meta">{item.cal} kcal</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MealHistory() {
  const all = store.get<MealEntry[]>(KEYS.MEALS, [])
  const byDate: Record<string, MealEntry[]> = {}
  all.forEach(m => { (byDate[m.date] ??= []).push(m) })
  const dates = Object.keys(byDate).sort().reverse().slice(0, 7)

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      {dates.map(d => {
        const dayMeals = byDate[d]
        const cal = dayMeals.flatMap(m => m.items).reduce((s, i) => s + i.cal, 0)
        return (
          <div key={d} style={{ marginBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--sp-3)' }}>
              <h3 className="section-title" style={{ margin: 0 }}>{d}</h3>
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>{cal} kcal</span>
            </div>
            <div className="workout-list">
              {dayMeals.flatMap(m => m.items).map(item => (
                <div key={item.entryId} className="workout-entry">
                  <div className="workout-entry__icon" style={{ background: 'var(--clr-amber-l)' }}>🍽️</div>
                  <div>
                    <div className="workout-entry__name">{item.name}</div>
                    <div className="workout-entry__detail">{item.region}</div>
                  </div>
                  <div className="workout-entry__meta">{item.cal} kcal</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {dates.length === 0 && <div className="empty-state"><div className="empty-state__icon">📋</div><p className="empty-state__text">No meal history yet.</p></div>}
    </div>
  )
}

function CustomFood({ showToast }: { showToast: (m: string) => void }) {
  const [name, setName] = useState(''), [cal, setCal] = useState(''), [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState(''), [fat, setFat] = useState('')

  const submit = () => {
    if (!name || !cal) return
    const item = { name, cal: +cal, protein: +protein, carbs: +carbs, fat: +fat, region: '🌐 Custom', serving: '1 serving' }
    store.push(KEYS.FOOD_QUEUE, item)
    showToast(`"${name}" added to custom queue ✓`)
    setName(''); setCal(''); setProtein(''); setCarbs(''); setFat('')
  }

  const queue = store.get<FoodItem[]>(KEYS.FOOD_QUEUE, [])

  return (
    <div style={{ paddingTop: 'var(--sp-5)' }}>
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-5)' }}>
        Can't find a food? Add it here. It'll be saved locally and you can use it immediately.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sp-4)', maxWidth: 500, marginBottom: 'var(--sp-4)' }}>
        {[
          { label: 'Food Name *', val: name, set: setName, ph: 'Aloo Tikki', type: 'text' },
          { label: 'Calories (kcal) *', val: cal, set: setCal, ph: '200', type: 'number' },
          { label: 'Protein (g)', val: protein, set: setProtein, ph: '8', type: 'number' },
          { label: 'Carbs (g)', val: carbs, set: setCarbs, ph: '25', type: 'number' },
          { label: 'Fat (g)', val: fat, set: setFat, ph: '10', type: 'number' },
        ].map(f => (
          <div key={f.label} className="form-group">
            <label className="form-label">{f.label}</label>
            <input className="form-input" type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
          </div>
        ))}
      </div>
      <button className="btn btn--primary" onClick={submit}>Add Food</button>

      {queue.length > 0 && (
        <div style={{ marginTop: 'var(--sp-6)' }}>
          <h3 className="section-title">Custom Queue ({queue.length})</h3>
          <div className="workout-list">
            {queue.map((f, i) => (
              <div key={i} className="workout-entry">
                <div className="workout-entry__icon" style={{ background: 'var(--clr-sky-l)' }}>🌐</div>
                <div>
                  <div className="workout-entry__name">{f.name}</div>
                  <div className="workout-entry__detail">{f.protein}g P · {f.carbs}g C · {f.fat}g F</div>
                </div>
                <div className="workout-entry__meta">{f.cal} kcal</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
