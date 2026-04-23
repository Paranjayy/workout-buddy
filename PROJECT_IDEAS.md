# 💡 Project Ideas — Beyond Workout Buddy

A collection of project ideas for Telegram bots, Mac scripts, browser extensions, and more.

---

## 🤖 Telegram Bot Ideas

### Sovereign Daily Briefing Bot
- Morning digest: weather, calendar events, fitness stats, habit streaks
- Pull data from local APIs (Gravity Archive, Workout Buddy export)
- Natural language queries: "how many workouts this week?"
- Weekly photo collage of achievements

### Smart Expense Tracker Bot
- Log expenses via simple messages: "coffee 150" or "uber 320"
- Auto-categorize (food, transport, entertainment, bills)
- Monthly budget alerts and burn-rate tracking
- Export to CSV/JSON
- Split expenses with friends: "/split dinner 2400 @friend1 @friend2"

### Study/Focus Bot
- Pomodoro timer with Telegram notifications
- Track study hours by subject
- Spaced repetition reminders for flashcards
- "What should I study next?" based on gaps

### Content Curation Bot
- Save articles/links via Telegram → auto-tag with AI
- Weekly digest of saved links
- "Read later" queue with priority
- RSS feed aggregator with smart filtering

---

## 🖥️ Mac Scripts & Automation

### Terminal Dashboard (`~/.local/bin/dash`)
- One command that shows: system stats, git status of all repos, Docker containers, recent commits, disk usage, battery health
- Color-coded with ANSI — looks like a cockpit

### Smart Screenshot Organizer v2
- Watch ~/Desktop for new screenshots
- OCR the text content → auto-name the file
- Move to dated folders: `Screenshots/2026-04/`
- Duplicate detection via perceptual hashing

### Git Multi-Repo Manager
- `repos sync` → pull all repos in ~/Developer
- `repos status` → show dirty/clean/ahead/behind for each
- `repos search "pattern"` → grep across all repos
- Weekly commit stats across all projects

### Dotfiles Sync Engine
- Track changes to dotfiles via git
- Auto-commit on change (fswatch)
- Machine-specific overrides (laptop vs desktop)
- One-command bootstrap for new machines

### Clipboard History Manager
- Background daemon that saves clipboard history
- `clip search "thing"` → find old copies
- `clip pin "important"` → persistent snippets
- Auto-expire after 30 days

---

## 🌐 Browser Extension Ideas

### Tab Decay
- Tabs automatically dim/fade if untouched for X days
- "Tab garden" visualization — healthy (used) vs wilting (forgotten)
- Auto-archive tabs older than 2 weeks
- "Tab bankruptcy" button — save all and close

### Reading Time Tracker
- Track time spent reading articles vs social media
- Weekly report: "You read 45 articles, 2.3 hours on Twitter"
- Highlight ratio: productive vs distraction
- Block sites after daily limit

### Page Annotator
- Highlight + annotate any webpage
- Notes persist via localStorage/IndexedDB
- Export annotations as markdown
- Share annotated pages

---

## 📱 App Ideas

### Habit DNA
- Track habits as "genes" that combine into traits
- Consistency score evolves a character/creature
- Habit chains: "meditation → journaling → exercise"
- Monthly DNA helix visualization

### Micro-Journal
- One sentence per day, max 280 chars
- Mood color coding
- Year-in-review word cloud
- Export as a tiny book PDF

### Decision Logger
- Log decisions with context and reasoning
- Revisit after 30/90/365 days: "Was this right?"
- Pattern recognition: "You decide better in mornings"
- Coin flip with accountability

---

## 🔧 Dev Tools

### API Playground
- Local tool to test REST/GraphQL APIs
- Save collections (like Postman but minimal)
- Environment variables per project
- Response diff: compare before/after

### Dependency Auditor
- Scan `package.json` across all projects
- Find outdated/vulnerable deps
- One-click update with changelog preview
- Track which projects share which deps

### Commit Message AI
- Analyze staged changes → suggest conventional commit message
- Learn from your commit history style
- Pre-commit hook integration
- Emoji suggestion based on change type

---

## 🎮 Fun / Learning

### Terminal Chess
- Play chess in the terminal with Unicode pieces
- Play against a simple AI or a friend (over network)
- Game history with PGN export
- Puzzle mode: "Find the best move"

### Code Typing Speed
- Like monkeytype but with real code snippets
- Language-specific: Python, TypeScript, Rust, Go
- Track WPM over time
- Leaderboard against yourself

### ASCII Art Generator
- Convert images to ASCII art in the terminal
- Live camera → ASCII mode
- Export as text file
- Color support with ANSI codes
