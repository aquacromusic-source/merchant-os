'use client'
import React from 'react'
import {
  Page,
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
  EditIcon,
  ViewIcon,
} from '@shopify/polaris-icons'
import { themes } from '@/lib/data'

export default function StorefrontPage() {
  return (
    <Page title="Boutique en ligne">
      <BlockStack gap="400">
        {/* Current theme */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Thème actuel</Text>
              <InlineStack gap="200">
                <Badge tone="warning">Mise à jour dispo</Badge>
                <Button icon={ViewIcon} size="slim">Aperçu</Button>
                <Button variant="primary" size="slim">Personnaliser</Button>
              </InlineStack>
            </InlineStack>
            <BlockStack gap="200">
              <Text as="p" fontWeight="semibold">{themes.current.name}</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Version {themes.current.version} · Enregistré {themes.current.saved}
              </Text>
              <InlineStack gap="200">
                <Button icon={EditIcon} size="slim">Modifier le code</Button>
                <Button size="slim">Dupliquer</Button>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Drafts */}
        <Card padding="0">
          <Box padding="400" paddingBlockEnd="0">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Thèmes de développement</Text>
              <Button icon={PlusIcon} size="slim">Ajouter</Button>
            </InlineStack>
          </Box>
          {themes.drafts.map((t, i) => (
            <div key={i}>
              <Divider />
              <Box padding="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{t.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">v{t.version} · Enregistré {t.saved}</Text>
                  </BlockStack>
                  <InlineStack gap="200">
                    <Button size="slim">Aperçu</Button>
                    <Button variant="primary" size="slim">Publier</Button>
                  </InlineStack>
                </InlineStack>
              </Box>
            </div>
          ))}
        </Card>
      </BlockStack>
    </Page>
  )
}
