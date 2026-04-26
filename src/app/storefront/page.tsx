'use client'
import React, { useState, useEffect } from 'react'
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
import { useSite } from '@/contexts/SiteContext'

interface ThemeData {
  name: string
  version: string
  saved: string
}

interface StorefrontData {
  current: ThemeData | null
  drafts: ThemeData[]
}

export default function StorefrontPage() {
  const { activeSite } = useSite()
  const [data, setData] = useState<StorefrontData>({ current: null, drafts: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/storefront?site=${activeSite}`)
      .then(r => r.json())
      .then(result => {
        setData({
          current: result.current || null,
          drafts: Array.isArray(result.drafts) ? result.drafts : [],
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeSite])

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
            {data.current ? (
              <BlockStack gap="200">
                <Text as="p" fontWeight="semibold">{data.current.name}</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Version {data.current.version} · Enregistré {data.current.saved}
                </Text>
                <InlineStack gap="200">
                  <Button icon={EditIcon} size="slim">Modifier le code</Button>
                  <Button size="slim">Dupliquer</Button>
                </InlineStack>
              </BlockStack>
            ) : (
              <Text as="p" variant="bodySm" tone="subdued">Aucun thème actif.</Text>
            )}
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
          {data.drafts.length > 0 ? (
            data.drafts.map((t, i) => (
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
            ))
          ) : (
            <Box padding="400">
              <Text as="p" variant="bodySm" tone="subdued">Aucun thème de développement.</Text>
            </Box>
          )}
        </Card>
      </BlockStack>
    </Page>
  )
}
