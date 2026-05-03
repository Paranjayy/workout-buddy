import { Link } from 'react-router-dom'
import type { NavView } from '../types'

interface NavItem {
  id: NavView
  label: string
  icon: string
  path: string
}

const ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠', path: '/' },
  { id: 'workout', label: 'Workout', icon: '🏋️', path: '/workout' },
  { id: 'timer', label: 'Timer', icon: '⏱️', path: '/timer' },
  { id: 'progress', label: 'Growth', icon: '📈', path: '/progress' },
]

export function MobileNav({ activeView }: { activeView: string }) {
  return (
    <nav className="mobile-nav">
      {ITEMS.map(item => {
        const isActive = activeView === item.path
        return (
          <Link 
            key={item.id} 
            to={item.path} 
            className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
          >
            <div className="mobile-nav__icon">
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            </div>
            <span className="mobile-nav__label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
