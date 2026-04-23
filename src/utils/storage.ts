// LocalStorage helpers with namespacing + TypeScript

const PREFIX = 'wb_'

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.warn('Storage full or unavailable', e)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  push<T>(key: string, item: T): T[] {
    const arr = this.get<T[]>(key, [])
    arr.push(item)
    this.set(key, arr)
    return arr
  },
}

export const KEYS = {
  PROFILE: 'profile',
  WORKOUTS: 'workouts',
  MEALS: 'meals',
  CUSTOM_FOODS: 'custom_foods',
  FOOD_QUEUE: 'food_queue',
  CUSTOM_PLAYLISTS: 'custom_playlists',
  WATER_LOG: 'water_log',
  WEIGHT_LOG: 'weight_log',
  JOURNAL: 'journal',
  ACHIEVEMENTS: 'achievements',
} as const
