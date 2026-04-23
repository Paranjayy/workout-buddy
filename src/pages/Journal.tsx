import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid } from '../utils/time'
import { useToast } from '../hooks/useToast'
import type { WorkoutEntry } from '../types'

interface JournalEntry {
  id: string
  date: string
  mood: number
  note: string
  energy: number
}

const MOODS = ['😞', '😕', '😐', '🙂', '😄']
const ENERGY = ['💤', '😴', '⚡', '🔥', '⚡🔥']

export function Journal() {
  const { showToast } = useToast()
  const [entries, setEntries] = useState<JournalEntry[]>(() => store.get<JournalEntry[]>(KEYS.JOURNAL, []))
  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [note, setNote] = useState('')
  const todayEntry = entries.find(e => e.date === todayKey())
  const todayWorkouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, []).filter(w => w.date === todayKey())

  const save = () => {
    const entry: JournalEntry = { id: uid(), date: todayKey(), mood, energy, note }
    const next = [...entries.filter(e => e.date !== todayKey()), entry].sort((a, b) => b.date.localeCompare(a.date))
    store.set(KEYS.JOURNAL, next)
    setEntries(next)
    showToast('Journal entry saved ✓')
    setNote('')
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">REFLECT</p>
        <h1 className="page-header__title">Wellness Journal</h1>
      </div>

      <div style={{ maxWidth: 600, marginBottom: 'var(--sp-7)' }}>
        <h2 className="section-title">How are you feeling today?</h2>

        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <label className="form-label" style={{ marginBottom: 'var(--sp-3)', display: 'block' }}>Mood</label>
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => setMood(i + 1)} style={{
                fontSize: '1.8rem', padding: 'var(--sp-2)', borderRadius: 'var(--r-sm)',
                border: `2px solid ${mood === i + 1 ? 'var(--clr-accent)' : 'transparent'}`,
                background: mood === i + 1 ? 'var(--clr-accent-l)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{m}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <label className="form-label" style={{ marginBottom: 'var(--sp-3)', display: 'block' }}>Energy Level</label>
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            {ENERGY.map((e, i) => (
              <button key={i} onClick={() => setEnergy(i + 1)} style={{
                fontSize: '1.5rem', padding: 'var(--sp-2)', borderRadius: 'var(--r-sm)',
                border: `2px solid ${energy === i + 1 ? 'var(--clr-amber)' : 'transparent'}`,
                background: energy === i + 1 ? 'oklch(88% 0.06 75 / 0.3)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{e}</button>
            ))}
          </div>
        </div>

        {todayWorkouts.length > 0 && (
          <div style={{ marginBottom: 'var(--sp-4)', padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)', background: 'var(--clr-accent-l)', fontSize: 'var(--fs-sm)', color: 'var(--clr-accent-d)' }}>
            💪 You worked out today! {todayWorkouts.length} exercise{todayWorkouts.length !== 1 ? 's' : ''} logged.
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            rows={4}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="How was your workout? What did you eat? Any wins or struggles today?"
            style={{ resize: 'vertical', fontFamily: 'var(--ff-body)' }}
          />
        </div>
        <button className="btn btn--primary" onClick={save}>Save Entry</button>
      </div>

      {entries.length > 0 && (
        <div>
          <h2 className="section-title">Past Entries</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {entries.slice(0, 14).map(e => (
              <div key={e.id} style={{ padding: 'var(--sp-4) var(--sp-5)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: e.note ? 'var(--sp-3)' : 0 }}>
                  <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem' }}>{MOODS[e.mood - 1]}</span>
                    <span style={{ fontSize: '1.1rem' }}>{ENERGY[e.energy - 1]}</span>
                  </div>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{e.date}</span>
                </div>
                {e.note && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-2)', margin: 0, lineHeight: 1.6 }}>{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
