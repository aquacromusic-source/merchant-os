'use client'
import React, { useState } from 'react'
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
} from '@shopify/polaris'
import {
  PlusIcon,
  GlobeIcon,
  ChevronRightIcon,
  DiscountIcon,
  DeliveryIcon,
} from '@shopify/polaris-icons'

const markets = [
  { id: 'primary', name: 'France', countries: ['France'], currency: 'EUR', language: 'Français', status: 'Actif', primary: true, domains: 1, revenue: '92 400 €' },
  { id: 'eu', name: 'Europe', countries: ['Allemagne', 'Espagne', 'Pays-Bas', 'Belgique', 'Suisse', '+14'], currency: 'EUR', language: 'Multilingue', status: 'Actif', primary: false, domains: 0, revenue: '38 120 €' },
  { id: 'uk', name: 'Royaume-Uni', countries: ['Royaume-Uni'], currency: 'GBP', language: 'Anglais', status: 'Actif', primary: false, domains: 1, revenue: '12 840 €' },
  { id: 'us', name: 'États-Unis & Canada', countries: ['États-Unis', 'Canada'], currency: 'USD', language: 'Anglais', status: 'Inactif', primary: false, domains: 0, revenue: '—' },
]

export default function MarketsPage() {
  const [active, setActive] = useState('primary')
  const market = markets.find(m => m.id === active) || markets[0]

  return (
    <Page
      title="Marchés"
      subtitle="Gérez vos marchés internationaux et leurs paramètres de localisation."
      primaryAction={{ content: 'Créer un marché', icon: PlusIcon }}
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Card padding="0">
            <BlockStack gap="050">
              {markets.map((m, i) => (
                <div key={m.id}>
                  {i > 0 && <Divider />}
                  <Box padding="200">
                    <div onClick={() => setActive(m.id)} style={{cursor:'pointer', padding:'8px', background: active === m.id ? 'var(--p-color-bg-surface-selected, #f0f0f0)' : 'transparent', borderRadius: 6}}>
                      <InlineStack gap="200" blockAlign="center" align="space-between">
                        <InlineStack gap="200" blockAlign="center">
                          <GlobeIcon width={16} height={16} />
                          <Text as="span" variant="bodySm" fontWeight="semibold">{m.name}</Text>
                        </InlineStack>
                        {m.primary
                          ? <Badge tone="attention">Principal</Badge>
                          : <Badge tone={m.status === 'Actif' ? 'success' : undefined}>{m.status}</Badge>
                        }
                      </InlineStack>
                    </div>
                  </Box>
                </div>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <GlobeIcon width={16} height={16} />
                    <Text as="h2" variant="headingMd" fontWeight="semibold">{market.name}</Text>
                    {market.primary
                      ? <Badge tone="attention">Principal</Badge>
                      : <Badge tone={market.status === 'Actif' ? 'success' : undefined}>{market.status}</Badge>
                    }
                  </InlineStack>
                  <Button>Gérer</Button>
                </InlineStack>
                {[
                  ['Pays / régions', market.countries.join(', ')],
                  ['Devise', market.currency],
                  ['Langue', market.language],
                  ['Domaines dédiés', String(market.domains)],
                  ['Revenu (30j)', market.revenue],
                ].map(([k, v], i) => (
                  <InlineStack key={i} align="space-between">
                    <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">{v}</Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <DiscountIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Tarification</Text>
                </InlineStack>
                {[
                  { t: 'Ajustement de prix', s: 'Aucun ajustement — prix catalogue appliqué' },
                  { t: 'Taxes incluses', s: market.id === 'us' ? 'Non — taxes affichées séparément' : 'Oui — TVA incluse dans le prix' },
                ].map((item, i) => (
                  <div key={i}>
                    {i > 0 && <Divider />}
                    <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="050">
                          <Text as="p" fontWeight="semibold">{item.t}</Text>
                          <Text as="p" variant="bodySm" tone="subdued">{item.s}</Text>
                        </BlockStack>
                        <Button variant="plain" icon={ChevronRightIcon} />
                      </InlineStack>
                    </Box>
                  </div>
                ))}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <DeliveryIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Expédition</Text>
                </InlineStack>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{"Profil d'expédition"}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Profil général · {market.countries.length} destination{market.countries.length > 1 ? 's' : ''}
                    </Text>
                  </BlockStack>
                  <Button variant="plain" icon={ChevronRightIcon} />
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
