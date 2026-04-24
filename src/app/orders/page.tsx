'use client'
import React, { useState, useCallback, useMemo, useEffect } from 'react'
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
  Modal,
  Select,
  FormLayout,
  ActionList,
  Popover,
} from '@shopify/polaris'
import {
  ExportIcon,
  ChevronDownIcon,
  PlusIcon,
  DeliveryIcon,
  LabelPrinterIcon,
  ArchiveIcon,
  SearchIcon,
  FilterIcon,
} from '@shopify/polaris-icons'
import { orders as allOrders } from '@/lib/data'
import { money } from '@/lib/utils'
import { Sparkline } from '@/components/ui/Sparkline'
import { useSite } from '@/contexts/SiteContext'

function buildTabs(orders: typeof allOrders) {
  return [
    { id: 'all', content: `Toutes (${orders.length})` },
    { id: 'unfulfilled', content: `Non traitées (${orders.filter(o => o.fulfill.key === 'unfulfilled').length})` },
    { id: 'unpaid', content: `Non payées (${orders.filter(o => ['pending', 'authorized'].includes(o.payment.key)).length})` },
    { id: 'open', content: 'Ouvertes (18)' },
    { id: 'closed', content: 'Fermées (426)' },
  ]
}

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

export default function OrdersPage() {
  const router = useRouter()
  const { activeSite } = useSite()
  const orders = useMemo(() => allOrders.filter(o => o.site_id === activeSite), [activeSite])
  const TABS = useMemo(() => buildTabs(orders), [orders])
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchValue, setSearchValue] = useState('')

  // Reset tab on site change
  useEffect(() => { setSelectedTab(0) }, [activeSite])

  // Advanced filters state
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [filterMinAmount, setFilterMinAmount] = useState('')
  const [filterMaxAmount, setFilterMaxAmount] = useState('')
  const [filterPayment, setFilterPayment] = useState('')
  const [filterFulfill, setFilterFulfill] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [filterTag, setFilterTag] = useState('')

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState<{
    dateFrom?: string; dateTo?: string; minAmount?: string; maxAmount?: string;
    payment?: string; fulfill?: string; channel?: string; tag?: string;
  }>({})

  const tabId = TABS[selectedTab]?.id || 'all'

  const filtered = useMemo(() => orders.filter(o => {
    if (tabId === 'unfulfilled' && o.fulfill.key !== 'unfulfilled') return false
    if (tabId === 'unpaid' && !['pending', 'authorized'].includes(o.payment.key)) return false
    if (searchValue && !(o.id.includes(searchValue) || o.customer.toLowerCase().includes(searchValue.toLowerCase()))) return false
    if (appliedFilters.minAmount && o.total < parseFloat(appliedFilters.minAmount)) return false
    if (appliedFilters.maxAmount && o.total > parseFloat(appliedFilters.maxAmount)) return false
    if (appliedFilters.payment && o.payment.key !== appliedFilters.payment) return false
    if (appliedFilters.fulfill && o.fulfill.key !== appliedFilters.fulfill) return false
    if (appliedFilters.channel && !o.channel.toLowerCase().includes(appliedFilters.channel.toLowerCase())) return false
    if (appliedFilters.tag && !o.tags.includes(appliedFilters.tag)) return false
    return true
  }), [searchValue, tabId, appliedFilters])

  const resourceName = { singular: 'commande', plural: 'commandes' }
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(filtered.map(o => ({ id: o.id })))

  const kpis = [
    { l: "Aujourd'hui", v: '1', d: '+75 %', sk: [4, 6, 8, 7, 10, 12, 16, 18, 20] },
    { l: 'Articles commandés', v: '3', d: '+73 %', sk: [3, 4, 6, 8, 10, 12, 14, 15] },
    { l: 'Retours', v: '0 €', d: '—', sk: [2, 2, 3, 3, 2, 3, 2, 2] },
    { l: 'Commandes traitées', v: '12', d: '—', sk: [12, 10, 14, 16, 14, 12, 18, 15] },
    { l: 'Commandes livrées', v: '0', d: '+100 %', sk: [0, 1, 2, 4, 6, 6, 8, 10] },
  ]

  const handleExportCSV = useCallback(() => {
    const header = 'Commande,Date,Client,Total,Paiement,Traitement,Articles,Canal'
    const rows = filtered.map(o =>
      `${o.id},${o.date},${o.customer},${o.total},${o.payment.label},${o.fulfill.label},${o.items},${o.channel}`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'commandes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [filtered])

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      dateFrom: filterDateFrom || undefined,
      dateTo: filterDateTo || undefined,
      minAmount: filterMinAmount || undefined,
      maxAmount: filterMaxAmount || undefined,
      payment: filterPayment || undefined,
      fulfill: filterFulfill || undefined,
      channel: filterChannel || undefined,
      tag: filterTag || undefined,
    })
    setFilterModalOpen(false)
  }, [filterDateFrom, filterDateTo, filterMinAmount, filterMaxAmount, filterPayment, filterFulfill, filterChannel, filterTag])

  const handleResetFilters = useCallback(() => {
    setFilterDateFrom('')
    setFilterDateTo('')
    setFilterMinAmount('')
    setFilterMaxAmount('')
    setFilterPayment('')
    setFilterFulfill('')
    setFilterChannel('')
    setFilterTag('')
    setAppliedFilters({})
    setFilterModalOpen(false)
  }, [])

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length

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
      <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{o.date}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" variant="bodySm">{o.customer}</Text></IndexTable.Cell>
      <IndexTable.Cell><Text as="span" variant="bodySm" numeric>{money(o.total)}</Text></IndexTable.Cell>
      <IndexTable.Cell>{paymentBadge(o.payment.tone, o.payment.label)}</IndexTable.Cell>
      <IndexTable.Cell>{paymentBadge(o.fulfill.tone, o.fulfill.label)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued" variant="bodySm">{o.items} article{o.items > 1 ? 's' : ''}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell><Text as="span" tone="subdued" variant="bodySm">{o.channel}</Text></IndexTable.Cell>
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
      primaryAction={{ content: 'Créer une commande', icon: PlusIcon }}
      secondaryActions={[
        { content: 'Exporter', icon: ExportIcon, onAction: handleExportCSV },
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
                  {k.d}
                </InlineStack>
                <Sparkline data={k.sk} w={180} h={24} />
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Card padding="0">
          <Tabs tabs={TABS} selected={selectedTab} onSelect={setSelectedTab}>
            <Box padding="300" paddingBlockEnd="0">
              <InlineStack gap="200">
                <div style={{ flex: 1 }}>
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
                </div>
                <Button
                  icon={FilterIcon}
                  onClick={() => setFilterModalOpen(true)}
                  pressed={activeFilterCount > 0}
                >
                  {activeFilterCount > 0 ? `Filtres (${activeFilterCount})` : 'Filtres'}
                </Button>
              </InlineStack>
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

      {/* Advanced Filters Modal */}
      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filtres avancés"
        primaryAction={{ content: 'Appliquer', onAction: handleApplyFilters }}
        secondaryActions={[{ content: 'Réinitialiser', onAction: handleResetFilters }]}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Date de début"
                type="date"
                value={filterDateFrom}
                onChange={setFilterDateFrom}
                autoComplete="off"
              />
              <TextField
                label="Date de fin"
                type="date"
                value={filterDateTo}
                onChange={setFilterDateTo}
                autoComplete="off"
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Montant minimum (€)"
                type="number"
                value={filterMinAmount}
                onChange={setFilterMinAmount}
                autoComplete="off"
                placeholder="0"
              />
              <TextField
                label="Montant maximum (€)"
                type="number"
                value={filterMaxAmount}
                onChange={setFilterMaxAmount}
                autoComplete="off"
                placeholder="9999"
              />
            </FormLayout.Group>
            <Select
              label="Statut paiement"
              options={[
                { label: 'Tous', value: '' },
                { label: 'Payée', value: 'paid' },
                { label: 'En attente', value: 'pending' },
                { label: 'Autorisée', value: 'authorized' },
                { label: 'Remboursée', value: 'refunded' },
              ]}
              value={filterPayment}
              onChange={setFilterPayment}
            />
            <Select
              label="Statut traitement"
              options={[
                { label: 'Tous', value: '' },
                { label: 'Non traitée', value: 'unfulfilled' },
                { label: 'Traitée', value: 'fulfilled' },
                { label: 'En transit', value: 'in_transit' },
              ]}
              value={filterFulfill}
              onChange={setFilterFulfill}
            />
            <TextField
              label="Canal de vente"
              value={filterChannel}
              onChange={setFilterChannel}
              autoComplete="off"
              placeholder="Boutique en ligne, POS…"
            />
            <TextField
              label="Balise"
              value={filterTag}
              onChange={setFilterTag}
              autoComplete="off"
              placeholder="vip, promo…"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
