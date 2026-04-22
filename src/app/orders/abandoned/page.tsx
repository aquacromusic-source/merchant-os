'use client'
import React from 'react'
import { Page, Card, EmptyState, Text } from '@shopify/polaris'

export default function OrdersAbandonedPage() {
  return (
    <Page title="Paniers abandonnés">
      <Card><EmptyState heading="Aucun panier abandonné" image=""><Text as="p" variant="bodySm" tone="subdued">Les paniers abandonnés apparaîtront ici.</Text></EmptyState></Card>
    </Page>
  )
}
