// Settings view

import { store, KEYS } from '../utils/storage.js';

export function renderSettings() {
  const main = document.getElementById('main-content');
  const profile = store.get(KEYS.PROFILE, {});

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">PREFERENCES</p>
        <h1 class="page-header__title">Settings</h1>
      </div>

      <div style="max-width: 600px">
        <h2 class="section-title">Profile</h2>
        <div class="form-group">
          <label class="form-label" for="setting-name">Your Name</label>
          <input class="form-input" id="setting-name" value="${profile.name || ''}" placeholder="What should we call you?" />
        </div>
        <div class="form-group">
          <label class="form-label" for="setting-dob">Date of Birth</label>
          <input class="form-input" id="setting-dob" type="date" value="${profile.dob || ''}" />
          <p style="font-size: var(--fs-xs); color: var(--clr-text-3); margin-top: var(--sp-1)">Used for the Life Progress tracker</p>
        </div>
        <div class="form-group">
          <label class="form-label" for="setting-life-exp">Life Expectancy (years)</label>
          <input class="form-input" id="setting-life-exp" type="number" value="${profile.lifeExpectancy || 80}" min="50" max="120" />
        </div>

        <h2 class="section-title" style="margin-top: var(--sp-7)">Nutrition Goals</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4)">
          <div class="form-group">
            <label class="form-label" for="setting-cal">Daily Calories</label>
            <input class="form-input" id="setting-cal" type="number" value="${profile.calorieGoal || 2000}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="setting-protein">Protein (g)</label>
            <input class="form-input" id="setting-protein" type="number" value="${profile.proteinGoal || 120}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="setting-carbs">Carbs (g)</label>
            <input class="form-input" id="setting-carbs" type="number" value="${profile.carbGoal || 250}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="setting-fat">Fat (g)</label>
            <input class="form-input" id="setting-fat" type="number" value="${profile.fatGoal || 65}" />
          </div>
        </div>

        <button class="btn btn--primary" id="btn-save-settings" style="margin-top: var(--sp-4)">Save Settings</button>

        <h2 class="section-title" style="margin-top: var(--sp-7)">Data Management</h2>
        <div style="display: flex; gap: var(--sp-3); flex-wrap: wrap">
          <button class="btn btn--ghost" id="btn-export">📤 Export All Data</button>
          <label class="btn btn--ghost" style="cursor: pointer">
            📥 Import Data
            <input type="file" accept=".json" id="btn-import" style="display: none" />
          </label>
          <button class="btn btn--ghost" id="btn-clear" style="color: var(--clr-rose)">🗑️ Clear All Data</button>
        </div>

        <div style="margin-top: var(--sp-7); padding: var(--sp-5); border-radius: var(--r-lg); border: 1px solid var(--clr-border); background: var(--clr-surface)">
          <h3 style="font-size: var(--fs-sm); font-weight: 600; margin-bottom: var(--sp-3)">Crowdsource Queue</h3>
          <p style="font-size: var(--fs-xs); color: var(--clr-text-3)">
            ${(store.get(KEYS.FOOD_QUEUE, [])).length} custom food items submitted to the community queue.
          </p>
        </div>
      </div>
    </div>
  `;

  // Save
  document.getElementById('btn-save-settings').addEventListener('click', () => {
    const updated = {
      name: document.getElementById('setting-name').value.trim(),
      dob: document.getElementById('setting-dob').value,
      lifeExpectancy: +document.getElementById('setting-life-exp').value || 80,
      calorieGoal: +document.getElementById('setting-cal').value || 2000,
      proteinGoal: +document.getElementById('setting-protein').value || 120,
      carbGoal: +document.getElementById('setting-carbs').value || 250,
      fatGoal: +document.getElementById('setting-fat').value || 65,
    };
    store.set(KEYS.PROFILE, updated);
    showToast('Settings saved ✓');
  });

  // Export
  document.getElementById('btn-export').addEventListener('click', () => {
    const data = {};
    Object.values(KEYS).forEach(k => { data[k] = store.get(k); });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `workout-buddy-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import
  document.getElementById('btn-import').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.entries(data).forEach(([k, v]) => store.set(k, v));
        showToast('Data imported ✓');
        renderSettings();
      } catch { showToast('Invalid file format'); }
    };
    reader.readAsText(file);
  });

  // Clear
  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      Object.values(KEYS).forEach(k => store.remove(k));
      showToast('All data cleared');
      renderSettings();
    }
  });
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
