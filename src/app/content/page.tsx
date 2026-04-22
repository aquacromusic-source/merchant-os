'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { pages, articles } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Checkbox } from '@/components/ui/Checkbox'

export default function ContentPage() {
  const [view, setView] = useState<'pages' | 'blog'>('pages')

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.FileText size={18} />}
        title="Contenu"
        actions={
          <>
            <button className="btn btn-sm btn-primary">
              <I.Plus size={13} /> {view === 'pages' ? 'Ajouter une page' : 'Ajouter un article'}
            </button>
          </>
        }
      />

      <div className="row" style={{ gap: 6, marginBottom: 16 }}>
        <button className={`btn btn-sm ${view === 'pages' ? 'btn-primary' : ''}`} onClick={() => setView('pages')}>Pages</button>
        <button className={`btn btn-sm ${view === 'blog' ? 'btn-primary' : ''}`} onClick={() => setView('blog')}>Articles de blog</button>
      </div>

      {view === 'pages' ? (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th className="col-checkbox" /><th>Titre</th><th>URL</th><th>Statut</th><th>Mise à jour</th></tr></thead>
            <tbody>
              {pages.map((p, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td className="row-link td-strong">{p.title}</td>
                  <td className="td-muted mono">{p.url}</td>
                  <td>
                    <span className={`badge ${p.status === 'Publié' ? 'ok' : p.status === 'Brouillon' ? 'muted' : 'warn'}`}>
                      <span className="dot" />{p.status}
                    </span>
                  </td>
                  <td className="td-muted">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th className="col-checkbox" /><th>Titre</th><th>Auteur</th><th>Statut</th><th>Date</th><th>Lecture</th></tr></thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td className="row-link td-strong">{a.title}</td>
                  <td className="td-muted">{a.author}</td>
                  <td>
                    <span className={`badge ${a.status === 'Publié' ? 'ok' : a.status === 'Brouillon' ? 'muted' : 'warn'}`}>
                      <span className="dot" />{a.status}
                    </span>
                  </td>
                  <td className="td-muted">{a.date}</td>
                  <td className="td-muted">{a.read}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
