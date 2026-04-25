'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Page,
  Card,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  DataTable,
  Modal,
  TextField,
  Select,
  Spinner,
  EmptyState,
  Banner,
} from '@shopify/polaris'
import { PlusIcon, EditIcon, DeleteIcon } from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

// Emoji flags by country code
const FLAGS: Record<string, string> = {
  FR: '🇫🇷', DE: '🇩🇪', ES: '🇪🇸', IT: '🇮🇹', BE: '🇧🇪', NL: '🇳🇱',
  PT: '🇵🇹', AT: '🇦🇹', CH: '🇨🇭', GB: '🇬🇧', IE: '🇮🇪', LU: '🇱🇺',
  US: '🇺🇸', CA: '🇨🇦', AU: '🇦🇺', JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳',
  SE: '🇸🇪', DK: '🇩🇰', FI: '🇫🇮', NO: '🇳🇴', PL: '🇵🇱', CZ: '🇨🇿',
  RO: '🇷🇴', HU: '🇭🇺', GR: '🇬🇷', HR: '🇭🇷', BG: '🇧🇬', SK: '🇸🇰',
  SI: '🇸🇮', LT: '🇱🇹', LV: '🇱🇻', EE: '🇪🇪', MT: '🇲🇹', CY: '🇨🇾',
  EU: '🇪🇺', WORLD: '🌍',
}

const CARRIERS = [
  { label: 'Colissimo', value: 'Colissimo' },
  { label: 'Chronopost', value: 'Chronopost' },
  { label: 'GLS', value: 'GLS' },
  { label: 'DHL', value: 'DHL' },
  { label: 'UPS', value: 'UPS' },
  { label: 'FedEx', value: 'FedEx' },
  { label: 'Mondial Relay', value: 'Mondial Relay' },
  { label: 'DPD', value: 'DPD' },
  { label: 'La Poste', value: 'La Poste' },
  { label: 'Autre', value: 'Autre' },
]

interface Rate {
  id: string
  name: string
  carrier: string
  price: number
  delivery_time: string
  min_order: number
  max_order: number | null
  is_active: boolean
}

interface Zone {
  id: string
  name: string
  countries: string[]
  is_active: boolean
  rates: Rate[]
}

