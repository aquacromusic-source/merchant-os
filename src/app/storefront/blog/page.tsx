'use client'
import React, { useState, useEffect } from 'react'
import { Page, Card, Text, Badge, IndexTable, useIndexResourceState, Tabs, Box, BlockStack, Spinner } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

function statusBadge(status: string) {
  const m: Record<string, 'success' | 'warning' | undefined> = { 'Publié': 'success', 'Programmée': 'warning' }
  return <Badge tone={m[status]}>{status}</Badge>
}

export default function StorefrontBlogPage() {
  const { activeSite } = useSite()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState(0)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/blog?site=${activeSite}`)
      .then(res => res.json())
      .then(data => {
        setArticles(Array.isArray(data) ? data : [])
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [activeSite])

  const tabs = [
    { id: 'all', content: `Tous (${articles.length})` },
    { id: 'published', content: `Publiés (${articles.filter(a => a.status === 'Publié').length})` },
    { id: 'draft', content: `Brouillons (${articles.filter(a => a.status === 'Brouillon').length})` },
  ]
  const tabId = tabs[sel]?.id || 'all'
  const list = articles.filter(a => tabId === 'all' || (tabId === 'published' && a.status === 'Publié') || (tabId === 'draft' && a.status === 'Brouillon'))
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map((_: any, i: number) => ({ id: String(i) })))

  if (loading) {
    return (
      <Page title="Articles de blog">
        <Card>
          <Box padding="400" paddingBlockStart="1600" paddingBlockEnd="1600">
            <BlockStack align="center" inlineAlign="center">
              <Spinner size="large" />
            </BlockStack>
          </Box>
        </Card>
      </Page>
    )
  }

  return (
    <Page title="Articles de blog" primaryAction={{ content: 'Ajouter un article', icon: PlusIcon }}>
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
