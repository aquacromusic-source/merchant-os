'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Page, Card, BlockStack, InlineStack, InlineGrid, Text, Badge, Button } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { apps, appsMarket } from '@/lib/data'

export default function AppsPage() {
  const router = useRouter()
  return (
    <Page
      title="Applications"
      primaryAction={{ content: 'Créer une application', icon: PlusIcon, onAction: () => router.push('/apps/create') }}
    >
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <InlineStack gap="200">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Applications installées</Text>
              <Badge>{String(apps.length)}</Badge>
            </InlineStack>
            <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="300">
              {(apps as any[]).map(app => (
                <Card key={app.id}>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="p" fontWeight="semibold">{app.name}</Text>
                      <Button size="slim">Ouvrir</Button>
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">{app.descr}</Text>
                  </BlockStack>
                </Card>
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingSm" fontWeight="semibold">Suggestions pour vous</Text>
            <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="300">
              {(appsMarket as any[]).map(app => (
                <Card key={app.id}>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="p" fontWeight="semibold">{app.name}</Text>
                      <Badge>{app.tag}</Badge>
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">{app.descr}</Text>
                    <Button size="slim">Installer</Button>
                  </BlockStack>
                </Card>
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
