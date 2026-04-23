// Body metrics — weight tracking, BMI, water intake

import { store, KEYS } from '../utils/storage.js';
import { todayKey, uid, formatDate } from '../utils/time.js';

const WATER_KEY = 'water_log';
const WEIGHT_KEY = 'weight_log';

export function renderBody() {
  const main = document.getElementById('main-content');
  const profile = store.get(KEYS.PROFILE, {});

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">WELLNESS</p>
        <h1 class="page-header__title">Body & Hydration</h1>
      </div>

      <div class="tabs" id="body-tabs">
        <button class="tab tab--active" data-tab="water">Water</button>
        <button class="tab" data-tab="weight">Weight</button>
      </div>

      <div id="body-content"></div>
    </div>
  `;

  const tabs = document.querySelectorAll('#body-tabs .tab');
  function showTab(name) {
    tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === name));
    if (name === 'water') renderWater();
    else renderWeight();
  }
  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
  showTab('water');
}

function renderWater() {
  const container = document.getElementById('body-content');
  const today = todayKey();
  const log = store.get(WATER_KEY, {});
  const glasses = log[today] || 0;
  const goal = 8; // 8 glasses = ~2L

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--sp-6); padding: var(--sp-6) 0">
      <div style="position: relative; width: 180px; height: 180px">
        ${makeWaterRing(glasses, goal)}
      </div>

      <div style="text-align: center">
        <div style="font-family: var(--ff-display); font-size: var(--fs-2xl); font-weight: 700">
          ${glasses} <span style="font-size: var(--fs-lg); color: var(--clr-text-3)">/ ${goal}</span>
        </div>
        <div style="font-size: var(--fs-sm); color: var(--clr-text-3)">glasses today (${glasses * 250}ml)</div>
      </div>

      <div style="display: flex; gap: var(--sp-3)">
        <button class="btn btn--primary" id="water-add">+ Add Glass</button>
        <button class="btn btn--ghost" id="water-remove" ${glasses === 0 ? 'disabled' : ''}>- Remove</button>
      </div>

      <div style="display: flex; gap: var(--sp-2); flex-wrap: wrap; justify-content: center; max-width: 300px">
        ${Array.from({ length: goal }, (_, i) => `
          <div style="width: 32px; height: 32px; border-radius: var(--r-sm); display: grid; place-items: center; font-size: 1.1rem;
            ${i < glasses ? 'background: oklch(62% 0.14 240 / 0.15); border: 1px solid oklch(62% 0.14 240 / 0.3)' : 'background: var(--clr-surface-2); border: 1px solid var(--clr-border)'}"
          >${i < glasses ? '💧' : ''}</div>
        `).join('')}
      </div>

      ${glasses >= goal ? `
        <div style="text-align: center; padding: var(--sp-4); border-radius: var(--r-md); background: var(--clr-accent-l); color: var(--clr-accent-d); font-weight: 600; font-size: var(--fs-sm)">
          🎉 Hydration goal met! Stay awesome.
        </div>
      ` : ''}

      <div style="width: 100%; max-width: 500px; margin-top: var(--sp-5)">
        <h3 class="section-title">Last 7 Days</h3>
        <div style="display: flex; gap: var(--sp-3); align-items: flex-end; height: 120px">
          ${getLast7Days().map(d => {
            const count = log[d.key] || 0;
            const pct = Math.min(100, (count / goal) * 100);
            return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--sp-1)">
                <span style="font-size: var(--fs-xs); font-weight: 600; font-variant-numeric: tabular-nums; color: var(--clr-text-2)">${count}</span>
                <div style="width: 100%; background: var(--clr-surface-2); border-radius: var(--r-sm); height: 80px; display: flex; align-items: flex-end; overflow: hidden">
                  <div style="width: 100%; height: ${pct}%; background: oklch(62% 0.14 240); border-radius: var(--r-sm); transition: height 0.4s cubic-bezier(0.25,1,0.5,1); min-height: ${count > 0 ? '4px' : '0'}"></div>
                </div>
                <span style="font-size: var(--fs-xs); color: var(--clr-text-3)">${d.label}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('water-add').addEventListener('click', () => {
    const log = store.get(WATER_KEY, {});
    log[today] = (log[today] || 0) + 1;
    store.set(WATER_KEY, log);
    renderWater();
  });

  document.getElementById('water-remove').addEventListener('click', () => {
    const log = store.get(WATER_KEY, {});
    if (log[today] > 0) log[today]--;
    store.set(WATER_KEY, log);
    renderWater();
  });
}

function renderWeight() {
  const container = document.getElementById('body-content');
  const weightLog = store.get(WEIGHT_KEY, []);
  const profile = store.get(KEYS.PROFILE, {});
  const latest = weightLog.length ? weightLog[weightLog.length - 1] : null;

  container.innerHTML = `
    <div style="padding: var(--sp-5) 0">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4); max-width: 400px; margin-bottom: var(--sp-6)">
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input class="form-input" id="weight-input" type="number" step="0.1" value="${latest ? latest.weight : ''}" placeholder="72.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Height (cm)</label>
          <input class="form-input" id="height-input" type="number" value="${profile.height || ''}" placeholder="175" />
        </div>
      </div>
      <button class="btn btn--primary" id="weight-save">Log Weight</button>

      ${latest ? `
      <div class="stats-row" style="margin-top: var(--sp-6)">
        <div class="stat-block stat-block--accent">
          <div class="stat-block__label">Current Weight</div>
          <div class="stat-block__value">${latest.weight} kg</div>
          <div class="stat-block__sub">${formatDate(latest.date)}</div>
        </div>
        ${profile.height ? `
        <div class="stat-block stat-block--sky">
          <div class="stat-block__label">BMI</div>
          <div class="stat-block__value">${calcBMI(latest.weight, profile.height)}</div>
          <div class="stat-block__sub">${bmiCategory(calcBMI(latest.weight, profile.height))}</div>
        </div>
        ` : ''}
        ${weightLog.length >= 2 ? `
        <div class="stat-block ${weightLog[weightLog.length-1].weight <= weightLog[weightLog.length-2].weight ? 'stat-block--accent' : 'stat-block--rose'}">
          <div class="stat-block__label">Trend</div>
          <div class="stat-block__value">${(weightLog[weightLog.length-1].weight - weightLog[weightLog.length-2].weight).toFixed(1)} kg</div>
          <div class="stat-block__sub">since last entry</div>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${weightLog.length > 0 ? `
      <div style="margin-top: var(--sp-6)">
        <h3 class="section-title">Weight History</h3>
        <div class="workout-list">
          ${weightLog.slice().reverse().slice(0, 20).map(w => `
            <div class="workout-entry">
              <div class="workout-entry__icon" style="background: var(--clr-accent-l)">⚖️</div>
              <div>
                <div class="workout-entry__name">${w.weight} kg</div>
                <div class="workout-entry__detail">${formatDate(w.date)}</div>
              </div>
              ${profile.height ? `<div class="workout-entry__meta">BMI ${calcBMI(w.weight, profile.height)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : `
      <div class="empty-state" style="margin-top: var(--sp-6)">
        <div class="empty-state__icon">⚖️</div>
        <p class="empty-state__text">No weight entries yet. Log your weight above to start tracking.</p>
      </div>
      `}
    </div>
  `;

  document.getElementById('weight-save').addEventListener('click', () => {
    const w = +document.getElementById('weight-input').value;
    const h = +document.getElementById('height-input').value;
    if (!w) return;
    if (h) {
      const p = store.get(KEYS.PROFILE, {});
      p.height = h;
      store.set(KEYS.PROFILE, p);
    }
    store.push(WEIGHT_KEY, { id: uid(), date: todayKey(), weight: w });
    showToast(`${w} kg logged ✓`);
    renderWeight();
  });
}

function makeWaterRing(current, goal) {
  const size = 180;
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, (current / goal) * 100);
  const offset = circ - (circ * pct / 100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(90% 0.01 240)" stroke-width="10"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(62% 0.14 240)" stroke-width="10"
      stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 ${size/2} ${size/2})"
      style="transition: stroke-dashoffset 0.8s cubic-bezier(0.25,1,0.5,1)"/>
    <text x="${size/2}" y="${size/2 - 8}" text-anchor="middle" dominant-baseline="central"
      font-family="var(--ff-display)" font-size="28" font-weight="700"
      fill="oklch(22% 0.02 60)">${Math.round(pct)}%</text>
    <text x="${size/2}" y="${size/2 + 16}" text-anchor="middle"
      font-family="var(--ff-body)" font-size="12" font-weight="500"
      fill="oklch(50% 0.02 60)">hydrated</text>
  </svg>`;
}

function calcBMI(weight, heightCm) {
  const h = heightCm / 100;
  return (weight / (h * h)).toFixed(1);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
    });
  }
  return days;
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
