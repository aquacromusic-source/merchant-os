'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Page, Card, BlockStack, Text, Badge, Button, IndexTable, useIndexResourceState, Tabs } from '@shopify/polaris'
import { ExportIcon, PlusIcon } from '@shopify/polaris-icons'
import { discounts } from '@/lib/data'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    'Actif': 'success', 'Programmée': 'warning', 'Expirée': undefined,
  }
  return <Badge tone={toneMap[status]}>{status}</Badge>
}

export default function DiscountsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const tabs = [
    { id: 'all', content: `Toutes (${discounts.length})` },
    { id: 'active', content: `Actives (${discounts.filter(d => d.status === 'Actif').length})` },
    { id: 'scheduled', content: `Programmées (${discounts.filter(d => d.status === 'Programmée').length})` },
    { id: 'expired', content: `Expirées (${discounts.filter(d => d.status === 'Expirée').length})` },
  ]
  const tabId = tabs[selectedTab]?.id || 'all'
  const list = discounts.filter(d =>
    tabId === 'all' || (tabId === 'active' && d.status === 'Actif') ||
    (tabId === 'scheduled' && d.status === 'Programmée') || (tabId === 'expired' && d.status === 'Expirée')
  )
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map(d => ({ id: d.code })))

  const rowMarkup = list.map((d, index) => (
    <IndexTable.Row id={d.code} key={d.code} selected={selectedResources.includes(d.code)} position={index} onClick={() => router.push('/discounts/' + d.code)}>
      <IndexTable.Cell><BlockStack gap="050"><Text as="span" fontWeight="semibold"><span style={{ fontFamily: 'monospace' }}>{d.code}</span></Text><Text as="span" variant="bodySm" tone="subdued">{d.descr}</Text></BlockStack></IndexTable.Cell>
      <IndexTable.Cell>{statusBadge(d.status)}</IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued">{d.type}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued">{d.kind}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" numeric>{d.uses}</Text></IndexTable.Cell>
    </IndexTable.Row>
  ))

  return (
    <Page title="Réductions" primaryAction={{ content: 'Créer une réduction', icon: PlusIcon }} secondaryActions={[{ content: 'Exporter', icon: ExportIcon }]}>
      <Card padding="0">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
          <IndexTable resourceName={{ singular: 'réduction', plural: 'réductions' }} itemCount={list.length} selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length} onSelectionChange={handleSelectionChange} headings={[{ title: 'Titre' }, { title: 'Statut' }, { title: 'Méthode' }, { title: 'Type' }, { title: 'Utilisé', alignment: 'end' }]}>
            {rowMarkup}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
