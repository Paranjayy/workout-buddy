// Time & date utilities

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export function daysInYear(year = new Date().getFullYear()) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

// Life progress calculator
export function lifeProgress(dobStr, lifeExpectancy = 80) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const now = new Date();
  const ageMs = now - dob;
  const ageDays = ageMs / 86400000;
  const ageYears = ageDays / 365.25;
  const totalDays = lifeExpectancy * 365.25;
  return {
    ageYears: Math.floor(ageYears * 10) / 10,
    ageDays: Math.floor(ageDays),
    percentLived: Math.min(100, (ageDays / totalDays) * 100),
    daysRemaining: Math.max(0, Math.floor(totalDays - ageDays)),
    weeksRemaining: Math.max(0, Math.floor((totalDays - ageDays) / 7)),
  };
}

// Period progress
export function yearProgress() {
  const now = new Date();
  return (dayOfYear(now) / daysInYear(now.getFullYear())) * 100;
}

export function monthProgress() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return ((now.getDate() - 1 + now.getHours() / 24) / daysInMonth) * 100;
}

export function weekProgress() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const hours = now.getHours();
  return (((day === 0 ? 7 : day) - 1 + hours / 24) / 7) * 100;
}

export function dayProgress() {
  const now = new Date();
  return ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100;
}

export function quarterProgress() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  const qStart = new Date(now.getFullYear(), q * 3, 1);
  const qEnd = new Date(now.getFullYear(), (q + 1) * 3, 1);
  return ((now - qStart) / (qEnd - qStart)) * 100;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
