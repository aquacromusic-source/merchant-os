'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { discounts } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

export default function DiscountsPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const tabs = [
    { key: 'all', label: 'Toutes', count: discounts.length },
    { key: 'active', label: 'Actives', count: discounts.filter(d => d.status === 'Actif').length },
    { key: 'scheduled', label: 'Programmées', count: discounts.filter(d => d.status === 'Programmée').length },
    { key: 'expired', label: 'Expirées', count: discounts.filter(d => d.status === 'Expirée').length },
  ]

  const list = discounts.filter(d =>
    tab === 'all' || (tab === 'active' && d.status === 'Actif') ||
    (tab === 'scheduled' && d.status === 'Programmée') ||
    (tab === 'expired' && d.status === 'Expirée')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Percent size={18} />}
        title="Réductions"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une réduction</button>
          </>
        }
      />
      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox" />
                <th>Titre</th>
                <th>Statut</th>
                <th>Méthode</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Utilisé</th>
              </tr>
            </thead>
            <tbody>
              {list.map(d => (
                <tr key={d.code} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td>
                    <div className="row-link mono" style={{ fontWeight: 600 }}>{d.code}</div>
                    <div className="ts">{d.descr}</div>
                  </td>
                  <td><span className={`badge ${d.status === 'Actif' ? 'ok' : d.status === 'Programmée' ? 'warn' : 'muted'}`}><span className="dot" />{d.status}</span></td>
                  <td className="td-muted">{d.type}</td>
                  <td className="td-muted">{d.kind}</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{d.uses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager total={discounts.length} perPage={50} />
      </div>
    </div>
  )
}
