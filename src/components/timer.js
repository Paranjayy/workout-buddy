// Workout timer — rest period countdown + stopwatch

import { store } from '../utils/storage.js';

let timerInterval = null;
let timerSeconds = 0;
let timerMode = 'countdown'; // 'countdown' | 'stopwatch'
let timerTarget = 90;
let timerCallback = null;

export function renderTimer() {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">FOCUS</p>
        <h1 class="page-header__title">Workout Timer</h1>
      </div>

      <div class="tabs" id="timer-tabs">
        <button class="tab tab--active" data-tab="rest">Rest Timer</button>
        <button class="tab" data-tab="stopwatch">Stopwatch</button>
        <button class="tab" data-tab="tabata">Tabata</button>
      </div>

      <div id="timer-content"></div>
    </div>
  `;

  const tabs = document.querySelectorAll('#timer-tabs .tab');
  const content = document.getElementById('timer-content');

  function showTab(name) {
    tabs.forEach(t => t.classList.toggle('tab--active', t.dataset.tab === name));
    stopTimer();
    if (name === 'rest') renderRestTimer(content);
    else if (name === 'stopwatch') renderStopwatch(content);
    else renderTabata(content);
  }

  tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
  showTab('rest');
}

function renderRestTimer(container) {
  timerMode = 'countdown';
  timerTarget = 90;
  timerSeconds = 90;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--sp-6); padding: var(--sp-7) 0">
      <div class="timer-display" id="timer-display">
        ${formatTime(timerSeconds)}
      </div>

      <div style="display: flex; gap: var(--sp-3); flex-wrap: wrap; justify-content: center">
        ${[30, 60, 90, 120, 180].map(s => `
          <button class="btn ${s === 90 ? 'btn--primary' : 'btn--ghost'} btn--sm timer-preset" data-secs="${s}">${s}s</button>
        `).join('')}
      </div>

      <div style="display: flex; gap: var(--sp-4)">
        <button class="btn btn--primary" id="timer-start" style="min-width: 120px">Start</button>
        <button class="btn btn--ghost" id="timer-reset">Reset</button>
      </div>

      <div id="timer-done-msg" style="display: none; text-align: center">
        <p style="font-family: var(--ff-display); font-size: var(--fs-xl); font-weight: 700; color: var(--clr-accent)">
          Time's up! 💪
        </p>
        <p style="font-size: var(--fs-sm); color: var(--clr-text-3); margin-top: var(--sp-2)">
          Get back to work!
        </p>
      </div>
    </div>
  `;

  addTimerStyles();

  container.querySelectorAll('.timer-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.timer-preset').forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--ghost');
      });
      btn.classList.remove('btn--ghost');
      btn.classList.add('btn--primary');
      timerTarget = +btn.dataset.secs;
      timerSeconds = timerTarget;
      stopTimer();
      updateDisplay(timerSeconds);
      document.getElementById('timer-done-msg').style.display = 'none';
    });
  });

  document.getElementById('timer-start').addEventListener('click', () => {
    const btn = document.getElementById('timer-start');
    if (timerInterval) {
      stopTimer();
      btn.textContent = 'Start';
    } else {
      startCountdown();
      btn.textContent = 'Pause';
    }
  });

  document.getElementById('timer-reset').addEventListener('click', () => {
    stopTimer();
    timerSeconds = timerTarget;
    updateDisplay(timerSeconds);
    document.getElementById('timer-start').textContent = 'Start';
    document.getElementById('timer-done-msg').style.display = 'none';
  });
}

