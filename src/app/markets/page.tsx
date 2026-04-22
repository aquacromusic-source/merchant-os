'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { PageHeader } from '@/components/ui/PageHeader'

const markets = [
  {
    id: 'primary',
    name: 'France',
    countries: ['France'],
    currency: 'EUR',
    language: 'Français',
    status: 'Actif',
    primary: true,
    domains: 1,
    revenue: '92 400 €',
  },
  {
    id: 'eu',
    name: 'Europe',
    countries: ['Allemagne', 'Espagne', 'Pays-Bas', 'Belgique', 'Suisse', '+14'],
    currency: 'EUR',
    language: 'Multilingue',
    status: 'Actif',
    primary: false,
    domains: 0,
    revenue: '38 120 €',
  },
  {
    id: 'uk',
    name: 'Royaume-Uni',
    countries: ['Royaume-Uni'],
    currency: 'GBP',
    language: 'Anglais',
    status: 'Actif',
    primary: false,
    domains: 1,
    revenue: '12 840 €',
  },
  {
    id: 'us',
    name: 'États-Unis & Canada',
    countries: ['États-Unis', 'Canada'],
    currency: 'USD',
    language: 'Anglais',
    status: 'Inactif',
    primary: false,
    domains: 0,
    revenue: '—',
  },
]

export default function MarketsPage() {
  const [active, setActive] = useState('primary')
  const market = markets.find(m => m.id === active) || markets[0]

  return (
    <div className="page">
      <PageHeader
        icon={<I.Globe size={18} />}
        title="Marchés"
        subtitle="Gérez vos marchés internationaux et leurs paramètres de localisation."
        actions={
          <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un marché</button>
        }
      />

      <div className="settings-shell">
        <div className="settings-nav">
          <div className="card" style={{ padding: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 8 }}>
              {markets.map(m => (
                <button
                  key={m.id}
                  className={`nav-item ${active === m.id ? 'active' : ''}`}
                  style={{
                    color: active === m.id ? undefined : 'var(--ink-2)',
                    background: active === m.id ? undefined : 'transparent',
                    borderColor: active === m.id ? 'var(--border)' : 'transparent',
                    border: active === m.id ? '1px solid var(--border)' : '1px solid transparent',
                    height: 36,
                  }}
                  onClick={() => setActive(m.id)}
                >
                  <I.Globe size={15} />
                  <span style={{ flex: 1 }}>{m.name}</span>
                  {m.primary && <span className="badge accent" style={{ fontSize: 10 }}>Principal</span>}
                  {!m.primary && <span className={`badge ${m.status === 'Actif' ? 'ok' : 'muted'}`} style={{ fontSize: 10 }}><span className="dot" />{m.status}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <I.Globe size={14} />
                <span>{market.name}</span>
                {market.primary && <span className="badge accent"><span className="dot" />Principal</span>}
                {!market.primary && (
                  <span className={`badge ${market.status === 'Actif' ? 'ok' : 'muted'}`}>
                    <span className="dot" />{market.status}
                  </span>
                )}
              </div>
              <div className="hstack">
                <button className="btn btn-sm">Gérer</button>
              </div>
            </div>
            <div className="card-body">
              <div className="kv"><span className="k">Pays / régions</span><span className="v">{market.countries.join(', ')}</span></div>
              <div className="kv"><span className="k">Devise</span><span className="v mono">{market.currency}</span></div>
              <div className="kv"><span className="k">Langue</span><span className="v">{market.language}</span></div>
              <div className="kv"><span className="k">Domaines dédiés</span><span className="v mono">{market.domains}</span></div>
              <div className="kv"><span className="k">Revenu (30j)</span><span className="v mono">{market.revenue}</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><I.Percent size={14} /><span>Tarification</span></div></div>
            <div className="card-body">
              <div className="info-row">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Ajustement de prix</div>
                  <div className="ts">Aucun ajustement — prix catalogue appliqué</div>
                </div>
                <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
              </div>
              <div className="info-row mt-8">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Taxes incluses</div>
                  <div className="ts">{market.id === 'us' ? 'Non — taxes affichées séparément' : 'Oui — TVA incluse dans le prix'}</div>
                </div>
                <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><I.Truck size={14} /><span>Expédition</span></div></div>
            <div className="card-body">
              <div className="info-row">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Profil d&apos;expédition</div>
                  <div className="ts">Profil général · {market.countries.length} destination{market.countries.length > 1 ? 's' : ''}</div>
                </div>
                <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><I.Language size={14} /><span>Langues et traductions</span></div></div>
            <div className="card-body">
              <div className="row-between">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Langue principale</div>
                  <div className="ts">{market.language}</div>
                </div>
                <button className="btn btn-sm">Gérer les traductions</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
