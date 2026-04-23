// Dashboard view

import { getGreeting, yearProgress, monthProgress, weekProgress, dayProgress, lifeProgress, todayKey } from '../utils/time.js';
import { store, KEYS } from '../utils/storage.js';

function makeRingSvg(percent, color, size = 80) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(percent, 100) / 100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(90% 0.01 75)" stroke-width="5"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="5"
      stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
      stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
      style="transition: stroke-dashoffset 1s cubic-bezier(0.25,1,0.5,1)"/>
    <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central"
      font-family="var(--ff-display)" font-size="${size * 0.2}" font-weight="700"
      fill="oklch(22% 0.02 60)">${Math.round(percent)}%</text>
  </svg>`;
}

export function renderDashboard() {
  const main = document.getElementById('main-content');
  const greeting = getGreeting();
  const profile = store.get(KEYS.PROFILE, {});
  const name = profile.name || 'there';
  const todayWorkouts = store.get(KEYS.WORKOUTS, []).filter(w => w.date === todayKey());
  const todayMeals = store.get(KEYS.MEALS, []).filter(m => m.date === todayKey());
  const totalCal = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.cal, 0), 0);
  const calGoal = profile.calorieGoal || 2000;

  // Life progress
  const lp = profile.dob ? lifeProgress(profile.dob, profile.lifeExpectancy || 80) : null;

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">${greeting}</p>
        <h1 class="page-header__title">Hey ${name} 👋</h1>
      </div>

      <div class="stats-row">
        <div class="stat-block stat-block--accent" id="stat-workouts">
          <div class="stat-block__label">Today's Workouts</div>
          <div class="stat-block__value">${todayWorkouts.length}</div>
          <div class="stat-block__sub">exercises logged</div>
        </div>
        <div class="stat-block stat-block--amber" id="stat-calories">
          <div class="stat-block__label">Calories Today</div>
          <div class="stat-block__value">${totalCal.toLocaleString()}</div>
          <div class="stat-block__sub">of ${calGoal.toLocaleString()} goal</div>
        </div>
        <div class="stat-block stat-block--rose" id="stat-streak">
          <div class="stat-block__label">Current Streak</div>
          <div class="stat-block__value">${calcStreak()} days</div>
          <div class="stat-block__sub">keep it up!</div>
        </div>
        <div class="stat-block stat-block--sky" id="stat-year">
          <div class="stat-block__label">Year Progress</div>
          <div class="stat-block__value">${yearProgress().toFixed(1)}%</div>
          <div class="stat-block__sub">${new Date().getFullYear()}</div>
        </div>
      </div>

      <div class="progress-section">
        <h2 class="progress-section__title">Time Progress</h2>
        <div class="progress-grid">
          <div class="progress-ring-card">
            ${makeRingSvg(dayProgress(), 'oklch(55% 0.18 155)')}
            <span class="progress-ring-card__label">Day</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(weekProgress(), 'oklch(62% 0.14 240)')}
            <span class="progress-ring-card__label">Week</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(monthProgress(), 'oklch(72% 0.16 75)')}
            <span class="progress-ring-card__label">Month</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(yearProgress(), 'oklch(62% 0.2 15)')}
            <span class="progress-ring-card__label">Year</span>
          </div>
          ${lp ? `
          <div class="progress-ring-card">
            ${makeRingSvg(lp.percentLived, 'oklch(55% 0.15 300)')}
            <span class="progress-ring-card__label">Life</span>
            <span class="progress-ring-card__detail">${lp.ageYears} yrs · ${lp.weeksRemaining.toLocaleString()} weeks left</span>
          </div>
          ` : `
          <div class="progress-ring-card" style="cursor:pointer" id="setup-life">
            <div class="empty-state__icon">🎂</div>
            <span class="progress-ring-card__label">Life Progress</span>
            <span class="progress-ring-card__detail">Add your DOB in Settings</span>
          </div>
          `}
        </div>
      </div>

      ${todayWorkouts.length > 0 ? `
      <div style="margin-bottom: var(--sp-7)">
        <h2 class="section-title">Today's Activity</h2>
        <div class="workout-list">
          ${todayWorkouts.map(w => `
            <div class="workout-entry">
              <div class="workout-entry__icon workout-entry__icon--${w.type || 'strength'}">
                ${w.type === 'cardio' ? '🏃' : w.type === 'yoga' ? '🧘' : '🏋️'}
              </div>
              <div>
                <div class="workout-entry__name">${w.exercise}</div>
                <div class="workout-entry__detail">${w.detail || ''}</div>
              </div>
              <div class="workout-entry__meta">${w.time || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

function calcStreak() {
  const workouts = store.get(KEYS.WORKOUTS, []);
  if (!workouts.length) return 0;
  const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
  let streak = 0;
  const today = todayKey();
  let check = new Date(today);
  for (const d of dates) {
    const dStr = check.toISOString().slice(0, 10);
    if (d === dStr) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (d < dStr) break;
  }
  return streak;
}
