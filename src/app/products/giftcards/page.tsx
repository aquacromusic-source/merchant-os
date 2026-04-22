'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const firstNames = ['Marie', 'Thomas', 'Claire', 'Lucas', 'Emma', 'Noah', 'Sophie', 'Louis']
const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy']

const giftcards = Array.from({ length: 24 }, (_, i) => ({
  id: `GC-${8000 + i}`,
  code: `GIFT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  customer: `${firstNames[i % 8]} ${lastNames[i % 8]}`,
  initial: [25, 50, 100, 200][i % 4],
  remaining: [25, 50, 100, 200][i % 4] * (i % 3 === 0 ? 0 : i % 3 === 1 ? 0.5 : 1),
  issued: `Il y a ${1 + (i * 3) % 60}j`,
  expires: i % 5 === 0 ? 'Jamais' : `${1 + (i % 12)} jan ${2027 + (i % 2)}`,
  status: i % 7 === 0 ? 'Expiré' : i % 4 === 0 ? 'Utilisé' : 'Actif',
}))

export default function ProductsGiftcardsPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Toutes', count: giftcards.length },
    { key: 'active', label: 'Actives', count: giftcards.filter(g => g.status === 'Actif').length },
    { key: 'used', label: 'Utilisées', count: giftcards.filter(g => g.status === 'Utilisé').length },
    { key: 'expired', label: 'Expirées', count: giftcards.filter(g => g.status === 'Expiré').length },
  ]

  const list = giftcards.filter(g =>
    tab === 'all' ||
    (tab === 'active' && g.status === 'Actif') ||
    (tab === 'used' && g.status === 'Utilisé') ||
    (tab === 'expired' && g.status === 'Expiré')
  )

  const totalValue = giftcards.filter(g => g.status === 'Actif').reduce((s, g) => s + g.remaining, 0)

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Gift size={18} />}
        title="Cartes cadeaux"
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Émettre une carte</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Cartes actives', v: String(giftcards.filter(g => g.status === 'Actif').length) },
          { l: 'Valeur en circulation', v: money(totalValue) },
          { l: 'Cartes utilisées', v: String(giftcards.filter(g => g.status === 'Utilisé').length) },
          { l: 'Cartes expirées', v: String(giftcards.filter(g => g.status === 'Expiré').length) },
          { l: 'Valeur totale émise', v: money(giftcards.reduce((s, g) => s + g.initial, 0)) },
        ].map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <FilterBar tabs={tabs} active={tab} onTab={setTab} />
        <table className="table">
          <thead>
            <tr>
              <th className="col-checkbox"><Checkbox /></th>
              <th>Code</th>
              <th>Client</th>
              <th style={{ textAlign: 'right' }}>Valeur initiale</th>
              <th style={{ textAlign: 'right' }}>Solde restant</th>
              <th>Émise</th>
              <th>Expire</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {list.map(g => (
              <tr key={g.id} style={{ cursor: 'pointer' }}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono">{g.code}</span></td>
                <td>{g.customer}</td>
                <td className="mono" style={{ textAlign: 'right' }}>{money(g.initial)}</td>
                <td className="mono td-strong" style={{ textAlign: 'right' }}>{money(g.remaining)}</td>
                <td className="td-muted">{g.issued}</td>
                <td className="td-muted">{g.expires}</td>
                <td>
                  <span className={`badge ${g.status === 'Actif' ? 'ok' : g.status === 'Utilisé' ? 'muted' : 'warn'}`}>
                    <span className="dot" />{g.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={giftcards.length} perPage={25} />
      </div>
    </div>
  )
}
