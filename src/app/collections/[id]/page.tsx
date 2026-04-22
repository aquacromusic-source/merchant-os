'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Page, Card, BlockStack, TextField, Select, Banner } from '@shopify/polaris'
import { collections } from '@/lib/data'

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const c = collections.find(x => x.id === params.id) || collections[0]
  const [title, setTitle] = useState(c.title)
  const [description, setDescription] = useState('')
  const [type, setType] = useState('manual')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Page
      backAction={{ content: 'Collections', onAction: () => router.push('/collections') }}
      title={c.title}
      primaryAction={{ content: 'Enregistrer', loading: saving, onAction: handleSave }}
    >
      <BlockStack gap="400">
        {saved && <Banner tone="success" onDismiss={() => setSaved(false)}>Modifications enregistrées ✓</Banner>}
        <Card>
          <BlockStack gap="400">
            <TextField label="Titre" value={title} onChange={setTitle} autoComplete="off" />
            <TextField label="Description" value={description} onChange={setDescription} autoComplete="off" multiline={4} />
            <Select
              label="Type"
              options={[{ label: 'Manuel', value: 'manual' }, { label: 'Automatique', value: 'smart' }]}
              value={type}
              onChange={setType}
            />
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  )
}
