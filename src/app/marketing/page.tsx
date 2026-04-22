'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { campaigns } from '@/lib/data'
import { money, fmt } from '@/lib/utils'
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader'

export default function MarketingPage() {
  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Megaphone size={18} />}
        title="Marketing"
        subtitle="Campagnes, automatisations et attribution à travers vos canaux."
        actions={
          <>
            <button className="btn btn-sm">Autres actions <I.ChevDown size={12} /></button>
            <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer une campagne</button>
          </>
        }
      />

      <div className="kpi-grid mb-12">
        {[
          { l: 'Chiffre attribué', v: '62 140 €', d: '+18%' },
          { l: 'Impressions', v: '1,4 M', d: '+6%' },
          { l: 'Clics', v: '38 412', d: '+9%' },
          { l: 'ROAS moyen', v: '4,8 ×', d: '+0,3' },
          { l: 'Automatisations actives', v: '12' },
        ].map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}{k.d && <span className="delta up">{k.d}</span>}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <SectionHeader title="Campagnes" icon={<I.Play2 size={14} />} action={<button className="btn btn-sm btn-ghost">Toutes</button>} />
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Campagne</th>
                  <th>Canal</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Envoyées</th>
                  <th style={{ textAlign: 'right' }}>Taux</th>
                  <th style={{ textAlign: 'right' }}>Revenu</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td className="row-link">{c.name}</td>
                    <td className="td-muted">{c.channel}</td>
                    <td>
                      <span className={`badge ${c.status === 'En cours' || c.status === 'Active' ? 'ok' : c.status === 'Envoyée' ? 'info' : c.status === 'Brouillon' ? 'muted' : 'warn'}`}>
                        <span className="dot" />{c.status}
                      </span>
                    </td>
                    <td className="mono" style={{ textAlign: 'right' }}>{c.sent ? fmt(c.sent) : '—'}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{c.rate}</td>
                    <td className="mono td-strong" style={{ textAlign: 'right' }}>{c.rev ? money(c.rev) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <SectionHeader title="Automatisations" icon={<I.Refresh size={14} />} action={<button className="btn btn-sm btn-ghost">Voir tout</button>} />
            <div className="card-body">
              {[
                ["Bienvenue nouveaux abonnés", "Actif", "E-mail · 3 étapes", "2 140 contacts"],
                ["Panier abandonné", "Actif", "E-mail + SMS · 4 étapes", "6 842 contacts"],
                ["Anniversaire client", "Actif", "E-mail · 1 étape", "348 ce mois"],
                ["Réactivation 60 jours", "Pause", "E-mail · 2 étapes", "—"],
                ["Achat croisé post-commande", "Actif", "E-mail · 2 étapes", "1 024 envoyés"],
              ].map((a, i) => (
                <div key={i} className="link-row">
                  <div>
                    <div className="t" style={{ fontWeight: 500 }}>{a[0]}</div>
                    <div className="ts">{a[2]} · {a[3]}</div>
                  </div>
                  <span className={`badge ${a[1] === 'Actif' ? 'ok' : 'muted'}`}><span className="dot" />{a[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Attribution (derniers 30j)" icon={<I.Chart size={14} />} />
            <div className="card-body">
              {[
                ["Recherche payante", 22310, "35,9%"],
                ["Email", 18420, "29,6%"],
                ["Social", 12120, "19,5%"],
                ["Direct", 7210, "11,6%"],
                ["Affiliation", 2080, "3,4%"],
              ].map((row, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div className="row-between">
                    <span className="t">{row[0]}</span>
                    <span className="mono tm">{money(row[1] as number)} <span className="ts">· {row[2]}</span></span>
                  </div>
                  <div className="progress" style={{ marginTop: 4 }}>
                    <div className="bar" style={{ width: row[2] as string }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
