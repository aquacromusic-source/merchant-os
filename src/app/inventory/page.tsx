'use client'
import React, { useState } from 'react'
import { Page, Card, BlockStack, Text, Badge, Button, ButtonGroup, IndexTable, useIndexResourceState, Tabs } from '@shopify/polaris'
import { ExportIcon, PlusIcon, ImageIcon } from '@shopify/polaris-icons'
import { products, locations } from '@/lib/data'

const TABS_STOCK = [
  { id: 'stock', content: `Stock (${products.length})` },
  { id: 'alerts', content: 'Alertes (4)' },
]

export default function InventoryPage() {
  const [tab, setTab] = useState(0)
  const [view, setView] = useState('stock')
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(products.map(p => ({ id: p.id })))

  if (view === 'locations') {
    return (
      <Page title="Emplacements" primaryAction={{ content: 'Ajouter un emplacement', icon: PlusIcon }}>
        <Card padding="0">
          <IndexTable resourceName={{ singular: 'emplacement', plural: 'emplacements' }} itemCount={locations.length} selectedItemsCount={0} onSelectionChange={() => {}} headings={[{ title: 'Emplacement' }, { title: 'Ville' }, { title: 'Rôle' }, { title: 'Articles', alignment: 'end' }, { title: 'Commandes' }]}>
            {locations.map((l, index) => (
              <IndexTable.Row id={l.id} key={l.id} position={index} selected={false}>
                <IndexTable.Cell><Text as="span" fontWeight="semibold">{l.name}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued">{l.city}</Text></IndexTable.Cell>
                <IndexTable.Cell><Badge>{l.role}</Badge></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" numeric>{l.items}</Text></IndexTable.Cell>
                <IndexTable.Cell><Badge tone="success">{String(l.orders)}</Badge></IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Card>
      </Page>
    )
  }

  return (
    <Page title="Stock" primaryAction={{ content: 'Créer un transfert', icon: PlusIcon }} secondaryActions={[{ content: 'Exporter', icon: ExportIcon }, { content: 'Ajuster le stock' }]}>
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
            <IndexTable resourceName={{ singular: 'produit', plural: 'produits' }} itemCount={products.length} selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length} onSelectionChange={handleSelectionChange} headings={[{ title: '' }, { title: 'Produit' }, { title: 'SKU' }, { title: 'Catégorie' }, { title: 'Stock total', alignment: 'end' }, { title: 'Statut' }]}>
              {products.map((p, index) => (
                <IndexTable.Row id={p.id} key={p.id} selected={selectedResources.includes(p.id)} position={index}>
                  <IndexTable.Cell><div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--p-color-bg-surface-secondary)', border: '1px solid var(--p-color-border)', display: 'grid', placeItems: 'center' }}><ImageIcon width={14} height={14} /></div></IndexTable.Cell>
                  <IndexTable.Cell><Text as="span" fontWeight="semibold">{p.title}</Text></IndexTable.Cell>
                  <IndexTable.Cell><Text as="span" tone="subdued"><span style={{ fontFamily: 'monospace' }}>{p.sku}</span></Text></IndexTable.Cell>
                  <IndexTable.Cell><Text as="span" tone="subdued">{p.category}</Text></IndexTable.Cell>
                  <IndexTable.Cell><Text as="span" numeric tone={p.stock < 10 && p.stock > 0 ? 'critical' : 'subdued'}>{p.stock === 0 ? 'Non suivi' : p.stock}</Text></IndexTable.Cell>
                  <IndexTable.Cell><Badge tone={p.stock === 0 ? undefined : p.stock < 10 ? 'critical' : 'success'}>{p.stock === 0 ? 'Non suivi' : p.stock < 10 ? 'Rupture imminente' : 'En stock'}</Badge></IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Tabs>
        </Card>
      </BlockStack>
    </Page>
  )
}
