import React from 'react'

interface SparklineProps {
  data: number[]
  w?: number
  h?: number
  stroke?: string
  fill?: boolean
}

export function Sparkline({ data, w = 120, h = 26, stroke = 'var(--accent)', fill = true }: SparklineProps) {
  if (!data || data.length === 0) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pad = 2
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
    return [x, y]
  })
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const a = `${d} L${w - pad},${h} L${pad},${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mini-sk">
      {fill && <path d={a} fill={stroke} opacity="0.10" />}
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
