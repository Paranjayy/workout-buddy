// Life Progress view

import { store, KEYS } from '../utils/storage.js';
import { lifeProgress, yearProgress, quarterProgress, monthProgress, weekProgress, dayProgress } from '../utils/time.js';

function makeRingSvg(percent, color, size = 100, label = '') {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(percent, 100) / 100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(90% 0.01 75)" stroke-width="6"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
      stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 ${size/2} ${size/2})"
      style="transition: stroke-dashoffset 1.2s cubic-bezier(0.25,1,0.5,1)"/>
    <text x="${size/2}" y="${size/2 - 6}" text-anchor="middle" dominant-baseline="central"
      font-family="var(--ff-display)" font-size="${size * 0.18}" font-weight="700"
      fill="oklch(22% 0.02 60)">${percent.toFixed(1)}%</text>
    ${label ? `<text x="${size/2}" y="${size/2 + 14}" text-anchor="middle"
      font-family="var(--ff-body)" font-size="${size * 0.1}" font-weight="500"
      fill="oklch(50% 0.02 60)">${label}</text>` : ''}
  </svg>`;
}

export function renderProgress() {
  const main = document.getElementById('main-content');
  const profile = store.get(KEYS.PROFILE, {});
  const lp = profile.dob ? lifeProgress(profile.dob, profile.lifeExpectancy || 80) : null;

  const now = new Date();
  const yp = yearProgress();
  const qp = quarterProgress();
  const mp = monthProgress();
  const wp = weekProgress();
  const dp = dayProgress();
  const q = Math.floor(now.getMonth() / 3) + 1;

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">AWARENESS</p>
        <h1 class="page-header__title">Life Progress</h1>
      </div>

      ${lp ? `
      <div style="margin-bottom: var(--sp-7); padding: var(--sp-6); border-radius: var(--r-lg); border: 1px solid var(--clr-border); background: var(--clr-surface)">
        <div style="display: flex; align-items: center; gap: var(--sp-6); flex-wrap: wrap">
          <div>${makeRingSvg(lp.percentLived, 'oklch(55% 0.15 300)', 120)}</div>
          <div style="flex: 1; min-width: 200px">
            <h2 style="font-family: var(--ff-display); font-size: var(--fs-xl); font-weight: 700; margin-bottom: var(--sp-3)">
              ${lp.ageYears} years old
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3)">
              <div><span style="font-size: var(--fs-xs); color: var(--clr-text-3); text-transform: uppercase; letter-spacing: 0.06em">Days Lived</span><br><strong style="font-variant-numeric: tabular-nums">${lp.ageDays.toLocaleString()}</strong></div>
              <div><span style="font-size: var(--fs-xs); color: var(--clr-text-3); text-transform: uppercase; letter-spacing: 0.06em">Days Remaining</span><br><strong style="font-variant-numeric: tabular-nums">${lp.daysRemaining.toLocaleString()}</strong></div>
              <div><span style="font-size: var(--fs-xs); color: var(--clr-text-3); text-transform: uppercase; letter-spacing: 0.06em">Weeks Left</span><br><strong style="font-variant-numeric: tabular-nums">${lp.weeksRemaining.toLocaleString()}</strong></div>
              <div><span style="font-size: var(--fs-xs); color: var(--clr-text-3); text-transform: uppercase; letter-spacing: 0.06em">Life Used</span><br><strong style="font-variant-numeric: tabular-nums">${lp.percentLived.toFixed(2)}%</strong></div>
            </div>
          </div>
        </div>
      </div>
      ` : `
      <div class="empty-state" style="margin-bottom: var(--sp-7); padding: var(--sp-7); border: 1px solid var(--clr-border); border-radius: var(--r-lg); background: var(--clr-surface)">
        <div class="empty-state__icon">🎂</div>
        <p class="empty-state__text">Add your date of birth in Settings to see your life progress visualization.</p>
        <button class="btn btn--primary" onclick="window.__navigate && window.__navigate('settings')">Go to Settings</button>
      </div>
      `}

      <div class="progress-section">
        <h2 class="progress-section__title">Time Awareness</h2>
        <div class="progress-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))">
          <div class="progress-ring-card">
            ${makeRingSvg(dp, 'oklch(55% 0.18 155)', 100, 'Day')}
            <span class="progress-ring-card__label">Today</span>
            <span class="progress-ring-card__detail">${now.toLocaleDateString('en-US', { weekday: 'long' })}</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(wp, 'oklch(62% 0.14 240)', 100, 'Week')}
            <span class="progress-ring-card__label">This Week</span>
            <span class="progress-ring-card__detail">Week ${Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)}</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(mp, 'oklch(72% 0.16 75)', 100, 'Month')}
            <span class="progress-ring-card__label">${now.toLocaleDateString('en-US', { month: 'long' })}</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(qp, 'oklch(62% 0.2 15)', 100, 'Quarter')}
            <span class="progress-ring-card__label">Q${q} ${now.getFullYear()}</span>
          </div>
          <div class="progress-ring-card">
            ${makeRingSvg(yp, 'oklch(55% 0.15 300)', 100, 'Year')}
            <span class="progress-ring-card__label">${now.getFullYear()}</span>
            <span class="progress-ring-card__detail">Day ${Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / 86400000)} of ${new Date(now.getFullYear(), 1, 29).getDate() === 29 ? 366 : 365}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