function renderStopwatch(container) {
  timerMode = 'stopwatch';
  timerSeconds = 0;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--sp-6); padding: var(--sp-7) 0">
      <div class="timer-display" id="timer-display">
        ${formatTime(0)}
      </div>

      <div style="display: flex; gap: var(--sp-4)">
        <button class="btn btn--primary" id="timer-start" style="min-width: 120px">Start</button>
        <button class="btn btn--ghost" id="timer-lap">Lap</button>
        <button class="btn btn--ghost" id="timer-reset">Reset</button>
      </div>

      <div id="lap-list" style="width: 100%; max-width: 300px"></div>
    </div>
  `;

  addTimerStyles();
  let laps = [];

  document.getElementById('timer-start').addEventListener('click', () => {
    const btn = document.getElementById('timer-start');
    if (timerInterval) {
      stopTimer();
      btn.textContent = 'Start';
    } else {
      startStopwatch();
      btn.textContent = 'Pause';
    }
  });

  document.getElementById('timer-lap').addEventListener('click', () => {
    laps.push(timerSeconds);
    const list = document.getElementById('lap-list');
    list.innerHTML = laps.map((l, i) => `
      <div style="display: flex; justify-content: space-between; padding: var(--sp-2) 0; border-bottom: 1px solid var(--clr-border); font-size: var(--fs-sm)">
        <span style="color: var(--clr-text-3)">Lap ${i + 1}</span>
        <span style="font-weight: 600; font-variant-numeric: tabular-nums">${formatTime(l)}</span>
      </div>
    `).join('');
  });

  document.getElementById('timer-reset').addEventListener('click', () => {
    stopTimer();
    timerSeconds = 0;
    laps = [];
    updateDisplay(0);
    document.getElementById('timer-start').textContent = 'Start';
    document.getElementById('lap-list').innerHTML = '';
  });
}

function renderTabata(container) {
  let tabataWork = 20;
  let tabataRest = 10;
  let tabataRounds = 8;
  let currentRound = 0;
  let isWork = true;
  let tabataRunning = false;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--sp-6); padding: var(--sp-7) 0">
      <div class="timer-display" id="timer-display" style="color: var(--clr-accent)">
        ${formatTime(tabataWork)}
      </div>

      <div id="tabata-phase" style="font-size: var(--fs-lg); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--clr-accent)">
        WORK
      </div>
      <div id="tabata-round" style="font-size: var(--fs-sm); color: var(--clr-text-3)">
        Round 0 / ${tabataRounds}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--sp-4); width: 100%; max-width: 360px">
        <div class="form-group">
          <label class="form-label">Work (s)</label>
          <input class="form-input" id="tabata-work" type="number" value="${tabataWork}" min="5" max="120" />
        </div>
        <div class="form-group">
          <label class="form-label">Rest (s)</label>
          <input class="form-input" id="tabata-rest" type="number" value="${tabataRest}" min="5" max="120" />
        </div>
        <div class="form-group">
          <label class="form-label">Rounds</label>
          <input class="form-input" id="tabata-rounds" type="number" value="${tabataRounds}" min="1" max="20" />
        </div>
      </div>

      <div style="display: flex; gap: var(--sp-4)">
        <button class="btn btn--primary" id="tabata-start" style="min-width: 120px">Start</button>
        <button class="btn btn--ghost" id="tabata-reset">Reset</button>
      </div>
    </div>
  `;

  addTimerStyles();

  document.getElementById('tabata-start').addEventListener('click', () => {
    const btn = document.getElementById('tabata-start');
    if (tabataRunning) {
      stopTimer();
      tabataRunning = false;
      btn.textContent = 'Start';
      return;
    }
    tabataWork = +document.getElementById('tabata-work').value || 20;
    tabataRest = +document.getElementById('tabata-rest').value || 10;
    tabataRounds = +document.getElementById('tabata-rounds').value || 8;
    currentRound = 1;
    isWork = true;
    timerSeconds = tabataWork;
    tabataRunning = true;
    btn.textContent = 'Pause';
    updateTabataUI();
    updateDisplay(timerSeconds);

    timerInterval = setInterval(() => {
      timerSeconds--;
      updateDisplay(timerSeconds);
      if (timerSeconds <= 0) {
        if (isWork) {
          // Switch to rest
          isWork = false;
          timerSeconds = tabataRest;
        } else {
          // Switch to work, next round
          currentRound++;
          if (currentRound > tabataRounds) {
            stopTimer();
            tabataRunning = false;
            btn.textContent = 'Start';
            document.getElementById('tabata-phase').textContent = 'DONE! 🎉';
            document.getElementById('tabata-phase').style.color = 'var(--clr-accent)';
            playSound();
            return;
          }
          isWork = true;
          timerSeconds = tabataWork;
        }
        updateTabataUI();
        playSound();
      }
    }, 1000);
  });

  function updateTabataUI() {
    const phase = document.getElementById('tabata-phase');
    const round = document.getElementById('tabata-round');
    const display = document.getElementById('timer-display');
    phase.textContent = isWork ? 'WORK' : 'REST';
    phase.style.color = isWork ? 'var(--clr-accent)' : 'var(--clr-amber)';
    display.style.color = isWork ? 'var(--clr-accent)' : 'var(--clr-amber)';
    round.textContent = `Round ${currentRound} / ${tabataRounds}`;
  }

  document.getElementById('tabata-reset').addEventListener('click', () => {
    stopTimer();
    tabataRunning = false;
    currentRound = 0;
    isWork = true;
    timerSeconds = +document.getElementById('tabata-work').value || 20;
    updateDisplay(timerSeconds);
    document.getElementById('tabata-start').textContent = 'Start';
    document.getElementById('tabata-phase').textContent = 'WORK';
    document.getElementById('tabata-phase').style.color = 'var(--clr-accent)';
    document.getElementById('timer-display').style.color = 'var(--clr-accent)';
    document.getElementById('tabata-round').textContent = `Round 0 / ${+document.getElementById('tabata-rounds').value || 8}`;
  });
}

// --- Helpers ---

function startCountdown() {
  document.getElementById('timer-done-msg').style.display = 'none';
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateDisplay(timerSeconds);
    if (timerSeconds <= 0) {
      stopTimer();
      document.getElementById('timer-start').textContent = 'Start';
      document.getElementById('timer-done-msg').style.display = 'block';
      playSound();
    }
  }, 1000);
}

function startStopwatch() {
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateDisplay(timerSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateDisplay(secs) {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = formatTime(Math.max(0, secs));
}

function formatTime(totalSecs) {
  const m = Math.floor(Math.abs(totalSecs) / 60);
  const s = Math.abs(totalSecs) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

function addTimerStyles() {
  if (document.getElementById('timer-styles')) return;
  const style = document.createElement('style');
  style.id = 'timer-styles';
  style.textContent = `
    .timer-display {
      font-family: var(--ff-display);
      font-size: clamp(4rem, 10vw, 8rem);
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--clr-text);
      transition: color 0.3s cubic-bezier(0.25,1,0.5,1);
    }
  `;
  document.head.appendChild(style);
}
