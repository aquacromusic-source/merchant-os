'use client'
import React from 'react'
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
import { analytics } from '@/lib/data'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'

const PALETTE = ['oklch(0.58 0.15 45)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)', 'oklch(0.55 0.10 320)']

export default function AnalyticsPage() {
  const A = analytics

  const kpis = [
    { l: 'Ventes totales', v: '30 580 €', d: '+11%', up: true },
    { l: 'Commandes', v: '518', d: '+9%', up: true },
    { l: 'Taux de conversion', v: '0,77 %', d: '+8%', up: true },
    { l: 'Panier moyen', v: '59,03 €', d: '−2%', up: false },
    { l: 'Retours', v: '24', d: '+3', up: false },
    { l: 'Sessions', v: '46 820', d: '+5%', up: true },
  ]

  const topProductRows = A.topProducts.map((p, i) => [
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
        <InlineGrid columns={6} gap="300">
          {kpis.map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="100" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                  <Text as="span" variant="bodySm" tone={k.up ? 'success' : 'critical'}>{k.d}</Text>
                </InlineStack>
                <Sparkline data={A.timeseries.map(v => v + (i * 2))} w={180} />
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
            <AreaChart data={A.timeseries} compareData={A.orders.map(v => v * 0.9)} h={260} />
          </BlockStack>
        </Card>

        <InlineGrid columns={3} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <GlobeIcon width={16} height={16} />
                <Text as="h2" variant="headingSm" fontWeight="semibold">Sessions par canal</Text>
              </InlineStack>
              <InlineStack gap="300" blockAlign="center">
                <Donut segments={A.channelsMix.map(c => ({ label: c.name, value: c.share }))} size={120} />
                <BlockStack gap="100">
                  {A.channelsMix.map((c, i) => (
                    <InlineStack key={i} gap="100" blockAlign="center" align="space-between">
                      <InlineStack gap="100" blockAlign="center">
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i], display: 'inline-block' }} />
                        <Text as="span" variant="bodySm">{c.name}</Text>
                      </InlineStack>
                      <Text as="span" variant="bodySm" fontWeight="semibold">{c.share}%</Text>
                    </InlineStack>
                  ))}
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <GlobeIcon width={16} height={16} />
                <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes par pays</Text>
              </InlineStack>
              {A.countries.map((c, i) => (
                <BlockStack key={i} gap="100">
                  <InlineStack align="space-between">
                    <Text as="p" variant="bodySm">{c.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{c.share}%</Text>
                  </InlineStack>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--p-color-bg-fill-tertiary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.share * 2}%`, background: 'var(--p-color-bg-fill-emphasis)', borderRadius: 3 }} />
                  </div>
                </BlockStack>
              ))}
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
