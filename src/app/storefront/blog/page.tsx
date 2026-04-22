'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { articles } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

export default function StorefrontBlogPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Tous', count: articles.length },
    { key: 'published', label: 'Publiés', count: articles.filter(a => a.status === 'Publié').length },
    { key: 'draft', label: 'Brouillons', count: articles.filter(a => a.status === 'Brouillon').length },
    { key: 'scheduled', label: 'Programmés', count: articles.filter(a => a.status === 'Programmée').length },
  ]

  const list = articles.filter(a =>
    tab === 'all' ||
    (tab === 'published' && a.status === 'Publié') ||
    (tab === 'draft' && a.status === 'Brouillon') ||
    (tab === 'scheduled' && a.status === 'Programmée')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Newspaper size={18} />}
        title="Articles de blog"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Écrire un article</button>
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
              <th>Auteur</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Lecture</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((a, i) => (
              <tr key={i} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link" style={{ fontWeight: 500 }}>{a.title}</span></td>
                <td className="td-muted">{a.author}</td>
                <td>
                  <span className={`badge ${a.status === 'Publié' ? 'ok' : a.status === 'Programmée' ? 'warn' : 'muted'}`}>
                    <span className="dot" />{a.status}
                  </span>
                </td>
                <td className="td-muted">{a.date}</td>
                <td className="td-muted">{a.read}</td>
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
        <Pager total={articles.length} perPage={25} />
      </div>
    </div>
  )
}
