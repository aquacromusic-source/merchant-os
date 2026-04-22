'use client'
import React, { useState, useMemo, useCallback } from 'react'
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
  ButtonGroup,
  IndexTable,
  useIndexResourceState,
  Tabs,
  TextField,
  Box,
  Modal,
  ActionList,
  Popover,
  Thumbnail,
} from '@shopify/polaris'
import {
  ExportIcon,
  ImportIcon,
  PlusIcon,
  SearchIcon,
  ViewIcon,
  ArchiveIcon,
  ImageIcon,
  DeleteIcon,
  LayoutPopupIcon,
  ListBulletedIcon,
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState('')

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

  const handleExportCSV = useCallback(() => {
    const header = 'ID,Titre,Statut,Stock,Catégorie,Fournisseur,SKU,Prix'
    const rows = list.map(p =>
      `${p.id},${p.title},${p.status},${p.stock},${p.category},${p.vendor},${p.sku},${p.price}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'produits.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [list])

  const promotedBulkActions = [
    { content: 'Rendre actif', icon: ViewIcon, onAction: () => {} },
    { content: 'Archiver', icon: ArchiveIcon, onAction: () => {} },
    { content: 'Supprimer', icon: DeleteIcon, onAction: () => {} },
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
        <Text as="span" fontWeight="semibold" variant="bodySm">{p.title}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{statusBadge(p.status)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone={p.stock < 10 && p.stock > 0 ? 'critical' : 'subdued'} variant="bodySm">
          {p.stock === 0 ? 'Stock non suivi' : `${p.stock} en stock`}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{p.category}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{String(p.channels)}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{p.vendor}</Text></IndexTable.Cell>
    </IndexTable.Row>
  ))

  const gridMarkup = (
    <Box padding="400">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {list.map(p => (
          <div
            key={p.id}
            style={{
              border: '1px solid var(--p-color-border)',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'var(--p-color-bg-surface)',
            }}
            onClick={() => router.push('/products/' + p.id)}
          >
            <div style={{
              height: 140,
              background: 'var(--p-color-bg-surface-secondary)',
              display: 'grid',
              placeItems: 'center',
            }}>
              <ImageIcon width={32} height={32} />
            </div>
            <div style={{ padding: '12px' }}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" fontWeight="semibold" truncate>{p.title}</Text>
                {statusBadge(p.status)}
                <Text as="p" variant="bodySm" tone="subdued">
                  {p.stock === 0 ? 'Non suivi' : `${p.stock} en stock`}
                </Text>
                <Text as="p" variant="bodySm" fontWeight="semibold">{money(p.price)}</Text>
              </BlockStack>
            </div>
          </div>
        ))}
      </div>
    </Box>
  )

  return (
    <Page
      title="Produits"
      primaryAction={{ content: 'Ajouter un produit', icon: PlusIcon, onAction: () => router.push('/products/P-1002') }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon, onAction: handleExportCSV },
        { content: 'Importer', icon: ImportIcon, onAction: () => setImportModalOpen(true) },
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
              <InlineStack gap="200" align="space-between">
                <div style={{ flex: 1 }}>
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
                </div>
                <ButtonGroup variant="segmented">
                  <Button
                    icon={ListBulletedIcon}
                    pressed={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                    accessibilityLabel="Vue liste"
                  />
                  <Button
                    icon={LayoutPopupIcon}
                    pressed={viewMode === 'grid'}
                    onClick={() => setViewMode('grid')}
                    accessibilityLabel="Vue grille"
                  />
                </ButtonGroup>
              </InlineStack>
            </Box>

            {viewMode === 'list' ? (
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
            ) : gridMarkup}
          </Tabs>
        </Card>
      </BlockStack>

      {/* Import Modal */}
      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Importer des produits"
        primaryAction={{
          content: 'Importer',
          onAction: () => {
            setImportModalOpen(false)
            alert('Import simulé — 0 erreurs, 0 produits importés (mock).')
          },
        }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setImportModalOpen(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p" variant="bodySm">
              Importez vos produits depuis un fichier CSV. Téléchargez d&apos;abord le modèle en exportant vos produits existants.
            </Text>
            <div style={{
              border: '2px dashed var(--p-color-border)',
              borderRadius: 8,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
            }}>
              <BlockStack gap="200" inlineAlign="center">
                <ImportIcon width={24} height={24} />
                <Text as="p" variant="bodySm" tone="subdued">
                  Glissez votre fichier CSV ici, ou cliquez pour parcourir
                </Text>
              </BlockStack>
            </div>
            <Text as="p" variant="bodySm" tone="subdued">
              Format accepté : CSV (séparateur virgule, encodage UTF-8)
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
