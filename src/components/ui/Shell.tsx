'use client'

import React, { useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Frame,
  Navigation,
  TopBar,
  Text,
} from '@shopify/polaris'
import {
  HomeIcon,
  OrderIcon,
  OrderDraftIcon,
  CartAbandonedIcon,
  ShippingLabelIcon,
  ProductIcon,
  CollectionIcon,
  InventoryIcon,
  TransferIcon,
  GiftCardIcon,
  PersonIcon,
  ContentIcon,
  MegaphoneIcon,
  DiscountIcon,
  ChartVerticalIcon,
  StoreIcon,
  BlogIcon,
  ChannelsIcon,
  AppsIcon,
  MarketsIcon,
  FinanceIcon,
  SettingsIcon,
  LogoInstagramIcon,
  LogoYoutubeIcon,
  LogoTiktokIcon,
  LogoPinterestIcon,
  PointOfSaleIcon,
  NotificationIcon,
  QuestionCircleIcon,
  SearchIcon,
  StarIcon,
  DeliveryIcon,
  RefreshIcon,
  EmailIcon,
} from '@shopify/polaris-icons'

const NOTIFICATIONS = [
  { id: '1', title: 'Nouvelle commande #16042', body: 'Liam Sexton · 133,80 €', time: 'il y a 4 min', tone: 'success' as const, read: false },
  { id: '2', title: 'Paiement reçu', body: 'Visa ···· 8937 · 233,95 €', time: 'il y a 18 min', tone: 'success' as const, read: false },
  { id: '3', title: 'Stock bas', body: 'Nomad Roll-Top Backpack — 4 unités', time: 'il y a 40 min', tone: 'warning' as const, read: false },
  { id: '4', title: 'Rétrofacturation ouverte', body: '#15973 · 89,00 € — répondre avant 3j', time: 'il y a 2 h', tone: 'critical' as const, read: false },
  { id: '5', title: 'Campagne envoyée', body: 'Teasing printemps · 42 040 destinataires', time: 'il y a 3 h', tone: undefined, read: true },
  { id: '6', title: 'Nouveau message client', body: 'Dawid B. — question sur la livraison', time: 'il y a 5 h', tone: undefined, read: true },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [userMenuActive, setUserMenuActive] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === 'undefined') return NOTIFICATIONS
    try {
      const saved = localStorage.getItem('mos_notifications')
      if (saved) return JSON.parse(saved)
    } catch {}
    return NOTIFICATIONS
  })

  const unreadCount = notifications.filter((n: any) => !n.read).length

  const markAllRead = () => {
    setNotifications([])
    if (typeof window !== 'undefined') {
      localStorage.setItem('mos_notifications_cleared', 'true')
      localStorage.setItem('mos_notifications', JSON.stringify([]))
    }
  }

  const active = pathname?.replace(/^\//, '') || 'dashboard'

  const toggleMobileNavigation = useCallback(() => {
    setMobileNavigationActive((v) => !v)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    setSearchActive(value.length > 0)
  }, [])

  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false)
    setSearchValue('')
  }, [])

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [
            { content: 'Tableau de bord', onAction: () => router.push('/dashboard') },
            { content: 'Paramètres', onAction: () => router.push('/settings') },
          ],
        },
      ]}
      name="Studio Nord & Co"
      detail="studionord.co"
      initials="S"
      open={userMenuActive}
      onToggle={() => setUserMenuActive((v) => !v)}
    />
  )

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Rechercher produits, commandes, clients…"
      showFocusBorder
    />
  )

  const notifBellMarkup = (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <button
        onClick={() => setNotifOpen(v => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 8px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          position: 'relative',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
        aria-label="Notifications"
      >
        <NotificationIcon width={20} height={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: 'oklch(0.55 0.22 25)',
            color: 'white',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unreadCount}
          </span>
        )}
      </button>
      {notifOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 498 }}
            onClick={() => setNotifOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            zIndex: 499,
            background: 'var(--p-color-bg-surface)',
            border: '1px solid var(--p-color-border)',
            borderRadius: 12,
            boxShadow: 'var(--p-shadow-lg)',
            width: 360,
            maxHeight: 480,
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '14px 16px 10px',
              borderBottom: '1px solid var(--p-color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Text as="p" fontWeight="semibold">Notifications</Text>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: 'var(--p-color-text-interactive)',
                  }}
                >
                  Tout marquer lu
                </button>
              )}
            </div>
            {(notifications as any[]).map((n: any) => (
              <div
                key={n.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--p-color-border-subdued)',
                  background: n.read ? 'transparent' : 'var(--p-color-bg-surface-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
                onClick={() => setNotifications(prev => {
                    const updated = prev.filter(x => x.id !== n.id)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('mos_notifications', JSON.stringify(updated))
                    }
                    return updated
                  })}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                  background: !n.read
                    ? (n.tone === 'critical' ? 'oklch(0.55 0.22 25)'
                      : n.tone === 'warning' ? 'oklch(0.70 0.15 65)'
                      : n.tone === 'success' ? 'oklch(0.60 0.15 145)'
                      : 'var(--p-color-bg-fill-tertiary)')
                    : 'transparent',
                }} />
                <div style={{ flex: 1 }}>
                  <Text as="p" variant="bodySm" fontWeight={n.read ? 'regular' : 'semibold'}>{n.title}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{n.body}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{n.time}</Text>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <Text as="p" tone="subdued">Aucune notification</Text>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchField={searchFieldMarkup}
      searchResultsVisible={searchActive}
      searchResults={
        searchActive ? (
          <div style={{ padding: 16 }}>
            <Text as="p" variant="bodySm" tone="subdued">
              Aucun résultat pour &ldquo;{searchValue}&rdquo;
            </Text>
          </div>
        ) : undefined
      }
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigation}
      secondaryMenu={notifBellMarkup}
    />
  )

  const navigationMarkup = (
    <Navigation location={pathname || '/'}>
      <Navigation.Section
        items={[
          {
            url: '/dashboard',
            label: 'Accueil',
            icon: HomeIcon,
            selected: active === 'dashboard' || active === '',
            onClick: () => router.push('/dashboard'),
          },
          {
            url: '/orders',
            label: 'Commandes',
            icon: OrderIcon,
            badge: '9 999+',
            selected: active.startsWith('orders'),
            onClick: () => router.push('/orders'),
            subNavigationItems: [
              {
                url: '/orders',
                label: 'Toutes les commandes',
                onClick: () => router.push('/orders'),
              },
              {
                url: '/orders/drafts',
                label: 'Brouillons',
                onClick: () => router.push('/orders/drafts'),
              },
              {
                url: '/orders/shipping',
                label: "Étiquettes d'expédition",
                onClick: () => router.push('/orders/shipping'),
              },
              {
                url: '/orders/abandoned',
                label: 'Paniers abandonnés',
                onClick: () => router.push('/orders/abandoned'),
              },
            ],
          },
          {
            url: '/products',
            label: 'Produits',
            icon: ProductIcon,
            selected:
              active.startsWith('products') ||
              active.startsWith('collections') ||
              active.startsWith('inventory'),
            onClick: () => router.push('/products'),
            subNavigationItems: [
              {
                url: '/products',
                label: 'Tous les produits',
                onClick: () => router.push('/products'),
              },
              {
                url: '/collections',
                label: 'Collections',
                onClick: () => router.push('/collections'),
              },
              {
                url: '/inventory',
                label: 'Stock',
                onClick: () => router.push('/inventory'),
              },
              {
                url: '/inventory/transfers',
                label: 'Transferts',
                onClick: () => router.push('/inventory/transfers'),
              },
              {
                url: '/inventory/po',
                label: 'Bons de commande',
                onClick: () => router.push('/inventory/po'),
              },
              {
                url: '/products/giftcards',
                label: 'Cartes cadeaux',
                onClick: () => router.push('/products/giftcards'),
              },
            ],
          },
          {
            url: '/customers',
            label: 'Clients',
            icon: PersonIcon,
            selected: active.startsWith('customers'),
            onClick: () => router.push('/customers'),
          },
          {
            url: '/content',
            label: 'Contenu',
            icon: ContentIcon,
            selected: active === 'content',
            onClick: () => router.push('/content'),
          },
          {
            url: '/marketing',
            label: 'Marketing',
            icon: MegaphoneIcon,
            selected: active === 'marketing',
            onClick: () => router.push('/marketing'),
          },
          {
            url: '/discounts',
            label: 'Réductions',
            icon: DiscountIcon,
            selected: active.startsWith('discounts'),
            onClick: () => router.push('/discounts'),
          },
          {
            url: '/analytics',
            label: 'Analyses de données',
            icon: ChartVerticalIcon,
            selected: active === 'analytics',
            onClick: () => router.push('/analytics'),
          },
        ]}
      />
      <Navigation.Section
        title="Canaux de vente"
        items={[
          {
            url: '/storefront',
            label: 'Boutique en ligne',
            icon: StoreIcon,
            selected: active.startsWith('storefront'),
            onClick: () => router.push('/storefront'),
            subNavigationItems: [
              {
                url: '/storefront',
                label: 'Thèmes',
                onClick: () => router.push('/storefront'),
              },
              {
                url: '/storefront/pages',
                label: 'Pages',
                onClick: () => router.push('/storefront/pages'),
              },
              {
                url: '/storefront/blog',
                label: 'Articles de blog',
                onClick: () => router.push('/storefront/blog'),
              },
              {
                url: '/storefront/navigation',
                label: 'Navigation',
                onClick: () => router.push('/storefront/navigation'),
              },
              {
                url: '/storefront/preferences',
                label: 'Préférences',
                onClick: () => router.push('/storefront/preferences'),
              },
            ],
          },
          {
            url: '/channels/meta',
            label: 'Meta (IG & FB)',
            icon: LogoInstagramIcon,
            selected: active === 'channels/meta',
            onClick: () => router.push('/channels/meta'),
          },
          {
            url: '/channels/google',
            label: 'Google & YouTube',
            icon: LogoYoutubeIcon,
            selected: active === 'channels/google',
            onClick: () => router.push('/channels/google'),
          },
          {
            url: '/channels/tiktok',
            label: 'TikTok Shop',
            icon: LogoTiktokIcon,
            selected: active === 'channels/tiktok',
            onClick: () => router.push('/channels/tiktok'),
          },
          {
            url: '/channels/pinterest',
            label: 'Pinterest',
            icon: LogoPinterestIcon,
            selected: active === 'channels/pinterest',
            onClick: () => router.push('/channels/pinterest'),
          },
          {
            url: '/channels/pos',
            label: 'Point de vente',
            icon: PointOfSaleIcon,
            selected: active === 'channels/pos',
            onClick: () => router.push('/channels/pos'),
          },
          {
            url: '/channels',
            label: 'Tous les canaux',
            icon: ChannelsIcon,
            selected: active === 'channels',
            onClick: () => router.push('/channels'),
          },
        ]}
      />
      <Navigation.Section
        title="Applications"
        items={[
          {
            url: '/apps/review-flow',
            label: 'ReviewFlow',
            icon: StarIcon,
            selected: active === 'apps/review-flow',
            onClick: () => router.push('/apps/review-flow'),
          },
          {
            url: '/apps/ship-desk',
            label: 'ShipDesk',
            icon: DeliveryIcon,
            selected: active === 'apps/ship-desk',
            onClick: () => router.push('/apps/ship-desk'),
          },
          {
            url: '/apps/subscribe',
            label: 'SubscribeKit',
            icon: RefreshIcon,
            selected: active === 'apps/subscribe',
            onClick: () => router.push('/apps/subscribe'),
          },
          {
            url: '/apps/mailbuilder',
            label: 'MailBuilder',
            icon: EmailIcon,
            selected: active === 'apps/mailbuilder',
            onClick: () => router.push('/apps/mailbuilder'),
          },
          {
            url: '/apps',
            label: 'Toutes les applications',
            icon: AppsIcon,
            selected: active === 'apps',
            onClick: () => router.push('/apps'),
          },
        ]}
        separator
      />
      <Navigation.Section
        separator
        items={[
          {
            url: '/markets',
            label: 'Marchés',
            icon: MarketsIcon,
            selected: active === 'markets',
            onClick: () => router.push('/markets'),
          },
          {
            url: '/finance',
            label: 'Finances',
            icon: FinanceIcon,
            selected: active === 'finance',
            onClick: () => router.push('/finance'),
          },
          {
            url: '/settings',
            label: 'Paramètres',
            icon: SettingsIcon,
            selected: active.startsWith('settings'),
            onClick: () => router.push('/settings'),
          },
        ]}
      />
    </Navigation>
  )

  return (
    <Frame
      topBar={topBarMarkup}
      navigation={navigationMarkup}
      showMobileNavigation={mobileNavigationActive}
      onNavigationDismiss={toggleMobileNavigation}
    >
      {children}
    </Frame>
  )
}
