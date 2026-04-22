'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { products } from '@/lib/data'
import { money } from '@/lib/utils'
import { Checkbox } from '@/components/ui/Checkbox'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const p = products.find(x => x.id === params.id) || products[4]

  return (
    <div className="page page-wide">
      <button className="back-btn" onClick={() => router.push('/products')}>
        <I.ChevLeft size={13} /> Produits
      </button>
      <div className="detail-header">
        <div className="detail-title">
          <I.Box size={18} />
          <span>{p.title}</span>
          <span className="badge ok"><span className="dot" />Actif</span>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm"><I.Copy size={13} /> Dupliquer</button>
          <button className="btn btn-sm"><I.Eye size={13} /> Afficher</button>
          <button className="btn btn-sm">Autres actions <I.ChevDown size={12} /></button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          {/* Title & description */}
          <div className="card">
            <div className="card-body">
              <div className="field"><label className="label">Titre</label><input className="input" defaultValue={p.title} /></div>
              <div className="field">
                <label className="label">Description</label>
                <div style={{ border: '1px solid var(--border-2)', borderRadius: 7, background: 'var(--surface)' }}>
                  <div className="row" style={{ gap: 2, padding: 6, borderBottom: '1px solid var(--divider)', background: 'var(--surface-2)' }}>
                    <button className="btn btn-sm btn-ghost btn-icon"><span style={{ fontWeight: 700 }}>B</span></button>
                    <button className="btn btn-sm btn-ghost btn-icon"><span style={{ fontStyle: 'italic' }}>I</span></button>
                    <button className="btn btn-sm btn-ghost btn-icon"><span style={{ textDecoration: 'underline' }}>U</span></button>
                    <span style={{ width: 1, height: 18, background: 'var(--divider)', margin: '0 4px' }} />
                    <button className="btn btn-sm btn-ghost"><I.Link size={12} /></button>
                    <button className="btn btn-sm btn-ghost"><I.Image size={12} /></button>
                    <div className="spacer" />
                    <button className="btn btn-sm btn-ghost"><I.Code size={12} /> HTML</button>
                  </div>
                  <div style={{ padding: '14px 16px', fontSize: 13, lineHeight: 1.6, color: 'var(--ink)' }}>
                    <p style={{ margin: '0 0 10px' }}><strong>{p.title}</strong> — édition limitée, impression musée. Chaque tirage est réalisé sur papier haut grammage et encadré en aluminium noir.</p>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--ink-3)' }}>(Aucune réimpression ne sera effectuée.)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Image size={14} /><span>Supports multimédias</span></div>
              <div className="hstack"><button className="btn btn-sm"><I.Upload size={12} /> Téléverser</button></div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <div className="ph-img" style={{ gridRow: 'span 2', height: '100%', minHeight: 140 }}>hero</div>
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="ph-img" style={{ height: 66 }}>photo {i + 1}</div>)}
                <div style={{ height: 66, border: '1.5px dashed var(--border-strong)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--ink-3)', cursor: 'pointer' }}><I.Plus size={16} /></div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="card-header"><div className="card-title"><I.Percent size={14} /><span>Tarification</span></div></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div className="field"><label className="label">Prix</label><div style={{ position: 'relative' }}><input className="input" defaultValue={p.price.toFixed(2)} /><span className="ts" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>EUR</span></div></div>
              <div className="field"><label className="label">Prix comparé</label><input className="input" /></div>
              <div className="field"><label className="label">Coût par article</label><input className="input" defaultValue={(p.price * 0.46).toFixed(2)} /><div className="help">Marge · 54%</div></div>
            </div>
          </div>

          {/* Variants */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Variant size={14} /><span>Variantes ({p.variants})</span></div>
              <button className="btn btn-sm btn-ghost">Ajouter une option</button>
            </div>
            <div>
              {Array.from({ length: Math.min(p.variants, 4) }).map((_, i) => (
                <div key={i} className="row" style={{ padding: '10px 16px', borderBottom: '1px solid var(--divider)', gap: 10 }}>
                  <Checkbox />
                  <div className="thumb"><I.Image size={13} /></div>
                  <div style={{ flex: 1 }}><div className="t" style={{ fontWeight: 500 }}>Variante {i + 1}</div><div className="ts mono">{p.sku}-V{i + 1}</div></div>
                  <input className="input" style={{ width: 120, textAlign: 'right' }} defaultValue={(p.price + i * 10).toFixed(2) + ' €'} />
                  <input className="input" style={{ width: 80, textAlign: 'right' }} defaultValue={Math.max(0, p.stock - i * 15)} />
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Globe size={14} /><span>Aperçu moteurs de recherche</span></div>
              <button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>
            </div>
            <div className="card-body">
              <div className="ts">Studio Nord & Co</div>
              <div className="tm mono">studionord.co/products/{p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</div>
              <div style={{ color: 'oklch(0.45 0.16 265)', fontSize: 15, marginTop: 4 }}>{p.title} | Studio Nord</div>
              <div className="tm mt-8">Commandez votre {p.title.toLowerCase()}. Livraison rapide en France.</div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="stack">
          <div className="card">
            <div className="card-header"><div className="card-title">Statut</div></div>
            <div className="card-body"><select className="select" defaultValue="live"><option value="live">Actif</option><option value="draft">Brouillon</option><option value="archived">Archivé</option></select></div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Organisation</div></div>
            <div className="card-body">
              <div className="field"><label className="label">Type de produit</label><input className="input" defaultValue={p.type} /></div>
              <div className="field"><label className="label">Fournisseur</label><input className="input" defaultValue={p.vendor} /></div>
              <div className="field"><label className="label">Collections</label>
                <div className="row" style={{ flexWrap: 'wrap', gap: 5 }}>
                  <span className="tag">Best-sellers <span className="x">×</span></span>
                  <span className="tag">Nouveautés <span className="x">×</span></span>
                </div>
              </div>
              <div className="field"><label className="label">Balises</label>
                <div className="row" style={{ flexWrap: 'wrap', gap: 5 }}>
                  <span className="tag">{p.category.toLowerCase()}</span>
                  <span className="tag">edition-limitee</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Ventes des 90 derniers jours</div></div>
            <div className="card-body">
              <div className="kv"><span className="k">Unités vendues</span><span className="v">3</span></div>
              <div className="kv"><span className="k">Acheteurs</span><span className="v">2</span></div>
              <div className="kv"><span className="k">Ventes nettes</span><span className="v mono">{money(p.price * 3)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
