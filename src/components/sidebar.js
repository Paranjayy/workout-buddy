// Sidebar navigation component

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/></svg>` },
  { id: 'workout', label: 'Workouts', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11M6.5 17.5h11"/><path d="M4 10v4M8 8v8M16 8v8M20 10v4"/></svg>` },
  { id: 'calories', label: 'Nutrition', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 4-6 8-6 11a6 6 0 0 0 12 0c0-3-2-7-6-11z"/></svg>` },
  { id: 'body', label: 'Body & Water', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 2.5-4 6-4 6s-4-3.5-4-6a4 4 0 0 1 4-4z"/><path d="M6 20c0-3 2.5-5 6-5s6 2 6 5"/></svg>` },
  { id: 'timer', label: 'Timer', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6M12 2v3"/></svg>` },
  { id: 'progress', label: 'Life Progress', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>` },
  { id: 'calendar', label: 'Calendar', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>` },
  { id: 'music', label: 'Music', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>` },
];

export function renderSidebar(activeView, onNavigate) {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = NAV_ITEMS.map(item => `
    <button
      class="nav-item ${item.id === activeView ? 'nav-item--active' : ''}"
      data-view="${item.id}"
      aria-label="Navigate to ${item.label}"
      id="nav-${item.id}"
    >
      ${item.icon}
      <span>${item.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => onNavigate(btn.dataset.view));
  });

  document.getElementById('btn-settings').addEventListener('click', () => onNavigate('settings'));
}
