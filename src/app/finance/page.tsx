'use client'
import React, { useState } from 'react'
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
  Divider,
  Tabs,
  Box,
  IndexTable,
  useIndexResourceState,
  EmptyState,
} from '@shopify/polaris'
import {
  ExportIcon,
  ChevronDownIcon,
  ChartVerticalIcon,
  CreditCardIcon,
  ClockIcon,
  PaymentIcon,
} from '@shopify/polaris-icons'
import { money } from '@/lib/utils'

const transactions = Array.from({ length: 20 }, (_, i) => ({
  id: `TX-${9000 + i}`,
  date: `${22 - (i % 22)} avr 2026`,
  type: ['Vente', 'Remboursement', 'Frais', 'Versement', 'Ajustement'][i % 5],
  description: [
    'Commande #1234 — Boutique en ligne',
    'Remboursement commande #1220',
    'Frais de transaction Merchant OS Payments',
    'Versement vers compte bancaire',
    'Ajustement tarifaire devise',
  ][i % 5],
  amount: [124.95, -39.95, -2.50, -892.40, 1.20][i % 5],
  balance: 4820 - i * 42.5,
}))

function txBadge(type: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'info' | undefined> = {
    'Vente': 'success', 'Remboursement': 'warning', 'Versement': 'info',
  }
  return <Badge tone={toneMap[type]}>{type}</Badge>
}

const TABS = [
  { id: 'overview', content: "Vue d'ensemble" },
  { id: 'transactions', content: 'Transactions' },
  { id: 'payouts', content: 'Versements' },
  { id: 'invoices', content: 'Factures' },
]

