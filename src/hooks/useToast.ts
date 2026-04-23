import { useEffect, useRef } from 'react'

/** Simple toast hook — call showToast(msg) anywhere */
export function useToast() {
  const toastRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let el = document.getElementById('wb-toast') as HTMLDivElement | null
    if (!el) {
      el = document.createElement('div')
      el.id = 'wb-toast'
      el.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
        padding: 10px 20px; background: oklch(22% 0.02 60); color: oklch(97% 0.008 75);
        border-radius: 8px; font-size: 0.875rem; font-weight: 500; z-index: 9999;
        opacity: 0; transition: transform 0.25s cubic-bezier(0.25,1,0.5,1), opacity 0.25s;
        white-space: nowrap; font-family: var(--ff-body);
      `
      document.body.appendChild(el)
    }
    toastRef.current = el
  }, [])

  const showToast = (msg: string) => {
    const el = toastRef.current
    if (!el) return
    el.textContent = msg
    el.style.transform = 'translateX(-50%) translateY(0)'
    el.style.opacity = '1'
    setTimeout(() => {
      if (el) {
        el.style.transform = 'translateX(-50%) translateY(80px)'
        el.style.opacity = '0'
      }
    }, 2200)
  }

  return { showToast }
}
