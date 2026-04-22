'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'

const suppliers = ['Workshop No.7', 'Atelier Brun', 'House brand', 'Kirkwall Paper', 'Finca Co.']
const expectedDates = ['12 mai', '18 mai', '24 mai', '1 juin', '6 juin', '12 juin', '18 juin', '24 juin', '30 juin']

const poList = Array.from({ length: 9 }, (_, i) => ({
  id: `PO-${9040 + i}`,
  supplier: suppliers[i % 5],
  items: (i + 2) * 12,
  total: 1200 + i * 540,
  status: i % 2 === 0 ? 'Commandé' : 'Reçu partiel',
  expected: expectedDates[i],
  notes: i % 3 === 0 ? 'Urgent' : '',
}))

export default function InventoryPOPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Tous', count: poList.length },
    { key: 'draft', label: 'Brouillons', count: 1 },
    { key: 'ordered', label: 'Commandés', count: poList.filter(p => p.status === 'Commandé').length },
    { key: 'partial', label: 'Reçu partiel', count: poList.filter(p => p.status === 'Reçu partiel').length },
  ]

  const list = poList.filter(p =>
    tab === 'all' ||
    (tab === 'ordered' && p.status === 'Commandé') ||
    (tab === 'partial' && p.status === 'Reçu partiel')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Receipt size={18} />}
        title="Bons de commande fournisseurs"
        actions={
          <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un bon</button>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Bons actifs', v: String(poList.length) },
          { l: 'Valeur totale commandée', v: money(poList.reduce((s, p) => s + p.total, 0)) },
          { l: 'Fournisseurs actifs', v: String(suppliers.length) },
          { l: 'Articles en attente', v: String(poList.reduce((s, p) => s + p.items, 0)) },
          { l: 'Prochain arrivage', v: expectedDates[0] },
        ].map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <table className="table">
          <thead>
            <tr>
              <th className="col-checkbox"><Checkbox /></th>
              <th>Bon</th>
              <th>Fournisseur</th>
              <th>Articles</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Statut</th>
              <th>Attendu</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono">{p.id}</span></td>
                <td className="td-muted">{p.supplier}</td>
                <td className="mono">{p.items}</td>
                <td className="mono td-strong" style={{ textAlign: 'right' }}>{money(p.total)}</td>
                <td>
                  <span className={`badge ${p.status === 'Commandé' ? 'info' : 'ok'}`}>
                    <span className="dot" />{p.status}
                  </span>
                </td>
                <td className="td-muted">{p.expected}</td>
                <td>
                  <button className="btn btn-sm btn-ghost btn-icon"><I.ChevRight size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
