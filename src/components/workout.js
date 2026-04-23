// Workout tracker view

import { getAllExercises, EXERCISES } from '../data/exercises.js';
import { TEMPLATES, getTemplatesByCategory } from '../data/templates.js';
import { store, KEYS } from '../utils/storage.js';
import { todayKey, uid, formatDate } from '../utils/time.js';

export function renderWorkout() {
  const main = document.getElementById('main-content');
  const todayWorkouts = store.get(KEYS.WORKOUTS, []).filter(w => w.date === todayKey());
  const allExercises = getAllExercises();

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">TRAINING</p>
        <h1 class="page-header__title">Workouts</h1>
      </div>

      <div class="tabs" id="workout-tabs">
        <button class="tab tab--active" data-tab="log">Log Workout</button>
        <button class="tab" data-tab="templates">Templates</button>
        <button class="tab" data-tab="history">History</button>
        <button class="tab" data-tab="exercises">Exercise Library</button>
      </div>

      <div id="workout-tab-content"></div>
    </div>
  `;

  const tabContent = document.getElementById('workout-tab-content');
  const tabs = document.querySelectorAll('#workout-tabs .tab');

  function showTab(name) {
    tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === name));
    if (name === 'log') renderLogTab(tabContent);
    else if (name === 'templates') renderTemplatesTab(tabContent);
    else if (name === 'history') renderHistoryTab(tabContent);
    else renderLibraryTab(tabContent);
  }

  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

  // Check if a template was selected from dashboard
  const activeTemplate = store.get('_active_template');
  if (activeTemplate) {
    store.remove('_active_template');
    showTab('log');
    // Auto-log all exercises from template after a tick
    setTimeout(() => {
      activeTemplate.exercises.forEach(ex => {
        const entry = {
          id: uid(),
          date: todayKey(),
          exercise: ex.name,
          type: ex.type || 'strength',
          sets: ex.sets,
          reps: ex.reps,
          weight: null,
          duration: ex.duration || null,
          detail: ex.isTime
            ? `${ex.sets} rounds · ${Math.round((ex.duration || 0) / 60)} min`
            : `${ex.sets}×${ex.reps}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        store.push(KEYS.WORKOUTS, entry);
      });
      renderTodayLog();
      showToast(`${activeTemplate.name} loaded — ${activeTemplate.exercises.length} exercises ✓`);
    }, 100);
  } else {
    showTab('log');
  }
}

