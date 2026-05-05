# 📜 Workout Buddy — Changelog

All notable changes to the Workout Buddy project will be documented in this file.

---

## [2.3.0] - 2026-05-05
### Added
- **🩻 MuscleMap Visualizer**: Dynamic SVG human diagram highlighting target muscles (Front/Back) based on exercise selection.
- **⏱️ Timer Session Logging**: Automatic history tracking for all timer modes (Stopwatch, Tabata, EMOM, Activity).
- **🗑️ Advanced Data Control**: Granular delete functionality for individual food items, meal entries, and workout logs.
- **🛡️ Z-Index Layering**: System-wide audit and fix for UI stacking issues, ensuring Search Modals and Toasts always stay on top.

## [2.2.0] - 2026-05-04
### Added
- **🌐 Offline-First Capability**: Service worker integration for full gym functionality without internet.
- **🔒 Privacy Orchestration**: Dashboard indicator for offline encrypted storage and zero-cloud leakage status.
- **⌨️ Keyboard Mastery**: Enhanced `ArrowUp/Down` + `Enter` navigation for Universal Search (⌘K).
- **🎖️ Elite Status**: New high-tier achievement badge for 50+ workouts logged.

---

## [2.1.0] - 2026-05-03
### Added
- **🏆 Personal Records (PR) Tracking**:
  - Auto-detection of new PRs (Max Weight, Max Reps) when logging exercises.
  - New "PR Board" section on the Dashboard.
  - Success fanfare audio cue on PR achievement.
- **✨ Smart Coach (Dashboard)**:
  - Real-time recommendation engine for leg-day nudges, hydration alerts, and streak momentum.
- **📈 Habit Contribution Grid**:
  - GitHub-style daily habit tracker on the Progress page with 30-day visual grids.
- **🔍 Universal Search (⌘K)**:
  - Global command palette to find exercises, templates, and navigate pages instantly.
- **📸 Share Achievement**:
  - PNG export functionality to generate high-fidelity workout summary cards.
- **📅 Advanced Calendar Orchestration**:
  - Interactive Month View with day-selection and detail sidebar.
  - Multi-category workout indicators (Icons/Dots) for quick visual audits.
  - Consistency tracking and active day telemetry.
  - ICS calendar import support for external event synchronization.
- **📱 PWA Infrastructure Hardening**:
  - Added standalone mobile app meta tags and high-fidelity splash screen support.
  - Optimized viewport and theme colors for seamless OS integration.

---

## [2.0.0] - 2026-04-23
### Added
- Complete migration from Vanilla JS to **React 19 + TypeScript**.
- 13 distinct functional pages.
- Dark Mode support with OKLCH color tokens.
- PWA manifest and service worker preparation.
- Achievement system with 21 badges.
- Weekly Digest analytics.
- Vercel CI/CD and GitHub Pages redirect workflows.
