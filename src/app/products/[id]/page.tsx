'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  Banner,
  Spinner,
} from '@shopify/polaris'
import {
  DeleteIcon,
  DuplicateIcon,
  PlusIcon,
  ShareIcon,
  ViewIcon,
} from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductImage {
  id: string
  label: string
  url: string
  isLocal?: boolean
  file?: File
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { activeSite } = useSite()
  const productId = params.id
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Product state
  const [loading, setLoading] = useState(true)
  const [rawProduct, setRawProduct] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('live')
  const [vendor, setVendor] = useState('')
  const [productType, setProductType] = useState('')
  const [images, setImages] = useState<ProductImage[]>([])

  // UI state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ─── Load product ───────────────────────────────────────────────────────

  const loadProduct = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productId}?site=${activeSite}`)
      const data = await res.json()
      if (data && !data.error) {
        setRawProduct(data)
        setTitle(data.title || data.name || '')
        setDescription(data.description || data.seo_desc || '')
        setPrice(String(data.price ?? ''))
        setStock(data.stock !== undefined && data.stock !== null ? data.stock : null)
        setCategory(data.category || '')
        setVendor(data.vendor || '')
        setProductType(data.category || data.type || '')
        setStatus(
          data.is_active === false || data.is_published === false ? 'draft' : 'live'
        )

        // Build images from real data
        const imgUrl = data.image_url || data.thumb_image || data.cover_url
        if (imgUrl) {
          setImages([{
            id: 'main',
            label: data.title || 'Image principale',
            url: imgUrl,
          }])
        } else {
          setImages([])
        }
      }
    } catch {
      // ignore fetch errors during load
    } finally {
      setLoading(false)
    }
  }, [productId, activeSite])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  // ─── Save product ──────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const body: Record<string, any> = {
        site: activeSite,
        title,
        status,
      }
      if (price !== '') body.price = parseFloat(price) || 0
      if (stock !== null) body.stock = stock
      if (description) body.description = description
      if (category) body.category = category

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

      // Upload new local images
      const localImages = images.filter(img => img.isLocal && img.file)
      if (localImages.length > 0) {
        const formData = new FormData()
        formData.append('site', activeSite)
        for (const img of localImages) {
          formData.append('images', img.file!, img.label)
        }
        const uploadRes = await fetch(`/api/products/${productId}`, {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          setSaveError('Produit sauvegardé mais erreur lors de l\'upload des images')
          return
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 4000)

      // Reload to confirm changes
      await loadProduct()
    } catch (err: any) {
      setSaveError(err.message || 'Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete product ────────────────────────────────────────────────────

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${productId}?site=${activeSite}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json()
        setSaveError(err.error || 'Erreur lors de la suppression')
        setDeleting(false)
        setDeleteModalOpen(false)
        return
      }
      router.push('/products')
    } catch (err: any) {
      setSaveError(err.message || 'Erreur réseau')
      setDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  // ─── Image upload ──────────────────────────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const localUrl = URL.createObjectURL(file)
      setImages(prev => [
        ...prev,
        {
          id: 'img-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          label: file.name,
          url: localUrl,
          isLocal: true,
          file,
        },
      ])
    })
    // Reset the input so re-selecting the same file works
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (imgId: string) => {
    setImages(prev => prev.filter(img => img.id !== imgId))
  }

  // ─── Derived ───────────────────────────────────────────────────────────

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const statusOptions = [
    { label: 'Actif', value: 'live' },
    { label: 'Brouillon', value: 'draft' },
  ]
  const statusDesc: Record<string, string> = {
    live: 'En vente sur les canaux de vente et les marchés sélectionnés',
    draft: 'Non visible sur les canaux de vente',
  }
  const statusBadge: Record<string, 'success' | 'attention'> = {
    live: 'success',
    draft: 'attention',
  }

  const tabs = [
    { id: 'infos', content: 'Informations' },
    { id: 'seo', content: 'SEO' },
  ]

  // ─── Loading state ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <Page
        backAction={{ content: 'Produits', onAction: () => router.push('/products') }}
        title="Chargement…"
      >
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="800">
                <InlineStack align="center">
                  <Spinner size="large" />
                </InlineStack>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Page
        backAction={{ content: 'Produits', onAction: () => router.push('/products') }}
        title={title || 'Produit'}
        titleMetadata={
          <Badge tone={statusBadge[status] ?? 'attention'}>
            {status === 'live' ? 'Actif' : 'Brouillon'}
          </Badge>
        }
        primaryAction={{ content: 'Enregistrer', loading: saving, onAction: handleSave }}
        secondaryActions={[
          { content: 'Dupliquer', icon: DuplicateIcon, onAction: () => {} },
          { content: 'Afficher', icon: ViewIcon, onAction: () => {} },
          { content: 'Partager', icon: ShareIcon, onAction: () => {} },
        ]}
        actionGroups={[
          {
            title: 'Autres actions',
            actions: [
              {
                content: 'Supprimer',
                destructive: true,
                icon: DeleteIcon,
                onAction: () => setDeleteModalOpen(true),
              },
            ],
          },
        ]}
      >
        <Tabs tabs={tabs} selected={activeTab} onSelect={setActiveTab} fitted={false}>
          <Layout>
            {saved && (
              <Layout.Section>
                <Banner tone="success" onDismiss={() => setSaved(false)}>
                  Modifications enregistrées avec succès.
                </Banner>
              </Layout.Section>
            )}
            {saveError && (
              <Layout.Section>
                <Banner tone="critical" onDismiss={() => setSaveError(null)}>
                  Erreur : {saveError}
                </Banner>
              </Layout.Section>
            )}

            {/* ── MAIN COLUMN ───────────────────────────────────────── */}
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
                          <Button icon={PlusIcon} size="slim" onClick={triggerUpload}>
                            Téléverser
                          </Button>
                        </InlineStack>

                        {images.length > 0 ? (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: 8,
                          }}>
                            {images.map((img, idx) => (
                              <div
                                key={img.id}
                                style={{
                                  position: 'relative',
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  border: '1px solid #d0d0d0',
                                  aspectRatio: '1',
                                }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={img.label}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                />
                                {idx === 0 && (
                                  <div style={{
                                    position: 'absolute', top: 4, left: 4,
                                    background: 'rgba(0,0,0,0.6)', color: 'white',
                                    fontSize: 9, padding: '1px 6px', borderRadius: 3,
                                  }}>
                                    Principal
                                  </div>
                                )}
                                {img.isLocal && (
                                  <div style={{
                                    position: 'absolute', top: 4, right: 4,
                                    background: '#f59e0b', color: 'white',
                                    fontSize: 9, padding: '1px 6px', borderRadius: 3,
                                  }}>
                                    Non sauvegardé
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeImage(img.id)
                                  }}
                                  style={{
                                    position: 'absolute', bottom: 4, right: 4,
                                    background: 'rgba(0,0,0,0.6)', color: 'white',
                                    border: 'none', borderRadius: '50%',
                                    width: 22, height: 22,
                                    cursor: 'pointer', fontSize: 12,
                                    display: 'grid', placeItems: 'center',
                                  }}
                                  title="Supprimer"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {/* Add more button */}
                            <div
                              onClick={triggerUpload}
                              style={{
                                aspectRatio: '1',
                                border: '1.5px dashed #c4c4c4',
                                borderRadius: 8,
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                                color: '#888',
                                background: '#fafafa',
                              }}
                            >
                              <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: 24, display: 'block' }}>+</span>
                                <span style={{ fontSize: 11 }}>Ajouter</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={triggerUpload}
                            style={{
                              border: '2px dashed #c4c4c4',
                              borderRadius: 12,
                              padding: '40px 20px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              background: '#fafafa',
                            }}
                          >
                            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                            <Text as="p" variant="bodySm" tone="subdued">
                              Cliquez ou glissez vos images ici
                            </Text>
                          </div>
                        )}

                        <Text as="p" variant="bodySm" tone="subdued">
                          Cliquez sur « Téléverser » ou sur la zone ci-dessus pour ajouter des images. Les nouvelles images seront sauvegardées avec le produit.
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
                  </>
                )}

                {activeTab === 1 && (
                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingMd" as="h2">Aperçu sur les moteurs de recherche</Text>
                      <SEOPreview title={title} slug={slug} />
                    </BlockStack>
                  </Card>
                )}

              </BlockStack>
            </Layout.Section>

            {/* ── RIGHT RAIL ──────────────────────────────────────── */}
            <Layout.Section variant="oneThird">
              <BlockStack gap="400">

                {/* Image principale preview */}
                {images.length > 0 && (
                  <Card>
                    <BlockStack gap="200">
                      <Text variant="headingMd" as="h2">Image principale</Text>
                      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0].url}
                          alt={images[0].label}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      </div>
                    </BlockStack>
                  </Card>
                )}

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
                  </BlockStack>
                </Card>

                {/* Danger zone */}
                <Card>
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2" tone="critical">Zone de danger</Text>
                    <Button
                      variant="primary"
                      tone="critical"
                      icon={DeleteIcon}
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Supprimer le produit
                    </Button>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Cette action est irréversible. Le produit sera définitivement supprimé de la base de données.
                    </Text>
                  </BlockStack>
                </Card>

              </BlockStack>
            </Layout.Section>
          </Layout>
        </Tabs>
      </Page>

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Supprimer ce produit ?"
        primaryAction={{
          content: 'Supprimer définitivement',
          destructive: true,
          loading: deleting,
          onAction: handleDelete,
        }}
        secondaryActions={[
          { content: 'Annuler', onAction: () => setDeleteModalOpen(false) },
        ]}
      >
        <Modal.Section>
          <Text as="p">
            Êtes-vous sûr de vouloir supprimer <strong>{title}</strong> ?
            Cette action est irréversible et supprimera le produit de la base de données.
          </Text>
        </Modal.Section>
      </Modal>
    </>
  )
}
