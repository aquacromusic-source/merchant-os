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
  Select,
  TextField,
  Banner,
  Box,
  Navigation,
} from '@shopify/polaris'
import {
  SettingsIcon,
  ShippingLabelIcon,
  CreditCardIcon,
  PersonFilledIcon,
  OrderIcon,
  ReceiptEuroIcon,
  LocationIcon,
  GlobeIcon,
  NotificationIcon,
  ImageIcon,
  FolderIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
} from '@shopify/polaris-icons'

const SETTINGS_NAV = [
  { key: 'general', label: 'Général' },
  { key: 'plan', label: 'Forfait' },
  { key: 'billing', label: 'Facturation' },
  { key: 'users', label: 'Utilisateurs et permissions' },
  { key: 'payments', label: 'Paiements' },
  { key: 'checkout', label: 'Finalisation de commande' },
  { key: 'accounts', label: 'Comptes clients' },
  { key: 'shipping', label: 'Expédition et livraison' },
  { key: 'taxes', label: 'Taxes et droits de douane' },
  { key: 'locations', label: 'Emplacements' },
  { key: 'domains', label: 'Domaines' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'brand', label: 'Marque' },
  { key: 'files', label: 'Fichiers' },
]

function SettingContent({ active }: { active: string }) {
  if (active === 'general') return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Informations sur la boutique</Text>
          <TextField label="Nom de la boutique" value="Studio Nord & Co" autoComplete="off" />
          <TextField label="E-mail du compte" type="email" value="hello@studionord.co" autoComplete="off" />
          <TextField label="Numéro de téléphone" value="+33 1 42 00 00 00" autoComplete="off" />
          <Select
            label="Devise"
            options={[
              { label: 'EUR — Euro', value: 'eur' },
              { label: 'USD — Dollar', value: 'usd' },
            ]}
            value="eur"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary">Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Adresse de la boutique</Text>
          <TextField label="Adresse" value="12 rue des Ateliers" autoComplete="off" />
          <InlineGrid columns={2} gap="300">
            <TextField label="Ville" value="Paris" autoComplete="off" />
            <TextField label="Code postal" value="75011" autoComplete="off" />
          </InlineGrid>
          <Select
            label="Pays"
            options={[{ label: 'France', value: 'fr' }]}
            value="fr"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary">Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'shipping') return (
    <Card>
      <BlockStack gap="300">
        <InlineStack gap="200" blockAlign="center">
          <ShippingLabelIcon width={16} height={16} />
          <Text as="h2" variant="headingSm" fontWeight="semibold">Expédition et livraison</Text>
        </InlineStack>
        {[
          { t: "Profil d'expédition général", s: "3 zones · 7 tarifs" },
          { t: "Expédition locale", s: "Non configurée" },
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
  )

  if (active === 'payments') return (
    <Card>
      <BlockStack gap="300">
        <InlineStack gap="200" blockAlign="center">
          <CreditCardIcon width={16} height={16} />
          <Text as="h2" variant="headingSm" fontWeight="semibold">Fournisseur de paiement</Text>
        </InlineStack>
        <InlineStack align="space-between" blockAlign="center">
          <BlockStack gap="050">
            <Text as="p" fontWeight="semibold">Merchant OS Payments</Text>
            <Text as="p" variant="bodySm" tone="subdued">Actif · Visa, Mastercard, Apple Pay, Google Pay</Text>
          </BlockStack>
          <Badge tone="success">Actif</Badge>
        </InlineStack>
      </BlockStack>
    </Card>
  )

  if (active === 'taxes') return (
    <Card>
      <BlockStack gap="300">
        <InlineStack gap="200" blockAlign="center">
          <ReceiptEuroIcon width={16} height={16} />
          <Text as="h2" variant="headingSm" fontWeight="semibold">Taxes et droits de douane</Text>
        </InlineStack>
        <Banner tone="warning">
          <Text as="p" fontWeight="semibold">Configuration TVA UE requise</Text>
          <Text as="p" variant="bodySm">Configurez votre numéro OSS/IOSS pour les ventes en Europe.</Text>
        </Banner>
        {[
          ['France', '20% TVA standard'],
          ['Allemagne', '19% TVA standard'],
          ['Espagne', '21% IVA'],
          ['Pays-Bas', '21% BTW'],
        ].map(([country, rate], i) => (
          <div key={i}>
            {i > 0 && <Divider />}
            <Box paddingBlockStart={i > 0 ? '300' : '0'}>
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text as="p" fontWeight="semibold">{country}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{rate}</Text>
                </BlockStack>
                <Button variant="plain" icon={ChevronRightIcon} />
              </InlineStack>
            </Box>
          </div>
        ))}
      </BlockStack>
    </Card>
  )

  return (
    <Card>
      <BlockStack gap="300" inlineAlign="center">
        <SettingsIcon width={40} height={40} />
        <Text as="h3" variant="headingMd">Section en cours de configuration</Text>
        <Text as="p" variant="bodySm" tone="subdued">Cette section sera bientôt disponible.</Text>
      </BlockStack>
    </Card>
  )
}

export default function SettingsPage() {
  const [active, setActive] = useState('general')

  return (
    <Page
      title="Paramètres"
      subtitle="Gérez votre boutique, votre compte et vos préférences."
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Card padding="0">
            <Box padding="400" paddingBlockEnd="300">
              <InlineStack gap="300" blockAlign="center">
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, oklch(0.75 0.12 50), oklch(0.65 0.14 30))',
                  display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700
                }}>S</div>
                <BlockStack gap="050">
                  <Text as="p" fontWeight="semibold">Studio Nord &amp; Co</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    <span style={{ fontFamily: 'monospace' }}>studionord.co</span>
                  </Text>
                </BlockStack>
              </InlineStack>
            </Box>
            <Divider />
            <BlockStack gap="050">
              {SETTINGS_NAV.map(item => (
                <Box key={item.key} padding="100" paddingInline="300">
                  <Button
                    variant={active === item.key ? 'secondary' : 'plain'}
                    fullWidth
                    textAlign="left"
                    onClick={() => setActive(item.key)}
                  >
                    {item.label}
                  </Button>
                </Box>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <SettingContent active={active} />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
