# 💡 Workout Buddy — Ideas & Roadmap

A living document of feature ideas, enhancements, and dreams.

---

## 🔥 Priority — Next Up

### Achievements & Gamification
- [ ] Unlock badges: "First Workout", "7-Day Streak", "100 Workouts", "Water Week" etc.
- [ ] XP system — earn points per workout/meal/journal entry
- [ ] Level progression with milestones
- [ ] Streak freeze (1 per week)

### Weekly Digest
- [ ] Auto-generated weekly summary view (no email needed)
- [ ] Compare week-over-week: workouts, calories, weight, water
- [ ] "Best day" / "Missed days" highlights
- [ ] Shareable summary card (downloadable image)

### Smart Recommendations
- [ ] "You haven't trained legs in 5 days" nudges
- [ ] Suggest exercises based on what you haven't done recently
- [ ] Recovery alerts: "Heavy back day yesterday → consider lighter today"
- [ ] Plateau detection: "Your bench press has been 60kg for 3 weeks"

---

## 🛠️ Features — In Progress

### Personal Records (PRs)
- [ ] Auto-detect PRs for each exercise (heaviest weight, most reps)
- [ ] PR history with date
- [ ] 🎉 celebration animation when you set a new PR
- [ ] PR board / leaderboard against yourself

### Workout Notes
- [x] ~~Journal page with mood + energy + notes~~ ✅ Done
- [ ] Attach notes to individual workouts
- [ ] Workout rating (1-5 stars) after completing a template

### Streak & Consistency
- [x] ~~Basic streak counter~~ ✅ Done
- [ ] Visual streak calendar (like GitHub but specifically for streaks)
- [ ] Longest streak record
- [ ] Consistency % per week/month with trend arrows

---

## 🌟 Feature Ideas — Wishlist

### Advanced Nutrition
- [ ] Barcode scanner via camera → food lookup
- [ ] Meal prep suggestions based on macro goals
- [ ] Recipe links for common foods
- [ ] Daily macro pie chart visualization
- [ ] "Cheat day" mode (relaxed goals)
- [ ] Restaurant menu quick-log (saved frequent orders)

### Body Composition
- [ ] Body measurements tracker (waist, chest, arms, thighs)
- [ ] Progress photos with date stamps (locally stored)
- [ ] Body fat % estimation (Navy method calculator)
- [ ] TDEE calculator based on activity level
- [ ] Goal weight tracking with projected timeline

### Social & Sharing
- [ ] Export workout as shareable card image
- [ ] "Workout of the Day" (WOD) community feed (later, when backend exists)
- [ ] Friend challenges: "Who does more push-ups this week"
- [ ] Share your streak on social media

### Timer Enhancements
- [ ] EMOM (Every Minute on the Minute) timer mode
- [ ] AMRAP (As Many Reps As Possible) mode
- [ ] Custom interval builder (name + save presets)
- [ ] Voice cues: "3, 2, 1, GO!" using Web Speech API
- [ ] Background timer (keeps running when switching tabs)

### Calendar & Planning
- [ ] Workout planning: schedule workouts for future days
- [ ] Google Calendar sync (read-only to see busy slots)
- [ ] Weekly planner view (drag-and-drop templates onto days)
- [ ] Rest day reminders

### Music Enhancements
- [ ] BPM-matched playlists for different workout types
- [ ] Auto-play timer music (start playlist when timer starts)
- [ ] Spotify integration (if API allows)
- [ ] Community-submitted playlists with upvoting

### Life Progress Enhancements
- [ ] Seasonal awareness (summer/winter, holidays coming up)
- [ ] Habit grid: track multiple daily habits (meditation, reading, etc.)
- [ ] Gratitude prompt in journal
- [ ] Sleep tracking integration (manual log)

---

## 🏗️ Technical & Architecture

### Performance
- [ ] React.lazy + Suspense for route-based code splitting
- [ ] Service Worker for offline PWA support
- [ ] PWA manifest.json for installability
- [ ] Image optimization pipeline

### Data & Sync
- [ ] IndexedDB migration (larger storage, better querying)
- [ ] Cloud sync option (Supabase / Firebase — optional)
- [ ] Data migration version system
- [ ] Automatic daily backup to downloadable JSON

### DX
- [ ] Vitest unit tests for utils/storage/time
- [ ] E2E tests with Playwright
- [ ] Storybook for component library
- [ ] Pre-commit hooks (Husky + lint-staged)

### Accessibility
- [ ] Full keyboard navigation
- [ ] Screen reader friendly (ARIA labels on charts/rings)
- [ ] Reduced motion preference support
- [ ] High contrast mode

### Mobile
- [ ] Bottom navigation on mobile (instead of horizontal scroll)
- [ ] Swipe gestures between views
- [ ] Haptic feedback on timer events (if supported)
- [ ] Add to Home Screen prompt

---

## 🎨 Design Ideas

- [ ] Dark mode toggle (warm dark palette)
- [ ] Theme presets (Earth, Ocean, Sunset, Midnight)
- [ ] Compact mode for power users (denser layout)
- [ ] Celebration confetti on achievements
- [ ] Smooth page transitions (view transition API)

---

## 📝 Content Ideas

- [ ] Exercise form tips / how-to descriptions
- [ ] Stretching routines as templates
- [ ] Beginner-friendly "Week 1-4" program
- [ ] Seasonal challenges ("30-Day January Challenge")
- [ ] Fun facts about exercises/nutrition
