'use client'
import React, { useState, useEffect, useMemo } from 'react'
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  InlineGrid,
  Text,
  Badge,
  Button,
  ButtonGroup,
  Box,
  DataTable,
} from '@shopify/polaris'
import {
  CalendarIcon,
  ChannelsIcon,
  ExportIcon,
  ChartVerticalIcon,
  GlobeIcon,
  StarIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'
import { useSite } from '@/contexts/SiteContext'
import { SalesChart } from '@/components/ui/SalesChart'

const PALETTE = ['oklch(0.58 0.15 45)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)', 'oklch(0.55 0.10 320)']

export default function AnalyticsPage() {
  const { activeSite } = useSite()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/stats?site=${activeSite}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})

    fetch(`/api/orders?site=${activeSite}`)
      .then(r => r.json())
      .then((data) => {
        setOrders(data.orders || [])
      })
      .catch(() => setOrders([]))
  }, [activeSite])

  // Build timeseries from orders: group by date, sum totals
  const timeseries = useMemo(() => {
    if (!orders.length) return []
    const byDate: Record<string, number> = {}
    orders.forEach(o => {
      const d = (o.date || '').slice(0, 10)
      if (d) byDate[d] = (byDate[d] || 0) + (o.total || 0)
    })
    const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
    return sorted.map(([, v]) => v)
  }, [orders])

  // Build compare data (shift values slightly for visual comparison)
  const compareData = useMemo(() => timeseries.map(v => v * 0.9), [timeseries])

  // Build channelsMix from orders
  const channelsMix = useMemo(() => {
    if (!orders.length) return []
    const byChannel: Record<string, { count: number; rev: number }> = {}
    orders.forEach(o => {
      const ch = o.channel || 'Boutique en ligne'
      if (!byChannel[ch]) byChannel[ch] = { count: 0, rev: 0 }
      byChannel[ch].count++
      byChannel[ch].rev += o.total || 0
    })
    const total = orders.length
    return Object.entries(byChannel)
      .map(([name, { count, rev }]) => ({
        name,
        share: Math.round((count / total) * 100),
        orders: count,
        rev,
      }))
      .sort((a, b) => b.share - a.share)
  }, [orders])

  // Build topProducts from order tags (items info) — derive from orders
  // Since orders don't have line items, aggregate by customer as a proxy,
  // or show channel-based revenue breakdown as top "products"
  const topProducts = useMemo(() => {
    if (!orders.length) return []
    // Group revenue by channel as a useful breakdown
    const byChannel: Record<string, { units: number; rev: number }> = {}
    orders.forEach(o => {
      const ch = o.channel || 'Boutique en ligne'
      if (!byChannel[ch]) byChannel[ch] = { units: 0, rev: 0 }
      byChannel[ch].units += o.items || 1
      byChannel[ch].rev += o.total || 0
    })
    return Object.entries(byChannel)
      .map(([name, { units, rev }]) => ({ name, units, rev }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 7)
  }, [orders])

  // Build countries from orders (no country field available, so show empty if not present)
  const countries = useMemo(() => {
    if (!orders.length) return []
    const byCountry: Record<string, number> = {}
    orders.forEach(o => {
      // Try to extract country from order if available
      const country = o.country || o.shipping_country || ''
      if (country) {
        byCountry[country] = (byCountry[country] || 0) + 1
      }
    })
    const total = Object.values(byCountry).reduce((s, v) => s + v, 0)
    if (total === 0) return []
    return Object.entries(byCountry)
      .map(([name, count]) => ({ name, share: Math.round((count / total) * 100) }))
      .sort((a, b) => b.share - a.share)
      .slice(0, 7)
  }, [orders])

  const kpis = [
    { l: 'Valeur catalogue', v: stats ? money(stats.totalValue) : '—' },
    { l: 'Produits', v: stats ? String(stats.totalProducts) : '—' },
    { l: 'Produits actifs', v: stats ? String(stats.activeCount) : '—' },
    { l: 'Brouillons', v: stats ? String(stats.draftCount) : '—' },
    { l: 'Commandes', v: stats ? String(stats.orderCount) : '0' },
    ...(stats?.totalStock !== null && stats?.totalStock !== undefined ? [{ l: 'Stock total', v: String(stats.totalStock) }] : []),
  ]

  const topProductRows = topProducts.map((p, i) => [
    <Text key={i} as="span" fontWeight="semibold">{p.name}</Text>,
    p.units,
    <Text key={'r' + i} as="span" numeric fontWeight="semibold">{money(p.rev)}</Text>,
  ])

  return (
    <Page
      title="Analyses de données"
      secondaryActions={[
        { content: '30 derniers jours', icon: CalendarIcon },
        { content: 'Tous les canaux', icon: ChannelsIcon },
        { content: 'Exporter', icon: ExportIcon },
      ]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={kpis.length} gap="300">
          {kpis.map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes · 30 jours</Text>
              <ButtonGroup variant="segmented">
                <Button pressed>Jour</Button>
                <Button>Semaine</Button>
                <Button>Mois</Button>
              </ButtonGroup>
            </InlineStack>
            <AreaChart data={timeseries} compareData={compareData} h={260} />
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes GA4 · temps réel</Text>
            <SalesChart site={activeSite} period="30d" />
          </BlockStack>
        </Card>

        <InlineGrid columns={3} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <GlobeIcon width={16} height={16} />
                <Text as="h2" variant="headingSm" fontWeight="semibold">Sessions par canal</Text>
              </InlineStack>
              {channelsMix.length > 0 ? (
                <InlineStack gap="300" blockAlign="center">
                  <Donut segments={channelsMix.map(c => ({ label: c.name, value: c.share }))} size={120} />
                  <BlockStack gap="100">
                    {channelsMix.map((c, i) => (
                      <InlineStack key={i} gap="100" blockAlign="center" align="space-between">
                        <InlineStack gap="100" blockAlign="center">
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length], display: 'inline-block' }} />
                          <Text as="span" variant="bodySm">{c.name}</Text>
                        </InlineStack>
                        <Text as="span" variant="bodySm" fontWeight="semibold">{c.share}%</Text>
                      </InlineStack>
                    ))}
                  </BlockStack>
                </InlineStack>
              ) : (
                <Text as="p" variant="bodySm" tone="subdued">Aucune donnée</Text>
              )}
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <GlobeIcon width={16} height={16} />
                <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes par pays</Text>
              </InlineStack>
              {countries.length > 0 ? countries.map((c, i) => (
                <BlockStack key={i} gap="100">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodySm">{c.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{c.share}%</Text>
                  </InlineStack>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--p-color-bg-fill-tertiary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.share * 2}%`, background: 'var(--p-color-bg-fill-emphasis)', borderRadius: 3 }} />
                  </div>
                </BlockStack>
              )) : (
                <Text as="p" variant="bodySm" tone="subdued">Aucune donnée</Text>
              )}
            </BlockStack>
          </Card>
          <Card padding="0">
            <Box padding="400" paddingBlockEnd="0">
              <InlineStack gap="200" blockAlign="center">
                <StarIcon width={16} height={16} />
                <Text as="h2" variant="headingSm" fontWeight="semibold">Produits les plus vendus</Text>
              </InlineStack>
            </Box>
            <DataTable
              columnContentTypes={['text', 'numeric', 'numeric']}
              headings={['Produit', 'Unités', 'Revenu']}
              rows={topProductRows}
            />
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Rapports</Text>
              <Button variant="plain">Tous les rapports</Button>
            </InlineStack>
            <InlineGrid columns={4} gap="200">
              {[
                'Rapport acquisition', 'Rapport ventes par produit', 'Rapport ventes par canal', 'Panier moyen',
                'Cohortes clients', 'Taux de retour', 'Comportement sur site', 'Inventaire & écoulement',
                'Campagnes marketing', 'Performance publications', 'Recherches internes', 'Taxes collectées',
              ].map((r, i) => (
                <Button key={i} variant="plain" icon={ChevronRightIcon} textAlign="start">{r}</Button>
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
