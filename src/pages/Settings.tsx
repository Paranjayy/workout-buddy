import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { useToast } from '../hooks/useToast'
import type { Profile } from '../types'

export function Settings() {
  const { showToast } = useToast()
  const [profile, setProfile] = useState<Profile>(() => store.get<Profile>(KEYS.PROFILE, {
    name: '', dob: '', height: null, lifeExpectancy: 80,
    calorieGoal: 2000, proteinGoal: 120, carbGoal: 250, fatGoal: 65,
  }))

  const update = (key: keyof Profile, val: string | number | null) => {
    setProfile(p => ({ ...p, [key]: val }))
  }

  const save = () => {
    store.set(KEYS.PROFILE, profile)
    showToast('Settings saved ✓')
  }

  const exportData = () => {
    const data: Record<string, unknown> = {}
    Object.values(KEYS).forEach(k => { data[k] = store.get(k, null) })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `workout-buddy-${new Date().toISOString().slice(0, 10)}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Record<string, unknown>
        Object.entries(data).forEach(([k, v]) => store.set(k, v))
        showToast('Data imported ✓')
        window.location.reload()
      } catch { showToast('Invalid file format') }
    }
    reader.readAsText(file)
  }

  const clearData = () => {
    if (!confirm('Delete ALL your data? This cannot be undone.')) return
    Object.values(KEYS).forEach(k => store.remove(k))
    showToast('All data cleared')
    window.location.reload()
  }

  const queueCount = store.get<unknown[]>(KEYS.FOOD_QUEUE, []).length

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">PREFERENCES</p>
        <h1 className="page-header__title">Settings</h1>
      </div>

      <div style={{ maxWidth: 600 }}>
        <h2 className="section-title">Profile</h2>
        <Field label="Your Name" id="name">
          <input className="form-input" id="name" value={profile.name} placeholder="What should we call you?" onChange={e => update('name', e.target.value)} />
        </Field>
        <Field label="Date of Birth" id="dob" hint="Used for the Life Progress tracker">
          <input className="form-input" id="dob" type="date" value={profile.dob} onChange={e => update('dob', e.target.value)} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <Field label="Life Expectancy (years)" id="life-exp">
            <input className="form-input" id="life-exp" type="number" min={50} max={120} value={profile.lifeExpectancy} onChange={e => update('lifeExpectancy', +e.target.value || 80)} />
          </Field>
          <Field label="Height (cm)" id="height" hint="Used for BMI calculation">
            <input className="form-input" id="height" type="number" value={profile.height ?? ''} placeholder="175" onChange={e => update('height', +e.target.value || null)} />
          </Field>
        </div>

        <h2 className="section-title" style={{ marginTop: 'var(--sp-7)' }}>Nutrition Goals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <Field label="Daily Calories" id="cal"><input className="form-input" id="cal" type="number" value={profile.calorieGoal} onChange={e => update('calorieGoal', +e.target.value || 2000)} /></Field>
          <Field label="Protein (g)" id="protein"><input className="form-input" id="protein" type="number" value={profile.proteinGoal} onChange={e => update('proteinGoal', +e.target.value || 120)} /></Field>
          <Field label="Carbs (g)" id="carbs"><input className="form-input" id="carbs" type="number" value={profile.carbGoal} onChange={e => update('carbGoal', +e.target.value || 250)} /></Field>
          <Field label="Fat (g)" id="fat"><input className="form-input" id="fat" type="number" value={profile.fatGoal} onChange={e => update('fatGoal', +e.target.value || 65)} /></Field>
        </div>

        <button className="btn btn--primary" style={{ marginTop: 'var(--sp-4)' }} onClick={save}>Save Settings</button>

        <h2 className="section-title" style={{ marginTop: 'var(--sp-7)' }}>Data Management</h2>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <button className="btn btn--ghost" onClick={exportData}>📤 Export All Data</button>
          <label className="btn btn--ghost" style={{ cursor: 'pointer' }}>
            📥 Import Data
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </label>
          <button className="btn btn--ghost" style={{ color: 'oklch(55% 0.18 15)' }} onClick={clearData}>🗑️ Clear All Data</button>
        </div>

        <div style={{ marginTop: 'var(--sp-6)', padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Crowdsource Queue</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>
            {queueCount} custom food item{queueCount !== 1 ? 's' : ''} in your local queue.
          </div>
        </div>

        <div style={{ marginTop: 'var(--sp-6)', padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
          <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>About</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', lineHeight: 1.6 }}>
            Workout Buddy v2.0 · React + TypeScript + Vite<br />
            All data stored locally in your browser. No account needed.<br />
            <a href="https://github.com/Paranjayy/workout-buddy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-accent)' }}>View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', marginTop: 'var(--sp-1)', marginBottom: 0 }}>{hint}</p>}
    </div>
  )
}
