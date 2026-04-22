'use client'
import React from 'react'

interface AreaChartProps {
  data: number[]
  compareData?: number[]
  h?: number
  stroke?: string
}

export function AreaChart({ data, compareData, h = 220, stroke = 'var(--accent)' }: AreaChartProps) {
  if (!data || data.length === 0) return null
  const all = compareData ? data.concat(compareData) : data
  const min = Math.min(...all) * 0.92
  const max = Math.max(...all) * 1.05
  const w = 800
  const padX = 8, padY = 12

  const mapPts = (arr: number[]) => arr.map((v, i) => {
    const x = (i / (arr.length - 1)) * (w - padX * 2) + padX
    const y = h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2)
    return [x, y]
  })

  const pts = mapPts(data)
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const a = `${d} L${w - padX},${h - padY} L${padX},${h - padY} Z`
  const cmp = compareData ? mapPts(compareData) : null
  const cmpD = cmp ? cmp.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ') : null

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.18 275)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="oklch(0.62 0.18 275)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={i} x1={padX} x2={w - padX} y1={h * t} y2={h * t} stroke="var(--divider)" strokeDasharray="2 4" />
      ))}
      {cmpD && <path d={cmpD} fill="none" stroke="var(--ink-5)" strokeWidth="1.3" strokeDasharray="4 4" />}
      <path d={a} fill="url(#areaFill)" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
