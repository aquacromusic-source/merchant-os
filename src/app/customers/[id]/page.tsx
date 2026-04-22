'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { customers, orders as allOrders } from '@/lib/data'
import { money } from '@/lib/utils'
import { NameAvatar } from '@/components/ui/NameAvatar'
import { SectionHeader } from '@/components/ui/PageHeader'

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const c = customers.find(x => x.id === params.id) || customers[0]
  const orders = allOrders.filter(o => o.customerId === c.id).concat(allOrders.slice(0, 3))

  return (
    <div className="page page-wide">
      <button className="back-btn" onClick={() => router.push('/customers')}><I.ChevLeft size={13} /> Clients</button>
      <div className="detail-header">
        <div className="row" style={{ gap: 14 }}>
          <NameAvatar name={c.name} className="xl" />
          <div>
            <div className="detail-title">
              <span>{c.name}</span>
              {c.tags.includes('VIP') && <span className="badge accent"><span className="dot" />VIP</span>}
            </div>
            <div className="detail-subtitle">
              <span className="mono">{c.email}</span>
              <span className="sep">·</span>
              <span>{c.city}, {c.country}</span>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm"><I.Mail size={13} /> Envoyer e-mail</button>
          <button className="btn btn-sm">Autres actions <I.ChevDown size={12} /></button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              <div className="mini-stat"><span className="l">Total commandes</span><span className="v">{c.orders}</span></div>
              <div className="mini-stat"><span className="l">Total dépensé</span><span className="v">{money(c.spend)}</span></div>
              <div className="mini-stat"><span className="l">Panier moyen</span><span className="v">{money(c.spend / c.orders)}</span></div>
              <div className="mini-stat"><span className="l">Valeur vie prédite</span><span className="v">{money(c.spend * 1.8)}</span></div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Historique des commandes" icon={<I.Clock size={14} />} action={<button className="btn btn-sm btn-ghost">Toutes</button>} />
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Date</th>
                    <th>Articles</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th>Paiement</th>
                    <th>Traitement</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o, i) => (
                    <tr key={i} onClick={() => router.push('/orders/' + o.id.slice(1))} style={{ cursor: 'pointer' }}>
                      <td className="mono row-link">{o.id}</td>
                      <td className="td-muted">{o.date}</td>
                      <td className="td-muted">{o.items}</td>
                      <td className="mono" style={{ textAlign: 'right', fontWeight: 500, color: 'var(--ink)' }}>{money(o.total)}</td>
                      <td><span className={`badge ${o.payment.tone}`}><span className="dot" />{o.payment.label}</span></td>
                      <td><span className={`badge ${o.fulfill.tone}`}><span className="dot" />{o.fulfill.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Calendrier" icon={<I.Clock size={14} />} />
            <div className="card-body">
              <div className="timeline">
                {[
                  ["il y a 2j", "A laissé un avis 5★ sur Nomad Roll-Top Backpack"],
                  ["il y a 6j", "Ouvert la campagne Newsletter hebdo n°14"],
                  ["il y a 14j", "Première commande via Boutique en ligne"],
                ].map((a, i) => (
                  <div key={i} className="timeline-item">
                    <div className="t-meta">{a[0]}</div>
                    <div className="t-body">{a[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <SectionHeader title="Notes" />
            <div className="card-body"><textarea className="textarea" rows={3} defaultValue="Préférence d'emballage soigné." /></div>
          </div>
          <div className="card">
            <SectionHeader title="Balises" />
            <div className="card-body">
              <div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>
                {c.tags.map(t => <span key={t} className="tag">{t} <span className="x">×</span></span>)}
                <button className="btn btn-sm btn-ghost"><I.Plus size={12} /></button>
              </div>
            </div>
          </div>
          <div className="card">
            <SectionHeader title="Coordonnées" action={<button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>} />
            <div className="card-body">
              <div className="t mono">{c.email}</div>
              <div style={{ height: 1, background: 'var(--divider)', margin: '10px 0' }} />
              <div className="ts" style={{ fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>Adresse par défaut</div>
              <div className="t">{c.name}<br />12 rue des Ateliers<br />{c.city}, {c.country}</div>
            </div>
          </div>
          <div className="card">
            <SectionHeader title="Marketing" />
            <div className="card-body">
              <div className="row-between"><span className="t">E-mail marketing</span><span className={`badge ${c.subscribed ? 'ok' : 'muted'}`}><span className="dot" />{c.subscribed ? 'Abonné' : 'Non abonné'}</span></div>
              <div className="row-between mt-8"><span className="t">SMS marketing</span><span className="badge muted"><span className="dot" />Non abonné</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
