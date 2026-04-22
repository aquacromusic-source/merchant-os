'use client'
import React, { useState } from 'react'
import { Page, Card, Text, Badge, IndexTable, useIndexResourceState, Tabs } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { articles } from '@/lib/data'

function statusBadge(status: string) {
  const m: Record<string, 'success' | 'warning' | undefined> = { 'Publié': 'success', 'Programmée': 'warning' }
  return <Badge tone={m[status]}>{status}</Badge>
}

export default function StorefrontBlogPage() {
  const [sel, setSel] = useState(0)
  const tabs = [
    { id: 'all', content: `Tous (${(articles as any[]).length})` },
    { id: 'published', content: `Publiés (${(articles as any[]).filter(a => a.status === 'Publié').length})` },
    { id: 'draft', content: `Brouillons (${(articles as any[]).filter(a => a.status === 'Brouillon').length})` },
  ]
  const tabId = tabs[sel]?.id || 'all'
  const list = (articles as any[]).filter(a => tabId === 'all' || (tabId === 'published' && a.status === 'Publié') || (tabId === 'draft' && a.status === 'Brouillon'))
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map((_: any, i: number) => ({ id: String(i) })))
  return (
    <Page title="Articles de blog" primaryAction={{ content: 'Ajouter un article', icon: PlusIcon, variant: 'primary' }}>
      <Card padding="0">
        <Tabs tabs={tabs} selected={sel} onSelect={setSel}>
          <IndexTable
            resourceName={{ singular: 'article', plural: 'articles' }}
            itemCount={list.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[{ title: 'Titre' }, { title: 'Auteur' }, { title: 'Statut' }, { title: 'Date' }]}
          >
            {list.map((a: any, i: number) => (
              <IndexTable.Row id={String(i)} key={i} selected={selectedResources.includes(String(i))} position={i}>
                <IndexTable.Cell><Text as="span" fontWeight="semibold">{a.title}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued">{a.author}</Text></IndexTable.Cell>
                <IndexTable.Cell>{statusBadge(a.status)}</IndexTable.Cell>
                <IndexTable.Cell><Text as="span" tone="subdued">{a.date}</Text></IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
