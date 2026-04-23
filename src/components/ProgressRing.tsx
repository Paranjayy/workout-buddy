interface ProgressRingProps {
  percent: number
  color: string
  size?: number
  label?: string
  sublabel?: string
}

export function ProgressRing({ percent, color, size = 80, label, sublabel }: ProgressRingProps) {
  const r = size / 2 - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (circ * Math.min(percent, 100)) / 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track — uses CSS var so it works in dark mode */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--clr-surface-2)" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.25,1,0.5,1)' }}
        />
        <text
          x={size / 2} y={label ? size / 2 - 6 : size / 2}
          textAnchor="middle" dominantBaseline="central"
          fontFamily="var(--ff-display)" fontSize={size * 0.2} fontWeight="700"
          fill="var(--clr-text)"
        >
          {Math.round(percent)}%
        </text>
        {label && (
          <text
            x={size / 2} y={size / 2 + 14}
            textAnchor="middle"
            fontFamily="var(--ff-body)" fontSize={size * 0.1} fontWeight="500"
            fill="var(--clr-text-3)"
          >
            {label}
          </text>
        )}
      </svg>
      {sublabel && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-3)', textAlign: 'center' }}>{sublabel}</span>}
    </div>
  )
}