export default function ShippingPage() {
  const { activeSite } = useSite()
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedZone, setExpandedZone] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRate, setEditingRate] = useState<Rate | null>(null)
  const [selectedZoneId, setSelectedZoneId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formCarrier, setFormCarrier] = useState('Colissimo')
  const [formPrice, setFormPrice] = useState('')
  const [formDelivery, setFormDelivery] = useState('')
  const [formMinOrder, setFormMinOrder] = useState('')
  const [formMaxOrder, setFormMaxOrder] = useState('')
  const [needsSetup, setNeedsSetup] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const fetchZones = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/shipping/zones?site=${activeSite}`)
      const data = await res.json()
      if (data.error && data.zones?.length === 0) {
        // Tables might not exist — check setup
        const setupRes = await fetch('/api/shipping/setup')
        const setupData = await setupRes.json()
        if (!setupData.tables_exist) {
          setNeedsSetup(true)
          setZones([])
          return
        }
      }
      setNeedsSetup(false)
      setZones(data.zones || [])
    } catch {
      setZones([])
    } finally {
      setLoading(false)
    }
  }, [activeSite])

  const seedData = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/shipping/setup', { method: 'POST' })
      if (res.ok) {
        setNeedsSetup(false)
        fetchZones()
      }
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => { fetchZones() }, [fetchZones])

  const resetForm = () => {
    setFormName('')
    setFormCarrier('Colissimo')
    setFormPrice('')
    setFormDelivery('')
    setFormMinOrder('')
    setFormMaxOrder('')
    setEditingRate(null)
    setSelectedZoneId('')
  }

  const openAddModal = (zoneId: string) => {
    resetForm()
    setSelectedZoneId(zoneId)
    setModalOpen(true)
  }

  const openEditModal = (rate: Rate, zoneId: string) => {
    setEditingRate(rate)
    setSelectedZoneId(zoneId)
    setFormName(rate.name)
    setFormCarrier(rate.carrier || 'Colissimo')
    setFormPrice(String(rate.price))
    setFormDelivery(rate.delivery_time || '')
    setFormMinOrder(rate.min_order ? String(rate.min_order) : '')
    setFormMaxOrder(rate.max_order ? String(rate.max_order) : '')
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        site: activeSite,
        zone_id: selectedZoneId,
        name: formName,
        carrier: formCarrier,
        price: parseFloat(formPrice) || 0,
        delivery_time: formDelivery,
        min_order: parseFloat(formMinOrder) || 0,
        max_order: formMaxOrder ? parseFloat(formMaxOrder) : null,
      }

      const url = editingRate
        ? `/api/shipping/rates/${editingRate.id}`
        : '/api/shipping/rates'
      const method = editingRate ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setToast(editingRate ? 'Tarif modifié' : 'Tarif ajouté')
        setTimeout(() => setToast(''), 3000)
        setModalOpen(false)
        resetForm()
        fetchZones()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (rateId: string) => {
    if (!confirm('Supprimer ce tarif ?')) return
    await fetch(`/api/shipping/rates/${rateId}`, { method: 'DELETE' })
    setToast('Tarif supprimé')
    setTimeout(() => setToast(''), 3000)
    fetchZones()
  }

  const getZoneFlag = (zone: Zone) => {
    if (!zone.countries || zone.countries.length === 0) return FLAGS.WORLD
    const first = zone.countries[0]
    return FLAGS[first] || FLAGS.WORLD
  }

  const getCountriesLabel = (countries: string[]) => {
    if (!countries || countries.length === 0) return ''
    if (countries.length <= 3) return countries.map(c => FLAGS[c] || c).join(' ')
    return `${countries.slice(0, 3).map(c => FLAGS[c] || c).join(' ')} +${countries.length - 3}`
  }

  if (loading) {
    return (
      <Page title="Expédition et livraison">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spinner size="large" />
        </div>
      </Page>
    )
  }

  return (
    <Page title="Expédition et livraison">
      <BlockStack gap="400">
        {toast && (
          <Banner tone="success" onDismiss={() => setToast('')}>
            <p>{toast}</p>
          </Banner>
        )}

        {needsSetup && (
          <Banner
            title="Tables non configurées"
            tone="warning"
            action={{ content: seeding ? 'Chargement...' : 'Insérer les données', onAction: seedData }}
          >
            <p>Les tables shipping_zones et shipping_rates doivent être créées dans Supabase. Exécutez le SQL via le Dashboard, puis cliquez sur le bouton pour insérer les tarifs.</p>
          </Banner>
        )}

        {!needsSetup && zones.length === 0 ? (
          <Card>
            <EmptyState
              heading="Aucune zone d'expédition"
              image=""
              action={{
                content: seeding ? 'Importation...' : 'Importer les données',
                onAction: seedData,
                loading: seeding,
              }}
            >
              <p>Importez les zones et tarifs d&apos;expédition réels (UPS, GLS) pour tous les sites.</p>
            </EmptyState>
          </Card>
        ) : (
          zones.map(zone => (
            <Card key={zone.id} padding="400">
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="300" blockAlign="center">
                    <span style={{ fontSize: 28 }}>{getZoneFlag(zone)}</span>
                    <BlockStack gap="100">
                      <Text as="h3" variant="headingMd">{zone.name}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {getCountriesLabel(zone.countries)}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone={zone.rates.length > 0 ? 'info' : undefined}>
                      {`${zone.rates.length} tarif${zone.rates.length !== 1 ? 's' : ''}`}
                    </Badge>
                    <Button
                      size="slim"
                      onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                    >
                      {expandedZone === zone.id ? 'Masquer' : 'Voir les tarifs'}
                    </Button>
                    <Button
                      size="slim"
                      icon={PlusIcon}
                      onClick={() => openAddModal(zone.id)}
                    >
                      Ajouter
                    </Button>
                  </InlineStack>
                </InlineStack>

                {expandedZone === zone.id && (
                  zone.rates.length > 0 ? (
                    <DataTable
                      columnContentTypes={['text', 'text', 'numeric', 'text', 'text']}
                      headings={['Nom', 'Transporteur', 'Prix', 'Délai', 'Actions']}
                      rows={zone.rates.map(rate => [
                        rate.name,
                        rate.carrier || '—',
                        `${rate.price.toFixed(2)} €`,
                        rate.delivery_time || '—',
                        <InlineStack gap="100" key={rate.id}>
                          <Button
                            size="slim"
                            icon={EditIcon}
                            onClick={() => openEditModal(rate, zone.id)}
                          />
                          <Button
                            size="slim"
                            icon={DeleteIcon}
                            tone="critical"
                            onClick={() => handleDelete(rate.id)}
                          />
                        </InlineStack>,
                      ])}
                    />
                  ) : (
                    <Text as="p" tone="subdued">Aucun tarif configuré pour cette zone.</Text>
                  )
                )}
              </BlockStack>
            </Card>
          ))
        )}
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); resetForm() }}
        title={editingRate ? 'Modifier le tarif' : 'Ajouter un tarif'}
        primaryAction={{
          content: editingRate ? 'Enregistrer' : 'Ajouter',
          onAction: handleSave,
          loading: saving,
          disabled: !formName || !formPrice,
        }}
        secondaryActions={[
          { content: 'Annuler', onAction: () => { setModalOpen(false); resetForm() } },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Nom du tarif"
              value={formName}
              onChange={setFormName}
              placeholder="Standard, Express, Point relais..."
              autoComplete="off"
            />
            <Select
              label="Transporteur"
              options={CARRIERS}
              value={formCarrier}
              onChange={setFormCarrier}
            />
            <TextField
              label="Prix (€)"
              type="number"
              value={formPrice}
              onChange={setFormPrice}
              placeholder="4.90"
              autoComplete="off"
            />
            <TextField
              label="Délai de livraison"
              value={formDelivery}
              onChange={setFormDelivery}
              placeholder="2-3 jours ouvrés"
              autoComplete="off"
            />
            <InlineStack gap="400">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Commande min (€)"
                  type="number"
                  value={formMinOrder}
                  onChange={setFormMinOrder}
                  placeholder="0"
                  autoComplete="off"
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Commande max (€)"
                  type="number"
                  value={formMaxOrder}
                  onChange={setFormMaxOrder}
                  placeholder="Illimité"
                  autoComplete="off"
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
