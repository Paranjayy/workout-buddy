# 🗺️ Workout Buddy — Roadmap

> The trajectory for turning Workout Buddy into a full lifestyle OS.

---

## ✅ Shipped (v2.0)

- [x] React 19 + TypeScript + Vite migration
- [x] 15-page app with professional UI/UX
- [x] Dark mode (OKLCH tokens, system preference)
- [x] 150+ global food database with quantity multiplier
- [x] 64 exercises across 4 categories
- [x] TDEE calculator & weight loss/gain planner
- [x] Achievements system (21 badges, 5 categories)
- [x] Weekly Digest with 4-week analytics
- [x] Speaking Activity Timer with flags + session stats
- [x] Custom Program Builder
- [x] Muscle Activity Heatmap (30-day)
- [x] Warm-up & Cool-down routines
- [x] Water tracker with 7-day chart
- [x] PWA support (installable)
- [x] Vercel CI/CD + GitHub Pages redirect
- [x] Data export/import (JSON backup)
- [x] Journal with entries
- [x] YouTube playlist integration

---

## 🔜 Next Up (v2.1)

### 📅 Calendar Integration
- Google Calendar OAuth for availability awareness
- Auto-suggest workout windows based on free time
- Sync workout completions as calendar events
- Block time for meal prep, rest days

### 🤖 Telegram Bot Integration
- `/log chest press 80kg 4x10` — log workouts from Telegram
- `/water +1` — quick water logging
- `/stats` — today's dashboard summary
- `/weight 72.5` — log weight on the go
- Daily morning briefing: yesterday's summary, today's plan
- Weekly digest delivered as Telegram message
- Streak alerts and motivation quotes

### ⏰ Time Tracker
- Pomodoro-style focus timer for workout sessions
- Track total time spent working out per week/month
- "Active minutes" metric like Apple Watch
- Integration with existing timer for auto-tracking

---

## 🔮 Future (v3.0)

### 🔄 Cloud Sync
- Firebase or Supabase backend
- Multi-device sync (phone ↔ laptop)
- Shared household tracking
- Data never lost (currently localStorage only)

### 📊 Advanced Analytics
- Monthly/yearly progress reports
- Exercise volume trends (sets × reps × weight)
- Calorie surplus/deficit streaks
- Body composition estimation over time
- Personal Best (PB) tracking per exercise
- Correlation analysis: sleep vs performance

### 🍽️ Meal Plan Builder
- Weekly meal plan timetable
- Auto-generate plans based on calorie/macro goals
- Recipe suggestions from food database
- Shopping list generator
- Meal prep scheduling

### 🏋️ Workout Plan AI
- Auto-adjust plans based on progress
- Deload week suggestions
- Volume tracking with fatigue management
- Exercise substitution recommendations

### 📱 Mobile App
- React Native or Capacitor wrapper
- Offline-first with sync
- Push notifications for reminders
- Widget for home screen stats

### 🔔 Notifications
- Web Notification API for timer alerts
- Daily reminder to log meals
- Streak-at-risk warnings
- Hydration reminders throughout the day

### 🎮 Social & Gamification
- Streak freeze tokens (earned via consistency)
- XP system with levels
- Weekly challenges
- Anonymous leaderboards (opt-in)

### 🏥 Health Integration
- Apple Health / Google Fit data import
- Heart rate zones for cardio
- Sleep tracking correlation
- Step counter from device sensors

---

## 💡 Experimental Ideas

- Voice-controlled workout logging ("Hey Buddy, log bench press 80kg")
- AI meal recognition from food photos
- AR exercise form checker
- Wearable device integration (Mi Band, Fitbit)
- Community recipe sharing
- Workout buddy matching (find training partners)

---

## 🏗️ Architecture Notes

When implementing cloud sync:
```
Current: localStorage → store.ts → components
Future:  Supabase/Firebase → sync layer → store.ts → components
```

The storage abstraction in `src/utils/storage.ts` is designed to be swapped — all data access goes through `store.get()` / `store.set()` / `store.push()`, so migrating from localStorage to a DB is a single-file change.

For Telegram, the bot would run as a separate Node.js service that reads/writes to the same Supabase DB, keeping everything in sync.

---

*Last updated: April 2026*
