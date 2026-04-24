'use client'
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
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
  Banner,
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

  // Real stats from Supabase
  const [stats, setStats] = useState<any>(null)

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
    // Fetch real stats
    fetch(`/api/stats?site=${activeSite}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [activeSite, fetchProducts])
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Import modal
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: 'all', content: `Tous (${stats ? stats.totalProducts : totalProducts})` },
    { id: 'live', content: `Actifs (${stats ? stats.activeCount : allProducts.filter((p: any) => p.status === 'live').length})` },
    { id: 'draft', content: `Brouillons (${stats ? stats.draftCount : allProducts.filter((p: any) => p.status === 'draft').length})` },
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
        <Text as="span" tone={p.stock != null && p.stock < 10 && p.stock > 0 ? 'critical' : 'subdued'} variant="bodySm">
          {p.stock == null ? 'Stock non suivi' : `${p.stock} en stock`}
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
                  {p.stock == null ? 'Non suivi' : `${p.stock} en stock`}
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
        {stats && (
          <InlineGrid columns={stats.totalStock !== null ? 4 : 3} gap="300">
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Total produits</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">{stats.totalProducts}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Produits actifs</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">{stats.activeCount}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">Valeur catalogue</Text>
                <Text as="p" variant="headingMd" fontWeight="bold">{money(stats.totalValue)}</Text>
              </BlockStack>
            </Card>
            {stats.totalStock !== null && (
              <Card>
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued">Stock total</Text>
                  <Text as="p" variant="headingMd" fontWeight="bold">{stats.totalStock}</Text>
                </BlockStack>
              </Card>
            )}
          </InlineGrid>
        )}

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
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          setImportFile(file.name)
          setImportLoading(true)
          setImportResult(null)
          try {
            const text = await file.text()
            const lines = text.split('\n').filter(l => l.trim())
            if (lines.length < 2) { setImportResult('Fichier vide ou invalide.'); setImportLoading(false); return }
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            const titleIdx = headers.findIndex(h => ['titre', 'title', 'name', 'nom'].includes(h))
            const priceIdx = headers.findIndex(h => ['prix', 'price'].includes(h))
            const statusIdx = headers.findIndex(h => ['statut', 'status'].includes(h))
            const stockIdx = headers.findIndex(h => ['stock'].includes(h))
            if (titleIdx === -1) { setImportResult('Colonne "Titre" introuvable dans le CSV.'); setImportLoading(false); return }

            let created = 0, errors = 0
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.trim())
              const title = cols[titleIdx]
              if (!title) continue
              const body: any = { site: activeSite, title }
              if (priceIdx !== -1 && cols[priceIdx]) body.price = parseFloat(cols[priceIdx]) || 0
              if (statusIdx !== -1 && cols[statusIdx]) body.status = cols[statusIdx] === 'draft' ? 'draft' : 'live'
              if (stockIdx !== -1 && cols[stockIdx]) body.stock = parseInt(cols[stockIdx]) || 0
              try {
                const res = await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
                if (res.ok) created++; else errors++
              } catch { errors++ }
            }
            setImportResult(`${created} produit(s) importé(s)${errors > 0 ? `, ${errors} erreur(s)` : ''}.`)
            fetchProducts(0)
          } catch (err) {
            setImportResult('Erreur de lecture du fichier.')
          } finally {
            setImportLoading(false)
          }
        }}
      />
      <Modal
        open={importModalOpen}
        onClose={() => { setImportModalOpen(false); setImportResult(null); setImportFile('') }}
        title="Importer des produits"
        primaryAction={{
          content: importLoading ? 'Import en cours…' : 'Choisir un fichier CSV',
          loading: importLoading,
          onAction: () => fileInputRef.current?.click(),
        }}
        secondaryActions={[{ content: 'Fermer', onAction: () => { setImportModalOpen(false); setImportResult(null) } }]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            {importResult && (
              <Banner tone={importResult.includes('erreur') ? 'warning' : 'success'} onDismiss={() => setImportResult(null)}>
                {importResult}
              </Banner>
            )}
            <Text as="p" variant="bodySm">
              Importez vos produits depuis un fichier CSV. Le fichier doit contenir au minimum une colonne «Titre».
              Colonnes reconnues : Titre, Prix, Statut, Stock.
            </Text>
            <div
              style={{
                border: '2px dashed var(--p-color-border)',
                borderRadius: 8,
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <BlockStack gap="200" inlineAlign="center">
                <ImportIcon width={24} height={24} />
                <Text as="p" variant="bodySm" tone="subdued">
                  {importFile || 'Cliquez pour sélectionner un fichier CSV'}
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
