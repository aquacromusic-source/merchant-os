'use client'

import { Page, Card, BlockStack, Text, Button } from '@shopify/polaris'

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Page title="Commandes">
      <Card>
        <BlockStack gap="300">
          <Text as="p" tone="critical" fontWeight="bold">
            Erreur lors du chargement des commandes
          </Text>
          <Text as="p" tone="subdued">
            {error.message || 'Une erreur inattendue est survenue.'}
          </Text>
          <Button onClick={reset}>Réessayer</Button>
        </BlockStack>
      </Card>
    </Page>
  )
}
