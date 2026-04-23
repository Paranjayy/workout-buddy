// LocalStorage helpers with namespacing

const PREFIX = 'wb_';

export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage full or unavailable', e);
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  // Append to an array stored at key
  push(key, item) {
    const arr = this.get(key, []);
    arr.push(item);
    this.set(key, arr);
    return arr;
  },

  // Update item in array by id
  updateById(key, id, updates) {
    const arr = this.get(key, []);
    const idx = arr.findIndex(i => i.id === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...updates };
      this.set(key, arr);
    }
    return arr;
  },

  // Remove item from array by id
  removeById(key, id) {
    const arr = this.get(key, []).filter(i => i.id !== id);
    this.set(key, arr);
    return arr;
  },
};

// Keys used in the app
export const KEYS = {
  PROFILE: 'profile',
  WORKOUTS: 'workouts',
  MEALS: 'meals',
  CUSTOM_FOODS: 'custom_foods',
  FOOD_QUEUE: 'food_queue',  // crowdsource queue
  CUSTOM_PLAYLISTS: 'custom_playlists',
};
