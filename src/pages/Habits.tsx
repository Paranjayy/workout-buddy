import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { todayKey, uid } from '../utils/time'
import type { Habit } from '../types'

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Meditation', emoji: '🧘', color: 'oklch(62% 0.14 240)', logs: {} },
  { id: '2', name: 'Read 20 min', emoji: '📚', color: 'oklch(72% 0.16 75)', logs: {} },
  { id: '3', name: 'Cold Shower', emoji: '🚿', color: 'oklch(55% 0.18 155)', logs: {} },
]

function HabitGrid({ habit, onToggle }: { habit: Habit, onToggle: (date: string) => void }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  return (
    <div className="glass-card" style={{ padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{ fontSize: '1.25rem' }}>{habit.emoji}</span>
          <span style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{habit.name}</span>
        </div>
        <button 
          className={`btn btn--sm ripple ${habit.logs[todayKey()] ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => onToggle(todayKey())}
        >
          {habit.logs[todayKey()] ? 'Done' : 'Mark Done'}
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
        {days.map(date => (
          <div 
            key={date}
            style={{ 
              width: 12, height: 12, borderRadius: '2px',
              background: habit.logs[date] ? habit.color : 'var(--clr-surface-2)',
              opacity: habit.logs[date] ? 1 : 0.3,
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
            title={date}
            onClick={() => onToggle(date)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}
      </div>
    </div>
  )
}

export function Habits() {
  const [habits, setHabits] = useState<Habit[]>(() => store.get<Habit[]>(KEYS.HABITS, DEFAULT_HABITS))
  const [showAdd, setShowAdd] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')

  const toggleHabit = (id: string, date: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const logs = { ...h.logs }
        if (logs[date]) delete logs[date]
        else logs[date] = true
        return { ...h, logs }
      }
      return h
    })
    setHabits(updated)
    store.set(KEYS.HABITS, updated)
  }

  const addHabit = () => {
    if (!newHabitName) return
    const h: Habit = {
      id: uid(),
      name: newHabitName,
      emoji: '✨',
      color: 'var(--clr-accent)',
      logs: {}
    }
    const updated = [...habits, h]
    setHabits(updated)
    store.set(KEYS.HABITS, updated)
    setNewHabitName('')
    setShowAdd(false)
  }

  const deleteHabit = (id: string) => {
    if (!confirm('Delete this habit?')) return
    const updated = habits.filter(h => h.id !== id)
    setHabits(updated)
    store.set(KEYS.HABITS, updated)
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">CONSISTENCY</p>
        <h1 className="page-header__title">Habit Tracker</h1>
      </div>

      <div style={{ marginBottom: 'var(--sp-7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Daily Disciplines</h2>
          <button className="btn btn--primary btn--sm ripple" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? 'Cancel' : '+ Add Habit'}
          </button>
        </div>

        {showAdd && (
          <div className="glass-card" style={{ marginBottom: 'var(--sp-5)', padding: 'var(--sp-5)', borderRadius: 'var(--r-lg)', display: 'flex', gap: 'var(--sp-3)' }}>
            <input 
              className="form-input" 
              placeholder="Habit name (e.g. Morning Walk)..." 
              value={newHabitName} 
              onChange={e => setNewHabitName(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            <button className="btn btn--primary" onClick={addHabit}>Create</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-5)' }}>
          {habits.map(h => (
            <div key={h.id} style={{ position: 'relative' }}>
              <HabitGrid habit={h} onToggle={(date) => toggleHabit(h.id, date)} />
              <button 
                onClick={() => deleteHabit(h.id)}
                style={{ position: 'absolute', top: '-8px', right: '-8px', width: 24, height: 24, borderRadius: '50%', background: 'var(--clr-rose)', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: 'var(--sp-6)', borderRadius: 'var(--r-xl)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>🌊</div>
        <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)' }}>The Ripple Effect</h3>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', maxWidth: 480, margin: '0 auto' }}>
          "Success is the sum of small efforts, repeated day in and day out." — Robert Collier
        </p>
      </div>
    </div>
  )
}
