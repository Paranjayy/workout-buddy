import { useState, useEffect, useCallback } from 'react'
import { store } from '../utils/storage'

type Theme = 'light' | 'dark'

const THEME_KEY = '_theme'

function getInitial(): Theme {
  const saved = store.get<Theme>(THEME_KEY, 'light')
  if (saved === 'dark' || saved === 'light') return saved
  // Respect system preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    store.set(THEME_KEY, theme)
  }, [theme])

  const toggle = useCallback(() => {
    setThemeState(t => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggle }
}
