import React from 'react'

interface DonutProps {
  segments: { label: string; value: number }[]
  size?: number
  thickness?: number
}

export function Donut({ segments, size = 120, thickness = 16 }: DonutProps) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0)
  const palette = [
    'oklch(0.58 0.18 275)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)',
    'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)', 'oklch(0.55 0.10 320)',
  ]
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c
          const dash = `${len} ${c}`
          const circle = (
            <circle
              key={i}
              r={r}
              fill="none"
              stroke={palette[i % palette.length]}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          )
          offset += len
          return circle
        })}
      </g>
    </svg>
  )
}
