'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
  Tag,
  ProgressBar,
  TextField,
  Modal,
  Select,
  FormLayout,
  Banner,
  Spinner,
} from '@shopify/polaris'
import {
  ChevronLeftIcon,
  RefreshIcon,
  ArchiveIcon,
  EditIcon,
  ChevronDownIcon,
  DeliveryIcon,
  CreditCardIcon,
  LabelPrinterIcon,
  ClockIcon,
  NoteIcon,
  PersonIcon,
  ShieldCheckMarkIcon,
  ImageIcon,
  PlusIcon,
} from '@shopify/polaris-icons'
import { money } from '@/lib/utils'

function paymentBadge(tone: string, label: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention'> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }
  return <Badge tone={toneMap[tone] || undefined}>{label}</Badge>
}

interface TimelineEvent {
  t: string
  b: React.ReactNode
  tone?: 'success' | 'attention' | 'critical' | undefined
  isNote?: boolean
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [cust, setCust] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(data => {
        const found = data.order
        if (!found) {
          setOrder({ id: params.id, order_number: params.id, customer: 'Client inconnu', customer_email: '', total: 0, items: [], payment: { key: 'pending', label: 'En attente', tone: 'warn' }, fulfill: { key: 'unfulfilled', label: 'Non traitée', tone: 'warn' }, tags: [], risk: 'low', date: '', channel: '', location: '', ship: '' })
          setCust({ id: '', name: 'Client inconnu', email: '', orders: 0, city: '', country: '', tags: [] })
          return
        }
        setOrder(found)
        setCust({ id: '', name: found.customer || 'Client inconnu', email: found.customer_email || '', orders: 0, city: found.shipping_address?.city || '', country: found.shipping_address?.country || '', tags: [] })
      })
      .catch(() => {
        setOrder({ id: params.id, order_number: params.id, customer: 'Client inconnu', customer_email: '', total: 0, items: [], payment: { key: 'pending', label: 'En attente', tone: 'warn' }, fulfill: { key: 'unfulfilled', label: 'Non traitée', tone: 'warn' }, tags: [], risk: 'low', date: '', channel: '', location: '', ship: '' })
        setCust({ id: '', name: 'Client inconnu', email: '', orders: 0, city: '', country: '', tags: [] })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  // Status state
  const [fulfillStatus, setFulfillStatus] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<any>(null)

  useEffect(() => {
    if (order) {
      setFulfillStatus(order.fulfill || { key: 'unfulfilled', label: 'Non traitée', tone: 'warn' })
      setPaymentStatus(order.payment || { key: 'pending', label: 'En attente', tone: 'warn' })
      setRefundAmount(String(order.total || 0))
    }
  }, [order])

  // Timeline
  const [timelineNote, setTimelineNote] = useState('')
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    if (order) {
      setTimelineEvents([
        { t: order.date || '', b: <span key="t4"><span style={{ fontFamily: 'monospace' }}>Un paiement de {money(order.total || 0)} a été traité.</span></span>, tone: 'attention' },
      ])
    }
  }, [order])

  // Modal: Mark as shipped
  const [shipModalOpen, setShipModalOpen] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('GLS')

  // Modal: Create label
  const [labelModalOpen, setLabelModalOpen] = useState(false)
  const [labelCarrier, setLabelCarrier] = useState('GLS')
  const [labelFormat, setLabelFormat] = useState('A4')
  const [labelCreated, setLabelCreated] = useState(false)

  // Modal: Refund
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState('0')
  const [refundReason, setRefundReason] = useState('')
  const [refundDone, setRefundDone] = useState(false)

