'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { I } from '@/lib/icons'
import { customers } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { NameAvatar } from '@/components/ui/NameAvatar'
import { Pager } from '@/components/ui/Pager'

export default function CustomersPage() {
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [sel, setSel] = useState<Set<string>>(new Set())

  const tabs = [
    { key: 'all', label: 'Tous', count: customers.length },
    { key: 'subscribed', label: 'Abonnés', count: customers.filter(c => c.subscribed).length },
    { key: 'vip', label: 'VIP', count: customers.filter(c => c.tags.includes('VIP')).length },
    { key: 'risk', label: 'À risque', count: customers.filter(c => c.status === 'À risque').length },
  ]

  const list = customers.filter(c => {
    if (tab === 'subscribed' && !c.subscribed) return false
    if (tab === 'vip' && !c.tags.includes('VIP')) return false
    if (tab === 'risk' && c.status !== 'À risque') return false
    return true
  })

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Users size={18} />}
        title="Clients"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm"><I.Import size={13} /> Importer</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Ajouter un client</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Total clients', v: '3 248', d: '+12%' },
          { l: 'Abonnés', v: '1 842', d: '+8%' },
          { l: 'Valeur vie · moyenne', v: '189,20 €' },
          { l: 'Taux de retour', v: '26 %', d: '+2 pts' },
          { l: 'Segments actifs', v: '8' },
        ].map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}{k.d && <span className="delta up">{k.d}</span>}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox" />
                <th>Nom</th>
                <th>E-mail</th>
                <th>Ville</th>
                <th>Commandes</th>
                <th style={{ textAlign: 'right' }}>Dépensé</th>
                <th>Dernière commande</th>
                <th>Abonné</th>
                <th>Balises</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id} onClick={() => router.push('/customers/' + c.id)} style={{ cursor: 'pointer' }}>
                  <td className="col-checkbox" onClick={e => e.stopPropagation()}>
                    <Checkbox checked={sel.has(c.id)} onChange={() => { const n = new Set(sel); n.has(c.id) ? n.delete(c.id) : n.add(c.id); setSel(n) }} />
                  </td>
                  <td><div className="row" style={{ gap: 8 }}><NameAvatar name={c.name} className="sm" /><span className="row-link">{c.name}</span></div></td>
                  <td className="td-muted mono">{c.email}</td>
                  <td className="td-muted">{c.city}, {c.country}</td>
                  <td className="mono">{c.orders}</td>
                  <td className="mono td-strong" style={{ textAlign: 'right' }}>{money(c.spend)}</td>
                  <td className="td-muted">{c.lastOrder}</td>
                  <td><span className={`badge ${c.subscribed ? 'ok' : 'muted'}`}><span className="dot" />{c.subscribed ? 'Oui' : 'Non'}</span></td>
                  <td>{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="mobile-cards" style={{ display: 'none' }}>
          {list.map(c => (
            <div key={c.id} className="mobile-card" onClick={() => router.push('/customers/' + c.id)}>
              <div className="mobile-card-row">
                <div className="row" style={{ gap: 8 }}>
                  <NameAvatar name={c.name} className="sm" />
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                </div>
                <span className={`badge ${c.subscribed ? 'ok' : 'muted'}`}><span className="dot" />{c.subscribed ? 'Abonné' : 'Non abonné'}</span>
              </div>
              <div className="mobile-card-row">
                <span className="td-muted">{c.city} · {c.orders} commandes</span>
                <span className="mono td-strong">{money(c.spend)}</span>
              </div>
            </div>
          ))}
        </div>
        <Pager total={customers.length} perPage={26} />
      </div>
    </div>
  )
}
