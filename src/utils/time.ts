// Time & date utilities

import type { LifeProgress } from '../types'

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Late night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function dayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

function daysInYear(year: number = new Date().getFullYear()): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
}

export function lifeProgress(dobStr: string, lifeExpectancy = 80): LifeProgress {
  const dob = new Date(dobStr)
  const now = new Date()
  const ageMs = now.getTime() - dob.getTime()
  const ageDays = ageMs / 86400000
  const ageYears = ageDays / 365.25
  const totalDays = lifeExpectancy * 365.25
  return {
    ageYears: Math.floor(ageYears * 10) / 10,
    ageDays: Math.floor(ageDays),
    percentLived: Math.min(100, (ageDays / totalDays) * 100),
    daysRemaining: Math.max(0, Math.floor(totalDays - ageDays)),
    weeksRemaining: Math.max(0, Math.floor((totalDays - ageDays) / 7)),
  }
}

export function yearProgress(): number {
  const now = new Date()
  return (dayOfYear(now) / daysInYear(now.getFullYear())) * 100
}

export function monthProgress(): number {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return ((now.getDate() - 1 + now.getHours() / 24) / daysInMonth) * 100
}

export function weekProgress(): number {
  const now = new Date()
  const day = now.getDay()
  return (((day === 0 ? 7 : day) - 1 + now.getHours() / 24) / 7) * 100
}

export function dayProgress(): number {
  const now = new Date()
  return ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100
}

export function quarterProgress(): number {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3)
  const qStart = new Date(now.getFullYear(), q * 3, 1)
  const qEnd = new Date(now.getFullYear(), (q + 1) * 3, 1)
  return ((now.getTime() - qStart.getTime()) / (qEnd.getTime() - qStart.getTime())) * 100
}

export function getLast7Days(): { key: string; label: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
    }
  })
}
