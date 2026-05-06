import { useState } from 'react';

const MUSCLE_PATHS: Record<string, string> = {
  // Front
  chest: 'M40,30 C45,28 55,28 60,30 C65,35 60,45 50,45 C40,45 35,35 40,30 Z',
  abs: 'M45,45 L55,45 L52,65 L48,65 Z',
  obliques: 'M40,45 L45,45 L48,65 L40,60 Z M60,45 L55,45 L52,65 L60,60 Z',
  biceps: 'M30,35 C28,40 32,45 35,42 C38,40 38,35 35,33 Z M70,35 C72,40 68,45 65,42 C62,40 62,35 65,33 Z',
  quads: 'M42,70 L50,70 L50,90 L45,90 Z M58,70 L50,70 L50,90 L55,90 Z',
  calves: 'M45,95 L50,95 L50,110 L47,110 Z M55,95 L50,95 L50,110 L53,110 Z',
  delts: 'M35,25 C30,28 25,32 28,35 C32,32 38,30 38,28 Z M65,25 C70,28 75,32 72,35 C68,32 62,30 62,28 Z',
  // Back
  lats: 'M40,40 C35,45 40,55 45,55 L55,55 C60,55 65,45 60,40 Z',
  traps: 'M45,25 L50,28 L55,25 L50,20 Z',
  triceps: 'M32,40 C30,45 28,50 30,52 C32,50 35,45 35,42 Z M68,40 C70,45 72,50 70,52 C68,50 65,45 65,42 Z',
  glutes: 'M45,60 C40,65 45,70 50,68 C55,70 60,65 55,60 Z',
  hamstrings: 'M45,72 L50,72 L50,88 L47,88 Z M55,72 L50,72 L50,88 L53,88 Z',
}

const BODY_OUTLINE = 'M50,10 C45,10 40,15 40,20 C40,25 45,28 50,28 C55,28 60,25 60,20 C60,15 55,10 50,10 Z M35,28 C25,30 25,35 25,40 L25,55 L35,40 L35,28 Z M65,28 C75,30 75,35 75,40 L75,55 L65,40 L65,28 Z M40,28 L60,28 L60,65 L40,65 Z M42,65 L48,65 L48,110 L42,110 Z M52,65 L58,65 L58,110 L52,110 Z';

interface MuscleMapProps {
  targetMuscle?: string;
  intensity?: number;
}

export function MuscleMap({ targetMuscle = '', intensity = 1 }: MuscleMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const m = targetMuscle.toLowerCase()
  const activeMuscles: string[] = []
  
  if (m.includes('chest') || m.includes('pec')) activeMuscles.push('chest', 'delts', 'triceps')
  else if (m.includes('back') || m.includes('lat') || m.includes('row') || m.includes('pull')) activeMuscles.push('lats', 'traps', 'biceps')
  else if (m.includes('leg') || m.includes('quad') || m.includes('squat')) activeMuscles.push('quads', 'glutes', 'calves')
  else if (m.includes('hamstring') || m.includes('deadlift') || m.includes('hinge')) activeMuscles.push('hamstrings', 'glutes', 'lats')
  else if (m.includes('shoulder') || m.includes('delt') || m.includes('press')) activeMuscles.push('delts', 'triceps', 'traps')
  else if (m.includes('arm') || m.includes('bicep') || m.includes('curl')) activeMuscles.push('biceps')
  else if (m.includes('tricep') || m.includes('extension') || m.includes('dip')) activeMuscles.push('triceps', 'chest')
  else if (m.includes('core') || m.includes('abs') || m.includes('plank')) activeMuscles.push('abs', 'obliques')
  else if (m.includes('cardio') || m.includes('run') || m.includes('jump')) activeMuscles.push('quads', 'calves', 'hamstrings', 'glutes')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-accent)', height: '14px' }}>
        {hovered ? hovered.toUpperCase() : (targetMuscle ? 'PRIMARY TARGET' : 'INTERACTIVE ANATOMY')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-8)' }}>
        <svg width="120" height="180" viewBox="20 0 60 120" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
          <path d={BODY_OUTLINE} fill="var(--clr-surface-2)" stroke="var(--clr-border)" strokeWidth="1" strokeLinejoin="round" />
          {Object.entries(MUSCLE_PATHS).map(([key, d]) => {
            const isActive = activeMuscles.includes(key)
            const isHovered = hovered === key
            return (
              <path 
                key={key} 
                d={d} 
                fill={isHovered ? 'var(--clr-accent-d)' : isActive ? 'var(--clr-accent)' : 'var(--clr-surface)'} 
                stroke={isActive || isHovered ? 'var(--clr-accent-d)' : 'var(--clr-border)'}
                strokeWidth={isHovered ? "1" : "0.5"}
                opacity={isHovered ? 1 : isActive ? Math.min(1, 0.4 + (intensity * 0.6)) : 0.4}
                style={{ transition: 'all 0.2s ease', cursor: 'help' }}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
              >
                <title>{key.charAt(0).toUpperCase() + key.slice(1)}</title>
              </path>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
