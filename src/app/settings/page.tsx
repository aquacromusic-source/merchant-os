'use client'
import React, { useState } from 'react'
import { I } from '@/lib/icons'
import { PageHeader } from '@/components/ui/PageHeader'

const SETTINGS_NAV = [
  ['general', 'Général', 'Store'],
  ['plan', 'Forfait', 'Zap'],
  ['billing', 'Facturation', 'Receipt'],
  ['users', 'Utilisateurs et permissions', 'Users'],
  ['payments', 'Paiements', 'CreditCard'],
  ['checkout', 'Finalisation de commande', 'ShoppingBag'],
  ['accounts', 'Comptes clients', 'Users'],
  ['shipping', 'Expédition et livraison', 'Truck'],
  ['taxes', 'Taxes et droits de douane', 'Percent'],
  ['locations', 'Emplacements', 'Location'],
  ['domains', 'Domaines', 'Globe'],
  ['notifications', 'Notifications', 'Bell'],
  ['brand', 'Marque', 'Palette'],
  ['files', 'Fichiers', 'Folder'],
]

function SettingContent({ active }: { active: string }) {
  if (active === 'general') return (
    <div className="stack">
      <div className="card">
        <div className="card-header"><div className="card-title">Informations sur la boutique</div></div>
        <div className="card-body">
          <div className="field"><label className="label">Nom de la boutique</label><input className="input" defaultValue="Studio Nord & Co" /></div>
          <div className="field"><label className="label">E-mail du compte</label><input className="input" type="email" defaultValue="hello@studionord.co" /></div>
          <div className="field"><label className="label">Numéro de téléphone</label><input className="input" defaultValue="+33 1 42 00 00 00" /></div>
          <div className="field"><label className="label">Devise</label><select className="select"><option>EUR — Euro</option><option>USD — Dollar</option></select></div>
          <div className="row mt-12"><button className="btn btn-sm btn-primary">Enregistrer</button></div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Adresse de la boutique</div></div>
        <div className="card-body">
          <div className="field"><label className="label">Adresse</label><input className="input" defaultValue="12 rue des Ateliers" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label className="label">Ville</label><input className="input" defaultValue="Paris" /></div>
            <div className="field"><label className="label">Code postal</label><input className="input" defaultValue="75011" /></div>
          </div>
          <div className="field"><label className="label">Pays</label><select className="select"><option>France</option></select></div>
          <div className="row mt-12"><button className="btn btn-sm btn-primary">Enregistrer</button></div>
        </div>
      </div>
    </div>
  )

  if (active === 'shipping') return (
    <div className="stack">
      <div className="card">
        <div className="card-header"><div className="card-title"><I.Truck size={14} /><span>Expédition et livraison</span></div></div>
        <div className="card-body">
          <div className="info-row">
            <div><div className="t" style={{ fontWeight: 500 }}>Profil d&apos;expédition général</div><div className="ts">3 zones · 7 tarifs</div></div>
            <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
          </div>
          <div className="info-row mt-8">
            <div><div className="t" style={{ fontWeight: 500 }}>Expédition locale</div><div className="ts">Non configurée</div></div>
            <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
          </div>
        </div>
      </div>
    </div>
  )

  if (active === 'payments') return (
    <div className="stack">
      <div className="card">
        <div className="card-header"><div className="card-title"><I.CreditCard size={14} /><span>Fournisseur de paiement</span></div></div>
        <div className="card-body">
          <div className="info-row">
            <div>
              <div className="t" style={{ fontWeight: 500 }}>Merchant OS Payments</div>
              <div className="ts">Actif · Visa, Mastercard, Apple Pay, Google Pay</div>
            </div>
            <span className="badge ok"><span className="dot" />Actif</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (active === 'taxes') return (
    <div className="stack">
      <div className="card">
        <div className="card-header"><div className="card-title"><I.Percent size={14} /><span>Taxes et droits de douane</span></div></div>
        <div className="card-body">
          <div className="banner warn">
            <I.Warning size={16} />
            <div className="banner-body">
              <div className="banner-title">Configuration TVA UE requise</div>
              <div className="banner-text">Configurez votre numéro OSS/IOSS pour les ventes en Europe.</div>
            </div>
          </div>
          {[
            ['France', '20% TVA standard'],
            ['Allemagne', '19% TVA standard'],
            ['Espagne', '21% IVA'],
            ['Pays-Bas', '21% BTW'],
          ].map(([c, r], i) => (
            <div key={i} className="info-row mt-8">
              <div><div className="t" style={{ fontWeight: 500 }}>{c}</div><div className="ts">{r}</div></div>
              <I.ChevRight size={14} style={{ color: 'var(--ink-4)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Default fallback
  return (
    <div className="card">
      <div className="card-body">
        <div className="empty">
          <div className="glyph"><I.Gear size={22} /></div>
          <h4>Section en cours de configuration</h4>
          <p>Cette section sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [active, setActive] = useState('general')

  return (
    <div className="page">
      <PageHeader
        title="Paramètres"
        subtitle="Gérez votre boutique, votre compte et vos préférences."
      />
      <div className="settings-shell">
        <div className="settings-nav">
          <div className="card" style={{ padding: 10 }}>
            <div className="row" style={{ gap: 10, padding: '6px 6px 10px', borderBottom: '1px solid var(--divider)', marginBottom: 6 }}>
              <div className="thumb lg" style={{ background: 'linear-gradient(135deg, oklch(0.75 0.12 50), oklch(0.65 0.14 30))', color: 'white', fontWeight: 600 }}>S</div>
              <div><div className="t" style={{ fontWeight: 600 }}>Studio Nord & Co</div><div className="ts mono">studionord.co</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SETTINGS_NAV.map(([key, label]) => (
                <button
                  key={key}
                  className={`nav-item ${active === key ? 'active' : ''}`}
                  style={{ color: active === key ? undefined : 'var(--ink-2)', background: active === key ? undefined : 'transparent', borderColor: active === key ? 'var(--border)' : 'transparent', border: active === key ? '1px solid var(--border)' : '1px solid transparent', height: 30 }}
                  onClick={() => setActive(key)}
                >
                  <span>{label as string}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="stack">
          <SettingContent active={active} />
        </div>
      </div>
    </div>
  )
}
