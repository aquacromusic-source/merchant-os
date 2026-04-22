'use client'
import React from 'react'
import { Page, Card, BlockStack, InlineStack, Text, Button, Divider, Box } from '@shopify/polaris'
import { PlusIcon, EditIcon } from '@shopify/polaris-icons'

const menus = [
  { name: 'Menu principal', handle: 'main-menu', items: [
    { label: 'Accueil', url: '/' }, { label: 'Boutique', url: '/collections/all' },
    { label: 'Nouveautés', url: '/collections/nouveautes' }, { label: 'À propos', url: '/pages/about' },
  ]},
  { name: 'Menu pied de page', handle: 'footer-menu', items: [
    { label: 'Service client', url: '/pages/support' }, { label: 'Livraison & retours', url: '/pages/shipping' },
    { label: 'Confidentialité', url: '/policies/privacy-policy' },
  ]},
]

export default function StorefrontNavigationPage() {
  return (
    <Page title="Navigation" primaryAction={{ content: 'Créer un menu', icon: PlusIcon }}>
      <BlockStack gap="400">
        {menus.map((menu, i) => (
          <Card key={i}>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">{menu.name}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    <span style={{ fontFamily: 'monospace' }}>{menu.handle}</span>
                  </Text>
                </BlockStack>
                <Button icon={EditIcon} size="slim">Modifier</Button>
              </InlineStack>
              {menu.items.map((item, j) => (
                <div key={j}>
                  {j > 0 && <Divider />}
                  <Box paddingBlockStart={j > 0 ? '200' : '0'}>
                    <InlineStack align="space-between">
                      <Text as="p" variant="bodySm">{item.label}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <span style={{ fontFamily: 'monospace' }}>{item.url}</span>
                      </Text>
                    </InlineStack>
                  </Box>
                </div>
              ))}
            </BlockStack>
          </Card>
        ))}
      </BlockStack>
    </Page>
  )
}