function renderLogTab(container) {
  const allExercises = getAllExercises();

  container.innerHTML = `
    <div class="search-bar">
      <input type="text" class="search-bar__input" id="exercise-search" placeholder="Search exercises (e.g. bench press, squat, running...)" autocomplete="off" />
    </div>
    <div id="exercise-results" class="food-results" style="display:none"></div>

    <div id="current-log" style="margin-bottom: var(--sp-6)">
      <h3 class="section-title">Quick Add</h3>
      <div style="display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-bottom: var(--sp-5)">
        ${['Push-ups', 'Squat', 'Running', 'Plank', 'Bench Press', 'Pull-ups'].map(name => `
          <button class="btn btn--ghost btn--sm quick-exercise" data-name="${name}">${name}</button>
        `).join('')}
      </div>
    </div>

    <div id="log-form" style="display:none; margin-bottom: var(--sp-6)">
      <h3 class="section-title" id="log-exercise-name"></h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--sp-4);">
        <div class="form-group">
          <label class="form-label" id="sets-label">Sets</label>
          <input type="number" class="form-input" id="log-sets" min="1" value="3" />
        </div>
        <div class="form-group">
          <label class="form-label" id="reps-label">Reps</label>
          <input type="number" class="form-input" id="log-reps" min="1" value="10" />
        </div>
        <div class="form-group" id="weight-group">
          <label class="form-label">Weight (kg)</label>
          <input type="number" class="form-input" id="log-weight" min="0" step="0.5" value="0" />
        </div>
        <div class="form-group" id="duration-group" style="display:none">
          <label class="form-label">Duration (min)</label>
          <input type="number" class="form-input" id="log-duration" min="1" value="30" />
        </div>
      </div>
      <button class="btn btn--primary" id="btn-save-exercise">Save Exercise</button>
    </div>

    <h3 class="section-title">Today's Log</h3>
    <div id="today-log-list"></div>
  `;

  let selectedExercise = null;

  const searchInput = document.getElementById('exercise-search');
  const resultsDiv = document.getElementById('exercise-results');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { resultsDiv.style.display = 'none'; return; }
    const matches = allExercises.filter(e =>
      e.name.toLowerCase().includes(q) || (e.muscle && e.muscle.toLowerCase().includes(q))
    ).slice(0, 8);
    if (!matches.length) { resultsDiv.style.display = 'none'; return; }
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = matches.map(e => `
      <div class="food-result" data-id="${e.id}">
        <span class="food-item__name">${e.name}</span>
        <span class="food-item__region">${e.type}</span>
        <span class="food-item__cal">${e.muscle || ''}</span>
      </div>
    `).join('');
    resultsDiv.querySelectorAll('.food-result').forEach(el => {
      el.addEventListener('click', () => {
        const ex = allExercises.find(x => x.id === el.dataset.id);
        selectExercise(ex);
        resultsDiv.style.display = 'none';
        searchInput.value = '';
      });
    });
  });

  container.querySelectorAll('.quick-exercise').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = allExercises.find(e => e.name === btn.dataset.name);
      if (ex) selectExercise(ex);
    });
  });

  function selectExercise(ex) {
    selectedExercise = ex;
    const form = document.getElementById('log-form');
    form.style.display = 'block';
    document.getElementById('log-exercise-name').textContent = ex.name;
    const isTime = ex.isTime;
    document.getElementById('weight-group').style.display = isTime ? 'none' : 'block';
    document.getElementById('duration-group').style.display = isTime ? 'block' : 'none';
    if (isTime) {
      document.getElementById('sets-label').textContent = 'Rounds';
      document.getElementById('reps-label').parentElement.style.display = 'none';
    } else {
      document.getElementById('sets-label').textContent = 'Sets';
      document.getElementById('reps-label').parentElement.style.display = 'block';
    }
  }

  document.getElementById('btn-save-exercise').addEventListener('click', () => {
    if (!selectedExercise) return;
    const entry = {
      id: uid(),
      date: todayKey(),
      exercise: selectedExercise.name,
      type: selectedExercise.type || 'strength',
      sets: +document.getElementById('log-sets').value,
      reps: selectedExercise.isTime ? null : +document.getElementById('log-reps').value,
      weight: selectedExercise.isTime ? null : +document.getElementById('log-weight').value,
      duration: selectedExercise.isTime ? +document.getElementById('log-duration').value : null,
      detail: selectedExercise.isTime
        ? `${document.getElementById('log-sets').value} rounds · ${document.getElementById('log-duration').value} min`
        : `${document.getElementById('log-sets').value}×${document.getElementById('log-reps').value} @ ${document.getElementById('log-weight').value}kg`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    store.push(KEYS.WORKOUTS, entry);
    document.getElementById('log-form').style.display = 'none';
    selectedExercise = null;
    renderTodayLog();
    showToast(`${entry.exercise} logged ✓`);
  });

  renderTodayLog();
}

function renderTodayLog() {
  const list = document.getElementById('today-log-list');
  const today = store.get(KEYS.WORKOUTS, []).filter(w => w.date === todayKey());
  if (!today.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state__icon">🏋️</div><p class="empty-state__text">No exercises logged today. Search or quick-add above to get started.</p></div>`;
    return;
  }
  list.innerHTML = `<div class="workout-list">${today.map(w => `
    <div class="workout-entry">
      <div class="workout-entry__icon workout-entry__icon--${w.type}">
        ${w.type === 'cardio' ? '🏃' : w.type === 'yoga' ? '🧘' : w.type === 'bodyweight' ? '💪' : '🏋️'}
      </div>
      <div>
        <div class="workout-entry__name">${w.exercise}</div>
        <div class="workout-entry__detail">${w.detail}</div>
      </div>
      <div class="workout-entry__meta">${w.time}</div>
    </div>
  `).join('')}</div>`;
}

