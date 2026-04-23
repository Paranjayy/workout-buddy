// Workout Buddy — Main Entry Point

import './style.css';
import { renderSidebar } from './components/sidebar.js';
import { renderDashboard } from './components/dashboard.js';
import { renderWorkout } from './components/workout.js';
import { renderCalories } from './components/calories.js';
import { renderProgress } from './components/progress.js';
import { renderCalendar } from './components/calendar.js';
import { renderMusic } from './components/music.js';
import { renderTimer } from './components/timer.js';
import { renderBody } from './components/body.js';
import { renderSettings } from './components/settings.js';

const VIEWS = {
  dashboard: renderDashboard,
  workout: renderWorkout,
  calories: renderCalories,
  body: renderBody,
  timer: renderTimer,
  progress: renderProgress,
  calendar: renderCalendar,
  music: renderMusic,
  settings: renderSettings,
};

let currentView = 'dashboard';

function navigate(view) {
  if (!VIEWS[view]) return;
  currentView = view;
  VIEWS[view]();
  renderSidebar(currentView, navigate);
  // Update URL hash
  history.replaceState(null, '', `#${view}`);
}

// Expose navigate globally for inline onclick
window.__navigate = navigate;

// Init
function init() {
  // Check URL hash
  const hash = location.hash.slice(1);
  if (hash && VIEWS[hash]) currentView = hash;

  renderSidebar(currentView, navigate);
  VIEWS[currentView]();
}

init();

// Listen for hash changes
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (hash && VIEWS[hash] && hash !== currentView) {
    navigate(hash);
  }
});
