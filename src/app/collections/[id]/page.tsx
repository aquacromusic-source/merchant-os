'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page, Layout, Card, BlockStack, InlineStack, TextField,
  Select, Banner, Text, Button, Badge, Divider, Tag,
  Checkbox, Modal, InlineGrid, Thumbnail, Icon, Box,
  RadioButton,
} from '@shopify/polaris'
import {
  ImageIcon, PlusIcon, DeleteIcon, SearchIcon,
  DragHandleIcon, ExternalIcon,
} from '@shopify/polaris-icons'
import { collections } from '@/lib/data'

const MOCK_PRODUCTS = [
  { id: 'P-1000', title: 'Pro Reel 900 Tote', image: '', price: 48, status: 'live' },
  { id: 'P-1001', title: 'Riviera Oversized Sweater', image: '', price: 125, status: 'live' },
  { id: 'P-1002', title: 'Field Notes Pocket Pad', image: '', price: 9.95, status: 'live' },
  { id: 'P-1003', title: 'Ember Ceramic Mug', image: '', price: 22.5, status: 'live' },
  { id: 'P-1004', title: 'Nomad Roll-Top Backpack', image: '', price: 189, status: 'live' },
  { id: 'P-1005', title: 'Halftone Linen Cap', image: '', price: 39, status: 'live' },
]

const CONDITIONS_OPTIONS = [
  { label: 'Titre du produit', value: 'title' },
  { label: 'Prix du produit', value: 'price' },
  { label: 'Type de produit', value: 'product_type' },
  { label: 'Fournisseur du produit', value: 'vendor' },
  { label: 'Balise du produit', value: 'tag' },
  { label: 'Stock disponible', value: 'stock' },
]

const OPERATORS: Record<string, { label: string; value: string }[]> = {
  title: [
    { label: 'est égal à', value: 'eq' },
    { label: 'n\'est pas égal à', value: 'neq' },
    { label: 'contient', value: 'contains' },
    { label: 'ne contient pas', value: 'not_contains' },
    { label: 'commence par', value: 'starts_with' },
    { label: 'se termine par', value: 'ends_with' },
  ],
  price: [
    { label: 'est supérieur à', value: 'gt' },
    { label: 'est inférieur à', value: 'lt' },
    { label: 'est égal à', value: 'eq' },
  ],
  default: [
    { label: 'est égal à', value: 'eq' },
    { label: 'n\'est pas égal à', value: 'neq' },
    { label: 'contient', value: 'contains' },
  ],
}

interface Condition {
  id: string
  field: string
  operator: string
  value: string
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const c = collections.find((x: any) => x.id === params.id) || (collections[0] as any)

