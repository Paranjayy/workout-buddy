// Calendar view

import { store, KEYS } from '../utils/storage.js';
import { todayKey } from '../utils/time.js';

export function renderCalendar() {
  const main = document.getElementById('main-content');
  const now = new Date();
  let viewMonth = now.getMonth();
  let viewYear = now.getFullYear();

  function render() {
    const workouts = store.get(KEYS.WORKOUTS, []);
    const workoutDates = new Set(workouts.map(w => w.date));

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = todayKey();

    let calCells = '';
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) calCells += `<div class="cal-day"></div>`;
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === today;
      const hasWorkout = workoutDates.has(dateStr);
      calCells += `<div class="cal-day ${isToday ? 'cal-day--today' : ''} ${hasWorkout ? 'cal-day--has-workout' : ''}" data-date="${dateStr}">${d}</div>`;
    }

    // Count workouts this month
    const monthWorkouts = workouts.filter(w => w.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`));

    main.innerHTML = `
      <div class="view-enter">
        <div class="page-header">
          <p class="page-header__greeting">SCHEDULE</p>
          <h1 class="page-header__title">Calendar</h1>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-5)">
          <button class="btn btn--ghost btn--sm" id="cal-prev">← Prev</button>
          <h2 style="font-family: var(--ff-display); font-size: var(--fs-lg); font-weight: 600">${monthName}</h2>
          <button class="btn btn--ghost btn--sm" id="cal-next">Next →</button>
        </div>

        <div class="cal-grid">
          ${dayHeaders.map(d => `<div class="cal-day-header">${d}</div>`).join('')}
          ${calCells}
        </div>

        <div class="stats-row" style="margin-top: var(--sp-5)">
          <div class="stat-block stat-block--accent">
            <div class="stat-block__label">Workouts This Month</div>
            <div class="stat-block__value">${monthWorkouts.length}</div>
          </div>
          <div class="stat-block stat-block--sky">
            <div class="stat-block__label">Active Days</div>
            <div class="stat-block__value">${new Set(monthWorkouts.map(w => w.date)).size}</div>
          </div>
          <div class="stat-block stat-block--amber">
            <div class="stat-block__label">Consistency</div>
            <div class="stat-block__value">${daysInMonth > 0 ? Math.round((new Set(monthWorkouts.map(w => w.date)).size / daysInMonth) * 100) : 0}%</div>
          </div>
        </div>

        <div style="margin-top: var(--sp-6)">
          <h3 class="section-title">Calendar Import</h3>
          <p style="font-size: var(--fs-sm); color: var(--clr-text-3); margin-bottom: var(--sp-4)">
            Import your calendar (.ics) to see availability alongside your workout schedule.
          </p>
          <div style="display: flex; gap: var(--sp-3)">
            <label class="btn btn--ghost btn--sm" style="cursor: pointer">
              📁 Import .ics File
              <input type="file" accept=".ics" id="ics-import" style="display: none" />
            </label>
          </div>
          <div id="ics-events" style="margin-top: var(--sp-4)"></div>
        </div>
      </div>
    `;

    document.getElementById('cal-prev').addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      render();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      render();
    });

    document.getElementById('ics-import').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        const events = parseICS(text);
        const evDiv = document.getElementById('ics-events');
        if (!events.length) {
          evDiv.innerHTML = `<p style="font-size: var(--fs-sm); color: var(--clr-text-3)">No events found in file.</p>`;
          return;
        }
        evDiv.innerHTML = `
          <h4 style="font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--sp-3)">Imported ${events.length} events</h4>
          <div class="workout-list">
            ${events.slice(0, 10).map(ev => `
              <div class="workout-entry">
                <div class="workout-entry__icon" style="background: var(--clr-sky-l)">📅</div>
                <div>
                  <div class="workout-entry__name">${ev.summary}</div>
                  <div class="workout-entry__detail">${ev.dtstart || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      };
      reader.readAsText(file);
    });
  }

  render();
}

function parseICS(text) {
  const events = [];
  const blocks = text.split('BEGIN:VEVENT');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0];
    const summary = (block.match(/SUMMARY:(.*)/)?.[1] || '').trim();
    const dtstart = (block.match(/DTSTART[^:]*:(.*)/)?.[1] || '').trim();
    if (summary) events.push({ summary, dtstart });
  }
  return events;
}
