'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { apps, appsMarket } from '@/lib/data'
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader'

export default function AppsPage() {
  return (
    <div className="page">
      <PageHeader
        icon={<I.Grid size={18} />}
        title="Applications"
        actions={<button className="btn btn-sm btn-primary"><I.Plus size={13} /> Explorer les applications</button>}
      />

      {/* Installed apps */}
      <div className="card mb-12">
        <SectionHeader title="Applications installées" icon={<I.Check size={14} />} action={<span className="badge muted">{apps.length} apps</span>} />
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {apps.map(app => (
            <div key={app.id} className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div className="row" style={{ gap: 10, width: '100%' }}>
                <div className="thumb" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)' }}>
                  <I.Grid size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t" style={{ fontWeight: 600 }}>{app.name}</div>
                  <div className="ts">{app.author}</div>
                </div>
                <button className="btn btn-sm btn-ghost">Ouvrir</button>
              </div>
              <div className="ts">{app.descr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketplace */}
      <div className="card">
        <SectionHeader title="Suggestions pour vous" icon={<I.Zap size={14} />} action={<button className="btn btn-sm btn-ghost">App Store <I.ChevRight size={13} /></button>} />
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {appsMarket.map(app => (
            <div key={app.id} className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <div className="row" style={{ gap: 10, width: '100%' }}>
                <div className="thumb">
                  <I.Zap size={13} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="t" style={{ fontWeight: 600 }}>{app.name}</div>
                  <span className="badge muted">{app.tag}</span>
                </div>
                <button className="btn btn-sm btn-primary">Installer</button>
              </div>
              <div className="ts">{app.descr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
