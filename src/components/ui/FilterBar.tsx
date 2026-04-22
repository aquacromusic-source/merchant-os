'use client'
import React from 'react'
import { I } from '@/lib/icons'

interface Tab {
  key: string
  label: string
  count?: number
}

interface FilterBarProps {
  tabs: Tab[]
  active: string
  onTab: (k: string) => void
  search?: string
  onSearch?: (v: string) => void
  extras?: React.ReactNode
}

export function FilterBar({ tabs, active, onTab, search, onSearch, extras }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="seg">
        {tabs.map(t => (
          <div
            key={t.key}
            className={`tab ${active === t.key ? 'active' : ''}`}
            onClick={() => onTab(t.key)}
            style={{ cursor: 'pointer' }}
          >
            {t.label}
            {t.count != null && <span className="ts mono">{t.count}</span>}
          </div>
        ))}
        <div className="tab" title="Ajouter une vue">
          <I.Plus size={12} stroke={2} />
        </div>
      </div>
      <div className="search-input" style={{ flex: 1, maxWidth: 360 }}>
        <I.Search size={14} />
        <input
          placeholder="Rechercher et filtrer…"
          value={search || ''}
          onChange={e => onSearch && onSearch(e.target.value)}
          className="input"
          style={{ height: 28, borderRadius: 6, background: 'var(--bg-sunken)', borderColor: 'transparent' }}
        />
      </div>
      <button className="btn btn-sm btn-ghost"><I.Filter size={13} /> Filtres</button>
      <button className="btn btn-sm btn-ghost"><I.Sort size={13} /> Trier</button>
      <button className="btn btn-sm btn-ghost btn-icon"><I.Cols size={13} /></button>
      {extras}
    </div>
  )
}

export function BulkBar({ count, onClear, actions }: { count: number; onClear: () => void; actions?: React.ReactNode }) {
  return (
    <div className="filter-bar" style={{ background: 'oklch(0.96 0.04 275)', borderBottomColor: 'var(--accent-border)' }}>
      <div className="hstack" style={{ gap: 10 }}>
        <span className="t" style={{ fontWeight: 500 }}>{count} sélectionné{count > 1 ? 's' : ''}</span>
        <button className="btn btn-sm btn-ghost" onClick={onClear}>Tout désélectionner</button>
      </div>
      <div className="spacer" />
      {actions}
    </div>
  )
}
