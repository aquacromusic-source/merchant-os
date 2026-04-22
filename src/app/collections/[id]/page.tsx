'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { collections, products } from '@/lib/data'
import { money } from '@/lib/utils'
import { Checkbox } from '@/components/ui/Checkbox'
import { SectionHeader } from '@/components/ui/PageHeader'

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const c = collections.find(x => x.id === params.id) || collections[0]

  return (
    <div className="page page-wide">
      <button className="back-btn" onClick={() => router.push('/collections')}>
        <I.ChevLeft size={13} /> Collections
      </button>
      <div className="detail-header">
        <div className="detail-title">
          <I.Layers size={18} />
          <span>{c.title}</span>
          <span className="badge ok"><span className="dot" />Publiée</span>
        </div>
        <div className="page-actions">
          <button className="btn btn-sm"><I.Eye size={13} /> Aperçu</button>
          <button className="btn btn-sm btn-primary">Enregistrer</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <div className="card-body">
              <div className="field">
                <label className="label">Titre</label>
                <input className="input" defaultValue={c.title} />
              </div>
              <div className="field">
                <label className="label">Description</label>
                <textarea className="textarea" rows={4} defaultValue="Une sélection hebdomadaire des meilleures nouveautés de la saison — mise à jour chaque semaine." />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><I.Box size={14} /><span>Conditions</span></div>
            </div>
            <div className="card-body">
              <div className="row" style={{ gap: 8, marginBottom: 10 }}>
                <span className="tag">Les produits doivent correspondre à <strong>toutes</strong> les conditions</span>
                <span className="tag">n&apos;importe laquelle</span>
              </div>
              {[
                ['Balise produit', 'est', 'saison:printemps'],
                ['Prix', 'supérieur à', '20,00 €'],
                ['Statut', 'est', 'Actif'],
              ].map((row, i) => (
                <div key={i} className="row mt-8" style={{ gap: 8 }}>
                  <select className="select" defaultValue={row[0]}><option>{row[0]}</option></select>
                  <select className="select" style={{ maxWidth: 140 }} defaultValue={row[1]}><option>{row[1]}</option></select>
                  <input className="input" defaultValue={row[2]} />
                  <button className="btn btn-sm btn-ghost btn-icon"><I.X size={12} /></button>
                </div>
              ))}
              <div className="mt-12">
                <button className="btn btn-sm btn-ghost"><I.Plus size={12} /> Ajouter une autre condition</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <I.Box size={14} /><span>Produits</span>
                <span className="badge muted">{c.products}</span>
              </div>
              <button className="btn btn-sm">Parcourir</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th className="col-thumb" />
                  <th>Produit</th>
                  <th>Statut</th>
                  <th>Stock</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map(p => (
                  <tr key={p.id}>
                    <td><div className="thumb"><I.Image size={13} /></div></td>
                    <td><span className="row-link">{p.title}</span></td>
                    <td><span className="badge ok"><span className="dot" />Actif</span></td>
                    <td className="td-muted">{p.stock} en stock</td>
                    <td className="mono">{money(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-header"><div className="card-title">Publication</div></div>
            <div className="card-body">
              <div className="row-between">
                <span className="t">Boutique en ligne</span>
                <span className="badge ok"><span className="dot" />Publiée</span>
              </div>
              <div className="row-between mt-8">
                <span className="t">Point de vente</span>
                <span className="badge ok"><span className="dot" />Publiée</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Image de collection</div></div>
            <div className="card-body">
              <div className="ph-img" style={{ height: 160 }}>collection hero</div>
              <button className="btn btn-sm mt-8"><I.Upload size={12} /> Téléverser une image</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Moteur de recherche</div>
              <button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>
            </div>
            <div className="card-body">
              <div className="tm">URL · /collections/{c.id}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Modèle de thème</div></div>
            <div className="card-body">
              <select className="select">
                <option>collection-default</option>
                <option>collection-campagne</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
