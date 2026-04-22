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

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [userMenuActive, setUserMenuActive] = useState(false)

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
