'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
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
import { money } from '@/lib/utils'
import { useSite } from '@/contexts/SiteContext'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    live: 'success', draft: undefined, archived: 'warning',
  }
  const labelMap: Record<string, string> = { live: 'Actif', draft: 'Brouillon', archived: 'Archivé' }
  return <Badge tone={toneMap[status]}>{labelMap[status] || status}</Badge>
}

export default function ProductsPage() {
  const router = useRouter()
  const { activeSite } = useSite()
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [currentPage, setCurrentPage] = useState(0)
  const PAGE_SIZE = 100

  const fetchProducts = useCallback((page: number, append = false) => {
    setLoadingProducts(true)
    fetch(`/api/products?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}&site=${activeSite}`)
      .then(r => r.json())
      .then(data => {
        if (append) {
          setAllProducts(prev => [...prev, ...(data.products || [])])
        } else {
          setAllProducts(data.products || [])
        }
        setTotalProducts(data.total || 0)
        setCurrentPage(page)
      })
      .finally(() => setLoadingProducts(false))
  }, [activeSite])

  useEffect(() => {
    setAllProducts([])
    setCurrentPage(0)
    fetchProducts(0)
  }, [activeSite, fetchProducts])
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState('')

  const tabs = [
    { id: 'all', content: `Tous (${totalProducts})` },
    { id: 'live', content: `Actifs (${allProducts.filter((p: any) => p.status === 'live').length})` },
    { id: 'draft', content: `Brouillons (${allProducts.filter((p: any) => p.status === 'draft').length})` },
    { id: 'archived', content: `Archivés (${allProducts.filter((p: any) => p.status === 'archived').length})` },
  ]

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = useMemo(() => allProducts.filter((p: any) => {
    if (tabId !== 'all' && p.status !== tabId) return false
    if (searchValue && !p.title.toLowerCase().includes(searchValue.toLowerCase())) return false
    return true
  }), [tabId, searchValue, allProducts])

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

  const bulkUpdateStatus = async (status: string) => {
    const ids = selectedResources
    await Promise.all(ids.map(id =>
      fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: activeSite, status }),
      })
    ))
    fetchProducts(0)
  }

  const bulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedResources.length} produit(s) ? Cette action est irréversible.`)) return
    await Promise.all(selectedResources.map(id =>
      fetch(`/api/products/${id}?site=${activeSite}`, { method: 'DELETE' })
    ))
    fetchProducts(0)
  }

  const promotedBulkActions = [
    { content: 'Rendre actif', icon: ViewIcon, onAction: () => bulkUpdateStatus('live') },
    { content: 'Archiver', icon: ArchiveIcon, onAction: () => bulkUpdateStatus('draft') },
    { content: 'Supprimer', icon: DeleteIcon, onAction: () => bulkDelete() },
  ]

  const rowMarkup = list.map((p, index) => (
    <IndexTable.Row
      id={p.id}
      key={p.id}
      selected={selectedResources.includes(p.id)}
      position={index}
      onClick={() => router.push('/products/' + (p.slug || p.id))}
    >
      <IndexTable.Cell>
        <div style={{
          width: 40, height: 40, borderRadius: 6,
          background: 'var(--p-color-bg-surface-secondary)',
          border: '1px solid var(--p-color-border)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {p.image_url
            ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}><ImageIcon width={14} height={14} /></div>
          }
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
            onClick={() => router.push('/products/' + (p.slug || p.id))}
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
      primaryAction={{ content: 'Ajouter un produit', icon: PlusIcon, onAction: async () => {
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ site: activeSite, title: 'Nouveau produit', price: 0, status: 'draft' }),
          })
          const data = await res.json()
          if (data.success && data.product?.id) {
            router.push(`/products/${data.product.id}?site=${activeSite}`)
          } else {
            fetchProducts(0)
          }
        } catch { fetchProducts(0) }
      } }}
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
                <div style={{ maxWidth: 450, flex: 1 }}>
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
          {/* Compteur + bouton Charger plus */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text as="p" variant="bodySm" tone="subdued">
              {list.length} produit{list.length > 1 ? 's' : ''} affichés sur {totalProducts}
            </Text>
            {allProducts.length < totalProducts && (
              <Button
                loading={loadingProducts}
                onClick={() => fetchProducts(currentPage + 1, true)}
              >
                Charger {String(Math.min(PAGE_SIZE, totalProducts - allProducts.length))} de plus
              </Button>
            )}
          </div>
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
