'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { money } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Checkbox } from '@/components/ui/Checkbox'

const transactions = Array.from({ length: 20 }, (_, i) => ({
  id: `TX-${9000 + i}`,
  date: `${22 - (i % 22)} avr 2026`,
  type: ['Vente', 'Remboursement', 'Frais', 'Versement', 'Ajustement'][i % 5],
  description: [
    'Commande #1234 — Boutique en ligne',
    'Remboursement commande #1220',
    'Frais de transaction Merchant OS Payments',
    'Versement vers compte bancaire',
    'Ajustement tarifaire devise',
  ][i % 5],
  amount: [124.95, -39.95, -2.50, -892.40, 1.20][i % 5],
  balance: 4820 - i * 42.5,
}))

export default function FinancePage() {
  const [tab, setTab] = useState('overview')
  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'transactions', label: 'Transactions' },
    { key: 'payouts', label: 'Versements' },
    { key: 'invoices', label: 'Factures' },
  ]

  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Receipt size={18} />}
        title="Finances"
        subtitle="Suivi des paiements, versements et transactions."
        actions={
          <>
            <button className="btn btn-sm"><I.Export size={13} /> Exporter</button>
            <button className="btn btn-sm">Rapport financier <I.ChevDown size={12} /></button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Solde disponible', v: money(4820.50), d: '' },
          { l: 'En attente', v: money(1240.00), d: '+3' },
          { l: 'Ventes nettes (30j)', v: money(38420.80), d: '+12 %' },
          { l: 'Remboursements (30j)', v: money(1840.00), d: '' },
          { l: 'Prochain versement', v: '26 avr', d: '' },
        ].map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">
              {k.v}
              {k.d && <span className="delta up">{k.d}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="tabs mb-12">
        {tabs.map(t => (
          <div
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="detail-grid">
          <div className="stack">
            <div className="card">
              <div className="card-header">
                <div className="card-title"><I.Chart size={14} /><span>Revenus (30 derniers jours)</span></div>
              </div>
              <div className="card-body">
                <div className="kv"><span className="k">Ventes brutes</span><span className="v mono">{money(42180.00)}</span></div>
                <div className="kv"><span className="k">Remboursements</span><span className="v mono">– {money(1840.00)}</span></div>
                <div className="kv"><span className="k">Taxes collectées</span><span className="v mono">{money(6840.00)}</span></div>
                <div className="kv"><span className="k">Frais d&apos;expédition</span><span className="v mono">{money(2420.00)}</span></div>
                <div className="divider" style={{ margin: '8px 0' }} />
                <div className="kv">
                  <span className="k" style={{ fontWeight: 600 }}>Ventes nettes</span>
                  <span className="v mono" style={{ fontSize: 14 }}>{money(38420.80)}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title"><I.CreditCard size={14} /><span>Méthodes de paiement</span></div>
              </div>
              <div className="card-body">
                {[
                  { method: 'Visa', share: '44%', amount: 16905 },
                  { method: 'Mastercard', share: '28%', amount: 10757 },
                  { method: 'Apple Pay', share: '18%', amount: 6915 },
                  { method: 'PayPal', share: '7%', amount: 2689 },
                  { method: 'Autres', share: '3%', amount: 1152 },
                ].map((p, i) => (
                  <div key={i} className="row-between mt-8" style={{ gap: 12 }}>
                    <span className="t">{p.method}</span>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="ts">{p.share}</span>
                      <span className="mono td-muted">{money(p.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack">
            <div className="card">
              <div className="card-header">
                <div className="card-title"><I.Zap size={14} /><span>Merchant OS Payments</span></div>
                <span className="badge ok"><span className="dot" />Actif</span>
              </div>
              <div className="card-body">
                <div className="kv"><span className="k">Solde disponible</span><span className="v mono">{money(4820.50)}</span></div>
                <div className="kv"><span className="k">En attente de versement</span><span className="v mono">{money(1240.00)}</span></div>
                <div className="kv"><span className="k">Prochaine date de versement</span><span className="v">26 avr 2026</span></div>
                <div className="row mt-12">
                  <button className="btn btn-sm btn-primary">Virement manuel</button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title"><I.Clock size={14} /><span>Versements récents</span></div>
              </div>
              <div>
                {[
                  { date: '22 avr 2026', amount: 2840.50, status: 'Payé' },
                  { date: '15 avr 2026', amount: 3120.80, status: 'Payé' },
                  { date: '8 avr 2026', amount: 2640.20, status: 'Payé' },
                  { date: '1 avr 2026', amount: 4820.90, status: 'Payé' },
                ].map((v, i) => (
                  <div key={i} className="card-section">
                    <div className="row-between">
                      <div>
                        <div className="t">{v.date}</div>
                      </div>
                      <div className="hstack">
                        <span className="mono td-strong">{money(v.amount)}</span>
                        <span className="badge ok"><span className="dot" />{v.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'transactions' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="col-checkbox"><Checkbox /></th>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Montant</th>
                <th style={{ textAlign: 'right' }}>Solde</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="col-checkbox"><Checkbox /></td>
                  <td><span className="row-link mono">{t.id}</span></td>
                  <td className="td-muted">{t.date}</td>
                  <td>
                    <span className={`badge ${t.type === 'Vente' ? 'ok' : t.type === 'Remboursement' ? 'warn' : t.type === 'Versement' ? 'info' : 'muted'}`}>
                      <span className="dot" />{t.type}
                    </span>
                  </td>
                  <td className="td-muted truncate" style={{ maxWidth: 240 }}>{t.description}</td>
                  <td className={`mono ${t.amount >= 0 ? 'td-strong' : 'td-muted'}`} style={{ textAlign: 'right' }}>
                    {t.amount >= 0 ? '+' : ''}{money(t.amount)}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>{money(t.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(tab === 'payouts' || tab === 'invoices') && (
        <div className="card">
          <div className="card-body">
            <div className="empty">
              <div className="glyph"><I.Receipt size={22} /></div>
              <h4>{tab === 'payouts' ? 'Versements' : 'Factures'}</h4>
              <p>Aucune donnée pour cette période.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
