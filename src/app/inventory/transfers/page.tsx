'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { locations } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const loc = locations

const transfers = Array.from({ length: 14 }, (_, i) => ({
  id: `TRF-${2040 + i}`,
  from: loc[i % loc.length].name,
  to: loc[(i + 1) % loc.length].name,
  items: 4 + (i * 3) % 18,
  status: i % 3 === 0 ? 'En attente' : i % 5 === 0 ? 'Expédié' : 'Reçu',
  date: `Il y a ${1 + i}j`,
  ref: `REF-${8000 + i * 7}`,
}))

export default function InventoryTransfersPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Tous', count: transfers.length },
    { key: 'open', label: 'Ouverts', count: transfers.filter(t => t.status === 'En attente').length },
    { key: 'shipped', label: 'Expédiés', count: transfers.filter(t => t.status === 'Expédié').length },
    { key: 'received', label: 'Reçus', count: transfers.filter(t => t.status === 'Reçu').length },
  ]

  const list = transfers.filter(t =>
    tab === 'all' ||
    (tab === 'open' && t.status === 'En attente') ||
    (tab === 'shipped' && t.status === 'Expédié') ||
    (tab === 'received' && t.status === 'Reçu')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Truck size={18} />}
        title="Transferts de stock"
        actions={
          <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un transfert</button>
        }
      />

      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <table className="table">
          <thead>
            <tr>
              <th className="col-checkbox"><Checkbox /></th>
              <th>Transfert</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Articles</th>
              <th>Statut</th>
              <th>Date prévue</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono">{t.id}</span></td>
                <td className="td-muted">{t.from}</td>
                <td className="td-muted">{t.to}</td>
                <td className="mono">{t.items}</td>
                <td>
                  <span className={`badge ${t.status === 'En attente' ? 'warn' : t.status === 'Expédié' ? 'info' : 'ok'}`}>
                    <span className="dot" />{t.status}
                  </span>
                </td>
                <td className="td-muted">{t.date}</td>
                <td>
                  <button className="btn btn-sm btn-ghost btn-icon"><I.ChevRight size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={transfers.length} perPage={20} />
      </div>
    </div>
  )
}
