import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        // Check for updates periodically
        setInterval(() => {
          reg.update().catch(() => {});
        }, 60 * 60 * 1000); // every hour
      })
      .catch(() => {})
  })

  // Reload page when new service worker takes over control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}
