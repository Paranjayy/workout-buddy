import { useState } from 'react'
import { store, KEYS } from '../utils/storage'
import { todayKey } from '../utils/time'
import type { WorkoutEntry } from '../types'

interface CalendarEvent { summary: string; dtstart: string }

function parseICS(text: string): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const blocks = text.split('BEGIN:VEVENT')
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0]
    const summary = (block.match(/SUMMARY:(.*)/)?.[1] ?? '').trim()
    const dtstart = (block.match(/DTSTART[^:]*:(.*)/)?.[1] ?? '').trim()
    if (summary) events.push({ summary, dtstart })
  }
  return events
}

export function Calendar() {
  const now = new Date()
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(todayKey())
  const [icsEvents, setIcsEvents] = useState<CalendarEvent[]>([])
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])

  const nav = (dir: number) => {
    setViewMonth(m => {
      const nm = m + dir
      if (nm < 0) { setViewYear(y => y - 1); return 11 }
      if (nm > 11) { setViewYear(y => y + 1); return 0 }
      return nm
    })
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const today = todayKey()

  const workoutByDate = workouts.reduce((acc, w) => {
    (acc[w.date] ??= []).push(w)
    return acc
  }, {} as Record<string, WorkoutEntry[]>)

  const monthWorkouts = workouts.filter(w => w.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`))
  const activeDays = new Set(monthWorkouts.map(w => w.date)).size

  const handleICS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setIcsEvents(parseICS(ev.target?.result as string))
    reader.readAsText(file)
  }

  const selectedWorkouts = selectedDate ? workoutByDate[selectedDate] ?? [] : []

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">SCHEDULE</p>
        <h1 className="page-header__title">Calendar</h1>
      </div>

      <div className="cal-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-8)', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-5)' }}>
            <button className="btn btn--ghost btn--sm" onClick={() => nav(-1)}>← Prev</button>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 600 }}>{monthName}</h2>
            <button className="btn btn--ghost btn--sm" onClick={() => nav(1)}>Next →</button>
          </div>

          <div className="cal-grid" style={{ marginBottom: 'var(--sp-6)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="cal-day-header">{d}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => <div key={`pad-${i}`} className="cal-day" />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
              const dayWorkouts = workoutByDate[dateStr] ?? []
              const hasWorkout = dayWorkouts.length > 0
              const isSelected = selectedDate === dateStr
              
              return (
                <div 
                  key={d} 
                  onClick={() => setSelectedDate(dateStr)}
                  className={`cal-day${dateStr === today ? ' cal-day--today' : ''}${hasWorkout ? ' cal-day--has-workout' : ''}${isSelected ? ' cal-day--selected' : ''}`}
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>{d}</span>
                  {hasWorkout && (
                    <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2px' }}>
                      {Array.from(new Set(dayWorkouts.map(w => w.type))).slice(0, 3).map((t, idx) => (
                        <div key={idx} style={{ width: '4px', height: '4px', borderRadius: '50%', background: t === 'cardio' ? 'var(--clr-rose)' : t === 'yoga' ? 'var(--clr-sky)' : 'var(--clr-accent)' }} />
                      ))}
                    </div>
                  )}
                  {isSelected && <div style={{ position: 'absolute', inset: '4px', border: '2px solid var(--clr-accent)', borderRadius: 'var(--r-sm)', zIndex: 1 }} />}
                </div>
              )
            })}
          </div>

          <div className="stats-row">
            <div className="stat-block stat-block--accent">
              <div className="stat-block__label">Monthly Sessions</div>
              <div className="stat-block__value">{monthWorkouts.length}</div>
            </div>
            <div className="stat-block stat-block--sky">
              <div className="stat-block__label">Active Days</div>
              <div className="stat-block__value">{activeDays}</div>
            </div>
            <div className="stat-block stat-block--amber">
              <div className="stat-block__label">Consistency</div>
              <div className="stat-block__value">{daysInMonth > 0 ? Math.round((activeDays / daysInMonth) * 100) : 0}%</div>
            </div>
          </div>
        </div>

        {/* Day Detail Sidebar */}
        <div className="cal-sidebar" style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)', minHeight: '400px' }}>
          <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-base)', fontWeight: 700, marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span>📅</span> {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }) : 'Select a date'}
          </h3>

          {selectedWorkouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8) 0', color: 'var(--clr-text-3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>🌿</div>
              <p style={{ fontSize: 'var(--fs-sm)' }}>No activity recorded for this day.</p>
              <button className="btn btn--ghost btn--sm" style={{ marginTop: 'var(--sp-4)' }} onClick={() => window.location.href='/workout'}>Log Workout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {selectedWorkouts.map(w => (
                <div key={w.id} style={{ padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-lg)', background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{w.exercise}</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--clr-text-3)' }}>{w.time}</span>
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)' }}>{w.detail}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'var(--sp-8)', paddingTop: 'var(--sp-6)', borderTop: '1px dashed var(--clr-border)' }}>
            <h4 style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-3)' }}>Import Calendar</h4>
            <label className="btn btn--ghost btn--sm" style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>
              📁 Import .ics
              <input type="file" accept=".ics" style={{ display: 'none' }} onChange={handleICS} />
            </label>
            {icsEvents.length > 0 && <p style={{ fontSize: '10px', color: 'var(--clr-accent)', marginTop: 'var(--sp-2)', textAlign: 'center' }}>{icsEvents.length} events loaded ✓</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
