// Curated YouTube playlists for workouts

export const PLAYLISTS = [
  {
    id: 'workout-hiphop',
    title: 'Workout Hip-Hop',
    emoji: '🔥',
    genre: 'Hip-Hop',
    language: 'English',
    description: 'High energy beats for heavy lifting',
    ytPlaylistId: 'PLgBV8DkojMkT8pKdIcJJaCkP-xRF2WW2F',
    trackCount: 50,
  },
  {
    id: 'bollywood-pump',
    title: 'Bollywood Pump',
    emoji: '💪',
    genre: 'Bollywood',
    language: 'Hindi',
    description: 'Desi beats that hit different in the gym',
    ytPlaylistId: 'PLjity7Lwv-zoCQMVDiiNeaKQoFKIdD3Y6S',
    trackCount: 40,
  },
  {
    id: 'kpop-cardio',
    title: 'K-Pop Cardio',
    emoji: '🏃',
    genre: 'K-Pop',
    language: 'Korean',
    description: 'Fast-paced K-Pop for cardio sessions',
    ytPlaylistId: 'PLFgquLnL59akA2PflFnhDNfBt4MH28wN0',
    trackCount: 35,
  },
  {
    id: 'lofi-yoga',
    title: 'Lo-Fi Yoga',
    emoji: '🧘',
    genre: 'Lo-Fi',
    language: 'Instrumental',
    description: 'Calm beats for yoga and stretching',
    ytPlaylistId: 'PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo',
    trackCount: 30,
  },
  {
    id: 'latin-fire',
    title: 'Latin Fire',
    emoji: '🌶️',
    genre: 'Latin',
    language: 'Spanish',
    description: 'Reggaeton & Latin pop for high energy',
    ytPlaylistId: 'PLcfQmtiAG0X-fmM85dPlql5wfYbmFamzk',
    trackCount: 45,
  },
  {
    id: 'edm-beast',
    title: 'EDM Beast Mode',
    emoji: '⚡',
    genre: 'EDM',
    language: 'Various',
    description: 'Electronic drops for PR attempts',
    ytPlaylistId: 'PLw-VjHDlEOgtl4ldJJ8Arb2WeSlAyBkJS',
    trackCount: 60,
  },
  {
    id: 'jpop-energy',
    title: 'J-Pop Energy',
    emoji: '🎌',
    genre: 'J-Pop/Anime',
    language: 'Japanese',
    description: 'Anime OST & J-Pop for anime arc training',
    ytPlaylistId: 'PL3-sRm8xAzY-8ZmRByDq3m2YKPI0gsBBm',
    trackCount: 40,
  },
  {
    id: 'afrobeats',
    title: 'Afrobeats Grind',
    emoji: '🌍',
    genre: 'Afrobeats',
    language: 'Various',
    description: 'African beats for rhythm workouts',
    ytPlaylistId: 'PL4fGSI1pDJn4-UIb6RKHdHTBNcqiDCRqP',
    trackCount: 35,
  },
];

export function getPlaylistsByLanguage(lang) {
  if (!lang || lang === 'all') return PLAYLISTS;
  return PLAYLISTS.filter(p => p.language.toLowerCase() === lang.toLowerCase());
}

export function getLanguages() {
  return [...new Set(PLAYLISTS.map(p => p.language))];
}
