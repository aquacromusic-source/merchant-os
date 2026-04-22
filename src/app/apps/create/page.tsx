'use client'
import React, { useState, useRef } from 'react'
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

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  attachments?: { name: string; url: string; type: string }[]
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

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
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
    scrollToBottom()

    try {
      // Préparer le contexte pour Claude
      const contextMsg = appName ? `[Contexte app : "${appName}" - Catégorie : ${appCategory}${appDescription ? ` - ${appDescription}` : ''}${features.length > 0 ? ` - Fonctionnalités : ${features.join(', ')}` : ''}]\n\n` : ''
      
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.attachments 
          ? `${m.content}\n\n[L'utilisateur a joint ${m.attachments.length} fichier(s) : ${m.attachments.map(a => a.name).join(', ')}]`
          : m.content,
      }))

      // Ajouter le contexte au premier message
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
      }

      setMessages(prev => [...prev, assistantMsg])
      scrollToBottom()
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

  return (
    <Page
      title={appName || 'Nouvelle application'}
      backAction={{ content: 'Applications', onAction: () => router.push('/apps') }}
      primaryAction={{ content: 'Enregistrer', icon: CheckIcon, loading: saving, onAction: handleSave }}
      secondaryActions={[
        { content: 'Effacer la conversation', icon: DeleteIcon, onAction: () => setDeleteModal(true) },
        { content: 'Regénérer', icon: RefreshIcon, onAction: () => {
          setMessages(prev => prev.slice(0, 1))
        }},
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
                {messages.map((msg, i) => (
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
                      <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>C</div>
                    <div style={{ background: '#f6f6f7', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite' }}/>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite 0.2s' }}/>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1s infinite 0.4s' }}/>
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
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
                    placeholder="Décris ce que tu veux créer, ou pose une question…"
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Page>
  )
}
