'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { orders } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar, BulkBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Sparkline } from '@/components/ui/Sparkline'
import { Pager } from '@/components/ui/Pager'

const TABS = [
  { key: 'all', label: 'Toutes', count: orders.length },
  { key: 'unfulfilled', label: 'Non traitées', count: orders.filter(o => o.fulfill.key === 'unfulfilled').length },
  { key: 'unpaid', label: 'Non payées', count: orders.filter(o => ['pending','authorized'].includes(o.payment.key)).length },
  { key: 'open', label: 'Ouvertes', count: 18 },
  { key: 'closed', label: 'Fermées', count: 426 },
]

export default function OrdersPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    if (tab === 'unfulfilled' && o.fulfill.key !== 'unfulfilled') return false
    if (tab === 'unpaid' && !['pending','authorized'].includes(o.payment.key)) return false
    if (search && !(o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })
  const allSel = filtered.length > 0 && filtered.every(o => sel.has(o.id))
  const toggle = (id: string) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n) }
  const toggleAll = () => setSel(allSel ? new Set() : new Set(filtered.map(o => o.id)))

  const kpis = [
    { l: "Aujourd'hui", v: '1', d: '+75 %', sk: [4,6,8,7,10,12,16,18,20] },
    { l: 'Articles commandés', v: '3', d: '+73 %', sk: [3,4,6,8,10,12,14,15] },
    { l: 'Retours', v: '0 €', d: '—', sk: [2,2,3,3,2,3,2,2] },
    { l: 'Commandes traitées', v: '12', d: '—', sk: [12,10,14,16,14,12,18,15] },
    { l: 'Commandes livrées', v: '0', d: '+100 %', sk: [0,1,2,4,6,6,8,10] },
  ]

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Cart size={18} />}
        title="Commandes"
        actions={
          <>
            <button className="btn btn-sm"><I.Download size={13} /> Exporter</button>
            <button className="btn btn-sm">Autres actions <I.ChevDown size={12} /></button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une commande</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v} <span className="delta up">{k.d}</span></div>
            <div className="kpi-spark"><Sparkline data={k.sk} w={180} h={24} /></div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {sel.size > 0
          ? <BulkBar count={sel.size} onClear={() => setSel(new Set())} actions={
              <>
                <button className="btn btn-sm"><I.Truck size={13} /> Marquer traitées</button>
                <button className="btn btn-sm"><I.Printer size={13} /> Étiquettes</button>
                <button className="btn btn-sm"><I.Archive size={13} /> Archiver</button>
              </>
            } />
          : <FilterBar tabs={TABS} active={tab} onTab={setTab} search={search} onSearch={setSearch} />
        }
        {/* Desktop table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox"><Checkbox checked={allSel} indeterminate={!allSel && sel.size > 0} onChange={toggleAll} /></th>
                <th>Commande</th>
                <th>Date ↓</th>
                <th>Client</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>Paiement</th>
                <th>Traitement</th>
                <th>Articles</th>
                <th>Mode de livraison</th>
                <th>Canal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className={sel.has(o.id) ? 'selected' : ''} onClick={() => router.push('/orders/' + o.id.slice(1))} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox" onClick={e => e.stopPropagation()}><Checkbox checked={sel.has(o.id)} onChange={() => toggle(o.id)} /></td>
                  <td><span className="row-link mono">{o.id}</span></td>
                  <td className="td-muted">{o.date}</td>
                  <td>{o.customer}</td>
                  <td className="td-strong" style={{ textAlign: 'right' }}>{money(o.total)}</td>
                  <td><span className={`badge ${o.payment.tone}`}><span className="dot" />{o.payment.label}</span></td>
                  <td><span className={`badge ${o.fulfill.tone}`}><span className="dot" />{o.fulfill.label}</span></td>
                  <td className="td-muted">{o.items} article{o.items > 1 ? 's' : ''}</td>
                  <td className="td-muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.ship}</td>
                  <td className="td-muted">{o.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card view */}
        <div className="mobile-cards" style={{ display: 'none' }}>
          {filtered.map(o => (
            <div key={o.id} className="mobile-card" onClick={() => router.push('/orders/' + o.id.slice(1))}>
              <div className="mobile-card-row">
                <span className="mono td-strong">{o.id}</span>
                <span className={`badge ${o.payment.tone}`}><span className="dot" />{o.payment.label}</span>
              </div>
              <div className="mobile-card-row">
                <span className="t">{o.customer}</span>
                <span className="td-strong mono">{money(o.total)}</span>
              </div>
              <div className="mobile-card-row">
                <span className="td-muted">{o.date}</span>
                <span className={`badge ${o.fulfill.tone}`}><span className="dot" />{o.fulfill.label}</span>
              </div>
            </div>
          ))}
        </div>
        <Pager page={1} total={9999} perPage={50} />
      </div>
    </div>
  )
}