function renderTemplatesTab(container) {
  const cats = getTemplatesByCategory();

  container.innerHTML = Object.entries(cats).map(([cat, templates]) => `
    <div style="margin-bottom: var(--sp-6)">
      <h3 class="section-title">${cat}</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--sp-4)">
        ${templates.map(t => `
          <div style="padding: var(--sp-5); border-radius: var(--r-lg); border: 1px solid var(--clr-border); background: var(--clr-surface)">
            <div style="display: flex; align-items: center; gap: var(--sp-3); margin-bottom: var(--sp-4)">
              <span style="font-size: 1.5rem">${t.emoji}</span>
              <div>
                <div style="font-weight: 600; font-size: var(--fs-sm)">${t.name}</div>
                <div style="font-size: var(--fs-xs); color: var(--clr-text-3)">${t.description}</div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: var(--sp-2); margin-bottom: var(--sp-4)">
              ${t.exercises.map(e => `
                <div style="display: flex; justify-content: space-between; font-size: var(--fs-xs); padding: var(--sp-1) 0">
                  <span>${e.name}</span>
                  <span style="color: var(--clr-text-3)">${e.isTime ? `${e.sets}×${Math.round((e.duration||0)/60)}min` : `${e.sets}×${e.reps}`}</span>
                </div>
              `).join('')}
            </div>
            <button class="btn btn--primary btn--sm template-start" data-id="${t.id}" style="width: 100%">Start Workout</button>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.template-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = TEMPLATES.find(x => x.id === btn.dataset.id);
      if (!t) return;
      t.exercises.forEach(ex => {
        store.push(KEYS.WORKOUTS, {
          id: uid(),
          date: todayKey(),
          exercise: ex.name,
          type: ex.type || 'strength',
          sets: ex.sets,
          reps: ex.reps,
          weight: null,
          duration: ex.duration || null,
          detail: ex.isTime ? `${ex.sets} rounds · ${Math.round((ex.duration||0)/60)} min` : `${ex.sets}×${ex.reps}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        });
      });
      showToast(`${t.name} loaded — ${t.exercises.length} exercises ✓`);
    });
  });
}

function renderHistoryTab(container) {
  const all = store.get(KEYS.WORKOUTS, []);
  const byDate = {};
  all.forEach(w => { (byDate[w.date] = byDate[w.date] || []).push(w); });
  const dates = Object.keys(byDate).sort().reverse().slice(0, 14);

  if (!dates.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📋</div><p class="empty-state__text">No workout history yet. Start logging!</p></div>`;
    return;
  }

  container.innerHTML = dates.map(d => `
    <div style="margin-bottom: var(--sp-6)">
      <h3 class="section-title">${formatDate(d)}</h3>
      <div class="workout-list">
        ${byDate[d].map(w => `
          <div class="workout-entry">
            <div class="workout-entry__icon workout-entry__icon--${w.type}">
              ${w.type === 'cardio' ? '🏃' : w.type === 'yoga' ? '🧘' : '🏋️'}
            </div>
            <div>
              <div class="workout-entry__name">${w.exercise}</div>
              <div class="workout-entry__detail">${w.detail}</div>
            </div>
            <div class="workout-entry__meta">${w.time || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderLibraryTab(container) {
  const cats = Object.keys(EXERCISES);
  container.innerHTML = cats.map(cat => `
    <div style="margin-bottom: var(--sp-6)">
      <h3 class="section-title" style="text-transform: capitalize">${cat === 'bodyweight' ? '💪 Bodyweight' : cat === 'strength' ? '🏋️ Strength' : cat === 'cardio' ? '🏃 Cardio' : '🧘 Yoga'}</h3>
      <div class="workout-list">
        ${EXERCISES[cat].map(e => `
          <div class="workout-entry">
            <div class="workout-entry__icon workout-entry__icon--${cat}">
              ${cat === 'cardio' ? '🏃' : cat === 'yoga' ? '🧘' : cat === 'bodyweight' ? '💪' : '🏋️'}
            </div>
            <div>
              <div class="workout-entry__name">${e.name}</div>
              <div class="workout-entry__detail">${e.muscle || ''} ${e.equipment ? '· ' + e.equipment : ''}</div>
            </div>
            <div class="workout-entry__meta">${e.isTime ? 'Timed' : 'Sets/Reps'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast--visible');
  setTimeout(() => toast.classList.remove('toast--visible'), 2000);
}
