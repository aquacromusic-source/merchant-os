'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  DataTable,
  Divider,
  Box,
  ActionList,
  Popover,
} from '@shopify/polaris'
import {
  CalendarIcon,
  ChannelsIcon,
  ExportIcon,
  OrderIcon,
  CreditCardIcon,
  AlertTriangleIcon,
  ProductIcon,
  ChartVerticalIcon,
  ChevronDownIcon,
  CheckIcon,
  PersonIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons'
import { analytics, orders as rawOrders } from '@/lib/data'
import { money } from '@/lib/utils'
import { useSite } from '@/contexts/SiteContext'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'

const PALETTE = ['oklch(0.58 0.18 275)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)']

const DATE_GROUPS = [
  {
    title: null,
    items: [
      { label: "Aujourd'hui", value: 'today' },
      { label: 'Hier', value: 'yesterday' },
    ]
  },
  {
    title: 'Derniers',
    items: [
      { label: '30 dernières minutes', value: '30min' },
      { label: '12 dernières heures', value: '12h' },
      { label: '7 derniers jours', value: '7d' },
      { label: '30 derniers jours', value: '30d' },
      { label: '90 derniers jours', value: '90d' },
      { label: '365 derniers jours', value: '365d' },
      { label: 'La semaine dernière', value: 'last-week' },
      { label: 'Le mois dernier', value: 'last-month' },
      { label: 'Le trimestre dernier', value: 'last-quarter' },
      { label: '12 derniers mois', value: '12m' },
      { label: "L'année dernière", value: 'last-year' },
    ]
  },
  {
    title: 'Période à ce jour',
    items: [
      { label: 'Semaine à ce jour', value: 'wtd' },
      { label: 'Mois à ce jour', value: 'mtd' },
      { label: 'Trimestre à ce jour', value: 'qtd' },
      { label: 'Année à ce jour', value: 'ytd' },
    ]
  },
  {
    title: 'Trimestres',
    items: [
      { label: 'T1 2026', value: 'q1-2026' },
      { label: 'T4 2025', value: 'q4-2025' },
      { label: 'T3 2025', value: 'q3-2025' },
      { label: 'T2 2025', value: 'q2-2025' },
    ]
  },
  {
    title: null,
    items: [
      { label: 'Black Friday Cyber Monday', value: 'bfcm' },
      { label: 'Période personnalisée', value: 'custom' },
    ]
  },
]
// Flat list for label lookup
const DATE_RANGES = DATE_GROUPS.flatMap(g => g.items)

export default function DashboardPage() {
  const router = useRouter()
  const { activeSite } = useSite()
  const allOrders = useMemo(() => rawOrders.filter(o => o.site_id === activeSite), [activeSite])
  const A = analytics

  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/stats?site=${activeSite}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [activeSite])

  const [dateRange, setDateRange] = useState('30d')
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; value: string; label: string } | null>(null)

  const selectedLabel = DATE_RANGES.find(r => r.value === dateRange)?.label || '30 derniers jours'

  const kpis = [
    { l: 'Produits', v: stats ? String(stats.totalProducts) : '—', d: '', up: true, sk: A.sessions },
    { l: 'Produits actifs', v: stats ? String(stats.activeCount) : '—', d: '', up: true, sk: A.timeseries },
    { l: 'Valeur catalogue', v: stats ? money(stats.totalValue) : '—', d: '', up: true, sk: A.orders },
    { l: 'Commandes', v: stats ? String(stats.orderCount) : '—', d: '', up: true, sk: A.aov },
    ...(stats?.totalStock !== null && stats?.totalStock !== undefined ? [{ l: 'Stock total', v: String(stats.totalStock), d: '', up: true, sk: A.cvr }] : []),
  ]

  const orderRows = allOrders.slice(0, 6).map(o => [
    o.id,
    o.date,
    o.customer,
    money(o.total),
    o.payment.label,
    o.fulfill.label,
  ])

  const dateLabels = React.useMemo(() => ['22 mar', '28 mar', '4 avr', '10 avr', '16 avr', '22 avr'], [])

  // Interactive chart mouse handler
  const handleChartMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    const idx = Math.round(relX * (A.timeseries.length - 1))
    const clampedIdx = Math.max(0, Math.min(A.timeseries.length - 1, idx))
    const value = A.timeseries[clampedIdx]
    const labelIdx = Math.round(relX * (dateLabels.length - 1))
    const label = dateLabels[Math.max(0, Math.min(dateLabels.length - 1, labelIdx))]
    setTooltipData({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      value: money(value * 800),
      label,
    })
  }, [A.timeseries, dateLabels])

  const handleChartMouseLeave = useCallback(() => {
    setTooltipData(null)
  }, [])

  return (
    <Page
      title="Tableau de bord"
      secondaryActions={[
        {
          content: selectedLabel,
          icon: CalendarIcon,
          onAction: () => setDatePopoverOpen(true),
        },
        { content: 'Tous les canaux', icon: ChannelsIcon },
        { content: 'Exporter', icon: ExportIcon },
      ]}
    >
      {/* Date range picker — Shopify style */}
      {datePopoverOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setDatePopoverOpen(false)}>
          <div
            style={{
              position: 'fixed', top: 60, left: 16, zIndex: 9999,
              background: 'white', border: '1px solid #e5e5e5',
              borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden', display: 'flex', maxHeight: '80vh',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Colonne gauche — groupes de périodes */}
            <div style={{ width: 220, overflowY: 'auto', borderRight: '1px solid #e5e5e5', paddingBlock: 8 }}>
              {DATE_GROUPS.map((group, gi) => (
                <div key={gi}>
                  {group.title && (
                    <div style={{ padding: '8px 16px 3px', fontSize: 11, fontWeight: 600, color: '#8c9196', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {group.title}
                    </div>
                  )}
                  {group.items.map(r => (
                    <div
                      key={r.value}
                      onClick={() => { setDateRange(r.value); if (r.value !== 'custom') setDatePopoverOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 16px', cursor: 'pointer', fontSize: 13,
                        background: dateRange === r.value ? '#f1f1f1' : 'transparent',
                        fontWeight: dateRange === r.value ? 600 : 400,
                        color: '#1a1a1a',
                        transition: 'background 0.1s',
                      }}
                    >
                      {r.label}
                      {dateRange === r.value && <CheckIcon width={14} height={14} />}
                    </div>
                  ))}
                  {gi < DATE_GROUPS.length - 1 && (
                    <div style={{ height: 1, background: '#e5e5e5', margin: '4px 0' }} />
                  )}
                </div>
              ))}
            </div>
            {/* Colonne droite — calendrier si "custom" */}
            {dateRange === 'custom' && (
              <div style={{ padding: 20, minWidth: 340 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>Période personnalisée</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <input type="date" style={{ flex: 1, padding: '7px 10px', border: '1px solid #c9cccf', borderRadius: 6, fontSize: 13 }} />
                  <span style={{ color: '#8c9196', fontWeight: 600 }}>→</span>
                  <input type="date" style={{ flex: 1, padding: '7px 10px', border: '1px solid #c9cccf', borderRadius: 6, fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setDatePopoverOpen(false)} style={{ padding: '7px 16px', border: '1px solid #c9cccf', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 13 }}>Annuler</button>
                  <button onClick={() => setDatePopoverOpen(false)} style={{ padding: '7px 16px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Appliquer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <BlockStack gap="500">
        {/* KPI bar */}
        <InlineGrid columns={5} gap="300">
          {kpis.map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="200" align="start" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                  <Text as="span" variant="bodySm" tone={k.up ? 'success' : 'critical'}>{k.d}</Text>
                </InlineStack>
                <Sparkline data={k.sk} w={200} h={26} />
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        {/* Action pills */}
        <InlineStack gap="200" wrap>
          <Button icon={OrderIcon} onClick={() => router.push('/orders')}>
            Commandes
          </Button>
          <Button icon={ProductIcon} onClick={() => router.push('/products')}>
            {stats ? `${stats.totalProducts} produits` : 'Produits'}
          </Button>
        </InlineStack>

        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Sales chart */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Ventes totales</Text>
                    <ButtonGroup variant="segmented">
                      <Button pressed>Ventes</Button>
                      <Button>Commandes</Button>
                      <Button>Visites</Button>
                    </ButtonGroup>
                  </InlineStack>
                  <BlockStack gap="200">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="050">
                        <Text as="p" variant="headingXl" fontWeight="bold">{stats ? money(stats.totalValue) : '—'}</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Valeur catalogue totale
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200">
                        <Badge tone="attention">{selectedLabel}</Badge>
                        <Badge>Période précédente</Badge>
                      </InlineStack>
                    </InlineStack>
                    <div style={{ position: 'relative' }}>
                      <svg
                        width="100%"
                        height="1"
                        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 10 }}
                        onMouseMove={handleChartMouseMove}
                        onMouseLeave={handleChartMouseLeave}
                      >
                        <rect width="100%" height="220" fill="transparent" />
                      </svg>
                      <AreaChart data={A.timeseries} compareData={A.orders.map(v => v * 0.85)} h={220} />
                      {tooltipData && (
                        <div style={{
                          position: 'absolute',
                          left: tooltipData.x + 12,
                          top: tooltipData.y - 20,
                          background: 'var(--p-color-bg-surface-inverse)',
                          color: 'var(--p-color-text-inverse)',
                          padding: '6px 10px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          pointerEvents: 'none',
                          zIndex: 20,
                          whiteSpace: 'nowrap',
                        }}>
                          {tooltipData.label} · {tooltipData.value}
                        </div>
                      )}
                    </div>
                    <InlineStack align="space-between">
                      {dateLabels.map(d => (
                        <Text key={d} as="span" variant="bodySm" tone="subdued">{d}</Text>
                      ))}
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Recent orders */}
              <Card padding="0">
                <Box padding="400" paddingBlockEnd="0">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Commandes récentes</Text>
                    <Button variant="plain" icon={ChevronRightIcon} onClick={() => router.push('/orders')}>
                      Tout voir
                    </Button>
                  </InlineStack>
                </Box>
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'numeric', 'text', 'text']}
                  headings={['Commande', 'Date', 'Client', 'Total', 'Paiement', 'Livraison']}
                  rows={orderRows}
                />
              </Card>
            </BlockStack>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Assistant card */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack gap="300" blockAlign="start">
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'linear-gradient(135deg, oklch(0.62 0.20 275), oklch(0.55 0.22 295))',
                      display: 'grid', placeItems: 'center', color: 'white'
                    }}>✦</div>
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">Bonjour — prêt à bosser ?</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Votre assistant peut analyser vos chiffres, rédiger des e-mails ou créer des automatisations.
                      </Text>
                    </BlockStack>
                  </InlineStack>
                  <InlineStack gap="200" wrap>
                    {['Résume les ventes', 'Rédige un e-mail VIP', 'Crée une réduction printemps'].map((s, i) => (
                      <Button key={i} variant="plain">{s}</Button>
                    ))}
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Tasks */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">À faire aujourd&apos;hui</Text>
                  </InlineStack>
                  {[
                    { t: 'Traiter 7 commandes en attente', sub: 'depuis 3 canaux', tone: 'warning' as const },
                    { t: 'Revoir 2 rétrofacturations', sub: '#15973 · #15984', tone: 'critical' as const },
                    { t: "Publier l'article de blog", sub: '« Comment nous sélectionnons nos matières »', tone: 'info' as const },
                    { t: 'Configurer TVA UE', sub: 'Settings · Taxes · 4 pays', tone: undefined },
                  ].map((x, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                        <InlineStack gap="200" blockAlign="start">
                          <Badge tone={x.tone}>{String(i + 1)}</Badge>
                          <BlockStack gap="050">
                            <Text as="p" variant="bodySm" fontWeight="semibold">{x.t}</Text>
                            <Text as="p" variant="bodySm" tone="subdued">{x.sub}</Text>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    </div>
                  ))}
                </BlockStack>
              </Card>

              {/* Top products */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Top produits</Text>
                    <Button variant="plain" onClick={() => router.push('/analytics')}>Analyses</Button>
                  </InlineStack>
                  {A.topProducts.slice(0, 5).map((p, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                        <InlineStack gap="200" blockAlign="center" align="space-between">
                          <BlockStack gap="050">
                            <Text as="p" variant="bodySm" fontWeight="semibold">{p.name}</Text>
                            <Text as="p" variant="bodySm" tone="subdued">{p.units} unités · {money(p.rev)}</Text>
                          </BlockStack>
                          <Sparkline data={A.timeseries.slice(i * 3, i * 3 + 12).length ? A.timeseries.slice(i * 3, i * 3 + 12) : [10, 20, 15, 24, 30, 28, 40]} w={58} h={22} />
                        </InlineStack>
                      </Box>
                    </div>
                  ))}
                </BlockStack>
              </Card>

              {/* Sessions donut */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Sessions par canal</Text>
                    <ButtonGroup variant="segmented">
                      <Button pressed size="slim">30j</Button>
                      <Button size="slim">90j</Button>
                    </ButtonGroup>
                  </InlineStack>
                  <InlineStack gap="300" blockAlign="center">
                    <Donut segments={A.channelsMix.map(c => ({ label: c.name, value: c.share }))} size={128} />
                    <BlockStack gap="100">
                      {A.channelsMix.slice(0, 5).map((c, i) => (
                        <InlineStack key={i} gap="200" blockAlign="center" align="space-between">
                          <InlineStack gap="100" blockAlign="center">
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i], display: 'inline-block', flexShrink: 0 }} />
                            <Text as="span" variant="bodySm">{c.name}</Text>
                          </InlineStack>
                          <Text as="span" variant="bodySm" fontWeight="semibold">{c.share}%</Text>
                        </InlineStack>
                      ))}
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Activity */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Activité récente</Text>
                  {[
                    { t: 'il y a 4 min', b: <span key="a1"><strong>Liam Sexton</strong> a passé une commande de <strong>133,80 €</strong>.</span> },
                    { t: 'il y a 22 min', b: <span key="a2">Campagne <strong>Teasing collection printemps</strong> — 42 040 e-mails envoyés.</span> },
                    { t: 'il y a 40 min', b: <span key="a3">Stock bas pour <strong>Nomad Roll-Top Backpack</strong> — 4 unités restantes.</span> },
                    { t: 'il y a 1 h', b: <span key="a4">Nouveau message dans <strong>Inbox</strong> — Dawid B. · question livraison.</span> },
                  ].map((tl, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                        <BlockStack gap="050">
                          <Text as="p" variant="bodySm" tone="subdued">{tl.t}</Text>
                          <Text as="p" variant="bodySm">{tl.b}</Text>
                        </BlockStack>
                      </Box>
                    </div>
                  ))}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  )
}
