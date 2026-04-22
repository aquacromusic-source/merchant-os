'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { themes } from '@/lib/data'
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader'

export default function StorefrontPage() {
  return (
    <div className="page">
      <PageHeader icon={<I.Store size={18} />} title="Boutique en ligne" />

      {/* Current theme */}
      <div className="card mb-12">
        <div className="card-header">
          <div className="card-title"><I.Palette size={14} /><span>Thème actuel</span></div>
          <div className="hstack">
            <span className="badge warn"><span className="dot" />Mise à jour dispo</span>
            <button className="btn btn-sm">Aperçu</button>
            <button className="btn btn-sm btn-primary">Personnaliser</button>
          </div>
        </div>
        <div className="card-body">
          <div className="row" style={{ gap: 16 }}>
            <div className="ph-img" style={{ width: 160, height: 110 }}>aperçu</div>
            <div>
              <div className="h3">{themes.current.name}</div>
              <div className="tm mt-8">Version {themes.current.version} · Enregistré {themes.current.saved}</div>
              <div className="row mt-12">
                <button className="btn btn-sm"><I.Edit size={13} /> Modifier le code</button>
                <button className="btn btn-sm"><I.Copy size={13} /> Dupliquer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drafts */}
      <div className="card mb-12">
        <SectionHeader title="Thèmes de développement" icon={<I.Layers size={14} />} action={<button className="btn btn-sm btn-ghost"><I.Plus size={13} /> Ajouter</button>} />
        <div>
          {themes.drafts.map((t, i) => (
            <div key={i} className="card-section">
              <div className="row" style={{ gap: 12 }}>
                <div className="ph-img" style={{ width: 80, height: 56 }}>draft</div>
                <div style={{ flex: 1 }}>
                  <div className="t" style={{ fontWeight: 500 }}>{t.name}</div>
                  <div className="ts">v{t.version} · Enregistré {t.saved}</div>
                </div>
                <div className="hstack">
                  <button className="btn btn-sm">Aperçu</button>
                  <button className="btn btn-sm btn-ghost">Publier</button>
                  <button className="btn btn-sm btn-ghost btn-icon"><I.Dots size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="card mb-12">
        <SectionHeader title="Navigation" icon={<I.Sort size={14} />} />
        <div className="card-body">
          {["Menu principal", "Menu pied de page", "Navigation mobile"].map((m, i) => (
            <div key={i} className="info-row">
              <div><div className="t" style={{ fontWeight: 500 }}>{m}</div><div className="ts">3–8 liens</div></div>
              <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <SectionHeader title="Préférences" icon={<I.Gear size={14} />} />
        <div className="card-body">
          <div className="field"><label className="label">Titre de la boutique</label><input className="input" defaultValue="Studio Nord & Co" /></div>
          <div className="field"><label className="label">Meta description</label><textarea className="textarea" rows={2} defaultValue="Boutique artisanale en ligne — objets du quotidien, éditions limitées." /></div>
          <div className="row mt-12">
            <button className="btn btn-sm btn-primary">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
