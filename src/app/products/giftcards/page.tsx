'use client'
import React, { useState } from 'react'
import { Page, Card, Text, Badge, IndexTable, useIndexResourceState, Tabs } from '@shopify/polaris'
import { PlusIcon } from '@shopify/polaris-icons'
import { money } from '@/lib/utils'

const firstNames = ['Marie', 'Thomas', 'Claire', 'Lucas', 'Emma', 'Noah', 'Sophie', 'Louis']
const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy']

const giftcards = Array.from({ length: 24 }, (_, i) => ({
  id: `GC-${8000 + i}`,
  code: `GIFT-XXXX-${i}`,
  customer: `${firstNames[i % 8]} ${lastNames[i % 8]}`,
  initial: [25, 50, 100, 200][i % 4],
  remaining: [25, 50, 100, 200][i % 4] * (i % 3 === 0 ? 0 : i % 3 === 1 ? 0.5 : 1),
  status: i % 7 === 0 ? 'Expiré' : i % 4 === 0 ? 'Utilisé' : 'Actif',
}))

function statusBadge(status: string) {
  const m: Record<string, 'success' | 'critical' | undefined> = { 'Actif': 'success', 'Utilisé': 'critical' }
  return <Badge tone={m[status]}>{status}</Badge>
}

export default function ProductsGiftcardsPage() {
  const [sel, setSel] = useState(0)
  const tabs = [
    { id: 'all', content: `Toutes (${giftcards.length})` },
    { id: 'active', content: `Actives (${giftcards.filter(g => g.status === 'Actif').length})` },
    { id: 'used', content: `Utilisées (${giftcards.filter(g => g.status === 'Utilisé').length})` },
    { id: 'expired', content: `Expirées (${giftcards.filter(g => g.status === 'Expiré').length})` },
  ]
  const tabId = tabs[sel]?.id || 'all'
  const list = giftcards.filter(g =>
    tabId === 'all' || (tabId === 'active' && g.status === 'Actif') ||
    (tabId === 'used' && g.status === 'Utilisé') || (tabId === 'expired' && g.status === 'Expiré')
  )
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(list.map(g => ({ id: g.id })))

  return (
    <Page title="Cartes cadeaux" primaryAction={{ content: 'Émettre une carte cadeau', icon: PlusIcon }}>
      <Card padding="0">
        <Tabs tabs={tabs} selected={sel} onSelect={setSel}>
          <IndexTable
            resourceName={{ singular: 'carte cadeau', plural: 'cartes cadeaux' }}
            itemCount={list.length}
            selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Code' }, { title: 'Client' },
              { title: 'Valeur initiale', alignment: 'end' },
              { title: 'Solde restant', alignment: 'end' },
              { title: 'Statut' },
            ]}
          >
            {list.map((g, i) => (
              <IndexTable.Row id={g.id} key={g.id} selected={selectedResources.includes(g.id)} position={i}>
                <IndexTable.Cell>
                  <Text as="span" fontWeight="semibold">
                    <span style={{ fontFamily: 'monospace' }}>{g.code}</span>
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell><Text as="span">{g.customer}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" numeric>{money(g.initial)}</Text></IndexTable.Cell>
                <IndexTable.Cell><Text as="span" numeric fontWeight="semibold">{money(g.remaining)}</Text></IndexTable.Cell>
                <IndexTable.Cell>{statusBadge(g.status)}</IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Tabs>
      </Card>
    </Page>
  )
}
