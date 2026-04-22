import React from 'react'

interface NameAvatarProps {
  name: string
  className?: string
}

export function NameAvatar({ name, className = '' }: NameAvatarProps) {
  const initials = (name || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  const hues = [275, 195, 85, 155, 25, 320, 45, 235]
  const hash = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const h = hues[hash % hues.length]
  return (
    <div className={`avatar ${className}`} style={{ background: `oklch(0.55 0.14 ${h})` }}>
      {initials}
    </div>
  )
}
