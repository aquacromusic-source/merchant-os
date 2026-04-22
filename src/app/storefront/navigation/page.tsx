'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { PageHeader } from '@/components/ui/PageHeader'

const menus = [
  {
    name: 'Menu principal',
    handle: 'main-menu',
    items: [
      { label: 'Accueil', url: '/' },
      { label: 'Boutique', url: '/collections/all' },
      { label: 'Nouveautés', url: '/collections/nouveautes-printemps' },
      { label: 'À propos', url: '/pages/about' },
      { label: 'Blog', url: '/blogs/journal' },
    ],
  },
  {
    name: 'Menu pied de page',
    handle: 'footer-menu',
    items: [
      { label: 'Service client', url: '/pages/support' },
      { label: 'Livraison & retours', url: '/pages/shipping' },
      { label: 'Confidentialité', url: '/policies/privacy-policy' },
      { label: 'CGV', url: '/policies/terms-of-service' },
    ],
  },
  {
    name: 'Navigation mobile',
    handle: 'mobile-nav',
    items: [
      { label: 'Boutique', url: '/collections/all' },
      { label: 'Nouveautés', url: '/collections/nouveautes-printemps' },
      { label: 'Compte', url: '/account' },
    ],
  },
]

export default function StorefrontNavigationPage() {
  return (
    <div className="page page-wide">
      <PageHeader
        icon={<I.Menu size={18} />}
        title="Navigation"
        actions={
          <button className="btn btn-sm btn-primary"><I.Plus size={13} /> Créer un menu</button>
        }
      />

      <div className="stack">
        {menus.map((menu, mi) => (
          <div className="card" key={mi}>
            <div className="card-header">
              <div className="card-title">
                <I.Sort size={14} />
                <span>{menu.name}</span>
                <span className="badge muted">{menu.items.length} liens</span>
              </div>
              <div className="hstack">
                <button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>
              </div>
            </div>
            <div>
              {menu.items.map((item, ii) => (
                <div key={ii} className="card-section">
                  <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                    <I.Sort size={14} style={{ color: 'var(--ink-4)', cursor: 'grab' }} />
                    <div style={{ flex: 1 }}>
                      <div className="t" style={{ fontWeight: 500 }}>{item.label}</div>
                      <div className="ts mono">{item.url}</div>
                    </div>
                    <button className="btn btn-sm btn-ghost btn-icon"><I.Edit size={13} /></button>
                    <button className="btn btn-sm btn-ghost btn-icon"><I.X size={12} /></button>
                  </div>
                </div>
              ))}
              <div className="card-body" style={{ paddingTop: 8 }}>
                <button className="btn btn-sm btn-ghost"><I.Plus size={12} /> Ajouter un élément</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
