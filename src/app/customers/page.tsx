'use client'
import React, { useState } from 'react'
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
  IndexTable,
  useIndexResourceState,
  Tabs,
  Box,
  Avatar,
  Tag,
} from '@shopify/polaris'
import {
  ExportIcon,
  ImportIcon,
  PlusIcon,
  PersonAddIcon,
} from '@shopify/polaris-icons'
import { customers } from '@/lib/data'
import { money } from '@/lib/utils'

export default function CustomersPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs = [
    { id: 'all', content: `Tous (${customers.length})` },
    { id: 'subscribed', content: `Abonnés (${customers.filter(c => c.subscribed).length})` },
    { id: 'vip', content: `VIP (${customers.filter(c => c.tags.includes('VIP')).length})` },
    { id: 'risk', content: `À risque (${customers.filter(c => c.status === 'À risque').length})` },
  ]

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = customers.filter(c => {
    if (tabId === 'subscribed' && !c.subscribed) return false
    if (tabId === 'vip' && !c.tags.includes('VIP')) return false
    if (tabId === 'risk' && c.status !== 'À risque') return false
    return true
  })

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    list.map(c => ({ id: c.id }))
  )

  const rowMarkup = list.map((c, index) => (
    <IndexTable.Row
      id={c.id}
      key={c.id}
      selected={selectedResources.includes(c.id)}
      position={index}
      onClick={() => router.push('/customers/' + c.id)}
    >
      <IndexTable.Cell>
        <InlineStack gap="200" blockAlign="center">
          <Avatar customer name={c.name} size="sm" />
          c.name
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">
          <span style={{ fontFamily: 'monospace' }}>{c.email}</span>
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">{c.city}, {c.country}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        c.orders
      </IndexTable.Cell>
      <IndexTable.Cell>
        money(c.spend)
      </IndexTable.Cell>
      <IndexTable.Cell>
        c.lastOrder
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={c.subscribed ? 'success' : undefined}>{c.subscribed ? 'Oui' : 'Non'}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100" wrap>
          {c.tags.map(t => <Tag key={t}>{t}</Tag>)}
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  return (
    <Page
      title="Clients"
      primaryAction={{ content: 'Ajouter un client', icon: PlusIcon }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon },
        { content: 'Importer', icon: ImportIcon },
      ]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={5} gap="300">
          {[
            { l: 'Total clients', v: '3 248', d: '+12%' },
            { l: 'Abonnés', v: '1 842', d: '+8%' },
            { l: 'Valeur vie · moyenne', v: '189,20 €' },
            { l: 'Taux de retour', v: '26 %', d: '+2 pts' },
            { l: 'Segments actifs', v: '8' },
          ].map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="100" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                  {k.d && k.d}
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <IndexTable
              resourceName={{ singular: 'client', plural: 'clients' }}
              itemCount={list.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: 'Nom' },
                { title: 'E-mail' },
                { title: 'Ville' },
                { title: 'Commandes', alignment: 'end' },
                { title: 'Dépensé', alignment: 'end' },
                { title: 'Dernière commande' },
                { title: 'Abonné' },
                { title: 'Balises' },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </Tabs>
        </Card>
      </BlockStack>
    </Page>
  )
}
