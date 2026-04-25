'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Page, Card, BlockStack, InlineStack, Text, TextField,
  Button, Badge, Divider, Banner, Spinner, Box,
  DropZone, Thumbnail, InlineGrid, Modal, ButtonGroup,
  Select,
} from '@shopify/polaris'
import {
  PlusIcon, SendIcon, DeleteIcon, ImageIcon,
  EditIcon, CheckIcon, RefreshIcon,
} from '@shopify/polaris-icons'
import { useRouter } from 'next/navigation'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { useSite } from '@/contexts/SiteContext'

interface TokenUsage {
  input_tokens: number
  output_tokens: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: { name: string; url: string; type: string }[]
  usage?: TokenUsage
}

interface AppSpec {
  name: string
  description: string
  status: 'draft' | 'in-progress' | 'done'
  category: string
  features: string[]
  createdAt: string
  messages: Message[]
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

/** Parse bullet features from a Claude response */
function parseFeaturesFromContent(content: string): string[] {
  const lines = content.split('\n')
  const features: string[] = []
  for (const line of lines) {
    const match = line.match(/^[-*•]\s+(.+)/)
    if (match) {
      const f = match[1].replace(/\*\*/g, '').trim()
      if (f.length > 3 && f.length < 120) features.push(f)
    }
  }
  return features
}

/** Copy text to clipboard */
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
}

export default function CreateAppPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [appName, setAppName] = useState('')
  const [appCategory, setAppCategory] = useState('other')
  const [appDescription, setAppDescription] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bonjour Robin ! 👋

Je suis Claude, ton partenaire de développement intégré à Merchant OS.

**Pour créer une nouvelle application**, dis-moi :
- Ce que tu veux que l'app fasse
- Le problème qu'elle doit résoudre
- Les utilisateurs qui vont l'utiliser

Tu peux aussi **joindre des images ou vidéos** de référence (captures d'écran d'apps existantes, maquettes, etc.) pour que je comprenne mieux ta vision.