  const [title, setTitle] = useState(c?.title || 'Nouvelle collection')
  const [description, setDescription] = useState(c?.description || '')
  const [collectionType, setCollectionType] = useState<'manual' | 'smart'>('manual')
  const [conditionsMatch, setConditionsMatch] = useState<'all' | 'any'>('all')
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', field: 'title', operator: 'contains', value: '' },
  ])
  const [collectionProducts, setCollectionProducts] = useState(MOCK_PRODUCTS.slice(0, 3))
  const [status, setStatus] = useState('active')
  const [channels, setChannels] = useState(['online-store', 'pos'])
  const [seoTitle, setSeoTitle] = useState(c?.title || '')
  const [seoDesc, setSeoDesc] = useState('')
  const [urlHandle, setUrlHandle] = useState((c?.title || 'nouvelle-collection').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [addProductModal, setAddProductModal] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [collectionImage, setCollectionImage] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addCondition = () => {
    setConditions(prev => [...prev, { id: Date.now().toString(), field: 'title', operator: 'contains', value: '' }])
  }

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id))
  }

  const toggleChannel = (ch: string) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(x => x !== ch) : [...prev, ch])
  }

  const CHANNEL_LIST = [
    { id: 'online-store', label: 'Boutique en ligne', badge: 'Actif' },
    { id: 'pos', label: 'Point de vente', badge: null },
    { id: 'meta', label: 'Meta (IG & FB)', badge: null },
    { id: 'google', label: 'Google & YouTube', badge: null },
    { id: 'tiktok', label: 'TikTok Shop', badge: null },
  ]

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    !collectionProducts.find(cp => cp.id === p.id) &&
    p.title.toLowerCase().includes(productSearch.toLowerCase())
  )

  const seoCharCount = seoTitle.length
  const seoDescCount = seoDesc.length

  return (
    <Page
      backAction={{ content: 'Collections', onAction: () => router.push('/collections') }}
      title={title || 'Nouvelle collection'}
      titleMetadata={<Badge>{collectionType === 'smart' ? 'Automatique' : 'Manuelle'}</Badge>}
      primaryAction={{ content: 'Enregistrer', loading: saving, onAction: handleSave }}
      secondaryActions={[
        { content: 'Dupliquer', onAction: () => {} },
        { content: 'Afficher', icon: ExternalIcon, onAction: () => {} },
        {
          content: 'Supprimer la collection', destructive: true,
          onAction: () => setDeleteModal(true),
        },
      ]}
    >
      {saved && <Banner tone="success" onDismiss={() => setSaved(false)}>Modifications enregistrées.</Banner>}

      <Layout>
        {/* Colonne principale */}
        <Layout.Section>
          <BlockStack gap="400">
            {/* Titre + Description */}
            <Card>
              <BlockStack gap="400">
                <TextField
                  label="Titre"
                  value={title}
                  onChange={setTitle}
                  autoComplete="off"
                  placeholder="Ex : Meilleures ventes d'été"
                />
                <div>
                  <Text as="p" variant="bodySm" fontWeight="medium">Description</Text>
                  <Box paddingBlockStart="100">
                    <div style={{ border: '1px solid #c4c4c4', borderRadius: 8, overflow: 'hidden' }}>
                      {/* Toolbar */}
                      <div style={{ display: 'flex', gap: 2, padding: '6px 10px', borderBottom: '1px solid #e5e5e5', background: '#fafafa', flexWrap: 'wrap' }}>
                        {['B', 'I', 'U'].map(f => (
                          <button key={f} style={{ width: 28, height: 28, border: '1px solid #e0e0e0', borderRadius: 4, background: 'white', cursor: 'pointer', fontWeight: f === 'B' ? 700 : 400, fontStyle: f === 'I' ? 'italic' : 'normal', textDecoration: f === 'U' ? 'underline' : 'none', fontSize: 13 }}>{f}</button>
                        ))}
                        <div style={{ width: 1, background: '#e0e0e0', margin: '2px 4px' }}/>
                        {['≡', '≡', '🔗'].map((f, i) => (
                          <button key={i} style={{ width: 28, height: 28, border: '1px solid #e0e0e0', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 13 }}>{f}</button>
                        ))}
                      </div>
                      <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Décrivez cette collection pour les clients…"
                        style={{ width: '100%', border: 'none', outline: 'none', padding: '10px 12px', fontFamily: 'inherit', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </div>
                  </Box>
                </div>
              </BlockStack>
            </Card>

            {/* Image de la collection */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Image de la collection</Text>
                {collectionImage ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={collectionImage} alt="Collection" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 8 }} />
                    <Button
                      icon={DeleteIcon}
                      variant="plain"
                      tone="critical"
                      onClick={() => setCollectionImage(null)}
                      accessibilityLabel="Supprimer l'image"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed #c4c4c4', borderRadius: 8, padding: 32, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) setCollectionImage(URL.createObjectURL(f))
                      }}
                    />
                    <Icon source={ImageIcon} />
                    <Text as="p" tone="subdued" variant="bodySm">Cliquez pour ajouter une image</Text>
                    <Text as="p" tone="subdued" variant="bodySm">JPG, PNG, GIF, SVG — max 20 Mo</Text>
                  </div>
                )}
              </BlockStack>
            </Card>

            {/* Type de collection */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Type de collection</Text>
                <BlockStack gap="200">
                  <RadioButton
                    label="Manuel"
                    helpText="Ajoutez des produits un par un à cette collection."
                    checked={collectionType === 'manual'}
                    id="manual"
                    name="collection-type"
                    onChange={() => setCollectionType('manual')}
                  />
                  <RadioButton
                    label="Automatique"
                    helpText="Les produits sont ajoutés automatiquement en fonction de conditions."
                    checked={collectionType === 'smart'}
                    id="smart"
                    name="collection-type"
                    onChange={() => setCollectionType('smart')}
                  />
                </BlockStack>

                {collectionType === 'smart' && (
                  <BlockStack gap="300">
                    <Divider />
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="p">Les produits doivent correspondre à</Text>
                      <Select
                        label=""
                        labelHidden
                        options={[
                          { label: 'toutes les conditions', value: 'all' },
                          { label: "l'une des conditions", value: 'any' },
                        ]}
                        value={conditionsMatch}
                        onChange={(v) => setConditionsMatch(v as 'all' | 'any')}
                      />
                    </InlineStack>
                    <BlockStack gap="200">
                      {conditions.map(cond => (
                        <InlineGrid key={cond.id} columns={{ xs: 1, sm: 4 }} gap="200">
                          <Select
                            label="" labelHidden
                            options={CONDITIONS_OPTIONS}
                            value={cond.field}
                            onChange={v => updateCondition(cond.id, 'field', v)}
                          />
                          <Select
                            label="" labelHidden
                            options={(OPERATORS[cond.field] || OPERATORS.default)}
                            value={cond.operator}
                            onChange={v => updateCondition(cond.id, 'operator', v)}
                          />
                          <TextField
                            label="" labelHidden
                            value={cond.value}
                            onChange={v => updateCondition(cond.id, 'value', v)}
                            autoComplete="off"
                            placeholder="Valeur…"
                          />
                          <Button icon={DeleteIcon} variant="plain" tone="critical" onClick={() => removeCondition(cond.id)} accessibilityLabel="Supprimer" />
                        </InlineGrid>
                      ))}
                    </BlockStack>
                    <Button icon={PlusIcon} variant="plain" onClick={addCondition}>Ajouter une condition</Button>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            {/* Produits (si manuel) */}
            {collectionType === 'manual' && (
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingSm" fontWeight="semibold">
                      Produits <Badge>{String(collectionProducts.length)}</Badge>
                    </Text>
                    <Button icon={PlusIcon} onClick={() => setAddProductModal(true)}>Parcourir</Button>
                  </InlineStack>
                  {collectionProducts.length > 0 ? (
                    <BlockStack gap="0">
                      {collectionProducts.map((p, i) => (
                        <div key={p.id}>
                          {i > 0 && <Divider />}
                          <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Icon source={DragHandleIcon} />
                            <div style={{ width: 40, height: 40, background: '#f1f1f1', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                              {p.image
                                ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon source={ImageIcon} /></div>
                              }
                            </div>
                            <div style={{ flex: 1 }}>
                              <Text as="p" fontWeight="medium">{p.title}</Text>
                              <Text as="p" variant="bodySm" tone="subdued">{p.price.toFixed(2)} €</Text>
                            </div>
                            <Button
                              icon={DeleteIcon}
                              variant="plain"
                              tone="critical"
                              onClick={() => setCollectionProducts(prev => prev.filter(x => x.id !== p.id))}
                              accessibilityLabel="Retirer"
                            />
                          </div>
                        </div>
                      ))}
                    </BlockStack>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <Text as="p" tone="subdued">Aucun produit dans cette collection.</Text>
                      <Box paddingBlockStart="200">
                        <Button onClick={() => setAddProductModal(true)}>Ajouter des produits</Button>
                      </Box>
                    </div>
                  )}
                </BlockStack>
              </Card>
            )}

            {/* SEO */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Aperçu sur les moteurs de recherche</Text>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: 16 }}>
                  <Text as="p" variant="bodySm" tone="subdued" fontWeight="medium">popcornposter.com/collections/{urlHandle}</Text>
                  <Text as="p" variant="bodyMd" fontWeight="semibold" tone="magic">{seoTitle || title}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">{seoDesc || description || 'Aucune description.'}</Text>
                </div>
                <TextField
                  label={`Titre de la page (${seoCharCount}/70)`}
                  value={seoTitle}
                  onChange={setSeoTitle}
                  autoComplete="off"
                  error={seoCharCount > 70 ? `${seoCharCount - 70} caractères de trop` : undefined}
                />
                <TextField
                  label={`Méta-description (${seoDescCount}/160)`}
                  value={seoDesc}
                  onChange={setSeoDesc}
                  multiline={3}
                  autoComplete="off"
                />
                <TextField
                  label="Ancre d'URL"
                  value={urlHandle}
                  onChange={setUrlHandle}
                  autoComplete="off"
                  prefix="collections/"
                />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Colonne droite */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            {/* Statut */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Statut</Text>
                <Select
                  label="" labelHidden
                  options={[
                    { label: 'Actif', value: 'active' },
                    { label: 'Brouillon', value: 'draft' },
                  ]}
                  value={status}
                  onChange={setStatus}
                />
                <Text as="p" variant="bodySm" tone="subdued">
                  {status === 'active'
                    ? 'La collection est visible sur les canaux sélectionnés.'
                    : 'La collection est masquée sur tous les canaux.'}
                </Text>
              </BlockStack>
            </Card>

            {/* Canaux de vente */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Canaux de vente et applications</Text>
                <BlockStack gap="200">
                  {CHANNEL_LIST.map(ch => (
                    <InlineStack key={ch.id} align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <Checkbox
                          label={ch.label}
                          checked={channels.includes(ch.id)}
                          onChange={() => toggleChannel(ch.id)}
                        />
                      </InlineStack>
                      {ch.badge && <Badge tone="success">{ch.badge}</Badge>}
                    </InlineStack>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>

      {/* Modal ajout produits */}
      <Modal
        open={addProductModal}
        onClose={() => setAddProductModal(false)}
        title="Ajouter des produits"
        primaryAction={{
          content: 'Fermer',
          onAction: () => setAddProductModal(false),
        }}
      >
        <Modal.Section>
          <TextField
            label="" labelHidden
            value={productSearch}
            onChange={setProductSearch}
            prefix={<Icon source={SearchIcon} />}
            placeholder="Rechercher un produit…"
            autoComplete="off"
          />
          <Box paddingBlockStart="300">
            <BlockStack gap="0">
              {filteredProducts.map((p, i) => (
                <div key={p.id}>
                  {i > 0 && <Divider />}
                  <div
                    style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                    onClick={() => {
                      setCollectionProducts(prev => [...prev, p])
                      setAddProductModal(false)
                    }}
                  >
                    <div style={{ width: 40, height: 40, background: '#f1f1f1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon source={ImageIcon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text as="p" fontWeight="medium">{p.title}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">{p.price.toFixed(2)} €</Text>
                    </div>
                    <Button size="slim">Ajouter</Button>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <Text as="p" tone="subdued">Aucun produit disponible.</Text>
              )}
            </BlockStack>
          </Box>
        </Modal.Section>
      </Modal>

      {/* Modal suppression */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Supprimer la collection ?"
        primaryAction={{ content: 'Supprimer', destructive: true, onAction: () => router.push('/collections') }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setDeleteModal(false) }]}
      >
        <Modal.Section>
          <Text as="p">La collection <strong>{title}</strong> sera supprimée définitivement. Cette action est irréversible.</Text>
        </Modal.Section>
      </Modal>
    </Page>
  )
}
