export function launchConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: any[] = []
  const colors = ['#50a19b', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      r: Math.random() * 6 + 4,
      d: Math.random() * 150,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    })
  }

  let animationId: number
  function draw() {
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight)
    particles.forEach((p, i) => {
      p.tiltAngle += p.tiltAngleIncremental
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
      p.x += Math.sin(p.d)
      p.tilt = Math.sin(p.tiltAngle) * 15

      ctx!.beginPath()
      ctx!.lineWidth = p.r
      ctx!.strokeStyle = p.color
      ctx!.moveTo(p.x + p.tilt + p.r / 4, p.y)
      ctx!.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4)
      ctx!.stroke()

      if (p.y > window.innerHeight) {
        particles[i] = p
        p.x = Math.random() * window.innerWidth
        p.y = -10
      }
    })
  }

  const start = Date.now()
  function loop() {
    draw()
    if (Date.now() - start < 3000) {
      animationId = requestAnimationFrame(loop)
    } else {
      canvas.remove()
    }
  }

  loop()
}
