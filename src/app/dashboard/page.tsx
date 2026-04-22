'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { analytics, orders as allOrders } from '@/lib/data'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'
import { SectionHeader } from '@/components/ui/PageHeader'

const PALETTE = ['oklch(0.58 0.18 275)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)']

export default function DashboardPage() {
  const router = useRouter()
  const A = analytics

  const kpis = [
    { l: 'Visites', v: '46 820', d: '+5 %', up: true, sk: A.sessions },
    { l: 'Ventes totales', v: '30 580 €', d: '+11 %', up: true, sk: A.timeseries },
    { l: 'Commandes', v: '518', d: '+9 %', up: true, sk: A.orders },
    { l: 'Panier moyen', v: '59,03 €', d: '−2 %', up: false, sk: A.aov },
    { l: 'Taux de conversion', v: '0,77 %', d: '+8 %', up: true, sk: A.cvr },
  ]

  return (
    <div className="page">
      {/* Toolbar */}
      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        <button className="btn btn-sm"><I.Calendar size={13} /> 30 derniers jours</button>
        <button className="btn btn-sm"><I.Plug size={13} /> Tous les canaux</button>
        <div className="badge ok lg" style={{ height: 24 }}><span className="dot" /> 6 visiteurs en ligne</div>
        <div className="spacer" />
        <button className="btn btn-sm"><I.Download size={13} /> Exporter</button>
        <button className="btn btn-sm">Prochain versement <span className="mono" style={{ marginLeft: 6, fontWeight: 600 }}>331,00 €</span></button>
      </div>

      {/* KPI bar */}
      <div className="kpi-grid mb-12">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l} <I.Info size={11} /></div>
            <div className="kpi-value">
              {k.v}
              <span className={`delta ${k.up ? 'up' : 'down'}`}>{k.d}</span>
            </div>
            <div className="kpi-spark"><Sparkline data={k.sk} w={200} h={26} /></div>
          </div>
        ))}
      </div>

      {/* Action pills */}
      <div className="row" style={{ gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="btn"><I.Cart size={14} /> 7 commandes à traiter</button>
        <button className="btn"><I.CreditCard size={14} /> 1 paiement à saisir</button>
        <button className="btn"><I.Warning size={14} /> 2 rétrofacturations</button>
        <button className="btn"><I.Box size={14} /> 4 produits en rupture</button>
      </div>

      <div className="grid-2">
        <div className="stack">
          {/* Assistant card */}
          <div className="card">
            <div className="card-body">
              <div className="hstack mb-12" style={{ gap: 12, marginBottom: 12 }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, oklch(0.62 0.20 275), oklch(0.55 0.22 295))' }}>
                  <I.Sparkles size={14} />
                </div>
                <div>
                  <div className="h3">Bonjour — prêt à bosser ?</div>
                  <div className="tm">Votre assistant Merchant OS peut analyser vos chiffres, rédiger des e-mails ou créer des automatisations.</div>
                </div>
              </div>
              <div style={{ border: '1px solid var(--border-2)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)' }}>
                <I.Sparkles size={14} style={{ color: 'var(--accent)' }} />
                <input className="input" style={{ border: 0, background: 'transparent', height: 24, padding: 0 }} placeholder="Demandez quelque chose — ex. « Mes produits les plus vendus »" />
                <button className="btn btn-sm btn-primary btn-icon"><I.ArrowUp size={13} /></button>
              </div>
              <div className="row mt-12" style={{ flexWrap: 'wrap', gap: 6 }}>
                {["Résume les ventes", "Rédige un e-mail VIP", "Crée une réduction printemps", "Audit SEO — top 5 pages"].map((s, i) => (
                  <button key={i} className="btn btn-sm btn-ghost" style={{ border: '1px solid var(--border)' }}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Sales chart */}
          <div className="card">
            <SectionHeader
              title="Ventes totales"
              icon={<I.Chart size={14} />}
              action={
                <div className="hstack">
                  <div className="seg-sm">
                    <div className="tab active">Ventes</div>
                    <div className="tab">Commandes</div>
                    <div className="tab">Visites</div>
                  </div>
                </div>
              }
            />
            <div className="card-body">
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="h1">30 580,12 €</div>
                  <div className="tm">vs. 27 418,90 € période précédente · <span style={{ color: 'oklch(0.48 0.14 155)', fontWeight: 500 }}>+11,5 %</span></div>
                </div>
                <div className="hstack">
                  <span className="badge accent"><span className="dot" />30 derniers jours</span>
                  <span className="badge muted" style={{ borderStyle: 'dashed' }}><span className="dot" />Période précédente</span>
                </div>
              </div>
              <AreaChart data={A.timeseries} compareData={A.orders.map(v => v * 0.85)} h={220} />
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8, color: 'var(--ink-4)', fontSize: 11 }}>
                {['22 mar', '28 mar', '4 avr', '10 avr', '16 avr', '22 avr'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="card">
            <SectionHeader
              title="Commandes récentes"
              icon={<I.Cart size={14} />}
              action={<button className="btn btn-sm btn-ghost" onClick={() => router.push('/orders')}>Tout voir <I.ChevRight size={13} /></button>}
            />
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Livraison</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.slice(0, 6).map(o => (
                    <tr key={o.id} onClick={() => router.push('/orders/' + o.id.slice(1))} style={{ cursor: 'pointer' }}>
                      <td className="mono td-strong">{o.id}</td>
                      <td className="td-muted">{o.date}</td>
                      <td>{o.customer}</td>
                      <td className="td-strong">{money(o.total)}</td>
                      <td><span className={`badge ${o.payment.tone}`}><span className="dot" />{o.payment.label}</span></td>
                      <td><span className={`badge ${o.fulfill.tone}`}><span className="dot" />{o.fulfill.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="stack">
          {/* Tasks */}
          <div className="card">
            <SectionHeader title="À faire aujourd'hui" icon={<I.Check size={14} />} action={<button className="btn btn-sm btn-ghost"><I.Dots size={14} /></button>} />
            <div className="card-body vstack" style={{ gap: 10 }}>
              {[
                { t: 'Traiter 7 commandes en attente', sub: 'depuis 3 canaux', icon: I.Truck, tone: 'warn' },
                { t: 'Revoir 2 rétrofacturations', sub: '#15973 · #15984', icon: I.Warning, tone: 'danger' },
                { t: "Publier l'article de blog", sub: '« Comment nous sélectionnons nos matières »', icon: I.Newspaper, tone: 'info' },
                { t: 'Configurer TVA UE', sub: 'Settings · Taxes · 4 pays', icon: I.Receipt, tone: 'muted' },
              ].map((x, i) => (
                <div key={i} className="row" style={{ gap: 10, padding: '6px 0', borderTop: i ? '1px solid var(--divider)' : 'none', paddingTop: i ? 10 : 0 }}>
                  <span className={`badge ${x.tone}`} style={{ width: 24, height: 24, padding: 0, justifyContent: 'center' }}><x.icon size={12} /></span>
                  <div style={{ flex: 1 }}>
                    <div className="t" style={{ fontWeight: 500, color: 'var(--ink)' }}>{x.t}</div>
                    <div className="ts">{x.sub}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost"><I.ChevRight size={13} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div className="card">
            <SectionHeader title="Top produits" icon={<I.Box size={14} />} action={<button className="btn btn-sm btn-ghost" onClick={() => router.push('/analytics')}>Analyses</button>} />
            <div className="card-body vstack" style={{ gap: 12 }}>
              {A.topProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="row" style={{ gap: 10 }}>
                  <div className="thumb"><I.Image size={13} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t truncate" style={{ fontWeight: 500, color: 'var(--ink)' }}>{p.name}</div>
                    <div className="ts">{p.units} unités · {money(p.rev)}</div>
                  </div>
                  <Sparkline data={A.timeseries.slice(i * 3, i * 3 + 12).length ? A.timeseries.slice(i * 3, i * 3 + 12) : [10, 20, 15, 24, 30, 28, 40]} w={58} h={22} />
                </div>
              ))}
            </div>
          </div>

          {/* Sessions donut */}
          <div className="card">
            <SectionHeader title="Sessions par canal" icon={<I.Globe size={14} />} action={<div className="seg-sm"><div className="tab active">30j</div><div className="tab">90j</div></div>} />
            <div className="card-body row" style={{ gap: 14 }}>
              <Donut segments={A.channelsMix.map(c => ({ label: c.name, value: c.share }))} size={128} />
              <div style={{ flex: 1 }}>
                {A.channelsMix.slice(0, 5).map((c, i) => (
                  <div key={i} className="link-row">
                    <div className="lbl hstack" style={{ gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i], display: 'inline-block' }} />
                      {c.name}
                    </div>
                    <div className="val mono">{c.share}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="card">
            <SectionHeader title="Activité récente" icon={<I.Clock size={14} />} />
            <div className="card-body">
              <div className="timeline">
                {[
                  { k: 'ok', t: 'il y a 4 min', b: <span><strong>Liam Sexton</strong> a passé une commande de <strong>133,80 €</strong> depuis la boutique en ligne.</span> },
                  { k: 'accent', t: 'il y a 22 min', b: <span>Campagne <strong>Teasing collection printemps</strong> — 42 040 e-mails envoyés · ouverture 28%.</span> },
                  { k: '', t: 'il y a 40 min', b: <span>Stock bas pour <strong>Nomad Roll-Top Backpack</strong> à Lille — 4 unités restantes.</span> },
                  { k: '', t: 'il y a 1 h', b: <span>Nouveau message dans <strong>Inbox</strong> — Dawid B. · question livraison.</span> },
                ].map((tl, i) => (
                  <div key={i} className={`timeline-item ${tl.k}`}>
                    <div className="t-meta">{tl.t}</div>
                    <div className="t-body">{tl.b}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
