import React from 'react'

interface BadgeProps {
  tone?: string
  dot?: boolean
  children: React.ReactNode
  size?: 'sm' | 'lg'
  style?: React.CSSProperties
}

export function Badge({ tone = '', dot = false, children, size, style }: BadgeProps) {
  return (
    <span className={`badge ${tone} ${size === 'lg' ? 'lg' : ''}`} style={style}>
      {dot && <span className="dot" />}
      {children}
    </span>
  )
}
