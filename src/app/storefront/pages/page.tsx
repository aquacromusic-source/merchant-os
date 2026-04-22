'use client'
import React, { useState } from 'react'
import { Page, Card, Text, Badge, IndexTable, useIndexResourceState, Tabs } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { pages } from '@/lib/data'

function statusBadge(status: string) {
  const m: Record<string, 'success' | 'warning' | undefined> = { 'Publié': 'success', 'Planifié': 'warning' }
  return <Badge tone={m[status]}>{status}</Badge>
}

export default function StorefrontPagesPage() {
  const [sel, setSel] = useState(0)
  const tabs = [
    { id: 'all', content: `Toutes (${(pages as any[]).length})` },
    { id: 'published', content: `Publiées (${(pages as any[]).filter(p => p.status === 'Publié').length})` },
  ]
  const list = (pages as any[]).filter(p => sel === 0 || p.status === 'Publié')
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map((_: any, i: number) => ({ id: String(i) })))
  return (
    <Page title="Pages" primaryAction={{ content: 'Ajouter une page', icon: PlusIcon, variant: 'primary' }}>
      <Card padding="0">
        <Tabs tabs={tabs} selected={sel} onSelect={setSel}>
          <IndexTable
            resourceName={{ singular: 'page', plural: 'pages' }}
            itemCount={list.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[{ title: 'Titre' }, { title: 'URL' }, { title: 'Statut' }, { title: 'Mise à jour' }]}
          >
            {list.map((p: any, i: number) => (
              <IndexTable.Row id={String(i)} key={i} selected={selectedResources.includes(String(i))} position={i}>
                <IndexTable.Cell><Text as="span" fontWeight="semibold">{p.title}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued"><span style={{ fontFamily: 'monospace' }}>{p.url}</span></Text></IndexTable.Cell>
                <IndexTable.Cell>{statusBadge(p.status)}</IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued">{p.updated}</Text></IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
