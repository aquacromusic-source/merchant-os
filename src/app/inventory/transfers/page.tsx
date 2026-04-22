'use client'
import React from 'react'
import { Page, Card, EmptyState, Text } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'

export default function InventoryTransfersPage() {
  return (
    <Page title="Transferts de stock" primaryAction={{ content: 'Créer un transfert', icon: PlusIcon }}>
      <Card><EmptyState heading="Aucun transfert" image=""><Text as="p" variant="bodySm" tone="subdued">Les transferts apparaîtront ici.</Text></EmptyState></Card>
    </Page>
  )
}
