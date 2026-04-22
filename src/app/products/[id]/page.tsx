'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Badge,
  Button,
  ButtonGroup,
  InlineStack,
  BlockStack,
  Box,
  Text,
  Divider,
  Tag,
  Modal,
  Tabs,
  DataTable,
  Checkbox,
  Banner,
} from '@shopify/polaris'
import {
  DuplicateIcon,
  PlusIcon,
  ShareIcon,
  ViewIcon,
} from '@shopify/polaris-icons'
import { products } from '@/lib/data'

// ─── Mock extended product data ──────────────────────────────────────────────

interface VariantRow {
  id: string
  size: string
  frame: string
  sku: string
  price: number
  stock: number
  image?: string
}

const MOCK_VARIANTS: VariantRow[] = [
  { id: 'v1', size: 'A4', frame: 'Without Frame', sku: 'SH-001-A4-NOF', price: 11.95, stock: 18 },
  { id: 'v2', size: 'A4', frame: 'With Black Frame', sku: 'SH-001-A4-BLK', price: 34.95, stock: 19 },
  { id: 'v3', size: 'A4', frame: 'With White Frame', sku: 'SH-001-A4-WHT', price: 34.95, stock: 19 },
  { id: 'v4', size: 'A3', frame: 'Without Frame', sku: 'SH-001-A3-NOF', price: 19.95, stock: 18 },
  { id: 'v5', size: 'A3', frame: 'With Black Frame', sku: 'SH-001-A3-BLK', price: 44.95, stock: 18 },
  { id: 'v6', size: 'A3', frame: 'With White Frame', sku: 'SH-001-A3-WHT', price: 44.95, stock: 18 },
  { id: 'v7', size: 'A2', frame: 'Without Frame', sku: 'SH-001-A2-NOF', price: 24.95, stock: 16 },
  { id: 'v8', size: 'A2', frame: 'With Black Frame', sku: 'SH-001-A2-BLK', price: 54.95, stock: 17 },
  { id: 'v9', size: 'A2', frame: 'With White Frame', sku: 'SH-001-A2-WHT', price: 54.95, stock: 17 },
  { id: 'v10', size: 'A1', frame: 'Without Frame', sku: 'SH-001-A1-NOF', price: 34.95, stock: 14 },
  { id: 'v11', size: 'A1', frame: 'With Black Frame', sku: 'SH-001-A1-BLK', price: 64.95, stock: 14 },
  { id: 'v12', size: 'A1', frame: 'With White Frame', sku: 'SH-001-A1-WHT', price: 64.95, stock: 15 },
]

const SIZE_OPTIONS = ['A4', 'A3', 'A2', 'A1']
const FRAME_OPTIONS = ['Without Frame', 'With Black Frame', 'With White Frame']

const MOCK_IMAGES = [
  { id: 'img1', label: 'Hero', alt: 'Vue principale du poster', format: 'JPG', dims: '2400 × 3200', size: '1.2 MB', date: '12 avr. 2026' },
  { id: 'img2', label: 'Détail 1', alt: 'Détail texture', format: 'JPG', dims: '1600 × 1600', size: '820 KB', date: '12 avr. 2026' },
  { id: 'img3', label: 'Détail 2', alt: 'Vue encadrement noir', format: 'JPG', dims: '1600 × 2000', size: '940 KB', date: '12 avr. 2026' },
  { id: 'img4', label: 'Lifestyle 1', alt: 'Posé dans salon', format: 'JPG', dims: '2400 × 1600', size: '1.1 MB', date: '10 avr. 2026' },
  { id: 'img5', label: 'Lifestyle 2', alt: 'Mur galerie', format: 'JPG', dims: '2400 × 1600', size: '1.0 MB', date: '10 avr. 2026' },
  { id: 'img6', label: 'Packaging', alt: 'Emballage poster', format: 'JPG', dims: '1600 × 1600', size: '720 KB', date: '8 avr. 2026' },
]

