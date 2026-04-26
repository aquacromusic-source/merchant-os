'use client'
import React, { useState, useMemo, useEffect } from 'react'
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
  TextField,
} from '@shopify/polaris'
import {
  ExportIcon,
  ImportIcon,
  PlusIcon,
  SearchIcon,
} from '@shopify/polaris-icons'
import { money } from '@/lib/utils'
import { useSite } from '@/contexts/SiteContext'

export default function CustomersPage() {
  const router = useRouter()
  const { activeSite } = useSite()
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setSelectedTab(0)
    fetch(`/api/customers?site=${activeSite}`)
      .then(r => r.json())
      .then((data: any[]) => {
        const mapped = (data || []).map((c: any) => ({
          id: c.id,
          name: c.name || '',
          email: c.email || '',
          orders: c.order_count ?? c.orders ?? 0,
          spend: parseFloat(c.total_spent ?? c.spend ?? 0),
          lastOrder: c.last_order || '',
          city: c.city || '',
          country: c.country || '',
          tags: c.tags || [],
          subscribed: !!c.subscribed,
          status: c.status || '',
        }))
        setCustomers(mapped)
      })
      .catch(() => setCustomers([]))
  }, [activeSite])

  const totalClients = customers.length
  const subscribedCount = customers.filter(c => c.subscribed).length
  const avgLifetimeValue = totalClients > 0
    ? customers.reduce((sum, c) => sum + c.spend, 0) / totalClients
    : 0
  const returnRate = totalClients > 0
    ? Math.round((customers.filter(c => c.orders > 1).length / totalClients) * 100)
    : 0
  const uniqueTags = new Set(customers.flatMap(c => c.tags))
  const segmentCount = uniqueTags.size

  const kpis = [
    { l: 'Total clients', v: totalClients.toLocaleString('fr-FR') },
    { l: 'Abonnés', v: subscribedCount.toLocaleString('fr-FR') },
    { l: 'Valeur vie · moyenne', v: money(avgLifetimeValue) },
    { l: 'Taux de retour', v: `${returnRate} %` },
    { l: 'Segments actifs', v: String(segmentCount) },
  ]

  const tabs = useMemo(() => [
    { id: 'all', content: `Tous (${customers.length})` },
    { id: 'subscribed', content: `Abonnés (${customers.filter(c => c.subscribed).length})` },
    { id: 'vip', content: `VIP (${customers.filter(c => c.tags.includes('VIP')).length})` },
    { id: 'risk', content: `À risque (${customers.filter(c => c.status === 'À risque').length})` },
  ], [customers])

  const tabId = tabs[selectedTab]?.id || 'all'

  const list = useMemo(() => customers.filter(c => {
    if (tabId === 'subscribed' && !c.subscribed) return false
    if (tabId === 'vip' && !c.tags.includes('VIP')) return false
    if (tabId === 'risk' && c.status !== 'À risque') return false
    if (searchValue && !(
      c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.email.toLowerCase().includes(searchValue.toLowerCase())
    )) return false
    return true
  }), [customers, searchValue, tabId])

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
          {c.name}
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
      <IndexTable.Cell>{String(c.orders)}</IndexTable.Cell>
      <IndexTable.Cell>{money(c.spend)}</IndexTable.Cell>
      <IndexTable.Cell>{c.lastOrder}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={c.subscribed ? 'success' : undefined}>{c.subscribed ? 'Oui' : 'Non'}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="100" wrap>
          {c.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
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
          {kpis.map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="100" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="300" paddingBlockEnd="0">
              <TextField
                label=""
                labelHidden
                value={searchValue}
                onChange={setSearchValue}
                prefix={<SearchIcon />}
                placeholder="Rechercher un client…"
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
            </Box>
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
