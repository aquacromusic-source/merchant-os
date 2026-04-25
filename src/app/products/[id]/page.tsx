'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Box,
  Text,
  Divider,
  Tag,
  Modal,
  Tabs,
  Checkbox,
  Banner,
} from '@shopify/polaris'
import {
  DuplicateIcon,
  PlusIcon,
  ShareIcon,
  ViewIcon,
} from '@shopify/polaris-icons'
import { collections as allCollections } from '@/lib/data'
import { useSite } from '@/contexts/SiteContext'

// ─── Types ──────────────────────────────────────────────────────────────────

interface VariantRow {
  id: string
  option1_name: string | null
  option1_value: string | null
  option2_name: string | null
  option2_value: string | null
  sku: string
  price: number
  stock: number
  compare_at_price?: number | null
  barcode?: string | null
  weight_grams?: number | null
  image_url?: string | null
  position?: number
}

const MOCK_IMAGES: { id: string; label: string; alt: string; format: string; dims: string; size: string; date: string; url: string }[] = [
  { id: 'img1', label: 'Hero', alt: 'Vue principale du poster', format: 'JPG', dims: '2400 × 3200', size: '1.2 MB', date: '12 avr. 2026', url: '' },
  { id: 'img2', label: 'Détail 1', alt: 'Détail texture', format: 'JPG', dims: '1600 × 1600', size: '820 KB', date: '12 avr. 2026', url: '' },
  { id: 'img3', label: 'Détail 2', alt: 'Vue encadrement noir', format: 'JPG', dims: '1600 × 2000', size: '940 KB', date: '12 avr. 2026', url: '' },
  { id: 'img4', label: 'Lifestyle 1', alt: 'Posé dans salon', format: 'JPG', dims: '2400 × 1600', size: '1.1 MB', date: '10 avr. 2026', url: '' },
  { id: 'img5', label: 'Lifestyle 2', alt: 'Mur galerie', format: 'JPG', dims: '2400 × 1600', size: '1.0 MB', date: '10 avr. 2026', url: '' },
  { id: 'img6', label: 'Packaging', alt: 'Emballage poster', format: 'JPG', dims: '1600 × 1600', size: '720 KB', date: '8 avr. 2026', url: '' },
]

const DEFAULT_CHANNELS = ['Boutique en ligne', 'Point de vente', 'TikTok', 'Pinterest', 'Facebook']
const MARKETS = ['Spain', 'European Union', 'International', 'Pologne', 'Portugal', 'Allemagne', 'France', 'Italie', 'Norvège', 'Pays-Bas']

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

