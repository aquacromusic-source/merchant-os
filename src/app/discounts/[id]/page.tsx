'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { discounts } from '@/lib/data'
import { money } from '@/lib/utils'
import { Checkbox } from '@/components/ui/Checkbox'
import { SectionHeader } from '@/components/ui/PageHeader'

export default function DiscountDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const d = discounts.find(x => x.code === params.id) || discounts[0]

  return (
    <div className="page page-wide">
      <button className="back-btn" onClick={() => router.push('/discounts')}>
        <I.ChevLeft size={13} /> Réductions
      </button>
      <div className="detail-header">
        <div className="detail-title">
          <I.Percent size={18} />
          <span className="mono">{d.code}</span>
          <span className={`badge ${d.status === 'Actif' ? 'ok' : d.status === 'Programmée' ? 'warn' : 'muted'}`}>
            <span className="dot" />{d.status}
          </span>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm">Dupliquer</button>
          <button className="btn btn-sm">Désactiver</button>
          <button className="btn btn-sm btn-primary">Enregistrer</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <SectionHeader title="Méthode" />
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="info-row" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-border)' }}>
                <div>
                  <div className="t" style={{ fontWeight: 600 }}>Code de réduction</div>
                  <div className="ts">Les clients saisissent au checkout.</div>
                </div>
                <I.Check size={14} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="info-row">
                <div>
                  <div className="t" style={{ fontWeight: 600 }}>Automatique</div>
                  <div className="ts">Appliquée selon des règles.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Code" />
            <div className="card-body">
              <div className="row">
                <input className="input" defaultValue={d.code} style={{ flex: 1 }} />
                <button className="btn btn-sm">Générer</button>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Type et valeur" />
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div className="field">
                <label className="label">Type</label>
                <select className="select" defaultValue={d.kind}>
                  <option>% commande</option>
                  <option>Montant fixe</option>
                  <option>Expédition gratuite</option>
                  <option>Achat de X = Y</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Valeur</label>
                <input className="input" defaultValue="15" />
              </div>
              <div className="field">
                <label className="label">S&apos;applique à</label>
                <select className="select">
                  <option>Tous les produits</option>
                  <option>Collections spécifiques</option>
                  <option>Produits spécifiques</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Exigences minimales" />
            <div className="card-body vstack" style={{ gap: 8 }}>
              {['Aucune condition', 'Montant minimal d\'achat · 40 €', 'Quantité minimale de 2 articles'].map((l, i) => (
                <div className="row" key={i} style={{ gap: 8 }}>
                  <Checkbox checked={i === 1} onChange={() => {}} />
                  <span className="t">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Éligibilité client" />
            <div className="card-body vstack" style={{ gap: 8 }}>
              {['Tous les clients', 'Segments spécifiques · VIP, Gros panier', 'Clients spécifiques'].map((l, i) => (
                <div className="row" key={i} style={{ gap: 8 }}>
                  <Checkbox checked={i === 0} onChange={() => {}} />
                  <span className="t">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Limites d'utilisation" />
            <div className="card-body vstack" style={{ gap: 8 }}>
              {['Limiter à un certain nombre total d\'utilisations', 'Limiter à une utilisation par client'].map((l, i) => (
                <div className="row" key={i} style={{ gap: 8 }}>
                  <Checkbox checked={i === 1} onChange={() => {}} />
                  <span className="t">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Combinaisons" />
            <div className="card-body vstack" style={{ gap: 8 }}>
              {['Réductions produit', 'Réductions commande', 'Réductions d\'expédition'].map((l, i) => (
                <div className="row" key={i} style={{ gap: 8 }}>
                  <Checkbox checked={i !== 1} onChange={() => {}} />
                  <span className="t">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Dates actives" />
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field">
                <label className="label">Date de début</label>
                <input className="input" defaultValue="22 avr 2026" />
              </div>
              <div className="field">
                <label className="label">Date de fin</label>
                <input className="input" defaultValue="31 mai 2026" />
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <SectionHeader title="Résumé" />
            <div className="card-body">
              <div className="t mono" style={{ fontWeight: 600 }}>{d.code}</div>
              <div className="tm mt-8">{d.descr}</div>
              <div className="divider" style={{ margin: '10px 0' }} />
              <div className="ts" style={{ textTransform: 'uppercase', color: 'var(--ink-4)', letterSpacing: '.04em', fontWeight: 600 }}>Performance</div>
              <div className="kv"><span className="k">Utilisations</span><span className="v mono">{d.uses}</span></div>
              <div className="kv"><span className="k">Revenu généré</span><span className="v mono">{money(d.uses * 42)}</span></div>
              <div className="kv"><span className="k">Remise totale</span><span className="v mono">{money(d.uses * 6.5)}</span></div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Canaux de vente" />
            <div className="card-body vstack" style={{ gap: 8 }}>
              {['Boutique en ligne', 'Point de vente', 'Checkout API'].map((c, i) => (
                <div key={i} className="row-between">
                  <span className="t">{c}</span>
                  <span className={`badge ${i !== 2 ? 'ok' : 'muted'}`}>
                    <span className="dot" />{i !== 2 ? 'Activé' : 'Désactivé'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
