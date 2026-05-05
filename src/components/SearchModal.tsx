import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { store, KEYS } from '../utils/storage'
import { EXERCISES, getAllExercises } from '../data/exercises'
import { TEMPLATES } from '../data/templates'
import { FOOD_DB } from '../data/foods'

interface SearchResult {
  id: string
  type: 'page' | 'exercise' | 'template'
  title: string
  subtitle: string
  icon: string
  action: () => void
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  const pages = [
    { id: 'dash', title: 'Dashboard', icon: '🏠', path: '/' },
    { id: 'work', title: 'Workout', icon: '🏋️', path: '/workout' },
    { id: 'nutr', title: 'Nutrition', icon: '🥗', path: '/nutrition' },
    { id: 'prog', title: 'Progress', icon: '📈', path: '/progress' },
    { id: 'time', title: 'Timer', icon: '⏱️', path: '/timer' },
    { id: 'calc', title: 'Calculators', icon: '🧮', path: '/calculators' },
    { id: 'body', title: 'Body Metrics', icon: '⚖️', path: '/body' },
    { id: 'habits', title: 'Habits', icon: '✨', path: '/habits' },
    { id: 'set', title: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  const results: SearchResult[] = []

  if (query.trim()) {
    const q = query.toLowerCase()
    
    // Pages
    pages.forEach(p => {
      if (p.title.toLowerCase().includes(q)) {
        results.push({
          id: p.id,
          type: 'page',
          title: p.title,
          subtitle: 'Navigation',
          icon: p.icon,
          action: () => { navigate(p.path === '/nutrition' ? '/calories' : p.path); onClose() }
        })
      }
    })

    // Exercises
    getAllExercises().forEach(e => {
      if (e.name.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          type: 'exercise',
          title: e.name,
          subtitle: `${e.type.charAt(0).toUpperCase() + e.type.slice(1)} · ${e.equipment || 'Bodyweight'}`,
          icon: '💪',
          action: () => { navigate('/workout'); onClose() }
        })
      }
    })

    // Foods
    FOOD_DB.forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        results.push({
          id: `food-${f.name}`,
          type: 'template', // Use template style for foods
          title: f.name,
          subtitle: `${f.cal} kcal · ${f.protein}p · ${f.region}`,
          icon: '🥗',
          action: () => { navigate('/calories'); onClose() }
        })
      }
    })

    // Habits
    const habits = store.get<any[]>(KEYS.HABITS, [])
    habits.forEach(h => {
      if (h.name.toLowerCase().includes(q)) {
        results.push({
          id: `habit-${h.id}`,
          type: 'template',
          title: h.name,
          subtitle: 'Habit Tracker',
          icon: h.emoji || '✨',
          action: () => { navigate('/habits'); onClose() }
        })
      }
    })

    // Past Workouts (History)
    const history = store.get<any[]>(KEYS.WORKOUTS, [])
    history.slice(-50).forEach(w => {
      if (w.exercise.toLowerCase().includes(q)) {
        results.push({
          id: `hist-${w.id}`,
          type: 'template',
          title: w.exercise,
          subtitle: `Logged on ${w.date} · ${w.detail}`,
          icon: '🕒',
          action: () => { navigate('/workout'); onClose() }
        })
      }
    })

    // Templates
    TEMPLATES.forEach(t => {
      if (t.name.toLowerCase().includes(q)) {
        results.push({
          id: t.id,
          type: 'template',
          title: t.name,
          subtitle: t.description,
          icon: '📋',
          action: () => { store.set('_active_template', t); navigate('/workout'); onClose() }
        })
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            ref={inputRef}
            className="search-input" 
            placeholder="Search exercises, templates, or pages..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, results.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
              if (e.key === 'Enter') { e.preventDefault(); results[idx]?.action() }
            }}
          />
          <span className="search-kbd">ESC</span>
        </div>

        <div className="search-results">
          {query.trim() === '' ? (
            <div className="search-empty">
              <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>⚡</div>
              <div style={{ fontWeight: 600 }}>Quick Actions</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', marginTop: 'var(--sp-2)' }}>
                Type to find anything in Workout Buddy
              </div>
              <div className="search-quick-grid">
                {pages.slice(0, 4).map(p => (
                  <button key={p.id} className="search-quick-item" onClick={() => { navigate(p.path); onClose() }}>
                    <span>{p.icon}</span> {p.title}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            results.slice(0, 8).map((r, i) => (
              <button 
                key={r.id} 
                className={`search-result-item ${i === idx ? 'search-result-item--active' : ''}`} 
                onClick={r.action}
                onMouseEnter={() => setIdx(i)}
              >
                <span className="result-icon">{r.icon}</span>
                <div className="result-info">
                  <div className="result-title">{r.title}</div>
                  <div className="result-subtitle">{r.subtitle}</div>
                </div>
                <div className="result-type">{r.type}</div>
              </button>
            ))
          ) : (
            <div className="search-empty">No results found for "{query}"</div>
          )}
        </div>
      </div>

      <style>{`
        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          justify-content: center;
          padding-top: 15vh;
        }
        .search-modal {
          width: 90%;
          max-width: 600px;
          background: var(--clr-surface);
          border: 1px solid var(--clr-border);
          border-radius: var(--r-xl);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          overflow: hidden;
          animation: search-slide 0.2s var(--ease-out);
        }
        @keyframes search-slide {
          from { transform: translateY(-20px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          padding: var(--sp-4) var(--sp-5);
          border-bottom: 1px solid var(--clr-border);
          gap: var(--sp-3);
        }
        .search-icon { font-size: 1.25rem; opacity: 0.5 }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--clr-text);
          font-size: var(--fs-lg);
          font-family: inherit;
          outline: none;
        }
        .search-kbd {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 8px;
          background: var(--clr-surface-2);
          border: 1px solid var(--clr-border);
          border-radius: 4px;
          color: var(--clr-text-3);
        }
        .search-results {
          max-height: 400px;
          overflow-y: auto;
          padding: var(--sp-2);
        }
        .search-result-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--sp-4);
          padding: var(--sp-3) var(--sp-4);
          border-radius: var(--r-lg);
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition: all 0.1s;
        }
        .search-result-item:hover, .search-result-item--active {
          background: var(--clr-accent-l);
        }
        .search-result-item--active {
          box-shadow: inset 2px 0 0 var(--clr-accent);
        }
        .result-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--r-md);
          background: var(--clr-surface-2);
          display: grid;
          place-items: center;
          font-size: 1.25rem;
        }
        .result-info { flex: 1 }
        .result-title { font-weight: 600; font-size: var(--fs-sm) }
        .result-subtitle { font-size: var(--fs-xs); color: var(--clr-text-3) }
        .result-type {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--clr-text-3);
          background: var(--clr-surface-2);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .search-empty {
          padding: var(--sp-8) var(--sp-4);
          text-align: center;
          color: var(--clr-text-3);
          font-size: var(--fs-sm);
        }
        .search-quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--sp-2);
          margin-top: var(--sp-5);
        }
        .search-quick-item {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-3);
          background: var(--clr-surface-2);
          border: 1px solid var(--clr-border);
          border-radius: var(--r-md);
          color: var(--clr-text);
          font-size: var(--fs-xs);
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
