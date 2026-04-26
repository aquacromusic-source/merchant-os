'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  InlineGrid,
  Text,
  Badge,
  Button,
  Divider,
  Box,
  Tag,
  Avatar,
  DataTable,
  TextField,
  Banner,
  Spinner,
} from '@shopify/polaris'
import {
  EmailIcon,
  ChevronDownIcon,
  EditIcon,
  PlusIcon,
  ClockIcon,
} from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'
import { money } from '@/lib/utils'

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

interface Customer {
  id: string
  name: string
  email: string
  orders: number
  spend: number
  last_order: string
  city: string
  country: string
  tags: string[]
  subscribed: boolean
  status: string
}

interface Order {
  id: string
  date: string
  items: number
  total: number
  customerId?: string
  customer_id?: string
  payment: { tone: string; label: string }
  fulfill: { tone: string; label: string }
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { activeSite } = useSite()
  const [c, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchCustomer = fetch(`/api/customers/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setCustomer({
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
            orders: data.orders || 0,
            spend: data.spend || 0,
          })
        }
      })
      .catch(() => {})

    const fetchOrders = fetch(`/api/orders?site=${activeSite}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const customerOrders = data.filter(
            (o: any) => (o.customerId || o.customer_id) === params.id
          )
          setOrders(customerOrders)
        }
      })
      .catch(() => {})

    Promise.all([fetchCustomer, fetchOrders]).finally(() => setLoading(false))
  }, [params.id, activeSite])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading || !c) {
    return (
      <Page
        backAction={{ content: 'Clients', onAction: () => router.push('/customers') }}
        title="Chargement..."
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300" inlineAlign="center">
                <Spinner size="large" />
                <Text as="p" variant="bodySm" tone="subdued">Chargement du client...</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  const orderRows = orders.slice(0, 6).map(o => [
    o.id,
    o.date,
    String(o.items),
    money(o.total),
    o.payment?.label || '—',
    o.fulfill?.label || '—',
  ])

  return (
    <Page
      backAction={{ content: 'Clients', onAction: () => router.push('/customers') }}
      title={c.name}
      titleMetadata={c.tags.includes('VIP') ? <Badge tone="attention">VIP</Badge> : undefined}
      subtitle={c.email + ' · ' + c.city + ', ' + c.country}
      primaryAction={{ content: 'Enregistrer', loading: saving, onAction: handleSave }}
      secondaryActions={[
        { content: 'Envoyer e-mail', icon: EmailIcon },
        { content: 'Autres actions', icon: ChevronDownIcon },
      ]}
    >
      <Layout>
        {saved && (
          <Layout.Section>
            <Banner tone="success" onDismiss={() => setSaved(false)}>Modifications enregistrées ✓</Banner>
          </Layout.Section>
        )}
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <InlineGrid columns={4} gap="400">
                {[
                  { l: 'Total commandes', v: String(c.orders) },
                  { l: 'Total dépensé', v: money(c.spend) },
                  { l: 'Panier moyen', v: c.orders > 0 ? money(c.spend / c.orders) : '—' },
                  { l: 'Valeur vie prédite', v: money(c.spend * 1.8) },
                ].map((s, i) => (
                  <BlockStack key={i} gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">{s.l}</Text>
                    <Text as="p" variant="headingMd" fontWeight="bold">{s.v}</Text>
                  </BlockStack>
                ))}
              </InlineGrid>
            </Card>
            <Card padding="0">
              <Box padding="400" paddingBlockEnd="0">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Historique des commandes</Text>
                  <Button variant="plain">Toutes</Button>
                </InlineStack>
              </Box>
              <DataTable
                columnContentTypes={['text', 'text', 'numeric', 'numeric', 'text', 'text']}
                headings={['Commande', 'Date', 'Articles', 'Total', 'Paiement', 'Traitement']}
                rows={orderRows}
              />
            </Card>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Calendrier</Text>
                {[
                  ['il y a 2j', 'A laissé un avis 5★ sur Nomad Roll-Top Backpack'],
                  ['il y a 6j', 'Ouvert la campagne Newsletter hebdo n°14'],
                  ['il y a 14j', 'Première commande via Boutique en ligne'],
                ].map((a, i) => (
                  <div key={i}>
                    {i > 0 && <Divider />}
                    <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                      <BlockStack gap="050">
                        <Text as="p" variant="bodySm" tone="subdued">{a[0]}</Text>
                        <Text as="p" variant="bodySm">{a[1]}</Text>
                      </BlockStack>
                    </Box>
                  </div>
                ))}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Notes</Text>
                <TextField label="" labelHidden value="Préférence d'emballage soigné." autoComplete="off" multiline={3} />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Balises</Text>
                <InlineStack gap="200" wrap>
                  {c.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  <Button variant="plain" icon={PlusIcon} size="slim" />
                </InlineStack>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Coordonnées</Text>
                  <Button variant="plain" icon={EditIcon} size="slim" />
                </InlineStack>
                <Text as="p" variant="bodySm"><span style={{ fontFamily: 'monospace' }}>{c.email}</span></Text>
                <Divider />
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">ADRESSE PAR DÉFAUT</Text>
                  <Text as="p" variant="bodySm">{c.name + '\n12 rue des Ateliers\n' + c.city + ', ' + c.country}</Text>
                </BlockStack>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Marketing</Text>
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm">E-mail marketing</Text>
                  <Badge tone={c.subscribed ? 'success' : undefined}>{c.subscribed ? 'Abonné' : 'Non abonné'}</Badge>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm">SMS marketing</Text>
                  <Badge>Non abonné</Badge>
                </InlineStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
