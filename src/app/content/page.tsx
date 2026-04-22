'use client'
import React, { useState } from 'react'
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
} from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { pages, articles } from '@/lib/data'

function statusBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | undefined> = {
    'Publié': 'success', 'Brouillon': undefined, 'Planifié': 'warning',
  }
  return <Badge tone={toneMap[status]}>{status}</Badge>
}

export default function ContentPage() {
  const [view, setView] = useState<'pages' | 'blog'>('pages')

  const pageResources = useIndexResourceState(pages.map((_, i) => ({ id: String(i) })))
  const articleResources = useIndexResourceState(articles.map((_, i) => ({ id: String(i) })))

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
                  id={String(index)}
                  key={index}
                  selected={pageResources.selectedResources.includes(String(index))}
                  position={index}
                >
                  <IndexTable.Cell>
                    {p.title}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" tone="subdued">
                      <span style={{ fontFamily: 'monospace' }}>{p.url}</span>
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{statusBadge(p.status)}</IndexTable.Cell>
                  <IndexTable.Cell>
                    {p.updated}
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
                  id={String(index)}
                  key={index}
                  selected={articleResources.selectedResources.includes(String(index))}
                  position={index}
                >
                  <IndexTable.Cell>
                    {a.title}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    {a.author}
                  </IndexTable.Cell>
                  <IndexTable.Cell>{statusBadge(a.status)}</IndexTable.Cell>
                  <IndexTable.Cell>
                    {a.date}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    {a.read}
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
