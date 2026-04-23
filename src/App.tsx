import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { Workout } from './pages/Workout'
import { Calories } from './pages/Calories'
import { Body } from './pages/Body'
import { Timer } from './pages/Timer'
import { Progress } from './pages/Progress'
import { Calendar } from './pages/Calendar'
import { Music } from './pages/Music'
import { Journal } from './pages/Journal'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
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
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
