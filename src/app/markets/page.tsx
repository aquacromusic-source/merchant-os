'use client'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Page, Layout, Card, BlockStack, InlineStack, Text, Badge, Button,
  Divider, Box, TextField, Select, Modal, Spinner, EmptyState, Banner, Tag,
  Checkbox,
} from '@shopify/polaris'
import {
  PlusIcon, GlobeIcon, ChevronRightIcon, DiscountIcon, DeliveryIcon,
  DeleteIcon, EditIcon,
} from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Market {
  id: string
  site_id: string
  name: string
  code: string
  countries: string[]
  currency: string
  language: string
  domain: string | null
  tax_config: { tax_included: boolean; vat_rate: number }
  shipping_config: Record<string, any>
  payment_methods: string[]
  fulfillment_center: string | null
  active_products: string[]
  is_primary: boolean
  is_active: boolean
  created_at: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const FLAGS: Record<string, string> = {
  FR: '\u{1F1EB}\u{1F1F7}', DE: '\u{1F1E9}\u{1F1EA}', ES: '\u{1F1EA}\u{1F1F8}', IT: '\u{1F1EE}\u{1F1F9}', BE: '\u{1F1E7}\u{1F1EA}', NL: '\u{1F1F3}\u{1F1F1}',
  PT: '\u{1F1F5}\u{1F1F9}', AT: '\u{1F1E6}\u{1F1F9}', CH: '\u{1F1E8}\u{1F1ED}', GB: '\u{1F1EC}\u{1F1E7}', IE: '\u{1F1EE}\u{1F1EA}', LU: '\u{1F1F1}\u{1F1FA}',
  US: '\u{1F1FA}\u{1F1F8}', CA: '\u{1F1E8}\u{1F1E6}', AU: '\u{1F1E6}\u{1F1FA}', JP: '\u{1F1EF}\u{1F1F5}', KR: '\u{1F1F0}\u{1F1F7}', CN: '\u{1F1E8}\u{1F1F3}',
  SE: '\u{1F1F8}\u{1F1EA}', DK: '\u{1F1E9}\u{1F1F0}', FI: '\u{1F1EB}\u{1F1EE}', NO: '\u{1F1F3}\u{1F1F4}', PL: '\u{1F1F5}\u{1F1F1}', CZ: '\u{1F1E8}\u{1F1FF}',
  RO: '\u{1F1F7}\u{1F1F4}', HU: '\u{1F1ED}\u{1F1FA}', GR: '\u{1F1EC}\u{1F1F7}', HR: '\u{1F1ED}\u{1F1F7}', BG: '\u{1F1E7}\u{1F1EC}', SK: '\u{1F1F8}\u{1F1F0}',
  SI: '\u{1F1F8}\u{1F1EE}', LT: '\u{1F1F1}\u{1F1F9}', LV: '\u{1F1F1}\u{1F1FB}', EE: '\u{1F1EA}\u{1F1EA}', MT: '\u{1F1F2}\u{1F1F9}', CY: '\u{1F1E8}\u{1F1FE}',
  TR: '\u{1F1F9}\u{1F1F7}', IL: '\u{1F1EE}\u{1F1F1}', MX: '\u{1F1F2}\u{1F1FD}', TH: '\u{1F1F9}\u{1F1ED}', AE: '\u{1F1E6}\u{1F1EA}', BR: '\u{1F1E7}\u{1F1F7}',
}

const CURRENCY_OPTIONS = [
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'USD - Dollar US', value: 'USD' },
  { label: 'GBP - Livre sterling', value: 'GBP' },
  { label: 'CHF - Franc suisse', value: 'CHF' },
  { label: 'CAD - Dollar canadien', value: 'CAD' },
  { label: 'AUD - Dollar australien', value: 'AUD' },
  { label: 'JPY - Yen', value: 'JPY' },
  { label: 'SEK - Couronne suedoise', value: 'SEK' },
  { label: 'NOK - Couronne norvegienne', value: 'NOK' },
  { label: 'DKK - Couronne danoise', value: 'DKK' },
  { label: 'PLN - Zloty', value: 'PLN' },
  { label: 'CZK - Couronne tcheque', value: 'CZK' },
  { label: 'HUF - Forint', value: 'HUF' },
  { label: 'RON - Leu roumain', value: 'RON' },
  { label: 'BGN - Lev bulgare', value: 'BGN' },
  { label: 'HRK - Kuna croate', value: 'HRK' },
  { label: 'TRY - Livre turque', value: 'TRY' },
  { label: 'ILS - Shekel', value: 'ILS' },
  { label: 'BRL - Real bresilien', value: 'BRL' },
  { label: 'MXN - Peso mexicain', value: 'MXN' },
  { label: 'THB - Baht', value: 'THB' },
  { label: 'AED - Dirham', value: 'AED' },
  { label: 'SGD - Dollar singapourien', value: 'SGD' },
  { label: 'HKD - Dollar hong-kongais', value: 'HKD' },
  { label: 'KRW - Won', value: 'KRW' },
  { label: 'CNY - Yuan', value: 'CNY' },
  { label: 'INR - Roupie indienne', value: 'INR' },
  { label: 'RUB - Rouble', value: 'RUB' },
  { label: 'NZD - Dollar neo-zelandais', value: 'NZD' },
  { label: 'ZAR - Rand', value: 'ZAR' },
]

