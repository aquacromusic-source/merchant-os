'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { channels } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ChannelsPage() {
  return (
    <div className="page">
      <PageHeader
        icon={<I.Plug size={18} />}
        title="Canaux de vente"
        subtitle="Gérez vos canaux de vente et marketplaces."
      />

      <div className="stack">
        {[
          { title: 'Canaux connectés', items: channels.filter(c => c.status === 'Connectée') },
          { title: 'À connecter / Suspendus', items: channels.filter(c => c.status !== 'Connectée') },
        ].map((group, gi) => (
          <div key={gi} className="card">
            <div className="card-header">
              <div className="card-title">{group.title} <span className="badge muted">{group.items.length}</span></div>
            </div>
            <div>
              {group.items.map((ch, i) => (
                <div key={i} className="card-section">
                  <div className="row" style={{ gap: 12 }}>
                    <div className="thumb">
                      {ch.kind === 'social' ? <I.Instagram size={14} /> : ch.kind === 'pos' ? <I.POS size={14} /> : <I.Store size={14} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="t" style={{ fontWeight: 500 }}>{ch.name}</div>
                      <div className="ts">{ch.descr}</div>
                    </div>
                    <div className="hstack">
                      <span className={`badge ${ch.status === 'Connectée' ? 'ok' : ch.status === 'Suspendue' ? 'danger' : 'muted'}`}>
                        <span className="dot" />{ch.status}
                      </span>
                      {ch.status === 'Connectée' && <button className="btn btn-sm btn-ghost">Gérer</button>}
                      {ch.status === 'À connecter' && <button className="btn btn-sm btn-primary">Connecter</button>}
                      {ch.status === 'Suspendue' && <button className="btn btn-sm">Réactiver</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
