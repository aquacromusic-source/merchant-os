'use client'
import React from 'react'

interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (v: boolean) => void
  size?: string
}

export function Checkbox({ checked, indeterminate, onChange, size }: CheckboxProps) {
  return (
    <span
      className={`cb ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
      onClick={(e) => { e.stopPropagation(); onChange && onChange(!checked) }}
      style={size === 'sm' ? { width: 13, height: 13 } : undefined}
    >
      {checked && !indeterminate && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7" />
        </svg>
      )}
    </span>
  )
}
