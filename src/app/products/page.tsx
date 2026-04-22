'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { products } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar, BulkBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Sparkline } from '@/components/ui/Sparkline'
import { Pager } from '@/components/ui/Pager'

export default function ProductsPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const tabs = [
    { key: 'all', label: 'Tous', count: products.length },
    { key: 'live', label: 'Actifs', count: products.filter(p => p.status === 'live').length },
    { key: 'draft', label: 'Brouillons', count: products.filter(p => p.status === 'draft').length },
    { key: 'archived', label: 'Archivés', count: products.filter(p => p.status === 'archived').length },
  ]

  const list = products.filter(p => {
    if (tab !== 'all' && p.status !== tab) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })
  const toggle = (id: string) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n) }
  const allSel = list.length > 0 && list.every(p => sel.has(p.id))

  const kpis = [
    { l: 'Période', v: '30 jours' },
    { l: 'Taux de vente moyen', v: '0,1 %' },
    { l: 'Analyse ABC · A', v: '105 363 €' },
    { l: 'Analyse ABC · B', v: '15 059 €' },
    { l: 'Analyse ABC · C', v: '4 525 939 €' },
  ]

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Box size={18} />}
        title="Produits"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm"><I.Import size={13} /> Importer</button>
            <button className="btn btn-sm btn-primary" onClick={() => router.push('/products/P-1002')}><I.Plus size={13} /> Ajouter un produit</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value" style={{ fontSize: 15 }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {sel.size > 0
          ? <BulkBar count={sel.size} onClear={() => setSel(new Set())} actions={<>
              <button className="btn btn-sm"><I.Eye size={13} /> Rendre actif</button>
              <button className="btn btn-sm"><I.Archive size={13} /> Archiver</button>
              <button className="btn btn-sm"><I.Tag size={13} /> Baliser</button>
            </>} />
          : <FilterBar tabs={tabs} active={tab} onTab={setTab} search={search} onSearch={setSearch} />
        }
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox"><Checkbox checked={allSel} indeterminate={!allSel && sel.size > 0} onChange={() => setSel(allSel ? new Set() : new Set(list.map(p => p.id)))} /></th>
                <th style={{ width: 44, paddingRight: 0 }}></th>
                <th>Produit</th>
                <th>Statut</th>
                <th>Stock</th>
                <th>Catégorie</th>
                <th>Canaux</th>
                <th>Fournisseur</th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => {
                const statusTone = p.status === 'live' ? 'ok' : p.status === 'draft' ? 'muted' : 'warn'
                const statusLabel = p.status === 'live' ? 'Actif' : p.status === 'draft' ? 'Brouillon' : 'Archivé'
                return (
                  <tr key={p.id} className={sel.has(p.id) ? 'selected' : ''} onClick={() => router.push('/products/' + p.id)} style={{ cursor: 'pointer' }}>
                    <td className="col-checkbox" onClick={e => e.stopPropagation()}><Checkbox checked={sel.has(p.id)} onChange={() => toggle(p.id)} /></td>
                    <td style={{ paddingRight: 0 }}><div className="thumb"><I.Image size={13} /></div></td>
                    <td><span className="row-link">{p.title}</span></td>
                    <td><span className={`badge ${statusTone}`}><span className="dot" />{statusLabel}</span></td>
                    <td>{p.stock === 0 ? <span className="td-muted">Stock non suivi</span> : <span className="t" style={{ color: 'var(--ink-2)' }}>{p.stock} en stock</span>}</td>
                    <td className="td-muted">{p.category}</td>
                    <td className="mono">{p.channels}</td>
                    <td className="td-muted">{p.vendor}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="mobile-cards" style={{ display: 'none' }}>
          {list.map(p => {
            const statusTone = p.status === 'live' ? 'ok' : p.status === 'draft' ? 'muted' : 'warn'
            const statusLabel = p.status === 'live' ? 'Actif' : p.status === 'draft' ? 'Brouillon' : 'Archivé'
            return (
              <div key={p.id} className="mobile-card" onClick={() => router.push('/products/' + p.id)}>
                <div className="mobile-card-row">
                  <span className="row-link" style={{ fontWeight: 500 }}>{p.title}</span>
                  <span className={`badge ${statusTone}`}><span className="dot" />{statusLabel}</span>
                </div>
                <div className="mobile-card-row">
                  <span className="td-muted">{p.category} · {p.vendor}</span>
                  <span className="td-strong mono">{money(p.price)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <Pager page={1} total={list.length} perPage={50} />
      </div>
    </div>
  )
}
