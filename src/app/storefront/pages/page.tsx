'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { pages } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

export default function StorefrontPagesPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Toutes', count: pages.length },
    { key: 'published', label: 'Publiées', count: pages.filter(p => p.status === 'Publié').length },
    { key: 'draft', label: 'Brouillons', count: pages.filter(p => p.status === 'Brouillon').length },
  ]

  const list = pages.filter(p =>
    tab === 'all' ||
    (tab === 'published' && p.status === 'Publié') ||
    (tab === 'draft' && p.status === 'Brouillon')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.FileText size={18} />}
        title="Pages"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une page</button>
          </>
        }
      />
      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <table className="table">
          <thead>
            <tr>
              <th className="col-checkbox"><Checkbox /></th>
              <th>Titre</th>
              <th>URL</th>
              <th>Statut</th>
              <th>Dernière modification</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={i} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link" style={{ fontWeight: 500 }}>{p.title}</span></td>
                <td className="mono ts">{p.url}</td>
                <td>
                  <span className={`badge ${p.status === 'Publié' ? 'ok' : 'muted'}`}>
                    <span className="dot" />{p.status}
                  </span>
                </td>
                <td className="td-muted">{p.updated}</td>
                <td>
                  <div className="hstack">
                    <button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>
                    <button className="btn btn-sm btn-ghost btn-icon"><I.Eye size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={pages.length} perPage={25} />
      </div>
    </div>
  )
}