export default function FinancePage() {
  const [selectedTab, setSelectedTab] = useState(0)

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    transactions.map(t => ({ id: t.id }))
  )

  const txTab = TABS[selectedTab]?.id || 'overview'

  return (
    <Page
      title="Finances"
      subtitle="Suivi des paiements, versements et transactions."
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon },
        { content: 'Rapport financier', icon: ChevronDownIcon },
      ]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={5} gap="300">
          {[
            { l: 'Solde disponible', v: money(4820.50) },
            { l: 'En attente', v: money(1240.00) },
            { l: 'Ventes nettes (30j)', v: money(38420.80), d: '+12 %' },
            { l: 'Remboursements (30j)', v: money(1840.00) },
            { l: 'Prochain versement', v: '26 avr' },
          ].map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="100" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                  {k.d && k.d}
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={TABS} selected={selectedTab} onSelect={setSelectedTab}>
            {txTab === 'overview' && (
              <Box padding="400">
                <Layout>
                  <Layout.Section>
                    <BlockStack gap="400">
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack gap="200" blockAlign="center">
                            <ChartVerticalIcon width={16} height={16} />
                            <Text as="h2" variant="headingSm" fontWeight="semibold">Revenus (30 derniers jours)</Text>
                          </InlineStack>
                          {[
                            ['Ventes brutes', money(42180.00)],
                            ['Remboursements', `– ${money(1840.00)}`],
                            ['Taxes collectées', money(6840.00)],
                            ["Frais d'expédition", money(2420.00)],
                          ].map(([k, v], i) => (
                            <InlineStack key={i} align="space-between">
                              <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                              <Text as="p" variant="bodySm" fontWeight="semibold">{v}</Text>
                            </InlineStack>
                          ))}
                          <Divider />
                          <InlineStack align="space-between">
                            <Text as="p" fontWeight="bold">Ventes nettes</Text>
                            <Text as="p" fontWeight="bold">{money(38420.80)}</Text>
                          </InlineStack>
                        </BlockStack>
                      </Card>
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack gap="200" blockAlign="center">
                            <CreditCardIcon width={16} height={16} />
                            <Text as="h2" variant="headingSm" fontWeight="semibold">Méthodes de paiement</Text>
                          </InlineStack>
                          {[
                            { method: 'Visa', share: '44%', amount: 16905 },
                            { method: 'Mastercard', share: '28%', amount: 10757 },
                            { method: 'Apple Pay', share: '18%', amount: 6915 },
                            { method: 'PayPal', share: '7%', amount: 2689 },
                            { method: 'Autres', share: '3%', amount: 1152 },
                          ].map((p, i) => (
                            <InlineStack key={i} align="space-between">
                              <Text as="p" variant="bodySm">{p.method}</Text>
                              <InlineStack gap="200">
                                p.share
                                money(p.amount)
                              </InlineStack>
                            </InlineStack>
                          ))}
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="400">
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack align="space-between" blockAlign="center">
                            <InlineStack gap="200" blockAlign="center">
                              <PaymentIcon width={16} height={16} />
                              <Text as="h2" variant="headingSm" fontWeight="semibold">Merchant OS Payments</Text>
                            </InlineStack>
                            <Badge tone="success">Actif</Badge>
                          </InlineStack>
                          {[
                            ['Solde disponible', money(4820.50)],
                            ['En attente de versement', money(1240.00)],
                            ['Prochaine date de versement', '26 avr 2026'],
                          ].map(([k, v], i) => (
                            <InlineStack key={i} align="space-between">
                              <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                              <Text as="p" variant="bodySm" fontWeight="semibold">{v}</Text>
                            </InlineStack>
                          ))}
                          <Button variant="primary">Virement manuel</Button>
                        </BlockStack>
                      </Card>
                      <Card>
                        <BlockStack gap="300">
                          <InlineStack gap="200" blockAlign="center">
                            <ClockIcon width={16} height={16} />
                            <Text as="h2" variant="headingSm" fontWeight="semibold">Versements récents</Text>
                          </InlineStack>
                          {[
                            { date: '22 avr 2026', amount: 2840.50 },
                            { date: '15 avr 2026', amount: 3120.80 },
                            { date: '8 avr 2026', amount: 2640.20 },
                            { date: '1 avr 2026', amount: 4820.90 },
                          ].map((v, i) => (
                            <div key={i}>
                              {i > 0 && <Divider />}
                              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                                <InlineStack align="space-between">
                                  <Text as="p" variant="bodySm">{v.date}</Text>
                                  <InlineStack gap="200">
                                    <Text as="p" variant="bodySm" fontWeight="semibold">{money(v.amount)}</Text>
                                    <Badge tone="success">Payé</Badge>
                                  </InlineStack>
                                </InlineStack>
                              </Box>
                            </div>
                          ))}
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </Layout.Section>
                </Layout>
              </Box>
            )}
            {txTab === 'transactions' && (
              <IndexTable
                resourceName={{ singular: 'transaction', plural: 'transactions' }}
                itemCount={transactions.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                  { title: 'ID' },
                  { title: 'Date' },
                  { title: 'Type' },
                  { title: 'Description' },
                  { title: 'Montant', alignment: 'end' },
                  { title: 'Solde', alignment: 'end' },
                ]}
              >
                {transactions.map((t, index) => (
                  <IndexTable.Row
                    id={t.id}
                    key={t.id}
                    selected={selectedResources.includes(t.id)}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <Text as="span" variant="bodySm">
                        <span style={{ fontFamily: 'monospace' }}>{t.id}</span>
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      t.date
                    </IndexTable.Cell>
                    <IndexTable.Cell>{txBadge(t.type)}</IndexTable.Cell>
                    <IndexTable.Cell>
                      t.description
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span" numeric tone={t.amount >= 0 ? 'success' : 'subdued'} fontWeight="semibold">
                        {t.amount >= 0 ? '+' : ''}{money(t.amount)}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      money(t.balance)
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            )}
            {(txTab === 'payouts' || txTab === 'invoices') && (
              <Box padding="400">
                <EmptyState
                  heading={txTab === 'payouts' ? 'Versements' : 'Factures'}
                  image=""
                >
                  <Text as="p" variant="bodySm" tone="subdued">Aucune donnée pour cette période.</Text>
                </EmptyState>
              </Box>
            )}
          </Tabs>
        </Card>
      </BlockStack>
    </Page>
  )
}
