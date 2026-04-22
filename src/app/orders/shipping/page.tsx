'use client'
import React from 'react'
import { Page, Card, EmptyState, Text } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'

export default function OrdersShippingPage() {
  return (
    <Page title="Étiquettes d'expédition" primaryAction={{ content: 'Créer des étiquettes', icon: PlusIcon }}>
      <Card><EmptyState heading="Aucune étiquette" image=""><Text as="p" variant="bodySm" tone="subdued">Vos étiquettes apparaîtront ici.</Text></EmptyState></Card>
    </Page>
  )
}
