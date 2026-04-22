'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Page, Card, BlockStack, TextField, Select } from '@shopify/polaris'
import { collections } from '@/lib/data'

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const c = collections.find(x => x.id === params.id) || collections[0]
  return (
    <Page
      backAction={{ content: 'Collections', onAction: () => router.push('/collections') }}
      title={c.title}
      primaryAction={{ content: 'Enregistrer' }}
    >
      <Card>
        <BlockStack gap="400">
          <TextField label="Titre" value={c.title} autoComplete="off" />
          <TextField label="Description" value="" autoComplete="off" multiline={4} />
          <Select
            label="Type"
            options={[{ label: 'Manuel', value: 'manual' }, { label: 'Automatique', value: 'smart' }]}
            value="manual"
            onChange={() => {}}
          />
        </BlockStack>
      </Card>
    </Page>
  )
}
