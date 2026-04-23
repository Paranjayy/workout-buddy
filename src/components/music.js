// Music / YouTube playlist view

import { PLAYLISTS, getLanguages } from '../data/playlists.js';
import { store, KEYS } from '../utils/storage.js';

export function renderMusic() {
  const main = document.getElementById('main-content');
  const languages = getLanguages();
  const customPlaylists = store.get(KEYS.CUSTOM_PLAYLISTS, []);

  main.innerHTML = `
    <div class="view-enter">
      <div class="page-header">
        <p class="page-header__greeting">VIBES</p>
        <h1 class="page-header__title">Workout Music</h1>
      </div>

      <div style="display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-bottom: var(--sp-6)">
        <button class="btn btn--primary btn--sm lang-filter lang-filter--active" data-lang="all">All</button>
        ${languages.map(l => `<button class="btn btn--ghost btn--sm lang-filter" data-lang="${l}">${l}</button>`).join('')}
      </div>

      <div class="playlist-grid" id="playlist-grid">
        ${PLAYLISTS.map(p => playlistCard(p)).join('')}
      </div>

      <div style="margin-top: var(--sp-7)">
        <h2 class="section-title">Bring Your Own Playlist</h2>
        <p style="font-size: var(--fs-sm); color: var(--clr-text-3); margin-bottom: var(--sp-4)">
          Paste a YouTube playlist URL to add it to your collection.
        </p>
        <div class="search-bar">
          <input type="text" class="search-bar__input" id="custom-playlist-url" placeholder="https://youtube.com/playlist?list=..." />
          <input type="text" class="search-bar__input" id="custom-playlist-name" placeholder="Playlist name" style="max-width: 200px" />
          <button class="btn btn--primary" id="btn-add-playlist">Add</button>
        </div>
      </div>

      ${customPlaylists.length ? `
      <div style="margin-top: var(--sp-5)">
        <h3 class="section-title">Your Playlists</h3>
        <div class="playlist-grid">
          ${customPlaylists.map(p => `
            <div class="playlist-card" data-yt="${p.ytPlaylistId}">
              <div class="playlist-card__cover">🎵</div>
              <div class="playlist-card__body">
                <div class="playlist-card__title">${p.title}</div>
                <div class="playlist-card__meta">Custom playlist</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div id="yt-embed" style="margin-top: var(--sp-6); display: none">
        <h3 class="section-title">Now Playing</h3>
        <div style="border-radius: var(--r-lg); overflow: hidden; aspect-ratio: 16/9; max-width: 640px">
          <iframe id="yt-iframe" width="100%" height="100%" frameborder="0"
            allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  // Language filter
  document.querySelectorAll('.lang-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-filter').forEach(b => {
        b.classList.remove('lang-filter--active', 'btn--primary');
        b.classList.add('btn--ghost');
      });
      btn.classList.add('lang-filter--active', 'btn--primary');
      btn.classList.remove('btn--ghost');

      const lang = btn.dataset.lang;
      const filtered = lang === 'all' ? PLAYLISTS : PLAYLISTS.filter(p => p.language === lang);
      document.getElementById('playlist-grid').innerHTML = filtered.map(p => playlistCard(p)).join('');
      attachPlaylistClicks();
    });
  });

  // Add custom playlist
  document.getElementById('btn-add-playlist').addEventListener('click', () => {
    const url = document.getElementById('custom-playlist-url').value.trim();
    const name = document.getElementById('custom-playlist-name').value.trim();
    if (!url) return;
    const listMatch = url.match(/[?&]list=([^&]+)/);
    if (!listMatch) { alert('Invalid YouTube playlist URL'); return; }
    const playlist = {
      id: 'custom-' + Date.now(),
      title: name || 'My Playlist',
      ytPlaylistId: listMatch[1],
    };
    store.push(KEYS.CUSTOM_PLAYLISTS, playlist);
    renderMusic(); // re-render
  });

  attachPlaylistClicks();
}

function playlistCard(p) {
  return `
    <div class="playlist-card" data-yt="${p.ytPlaylistId}">
      <div class="playlist-card__cover">${p.emoji || '🎵'}</div>
      <div class="playlist-card__body">
        <div class="playlist-card__title">${p.title}</div>
        <div class="playlist-card__meta">${p.genre || ''} · ${p.language || ''} · ${p.trackCount || '?'} tracks</div>
      </div>
    </div>
  `;
}

function attachPlaylistClicks() {
  document.querySelectorAll('.playlist-card').forEach(card => {
    card.addEventListener('click', () => {
      const ytId = card.dataset.yt;
      const embed = document.getElementById('yt-embed');
      const iframe = document.getElementById('yt-iframe');
      embed.style.display = 'block';
      iframe.src = `https://www.youtube.com/embed/videoseries?list=${ytId}&autoplay=1`;
      embed.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
