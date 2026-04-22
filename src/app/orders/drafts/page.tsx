'use client'
import React from 'react'
import { Page, Card, EmptyState, Text } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'

export default function OrdersDraftsPage() {
  return (
    <Page title="Brouillons de commandes" primaryAction={{ content: 'Créer une commande', icon: PlusIcon, variant: 'primary' }}>
      <Card><EmptyState heading="Aucun brouillon" image=""><Text as="p" variant="bodySm" tone="subdued">Les brouillons apparaîtront ici.</Text></EmptyState></Card>
    </Page>
  )
}
