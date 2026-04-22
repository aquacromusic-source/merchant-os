'use client'
import React, { useState, useCallback } from 'react'
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
  TextField,
  Box,
} from '@shopify/polaris'
import {
  ExportIcon,
  ChevronDownIcon,
  PlusIcon,
  DeliveryIcon,
  LabelPrinterIcon,
  ArchiveIcon,
  SearchIcon,
} from '@shopify/polaris-icons'
import { orders } from '@/lib/data'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'

const TABS = [
  { id: 'all', content: `Toutes (${orders.length})` },
  { id: 'unfulfilled', content: `Non traitées (${orders.filter(o => o.fulfill.key === 'unfulfilled').length})` },
  { id: 'unpaid', content: `Non payées (${orders.filter(o => ['pending', 'authorized'].includes(o.payment.key)).length})` },
  { id: 'open', content: 'Ouvertes (18)' },
  { id: 'closed', content: 'Fermées (426)' },
]

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

export default function OrdersPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  const tabId = TABS[selectedTab]?.id || 'all'

  const filtered = orders.filter(o => {
    if (tabId === 'unfulfilled' && o.fulfill.key !== 'unfulfilled') return false
    if (tabId === 'unpaid' && !['pending', 'authorized'].includes(o.payment.key)) return false
    if (searchValue && !(o.id.includes(searchValue) || o.customer.toLowerCase().includes(searchValue.toLowerCase()))) return false
    return true
  })

  const resourceName = { singular: 'commande', plural: 'commandes' }
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(filtered.map(o => ({ id: o.id })))

  const kpis = [
    { l: "Aujourd'hui", v: '1', d: '+75 %', sk: [4, 6, 8, 7, 10, 12, 16, 18, 20] },
    { l: 'Articles commandés', v: '3', d: '+73 %', sk: [3, 4, 6, 8, 10, 12, 14, 15] },
    { l: 'Retours', v: '0 €', d: '—', sk: [2, 2, 3, 3, 2, 3, 2, 2] },
    { l: 'Commandes traitées', v: '12', d: '—', sk: [12, 10, 14, 16, 14, 12, 18, 15] },
    { l: 'Commandes livrées', v: '0', d: '+100 %', sk: [0, 1, 2, 4, 6, 6, 8, 10] },
  ]

  const rowMarkup = filtered.map((o, index) => (
    <IndexTable.Row
      id={o.id}
      key={o.id}
      selected={selectedResources.includes(o.id)}
      position={index}
      onClick={() => router.push('/orders/' + o.id.slice(1))}
    >
      <IndexTable.Cell>
        <Text as="span" fontWeight="semibold" variant="bodySm">
          <span style={{ fontFamily: 'monospace' }}>{o.id}</span>
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">{o.date}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{o.customer}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" fontWeight="semibold" numeric>{money(o.total)}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{paymentBadge(o.payment.tone, o.payment.label)}</IndexTable.Cell>
      <IndexTable.Cell>{paymentBadge(o.fulfill.tone, o.fulfill.label)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">{o.items} article{o.items > 1 ? 's' : ''}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">{o.channel}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  const promotedBulkActions = [
    { content: 'Marquer traitées', icon: DeliveryIcon, onAction: () => {} },
    { content: 'Imprimer étiquettes', icon: LabelPrinterIcon, onAction: () => {} },
    { content: 'Archiver', icon: ArchiveIcon, onAction: () => {} },
  ]

  return (
    <Page
      title="Commandes"
      primaryAction={{ content: 'Créer une commande', icon: PlusIcon, variant: 'primary' }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon },
        { content: 'Autres actions', icon: ChevronDownIcon },
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
                  <Text as="span" variant="bodySm" tone="success">{k.d}</Text>
                </InlineStack>
                <Sparkline data={k.sk} w={180} h={24} />
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={TABS} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="300" paddingBlockEnd="0">
              <TextField
                label=""
                labelHidden
                value={searchValue}
                onChange={setSearchValue}
                prefix={<SearchIcon />}
                placeholder="Rechercher une commande…"
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
            </Box>
            <IndexTable
              resourceName={resourceName}
              itemCount={filtered.length}
              selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Commande' },
                { title: 'Date' },
                { title: 'Client' },
                { title: 'Total', alignment: 'end' },
                { title: 'Paiement' },
                { title: 'Traitement' },
                { title: 'Articles' },
                { title: 'Canal' },
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
