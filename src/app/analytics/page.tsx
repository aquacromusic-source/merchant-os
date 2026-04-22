'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { analytics } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'

const PALETTE = ['oklch(0.58 0.15 45)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)', 'oklch(0.55 0.10 320)']

export default function AnalyticsPage() {
  const A = analytics

  const kpis = [
    { l: 'Ventes totales', v: '30 580 €', d: '+11%' },
    { l: 'Commandes', v: '518', d: '+9%' },
    { l: 'Taux de conversion', v: '0,77 %', d: '+8%' },
    { l: 'Panier moyen', v: '59,03 €', d: '−2%', tone: 'down' },
    { l: 'Retours', v: '24', d: '+3' },
    { l: 'Sessions', v: '46 820', d: '+5%' },
  ]

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Chart size={18} />}
        title="Analyses de données"
        actions={
          <>
            <button className="btn btn-sm"><I.Calendar size={13} /> 30 derniers jours</button>
            <button className="btn btn-sm"><I.Plug size={13} /> Tous les canaux</button>
            <button className="btn btn-sm"><I.Download size={13} /> Exporter</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">
              {k.v}
              <span className={`delta ${k.tone === 'down' ? 'down' : 'up'}`}>{k.d}</span>
            </div>
            <div className="kpi-spark"><Sparkline data={A.timeseries.map(v => v + (i * 2))} w={180} /></div>
          </div>
        ))}
      </div>

      <div className="card mb-12">
        <SectionHeader
          title="Ventes · 30 jours"
          icon={<I.Chart size={14} />}
          action={<div className="seg-sm"><div className="tab active">Jour</div><div className="tab">Semaine</div><div className="tab">Mois</div></div>}
        />
        <div className="card-body">
          <AreaChart data={A.timeseries} compareData={A.orders.map(v => v * 0.9)} h={260} />
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <SectionHeader title="Sessions par canal" icon={<I.Globe size={14} />} />
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Donut segments={A.channelsMix.map(c => ({ label: c.name, value: c.share }))} size={120} />
            <div style={{ flex: 1 }}>
              {A.channelsMix.map((c, i) => (
                <div key={i} className="link-row">
                  <span className="lbl hstack" style={{ gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i], display: 'inline-block' }} />
                    {c.name}
                  </span>
                  <span className="val mono">{c.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <SectionHeader title="Ventes par pays" icon={<I.Globe size={14} />} />
          <div className="card-body">
            {A.countries.map((c, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="row-between"><span className="t">{c.name}</span><span className="mono tm">{c.share}%</span></div>
                <div className="progress" style={{ marginTop: 4 }}><div className="bar" style={{ width: `${c.share * 2}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <SectionHeader title="Produits les plus vendus" icon={<I.Star size={14} />} />
          <table className="mini-table" style={{ padding: '0 14px' }}>
            <tbody>
              {A.topProducts.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px 14px' }}>
                    <div className="t" style={{ fontWeight: 500 }}>{p.name}</div>
                    <div className="ts">{p.units} unités</div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }} className="mono td-strong">{money(p.rev)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-16">
        <SectionHeader title="Rapports" icon={<I.FileText size={14} />} action={<button className="btn btn-sm btn-ghost">Tous les rapports</button>} />
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[
            'Rapport acquisition', 'Rapport ventes par produit', 'Rapport ventes par canal', 'Panier moyen',
            'Cohortes clients', 'Taux de retour', 'Comportement sur site', 'Inventaire & écoulement',
            'Campagnes marketing', 'Performance publications', 'Recherches internes', 'Taxes collectées',
          ].map((r, i) => (
            <div key={i} className="info-row" style={{ cursor: 'pointer' }}>
              <div><div className="t" style={{ fontWeight: 500 }}>{r}</div><div className="ts">Dernière exécution · il y a {i + 1}j</div></div>
              <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