const SALES_CHANNELS = ['Boutique en ligne', 'Point de vente', 'TikTok', 'Pinterest', 'Facebook']
const MARKETS = ['Spain', 'European Union', 'International', 'Pologne', 'Portugal', 'Allemagne', 'France', 'Italie', 'Norvège', 'Pays-Bas']
const COLLECTIONS_TAGS = ['Basketball Posters - Epic NB...', 'Best Selling Products', 'Newest Products', 'AVADA', 'Smart Products Filter Index', 'EasygiftAll Products']
const PRODUCT_TAGS = ['Wall Art', 'Poster', 'Michael Jordan', 'Basketball', 'Space Jordan', 'Comic']

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImagePlaceholder({ label, size = 'lg' }: { label: string; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 100 : 60
  return (
    <div style={{
      width: dim, height: dim,
      background: 'repeating-linear-gradient(45deg, #e8e8e8, #e8e8e8 6px, #f1f1f1 6px, #f1f1f1 12px)',
      border: '1px solid #d0d0d0',
      borderRadius: 8,
      display: 'grid',
      placeItems: 'center',
      fontSize: 10,
      color: '#888',
      fontFamily: 'monospace',
      flexShrink: 0,
    }}>
      <span style={{ textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}

function RichTextToolbar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '6px 10px',
      borderBottom: '1px solid #d0d0d0',
      background: '#f6f6f6',
      borderRadius: '8px 8px 0 0',
      flexWrap: 'wrap',
    }}>
      <button style={toolBtn}>✦ IA</button>
      <div style={sep} />
      <button style={toolBtn}>Paragraphe ▾</button>
      <div style={sep} />
      <button style={{ ...toolBtn, fontWeight: 700 }}>B</button>
      <button style={{ ...toolBtn, fontStyle: 'italic' }}>I</button>
      <button style={{ ...toolBtn, textDecoration: 'underline' }}>U</button>
      <button style={{ ...toolBtn }}>🎨</button>
      <div style={sep} />
      <button style={toolBtn}>≡</button>
      <button style={toolBtn}>≣</button>
      <button style={toolBtn}>🔗</button>
      <button style={toolBtn}>⊞</button>
      <button style={toolBtn}>🖼</button>
      <button style={{ ...toolBtn, marginLeft: 'auto' }}>&lt;/&gt;</button>
    </div>
  )
}
const toolBtn: React.CSSProperties = { background: 'none', border: '1px solid transparent', borderRadius: 4, padding: '2px 6px', fontSize: 12, cursor: 'pointer', color: '#333' }
const sep: React.CSSProperties = { width: 1, height: 16, background: '#d0d0d0', margin: '0 2px' }

