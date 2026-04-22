'use client'
import React from 'react'
import { Page, Card, EmptyState, Text } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'

export default function InventoryPOPage() {
  return (
    <Page title="Bons de commande" primaryAction={{ content: 'Créer un bon de commande', icon: PlusIcon, variant: 'primary' }}>
      <Card><EmptyState heading="Aucun bon de commande" image=""><Text as="p" variant="bodySm" tone="subdued">Les bons de commande apparaîtront ici.</Text></EmptyState></Card>
    </Page>
  )
}
