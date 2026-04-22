'use client'
import React from 'react'
import { Page, Card, BlockStack, InlineStack, Text, Badge, Button, Divider, Box } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { channels } from '@/lib/data'

export default function ChannelsPage() {
  const connected = (channels as any[]).filter(c => c.status === 'Connectée')
  const others = (channels as any[]).filter(c => c.status !== 'Connectée')
  return (
    <Page
      title="Canaux de vente"
      subtitle="Gérez vos canaux de vente et marketplaces."
      primaryAction={{ content: 'Ajouter un canal', icon: PlusIcon, variant: 'primary' }}
    >
      <BlockStack gap="400">
        <Card padding="0">
          <Box padding="400" paddingBlockEnd="0">
            <InlineStack gap="200">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Canaux connectés</Text>
              <Badge>{String(connected.length)}</Badge>
            </InlineStack>
          </Box>
          {connected.map((ch: any, i: number) => (
            <div key={i}>
              <Divider />
              <Box padding="400">
                <InlineStack align="space-between">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{ch.name}</Text>
                    <Badge tone="success">{ch.status}</Badge>
                  </BlockStack>
                  <Button size="slim">Gérer</Button>
                </InlineStack>
              </Box>
            </div>
          ))}
        </Card>
        {others.length > 0 && (
          <Card padding="0">
            <Box padding="400" paddingBlockEnd="0">
              <Text as="h2" variant="headingSm" fontWeight="semibold">À connecter</Text>
            </Box>
            {others.map((ch: any, i: number) => (
              <div key={i}>
                <Divider />
                <Box padding="400">
                  <InlineStack align="space-between">
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">{ch.name}</Text>
                      <Badge>{ch.status}</Badge>
                    </BlockStack>
                    <Button variant="primary" size="slim">Connecter</Button>
                  </InlineStack>
                </Box>
              </div>
            ))}
          </Card>
        )}
      </BlockStack>
    </Page>
  )
}
