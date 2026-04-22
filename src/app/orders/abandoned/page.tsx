'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { customers } from '@/lib/data'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const cartProducts = [
  'Carnet cuir caramel', 'Tote bag coton naturel', 'Mug en grès', 'Plaid laine mérinos',
  'Bougie soja bergamote', 'Stylo bille rechargeable', 'Sac à dos nomade', 'Cadre photo chêne'
]

const abandonedCarts = customers.slice(0, 18).map((c, i) => ({
  id: `#AB-${2100 + i}`,
  customer: c.name,
  email: c.email,
  total: 25 + (i * 17) % 180,
  items: 1 + (i % 4),
  product: cartProducts[i % cartProducts.length],
  time: `Il y a ${1 + (i * 3) % 72}h`,
  recovered: i % 5 === 0,
}))

export default function OrdersAbandonedPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Tous', count: abandonedCarts.length },
    { key: 'open', label: 'Ouverts', count: abandonedCarts.filter(a => !a.recovered).length },
    { key: 'recovered', label: 'Récupérés', count: abandonedCarts.filter(a => a.recovered).length },
  ]

  const list = abandonedCarts.filter(a =>
    tab === 'all' ||
    (tab === 'open' && !a.recovered) ||
    (tab === 'recovered' && a.recovered)
  )

  const totalRecovered = abandonedCarts.filter(a => a.recovered).reduce((s, a) => s + a.total, 0)
  const totalOpen = abandonedCarts.filter(a => !a.recovered).reduce((s, a) => s + a.total, 0)

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Cart size={18} />}
        title="Paniers abandonnés"
        actions={
          <button className="btn btn-sm btn-primary"><I.Mail size={13} /> Relancer tous</button>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Paniers abandonnés', v: String(abandonedCarts.length) },
          { l: 'Taux de récupération', v: `${Math.round(abandonedCarts.filter(a => a.recovered).length / abandonedCarts.length * 100)} %` },
          { l: 'Valeur récupérée', v: money(totalRecovered) },
          { l: 'Valeur perdue', v: money(totalOpen) },
          { l: 'Valeur moyenne', v: money(abandonedCarts.reduce((s, a) => s + a.total, 0) / abandonedCarts.length) },
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
              <th>Panier</th>
              <th>Client</th>
              <th>Produit</th>
              <th>Articles</th>
              <th style={{ textAlign: 'right' }}>Valeur</th>
              <th>Abandonné</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono">{a.id}</span></td>
                <td>
                  <div className="t">{a.customer}</div>
                  <div className="ts">{a.email}</div>
                </td>
                <td className="td-muted truncate" style={{ maxWidth: 160 }}>{a.product}</td>
                <td className="td-muted">{a.items}</td>
                <td className="mono td-strong" style={{ textAlign: 'right' }}>{money(a.total)}</td>
                <td className="td-muted">{a.time}</td>
                <td>
                  <span className={`badge ${a.recovered ? 'ok' : 'warn'}`}>
                    <span className="dot" />{a.recovered ? 'Récupéré' : 'Ouvert'}
                  </span>
                </td>
                <td>
                  {!a.recovered && (
                    <button className="btn btn-sm btn-ghost"><I.Mail size={13} /> Relancer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={abandonedCarts.length} perPage={25} />
      </div>
    </div>
  )
}
