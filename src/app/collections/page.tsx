'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { collections } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

export default function CollectionsPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')

  const tabs = [
    { key: 'all', label: 'Toutes', count: collections.length },
    { key: 'live', label: 'Actives', count: collections.filter(c => c.status === 'live').length },
    { key: 'draft', label: 'Brouillons', count: collections.filter(c => c.status === 'draft').length },
    { key: 'archived', label: 'Archivées', count: collections.filter(c => c.status === 'archived').length },
  ]

  const list = collections.filter(c => tab === 'all' || c.status === tab)

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Layers size={18} />}
        title="Collections"
        actions={<button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une collection</button>}
      />
      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox" />
                <th>Collection</th>
                <th>Produits</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td className="td-strong row-link">{c.title}</td>
                  <td className="mono">{c.products}</td>
                  <td className="td-muted">{c.type}</td>
                  <td>
                    <span className={`badge ${c.status === 'live' ? 'ok' : c.status === 'draft' ? 'muted' : 'warn'}`}>
                      <span className="dot" />
                      {c.status === 'live' ? 'Active' : c.status === 'draft' ? 'Brouillon' : 'Archivée'}
                    </span>
                  </td>
                  <td className="td-muted">{c.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager total={collections.length} perPage={20} />
      </div>
    </div>
  )
}