function VariantDetailPanel({ variant, onClose }: { variant: VariantRow; onClose: () => void }) {
  const [vSize] = useState(variant.size)
  const [vFrame] = useState(variant.frame)
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 480, background: 'white',
      boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
      zIndex: 50, display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
            Produit &rsaquo; <strong>{variant.size} / {variant.frame}</strong>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{variant.size} / {variant.frame}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>✕</button>
      </div>
      <div style={{ padding: 20, flex: 1 }}>
        <BlockStack gap="400">
          {/* Image */}
          <Card>
            <Box padding="300">
              <InlineStack gap="300" align="center">
                <ImagePlaceholder label={variant.sku} size="lg" />
                <BlockStack gap="100">
                  <Text variant="bodySm" as="p" tone="subdued">Image de la variante</Text>
                  <Button size="slim">Modifier</Button>
                </BlockStack>
              </InlineStack>
            </Box>
          </Card>
          {/* Options */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Options</Text>
                <Select label="Size" options={SIZE_OPTIONS} value={vSize} onChange={() => {}} />
                <Select label="Frame" options={FRAME_OPTIONS} value={vFrame} onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
          {/* Prix */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Tarification</Text>
                <TextField label="Prix" value={variant.price.toFixed(2)} prefix="€" autoComplete="off" onChange={() => {}} />
                <TextField label="Prix avant réduction" value="" prefix="€" autoComplete="off" onChange={() => {}} />
                <TextField label="Prix unitaire" value="" prefix="€" autoComplete="off" onChange={() => {}} />
                <Checkbox label="Facturer la taxe sur ce produit" checked={true} onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
          {/* Stock */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Stock</Text>
                <DataTable
                  columnContentTypes={['text','numeric','numeric','numeric','numeric']}
                  headings={['Emplacement','Indisponible','Engagé','Disponible','En stock']}
                  rows={[
                    ['Valencia', '0', '1', `${Math.max(0,variant.stock-2)}`, `${variant.stock}`],
                    ['App gelato', '0', '0', '0', '0'],
                    ['Total', '0', '1', `${Math.max(0,variant.stock-2)}`, `${variant.stock}`],
                  ]}
                />
                <Button variant="plain">Afficher l&apos;historique des ajustements</Button>
              </BlockStack>
            </Box>
          </Card>
          {/* SKU */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">SKU & Code-barres</Text>
                <TextField label="SKU" value={variant.sku} autoComplete="off" onChange={() => {}} />
                <TextField label="Code-barres (ISBN, UPC, GTIN…)" value="" autoComplete="off" onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
          {/* Expédition */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Expédition</Text>
                <Select label="Emballage" options={['Emballage standard','Tube poster','Boîte rigide']} value="Tube poster" onChange={() => {}} />
                <TextField label="Poids (g)" value="250" autoComplete="off" onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
          {/* Méta */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Champs méta</Text>
                <TextField label="Google Age Group" value="" autoComplete="off" onChange={() => {}} />
                <TextField label="Condition" value="new" autoComplete="off" onChange={() => {}} />
                <TextField label="Gender" value="" autoComplete="off" onChange={() => {}} />
                <TextField label="MPN" value={variant.sku} autoComplete="off" onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
        </BlockStack>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary">Enregistrer</Button>
      </div>
    </div>
  )
}

// ─── Image Modal ─────────────────────────────────────────────────────────────

function ImageModal({ image, onClose }: { image: typeof MOCK_IMAGES[0]; onClose: () => void }) {
  return (
    <Modal
      open
      onClose={onClose}
      title={image.label}
      size="large"
      primaryAction={{ content: 'Terminé', onAction: onClose }}
      secondaryActions={[
        { content: 'Recadrage', onAction: () => {} },
        { content: 'Redimensionnement', onAction: () => {} },
      ]}
    >
      <Modal.Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, minHeight: 380 }}>
          {/* Preview */}
          <div style={{
            background: '#f1f1f1', borderRadius: 8, display: 'grid', placeItems: 'center',
            border: '1px solid #d0d0d0',
          }}>
            <ImagePlaceholder label={image.label} size="lg" />
          </div>
          {/* Infos */}
          <BlockStack gap="300">
            <TextField label="Nom" value={image.label + '.jpg'} autoComplete="off" onChange={() => {}} />
            <TextField label="Texte alternatif" value={image.alt} multiline={2} autoComplete="off" onChange={() => {}} />
            <Box paddingBlockStart="300">
              <BlockStack gap="100">
                <Text variant="headingSm" as="h3">Détails</Text>
                <Divider />
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Format</Text>image.format</InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Dimensions</Text>image.dims</InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Taille</Text>image.size</InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Ajoutée</Text>image.date</InlineStack>
              </BlockStack>
            </Box>
            <Box paddingBlockStart="200">
              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">Utilisé dans</Text>
                <Text as="p" variant="bodySm" tone="subdued">2 variantes</Text>
              </BlockStack>
            </Box>
            <Box paddingBlockStart="200">
              <InlineStack gap="200" wrap>
                <Button size="slim">Recadrage</Button>
                <Button size="slim">Redimensionnement</Button>
                <Button size="slim">Dessin</Button>
                <Button size="slim">Arrière-plan</Button>
                <Button size="slim">Générer ✦</Button>
              </InlineStack>
            </Box>
          </BlockStack>
        </div>
      </Modal.Section>
    </Modal>
  )
}

// ─── Grouped Variants Table ───────────────────────────────────────────────────

function VariantsTable({ onSelectVariant }: { onSelectVariant: (v: VariantRow) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ A4: false, A3: false, A2: false, A1: false })
  const grouped = SIZE_OPTIONS.map(size => ({
    size,
    variants: MOCK_VARIANTS.filter(v => v.size === size),
  }))

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
        padding: '8px 12px', background: '#f6f6f6',
        borderBottom: '1px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#555',
      }}>
        <div />
        <div>Variante ↕ <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#888' }}>Tout agrandir</button></div>
        <div style={{ textAlign: 'right' }}>Prix</div>
        <div style={{ textAlign: 'right' }}>Disponible</div>
      </div>
      {grouped.map(({ size, variants }) => {
        const totalStock = variants.reduce((a, v) => a + v.stock, 0)
        const minPrice = Math.min(...variants.map(v => v.price))
        const maxPrice = Math.max(...variants.map(v => v.price))
        const isExp = expanded[size]
        return (
          <div key={size}>
            {/* Group header */}
            <div
              style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
                padding: '10px 12px', borderBottom: '1px solid #e8e8e8',
                cursor: 'pointer', background: isExp ? '#f0f7ff' : 'white',
              }}
              onClick={() => setExpanded(e => ({ ...e, [size]: !e[size] }))}
            >
              <Checkbox label="" checked={false} onChange={() => {}} />
              <InlineStack gap="200" blockAlign="center">
                <ImagePlaceholder label={size} size="sm" />
                <BlockStack gap="0">
                  size
                  <Text as="span" variant="bodySm" tone="subdued">{variants.length} variantes {isExp ? '↕' : '↕'}</Text>
                </BlockStack>
              </InlineStack>
              <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>
                {minPrice === maxPrice ? `${minPrice.toFixed(2)} €` : `${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)} €`}
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{totalStock}</div>
            </div>
            {/* Variant rows */}
            {isExp && variants.map(v => (
              <div
                key={v.id}
                style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
                  padding: '8px 12px 8px 28px', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', background: '#fafafa',
                }}
                onClick={() => onSelectVariant(v)}
              >
                <Checkbox label="" checked={false} onChange={() => {}} />
                <InlineStack gap="200" blockAlign="center">
                  <ImagePlaceholder label={v.size[0]} size="sm" />
                  <BlockStack gap="0">
                    v.frame
                    v.sku
                  </BlockStack>
                </InlineStack>
                <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{v.price.toFixed(2)} €</div>
                <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{v.stock}</div>
              </div>
            ))}
          </div>
        )
      })}
      {/* Footer */}
      <div style={{ padding: '10px 14px', background: '#f6f6f6', borderTop: '1px solid #e0e0e0' }}>
        <Text as="p" variant="bodySm" tone="subdued">
          Stock total pour tous les emplacements : <strong>{MOCK_VARIANTS.reduce((a, v) => a + v.stock, 0)} disponibles</strong>
        </Text>
      </div>
    </div>
  )
}