const LANGUAGE_OPTIONS = [
  { label: 'Francais', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Espanol', value: 'es' },
  { label: 'Italiano', value: 'it' },
  { label: 'Portugues', value: 'pt' },
  { label: 'Nederlands', value: 'nl' },
  { label: 'Svenska', value: 'sv' },
  { label: 'Dansk', value: 'da' },
  { label: 'Norsk', value: 'no' },
  { label: 'Polski', value: 'pl' },
  { label: 'Cestina', value: 'cs' },
  { label: 'Romana', value: 'ro' },
  { label: 'Magyar', value: 'hu' },
  { label: 'Ellinika', value: 'el' },
  { label: 'Hrvatski', value: 'hr' },
  { label: 'Bulgarski', value: 'bg' },
  { label: 'Turkce', value: 'tr' },
]

const PAYMENT_ALL = [
  { key: 'stripe', label: 'Stripe' },
  { key: 'paypal', label: 'PayPal' },
  { key: 'apple_pay', label: 'Apple Pay' },
  { key: 'google_pay', label: 'Google Pay' },
]

function flag(code: string) {
  return FLAGS[code] || code
}

// ---------------------------------------------------------------------------
// Blank form state
// ---------------------------------------------------------------------------
function blankForm() {
  return {
    name: '',
    code: '',
    countriesRaw: '',
    currency: 'EUR',
    language: 'fr',
    domain: '',
    is_primary: false,
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MarketsPage() {
  const { activeSite } = useSite()

  // Data
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Setup
  const [needsSetup, setNeedsSetup] = useState(false)
  const [migrationSql, setMigrationSql] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  // Modals
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form
  const [form, setForm] = useState(blankForm())

  // -----------------------------------------------------------------------
  // Fetch markets
  // -----------------------------------------------------------------------
  const fetchMarkets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/markets?site=${activeSite}`)
      const data = await res.json()
      if (res.ok && data.markets && data.markets.length > 0) {
        setMarkets(data.markets)
        setNeedsSetup(false)
        if (!selectedId || !data.markets.find((m: Market) => m.id === selectedId)) {
          setSelectedId(data.markets[0].id)
        }
      } else {
        // Check setup
        const setupRes = await fetch('/api/markets/setup')
        const setupData = await setupRes.json()
        if (!setupData.table_exists) {
          setNeedsSetup(true)
          setMigrationSql(setupData.migration_sql || null)
          setMarkets([])
        } else if (setupData.market_count === 0) {
          setNeedsSetup(true)
          setMigrationSql(null)
          setMarkets([])
        } else {
          setMarkets([])
        }
      }
    } catch {
      setNeedsSetup(true)
      setMarkets([])
    } finally {
      setLoading(false)
    }
  }, [activeSite, selectedId])

  useEffect(() => {
    fetchMarkets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSite])

  // -----------------------------------------------------------------------
  // Seed
  // -----------------------------------------------------------------------
  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/markets/setup', { method: 'POST' })
      if (res.ok) {
        await fetchMarkets()
      }
    } finally {
      setSeeding(false)
    }
  }

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  const handleCreate = async () => {
    setSaving(true)
    try {
      const countries = form.countriesRaw.split(',').map(c => c.trim().toUpperCase()).filter(Boolean)
      const res = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: activeSite,
          name: form.name,
          code: form.code,
          countries,
          currency: form.currency,
          language: form.language,
          domain: form.domain || null,
          is_primary: form.is_primary,
        }),
      })
      if (res.ok) {
        setCreateOpen(false)
        setForm(blankForm())
        await fetchMarkets()
      }
    } finally {
      setSaving(false)
    }
  }

  // -----------------------------------------------------------------------
  // Edit
  // -----------------------------------------------------------------------
  const openEdit = (m: Market) => {
    setForm({
      name: m.name,
      code: m.code,
      countriesRaw: (m.countries || []).join(', '),
      currency: m.currency,
      language: m.language,
      domain: m.domain || '',
      is_primary: m.is_primary,
    })
    setEditOpen(true)
  }

  const handleEdit = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const countries = form.countriesRaw.split(',').map(c => c.trim().toUpperCase()).filter(Boolean)
      const res = await fetch(`/api/markets/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          countries,
          currency: form.currency,
          language: form.language,
          domain: form.domain || null,
          is_primary: form.is_primary,
        }),
      })
      if (res.ok) {
        setEditOpen(false)
        await fetchMarkets()
      }
    } finally {
      setSaving(false)
    }
  }

  // -----------------------------------------------------------------------
  // Tax config update
  // -----------------------------------------------------------------------
  const updateTaxConfig = async (marketId: string, taxConfig: Market['tax_config']) => {
    await fetch(`/api/markets/${marketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tax_config: taxConfig }),
    })
    await fetchMarkets()
  }

  // -----------------------------------------------------------------------
  // Payment methods update
  // -----------------------------------------------------------------------
  const updatePaymentMethods = async (marketId: string, methods: string[]) => {
    await fetch(`/api/markets/${marketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_methods: methods }),
    })
    await fetchMarkets()
  }

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  const handleDelete = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/markets/${selectedId}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(false)
        setSelectedId(null)
        await fetchMarkets()
      }
    } finally {
      setSaving(false)
    }
  }

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------
  const market = markets.find(m => m.id === selectedId) || null

  const langLabel = (code: string) => LANGUAGE_OPTIONS.find(l => l.value === code)?.label || code

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------
  const renderFormFields = () => (
    <BlockStack gap="300">
      <TextField label="Nom" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} autoComplete="off" />
      <TextField label="Code" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} autoComplete="off" helpText="Ex: FR, EU, GB, US-CA" />
      <TextField label="Pays (codes ISO, separes par virgule)" value={form.countriesRaw} onChange={v => setForm(f => ({ ...f, countriesRaw: v }))} autoComplete="off" helpText="Ex: FR, DE, ES, IT" />
      <Select label="Devise" options={CURRENCY_OPTIONS} value={form.currency} onChange={v => setForm(f => ({ ...f, currency: v }))} />
      <Select label="Langue" options={LANGUAGE_OPTIONS} value={form.language} onChange={v => setForm(f => ({ ...f, language: v }))} />
      <TextField label="Domaine" value={form.domain} onChange={v => setForm(f => ({ ...f, domain: v }))} autoComplete="off" placeholder="ex: monsite.fr" />
      <Checkbox label="Marche principal" checked={form.is_primary} onChange={v => setForm(f => ({ ...f, is_primary: v }))} />
    </BlockStack>
  )

  // -----------------------------------------------------------------------
  // Loading
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <Page title="Marches">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400" inlineAlign="center">
                <Spinner size="large" />
                <Text as="p" variant="bodySm" tone="subdued">Chargement des marches...</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  // -----------------------------------------------------------------------
  // Setup required
  // -----------------------------------------------------------------------
  if (needsSetup) {
    return (
      <Page title="Marches" subtitle="Gerez vos marches internationaux et leurs parametres de localisation.">
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {migrationSql && (
                <Banner title="Table non trouvee" tone="warning">
                  <BlockStack gap="200">
                    <Text as="p">La table <code>markets</code> n&apos;existe pas encore. Executez le SQL ci-dessous dans Supabase Dashboard &gt; SQL Editor :</Text>
                    <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                      <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', margin: 0 }}>{migrationSql}</pre>
                    </Box>
                  </BlockStack>
                </Banner>
              )}
              {!migrationSql && (
                <Card>
                  <EmptyState
                    heading="Aucun marche configure"
                    image=""
                  >
                    <Text as="p">Initialisez les marches par defaut pour demarrer (France, Europe, Royaume-Uni, Etats-Unis &amp; Canada).</Text>
                  </EmptyState>
                </Card>
              )}
              <InlineStack align="center">
                <Button variant="primary" onClick={handleSeed} loading={seeding} disabled={!!migrationSql}>
                  Initialiser les marches par defaut
                </Button>
              </InlineStack>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  // -----------------------------------------------------------------------
  // Main
  // -----------------------------------------------------------------------
  return (
    <Page
      title="Marches"
      subtitle="Gerez vos marches internationaux et leurs parametres de localisation."
      primaryAction={{ content: 'Creer un marche', icon: PlusIcon, onAction: () => { setForm(blankForm()); setCreateOpen(true) } }}
    >
      <Layout>
        {/* ---- Sidebar ---- */}
        <Layout.Section variant="oneThird">
          <Card padding="0">
            <BlockStack gap="050">
              {markets.map((m, i) => (
                <div key={m.id}>
                  {i > 0 && <Divider />}
                  <Box padding="200">
                    <div
                      onClick={() => setSelectedId(m.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '8px 10px',
                        background: selectedId === m.id ? 'var(--p-color-bg-surface-selected, #f0f0f0)' : 'transparent',
                        borderRadius: 8,
                        transition: 'background 0.15s',
                      }}
                    >
                      <InlineStack gap="200" blockAlign="center" align="space-between">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="span" variant="bodySm">
                            {m.countries && m.countries.length > 0 ? flag(m.countries[0]) : flag(m.code)}
                          </Text>
                          <Text as="span" variant="bodySm" fontWeight="semibold">{m.name}</Text>
                        </InlineStack>
                        {m.is_primary
                          ? <Badge tone="attention">Principal</Badge>
                          : <Badge tone={m.is_active ? 'success' : undefined}>{m.is_active ? 'Actif' : 'Inactif'}</Badge>
                        }
                      </InlineStack>
                    </div>
                  </Box>
                </div>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* ---- Main area ---- */}
        <Layout.Section>
          {market ? (
            <BlockStack gap="400">
              {/* Overview */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <GlobeIcon width={16} height={16} />
                      <Text as="h2" variant="headingMd" fontWeight="semibold">{market.name}</Text>
                      {market.is_primary
                        ? <Badge tone="attention">Principal</Badge>
                        : <Badge tone={market.is_active ? 'success' : undefined}>{market.is_active ? 'Actif' : 'Inactif'}</Badge>
                      }
                    </InlineStack>
                    <Button icon={EditIcon} onClick={() => openEdit(market)}>Modifier</Button>
                  </InlineStack>
                  <Divider />
                  {[
                    ['Pays / regions', (market.countries || []).map(c => `${flag(c)} ${c}`).join(', ') || '—'],
                    ['Devise', market.currency],
                    ['Langue', langLabel(market.language)],
                    ['Domaine', market.domain || '—'],
                    ['Revenu (30j)', '—'],
                  ].map(([k, v], i) => (
                    <InlineStack key={i} align="space-between">
                      <Text as="p" variant="bodySm" tone="subdued">{k as string}</Text>
                      <Text as="p" variant="bodySm" fontWeight="semibold">{v as string}</Text>
                    </InlineStack>
                  ))}
                </BlockStack>
              </Card>

              {/* Tarification */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <DiscountIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Tarification</Text>
                  </InlineStack>
                  <Divider />
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">Taxes incluses</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {market.tax_config?.tax_included
                          ? 'Oui — TVA incluse dans le prix'
                          : 'Non — taxes affichees separement'}
                      </Text>
                    </BlockStack>
                    <Button
                      variant="plain"
                      onClick={() => updateTaxConfig(market.id, {
                        ...market.tax_config,
                        tax_included: !market.tax_config?.tax_included,
                      })}
                    >
                      {market.tax_config?.tax_included ? 'Desactiver' : 'Activer'}
                    </Button>
                  </InlineStack>
                  <Divider />
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">Taux de TVA</Text>
                      <Text as="p" variant="bodySm" tone="subdued">{market.tax_config?.vat_rate ?? 20}%</Text>
                    </BlockStack>
                    <Button variant="plain" icon={ChevronRightIcon} accessibilityLabel="Modifier TVA" />
                  </InlineStack>
                  <Divider />
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">Ajustement de prix</Text>
                      <Text as="p" variant="bodySm" tone="subdued">Aucun ajustement — prix catalogue applique</Text>
                    </BlockStack>
                    <Button variant="plain" icon={ChevronRightIcon} accessibilityLabel="Modifier ajustement" />
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Expedition */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <DeliveryIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Expedition</Text>
                  </InlineStack>
                  <Divider />
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">{"Profil d'expedition"}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Profil general &middot; {(market.countries || []).length} destination{(market.countries || []).length > 1 ? 's' : ''}
                      </Text>
                    </BlockStack>
                    <Button url="/shipping" variant="plain" icon={ChevronRightIcon} accessibilityLabel="Voir expedition" />
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Paiements */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Paiements</Text>
                  <Divider />
                  {PAYMENT_ALL.map(pm => {
                    const active = (market.payment_methods || []).includes(pm.key)
                    return (
                      <Checkbox
                        key={pm.key}
                        label={pm.label}
                        checked={active}
                        onChange={(checked) => {
                          const next = checked
                            ? [...(market.payment_methods || []), pm.key]
                            : (market.payment_methods || []).filter(k => k !== pm.key)
                          updatePaymentMethods(market.id, next)
                        }}
                      />
                    )
                  })}
                </BlockStack>
              </Card>

              {/* Catalogue */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Catalogue</Text>
                  <Divider />
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm" tone="subdued">Produits actifs pour ce marche</Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">{(market.active_products || []).length}</Text>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Danger zone */}
              {!market.is_primary && (
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingSm" fontWeight="semibold" tone="critical">Zone de danger</Text>
                    <Divider />
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="050">
                        <Text as="p" fontWeight="semibold">Supprimer ce marche</Text>
                        <Text as="p" variant="bodySm" tone="subdued">Cette action est irreversible. Toutes les donnees de ce marche seront perdues.</Text>
                      </BlockStack>
                      <Button variant="primary" tone="critical" icon={DeleteIcon} onClick={() => setDeleteConfirm(true)}>
                        Supprimer
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              )}
            </BlockStack>
          ) : (
            <Card>
              <EmptyState heading="Selectionnez un marche" image="">
                <Text as="p">Cliquez sur un marche dans la liste pour voir ses details.</Text>
              </EmptyState>
            </Card>
          )}
        </Layout.Section>
      </Layout>

      {/* ---- Create Modal ---- */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Creer un marche"
        primaryAction={{ content: 'Creer', onAction: handleCreate, loading: saving, disabled: !form.name || !form.code }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setCreateOpen(false) }]}
      >
        <Modal.Section>
          {renderFormFields()}
        </Modal.Section>
      </Modal>

      {/* ---- Edit Modal ---- */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Modifier le marche"
        primaryAction={{ content: 'Enregistrer', onAction: handleEdit, loading: saving, disabled: !form.name || !form.code }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setEditOpen(false) }]}
      >
        <Modal.Section>
          {renderFormFields()}
        </Modal.Section>
      </Modal>

      {/* ---- Delete Confirmation Modal ---- */}
      <Modal
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        title="Confirmer la suppression"
        primaryAction={{ content: 'Supprimer', onAction: handleDelete, loading: saving, destructive: true }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setDeleteConfirm(false) }]}
      >
        <Modal.Section>
          <Text as="p">
            Etes-vous sur de vouloir supprimer le marche <strong>{market?.name}</strong> ? Cette action est irreversible.
          </Text>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
