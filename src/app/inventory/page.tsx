'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { products, locations } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const TABS_STOCK = [
  { key: 'stock', label: 'Stock', count: products.length },
  { key: 'alerts', label: 'Alertes', count: 4 },
]
const TABS_NAV = [
  { key: 'stock', label: 'Stock' },
  { key: 'locations', label: 'Emplacements' },
  { key: 'transfers', label: 'Transferts' },
  { key: 'po', label: 'Bons de commande' },
]

export default function InventoryPage() {
  const [tab, setTab] = useState('stock')
  const [view, setView] = useState('stock')

  if (view === 'locations') {
    return (
      <div className="page page-wide">
        <PageHeader icon={<I.Location size={18} />} title="Emplacements" actions={<button className="btn btn-sm btn-primary"><I.Plus size={13} /> Ajouter un emplacement</button>} />
        <div className="table-wrap">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead><tr><th>Emplacement</th><th>Ville</th><th>Rôle</th><th>Articles</th><th>Commandes</th></tr></thead>
              <tbody>
                {locations.map(l => (
                  <tr key={l.id} style={{ cursor: 'pointer' }}>
                    <td className="td-strong">{l.name}</td>
                    <td className="td-muted">{l.city}</td>
                    <td><span className="badge muted"><span className="dot" />{l.role}</span></td>
                    <td className="mono">{l.items}</td>
                    <td><span className="badge ok"><span className="dot" />{l.orders}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Boxes size={18} />}
        title="Stock"
        actions={
          <>
            <button className="btn btn-sm"><I.Download size={13} /> Exporter</button>
            <button className="btn btn-sm">Ajuster le stock</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un transfert</button>
          </>
        }
      />

      {/* Nav tabs */}
      <div className="row" style={{ gap: 6, marginBottom: 16 }}>
        {TABS_NAV.map(t => (
          <button key={t.key} className={`btn btn-sm ${view === t.key ? 'btn-primary' : ''}`} onClick={() => setView(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <FilterBar tabs={TABS_STOCK} active={tab} onTab={setTab} />
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox" />
                <th style={{ width: 44 }} />
                <th>Produit</th>
                <th>SKU</th>
                <th>Catégorie</th>
                <th style={{ textAlign: 'right' }}>Stock total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td><div className="thumb"><I.Image size={13} /></div></td>
                  <td className="td-strong">{p.title}</td>
                  <td className="td-muted mono">{p.sku}</td>
                  <td className="td-muted">{p.category}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {p.stock === 0
                      ? <span className="td-muted">Non suivi</span>
                      : <span className={p.stock < 10 ? 'danger' : ''}>{p.stock}</span>
                    }
                  </td>
                  <td>
                    {p.stock === 0
                      ? <span className="badge muted"><span className="dot" />Non suivi</span>
                      : p.stock < 10
                      ? <span className="badge danger"><span className="dot" />Rupture imminente</span>
                      : <span className="badge ok"><span className="dot" />En stock</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager total={products.length} perPage={50} />
      </div>
    </div>
  )
}
