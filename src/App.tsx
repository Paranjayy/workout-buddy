import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { MobileNav } from './components/MobileNav'
import { SearchModal } from './components/SearchModal'

import { Dashboard } from './pages/Dashboard'
import { Workout } from './pages/Workout'
import { Calories } from './pages/Calories'
import { Body } from './pages/Body'
import { Timer } from './pages/Timer'
import { Progress } from './pages/Progress'
import { Calendar } from './pages/Calendar'
import { Music } from './pages/Music'
import { Journal } from './pages/Journal'
import { Achievements } from './pages/Achievements'
import { Digest } from './pages/Digest'
import { Programs } from './pages/Programs'
import { Settings } from './pages/Settings'
import { Habits } from './pages/Habits'

export function App() {
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}
      
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
        <header className="mobile-top-bar">
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--clr-accent)', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>☰</button>
          <span style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 'var(--fs-base)', letterSpacing: '-0.02em', color: 'var(--clr-text)' }}>Workout Buddy</span>
          <button onClick={() => setIsSearchOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--clr-accent)', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>🔍</button>
        </header>

        <main className="main-content" id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/calories" element={<Calories />} />
            <Route path="/body" element={<Body />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/music" element={<Music />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/digest" element={<Digest />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      
      <MobileNav activeView={location.pathname} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
