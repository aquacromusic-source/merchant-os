'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  InlineGrid,
  Text,
  Badge,
  Button,
  IndexTable,
  useIndexResourceState,
  Tabs,
  TextField,
  Box,
} from '@shopify/polaris'
import {
  ExportIcon,
  ImportIcon,
  PlusIcon,
  SearchIcon,
  ViewIcon,
  ArchiveIcon,
  ImageIcon,
} from '@shopify/polaris-icons'
import { products } from '@/lib/data'
import { money } from '@/lib/utils'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    live: 'success', draft: undefined, archived: 'warning',
  }
  const labelMap: Record<string, string> = { live: 'Actif', draft: 'Brouillon', archived: 'Archivé' }
  return <Badge tone={toneMap[status]}>{labelMap[status] || status}</Badge>
}

export default function ProductsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const tabs = [
    { id: 'all', content: `Tous (${products.length})` },
    { id: 'live', content: `Actifs (${products.filter(p => p.status === 'live').length})` },
    { id: 'draft', content: `Brouillons (${products.filter(p => p.status === 'draft').length})` },
    { id: 'archived', content: `Archivés (${products.filter(p => p.status === 'archived').length})` },
  ]

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = useMemo(() => products.filter(p => {
    if (tabId !== 'all' && p.status !== tabId) return false
    if (searchValue && !p.title.toLowerCase().includes(searchValue.toLowerCase())) return false
    return true
  }), [tabId, searchValue])

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    list.map(p => ({ id: p.id }))
  )

  const promotedBulkActions = [
    { content: 'Rendre actif', icon: ViewIcon, onAction: () => {} },
    { content: 'Archiver', icon: ArchiveIcon, onAction: () => {} },
  ]

  const rowMarkup = list.map((p, index) => (
    <IndexTable.Row
      id={p.id}
      key={p.id}
      selected={selectedResources.includes(p.id)}
      position={index}
      onClick={() => router.push('/products/' + p.id)}
    >
      <IndexTable.Cell>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: 'var(--p-color-bg-surface-secondary)',
          border: '1px solid var(--p-color-border)',
          display: 'grid', placeItems: 'center'
        }}>
          <ImageIcon width={14} height={14} />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {p.title}
      </IndexTable.Cell>
      <IndexTable.Cell>{statusBadge(p.status)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone={p.stock < 10 && p.stock > 0 ? 'critical' : 'subdued'} variant="bodySm">
          {p.stock === 0 ? 'Stock non suivi' : `${p.stock} en stock`}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {p.category}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {p.channels}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {p.vendor}
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  return (
    <Page
      title="Produits"
      primaryAction={{ content: 'Ajouter un produit', icon: PlusIcon, onAction: () => router.push('/products/P-1002') }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon },
        { content: 'Importer', icon: ImportIcon },
      ]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={5} gap="300">
          {[
            { l: 'Période', v: '30 jours' },
            { l: 'Taux de vente moyen', v: '0,1 %' },
            { l: 'Analyse ABC · A', v: '105 363 €' },
            { l: 'Analyse ABC · B', v: '15 059 €' },
            { l: 'Analyse ABC · C', v: '4 525 939 €' },
          ].map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="300" paddingBlockEnd="0">
              <TextField
                label=""
                labelHidden
                value={searchValue}
                onChange={setSearchValue}
                prefix={<SearchIcon />}
                placeholder="Rechercher un produit…"
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
            </Box>
            <IndexTable
              resourceName={{ singular: 'produit', plural: 'produits' }}
              itemCount={list.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: '' },
                { title: 'Produit' },
                { title: 'Statut' },
                { title: 'Stock' },
                { title: 'Catégorie' },
                { title: 'Canaux', alignment: 'end' },
                { title: 'Fournisseur' },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </Tabs>
        </Card>
      </BlockStack>
    </Page>
  )
}
