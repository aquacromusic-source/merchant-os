'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Card,
  Text,
  Badge,
  IndexTable,
  useIndexResourceState,
  Tabs,
  TextField,
  Box,
} from '@shopify/polaris'
import { PlusIcon, SearchIcon } from '@shopify/polaris-icons'
import { collections } from '@/lib/data'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    live: 'success', draft: undefined, archived: 'warning',
  }
  const labelMap: Record<string, string> = { live: 'Active', draft: 'Brouillon', archived: 'Archivée' }
  return <Badge tone={toneMap[status]}>{labelMap[status] || status}</Badge>
}

export default function CollectionsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const tabs = [
    { id: 'all', content: `Toutes (${collections.length})` },
    { id: 'live', content: `Actives (${collections.filter(c => c.status === 'live').length})` },
    { id: 'draft', content: `Brouillons (${collections.filter(c => c.status === 'draft').length})` },
    { id: 'archived', content: `Archivées (${collections.filter(c => c.status === 'archived').length})` },
  ]

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = useMemo(() => collections.filter(c => {
    if (tabId !== 'all' && c.status !== tabId) return false
    if (searchValue && !c.title.toLowerCase().includes(searchValue.toLowerCase())) return false
    return true
  }), [searchValue, tabId])

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    list.map(c => ({ id: c.id }))
  )

  return (
    <Page
      title="Collections"
      primaryAction={{ content: 'Créer une collection', icon: PlusIcon }}
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
              placeholder="Rechercher une collection…"
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setSearchValue('')}
            />
          </Box>
          <IndexTable
            resourceName={{ singular: 'collection', plural: 'collections' }}
            itemCount={list.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Collection' },
              { title: 'Produits', alignment: 'end' },
              { title: 'Type' },
              { title: 'Statut' },
              { title: 'Mise à jour' },
            ]}
          >
            {list.map((c, index) => (
              <IndexTable.Row
                id={c.id}
                key={c.id}
                selected={selectedResources.includes(c.id)}
                position={index}
                onClick={() => router.push('/collections/' + c.id)}
              >
                <IndexTable.Cell>
                  <Text as="span" fontWeight="semibold" variant="bodySm">{c.title}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{String(c.products)}</IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{c.type}</Text></IndexTable.Cell>
                <IndexTable.Cell>{statusBadge(c.status)}</IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{c.updated}</Text></IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
