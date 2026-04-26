'use client'
import React, { useState, useEffect } from 'react'
import { Page, Card, Text, Badge, IndexTable, useIndexResourceState, Tabs, Box, BlockStack, Spinner } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

function statusBadge(status: string) {
  const m: Record<string, 'success' | 'warning' | undefined> = { 'Publié': 'success', 'Planifié': 'warning' }
  return <Badge tone={m[status]}>{status}</Badge>
}

export default function StorefrontPagesPage() {
  const { activeSite } = useSite()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState(0)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/pages?site=${activeSite}`)
      .then(res => res.json())
      .then(data => {
        setPages(Array.isArray(data) ? data : [])
      })
      .catch(() => setPages([]))
      .finally(() => setLoading(false))
  }, [activeSite])

  const tabs = [
    { id: 'all', content: `Toutes (${pages.length})` },
    { id: 'published', content: `Publiées (${pages.filter(p => p.status === 'Publié').length})` },
  ]
  const list = pages.filter(p => sel === 0 || p.status === 'Publié')
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map((_: any, i: number) => ({ id: String(i) })))

  if (loading) {
    return (
      <Page title="Pages">
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
    <Page title="Pages" primaryAction={{ content: 'Ajouter une page', icon: PlusIcon }}>
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
