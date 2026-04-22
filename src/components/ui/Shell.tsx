'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { I } from '@/lib/icons'

const NAV_MAIN = [
  { key: 'dashboard', label: 'Accueil', icon: I.Home },
  { key: 'orders', label: 'Commandes', icon: I.Cart, count: '9 999+',
    sub: [
      { key: 'orders', label: 'Toutes les commandes' },
      { key: 'orders/drafts', label: 'Brouillons' },
      { key: 'orders/shipping', label: "Étiquettes d'expédition" },
      { key: 'orders/abandoned', label: 'Paniers abandonnés' },
    ]},
  { key: 'products', label: 'Produits', icon: I.Box,
    sub: [
      { key: 'products', label: 'Tous les produits' },
      { key: 'collections', label: 'Collections' },
      { key: 'inventory', label: 'Stock' },
      { key: 'inventory/transfers', label: 'Transferts' },
      { key: 'inventory/po', label: 'Bons de commande' },
      { key: 'products/giftcards', label: 'Cartes cadeaux' },
    ]},
  { key: 'customers', label: 'Clients', icon: I.Users },
  { key: 'content', label: 'Contenu', icon: I.FileText },
  { key: 'marketing', label: 'Marketing', icon: I.Megaphone },
  { key: 'discounts', label: 'Réductions', icon: I.Percent },
  { key: 'analytics', label: 'Analyses de données', icon: I.Chart },
]

const NAV_CHANNELS = [
  { key: 'storefront', label: 'Boutique en ligne', icon: I.Store,
    sub: [
      { key: 'storefront', label: 'Thèmes' },
      { key: 'storefront/pages', label: 'Pages' },
      { key: 'storefront/blog', label: 'Articles de blog' },
      { key: 'storefront/navigation', label: 'Navigation' },
      { key: 'storefront/preferences', label: 'Préférences' },
    ]},
  { key: 'channels/meta', label: 'Meta (IG & FB)', icon: I.Instagram },
  { key: 'channels/google', label: 'Google & YouTube', icon: I.Youtube },
  { key: 'channels/tiktok', label: 'TikTok Shop', icon: I.Tiktok },
  { key: 'channels/pinterest', label: 'Pinterest', icon: I.Pinterest },
  { key: 'channels/pos', label: 'Point de vente', icon: I.POS },
  { key: 'channels', label: 'Tous les canaux', icon: I.Plug },
]

const NAV_APPS = [
  { key: 'apps/review-flow', label: 'ReviewFlow', icon: I.Star },
  { key: 'apps/ship-desk', label: 'ShipDesk', icon: I.Truck },
  { key: 'apps/subscribe', label: 'SubscribeKit', icon: I.Refresh },
  { key: 'apps/mailbuilder', label: 'MailBuilder', icon: I.Mail },
  { key: 'apps', label: 'Toutes les applications', icon: I.Grid },
]

interface CmdItem {
  label: string
  icon: React.FC<{ size?: number }>
  route?: string
  kbd?: string
}

const CMD_GROUPS: { title: string; items: CmdItem[] }[] = [
  { title: 'Aller à', items: [
    { label: 'Accueil', icon: I.Home, route: '/dashboard' },
    { label: 'Commandes', icon: I.Cart, route: '/orders' },
    { label: 'Produits', icon: I.Box, route: '/products' },
    { label: 'Clients', icon: I.Users, route: '/customers' },
    { label: 'Analyses', icon: I.Chart, route: '/analytics' },
    { label: 'Marketing', icon: I.Megaphone, route: '/marketing' },
    { label: 'Réductions', icon: I.Percent, route: '/discounts' },
    { label: 'Paramètres', icon: I.Gear, route: '/settings' },
  ]},
  { title: 'Actions', items: [
    { label: 'Créer une commande', icon: I.Plus, kbd: '⌘ N' },
    { label: 'Ajouter un produit', icon: I.Plus },
    { label: 'Créer une réduction', icon: I.Percent },
  ]},
]

interface SidebarItemDef {
  key: string
  label: string
  icon?: React.FC<{ size?: number }>
  count?: string
  sub?: { key: string; label: string }[]
}