  // Modal: Edit address
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addrName, setAddrName] = useState('')
  const [addrLine1, setAddrLine1] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrZip, setAddrZip] = useState('')
  const [addrCountry, setAddrCountry] = useState('')

  useEffect(() => {
    if (order && cust) {
      setAddrName(cust.name || '')
      setAddrLine1(order.shipping_address?.street || order.shipping_address?.line1 || '')
      setAddrZip(order.shipping_address?.postal_code || order.shipping_address?.zip || '')
      setAddrCity(order.shipping_address?.city || cust.city || '')
      setAddrCountry(order.shipping_address?.country || cust.country || '')
    }
  }, [order, cust])

  const handlePublishNote = useCallback(() => {
    if (!timelineNote.trim()) return
    const note: TimelineEvent = {
      t: 'À l\'instant',
      b: <span key={`note-${Date.now()}`}><strong>Note interne :</strong> {timelineNote}</span>,
      tone: undefined,
      isNote: true,
    }
    setTimelineEvents(prev => [note, ...prev])
    setTimelineNote('')
  }, [timelineNote])

  const handleMarkShipped = useCallback(() => {
    setFulfillStatus({ key: 'fulfilled', label: 'Expédiée', tone: 'ok' })
    const event: TimelineEvent = {
      t: 'À l\'instant',
      b: <span key={`ship-${Date.now()}`}>Commande marquée comme expédiée via <strong>{carrier}</strong> — suivi : <span style={{ fontFamily: 'monospace' }}>{trackingNumber}</span></span>,
      tone: 'success',
    }
    setTimelineEvents(prev => [event, ...prev])
    setShipModalOpen(false)
    setTrackingNumber('')
  }, [carrier, trackingNumber])

  const handleCreateLabel = useCallback(() => {
    setLabelCreated(true)
    const event: TimelineEvent = {
      t: 'À l\'instant',
      b: <span key={`label-${Date.now()}`}>Étiquette d&apos;expédition créée — {labelCarrier} format {labelFormat}</span>,
      tone: 'attention',
    }
    setTimelineEvents(prev => [event, ...prev])
    setTimeout(() => setLabelModalOpen(false), 800)
  }, [labelCarrier, labelFormat])

  const handleRefund = useCallback(() => {
    setRefundDone(true)
    const event: TimelineEvent = {
      t: 'À l\'instant',
      b: <span key={`refund-${Date.now()}`}>Remboursement de <strong>{money(parseFloat(refundAmount))}</strong> initié. Motif : {refundReason}</span>,
      tone: 'critical',
    }
    setTimelineEvents(prev => [event, ...prev])
    setRefundModalOpen(false)
  }, [refundAmount, refundReason])

  const handleSaveAddress = useCallback(() => {
    const event: TimelineEvent = {
      t: 'À l\'instant',
      b: <span key={`addr-${Date.now()}`}>Adresse de livraison modifiée : {addrName}, {addrLine1}, {addrZip} {addrCity}, {addrCountry}</span>,
      tone: 'attention',
    }
    setTimelineEvents(prev => [event, ...prev])
    setAddressModalOpen(false)
  }, [addrName, addrLine1, addrCity, addrZip, addrCountry])

  if (loading || !order || !cust || !fulfillStatus || !paymentStatus) {
    return (
      <Page title="Chargement…">
        <Card>
          <Box padding="800">
            <InlineStack align="center"><Spinner size="large" /></InlineStack>
          </Box>
        </Card>
      </Page>
    )
  }

  const riskProgress = order.risk === 'high' ? 80 : order.risk === 'medium' ? 50 : 18
  const riskTone = order.risk === 'high' ? 'critical' : order.risk === 'medium' ? 'warning' : 'success'

  const fulfillBadgeTone: Record<string, 'success' | 'warning' | 'critical' | 'info' | 'attention' | undefined> = {
    ok: 'success', warn: 'warning', danger: 'critical', info: 'info', accent: 'attention',
  }

  return (
    <div style={{ paddingBottom: 80 }}>
    <Page
      backAction={{ content: 'Commandes', onAction: () => router.push('/orders') }}
      title={order.order_number || order.id}
      titleMetadata={
        <InlineStack gap="200">
          <Badge tone={fulfillBadgeTone[paymentStatus.tone] || undefined}>{paymentStatus.label}</Badge>
          <Badge tone={fulfillBadgeTone[fulfillStatus.tone] || undefined}>{fulfillStatus.label}</Badge>
        </InlineStack>
      }
      subtitle={`${order.date} · ${order.channel || 'Boutique en ligne'}`}
      secondaryActions={[
        { content: 'Rembourser', icon: RefreshIcon, onAction: () => setRefundModalOpen(true) },
        { content: 'Retourner', icon: ArchiveIcon },
        { content: 'Modifier', icon: EditIcon },
        { content: 'Autres actions', icon: ChevronDownIcon },
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {refundDone && (
              <Banner tone="warning" title="Remboursement en cours" onDismiss={() => setRefundDone(false)}>
                <p>Le remboursement a été initié et sera traité sous 3-5 jours ouvrés.</p>
              </Banner>
            )}

            {/* Fulfillment card */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <DeliveryIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">
                      Traitée ({order.items?.length || 0})
                    </Text>
                    <Badge>{order.location}</Badge>
                  </InlineStack>
                  <Button variant="plain" icon={ChevronDownIcon} />
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">
                  {order.date}{order.shipping_address?.carrier ? ` · Suivi ${order.shipping_address.carrier}` : ''}{order.shipping_address?.tracking ? <> · <span style={{ fontFamily: 'monospace' }}>{order.shipping_address.tracking}</span></> : ''}
                </Text>
                <Divider />
                {(order.items || []).map((li: any, i: number) => (
                  <InlineStack key={i} gap="300" blockAlign="start">
                    {li.image_url ? (
                      <img src={li.image_url} alt={li.title || li.name} style={{
                        width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0
                      }} />
                    ) : (
                      <div style={{
                        width: 48, height: 48, borderRadius: 8,
                        background: 'var(--p-color-bg-surface-secondary)',
                        border: '1px solid var(--p-color-border)',
                        display: 'grid', placeItems: 'center', flexShrink: 0
                      }}>
                        <ImageIcon width={18} height={18} />
                      </div>
                    )}
                    <BlockStack gap="050">
                      <Text as="p" variant="bodySm" fontWeight="semibold">{li.title || li.name}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {[li.size?.toUpperCase(), li.frame === 'black' ? 'Cadre noir' : li.frame === 'white' ? 'Cadre blanc' : li.frame === 'none' ? 'Sans cadre' : null].filter(Boolean).join(' · ') || li.variant || ''}
                      </Text>
                      {li.sku && (
                        <Text as="p" variant="bodySm" tone="subdued">
                          <span style={{ fontFamily: 'monospace' }}>{li.sku}</span>
                        </Text>
                      )}
                    </BlockStack>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {money(li.price)} × {li.qty || 1}
                    </Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      {money(li.price * (li.qty || 1))}
                    </Text>
                  </InlineStack>
                ))}
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm" tone="subdued">
                    {fulfillStatus.key === 'fulfilled' ? `Expédiée le ${order.date}` : `Commande du ${order.date}`}
                  </Text>
                  <InlineStack gap="200">
                    <Button icon={LabelPrinterIcon} size="slim" onClick={() => setLabelModalOpen(true)}>
                      Créer étiquette
                    </Button>
                    {fulfillStatus.key !== 'fulfilled' && (
                      <Button icon={DeliveryIcon} size="slim" variant="primary" onClick={() => setShipModalOpen(true)}>
                        Marquer comme expédiée
                      </Button>
                    )}
                  </InlineStack>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Payment */}
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <CreditCardIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Paiement</Text>
                  <Badge tone="success">Payée</Badge>
                </InlineStack>
                {[
                  [`Sous-total · ${order.items?.length || 0} articles`, money(order.total)],
                  [`Expédition · ${order.ship || 'Standard'}`, money(0)],
                  ['TVA (comprise)', money(order.total * 0.2)],
                ].map(([k, v], i) => (
                  <InlineStack key={i} align="space-between">
                    <Text as="p" variant="bodySm" tone="subdued">{k}</Text>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      <span style={{ fontFamily: 'monospace' }}>{v}</span>
                    </Text>
                  </InlineStack>
                ))}
                <Divider />
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd" fontWeight="bold">Total</Text>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    <span style={{ fontFamily: 'monospace' }}>{money(order.total)}</span>
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" tone="subdued">Payé par le client</Text>
                  <Text as="p" variant="bodySm">
                    <span style={{ fontFamily: 'monospace' }}>{money(order.total)}</span>
                  </Text>
                </InlineStack>
                <Button size="slim" icon={RefreshIcon} onClick={() => setRefundModalOpen(true)}>
                  Rembourser
                </Button>
              </BlockStack>
            </Card>

            {/* Timeline */}
            <Card>
              <BlockStack gap="400">
                <InlineStack gap="200" blockAlign="center">
                  <ClockIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Calendrier</Text>
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--p-color-bg-fill-tertiary)',
                    display: 'grid', placeItems: 'center', flexShrink: 0
                  }}>A</div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      label=""
                      labelHidden
                      placeholder="Laisser un commentaire…"
                      autoComplete="off"
                      value={timelineNote}
                      onChange={setTimelineNote}
                      multiline={2}
                    />
                  </div>
                  <Button variant="primary" size="slim" onClick={handlePublishNote}>
                    Publier
                  </Button>
                </InlineStack>
                <Divider />
                {timelineEvents.map((tl, i) => (
                  <div key={i}>
                    {i > 0 && <Divider />}
                    <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                      <BlockStack gap="050">
                        <InlineStack gap="100" blockAlign="center">
                          <Text as="p" variant="bodySm" tone="subdued">{tl.t}</Text>
                          {tl.tone && <Badge tone={tl.tone}>{tl.tone === 'success' ? '✓' : tl.tone === 'critical' ? '!' : '•'}</Badge>}
                          {tl.isNote && <Badge tone="info">Note interne</Badge>}
                        </InlineStack>
                        <Text as="p" variant="bodySm">{tl.b}</Text>
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
            {/* Notes */}
            <Card>
              <BlockStack gap="200">
                <InlineStack gap="200" blockAlign="center">
                  <NoteIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Notes</Text>
                </InlineStack>
                <Text as="p" variant="bodySm" tone="subdued">Aucune note du client</Text>
              </BlockStack>
            </Card>

            {/* Customer */}
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <PersonIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Client</Text>
                  </InlineStack>
                  <Button variant="plain" icon={ChevronDownIcon} />
                </InlineStack>
                <InlineStack gap="200" blockAlign="center">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--p-color-bg-fill-tertiary)',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                    fontSize: 12, fontWeight: 600
                  }}>
                    {cust.name.charAt(0)}
                  </div>
                  <BlockStack gap="050">
                    <Button variant="plain" onClick={() => router.push('/customers/' + cust.id)}>
                      {cust.name}
                    </Button>
                    <Text as="p" variant="bodySm" tone="subdued">{cust.orders} commande{cust.orders > 1 ? 's' : ''}</Text>
                  </BlockStack>
                </InlineStack>
                <Divider />
                <BlockStack gap="100">
                  <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">COORDONNÉES</Text>
                  <Text as="p" variant="bodySm">
                    <span style={{ fontFamily: 'monospace' }}>{cust.email}</span>
                  </Text>
                </BlockStack>
                <Divider />
                <BlockStack gap="100">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm" tone="subdued" fontWeight="semibold">ADRESSE DE LIVRAISON</Text>
                    <Button variant="plain" size="slim" icon={EditIcon} onClick={() => setAddressModalOpen(true)}>
                      Modifier
                    </Button>
                  </InlineStack>
                  <Text as="p" variant="bodySm">{cust.name}</Text>
                  <Text as="p" variant="bodySm">{addrLine1}</Text>
                  <Text as="p" variant="bodySm">{addrZip} {addrCity}, {addrCountry}</Text>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Risk */}
            <Card>
              <BlockStack gap="300">
                <InlineStack gap="200" blockAlign="center">
                  <ShieldCheckMarkIcon width={16} height={16} />
                  <Text as="h2" variant="headingSm" fontWeight="semibold">Risque de la commande</Text>
                </InlineStack>
                <ProgressBar progress={riskProgress} tone={riskTone === 'warning' ? 'critical' : (riskTone as 'success' | 'critical')} />
                <Text as="p" variant="bodySm" tone="subdued">
                  Le risque de rétrofacturation est {order.risk === 'high' ? 'élevé' : order.risk === 'medium' ? 'moyen' : 'faible'}.
                </Text>
              </BlockStack>
            </Card>

            {/* Tags */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Balises</Text>
                {order.tags.length > 0 ? (
                  <InlineStack gap="200" wrap>
                    {order.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
                  </InlineStack>
                ) : (
                  <Text as="p" variant="bodySm" tone="subdued">Aucune balise</Text>
                )}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      {/* Modal: Mark as shipped */}
      <Modal
        open={shipModalOpen}
        onClose={() => setShipModalOpen(false)}
        title="Marquer comme expédiée"
        primaryAction={{ content: 'Confirmer', onAction: handleMarkShipped }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setShipModalOpen(false) }]}
      >
        <Modal.Section>
          <FormLayout>
            <Select
              label="Transporteur"
              options={[
                { label: 'GLS', value: 'GLS' },
                { label: 'Colissimo', value: 'Colissimo' },
                { label: 'Mondial Relay', value: 'Mondial Relay' },
                { label: 'DHL', value: 'DHL' },
                { label: 'Chronopost', value: 'Chronopost' },
              ]}
              value={carrier}
              onChange={setCarrier}
            />
            <TextField
              label="Numéro de suivi"
              value={trackingNumber}
              onChange={setTrackingNumber}
              autoComplete="off"
              placeholder="Ex : 1Z999AA10123456784"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>

      {/* Modal: Create label */}
      <Modal
        open={labelModalOpen}
        onClose={() => { setLabelModalOpen(false); setLabelCreated(false) }}
        title="Créer une étiquette d'expédition"
        primaryAction={labelCreated ? undefined : { content: 'Créer l\'étiquette', onAction: handleCreateLabel }}
        secondaryActions={[{ content: 'Annuler', onAction: () => { setLabelModalOpen(false); setLabelCreated(false) } }]}
      >
        <Modal.Section>
          {labelCreated ? (
            <Banner tone="success" title="Étiquette créée !">
              <p>Votre étiquette {labelCarrier} format {labelFormat} a été générée.</p>
            </Banner>
          ) : (
            <FormLayout>
              <Select
                label="Transporteur"
                options={[
                  { label: 'GLS', value: 'GLS' },
                  { label: 'Colissimo', value: 'Colissimo' },
                  { label: 'Mondial Relay', value: 'Mondial Relay' },
                ]}
                value={labelCarrier}
                onChange={setLabelCarrier}
              />
              <Select
                label="Format d\'étiquette"
                options={[
                  { label: 'A4', value: 'A4' },
                  { label: 'A6 (thermique)', value: 'A6' },
                  { label: 'A5', value: 'A5' },
                ]}
                value={labelFormat}
                onChange={setLabelFormat}
              />
            </FormLayout>
          )}
        </Modal.Section>
      </Modal>

      {/* Modal: Refund */}
      <Modal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="Rembourser la commande"
        primaryAction={{ content: 'Rembourser', destructive: true, onAction: handleRefund }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setRefundModalOpen(false) }]}
      >
        <Modal.Section>
          <FormLayout>
            <Text as="p" variant="bodySm" tone="subdued">Articles de la commande :</Text>
            {(order.items || []).map((item: any, i: number) => (
              <InlineStack key={i} align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text as="p" variant="bodySm">{item.title || item.name}</Text>
                  {(item.size || item.frame) && (
                    <Text as="p" variant="bodySm" tone="subdued">
                      {[item.size?.toUpperCase(), item.frame === 'black' ? 'Cadre noir' : item.frame === 'white' ? 'Cadre blanc' : item.frame === 'none' ? 'Sans cadre' : null].filter(Boolean).join(' · ')}
                    </Text>
                  )}
                </BlockStack>
                <Text as="p" variant="bodySm" fontWeight="semibold">{money(item.price)}</Text>
              </InlineStack>
            ))}
            <Divider />
            <TextField
              label="Montant à rembourser (€)"
              type="number"
              value={refundAmount}
              onChange={setRefundAmount}
              autoComplete="off"
            />
            <TextField
              label="Motif du remboursement"
              value={refundReason}
              onChange={setRefundReason}
              autoComplete="off"
              placeholder="Produit défectueux, erreur de commande…"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>

      {/* Modal: Edit address */}
      <Modal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Modifier l'adresse de livraison"
        primaryAction={{ content: 'Enregistrer', onAction: handleSaveAddress }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setAddressModalOpen(false) }]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Nom complet"
              value={addrName}
              onChange={setAddrName}
              autoComplete="name"
            />
            <TextField
              label="Adresse"
              value={addrLine1}
              onChange={setAddrLine1}
              autoComplete="street-address"
            />
            <FormLayout.Group>
              <TextField
                label="Code postal"
                value={addrZip}
                onChange={setAddrZip}
                autoComplete="postal-code"
              />
              <TextField
                label="Ville"
                value={addrCity}
                onChange={setAddrCity}
                autoComplete="address-level2"
              />
            </FormLayout.Group>
            <TextField
              label="Pays"
              value={addrCountry}
              onChange={setAddrCountry}
              autoComplete="country"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </Page>
    </div>
  )
}
