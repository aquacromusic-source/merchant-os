'use client'
import React, { useState, useEffect } from 'react'
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
  Box,
  Spinner,
} from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    'Publié': 'success', 'Brouillon': undefined, 'Planifié': 'warning',
  }
  return <Badge tone={toneMap[status]}>{status}</Badge>
}

export default function ContentPage() {
  const { activeSite } = useSite()
  const [pages, setPages] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pages' | 'blog'>('pages')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/content?site=${activeSite}`)
      .then(res => res.json())
      .then(data => {
        const pgs = (data.pages || []).map((p: any, i: number) => ({
          ...p,
          id: p.id != null ? String(p.id) : String(i),
          url: p.url || p.slug || '',
          status: p.status || 'Brouillon',
          updated: p.updated || '',
        }))
        const arts = (data.articles || []).map((a: any, i: number) => ({
          ...a,
          id: a.id != null ? String(a.id) : String(i),
          author: a.author || '',
          status: a.status || 'Brouillon',
          date: a.date || '',
          read: a.read || '',
        }))
        setPages(pgs)
        setArticles(arts)
      })
      .catch(() => {
        setPages([])
        setArticles([])
      })
      .finally(() => setLoading(false))
  }, [activeSite])

  const pageResources = useIndexResourceState(pages.map(p => ({ id: p.id })))
  const articleResources = useIndexResourceState(articles.map(a => ({ id: a.id })))

  if (loading) {
    return (
      <Page title="Contenu">
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
    <Page
      title="Contenu"
      primaryAction={{
        content: view === 'pages' ? 'Ajouter une page' : 'Ajouter un article',
        icon: PlusIcon,
      }}
    >
      <BlockStack gap="400">
        <ButtonGroup variant="segmented">
          <Button pressed={view === 'pages'} onClick={() => setView('pages')}>Pages</Button>
          <Button pressed={view === 'blog'} onClick={() => setView('blog')}>Articles de blog</Button>
        </ButtonGroup>

        {view === 'pages' ? (
          <Card padding="0">
            <IndexTable
              resourceName={{ singular: 'page', plural: 'pages' }}
              itemCount={pages.length}
              selectedItemsCount={pageResources.allResourcesSelected ? 'All' : pageResources.selectedResources.length}
              onSelectionChange={pageResources.handleSelectionChange}
              headings={[
                { title: 'Titre' },
                { title: 'URL' },
                { title: 'Statut' },
                { title: 'Mise à jour' },
              ]}
            >
              {pages.map((p, index) => (
                <IndexTable.Row
                  id={p.id}
                  key={p.id}
                  selected={pageResources.selectedResources.includes(p.id)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <Text as="span" fontWeight="semibold" variant="bodySm">{p.title}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued">
                      <span style={{ fontFamily: 'monospace' }}>{p.url}</span>
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{statusBadge(p.status)}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued" variant="bodySm">{p.updated}</Text>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card>
        ) : (
          <Card padding="0">
            <IndexTable
              resourceName={{ singular: 'article', plural: 'articles' }}
              itemCount={articles.length}
              selectedItemsCount={articleResources.allResourcesSelected ? 'All' : articleResources.selectedResources.length}
              onSelectionChange={articleResources.handleSelectionChange}
              headings={[
                { title: 'Titre' },
                { title: 'Auteur' },
                { title: 'Statut' },
                { title: 'Date' },
                { title: 'Lecture' },
              ]}
            >
              {articles.map((a, index) => (
                <IndexTable.Row
                  id={a.id}
                  key={a.id}
                  selected={articleResources.selectedResources.includes(a.id)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <Text as="span" fontWeight="semibold" variant="bodySm">{a.title}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued" variant="bodySm">{a.author}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{statusBadge(a.status)}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued" variant="bodySm">{a.date}</Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued" variant="bodySm">{a.read}</Text>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card>
        )}
      </BlockStack>
    </Page>
  )
}
