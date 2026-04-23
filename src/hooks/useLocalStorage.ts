import { useState, useCallback } from 'react'
import { store } from '../utils/storage'

/** Generic persisted state hook backed by localStorage */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => store.get<T>(key, initialValue))

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val
      store.set(key, next)
      return next
    })
  }, [key])

  return [state, setValue]
}
