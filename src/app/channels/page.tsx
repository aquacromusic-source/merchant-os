'use client'
import React, { useState, useEffect } from 'react'
import { Page, Card, BlockStack, InlineStack, Text, Badge, Button, Divider, Box, Spinner } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

export default function ChannelsPage() {
  const { activeSite } = useSite()
  const [channels, setChannels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/channels?site=${activeSite}`)
      .then(res => res.json())
      .then(data => {
        setChannels(Array.isArray(data) ? data : [])
      })
      .catch(() => setChannels([]))
      .finally(() => setLoading(false))
  }, [activeSite])

  const connected = channels.filter(c => c.status === 'Connectée')
  const others = channels.filter(c => c.status !== 'Connectée')

  if (loading) {
    return (
      <Page title="Canaux de vente">
        <Card>
          <Box padding="400" paddingBlockStart="1600" paddingBlockEnd="1600">
            <BlockStack align="center" inlineAlign="center">
              <Spinner size="large" />
            </BlockStack>
          </Box>
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title="Canaux de vente"
      subtitle="Gérez vos canaux de vente et marketplaces."
      primaryAction={{ content: 'Ajouter un canal', icon: PlusIcon }}
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
