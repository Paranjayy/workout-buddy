// Dashboard view — enhanced with heatmap, templates, water status

import { getGreeting, yearProgress, monthProgress, weekProgress, dayProgress, lifeProgress, todayKey } from '../utils/time.js';
import { store, KEYS } from '../utils/storage.js';
import { TEMPLATES } from '../data/templates.js';

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
  const waterLog = store.get('water_log', {});
  const waterToday = waterLog[todayKey()] || 0;

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
          <div class="stat-block__label">Calories</div>
          <div class="stat-block__value">${totalCal.toLocaleString()}</div>
          <div class="stat-block__sub">of ${calGoal.toLocaleString()} goal</div>
        </div>
        <div class="stat-block stat-block--sky" id="stat-water">
          <div class="stat-block__label">Hydration</div>
          <div class="stat-block__value">${waterToday}/8</div>
          <div class="stat-block__sub">glasses today</div>
        </div>
        <div class="stat-block stat-block--rose" id="stat-streak">
          <div class="stat-block__label">Streak</div>
          <div class="stat-block__value">${calcStreak()} days</div>
          <div class="stat-block__sub">keep it up!</div>
        </div>
      </div>

      <div class="progress-section">
        <h2 class="progress-section__title">Time Awareness</h2>
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
            <span class="progress-ring-card__detail">${lp.ageYears} yrs · ${lp.weeksRemaining.toLocaleString()} wks left</span>
          </div>
          ` : `
          <div class="progress-ring-card" style="cursor:pointer" id="setup-life">
            <div class="empty-state__icon">🎂</div>
            <span class="progress-ring-card__label">Life</span>
            <span class="progress-ring-card__detail">Add DOB in Settings</span>
          </div>
          `}
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div style="margin-bottom: var(--sp-7)">
        <h2 class="section-title">Activity Heatmap</h2>
        <p style="font-size: var(--fs-xs); color: var(--clr-text-3); margin-bottom: var(--sp-4)">Last 90 days</p>
        <div id="heatmap-container" style="overflow-x: auto; padding-bottom: var(--sp-2)"></div>
      </div>

      <!-- Quick Templates -->
      <div style="margin-bottom: var(--sp-7)">
        <h2 class="section-title">Quick Start a Workout</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--sp-4)">
          ${TEMPLATES.slice(0, 6).map(t => `
            <div class="template-card" data-id="${t.id}" style="
              padding: var(--sp-4) var(--sp-5);
              border-radius: var(--r-lg);
              border: 1px solid var(--clr-border);
              background: var(--clr-surface);
              cursor: pointer;
              transition: transform var(--dur-md) var(--ease-out), box-shadow var(--dur-md) var(--ease-out);
            ">
              <div style="font-size: 1.5rem; margin-bottom: var(--sp-2)">${t.emoji}</div>
              <div style="font-weight: 600; font-size: var(--fs-sm); margin-bottom: var(--sp-1)">${t.name}</div>
              <div style="font-size: var(--fs-xs); color: var(--clr-text-3)">${t.description}</div>
              <div style="font-size: var(--fs-xs); color: var(--clr-text-3); margin-top: var(--sp-2)">${t.exercises.length} exercises</div>
            </div>
          `).join('')}
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

  // Render heatmap
  renderHeatmap();

  // Template click → navigate to workout
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = '0 6px 20px oklch(22% 0.02 60 / 0.06)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
    card.addEventListener('click', () => {
      const t = TEMPLATES.find(x => x.id === card.dataset.id);
      if (t && window.__navigate) {
        // Store selected template for the workout view to pick up
        store.set('_active_template', t);
        window.__navigate('workout');
      }
    });
  });

  // Life card click
  const setupLife = document.getElementById('setup-life');
  if (setupLife) {
    setupLife.addEventListener('click', () => window.__navigate && window.__navigate('settings'));
  }
}

function renderHeatmap() {
  const container = document.getElementById('heatmap-container');
  if (!container) return;
  const workouts = store.get(KEYS.WORKOUTS, []);
  const meals = store.get(KEYS.MEALS, []);

  // Count activity per day (workouts + meals logged)
  const activityMap = {};
  workouts.forEach(w => { activityMap[w.date] = (activityMap[w.date] || 0) + 1; });
  meals.forEach(m => { activityMap[m.date] = (activityMap[m.date] || 0) + 1; });

  // Build 90 days
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, count: activityMap[key] || 0, day: d.getDay() });
  }

  const maxCount = Math.max(1, ...days.map(d => d.count));
  const cellSize = 14;
  const gap = 3;

  // Organize into weeks (columns)
  const weeks = [];
  let currentWeek = [];
  // Pad first week
  if (days[0].day > 0) {
    for (let i = 0; i < days[0].day; i++) currentWeek.push(null);
  }
  days.forEach(d => {
    currentWeek.push(d);
    if (d.day === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const svgW = weeks.length * (cellSize + gap);
  const svgH = 7 * (cellSize + gap);

  let cells = '';
  weeks.forEach((week, wi) => {
    week.forEach((day, di) => {
      if (!day) return;
      const x = wi * (cellSize + gap);
      const y = di * (cellSize + gap);
      const intensity = day.count / maxCount;
      const l = 92 - (intensity * 52); // lightness from 92% (empty) to 40% (full)
      const c = intensity * 0.18; // chroma from 0 to 0.18
      cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="3"
        fill="oklch(${l}% ${c.toFixed(3)} 155)" stroke="oklch(90% 0.01 75)" stroke-width="0.5">
        <title>${day.key}: ${day.count} activities</title>
      </rect>`;
    });
  });

  container.innerHTML = `
    <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display: block">
      ${cells}
    </svg>
    <div style="display: flex; align-items: center; gap: var(--sp-2); margin-top: var(--sp-3); font-size: var(--fs-xs); color: var(--clr-text-3)">
      <span>Less</span>
      ${[0, 0.25, 0.5, 0.75, 1].map(i => {
        const l = 92 - (i * 52);
        const c = i * 0.18;
        return `<div style="width: 12px; height: 12px; border-radius: 2px; background: oklch(${l}% ${c.toFixed(3)} 155)"></div>`;
      }).join('')}
      <span>More</span>
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
