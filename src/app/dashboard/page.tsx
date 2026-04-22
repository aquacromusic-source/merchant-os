'use client'
import React from 'react'
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
  ArrowUpIcon,
  ClockIcon,
  CheckIcon,
  PersonIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons'
import { analytics, orders as allOrders } from '@/lib/data'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'
import { AreaChart } from '@/components/ui/AreaChart'
import { Donut } from '@/components/ui/Donut'

const PALETTE = ['oklch(0.58 0.18 275)', 'oklch(0.62 0.14 195)', 'oklch(0.72 0.12 85)', 'oklch(0.60 0.14 155)', 'oklch(0.65 0.16 25)']

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

export default function DashboardPage() {
  const router = useRouter()
  const A = analytics

  const kpis = [
    { l: 'Visites', v: '46 820', d: '+5 %', up: true, sk: A.sessions },
    { l: 'Ventes totales', v: '30 580 €', d: '+11 %', up: true, sk: A.timeseries },
    { l: 'Commandes', v: '518', d: '+9 %', up: true, sk: A.orders },
    { l: 'Panier moyen', v: '59,03 €', d: '−2 %', up: false, sk: A.aov },
    { l: 'Taux de conversion', v: '0,77 %', d: '+8 %', up: true, sk: A.cvr },
  ]

  const orderRows = allOrders.slice(0, 6).map(o => [
    <Button variant="plain" onClick={() => router.push('/orders/' + o.id.slice(1))} key={o.id}>
      <span style={{ fontFamily: 'monospace' }}>{o.id}</span>
    </Button>,
    <Text as="span" tone="subdued" key={'d' + o.id}>{o.date}</Text>,
    o.customer,
    <Text as="span" fontWeight="semibold" key={'t' + o.id}>{money(o.total)}</Text>,
    paymentBadge(o.payment.tone, o.payment.label),
    paymentBadge(o.fulfill.tone, o.fulfill.label),
  ])

  return (
    <Page
      title="Tableau de bord"
      secondaryActions={[
        { content: '30 derniers jours', icon: CalendarIcon },
        { content: 'Tous les canaux', icon: ChannelsIcon },
        { content: 'Exporter', icon: ExportIcon },
      ]}
    >
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
            7 commandes à traiter
          </Button>
          <Button icon={CreditCardIcon}>1 paiement à saisir</Button>
          <Button icon={AlertTriangleIcon} tone="critical">2 rétrofacturations</Button>
          <Button icon={ProductIcon}>4 produits en rupture</Button>
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
                        <Text as="p" variant="headingXl" fontWeight="bold">30 580,12 €</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          vs. 27 418,90 € période précédente ·{' '}
                          <Text as="span" variant="bodySm" tone="success">+11,5 %</Text>
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200">
                        <Badge tone="attention">30 derniers jours</Badge>
                        <Badge>Période précédente</Badge>
                      </InlineStack>
                    </InlineStack>
                    <AreaChart data={A.timeseries} compareData={A.orders.map(v => v * 0.85)} h={220} />
                    <InlineStack align="space-between">
                      {['22 mar', '28 mar', '4 avr', '10 avr', '16 avr', '22 avr'].map(d => (
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
                          <Badge tone={x.tone}>{i + 1}</Badge>
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
