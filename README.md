# 🏋️ Workout Buddy

Your personal fitness coach, calorie tracker, and life progress dashboard.

## Features

### 🏋️ Workout Tracker
- Exercise library (40+ exercises: strength, bodyweight, cardio, yoga)
- Log sets, reps, weight, and duration
- Quick-add common exercises
- Workout history with daily breakdown
- **8 pre-built workout templates** (Push/Pull/Legs, Full Body, HIIT, Yoga, Core Blast, 5K Prep)
- One-click template loading

### 🍎 Nutrition Tracker
- **80+ foods** from global cuisines (Indian, Chinese, Japanese, Italian, Mexican, Thai, Korean, Middle Eastern, American, Mediterranean, Vietnamese, Ethiopian, Turkish, Brazilian)
- Macro tracking with progress rings (calories, protein, carbs, fat)
- Meal categories (breakfast, lunch, dinner, snacks)
- **Crowdsource** — can't find a food? Add it to the community queue
- Custom food entries

### ⏱️ Workout Timer
- **Rest Timer** — countdown with preset durations (30/60/90/120/180s)
- **Stopwatch** — with lap tracking
- **Tabata Timer** — configurable work/rest/rounds with audio cues
- Sound alerts when timer completes

### 💧 Body & Hydration
- Water intake tracker (8 glass daily goal)
- Visual glass grid with completion celebration
- 7-day hydration history bar chart
- **Weight logging** with trend tracking
- **BMI calculation** (auto-calculated from height in settings)
- Weight history with date entries

### ⏳ Life Progress
- Date of birth → life progress visualization (80yr default, configurable)
- Day / Week / Month / Quarter / Year progress rings
- Days lived, days remaining, weeks remaining
- Awareness of time passing

### 📅 Calendar
- Monthly calendar with workout activity dots
- Consistency percentage tracking
- **ICS file import** for calendar availability awareness
- Monthly workout statistics

### 🎵 Workout Music
- 8 curated YouTube playlists across genres & languages
  - Hip-Hop, Bollywood, K-Pop, Lo-Fi, Latin, EDM, J-Pop/Anime, Afrobeats
- Language filter (English, Hindi, Korean, Japanese, Spanish, etc.)
- **Bring Your Own Playlist** — paste YouTube URL
- Embedded player

### 📊 Dashboard
- Time-aware greeting
- Quick stats (workouts, calories, hydration, streak)
- **GitHub-style 90-day activity heatmap**
- Time progress rings (day, week, month, year, life)
- Quick-start workout template cards

### ⚙️ Settings
- Profile (name, DOB, height, life expectancy)
- Nutrition goals (daily calories, macros)
- Data export/import (JSON backup)
- Clear all data

## Tech Stack

- **Vite** — fast dev server & build
- **Vanilla JS** — no framework overhead
- **Vanilla CSS** — custom properties design system
- **LocalStorage** — offline-first, no backend needed
- **Google Fonts** — Fraunces + Instrument Sans

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── main.js              # Entry + router
├── style.css            # Design system
├── components/
│   ├── dashboard.js     # Dashboard with heatmap
│   ├── workout.js       # Workout logging + templates
│   ├── calories.js      # Nutrition tracker
│   ├── body.js          # Water + weight tracking
│   ├── timer.js         # Rest/Stopwatch/Tabata
│   ├── progress.js      # Life progress
│   ├── calendar.js      # Calendar + ICS
│   ├── music.js         # YouTube playlists
│   ├── sidebar.js       # Navigation
│   └── settings.js      # Profile & data
├── data/
│   ├── exercises.js     # Exercise database
│   ├── foods.js         # 80+ global foods
│   ├── playlists.js     # Curated playlists
│   └── templates.js     # Workout templates
└── utils/
    ├── storage.js       # LocalStorage helpers
    └── time.js          # Date/time utilities
```

## Development

See [DEV_TOOLS.md](./DEV_TOOLS.md) for development tools and resources.

## License

MIT
