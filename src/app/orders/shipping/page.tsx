'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { orders } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'
import { Pager } from '@/components/ui/Pager'

const carriers = ['GLS', 'Colissimo', 'DHL', 'UPS', 'TNT', 'Chronopost']
const statuses = ['À imprimer', 'Imprimée', 'Expédiée', 'Livrée']

const labels = orders.map((o, i) => ({
  ...o,
  carrier: carriers[i % carriers.length],
  labelStatus: statuses[i % statuses.length],
  tracking: `ZW${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  weight: `${(0.3 + (i % 8) * 0.2).toFixed(1)} kg`,
}))

export default function OrdersShippingPage() {
  const [tab, setTab] = useState('all')
  const tabs = [
    { key: 'all', label: 'Toutes', count: labels.length },
    { key: 'pending', label: 'À imprimer', count: labels.filter(l => l.labelStatus === 'À imprimer').length },
    { key: 'printed', label: 'Imprimées', count: labels.filter(l => l.labelStatus === 'Imprimée').length },
    { key: 'shipped', label: 'Expédiées', count: labels.filter(l => l.labelStatus === 'Expédiée').length },
  ]

  const list = labels.filter(l =>
    tab === 'all' ||
    (tab === 'pending' && l.labelStatus === 'À imprimer') ||
    (tab === 'printed' && l.labelStatus === 'Imprimée') ||
    (tab === 'shipped' && l.labelStatus === 'Expédiée')
  )

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Printer size={18} />}
        title="Étiquettes d'expédition"
        actions={
          <>
            <button className="btn btn-sm"><I.Printer size={13} /> Tout imprimer</button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une étiquette</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'À imprimer', v: String(labels.filter(l => l.labelStatus === 'À imprimer').length) },
          { l: 'Imprimées aujourd\'hui', v: String(labels.filter(l => l.labelStatus === 'Imprimée').length) },
          { l: 'Expédiées', v: String(labels.filter(l => l.labelStatus === 'Expédiée').length) },
          { l: 'Livrées', v: String(labels.filter(l => l.labelStatus === 'Livrée').length) },
          { l: 'Transporteurs actifs', v: String(carriers.length) },
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
              <th>Commande</th>
              <th>Client</th>
              <th>Transporteur</th>
              <th>Numéro de suivi</th>
              <th>Poids</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map(l => (
              <tr key={l.id}>
                <td className="col-checkbox"><Checkbox /></td>
                <td><span className="row-link mono">{l.id}</span></td>
                <td>{l.customer}</td>
                <td className="td-muted">{l.carrier}</td>
                <td className="mono td-muted">{l.labelStatus !== 'À imprimer' ? l.tracking : '—'}</td>
                <td className="mono td-muted">{l.weight}</td>
                <td>
                  <span className={`badge ${l.labelStatus === 'Livrée' ? 'ok' : l.labelStatus === 'Expédiée' ? 'info' : l.labelStatus === 'Imprimée' ? 'warn' : 'muted'}`}>
                    <span className="dot" />{l.labelStatus}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-ghost"><I.Printer size={13} /> Imprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager total={labels.length} perPage={25} />
      </div>
    </div>
  )
}
