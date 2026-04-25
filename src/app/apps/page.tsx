'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Page, Card, BlockStack, InlineStack, InlineGrid, Text, Badge, Button, Modal, TextField, Select, Spinner, EmptyState, Banner } from '@shopify/polaris'
import { PlusIcon, DeleteIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

interface App {
  id: string
  site_id: string
  name: string
  description: string | null
  category: string
  config: Record<string, any>
  is_active: boolean
  created_at: string
}

const CATEGORIES = [
  { label: 'Analytics & Reporting', value: 'analytics' },
  { label: 'Marketing & Emails', value: 'marketing' },
  { label: 'Livraison & Logistique', value: 'shipping' },
  { label: 'Paiements & Finance', value: 'payments' },
  { label: 'Gestion des stocks', value: 'inventory' },
  { label: 'Expérience client', value: 'customer' },
  { label: 'Automatisation', value: 'automation' },
  { label: 'Autre', value: 'other' },
]

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.label])
)

const CATEGORY_TONES: Record<string, 'info' | 'success' | 'attention' | 'warning' | 'critical' | undefined> = {
  analytics: 'info',
  marketing: 'success',
  shipping: 'attention',
  payments: 'warning',
  inventory: 'info',
  customer: 'success',
  automation: 'attention',
  other: undefined,
}

export default function AppsPage() {
  const router = useRouter()
  const { activeSite } = useSite()

  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)
  const [migrationSql, setMigrationSql] = useState('')
  const [error, setError] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory, setNewCategory] = useState('other')

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null)

  const checkSetup = useCallback(async () => {
    try {
      const res = await fetch('/api/apps/setup')
      const data = await res.json()
      setTableExists(data.table_exists)
      if (!data.table_exists && data.migration_sql) {
        setMigrationSql(data.migration_sql)
      }
      return data.table_exists
    } catch {
      setError('Impossible de vérifier la configuration de la table.')
      return false
    }
  }, [])

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`/api/apps?site=${activeSite}`)
      const data = await res.json()
      if (data.error) {
        setError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error))
        setApps([])
      } else {
        setApps(data.apps || [])
        setError('')
      }
    } catch {
      setError('Impossible de charger les applications.')
      setApps([])
    }
  }, [activeSite])

  const loadData = useCallback(async () => {
    setLoading(true)
    const exists = await checkSetup()
    if (exists) {
      await fetchApps()
    }
    setLoading(false)
  }, [checkSetup, fetchApps])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: activeSite,
          name: newName.trim(),
          description: newDescription.trim() || null,
          category: newCategory,
        }),
      })
      const data = await res.json()
      if (res.ok && data.app) {
        setModalOpen(false)
        setNewName('')
        setNewDescription('')
        setNewCategory('other')
        await fetchApps()
      } else {
        setError(typeof data.error === 'string' ? data.error : 'Erreur lors de la création.')
      }
    } catch {
      setError('Erreur lors de la création de l\'application.')
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchApps()
      } else {
        const data = await res.json()
        setError(typeof data.error === 'string' ? data.error : 'Erreur lors de la suppression.')
      }
    } catch {
      setError('Erreur lors de la suppression.')
    }
    setDeleting(null)
  }

  const handleToggleActive = async (app: App) => {
    try {
      const res = await fetch(`/api/apps/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !app.is_active }),
      })
      if (res.ok) {
        await fetchApps()
      }
    } catch {
      setError('Erreur lors de la mise à jour.')
    }
  }

  if (loading) {
    return (
      <Page title="Applications">
        <Card>
          <BlockStack gap="400" inlineAlign="center">
            <Spinner size="large" />
            <Text as="p" variant="bodySm" tone="subdued">Chargement...</Text>
          </BlockStack>
        </Card>
      </Page>
    )
  }

  if (!tableExists) {
    return (
      <Page title="Applications">
        <BlockStack gap="400">
          <Banner
            title="Table non configurée"
            tone="warning"
          >
            <BlockStack gap="200">
              <Text as="p">La table <code>apps</code> n&apos;existe pas encore. Exécutez le SQL ci-dessous dans le Supabase Dashboard &gt; SQL Editor :</Text>
              <div style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                {migrationSql}
              </div>
              <Button onClick={() => loadData()}>Vérifier à nouveau</Button>
            </BlockStack>
          </Banner>
        </BlockStack>
      </Page>
    )
  }

  return (
    <Page
      title="Applications"
      primaryAction={{
        content: 'Créer une application',
        icon: PlusIcon,
        onAction: () => setModalOpen(true),
      }}
    >
      <BlockStack gap="400">
        {error && (
          <Banner
            title="Erreur"
            tone="critical"
            onDismiss={() => setError('')}
          >
            <Text as="p">{error}</Text>
          </Banner>
        )}

        <Card>
          <BlockStack gap="400">
            <InlineStack gap="200" align="space-between">
              <InlineStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Applications installées</Text>
                <Badge>{String(apps.length)}</Badge>
              </InlineStack>
            </InlineStack>

            {apps.length === 0 ? (
              <EmptyState
                heading="Aucune application"
                image=""
              >
                <Text as="p">Créez votre première application pour commencer.</Text>
              </EmptyState>
            ) : (
              <InlineGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="300">
                {apps.map(app => (
                  <Card key={app.id}>
                    <BlockStack gap="200">
                      <InlineStack align="space-between" blockAlign="start">
                        <Text as="p" fontWeight="semibold">{app.name}</Text>
                        <InlineStack gap="100">
                          <Badge tone={app.is_active ? 'success' : undefined}>
                            {app.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </InlineStack>
                      </InlineStack>

                      {app.description && (
                        <Text as="p" variant="bodySm" tone="subdued">{app.description}</Text>
                      )}

                      <InlineStack gap="100">
                        <Badge tone={CATEGORY_TONES[app.category]}>
                          {CATEGORY_LABELS[app.category] || app.category}
                        </Badge>
                      </InlineStack>

                      <InlineStack gap="200" align="space-between">
                        <InlineStack gap="200">
                          <Button
                            size="slim"
                            onClick={() => router.push(`/apps/${app.id}`)}
                          >
                            Ouvrir
                          </Button>
                          <Button
                            size="slim"
                            tone="critical"
                            variant="plain"
                            icon={DeleteIcon}
                            loading={deleting === app.id}
                            onClick={() => handleDelete(app.id)}
                          >
                            Supprimer
                          </Button>
                        </InlineStack>
                        <Button
                          size="slim"
                          variant="plain"
                          onClick={() => handleToggleActive(app)}
                        >
                          {app.is_active ? 'Désactiver' : 'Activer'}
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            )}
          </BlockStack>
        </Card>
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Créer une application"
        primaryAction={{
          content: 'Créer',
          onAction: handleCreate,
          loading: creating,
          disabled: !newName.trim(),
        }}
        secondaryActions={[
          {
            content: 'Annuler',
            onAction: () => setModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <TextField
              label="Nom"
              value={newName}
              onChange={setNewName}
              autoComplete="off"
              placeholder="Mon application"
            />
            <TextField
              label="Description"
              value={newDescription}
              onChange={setNewDescription}
              autoComplete="off"
              multiline={3}
              placeholder="Description de l'application..."
            />
            <Select
              label="Catégorie"
              options={CATEGORIES}
              value={newCategory}
              onChange={setNewCategory}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