function SidebarItem({ item, active, onNav, iconOnly }: {
  item: SidebarItemDef
  active: string
  onNav: (k: string) => void
  iconOnly?: boolean
}) {
  const isActive = active === item.key || active.startsWith(item.key + '/')
  const isExactActive = active === item.key
  const hasSub = item.sub && item.sub.length > 0
  const subOpen = hasSub && isActive

  // Icône pleine par défaut, creuse quand la section est active (sous-page ouverte)
  const iconStyle: React.CSSProperties = {
    flexShrink: 0,
    opacity: isActive ? 0.9 : 1,
    strokeWidth: isActive ? 1.5 : 2.5,  // creuse = strokeWidth faible, pleine = fort
    fill: isActive ? 'none' : 'currentColor',
    stroke: 'currentColor',
  }

  return (
    <>
      <button
        className={`nav-item ${isExactActive && !hasSub ? 'active' : isExactActive ? 'active' : ''}`}
        onClick={() => onNav(item.key)}
        title={iconOnly ? item.label : undefined}
      >
        {item.icon && (
          <span style={iconStyle}>
            <item.icon size={16} />
          </span>
        )}
        {!iconOnly && <span className="truncate">{item.label}</span>}
        {!iconOnly && item.count && <span className="count">{item.count}</span>}
      </button>
      {!iconOnly && subOpen && hasSub && (
        <div className="nav-sub" style={{ position: 'relative' }}>
          {/* Ligne verticale reliant parent aux sous-items */}
          <span style={{
            position: 'absolute',
            left: 12,
            top: 0,
            bottom: 8,
            width: 1,
            background: '#c8c8c8',
            borderRadius: 1,
          }}/>
          {item.sub!.map(s => (
            <button
              key={s.key}
              className={`nav-item ${active === s.key ? 'active' : ''}`}
              onClick={() => onNav(s.key)}
              style={{ paddingLeft: 28 }}
            >
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQ, setCmdQ] = useState('')

  const active = pathname?.replace(/^\//, '') || 'dashboard'

  const onNav = useCallback((key: string) => {
    router.push('/' + key)
    setNavOpen(false)
  }, [router])

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(v => !v)
      }
      if (e.key === 'Escape') {
        setCmdOpen(false)
        setNavOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const iconOnly = false // controlled by CSS media query

  return (
    <div className={`app${navOpen ? ' nav-open' : ''}`}>
      {/* Topbar */}
      <header className="topbar">
        <button className="menu-btn" onClick={() => setNavOpen(v => !v)} aria-label="Menu">
          <I.Menu size={18} />
        </button>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div className="brand-name">Merchant OS</div>
        </div>
        <div className="topbar-search">
          <I.Search size={14} className="search-icon" />
          <input
            placeholder="Rechercher produits, commandes, clients…"
            onFocus={() => setCmdOpen(true)}
            readOnly
          />
          <span className="kbd-inline">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </span>
        </div>
        <div className="topbar-right">
          <button className="top-iconbtn top-iconbtn-extra" title="Aide"><I.Help size={16} /></button>
          <button className="top-iconbtn" title="Notifications">
            <I.Bell size={16} />
            <span className="dot" />
          </button>
          <div className="store-pill">
            <div className="avatar" style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, oklch(0.75 0.12 50), oklch(0.65 0.14 30))', fontSize: 10 }}>S</div>
            <span>Studio Nord & Co</span>
            <I.ChevDown size={13} className="icon-chev" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-section">
          {NAV_MAIN.map(item => (
            <SidebarItem key={item.key} item={item} active={active} onNav={onNav} />
          ))}
        </div>
        <div className="sidebar-group-label">
          Canaux de vente <I.ChevRight size={11} />
        </div>
        <div className="sidebar-section" style={{ paddingTop: 0 }}>
          {NAV_CHANNELS.map(item => (
            <SidebarItem key={item.key} item={item} active={active} onNav={onNav} />
          ))}
        </div>
        <div className="sidebar-group-label">
          Applications <I.ChevRight size={11} />
        </div>
        <div className="sidebar-section" style={{ paddingTop: 0 }}>
          {NAV_APPS.map(item => (
            <SidebarItem key={item.key} item={item} active={active} onNav={onNav} />
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--nav-border)' }}>
          <button
            className={`nav-item ${active === 'markets' ? 'active' : ''}`}
            onClick={() => onNav('markets')}
          >
            <I.Globe size={16} />
            <span>Marchés</span>
          </button>
          <button
            className={`nav-item ${active === 'finance' ? 'active' : ''}`}
            onClick={() => onNav('finance')}
          >
            <I.Receipt size={16} />
            <span>Finances</span>
          </button>
          <button
            className={`nav-item ${active.startsWith('settings') ? 'active' : ''}`}
            onClick={() => onNav('settings')}
          >
            <I.Gear size={16} />
            <span>Paramètres</span>
          </button>
        </div>
      </nav>

      {/* Mobile scrim */}
      <div className="scrim-mobile" onClick={() => setNavOpen(false)} />

      {/* Main content */}
      <main className="main">
        {children}
      </main>

      {/* Command Palette */}
      {cmdOpen && (
        <div className="modal-scrim" onClick={() => setCmdOpen(false)}>
          <div className="cmdp" onClick={e => e.stopPropagation()}>
            <div className="cmdp-input">
              <I.Search size={16} />
              <input
                autoFocus
                value={cmdQ}
                onChange={e => setCmdQ(e.target.value)}
                placeholder="Rechercher dans tout Merchant OS…"
              />
              <span className="kbd">Esc</span>
            </div>
            <div className="cmdp-list">
              {CMD_GROUPS.map((g, gi) => (
                <div key={gi}>
                  <div className="cmdp-group">{g.title}</div>
                  {g.items
                    .filter(it => !cmdQ || it.label.toLowerCase().includes(cmdQ.toLowerCase()))
                    .map((it, ii) => (
                      <button
                        key={ii}
                        className="cmdp-item"
                        onClick={() => {
                          if (it.route) { router.push(it.route); setCmdOpen(false) }
                        }}
                      >
                        <it.icon size={15} />
                        <span>{it.label}</span>
                        {it.kbd && <span className="kbd" style={{ marginLeft: 'auto' }}>{it.kbd}</span>}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