Par quoi on commence ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deployModal, setDeployModal] = useState(false)
  const [deployTarget, setDeployTarget] = useState<'all' | 'selected'>('selected')
  const [selectedSites, setSelectedSites] = useState<string[]>(['gaming-posters'])
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)

  const SITES = [
    { id: 'gaming-posters', name: 'Gaming Posters', url: 'gaming-posters.vercel.app', color: '#00e5ff' },
    { id: 'strap', name: 'STRAP.', url: 'strap-store.vercel.app', color: '#ff6b35' },
    { id: 'pdf-guide-store', name: 'PDF Guide Store', url: 'pdf-guide-store.vercel.app', color: '#7c3aed' },
  ]

  const handleDeploy = async () => {
    setDeploying(true)
    await new Promise(r => setTimeout(r, 2000))
    setDeploying(false)
    setDeployed(true)
    setDeployModal(false)
    setTimeout(() => setDeployed(false), 4000)
  }
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Auto-scroll on new messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const handleCopy = (content: string, idx: number) => {
    copyToClipboard(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleAddAllFeatures = (content: string) => {
    const parsed = parseFeaturesFromContent(content)
    if (parsed.length === 0) return
    setFeatures(prev => {
      const existing = new Set(prev)
      const newOnes = parsed.filter(f => !existing.has(f))
      return [...prev, ...newOnes]
    })
  }

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setAttachments([])
    setLoading(true)

    try {
      const contextMsg = appName
        ? `[Contexte app : "${appName}" - Catégorie : ${appCategory}${appDescription ? ` - ${appDescription}` : ''}${features.length > 0 ? ` - Fonctionnalités : ${features.join(', ')}` : ''}]\n\n`
        : ''

      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.attachments
          ? `${m.content}\n\n[L'utilisateur a joint ${m.attachments.length} fichier(s) : ${m.attachments.map(a => a.name).join(', ')}]`
          : m.content,
      }))

      if (apiMessages[0] && contextMsg) {
        apiMessages[0] = { ...apiMessages[0], content: contextMsg + apiMessages[0].content }
      }

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: `Tu es un expert développeur d'applications pour e-commerce, intégré dans le back-office Merchant OS de Robin Guerreau.

Robin gère plusieurs boutiques e-commerce de posters (gaming, films, sport) avec 500-1000 commandes/mois. Son BO est en Next.js 14 + Supabase + Polaris.

Quand tu analyses une demande d'app :
1. Décris les fonctionnalités clés avec des bullet points clairs
2. Suggère l'architecture technique (API routes, composants, DB)
3. Estime la complexité (Simple/Moyen/Complexe)
4. Propose des améliorations auxquelles Robin n'a pas pensé
5. Si des images sont jointes, analyse-les et commente

Réponds en français, de manière directe et actionnable. Utilise du markdown pour structurer.`,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        usage: data.usage,
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err: any) {
      const errMsg: Message = {
        role: 'assistant',
        content: `❌ Erreur : ${err.message}\n\nVérifie que la clé API Claude est configurée dans les variables d'environnement (ANTHROPIC_API_KEY).`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setAttachments(prev => [...prev, { name: file.name, url, type: file.type }])
    })
    if (e.target) e.target.value = ''
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const askClaude = (prompt: string) => {
    setInput(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend()
    }
  }

  return (
    <Page
      title={appName || 'Nouvelle application'}
      backAction={{ content: 'Applications', onAction: () => router.push('/apps') }}
      primaryAction={{ content: 'Enregistrer', icon: CheckIcon, loading: saving, onAction: handleSave }}
      secondaryActions={[
        { content: 'Effacer la conversation', icon: DeleteIcon, onAction: () => setDeleteModal(true) },
        { content: 'Regénérer', icon: RefreshIcon, onAction: () => { setMessages(prev => prev.slice(0, 1)) } },
      ]}
    >
      {saved && <Banner tone="success" onDismiss={() => setSaved(false)}>Application enregistrée avec succès.</Banner>}

      <InlineGrid columns={{ xs: 1, lg: '2fr 1fr' }} gap="400">
        {/* Colonne gauche — Chat Claude */}
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="200" blockAlign="center">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 14,
                  }}>C</div>
                  <BlockStack gap="0">
                    <Text as="p" variant="bodySm" fontWeight="semibold">Claude — Assistant IA</Text>
                    <Text as="p" variant="bodySm" tone="subdued">Propulsé par Anthropic</Text>
                  </BlockStack>
                </InlineStack>
                <Badge tone="success">En ligne</Badge>
              </InlineStack>

              <Divider />

              {/* Messages */}
              <div style={{ height: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
                {messages.map((msg, i) => {
                  const parsedFeatures = msg.role === 'assistant' ? parseFeaturesFromContent(msg.content) : []
                  const hasFeatures = parsedFeatures.length >= 3

                  return (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'user' ? '#1a1a1a' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 11, fontWeight: 700,
                      }}>
                        {msg.role === 'user' ? 'R' : 'C'}
                      </div>

                      {/* Bulle */}
                      <div style={{
                        maxWidth: '75%',
                        background: msg.role === 'user' ? '#1a1a1a' : '#f6f6f7',
                        color: msg.role === 'user' ? 'white' : '#1a1a1a',
                        borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        padding: '10px 14px',
                      }}>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                            {msg.attachments.map((att, j) => (
                              <div key={j} style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: 'rgba(255,255,255,0.15)', borderRadius: 6,
                                padding: '2px 8px', fontSize: 12,
                              }}>
                                📎 {att.name}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Markdown rendered content */}
                        <MarkdownRenderer content={msg.content} isDark={msg.role === 'user'} />

                        {/* Footer: timestamp + tokens + copy */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: msg.role === 'user' ? 'flex-end' : 'space-between',
                          gap: 8,
                          marginTop: 6,
                        }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, opacity: 0.6 }}>{msg.timestamp}</span>
                            {msg.usage && (
                              <span style={{
                                fontSize: 10,
                                background: 'rgba(124,58,237,0.12)',
                                color: '#7c3aed',
                                borderRadius: 4,
                                padding: '1px 6px',
                                fontVariantNumeric: 'tabular-nums',
                              }}>
                                ↑{msg.usage.input_tokens} ↓{msg.usage.output_tokens} tokens
                              </span>
                            )}
                          </div>
                          {msg.role === 'assistant' && (
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              title="Copier"
                              style={{
                                background: 'none', border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: 4, padding: '2px 8px',
                                cursor: 'pointer', fontSize: 11,
                                color: copiedIdx === i ? '#16a34a' : '#666',
                                display: 'flex', alignItems: 'center', gap: 3,
                                transition: 'color 0.2s',
                              }}
                            >
                              {copiedIdx === i ? '✓ Copié' : '⎘ Copier'}
                            </button>
                          )}
                        </div>

                        {/* Add all features button */}
                        {hasFeatures && msg.role === 'assistant' && (
                          <div style={{ marginTop: 8 }}>
                            <button
                              onClick={() => handleAddAllFeatures(msg.content)}
                              style={{
                                background: 'linear-gradient(135deg, #7c3aed22, #2563eb22)',
                                border: '1px solid #7c3aed44',
                                borderRadius: 6,
                                padding: '5px 12px',
                                fontSize: 12,
                                cursor: 'pointer',
                                color: '#7c3aed',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              ✨ Ajouter toutes les fonctionnalités ({parsedFeatures.length})
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {loading && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>C</div>
                    <div style={{ background: '#f6f6f7', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite 0.2s' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite 0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <Divider />

              {/* Pièces jointes en attente */}
              {attachments.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {attachments.map((att, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      {att.type.startsWith('image/') ? (
                        <img src={att.url} alt={att.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, border: '1px solid #d0d0d0' }} />
                      ) : (
                        <div style={{ width: 56, height: 56, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                          {att.name.slice(-8)}
                        </div>
                      )}
                      <button
                        onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                        style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#e0e0e0', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Zone de saisie */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }} onKeyDown={handleKeyDown}>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Button
                  icon={ImageIcon}
                  onClick={() => fileInputRef.current?.click()}
                  accessibilityLabel="Joindre un fichier"
                />
                <div style={{ flex: 1 }}>
                  <TextField
                    label=""
                    labelHidden
                    value={input}
                    onChange={setInput}
                    placeholder="Décris ce que tu veux créer… (⌘+Entrée pour envoyer)"
                    multiline={2}
                    autoComplete="off"
                  />
                </div>
                <Button
                  variant="primary"
                  icon={SendIcon}
                  onClick={handleSend}
                  loading={loading}
                  disabled={!input.trim() && attachments.length === 0}
                  accessibilityLabel="Envoyer"
                />
              </div>

              {/* Suggestions rapides */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  'Analyse cette app et propose des améliorations',
                  'Crée une app de suivi des retours clients',
                  'Comment intégrer Sendcloud ?',
                  'Génère les specs techniques',
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => askClaude(s)}
                    style={{
                      background: 'none', border: '1px solid #e0e0e0',
                      borderRadius: 20, padding: '4px 12px',
                      fontSize: 12, cursor: 'pointer', color: '#444',
                    }}
                  >{s}</button>
                ))}
              </div>
            </BlockStack>
          </Card>
        </BlockStack>

        {/* Colonne droite — Specs de l'app */}
        <BlockStack gap="400">
          {/* Infos générales */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Informations</Text>
              <TextField
                label="Nom de l'application"
                value={appName}
                onChange={setAppName}
                placeholder="Ex: Gestionnaire de retours"
                autoComplete="off"
              />
              <Select
                label="Catégorie"
                options={CATEGORIES}
                value={appCategory}
                onChange={setAppCategory}
              />
              <TextField
                label="Description"
                value={appDescription}
                onChange={setAppDescription}
                placeholder="Décris brièvement l'objectif de cette app…"
                multiline={3}
                autoComplete="off"
              />
            </BlockStack>
          </Card>

          {/* Fonctionnalités */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingSm" fontWeight="semibold">
                Fonctionnalités {features.length > 0 && <Badge>{String(features.length)}</Badge>}
              </Text>
              <InlineStack gap="200">
                <div style={{ flex: 1 }}>
                  <TextField
                    label=""
                    labelHidden
                    value={newFeature}
                    onChange={setNewFeature}
                    placeholder="Ajouter une fonctionnalité…"
                    autoComplete="off"
                  />
                </div>
                <Button icon={PlusIcon} onClick={addFeature} />
              </InlineStack>
              {features.length > 0 && (
                <BlockStack gap="100">
                  {features.map((f, i) => (
                    <InlineStack key={i} align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                        <Text as="p" variant="bodySm">{f}</Text>
                      </InlineStack>
                      <Button
                        variant="plain"
                        icon={DeleteIcon}
                        onClick={() => setFeatures(prev => prev.filter((_, j) => j !== i))}
                        accessibilityLabel="Supprimer"
                      />
                    </InlineStack>
                  ))}
                </BlockStack>
              )}
              {features.length === 0 && (
                <Text as="p" variant="bodySm" tone="subdued">
                  Ajoute les fonctionnalités clés, ou demande à Claude de les générer.
                </Text>
              )}
              <Button
                variant="plain"
                onClick={() => askClaude(`Sur la base de la description "${appDescription || 'une app pour mon e-commerce'}", génère une liste de 8-10 fonctionnalités essentielles sous forme de bullet points.`)}
              >
                ✨ Générer avec Claude
              </Button>
            </BlockStack>
          </Card>

          {/* Déploiement */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Déploiement</Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Choisir sur quels sites déployer cette application une fois développée.
              </Text>
              <BlockStack gap="150">
                {SITES.map(site => (
                  <div
                    key={site.id}
                    onClick={() => {
                      setSelectedSites(prev =>
                        prev.includes(site.id) ? prev.filter(x => x !== site.id) : [...prev, site.id]
                      )
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: selectedSites.includes(site.id) ? `2px solid ${site.color}` : '1px solid #e5e5e5',
                      background: selectedSites.includes(site.id) ? `${site.color}10` : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: site.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{site.name}</div>
                      {site.url && <div style={{ fontSize: 11, color: '#8c9196' }}>{site.url}</div>}
                    </div>
                    {selectedSites.includes(site.id) && (
                      <div style={{ fontSize: 16, color: site.color }}>✓</div>
                    )}
                  </div>
                ))}
              </BlockStack>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  fullWidth
                  variant="plain"
                  onClick={() => setSelectedSites(SITES.map(s => s.id))}
                >
                  Tous les sites
                </Button>
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => setDeployModal(true)}
                  disabled={selectedSites.length === 0 || !appName}
                  loading={deploying}
                >
                  🚀 Déployer
                </Button>
              </div>
              {deployed && (
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#065f46' }}>
                  ✓ Déployée sur {selectedSites.length} site{selectedSites.length > 1 ? 's' : ''}
                </div>
              )}
            </BlockStack>
          </Card>

          {/* Actions rapides */}
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Actions rapides</Text>
              <BlockStack gap="100">
                <Button fullWidth onClick={() => askClaude('Génère les specs techniques complètes pour cette app (architecture, base de données, API routes, composants). Sois précis et structuré.')}>
                  📋 Générer les specs techniques
                </Button>
                <Button fullWidth onClick={() => askClaude('Quelle est la meilleure architecture pour cette app ? Quels sont les risques et points d\'attention ? Combien de temps pour la développer ?')}>
                  🏗️ Analyser l&apos;architecture
                </Button>
                <Button fullWidth onClick={() => askClaude('Crée un planning de développement en sprints pour cette app. Commence par le MVP minimum viable, puis les améliorations.')}>
                  🗓️ Créer le planning
                </Button>
                <Button fullWidth onClick={() => askClaude('Quelles apps similaires existent sur le marché ? Quels sont leurs points forts et faibles ? Comment notre app peut se différencier ?')}>
                  🔍 Analyser la concurrence
                </Button>
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>

      {/* Modal suppression */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Effacer la conversation ?"
        primaryAction={{ content: 'Effacer', destructive: true, onAction: () => { setMessages(prev => prev.slice(0, 1)); setDeleteModal(false) } }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setDeleteModal(false) }]}
      >
        <Modal.Section>
          <Text as="p">L&apos;historique de la conversation sera supprimé. Les informations de l&apos;app (nom, description, fonctionnalités) seront conservées.</Text>
        </Modal.Section>
      </Modal>

      {/* Modal déploiement */}
      <Modal
        open={deployModal}
        onClose={() => setDeployModal(false)}
        title="Confirmer le déploiement"
        primaryAction={{ content: `Déployer sur ${selectedSites.length} site${selectedSites.length > 1 ? 's' : ''}`, loading: deploying, onAction: handleDeploy }}
        secondaryActions={[{ content: 'Annuler', onAction: () => setDeployModal(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text as="p">
              L&apos;application <strong>{appName}</strong> sera déployée sur :
            </Text>
            <BlockStack gap="100">
              {SITES.filter(s => selectedSites.includes(s.id)).map(site => (
                <InlineStack key={site.id} gap="200" blockAlign="center">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: site.color }} />
                  <Text as="p" variant="bodySm">{site.name} — {site.url}</Text>
                </InlineStack>
              ))}
            </BlockStack>
            <Text as="p" variant="bodySm" tone="subdued">
              Cette action lancera le processus de développement et d&apos;intégration automatique.
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>

      <div style={{ paddingBottom: 40 }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Page>
  )
}
