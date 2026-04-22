'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { orders } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const draftOrders = orders.slice(0, 12).map((o, i) => ({
  ...o,
  id: `#D-${1000 + i}`,
  status: i % 3 === 0 ? 'Devis envoyé' : i % 3 === 1 ? 'Brouillon' : 'Facture ouverte',
  created: `Il y a ${i + 1}j`,
}))

export default function OrdersDraftsPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Tous', count: draftOrders.length },
    { key: 'draft', label: 'Brouillons', count: draftOrders.filter(d => d.status === 'Brouillon').length },
    { key: 'invoice', label: 'Factures ouvertes', count: draftOrders.filter(d => d.status === 'Facture ouverte').length },
  ]

  const list = draftOrders.filter(d =>
    tab === 'all' ||
    (tab === 'draft' && d.status === 'Brouillon') ||
    (tab === 'invoice' && d.status === 'Facture ouverte')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.FileText size={18} />}
        title="Commandes brouillons"
        actions={
          <>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un brouillon</button>
          </>
        }
      />
      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <table className="table">
          <thead>
            <tr>
              <th className="col-checkbox"><Checkbox /></th>
              <th>Commande</th>
              <th>Date</th>
              <th>Client</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Statut</th>
              <th>Articles</th>
            </tr>
          </thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono" style={{ fontWeight: 600 }}>{d.id}</span></td>
                <td className="td-muted">{d.created}</td>
                <td>{d.customer}</td>
                <td className="mono td-strong" style={{ textAlign: 'right' }}>{money(d.total)}</td>
                <td>
                  <span className={`badge ${d.status === 'Facture ouverte' ? 'warn' : d.status === 'Devis envoyé' ? 'info' : 'muted'}`}>
                    <span className="dot" />{d.status}
                  </span>
                </td>
                <td className="td-muted">{d.items} article{d.items > 1 ? 's' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={draftOrders.length} perPage={25} />
      </div>
    </div>
  )
}
