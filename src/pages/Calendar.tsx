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
  const [icsEvents, setIcsEvents] = useState<CalendarEvent[]>([])
  const workouts = store.get<WorkoutEntry[]>(KEYS.WORKOUTS, [])
  const workoutDates = new Set(workouts.map(w => w.date))

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

  const monthWorkouts = workouts.filter(w => w.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`))
  const activeDays = new Set(monthWorkouts.map(w => w.date)).size

  const handleICS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setIcsEvents(parseICS(ev.target?.result as string))
    reader.readAsText(file)
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">SCHEDULE</p>
        <h1 className="page-header__title">Calendar</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-5)' }}>
        <button className="btn btn--ghost btn--sm" onClick={() => nav(-1)}>← Prev</button>
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'var(--fs-lg)', fontWeight: 600 }}>{monthName}</h2>
        <button className="btn btn--ghost btn--sm" onClick={() => nav(1)}>Next →</button>
      </div>

      <div className="cal-grid" style={{ marginBottom: 'var(--sp-5)' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={`pad-${i}`} className="cal-day" />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          return (
            <div key={d} className={`cal-day${dateStr === today ? ' cal-day--today' : ''}${workoutDates.has(dateStr) ? ' cal-day--has-workout' : ''}`}>
              {d}
            </div>
          )
        })}
      </div>

      <div className="stats-row" style={{ marginBottom: 'var(--sp-7)' }}>
        <div className="stat-block stat-block--accent">
          <div className="stat-block__label">Workouts This Month</div>
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

      <div>
        <h3 className="section-title">Calendar Import</h3>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-4)' }}>
          Import your calendar (.ics) to see events alongside your workout schedule.
        </p>
        <label className="btn btn--ghost btn--sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
          📁 Import .ics File
          <input type="file" accept=".ics" style={{ display: 'none' }} onChange={handleICS} />
        </label>
        {icsEvents.length > 0 && (
          <div style={{ marginTop: 'var(--sp-4)' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 'var(--sp-3)' }}>
              {icsEvents.length} imported events
            </h4>
            <div className="workout-list">
              {icsEvents.slice(0, 10).map((ev, i) => (
                <div key={i} className="workout-entry">
                  <div className="workout-entry__icon" style={{ background: 'var(--clr-sky-l)' }}>📅</div>
                  <div>
                    <div className="workout-entry__name">{ev.summary}</div>
                    <div className="workout-entry__detail">{ev.dtstart}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
