# 🏋️ Workout Buddy

Your personal fitness coach, nutrition tracker, and life dashboard — built with React + TypeScript.

**100% offline. No account. No backend. All data stays in your browser.**

## Features

| Page | What it does |
|------|-------------|
| 📊 **Dashboard** | Time-aware greeting, stats, 90-day activity heatmap, quick-start templates |
| 🏋️ **Workouts** | Exercise library (40+), log sets/reps/weight, 8 pre-built templates, history |
| 🍎 **Nutrition** | 80+ global foods, macro rings, meal categories, custom food queue |
| 💧 **Body & Water** | Water tracker (8-glass goal, 7-day chart), weight log, BMI calculator |
| ⏱️ **Timer** | Rest countdown, stopwatch with laps, Tabata interval timer with audio |
| ⏳ **Life Progress** | Day/week/month/quarter/year/life rings — DOB-driven awareness |
| 📅 **Calendar** | Monthly view with workout dots, consistency %, ICS import |
| 🎵 **Music** | 8 curated YouTube playlists, language filter, bring-your-own-playlist |
| 📝 **Journal** | Mood + energy picker, notes, past entries |
| 🏆 **Achievements** | 21 badges across 5 categories, auto-unlocking, XP progress |
| 📈 **Weekly Digest** | 4-week comparison with trend arrows, stats breakdown |
| ⚙️ **Settings** | Profile, nutrition goals, data export/import/clear |

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **react-router-dom** v7 (BrowserRouter)
- **Vanilla CSS** design system (OKLCH colors, CSS custom properties)
- **LocalStorage** (offline-first, zero backend)
- **Google Fonts** — Fraunces + Instrument Sans

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

## Deployment

The app auto-deploys to **Vercel** on push to `main`. GitHub Pages redirects to Vercel.

```
push to main → CI (typecheck + build) + Vercel deploy + GH Pages redirect
push to PR   → CI gate + Vercel preview URL
```

See [IDEAS.md](./IDEAS.md) for the feature roadmap.

## Project Structure

```
src/
├── App.tsx                    # Router
├── main.tsx                   # Entry
├── style.css                  # Design system
├── types/index.ts             # TypeScript interfaces
├── components/
│   ├── Sidebar.tsx            # Nav (12 items)
│   └── ProgressRing.tsx       # Reusable SVG ring
├── pages/
│   ├── Dashboard.tsx          # Heatmap, stats, templates
│   ├── Workout.tsx            # Log, templates, history, library
│   ├── Calories.tsx           # Macro rings, food search, history
│   ├── Body.tsx               # Water + weight
│   ├── Timer.tsx              # Rest/Stopwatch/Tabata
│   ├── Progress.tsx           # Life rings
│   ├── Calendar.tsx           # Monthly + ICS
│   ├── Music.tsx              # YouTube playlists
│   ├── Journal.tsx            # Mood + notes
│   ├── Achievements.tsx       # 21 badges
│   ├── Digest.tsx             # Weekly summary
│   └── Settings.tsx           # Profile + data
├── data/
│   ├── exercises.ts           # 40+ exercises
│   ├── foods.ts               # 80+ global foods
│   ├── playlists.ts           # 8 curated playlists
│   ├── templates.ts           # 8 workout plans
│   └── achievements.ts        # 21 badge definitions
├── hooks/
│   ├── useLocalStorage.ts     # Persisted state
│   └── useToast.ts            # Notification
└── utils/
    ├── storage.ts             # Typed localStorage
    └── time.ts                # Date/progress utilities
```

## License

MIT
