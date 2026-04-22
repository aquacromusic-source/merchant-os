'use client'
import React from 'react'
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
  Select,
  TextField,
  Checkbox,
} from '@shopify/polaris'
import {
  ChevronDownIcon,
  CheckIcon,
} from '@shopify/polaris-icons'
import { discounts } from '@/lib/data'
import { money } from '@/lib/utils'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    'Actif': 'success', 'Programmée': 'warning', 'Expirée': undefined,
  }
  return <Badge tone={toneMap[status]}>{status}</Badge>
}

export default function DiscountDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const d = discounts.find(x => x.code === params.id) || discounts[0]

  return (
    <Page
      backAction={{ content: 'Réductions', onAction: () => router.push('/discounts') }}
      title={d.code}
      titleMetadata={statusBadge(d.status)}
      primaryAction={{ content: 'Enregistrer' }}
      secondaryActions={[
        { content: 'Dupliquer' },
        { content: 'Désactiver' },
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* Méthode */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Méthode</Text>
                <InlineStack gap="300">
                  <div style={{
                    flex: 1, padding: '12px 14px',
                    background: 'var(--p-color-bg-surface-selected)',
                    border: '2px solid var(--p-color-border-interactive)',
                    borderRadius: 8,
                  }}>
                    <InlineStack align="space-between" blockAlign="start">
                      <BlockStack gap="050">
                        <Text as="p" fontWeight="semibold">Code de réduction</Text>
                        <Text as="p" variant="bodySm" tone="subdued">Les clients saisissent au checkout.</Text>
                      </BlockStack>
                      <CheckIcon width={16} height={16} />
                    </InlineStack>
                  </div>
                  <div style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--p-color-border)', borderRadius: 8 }}>
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">Automatique</Text>
                      <Text as="p" variant="bodySm" tone="subdued">Appliquée selon des règles.</Text>
                    </BlockStack>
                  </div>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Code */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Code</Text>
                <InlineStack gap="200">
                  <div style={{ flex: 1 }}>
                    <TextField label="" labelHidden value={d.code} autoComplete="off" />
                  </div>
                  <Button>Générer</Button>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Type et valeur */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Type et valeur</Text>
                <InlineStack gap="300">
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Type"
                      options={[
                        { label: '% commande', value: 'pct' },
                        { label: 'Montant fixe', value: 'fixed' },
                        { label: 'Expédition gratuite', value: 'ship' },
                        { label: 'Achat de X = Y', value: 'bxgy' },
                      ]}
                      value="pct"
                      onChange={() => {}}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField label="Valeur" value="15" autoComplete="off" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="S'applique à"
                      options={[
                        { label: 'Tous les produits', value: 'all' },
                        { label: 'Collections spécifiques', value: 'coll' },
                        { label: 'Produits spécifiques', value: 'prod' },
                      ]}
                      value="all"
                      onChange={() => {}}
                    />
                  </div>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Exigences minimales */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Exigences minimales</Text>
                {["Aucune condition", "Montant minimal d'achat · 40 €", "Quantité minimale de 2 articles"].map((l, i) => (
                  <Checkbox key={i} label={l} checked={i === 1} onChange={() => {}} />
                ))}
              </BlockStack>
            </Card>

            {/* Éligibilité */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Éligibilité client</Text>
                {['Tous les clients', 'Segments spécifiques · VIP, Gros panier', 'Clients spécifiques'].map((l, i) => (
                  <Checkbox key={i} label={l} checked={i === 0} onChange={() => {}} />
                ))}
              </BlockStack>
            </Card>

            {/* Limites */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">{"Limites d'utilisation"}</Text>
                {["Limiter à un certain nombre total d'utilisations", "Limiter à une utilisation par client"].map((l, i) => (
                  <Checkbox key={i} label={l} checked={i === 1} onChange={() => {}} />
                ))}
              </BlockStack>
            </Card>

            {/* Combinaisons */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Combinaisons</Text>
                {['Réductions produit', 'Réductions commande', "Réductions d'expédition"].map((l, i) => (
                  <Checkbox key={i} label={l} checked={i !== 1} onChange={() => {}} />
                ))}
              </BlockStack>
            </Card>

            {/* Dates */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Dates actives</Text>
                <InlineStack gap="300">
                  <div style={{ flex: 1 }}>
                    <TextField label="Date de début" value="22 avr 2026" autoComplete="off" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField label="Date de fin" value="31 mai 2026" autoComplete="off" />
                  </div>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            {/* Résumé */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Résumé</Text>
                <Text as="p" fontWeight="semibold">
                  <span style={{ fontFamily: 'monospace' }}>{d.code}</span>
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">{d.descr}</Text>
                <Divider />
                <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">PERFORMANCE</Text>
                {[
                  ['Utilisations', String(d.uses)],
                  ['Revenu généré', money(d.uses * 42)],
                  ['Remise totale', money(d.uses * 6.5)],
                ].map(([k, v], i) => (
                  <InlineStack key={i} align="space-between">
                    <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      <span style={{ fontFamily: 'monospace' }}>{v}</span>
                    </Text>
                  </InlineStack>
                ))}
              </BlockStack>
            </Card>

            {/* Canaux */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Canaux de vente</Text>
                {['Boutique en ligne', 'Point de vente', 'Checkout API'].map((ch, i) => (
                  <InlineStack key={i} align="space-between">
                    <Text as="p" variant="bodySm">{ch}</Text>
                    <Badge tone={i !== 2 ? 'success' : undefined}>
                      {i !== 2 ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </InlineStack>
                ))}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
