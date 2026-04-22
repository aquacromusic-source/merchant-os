'use client'
import React, { useState, useMemo } from 'react'
import {
  Page,
  Card,
  BlockStack,
  Text,
  Badge,
  Button,
  ButtonGroup,
  IndexTable,
  useIndexResourceState,
  Tabs,
  TextField,
  Box,
} from '@shopify/polaris'
import { ExportIcon, PlusIcon, ImageIcon, SearchIcon } from '@shopify/polaris-icons'
import { products, locations } from '@/lib/data'

const TABS_STOCK = [
  { id: 'stock', content: `Stock (${products.length})` },
  { id: 'alerts', content: 'Alertes (4)' },
]

export default function InventoryPage() {
  const [tab, setTab] = useState(0)
  const [view, setView] = useState('stock')
  const [searchValue, setSearchValue] = useState('')

  const filteredProducts = useMemo(() => products.filter(p => {
    if (searchValue && !p.title.toLowerCase().includes(searchValue.toLowerCase()) &&
        !p.sku.toLowerCase().includes(searchValue.toLowerCase())) return false
    return true
  }), [searchValue])

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    filteredProducts.map(p => ({ id: p.id }))
  )

  if (view === 'locations') {
    return (
      <Page title="Emplacements" primaryAction={{ content: 'Ajouter un emplacement', icon: PlusIcon }}>
        <Card padding="0">
          <IndexTable
            resourceName={{ singular: 'emplacement', plural: 'emplacements' }}
            itemCount={locations.length}
            selectedItemsCount={0}
            onSelectionChange={() => {}}
            headings={[
              { title: 'Emplacement' },
              { title: 'Ville' },
              { title: 'Rôle' },
              { title: 'Articles', alignment: 'end' },
              { title: 'Commandes' },
            ]}
          >
            {locations.map((l, index) => (
              <IndexTable.Row id={l.id} key={l.id} position={index} selected={false}>
                <IndexTable.Cell><Text as="span" fontWeight="semibold">{l.name}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued">{l.city}</Text></IndexTable.Cell>
                <IndexTable.Cell><Badge>{l.role}</Badge></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" numeric>{String(l.items)}</Text></IndexTable.Cell>
                <IndexTable.Cell><Badge tone="success">{String(l.orders)}</Badge></IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Card>
        <Box paddingBlockStart="300">
          <Button onClick={() => setView('stock')}>← Retour au stock</Button>
        </Box>
      </Page>
    )
  }

  return (
    <Page
      title="Stock"
      primaryAction={{ content: 'Créer un transfert', icon: PlusIcon }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon },
        { content: 'Ajuster le stock' },
      ]}
    >
      <BlockStack gap="400">
        <ButtonGroup variant="segmented">
          {['stock', 'locations', 'transfers', 'po'].map((v, i) => (
            <Button key={v} pressed={view === v} onClick={() => setView(v)}>
              {['Stock', 'Emplacements', 'Transferts', 'Bons de commande'][i]}
            </Button>
          ))}
        </ButtonGroup>
        <Card padding="0">
          <Tabs tabs={TABS_STOCK} selected={tab} onSelect={setTab}>
            <Box padding="300" paddingBlockEnd="0">
              <TextField
                label=""
                labelHidden
                value={searchValue}
                onChange={setSearchValue}
                prefix={<SearchIcon />}
                placeholder="Rechercher produit ou SKU…"
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
            </Box>
            <IndexTable
              resourceName={{ singular: 'produit', plural: 'produits' }}
              itemCount={filteredProducts.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: '' },
                { title: 'Produit' },
                { title: 'SKU' },
                { title: 'Catégorie' },
                { title: 'Stock total', alignment: 'end' },
                { title: 'Statut' },
              ]}
            >
              {filteredProducts.map((p, index) => (
                <IndexTable.Row
                  id={p.id}
                  key={p.id}
                  selected={selectedResources.includes(p.id)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: 'var(--p-color-bg-surface-secondary)',
                      border: '1px solid var(--p-color-border)',
                      display: 'grid', placeItems: 'center',
                    }}>
                      <ImageIcon width={14} height={14} />
                    </div>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" fontWeight="semibold">{p.title}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued">
                      <span style={{ fontFamily: 'monospace' }}>{p.sku}</span>
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued">{p.category}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" numeric tone={p.stock < 10 && p.stock > 0 ? 'critical' : 'subdued'}>
                      {p.stock === 0 ? 'Non suivi' : String(p.stock)}
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Badge tone={p.stock === 0 ? undefined : p.stock < 10 ? 'critical' : 'success'}>
                      {p.stock === 0 ? 'Non suivi' : p.stock < 10 ? 'Rupture imminente' : 'En stock'}
                    </Badge>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Tabs>
        </Card>
      </BlockStack>
    </Page>
  )
}
