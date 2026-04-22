'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Card,
  BlockStack,
  Text,
  Badge,
  IndexTable,
  useIndexResourceState,
  Tabs,
  TextField,
  Box,
} from '@shopify/polaris'
import { ExportIcon, PlusIcon, SearchIcon } from '@shopify/polaris-icons'
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
  const [searchValue, setSearchValue] = useState('')

  const tabs = [
    { id: 'all', content: `Toutes (${discounts.length})` },
    { id: 'active', content: `Actives (${discounts.filter(d => d.status === 'Actif').length})` },
    { id: 'scheduled', content: `Programmées (${discounts.filter(d => d.status === 'Programmée').length})` },
    { id: 'expired', content: `Expirées (${discounts.filter(d => d.status === 'Expirée').length})` },
  ]

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = useMemo(() => discounts.filter(d => {
    if (tabId === 'active' && d.status !== 'Actif') return false
    if (tabId === 'scheduled' && d.status !== 'Programmée') return false
    if (tabId === 'expired' && d.status !== 'Expirée') return false
    if (searchValue && !(
      d.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.descr.toLowerCase().includes(searchValue.toLowerCase())
    )) return false
    return true
  }), [searchValue, tabId])

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    list.map(d => ({ id: d.code }))
  )

  const rowMarkup = list.map((d, index) => (
    <IndexTable.Row
      id={d.code}
      key={d.code}
      selected={selectedResources.includes(d.code)}
      position={index}
      onClick={() => router.push('/discounts/' + d.code)}
    >
      <IndexTable.Cell>
        <BlockStack gap="050">
          <Text as="span" fontWeight="semibold">
            <span style={{ fontFamily: 'monospace' }}>{d.code}</span>
          </Text>
          <Text as="span" variant="bodySm" tone="subdued">{d.descr}</Text>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>{statusBadge(d.status)}</IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued">{d.type}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued">{d.kind}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" numeric>{String(d.uses)}</Text></IndexTable.Cell>
    </IndexTable.Row>
  ))

  return (
    <Page
      title="Réductions"
      primaryAction={{ content: 'Créer une réduction', icon: PlusIcon }}
      secondaryActions={[{ content: 'Exporter', icon: ExportIcon }]}
    >
      <Card padding="0">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
          <Box padding="300" paddingBlockEnd="0">
            <TextField
              label=""
              labelHidden
              value={searchValue}
              onChange={setSearchValue}
              prefix={<SearchIcon />}
              placeholder="Rechercher une réduction…"
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setSearchValue('')}
            />
          </Box>
          <IndexTable
            resourceName={{ singular: 'réduction', plural: 'réductions' }}
            itemCount={list.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Titre' },
              { title: 'Statut' },
              { title: 'Méthode' },
              { title: 'Type' },
              { title: 'Utilisé', alignment: 'end' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
