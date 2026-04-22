'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { orders, customers } from '@/lib/data'
import { money } from '@/lib/utils'
import { NameAvatar } from '@/components/ui/NameAvatar'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const order = orders.find(o => o.id.slice(1) === params.id) || orders[0]
  const cust = customers.find(c => c.id === order.customerId) || customers[0]

  return (
    <div className="page page-wide">
      <button className="back-btn" onClick={() => router.push('/orders')}>
        <I.ChevLeft size={13} /> Commandes
      </button>
      <div className="detail-header">
        <div>
          <div className="detail-title">
            <span className="mono">{order.id}</span>
            <span className={`badge ${order.payment.tone}`}><span className="dot" />{order.payment.label}</span>
            <span className={`badge ${order.fulfill.tone}`}><span className="dot" />{order.fulfill.label}</span>
          </div>
          <div className="detail-subtitle">
            <span>22 avril 2026 · 08:28</span>
            <span className="sep">·</span>
            <span>Boutique en ligne</span>
            <span className="sep">·</span>
            <span>{order.location}</span>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm"><I.Refresh size={13} /> Rembourser</button>
          <button className="btn btn-sm"><I.Archive size={13} /> Retourner</button>
          <button className="btn btn-sm"><I.Edit size={13} /> Modifier</button>
          <button className="btn btn-sm">Autres actions <I.ChevDown size={12} /></button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          {/* Fulfillment card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Truck size={14} /><span>Traitée ({order.items})</span><span className="badge muted">{order.location}</span></div>
              <button className="btn btn-sm btn-ghost btn-icon"><I.Dots size={13} /></button>
            </div>
            <div className="card-section">
              <div className="tm">22 avril 2026 · Suivi GLS · <span className="mono">ZWLLMWFI</span></div>
            </div>
            {[
              { name: 'George Russell Fire', variant: 'A3 · Cadre noir', sku: 'SH-GR-FIRE-A3-BLK', qty: 1, price: 44.95 },
              { name: 'Nomad Roll-Top Backpack', variant: 'Taille unique · Noir', sku: 'MOS-1004', qty: 1, price: 189.00 },
            ].map((li, i) => (
              <div key={i} className="card-section">
                <div className="row" style={{ gap: 12 }}>
                  <div className="thumb lg"><I.Image size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t" style={{ fontWeight: 500, color: 'var(--ink)' }}>{li.name}</div>
                    <div className="ts">{li.variant}</div>
                    <div className="ts mono">{li.sku}</div>
                  </div>
                  <div className="td-muted mono">{money(li.price)} × {li.qty}</div>
                  <div className="td-strong mono">{money(li.price * li.qty)}</div>
                </div>
              </div>
            ))}
            <div className="card-footer">
              <span className="tm">Expédiée le 22 avril · reçue estimée 25 avril</span>
              <button className="btn btn-sm"><I.Printer size={13} /> Imprimer étiquette</button>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.CreditCard size={14} /><span>Paiement</span><span className="badge ok"><span className="dot" />Payée</span></div>
            </div>
            <div className="card-body">
              <div className="kv"><span className="k">Sous-total · {order.items} articles</span><span className="v mono">{money(order.total - 8.95)}</span></div>
              <div className="kv"><span className="k">Expédition · {order.ship}</span><span className="v mono">{money(8.95)}</span></div>
              <div className="kv"><span className="k">TVA (comprise)</span><span className="v mono">{money(order.total * 0.17)}</span></div>
              <div style={{ height: 1, background: 'var(--divider)', margin: '8px 0' }} />
              <div className="kv"><span className="k" style={{ fontWeight: 600, color: 'var(--ink)' }}>Total</span><span className="v mono" style={{ fontSize: 14 }}>{money(order.total)}</span></div>
              <div className="kv"><span className="k">Payé via Visa ···· 8937</span><span className="v mono">{money(order.total)}</span></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Clock size={14} /><span>Calendrier</span></div>
            </div>
            <div className="card-body">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <NameAvatar name="Anne Studio" />
                <input className="input" placeholder="Laisser un commentaire…" />
                <button className="btn btn-sm btn-primary">Publier</button>
              </div>
              <div className="timeline">
                {[
                  { t: 'il y a 16 min', b: <span><strong>GLS France</strong> a envoyé un e-mail de confirmation d&apos;expédition.</span>, k: 'ok' },
                  { t: 'il y a 41 min', b: <span>Le traitement de la commande a été débloqué.</span>, k: 'accent' },
                  { t: '08:28', b: <span>L&apos;e-mail de confirmation de commande a été envoyé.</span>, k: '' },
                  { t: '08:28', b: <span className="mono">Un paiement de {money(order.total)} a été traité avec une carte Visa.</span>, k: 'accent' },
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

        {/* Right rail */}
        <div className="stack">
          <div className="card">
            <div className="card-header"><div className="card-title"><I.FileText size={14} /><span>Notes</span></div></div>
            <div className="card-body"><div className="tm">Aucune note du client</div></div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Users size={14} /><span>Client</span></div>
              <button className="btn btn-sm btn-ghost btn-icon"><I.Dots size={13} /></button>
            </div>
            <div className="card-body">
              <div className="row" style={{ gap: 10, marginBottom: 10 }}>
                <NameAvatar name={cust.name} className="lg" />
                <div>
                  <a className="t" style={{ fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }} onClick={() => router.push('/customers/' + cust.id)}>{cust.name}</a>
                  <div className="tm">{cust.orders} commande{cust.orders > 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="ts" style={{ textTransform: 'uppercase', color: 'var(--ink-4)', letterSpacing: '.04em', fontWeight: 600, margin: '8px 0 4px' }}>Coordonnées</div>
              <div className="t mono">{cust.email}</div>
              <div style={{ height: 1, background: 'var(--divider)', margin: '10px 0' }} />
              <div className="ts" style={{ textTransform: 'uppercase', color: 'var(--ink-4)', letterSpacing: '.04em', fontWeight: 600, margin: '8px 0 4px' }}>Adresse de livraison</div>
              <div className="t">{cust.name}<br />{cust.city}, {cust.country}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><I.Shield size={14} /><span>Risque de la commande</span></div></div>
            <div className="card-body">
              <div className="progress" style={{ marginBottom: 8 }}>
                <div className="bar" style={{ width: order.risk === 'high' ? '80%' : order.risk === 'medium' ? '50%' : '18%', background: order.risk === 'high' ? 'var(--danger)' : order.risk === 'medium' ? 'var(--warn)' : 'var(--ok)' }} />
              </div>
              <div className="tm">Le risque de rétrofacturation est {order.risk === 'high' ? 'élevé' : order.risk === 'medium' ? 'moyen' : 'faible'}.</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title"><I.Tag size={14} /><span>Balises</span></div></div>
            <div className="card-body">
              <div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>
                {order.tags.length ? order.tags.map(t => <span key={t} className="tag">{t}</span>) : <span className="tm">Aucune balise</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