// ─── SEO Preview ─────────────────────────────────────────────────────────────

function SEOPreview({ title, slug }: { title: string; slug: string }) {
  const [seoTitle, setSeoTitle] = useState(`${title} | Studio Nord & Co`)
  const [seoDesc, setSeoDesc] = useState(`Commandez votre ${title.toLowerCase()}. Impression musée sur papier haut grammage. Livraison rapide en France et Europe.`)
  const [urlSlug, setUrlSlug] = useState(slug)

  const titleLen = seoTitle.length
  const descLen = seoDesc.length
  const titleOver = titleLen > 70
  const descOver = descLen > 160

  return (
    <BlockStack gap="400">
      {/* Preview Google */}
      <div style={{
        background: '#f8f9fa', border: '1px solid #e0e0e0',
        borderRadius: 8, padding: 16, fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>
          Studio Nord &amp; Co &nbsp;·&nbsp;
          <span style={{ color: '#555' }}>studionord.co/products/{urlSlug}</span>
        </div>
        <div style={{ fontSize: 18, color: '#1a0dab', marginBottom: 4, cursor: 'pointer' }}>
          {seoTitle}
        </div>
        <div style={{ fontSize: 13, color: '#3c4043', lineHeight: 1.5 }}>{seoDesc}</div>
      </div>
      {/* Fields */}
      <TextField
        label="Titre de la page"
        value={seoTitle}
        onChange={setSeoTitle}
        autoComplete="off"
        suffix={<span style={{ color: titleOver ? '#d82c0d' : '#888', fontSize: 11 }}>{titleLen}/70</span>}
        error={titleOver ? `${titleLen - 70} caractères en trop` : undefined}
      />
      <TextField
        label="Méta-description"
        value={seoDesc}
        onChange={setSeoDesc}
        multiline={3}
        autoComplete="off"
        suffix={<span style={{ color: descOver ? '#d82c0d' : '#888', fontSize: 11 }}>{descLen}/160</span>}
        error={descOver ? `${descLen - 160} caractères en trop` : undefined}
      />
      <TextField
        label="Ancre d'URL"
        value={urlSlug}
        onChange={setUrlSlug}
        autoComplete="off"
        prefix="studionord.co/products/"
      />
      <Text as="p" variant="bodySm" tone="subdued">
        URL finale : studionord.co/products/{urlSlug}
      </Text>
    </BlockStack>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const p = products.find(x => x.id === params.id) || products[4]

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const [status, setStatus] = useState('live')
  const [selectedVariant, setSelectedVariant] = useState<VariantRow | null>(null)
  const [selectedImage, setSelectedImage] = useState<typeof MOCK_IMAGES[0] | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [titleVal, setTitleVal] = useState(p.title)
  const [description, setDescription] = useState(
    `${p.title} — édition limitée, impression musée. Chaque tirage est réalisé sur papier haut grammage et encadré en aluminium.\n\n(Aucune réimpression ne sera effectuée.)`
  )
  const [category, setCategory] = useState('Affiches dans Affiches, reproductions...')
  const [vendor, setVendor] = useState(p.vendor)
  const [productType, setProductType] = useState(p.type)
  const [themeTemplate, setThemeTemplate] = useState('produits-postersbase')
  const [channelTags, setChannelTags] = useState(SALES_CHANNELS)
  const [collectionTags, setCollectionTags] = useState(COLLECTIONS_TAGS)
  const [productTags, setProductTags] = useState(PRODUCT_TAGS)

  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const statusOptions = [
    { label: 'Actif', value: 'live' },
    { label: 'Brouillon', value: 'draft' },
    { label: 'Non répertorié', value: 'unlisted' },
  ]
  const statusDesc: Record<string, string> = {
    live: 'En vente sur les canaux de vente et les marchés sélectionnés',
    draft: 'Non visible sur les canaux de vente',
    unlisted: 'Accessible uniquement par lien direct',
  }
  const statusBadge: Record<string, 'success' | 'info' | 'attention'> = {
    live: 'success', draft: 'attention', unlisted: 'info',
  }

  const tabs = [
    { id: 'infos', content: 'Informations' },
    { id: 'seo', content: 'SEO' },
    { id: 'variants', content: 'Variantes' },
  ]

  const templateOptions = [
    { label: 'produits-postersbase', value: 'produits-postersbase' },
    { label: 'produit', value: 'produit' },
    { label: 'produit-simple', value: 'produit-simple' },
  ]

  return (
    <>
      <Page
        backAction={{ content: 'Produits', onAction: () => router.push('/products') }}
        title={p.title}
        titleMetadata={<Badge tone={statusBadge[status] ?? 'attention'}>{status === 'live' ? 'Actif' : status === 'draft' ? 'Brouillon' : 'Non répertorié'}</Badge>}
        primaryAction={{ content: 'Enregistrer', loading: saving, onAction: handleSave }}
        secondaryActions={[
          { content: 'Dupliquer', icon: DuplicateIcon, onAction: () => {} },
          { content: 'Afficher', icon: ViewIcon, onAction: () => {} },
          { content: 'Partager', icon: ShareIcon, onAction: () => {} },
        ]}
        actionGroups={[
          { title: 'Autres actions', actions: [
            { content: 'Archiver', onAction: () => {} },
            { content: 'Supprimer', onAction: () => {}, destructive: true },
          ]},
        ]}
        pagination={{
          hasPrevious: true, onPrevious: () => {},
          hasNext: true, onNext: () => {},
        }}
      >
        <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab} fitted={false}>
          <Layout>
            {saved && (
              <Layout.Section>
                <Banner tone="success" onDismiss={() => setSaved(false)}>Modifications enregistrées ✓</Banner>
              </Layout.Section>
            )}
            {/* ── MAIN COLUMN ─────────────────────────────────────────────── */}
            <Layout.Section>
              <BlockStack gap="400">

                {activeTab === 0 && (
                  <>
                    {/* Titre & Description */}
                    <Card>
                      <BlockStack gap="300">
                        <TextField
                          label="Titre"
                          value={titleVal}
                          onChange={setTitleVal}
                          autoComplete="off"
                        />
                        <div>
                          <Text as="p" variant="bodySm" fontWeight="medium">Description</Text>
                          <Box paddingBlockStart="100">
                            <div style={{ border: '1px solid #c4c4c4', borderRadius: 8, overflow: 'hidden' }}>
                              <RichTextToolbar />
                              <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                style={{
                                  width: '100%', minHeight: 140,
                                  padding: '12px 14px', fontSize: 13,
                                  border: 'none', outline: 'none',
                                  fontFamily: 'inherit', resize: 'vertical',
                                  background: 'white', lineHeight: 1.6,
                                }}
                              />
                            </div>
                          </Box>
                        </div>
                      </BlockStack>
                    </Card>

                    {/* Médias */}
                    <Card>
                      <BlockStack gap="300">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="headingMd" as="h2">Supports multimédias</Text>
                          <Button icon={PlusIcon} size="slim">Téléverser</Button>
                        </InlineStack>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gap: 8,
                        }}>
                          {MOCK_IMAGES.map((img, idx) => (
                            <div
                              key={img.id}
                              style={{
                                position: 'relative', cursor: 'pointer',
                                borderRadius: 8, overflow: 'hidden',
                                border: '1px solid #d0d0d0',
                              }}
                              onClick={() => setSelectedImage(img)}
                            >
                              <div style={{
                                background: 'repeating-linear-gradient(45deg,#e8e8e8,#e8e8e8 6px,#f1f1f1 6px,#f1f1f1 12px)',
                                height: 80, display: 'grid', placeItems: 'center',
                                fontSize: 10, color: '#888',
                              }}>
                                {idx === 0 ? '🏆' : `📷`} {img.label}
                              </div>
                              {idx === 0 && (
                                <div style={{
                                  position: 'absolute', top: 4, left: 4,
                                  background: 'rgba(0,0,0,0.6)', color: 'white',
                                  fontSize: 9, padding: '1px 4px', borderRadius: 3,
                                }}>Principal</div>
                              )}
                            </div>
                          ))}
                          {/* Add button */}
                          <div style={{
                            height: 80, border: '1.5px dashed #c4c4c4', borderRadius: 8,
                            display: 'grid', placeItems: 'center', cursor: 'pointer',
                            color: '#888',
                          }}>
                            <span style={{ fontSize: 20 }}>+</span>
                          </div>
                        </div>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Cliquez sur une image pour modifier le texte alternatif, recadrer ou générer une variante.
                        </Text>
                      </BlockStack>
                    </Card>

                    {/* Catégorie */}
                    <Card>
                      <BlockStack gap="200">
                        <Text variant="headingMd" as="h2">Catégorie</Text>
                        <TextField
                          label="Catégorie"
                          labelHidden
                          value={category}
                          onChange={setCategory}
                          autoComplete="off"
                          placeholder="Rechercher une catégorie…"
                          helpText="La catégorie détermine les champs de méta et les taxonomies produit."
                        />
                      </BlockStack>
                    </Card>

                    {/* Options de variantes */}
                    <Card>
                      <BlockStack gap="400">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="headingMd" as="h2">Variantes</Text>
                          <Button size="slim" icon={PlusIcon}>Ajouter une option</Button>
                        </InlineStack>
                        {/* Options pills */}
                        <BlockStack gap="300">
                          {[
                            { label: 'Size', options: SIZE_OPTIONS },
                            { label: 'Frame', options: FRAME_OPTIONS },
                          ].map(opt => (
                            <div key={opt.label}>
                              <Text as="p" variant="bodySm" fontWeight="medium">{opt.label}</Text>
                              <Box paddingBlockStart="100">
                                <InlineStack gap="200" wrap>
                                  {opt.options.map(o => (
                                    <div key={o} style={{
                                      padding: '4px 12px', border: '1px solid #c4c4c4',
                                      borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                                      background: 'white', cursor: 'pointer',
                                    }}>{o}</div>
                                  ))}
                                  <Button variant="plain" size="slim" icon={PlusIcon}>Ajouter une autre option</Button>
                                </InlineStack>
                              </Box>
                            </div>
                          ))}
                        </BlockStack>
                        <Divider />
                        {/* Table variantes */}
                        <VariantsTable onSelectVariant={setSelectedVariant} />
                      </BlockStack>
                    </Card>

                    {/* Options d'achat */}
                    <Card>
                      <BlockStack gap="200">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="headingMd" as="h2">Options d&apos;achat</Text>
                        </InlineStack>
                        <details style={{ cursor: 'pointer' }}>
                          <summary style={{ fontSize: 13, fontWeight: 500, listStyle: 'none', display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #e0e0e0' }}>
                            <span>Abonnements</span>
                            <span style={{ color: '#888' }}>▼</span>
                          </summary>
                          <div style={{ padding: '12px 0', color: '#666', fontSize: 12.5 }}>
                            Aucun abonnement actif pour ce produit. Installez SubscribeKit pour activer les options d&apos;abonnement récurrent.
                          </div>
                        </details>
                      </BlockStack>
                    </Card>

                    {/* Champs méta */}
                    <Card>
                      <BlockStack gap="300">
                        <InlineStack align="space-between">
                          <Text variant="headingMd" as="h2">Champs méta</Text>
                          <Button variant="plain">Tout voir</Button>
                        </InlineStack>
                        <TextField label="Smind size chart" value="" autoComplete="off" onChange={() => {}} placeholder="Ex: S=36, M=38…" />
                        <TextField label="Google Product Category" value="Home & Garden > Decor > Posters & Prints" autoComplete="off" onChange={() => {}} />
                        <TextField label="Matière principale" value="Papier 300g/m²" autoComplete="off" onChange={() => {}} />
                      </BlockStack>
                    </Card>
                  </>
                )}

                {activeTab === 1 && (
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingMd" as="h2">Aperçu sur les moteurs de recherche</Text>
                      <SEOPreview title={p.title} slug={slug} />
                    </BlockStack>
                  </Card>
                )}

                {activeTab === 2 && (
                  <Card>
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h2">Toutes les variantes</Text>
                        <Button size="slim" icon={PlusIcon}>Ajouter une variante</Button>
                      </InlineStack>
                      <VariantsTable onSelectVariant={setSelectedVariant} />
                    </BlockStack>
                  </Card>
                )}

              </BlockStack>
            </Layout.Section>

            {/* ── RIGHT RAIL ──────────────────────────────────────────────── */}
            <Layout.Section variant="oneThird">
              <BlockStack gap="400">

                {/* Statut */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Statut</Text>
                    <Select
                      label="Statut"
                      labelHidden
                      options={statusOptions}
                      value={status}
                      onChange={setStatus}
                    />
                    <Text as="p" variant="bodySm" tone="subdued">{statusDesc[status]}</Text>
                  </BlockStack>
                </Card>

                {/* Publication */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Publication</Text>
                    {/* Facebook & Instagram */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e8e8' }}>
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ width: 18, height: 18, background: '#1877F2', borderRadius: 3, display: 'grid', placeItems: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>f</div>
                        <Text as="span" variant="bodySm">Facebook &amp; Instagram</Text>
                      </InlineStack>
                      <button style={{ background: '#00a375', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>Actif</button>
                    </div>
                    {/* Canaux */}
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" fontWeight="medium">Canaux de vente</Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {channelTags.map(ch => (
                          <Tag key={ch} onRemove={() => setChannelTags(t => t.filter(x => x !== ch))}>
                            {ch}
                          </Tag>
                        ))}
                      </div>
                    </BlockStack>
                  </BlockStack>
                </Card>

                {/* Catalogues par région */}
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">Catalogues par région</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {MARKETS.slice(0, 5).map(m => (
                        <Tag key={m}>{m}</Tag>
                      ))}
                    </div>
                    <Button variant="plain" size="slim">{`+${MARKETS.length - 5} autres`}</Button>
                  </BlockStack>
                </Card>

                {/* Ventes 90 jours */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Ventes des 90 derniers jours</Text>
                    <BlockStack gap="100">
                      <InlineStack align="space-between">
                        <InlineStack gap="100"><Text as="span" variant="bodySm">•</Text><Text as="span" variant="bodySm">Unités vendues</Text></InlineStack>
                        <Text as="span" variant="bodySm" fontWeight="semibold">3</Text>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <InlineStack gap="100"><Text as="span" variant="bodySm">•</Text><Text as="span" variant="bodySm">Acheteurs</Text></InlineStack>
                        <Text as="span" variant="bodySm" fontWeight="semibold">2</Text>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <InlineStack gap="100"><Text as="span" variant="bodySm">•</Text><Text as="span" variant="bodySm">Ventes nettes</Text></InlineStack>
                        <Text as="span" variant="bodySm" fontWeight="semibold">63,10 €</Text>
                      </InlineStack>
                    </BlockStack>
                    <Button variant="plain" size="slim">Afficher les détails</Button>
                  </BlockStack>
                </Card>

                {/* Organisation */}
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Organisation du produit</Text>
                    <TextField
                      label="Type de produit"
                      value={productType}
                      onChange={setProductType}
                      autoComplete="off"
                      placeholder="Ex: Poster"
                    />
                    <TextField
                      label="Fournisseur"
                      value={vendor}
                      onChange={setVendor}
                      autoComplete="off"
                      placeholder="Ex: Posters Base"
                    />
                    {/* Collections */}
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" fontWeight="medium">Collections</Text>
                      <div style={{ border: '1px solid #c4c4c4', borderRadius: 7, padding: '6px 10px', background: 'white', minHeight: 38 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {collectionTags.map(c => (
                            <Tag key={c} onRemove={() => setCollectionTags(t => t.filter(x => x !== c))}>
                              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{c}</span>
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </BlockStack>
                    {/* Tags */}
                    <BlockStack gap="100">
                      <Text as="p" variant="bodySm" fontWeight="medium">Balises</Text>
                      <div style={{ border: '1px solid #c4c4c4', borderRadius: 7, padding: '6px 10px', background: 'white', minHeight: 38 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {productTags.map(t => (
                            <Tag key={t} onRemove={() => setProductTags(tags => tags.filter(x => x !== t))}>
                              {t}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </BlockStack>
                    {/* Modèle de thème */}
                    <Select
                      label="Modèle de thème"
                      options={templateOptions}
                      value={themeTemplate}
                      onChange={setThemeTemplate}
                    />
                  </BlockStack>
                </Card>

              </BlockStack>
            </Layout.Section>
          </Layout>
        </Tabs>
      </Page>

      {/* ── Modals & Panels ────────────────────────────────────────────────── */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      {selectedVariant && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 49 }}
            onClick={() => setSelectedVariant(null)}
          />
          <VariantDetailPanel variant={selectedVariant} onClose={() => setSelectedVariant(null)} />
        </>
      )}
    </>
  )
}
