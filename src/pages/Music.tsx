import { useState } from 'react'
import { PLAYLISTS, getLanguages } from '../data/playlists'
import { store, KEYS } from '../utils/storage'
import type { Playlist } from '../types'

export function Music() {
  const [lang, setLang] = useState('all')
  const [nowPlaying, setNowPlaying] = useState<string | null>(null)
  const [customUrl, setCustomUrl] = useState('')
  const [customName, setCustomName] = useState('')
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => store.get<Playlist[]>(KEYS.CUSTOM_PLAYLISTS, []))
  const languages = getLanguages()

  const filtered = lang === 'all' ? PLAYLISTS : PLAYLISTS.filter(p => p.language === lang)

  const addCustom = () => {
    const match = customUrl.match(/[?&]list=([^&]+)/)
    if (!match) return alert('Invalid YouTube playlist URL')
    const p: Playlist = {
      id: 'custom-' + Date.now(), title: customName || 'My Playlist',
      emoji: '🎵', genre: 'Custom', language: 'Various', description: 'Your playlist',
      ytPlaylistId: match[1], trackCount: 0,
    }
    const next = [...customPlaylists, p]
    store.set(KEYS.CUSTOM_PLAYLISTS, next)
    setCustomPlaylists(next)
    setCustomUrl(''); setCustomName('')
  }

  return (
    <div className="view-enter">
      <div className="page-header">
        <p className="page-header__greeting">VIBES</p>
        <h1 className="page-header__title">Workout Music</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-6)' }}>
        {['all', ...languages].map(l => (
          <button key={l} className={`btn btn--sm ${lang === l ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setLang(l)}>
            {l === 'all' ? 'All' : l}
          </button>
        ))}
      </div>

      <div className="playlist-grid">
        {filtered.map(p => (
          <button key={p.id} className="playlist-card" onClick={() => setNowPlaying(p.ytPlaylistId)}
            style={{ textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            <div className="playlist-card__cover">{p.emoji}</div>
            <div className="playlist-card__body">
              <div className="playlist-card__title">{p.title}</div>
              <div className="playlist-card__meta">{p.genre} · {p.language} · {p.trackCount} tracks</div>
            </div>
          </button>
        ))}
      </div>

      {nowPlaying && (
        <div style={{ marginTop: 'var(--sp-6)' }}>
          <h3 className="section-title">Now Playing</h3>
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '16/9', maxWidth: 640 }}>
            <iframe
              width="100%" height="100%" frameBorder="0"
              allow="autoplay; encrypted-media" allowFullScreen
              src={`https://www.youtube.com/embed/videoseries?list=${nowPlaying}&autoplay=1`}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--sp-7)' }}>
        <h2 className="section-title">Bring Your Own Playlist</h2>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-3)', marginBottom: 'var(--sp-4)' }}>
          Paste any YouTube playlist URL to add it to your collection.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
          <input className="form-input" value={customUrl} onChange={e => setCustomUrl(e.target.value)}
            placeholder="https://youtube.com/playlist?list=…" style={{ flex: '1 1 300px' }} />
          <input className="form-input" value={customName} onChange={e => setCustomName(e.target.value)}
            placeholder="Playlist name" style={{ flex: '0 1 200px' }} />
          <button className="btn btn--primary" onClick={addCustom}>Add</button>
        </div>
        {customPlaylists.length > 0 && (
          <div className="playlist-grid" style={{ marginTop: 'var(--sp-4)' }}>
            {customPlaylists.map(p => (
              <button key={p.id} className="playlist-card" onClick={() => setNowPlaying(p.ytPlaylistId)}
                style={{ textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                <div className="playlist-card__cover">{p.emoji}</div>
                <div className="playlist-card__body">
                  <div className="playlist-card__title">{p.title}</div>
                  <div className="playlist-card__meta">Custom playlist</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
