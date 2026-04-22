'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
  Tag,
  ProgressBar,
  TextField,
} from '@shopify/polaris'
import {
  ChevronLeftIcon,
  RefreshIcon,
  ArchiveIcon,
  EditIcon,
  ChevronDownIcon,
  DeliveryIcon,
  CreditCardIcon,
  LabelPrinterIcon,
  ClockIcon,
  NoteIcon,
  PersonIcon,
  ShieldCheckMarkIcon,
  ChartVerticalIcon,
  ImageIcon,
} from '@shopify/polaris-icons'
import { orders, customers } from '@/lib/data'
import { money } from '@/lib/utils'

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const order = orders.find(o => o.id.slice(1) === params.id) || orders[0]
  const cust = customers.find(c => c.id === order.customerId) || customers[0]

  const riskProgress = order.risk === 'high' ? 80 : order.risk === 'medium' ? 50 : 18
  const riskTone = order.risk === 'high' ? 'critical' : order.risk === 'medium' ? 'warning' : 'success'

  return (
    <Page
      backAction={{ content: 'Commandes', onAction: () => router.push('/orders') }}
      title={order.id}
      titleMetadata={
        <InlineStack gap="200">
          {order.payment.label}
          {order.fulfill.label}
        </InlineStack>
      }
      subtitle="22 avril 2026 · 08:28 · Boutique en ligne"
      secondaryActions={[
        { content: 'Rembourser', icon: RefreshIcon },
        { content: 'Retourner', icon: ArchiveIcon },
        { content: 'Modifier', icon: EditIcon },
        { content: 'Autres actions', icon: ChevronDownIcon },
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* Fulfillment card */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <DeliveryIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">
                      Traitée ({order.items})
                    </Text>
                    <Badge>{order.location}</Badge>
                  </InlineStack>
                  <Button variant="plain" icon={ChevronDownIcon} />
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  22 avril 2026 · Suivi GLS · <span style={{ fontFamily: 'monospace' }}>ZWLLMWFI</span>
                </Text>
                <Divider />
                {[
                  { name: 'George Russell Fire', variant: 'A3 · Cadre noir', sku: 'SH-GR-FIRE-A3-BLK', qty: 1, price: 44.95 },
                  { name: 'Nomad Roll-Top Backpack', variant: 'Taille unique · Noir', sku: 'MOS-1004', qty: 1, price: 189.00 },
                ].map((li, i) => (
                  <InlineStack key={i} gap="300" blockAlign="start">
                    <div style={{
                      width: 48, height: 48, borderRadius: 8,
                      background: 'var(--p-color-bg-surface-secondary)',
                      border: '1px solid var(--p-color-border)',
                      display: 'grid', placeItems: 'center', flexShrink: 0
                    }}>
                      <ImageIcon width={18} height={18} />
                    </div>
                    <BlockStack gap="050" >
                      <Text as="p" variant="bodySm" fontWeight="semibold">{li.name}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">{li.variant}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <span style={{ fontFamily: 'monospace' }}>{li.sku}</span>
                      </Text>
                    </BlockStack>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {money(li.price)} × {li.qty}
                    </Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      {money(li.price * li.qty)}
                    </Text>
                  </InlineStack>
                ))}
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Expédiée le 22 avril · reçue estimée 25 avril
                  </Text>
                  <Button icon={LabelPrinterIcon} size="slim">Imprimer étiquette</Button>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Payment */}
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <CreditCardIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Paiement</Text>
                  <Badge tone="success">Payée</Badge>
                </InlineStack>
                {[
                  [`Sous-total · ${order.items} articles`, money(order.total - 8.95)],
                  [`Expédition · ${order.ship}`, money(8.95)],
                  ['TVA (comprise)', money(order.total * 0.17)],
                ].map(([k, v], i) => (
                  <InlineStack key={i} align="space-between">
                    <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      <span style={{ fontFamily: 'monospace' }}>{v}</span>
                    </Text>
                  </InlineStack>
                ))}
                <Divider />
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" fontWeight="bold">Total</Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    <span style={{ fontFamily: 'monospace' }}>{money(order.total)}</span>
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Payé via Visa ···· 8937</Text>
                  <Text as="p" variant="bodySm">
                    <span style={{ fontFamily: 'monospace' }}>{money(order.total)}</span>
                  </Text>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Timeline */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="200" blockAlign="center">
                  <ClockIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Calendrier</Text>
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--p-color-bg-fill-tertiary)',
                    display: 'grid', placeItems: 'center', flexShrink: 0
                  }}>A</div>
                  <TextField label="" labelHidden placeholder="Laisser un commentaire…" autoComplete="off" />
                  <Button variant="primary" size="slim">Publier</Button>
                </InlineStack>
                <Divider />
                {[
                  { t: 'il y a 16 min', b: <span key="t1"><strong>GLS France</strong> a envoyé un e-mail de confirmation d&apos;expédition.</span>, tone: 'success' as const },
                  { t: 'il y a 41 min', b: <span key="t2">Le traitement de la commande a été débloqué.</span>, tone: 'attention' as const },
                  { t: '08:28', b: <span key="t3">L&apos;e-mail de confirmation de commande a été envoyé.</span>, tone: undefined },
                  { t: '08:28', b: <span key="t4"><span style={{ fontFamily: 'monospace' }}>Un paiement de {money(order.total)} a été traité avec une carte Visa.</span></span>, tone: 'attention' as const },
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

        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            {/* Notes */}
            <Card>
              <BlockStack gap="200">
                <InlineStack gap="200" blockAlign="center">
                  <NoteIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Notes</Text>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">Aucune note du client</Text>
              </BlockStack>
            </Card>

            {/* Customer */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <PersonIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Client</Text>
                  </InlineStack>
                  <Button variant="plain" icon={ChevronDownIcon} />
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--p-color-bg-fill-tertiary)',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                    fontSize: 12, fontWeight: 600
                  }}>
                    {cust.name.charAt(0)}
                  </div>
                  <BlockStack gap="050">
                    <Button variant="plain" onClick={() => router.push('/customers/' + cust.id)}>
                      {cust.name}
                    </Button>
                    <Text as="p" variant="bodySm" tone="subdued">{cust.orders} commande{cust.orders > 1 ? 's' : ''}</Text>
                  </BlockStack>
                </InlineStack>
                <Divider />
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">COORDONNÉES</Text>
                  <Text as="p" variant="bodySm">
                    <span style={{ fontFamily: 'monospace' }}>{cust.email}</span>
                  </Text>
                </BlockStack>
                <Divider />
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">ADRESSE DE LIVRAISON</Text>
                  <Text as="p" variant="bodySm">{cust.name}<br />{cust.city}, {cust.country}</Text>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Risk */}
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <ShieldCheckMarkIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Risque de la commande</Text>
                </InlineStack>
                <ProgressBar progress={riskProgress} tone={riskTone === "warning" ? "critical" : (riskTone as "success" | "critical")} />
                <Text as="p" variant="bodySm" tone="subdued">
                  Le risque de rétrofacturation est {order.risk === 'high' ? 'élevé' : order.risk === 'medium' ? 'moyen' : 'faible'}.
                </Text>
              </BlockStack>
            </Card>

            {/* Tags */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Balises</Text>
                {order.tags.length > 0 ? (
                  <InlineStack gap="200" wrap>
                    {order.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </InlineStack>
                ) : (
                  <Text as="p" variant="bodySm" tone="subdued">Aucune balise</Text>
                )}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