function VariantDetailPanel({ variant, onClose, onSave }: { variant: VariantRow; onClose: () => void; onSave: (updated: VariantRow) => void }) {
  const [vOpt1] = useState(variant.option1_value || '')
  const [vOpt2] = useState(variant.option2_value || '')
  const [vPrice, setVPrice] = useState(variant.price.toFixed(2))
  const [vCompare, setVCompare] = useState(variant.compare_at_price ? String(variant.compare_at_price) : '')
  const [vStock, setVStock] = useState(String(variant.stock))
  const [vSku, setVSku] = useState(variant.sku || '')
  const [vBarcode, setVBarcode] = useState(variant.barcode || '')
  const [vWeight, setVWeight] = useState(variant.weight_grams ? String(variant.weight_grams) : '')

  const variantLabel = [variant.option1_value, variant.option2_value].filter(Boolean).join(' / ')

  const handleSaveVariant = () => {
    onSave({
      ...variant,
      price: parseFloat(vPrice) || 0,
      compare_at_price: vCompare ? parseFloat(vCompare) : null,
      stock: parseInt(vStock) || 0,
      sku: vSku,
      barcode: vBarcode,
      weight_grams: vWeight ? parseInt(vWeight) : null,
    })
    onClose()
  }

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
            Produit &rsaquo; <strong>{variantLabel}</strong>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{variantLabel}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>✕</button>
      </div>
      <div style={{ padding: 20, flex: 1 }}>
        <BlockStack gap="400">
          {/* Image */}
          <Card>
            <Box padding="300">
              <InlineStack gap="300" align="center">
                <ImagePlaceholder label={vSku || variantLabel} size="lg" />
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
                {variant.option1_name && (
                  <TextField label={variant.option1_name} value={vOpt1} autoComplete="off" disabled onChange={() => {}} />
                )}
                {variant.option2_name && (
                  <TextField label={variant.option2_name} value={vOpt2} autoComplete="off" disabled onChange={() => {}} />
                )}
              </BlockStack>
            </Box>
          </Card>
          {/* Prix */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Tarification</Text>
                <TextField label="Prix" value={vPrice} prefix="€" autoComplete="off" type="number" onChange={setVPrice} />
                <TextField label="Prix avant réduction" value={vCompare} prefix="€" autoComplete="off" type="number" onChange={setVCompare} />
                <Checkbox label="Facturer la taxe sur ce produit" checked={true} onChange={() => {}} />
              </BlockStack>
            </Box>
          </Card>
          {/* Stock */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Stock</Text>
                <TextField label="En stock" value={vStock} autoComplete="off" type="number" onChange={setVStock} />
              </BlockStack>
            </Box>
          </Card>
          {/* SKU */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">SKU & Code-barres</Text>
                <TextField label="SKU" value={vSku} autoComplete="off" onChange={setVSku} />
                <TextField label="Code-barres (ISBN, UPC, GTIN…)" value={vBarcode} autoComplete="off" onChange={setVBarcode} />
              </BlockStack>
            </Box>
          </Card>
          {/* Expédition */}
          <Card>
            <Box padding="300">
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Expédition</Text>
                <TextField label="Poids (g)" value={vWeight} autoComplete="off" type="number" onChange={setVWeight} />
              </BlockStack>
            </Box>
          </Card>
        </BlockStack>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={handleSaveVariant}>Enregistrer</Button>
      </div>
    </div>
  )
}

// ─── Image Modal ─────────────────────────────────────────────────────────────

function ImageModal({ image, onClose, onUpdate }: { image: typeof MOCK_IMAGES[0]; onClose: () => void; onUpdate: (updated: typeof MOCK_IMAGES[0]) => void }) {
  const [label, setLabel] = useState(image.label)
  const [alt, setAlt] = useState(image.alt)

  const handleDone = () => {
    onUpdate({ ...image, label, alt })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={image.label}
      size="large"
      primaryAction={{ content: 'Terminé', onAction: handleDone }}
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
            {image.url ? (
              <img src={image.url} alt={alt || label} style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain' }} />
            ) : (
              <ImagePlaceholder label={label} size="lg" />
            )}
          </div>
          {/* Infos */}
          <BlockStack gap="300">
            <TextField label="Nom" value={label} autoComplete="off" onChange={setLabel} />
            <TextField label="Texte alternatif" value={alt} multiline={2} autoComplete="off" onChange={setAlt} />
            <Box paddingBlockStart="300">
              <BlockStack gap="100">
                <Text variant="headingSm" as="h3">Détails</Text>
                <Divider />
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Format</Text><Text as="span" variant="bodySm">{image.format}</Text></InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Dimensions</Text><Text as="span" variant="bodySm">{image.dims}</Text></InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Taille</Text><Text as="span" variant="bodySm">{image.size}</Text></InlineStack>
                <InlineStack align="space-between"><Text as="span" tone="subdued" variant="bodySm">Ajoutée</Text><Text as="span" variant="bodySm">{image.date}</Text></InlineStack>
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

function VariantsTable({ variants, onSelectVariant }: { variants: VariantRow[]; onSelectVariant: (v: VariantRow) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Group by option1_value (e.g. Size)
  const option1Values = Array.from(new Set(variants.map(v => v.option1_value).filter(Boolean))) as string[]
  const hasGroups = option1Values.length > 0 && variants.some(v => v.option2_value)

  const grouped = hasGroups
    ? option1Values.map(val => ({
        groupKey: val,
        variants: variants.filter(v => v.option1_value === val),
      }))
    : [{ groupKey: '', variants }]

  if (variants.length === 0) {
    return (
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, textAlign: 'center', color: '#888' }}>
        <Text as="p" variant="bodySm" tone="subdued">Aucune variante. Cliquez sur &quot;Ajouter une variante&quot; pour en créer.</Text>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
        padding: '8px 12px', background: '#f6f6f6',
        borderBottom: '1px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#555',
      }}>
        <div />
        <div>Variante ↕</div>
        <div style={{ textAlign: 'right' }}>Prix</div>
        <div style={{ textAlign: 'right' }}>Disponible</div>
      </div>
      {grouped.map(({ groupKey, variants: groupVars }) => {
        const totalStock = groupVars.reduce((a, v) => a + v.stock, 0)
        const minPrice = Math.min(...groupVars.map(v => v.price))
        const maxPrice = Math.max(...groupVars.map(v => v.price))
        const isExp = expanded[groupKey] ?? false

        if (!hasGroups) {
          // Flat list - no grouping
          return groupVars.map(v => {
            const label = [v.option1_value, v.option2_value].filter(Boolean).join(' / ') || v.sku || 'Variante'
            return (
              <div
                key={v.id}
                style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
                  padding: '8px 12px', borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer', background: 'white',
                }}
                onClick={() => onSelectVariant(v)}
              >
                <Checkbox label="" checked={false} onChange={() => {}} />
                <InlineStack gap="200" blockAlign="center">
                  <BlockStack gap="0">
                    <Text as="span" variant="bodySm" fontWeight="medium">{label}</Text>
                    {v.sku && <Text as="span" variant="bodySm" tone="subdued">{v.sku}</Text>}
                  </BlockStack>
                </InlineStack>
                <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{v.price.toFixed(2)} €</div>
                <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{v.stock}</div>
              </div>
            )
          })
        }

        return (
          <div key={groupKey}>
            {/* Group header */}
            <div
              style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 140px 100px',
                padding: '10px 12px', borderBottom: '1px solid #e8e8e8',
                cursor: 'pointer', background: isExp ? '#f0f7ff' : 'white',
              }}
              onClick={() => setExpanded(e => ({ ...e, [groupKey]: !e[groupKey] }))}
            >
              <Checkbox label="" checked={false} onChange={() => {}} />
              <InlineStack gap="200" blockAlign="center">
                <ImagePlaceholder label={groupKey} size="sm" />
                <BlockStack gap="0">
                  <Text as="span" variant="bodySm" fontWeight="medium">{groupKey}</Text>
                  <Text as="span" variant="bodySm" tone="subdued">{groupVars.length} variantes {isExp ? '▼' : '▶'}</Text>
                </BlockStack>
              </InlineStack>
              <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>
                {minPrice === maxPrice ? `${minPrice.toFixed(2)} €` : `${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)} €`}
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, alignSelf: 'center' }}>{totalStock}</div>
            </div>
            {/* Variant rows */}
            {isExp && groupVars.map(v => (
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
                  <BlockStack gap="0">
                    <Text as="span" variant="bodySm" fontWeight="medium">{v.option2_value || v.option1_value}</Text>
                    {v.sku && <Text as="span" variant="bodySm" tone="subdued">{v.sku}</Text>}
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
          Stock total pour tous les emplacements : <strong>{variants.reduce((a, v) => a + v.stock, 0)} disponibles</strong>
        </Text>
      </div>
    </div>
  )
}

// ─── SEO Preview ─────────────────────────────────────────────────────────────

function SEOPreview({ seoTitle, setSeoTitle, seoDesc, setSeoDesc, urlSlug, setUrlSlug }: {
  seoTitle: string; setSeoTitle: (v: string) => void
  seoDesc: string; setSeoDesc: (v: string) => void
  urlSlug: string; setUrlSlug: (v: string) => void
}) {
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
  const { activeSite } = useSite()
  const productId = params.id

  const [images, setImages] = useState<typeof MOCK_IMAGES>([])
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState<number | null>(null)
  const [realProduct, setRealProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // All state hooks declared before any conditional logic
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [status, setStatus] = useState('live')
  const [selectedVariant, setSelectedVariant] = useState<VariantRow | null>(null)
  const [selectedImage, setSelectedImage] = useState<typeof MOCK_IMAGES[0] | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [vendor, setVendor] = useState('')
  const [productType, setProductType] = useState('')
  const [themeTemplate, setThemeTemplate] = useState('produits-postersbase')
  const [channelTags, setChannelTags] = useState<string[]>(DEFAULT_CHANNELS)
  const [collectionTags, setCollectionTags] = useState<string[]>([])
  const [productTags, setProductTags] = useState<string[]>([])
  const [expandImages, setExpandImages] = useState(false)

  // SEO state (lifted from SEOPreview)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [urlSlug, setUrlSlug] = useState('')

  // Variants from Supabase
  const [variants, setVariants] = useState<VariantRow[]>([])
  const [variantsLoading, setVariantsLoading] = useState(false)

  // Load real product from Supabase
  useEffect(() => {
    if (!productId) return
    setLoading(true)
    fetch(`/api/products/${productId}?site=${activeSite}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setRealProduct(data)
          const t = data.title || data.name || ''
          setTitle(t)
          setVendor(data.vendor || '')
          setProductType(data.category || '')
          setCategory(data.category || '')
          setStatus(data.is_active === false || data.is_published === false ? 'draft' : 'live')
          setDescription(data.description || data.seo_desc || '')
          setPrice(String(data.price ?? ''))
          setStock(data.stock !== undefined ? data.stock : null)

          // Load tags from DB
          if (Array.isArray(data.tags) && data.tags.length > 0) {
            setProductTags(data.tags)
          }

          // Load SEO fields
          setSeoTitle(data.seo_title || `${t} | Studio Nord & Co`)
          setSeoDesc(data.seo_desc || `Commandez votre ${t.toLowerCase()}. Impression musée sur papier haut grammage. Livraison rapide en France et Europe.`)
          setUrlSlug(data.slug || t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))

          // Load collections from DB
          if (Array.isArray(data.collections) && data.collections.length > 0) {
            setCollectionTags(data.collections)
          }

          // Load channels from DB
          if (Array.isArray(data.channels) && data.channels.length > 0) {
            setChannelTags(data.channels)
          }

          const realImages: typeof MOCK_IMAGES = []
          // Load images[] JSONB array from Supabase (multiple images)
          if (Array.isArray(data.images) && data.images.length > 0) {
            const seen = new Set<string>()
            data.images.forEach((imgUrl: string, idx: number) => {
              if (imgUrl && !seen.has(imgUrl)) {
                seen.add(imgUrl)
                realImages.push({ id: `db-img-${idx}`, label: idx === 0 ? 'Principal' : `Image ${idx + 1}`, alt: t, format: 'JPG', dims: 'Original', size: '—', date: 'En ligne', url: imgUrl })
              }
            })
          } else {
            // Fallback: load from individual image columns
            if (data.image_url) {
              realImages.push({ id: 'real-main', label: 'Principal', alt: t, format: 'JPG', dims: 'Original', size: '—', date: 'En ligne', url: data.image_url })
            }
            if (data.cover_url && data.cover_url !== data.image_url) {
              realImages.push({ id: 'real-cover', label: 'Couverture', alt: t, format: 'JPG', dims: 'Original', size: '—', date: 'En ligne', url: data.cover_url })
            }
            if (data.thumb_image && data.thumb_image !== data.image_url && data.thumb_image !== data.cover_url) {
              realImages.push({ id: 'real-thumb', label: 'Miniature', alt: t, format: 'JPG', dims: 'Original', size: '—', date: 'En ligne', url: data.thumb_image })
            }
          }
          if (realImages.length > 0) {
            setImages(realImages)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId, activeSite])

  // Load variants from Supabase
  useEffect(() => {
    if (!productId) return
    setVariantsLoading(true)
    fetch(`/api/products/${productId}/variants?site=${activeSite}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVariants(data)
        }
      })
      .catch(() => {})
      .finally(() => setVariantsLoading(false))
  }, [productId, activeSite])

  const productTitle = title || '...'

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const body: any = {
        site: activeSite,
        title,
        status,
      }
      if (price !== '') body.price = parseFloat(price) || 0
      if (stock !== null) body.stock = stock
      if (description) body.description = description
      if (category) body.category = category
      if (vendor) body.vendor = vendor

      // SEO fields
      body.seo_title = seoTitle
      body.seo_desc = seoDesc
      body.slug = urlSlug

      // Tags
      body.tags = productTags

      // Collections & Channels
      body.collections = collectionTags
      body.channels = channelTags

      // Include existing remote image URLs in the PUT body
      const existingUrls = images.filter(img => img.url && !img.url.startsWith('blob:')).map(img => img.url)
      if (existingUrls.length > 0) {
        body.images = existingUrls
        body.image_url = existingUrls[0]
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        setSaveError(err.error || 'Erreur lors de la sauvegarde')
        return
      }

      // Upload new local (blob:) images via POST multipart
      const newLocalImages = images.filter(img => img.url && img.url.startsWith('blob:'))
      if (newLocalImages.length > 0) {
        const formData = new FormData()
        formData.append('site', activeSite)
        for (const img of newLocalImages) {
          const response = await fetch(img.url)
          const blob = await response.blob()
          formData.append('images', blob, img.label || 'image.jpg')
        }
        const uploadRes = await fetch(`/api/products/${productId}`, {
          method: 'POST',
          body: formData,
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          if (uploadData.urls) {
            // Replace blob: URLs with real uploaded URLs
            setImages(prev => prev.map(img => {
              if (img.url && img.url.startsWith('blob:')) {
                const newUrl = uploadData.urls.shift()
                return newUrl ? { ...img, url: newUrl, date: 'En ligne' } : img
              }
              return img
            }))
          }
        }
      }

      // Save variants to Supabase
      if (variants.length > 0) {
        const variantsBody = {
          site: activeSite,
          variants: variants.map((v, i) => ({
            option1_name: v.option1_name,
            option1_value: v.option1_value,
            option2_name: v.option2_name,
            option2_value: v.option2_value,
            sku: v.sku,
            price: v.price,
            compare_at_price: v.compare_at_price,
            stock: v.stock,
            barcode: v.barcode,
            weight_grams: v.weight_grams,
            image_url: v.image_url,
            position: i,
          })),
        }
        const varRes = await fetch(`/api/products/${productId}/variants`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(variantsBody),
        })
        if (varRes.ok) {
          const varData = await varRes.json()
          if (varData.variants) {
            setVariants(varData.variants)
          }
        }
      }

      // Re-fetch product to ensure images state matches DB
      const refreshRes = await fetch(`/api/products/${productId}?site=${activeSite}`)
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json()
        if (Array.isArray(refreshed.images) && refreshed.images.length > 0) {
          const seen = new Set<string>()
          const freshImages: typeof MOCK_IMAGES = []
          refreshed.images.forEach((imgUrl: string, idx: number) => {
            if (imgUrl && !seen.has(imgUrl)) {
              seen.add(imgUrl)
              freshImages.push({ id: `db-img-${idx}`, label: idx === 0 ? 'Principal' : `Image ${idx + 1}`, alt: title, format: 'JPG', dims: 'Original', size: '—', date: 'En ligne', url: imgUrl })
            }
          })
          if (freshImages.length > 0) setImages(freshImages)
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err: any) {
      setSaveError(err.message || 'Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

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
        title={title || productTitle}
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
                <Banner tone="success" onDismiss={() => setSaved(false)}>Modifications enregistrées avec succès.</Banner>
              </Layout.Section>
            )}
            {saveError && (
              <Layout.Section>
                <Banner tone="critical" onDismiss={() => setSaveError(null)}>Erreur : {saveError}</Banner>
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
                          value={title}
                          onChange={setTitle}
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

                    {/* Tarification & Stock */}
                    <Card>
                      <BlockStack gap="300">
                        <Text variant="headingMd" as="h2">Tarification</Text>
                        <InlineStack gap="300">
                          <div style={{ flex: 1 }}>
                            <TextField
                              label="Prix"
                              value={price}
                              onChange={setPrice}
                              autoComplete="off"
                              prefix="€"
                              type="number"
                            />
                          </div>
                          {stock !== null && (
                            <div style={{ flex: 1 }}>
                              <TextField
                                label="Stock"
                                value={String(stock)}
                                onChange={(v) => setStock(parseInt(v) || 0)}
                                autoComplete="off"
                                type="number"
                              />
                            </div>
                          )}
                        </InlineStack>
                      </BlockStack>
                    </Card>

                    {/* Médias */}
                    <Card>
                      <BlockStack gap="300">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="headingMd" as="h2">Supports multimédias</Text>
                          <div>
                            <input
                              type="file"
                              id="media-upload"
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                files.forEach(file => {
                                  const url = URL.createObjectURL(file)
                                  setImages(prev => [...prev, { id: 'img-' + Date.now(), label: file.name, url, alt: '', format: 'JPEG', dims: '800×800', size: (file.size / 1024).toFixed(0) + ' Ko', date: "Aujourd'hui" }])
                                })
                              }}
                            />
                            <Button icon={PlusIcon} size="slim" onClick={() => document.getElementById('media-upload')?.click()}>Téléverser</Button>
                          </div>
                        </InlineStack>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, 80px)',
                          gap: 8,
                        }}>
                          {(expandImages ? images : images.slice(0, 8)).map((img, idx) => (
                            <div
                              key={img.id}
                              style={{
                                position: 'relative', cursor: 'pointer',
                                borderRadius: 8, overflow: 'hidden',
                                border: '1px solid #d0d0d0',
                                width: 80, height: 80,
                              }}
                              onClick={() => setSelectedImage(img)}
                            >
                              {img.url ? (
                                <img src={img.url} alt={img.alt || img.label} style={{ width: 80, height: 80, objectFit: 'cover', display: 'block', borderRadius: 8 }} />
                              ) : (
                                <div style={{
                                  background: 'repeating-linear-gradient(45deg,#e8e8e8,#e8e8e8 6px,#f1f1f1 6px,#f1f1f1 12px)',
                                  width: 80, height: 80, display: 'grid', placeItems: 'center',
                                  fontSize: 10, color: '#888',
                                }}>
                                  {idx === 0 ? '🏆' : `📷`} {img.label}
                                </div>
                              )}
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
                          <div
                            style={{
                              width: 80, height: 80, border: '1.5px dashed #c4c4c4', borderRadius: 8,
                              display: 'grid', placeItems: 'center', cursor: 'pointer',
                              color: '#888',
                            }}
                            onClick={() => document.getElementById('media-upload')?.click()}
                          >
                            <span style={{ fontSize: 20 }}>+</span>
                          </div>
                        </div>
                        {images.length > 8 && !expandImages && (
                          <div style={{ textAlign: 'center', marginTop: 4 }}>
                            <button
                              onClick={() => setExpandImages(true)}
                              style={{
                                background: 'none', border: 'none', color: '#2c6ecb',
                                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                              }}
                            >
                              + Voir {images.length - 8} de plus
                            </button>
                          </div>
                        )}
                        {images.length > 8 && expandImages && (
                          <div style={{ textAlign: 'center', marginTop: 4 }}>
                            <button
                              onClick={() => setExpandImages(false)}
                              style={{
                                background: 'none', border: 'none', color: '#2c6ecb',
                                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                              }}
                            >
                              Voir moins
                            </button>
                          </div>
                        )}
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

                    {/* Variantes */}
                    <Card>
                      <BlockStack gap="400">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="headingMd" as="h2">Variantes</Text>
                          <Button size="slim" icon={PlusIcon} onClick={() => {
                            const newVariant: VariantRow = {
                              id: `new-${Date.now()}`,
                              option1_name: variants.length > 0 ? variants[0].option1_name : 'Size',
                              option1_value: '',
                              option2_name: variants.length > 0 ? variants[0].option2_name : null,
                              option2_value: null,
                              sku: '',
                              price: parseFloat(price) || 0,
                              stock: 0,
                              position: variants.length,
                            }
                            setVariants(prev => [...prev, newVariant])
                            setSelectedVariant(newVariant)
                          }}>Ajouter une variante</Button>
                        </InlineStack>
                        {/* Options pills - derived from actual variants */}
                        {variants.length > 0 && (() => {
                          const opt1Name = variants[0]?.option1_name
                          const opt2Name = variants[0]?.option2_name
                          const opt1Values = Array.from(new Set(variants.map(v => v.option1_value).filter(Boolean))) as string[]
                          const opt2Values = Array.from(new Set(variants.map(v => v.option2_value).filter(Boolean))) as string[]
                          return (
                            <BlockStack gap="300">
                              {opt1Name && opt1Values.length > 0 && (
                                <div>
                                  <Text as="p" variant="bodySm" fontWeight="medium">{opt1Name}</Text>
                                  <Box paddingBlockStart="100">
                                    <InlineStack gap="200" wrap>
                                      {opt1Values.map(o => (
                                        <div key={o} style={{
                                          padding: '4px 12px', border: '1px solid #c4c4c4',
                                          borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                                          background: 'white', cursor: 'pointer',
                                        }}>{o}</div>
                                      ))}
                                    </InlineStack>
                                  </Box>
                                </div>
                              )}
                              {opt2Name && opt2Values.length > 0 && (
                                <div>
                                  <Text as="p" variant="bodySm" fontWeight="medium">{opt2Name}</Text>
                                  <Box paddingBlockStart="100">
                                    <InlineStack gap="200" wrap>
                                      {opt2Values.map(o => (
                                        <div key={o} style={{
                                          padding: '4px 12px', border: '1px solid #c4c4c4',
                                          borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                                          background: 'white', cursor: 'pointer',
                                        }}>{o}</div>
                                      ))}
                                    </InlineStack>
                                  </Box>
                                </div>
                              )}
                            </BlockStack>
                          )
                        })()}
                        {variants.length > 0 && <Divider />}
                        {/* Table variantes */}
                        <VariantsTable variants={variants} onSelectVariant={setSelectedVariant} />
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
                      <SEOPreview
                        seoTitle={seoTitle} setSeoTitle={setSeoTitle}
                        seoDesc={seoDesc} setSeoDesc={setSeoDesc}
                        urlSlug={urlSlug} setUrlSlug={setUrlSlug}
                      />
                    </BlockStack>
                  </Card>
                )}

                {activeTab === 2 && (
                  <Card>
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h2">Toutes les variantes</Text>
                        <Button size="slim" icon={PlusIcon} onClick={() => {
                          const newVariant: VariantRow = {
                            id: `new-${Date.now()}`,
                            option1_name: variants.length > 0 ? variants[0].option1_name : 'Size',
                            option1_value: '',
                            option2_name: variants.length > 0 ? variants[0].option2_name : null,
                            option2_value: null,
                            sku: '',
                            price: parseFloat(price) || 0,
                            stock: 0,
                            position: variants.length,
                          }
                          setVariants(prev => [...prev, newVariant])
                          setSelectedVariant(newVariant)
                        }}>Ajouter une variante</Button>
                      </InlineStack>
                      <VariantsTable variants={variants} onSelectVariant={setSelectedVariant} />
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
                          <select
                            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent', cursor: 'pointer', color: '#2563eb' }}
                            value=""
                            onChange={e => {
                              const val = e.target.value
                              if (val && !collectionTags.includes(val)) {
                                setCollectionTags(t => [...t, val])
                              }
                              e.target.value = ''
                            }}
                          >
                            <option value="">+ Ajouter une collection…</option>
                            {(allCollections as any[]).filter(c => !collectionTags.includes(c.title) && c.status === 'live').map((c: any) => (
                              <option key={c.id} value={c.title}>{c.title}</option>
                            ))}
                          </select>
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
                          <input
                            placeholder="Ajouter un tag…"
                            style={{ border: 'none', outline: 'none', fontSize: 13, minWidth: 120, flex: 1 }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                setProductTags(tags => [...tags, e.currentTarget.value.trim()])
                                e.currentTarget.value = ''
                              }
                            }}
                          />
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
        <Box paddingBlockEnd="800" />
      </Page>

      {/* ── Modals & Panels ────────────────────────────────────────────────── */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={(updated) => {
            setImages(prev => prev.map(img => img.id === updated.id ? updated : img))
          }}
        />
      )}
      {selectedVariant && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 49 }}
            onClick={() => setSelectedVariant(null)}
          />
          <VariantDetailPanel
            variant={selectedVariant}
            onClose={() => setSelectedVariant(null)}
            onSave={(updated) => {
              setVariants(prev => prev.map(v => v.id === updated.id ? updated : v))
            }}
          />
        </>
      )}
    </>
  )
}
