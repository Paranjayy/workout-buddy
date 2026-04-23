// Calorie / Nutrition tracker view

import { searchFoods, FOOD_DB, getRegions } from '../data/foods.js';
import { store, KEYS } from '../utils/storage.js';
import { todayKey, uid } from '../utils/time.js';

function getMeals(date) {
  return store.get(KEYS.MEALS, []).filter(m => m.date === date);
}

function saveMealItem(mealType, foodItem) {
  const meals = store.get(KEYS.MEALS, []);
  let meal = meals.find(m => m.date === todayKey() && m.type === mealType);
  if (!meal) {
    meal = { id: uid(), date: todayKey(), type: mealType, items: [] };
    meals.push(meal);
  }
  meal.items.push({ ...foodItem, entryId: uid() });
  store.set(KEYS.MEALS, meals);
}

function removeMealItem(mealType, entryId) {
  const meals = store.get(KEYS.MEALS, []);
  const meal = meals.find(m => m.date === todayKey() && m.type === mealType);
  if (meal) {
    meal.items = meal.items.filter(i => i.entryId !== entryId);
    store.set(KEYS.MEALS, meals);
  }
}

function makeRingSvg(percent, color, size = 56) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(percent, 100) / 100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="macro__ring">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(90% 0.01 75)" stroke-width="4"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="4"
      stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 ${size/2} ${size/2})" style="transition: stroke-dashoffset 0.6s cubic-bezier(0.25,1,0.5,1)"/>
  </svg>`;
}

export function renderCalories() {
  const main = document.getElementById('main-content');
  const profile = store.get(KEYS.PROFILE, {});
  const calGoal = profile.calorieGoal || 2000;
  const proteinGoal = profile.proteinGoal || 120;
  const carbGoal = profile.carbGoal || 250;
  const fatGoal = profile.fatGoal || 65;

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">NUTRITION</p>
        <h1 class="page-header__title">Calorie Tracker</h1>
      </div>

      <div id="macro-overview"></div>

      <div class="search-bar">
        <input type="text" class="search-bar__input" id="food-search" placeholder="Search foods from around the world... (try 'biryani', 'sushi', 'tacos')" autocomplete="off" />
        <select class="form-select" id="meal-type-select" style="width: 140px; flex-shrink: 0">
          <option value="breakfast">🌅 Breakfast</option>
          <option value="lunch" selected>🌞 Lunch</option>
          <option value="dinner">🌙 Dinner</option>
          <option value="snack">🍎 Snack</option>
        </select>
      </div>
      <div id="food-results" class="food-results" style="display:none"></div>

      <div id="meals-list"></div>

      <div class="crowd-banner" id="crowd-banner">
        <div class="crowd-banner__text">
          <strong>Can't find something?</strong> Add it to the community queue — we'll verify and add it to our database.
        </div>
        <button class="btn btn--ghost btn--sm" id="btn-add-custom">+ Add Custom Food</button>
      </div>

      <div id="custom-food-form" style="display:none; margin-top: var(--sp-5); padding: var(--sp-5); border: 1px solid var(--clr-border); border-radius: var(--r-lg); background: var(--clr-surface)">
        <h3 class="section-title">Add Custom Food</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--sp-3)">
          <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="cf-name" /></div>
          <div class="form-group"><label class="form-label">Calories</label><input class="form-input" id="cf-cal" type="number" /></div>
          <div class="form-group"><label class="form-label">Protein (g)</label><input class="form-input" id="cf-protein" type="number" /></div>
          <div class="form-group"><label class="form-label">Carbs (g)</label><input class="form-input" id="cf-carbs" type="number" /></div>
          <div class="form-group"><label class="form-label">Fat (g)</label><input class="form-input" id="cf-fat" type="number" /></div>
          <div class="form-group"><label class="form-label">Region</label><input class="form-input" id="cf-region" placeholder="e.g. 🇮🇳 Indian" /></div>
        </div>
        <div style="display: flex; gap: var(--sp-3); margin-top: var(--sp-3)">
          <button class="btn btn--primary" id="btn-save-custom">Save & Add</button>
          <button class="btn btn--ghost" id="btn-cancel-custom">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const searchInput = document.getElementById('food-search');
  const resultsDiv = document.getElementById('food-results');
  const mealSelect = document.getElementById('meal-type-select');

  // Search
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    const customFoods = store.get(KEYS.CUSTOM_FOODS, []);
    const allFoods = [...FOOD_DB, ...customFoods];
    const ql = q.toLowerCase();
    if (!ql) { resultsDiv.style.display = 'none'; return; }
    const matches = allFoods.filter(f =>
      f.name.toLowerCase().includes(ql) || f.region.toLowerCase().includes(ql)
    ).slice(0, 12);
    if (!matches.length) {
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = `<div style="padding: var(--sp-4); text-align: center; color: var(--clr-text-3); font-size: var(--fs-sm)">No results for "${q}" — try adding it as custom food below</div>`;
      return;
    }
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = matches.map(f => `
      <div class="food-result" data-name="${f.name}">
        <span class="food-item__name">${f.name} <span style="font-size: var(--fs-xs); color: var(--clr-text-3)">${f.serving || ''}</span></span>
        <span class="food-item__region">${f.region}</span>
        <span class="food-item__cal">${f.cal} cal</span>
      </div>
    `).join('');
    resultsDiv.querySelectorAll('.food-result').forEach(el => {
      el.addEventListener('click', () => {
        const food = allFoods.find(f => f.name === el.dataset.name);
        if (food) {
          saveMealItem(mealSelect.value, food);
          resultsDiv.style.display = 'none';
          searchInput.value = '';
          renderMeals();
          renderMacros();
          showToast(`${food.name} added ✓`);
        }
      });
    });
  });

  // Custom food
  document.getElementById('btn-add-custom').addEventListener('click', () => {
    document.getElementById('custom-food-form').style.display = 'block';
  });
  document.getElementById('btn-cancel-custom').addEventListener('click', () => {
    document.getElementById('custom-food-form').style.display = 'none';
  });
  document.getElementById('btn-save-custom').addEventListener('click', () => {
    const food = {
      name: document.getElementById('cf-name').value,
      cal: +document.getElementById('cf-cal').value || 0,
      protein: +document.getElementById('cf-protein').value || 0,
      carbs: +document.getElementById('cf-carbs').value || 0,
      fat: +document.getElementById('cf-fat').value || 0,
      region: document.getElementById('cf-region').value || '🌍 Custom',
      serving: '1 serving',
    };
    if (!food.name) return;
    store.push(KEYS.CUSTOM_FOODS, food);
    store.push(KEYS.FOOD_QUEUE, { ...food, submitted: new Date().toISOString() });
    saveMealItem(mealSelect.value, food);
    document.getElementById('custom-food-form').style.display = 'none';
    renderMeals();
    renderMacros();
    showToast(`${food.name} saved & added ✓`);
  });

  renderMeals();
  renderMacros();

  function renderMacros() {
    const meals = getMeals(todayKey());
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    meals.forEach(m => (m.items || []).forEach(i => {
      totalCal += i.cal || 0;
      totalP += i.protein || 0;
      totalC += i.carbs || 0;
      totalF += i.fat || 0;
    }));

    document.getElementById('macro-overview').innerHTML = `
      <div class="macro-bar">
        <div class="macro">
          ${makeRingSvg((totalCal / calGoal) * 100, 'oklch(55% 0.18 155)')}
          <span class="macro__label">Calories</span>
          <span class="macro__value">${totalCal} / ${calGoal}</span>
        </div>
        <div class="macro">
          ${makeRingSvg((totalP / proteinGoal) * 100, 'oklch(62% 0.14 240)')}
          <span class="macro__label">Protein</span>
          <span class="macro__value">${Math.round(totalP)}g / ${proteinGoal}g</span>
        </div>
        <div class="macro">
          ${makeRingSvg((totalC / carbGoal) * 100, 'oklch(72% 0.16 75)')}
          <span class="macro__label">Carbs</span>
          <span class="macro__value">${Math.round(totalC)}g / ${carbGoal}g</span>
        </div>
        <div class="macro">
          ${makeRingSvg((totalF / fatGoal) * 100, 'oklch(62% 0.2 15)')}
          <span class="macro__label">Fat</span>
          <span class="macro__value">${Math.round(totalF)}g / ${fatGoal}g</span>
        </div>
      </div>
    `;
  }

  function renderMeals() {
    const meals = getMeals(todayKey());
    const types = ['breakfast', 'lunch', 'dinner', 'snack'];
    const emojis = { breakfast: '🌅', lunch: '🌞', dinner: '🌙', snack: '🍎' };

    document.getElementById('meals-list').innerHTML = types.map(type => {
      const meal = meals.find(m => m.type === type);
      const items = meal ? meal.items : [];
      const total = items.reduce((s, i) => s + (i.cal || 0), 0);
      return `
        <div class="meal-section">
          <div class="meal-section__header">
            <span class="meal-section__title">${emojis[type]} ${type}</span>
            <span class="meal-section__total">${total} cal</span>
          </div>
          ${items.length ? items.map(i => `
            <div class="food-item">
              <span class="food-item__name">${i.name}</span>
              <span class="food-item__region">${i.region}</span>
              <span class="food-item__cal">${i.cal} cal</span>
            </div>
          `).join('') : `<div style="padding: var(--sp-3) var(--sp-4); font-size: var(--fs-xs); color: var(--clr-text-3)">Nothing logged yet</div>`}
        </div>
      `;
    }).join('');
  }
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
