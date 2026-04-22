'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/PageHeader'

export default function StorefrontPreferencesPage() {
  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Gear size={18} />}
        title="Préférences"
        actions={
          <button className="btn btn-sm btn-primary">Enregistrer</button>
        }
      />

      <div className="detail-grid">
        <div className="stack">
          <div className="card">
            <SectionHeader title="Titre et méta-description" />
            <div className="card-body">
              <div className="field">
                <label className="label">Titre de la boutique</label>
                <input className="input" defaultValue="Studio Nord & Co — Objets durables pour la maison" />
              </div>
              <div className="field">
                <label className="label">Méta-description</label>
                <textarea className="textarea" rows={3} defaultValue="Objets durables, papeterie, café — conçus en France." />
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Favicon" />
            <div className="card-body">
              <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                <div className="thumb lg" style={{ background: 'var(--surface-2)', fontWeight: 700, fontSize: 18 }}>S</div>
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>favicon.ico</div>
                  <div className="ts">32×32 px recommandé</div>
                </div>
                <button className="btn btn-sm">Changer</button>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Restriction de contenu" />
            <div className="card-body">
              <div className="row-between">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Protection par mot de passe</div>
                  <div className="ts">Seuls les visiteurs avec le mot de passe peuvent voir votre boutique.</div>
                </div>
                <span className="badge muted"><span className="dot" />Désactivé</span>
              </div>
              <div className="row-between mt-8">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Âge minimum requis</div>
                  <div className="ts">Afficher une bannière de vérification d&apos;âge.</div>
                </div>
                <span className="badge muted"><span className="dot" />Non</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <SectionHeader title="Analytics" />
            <div className="card-body">
              <div className="field">
                <label className="label">Google Tag</label>
                <input className="input mono" defaultValue="G-8F2EXX9Q21" />
              </div>
              <div className="field">
                <label className="label">Pixel Meta</label>
                <input className="input mono" defaultValue="842191204" />
              </div>
              <div className="field">
                <label className="label">TikTok Pixel</label>
                <input className="input mono" defaultValue="CQL4ERTA" />
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Cookies et consentement" />
            <div className="card-body">
              <div className="row-between">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Bannière de consentement</div>
                  <div className="ts">Mode strict UE — RGPD</div>
                </div>
                <span className="badge ok"><span className="dot" />Activé</span>
              </div>
              <div className="row-between mt-8">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Politique de cookies</div>
                  <div className="ts">Lien vers /policies/cookies</div>
                </div>
                <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Paramètres SEO" />
            <div className="card-body">
              <div className="field">
                <label className="label">Format du titre</label>
                <input className="input" defaultValue="{{ product.title }} | Studio Nord & Co" />
              </div>
              <div className="row-between mt-8">
                <div>
                  <div className="t" style={{ fontWeight: 500 }}>Sitemap XML</div>
                  <div className="ts mono">studionord.co/sitemap.xml</div>
                </div>
                <button className="btn btn-sm btn-ghost"><I.Eye size={13} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
