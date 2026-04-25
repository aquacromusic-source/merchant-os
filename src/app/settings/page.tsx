'use client'
import React, { useState, useEffect, useCallback } from 'react'
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
  Select,
  TextField,
  Banner,
  Box,
  DataTable,
  Checkbox,
  Avatar,
  Spinner,
} from '@shopify/polaris'
import {
  SettingsIcon,
  ShippingLabelIcon,
  CreditCardIcon,
  PersonFilledIcon,
  ReceiptEuroIcon,
  ChevronRightIcon,
  PlusIcon,
  NotificationIcon,
  GlobeIcon,
  LocationIcon,
  ImageIcon,
  FolderIcon,
  ClipboardIcon,
} from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'

interface Settings {
  id: string
  site_id: string
  store_name: string | null
  store_email: string | null
  store_phone: string | null
  store_currency: string | null
  store_timezone: string | null
  store_language: string | null
  address_line1: string | null
  address_line2: string | null
  address_city: string | null
  address_zip: string | null
  address_country: string | null
  stripe_enabled: boolean
  paypal_enabled: boolean
  klarna_enabled: boolean
  bank_transfer_enabled: boolean
  cod_enabled: boolean
  notification_email_enabled: boolean
  notification_sms_enabled: boolean
  notification_order_created: boolean
  notification_order_paid: boolean
  notification_order_shipped: boolean
  notification_order_delivered: boolean
  notification_refund: boolean
  notification_abandoned_cart: boolean
  notification_welcome: boolean
  notification_stock_alert: boolean
  notification_new_customer: boolean
  notification_chargeback: boolean
  team_email: string | null
  checkout_contact_method: string | null
  checkout_separate_name: boolean
  checkout_marketing_optin: boolean
  checkout_phone_required: boolean
  checkout_prefill: boolean
  checkout_auto_process: boolean
  accounts_mode: string | null
  accounts_magic_link: boolean
  accounts_google: boolean
  accounts_facebook: boolean
  accounts_delete_request: boolean
  accounts_order_history: boolean
  tax_enabled: boolean
  tax_rate: number | null
  tax_included: boolean
  tax_on_shipping: boolean
  tax_oss_number: string | null
  primary_domain: string | null
  custom_domains: unknown[]
  brand_primary_color: string | null
  brand_secondary_color: string | null
  brand_heading_font: string | null
  brand_body_font: string | null
  plan_name: string | null
  plan_price: number | null
  plan_status: string | null
  plan_renewal_date: string | null
  billing_email: string | null
  billing_card_last4: string | null
  billing_card_expiry: string | null
  billing_card_brand: string | null
  locations: unknown[]
  [key: string]: unknown
}

const SETTINGS_NAV = [
  { key: 'general', label: 'Général', icon: SettingsIcon },
  { key: 'plan', label: 'Forfait', icon: CreditCardIcon },
  { key: 'billing', label: 'Facturation', icon: ReceiptEuroIcon },
  { key: 'users', label: 'Utilisateurs et permissions', icon: PersonFilledIcon },
  { key: 'payments', label: 'Paiements', icon: CreditCardIcon },
  { key: 'checkout', label: 'Finalisation de commande', icon: ClipboardIcon },
  { key: 'accounts', label: 'Comptes clients', icon: PersonFilledIcon },
  { key: 'shipping', label: 'Expédition et livraison', icon: ShippingLabelIcon },
  { key: 'taxes', label: 'Taxes et droits de douane', icon: ReceiptEuroIcon },
  { key: 'locations', label: 'Emplacements', icon: LocationIcon },
  { key: 'domains', label: 'Domaines', icon: GlobeIcon },
  { key: 'notifications', label: 'Notifications', icon: NotificationIcon },
  { key: 'brand', label: 'Marque', icon: ImageIcon },
  { key: 'files', label: 'Fichiers', icon: FolderIcon },
]

function SettingContent({
  active,
  settings,
  onChange,
  onSave,
  saving,
  saved,
  error,
}: {
  active: string
  settings: Settings
  onChange: (field: string, value: unknown) => void
  onSave: () => void
  saving: boolean
  saved: boolean
  error: string | null
}) {
  const SaveBanner = () => (
    <>
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      {error && <Banner tone="critical" onDismiss={() => {}}>{error}</Banner>}
    </>
  )

  const SaveButton = () => (
    <InlineStack>
      <Button variant="primary" loading={saving} onClick={onSave}>Enregistrer</Button>
    </InlineStack>
  )

  if (active === 'general') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Informations sur la boutique</Text>
          <TextField label="Nom de la boutique" value={settings.store_name || ''} autoComplete="off" onChange={(v) => onChange('store_name', v)} />
          <TextField label="E-mail du compte" type="email" value={settings.store_email || ''} autoComplete="off" onChange={(v) => onChange('store_email', v)} />
          <TextField label="Numéro de téléphone" value={settings.store_phone || ''} autoComplete="off" onChange={(v) => onChange('store_phone', v)} />
          <Select
            label="Devise"
            options={[
              { label: 'EUR — Euro', value: 'EUR' },
              { label: 'USD — Dollar', value: 'USD' },
              { label: 'GBP — Livre sterling', value: 'GBP' },
            ]}
            value={settings.store_currency || 'EUR'}
            onChange={(v) => onChange('store_currency', v)}
          />
          <SaveButton />
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Adresse de la boutique</Text>
          <TextField label="Adresse" value={settings.address_line1 || ''} autoComplete="off" onChange={(v) => onChange('address_line1', v)} />
          <InlineGrid columns={2} gap="300">
            <TextField label="Ville" value={settings.address_city || ''} autoComplete="off" onChange={(v) => onChange('address_city', v)} />
            <TextField label="Code postal" value={settings.address_zip || ''} autoComplete="off" onChange={(v) => onChange('address_zip', v)} />
          </InlineGrid>
          <Select
            label="Pays"
            options={[{ label: 'France', value: 'FR' }, { label: 'Belgique', value: 'BE' }, { label: 'Suisse', value: 'CH' }, { label: 'Espagne', value: 'ES' }, { label: 'Allemagne', value: 'DE' }]}
            value={settings.address_country || 'FR'}
            onChange={(v) => onChange('address_country', v)}
          />
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'plan') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Votre forfait actuel</Text>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <InlineStack gap="200" blockAlign="center">
                <Text as="p" variant="headingLg" fontWeight="bold">{settings.plan_name || 'Starter'}</Text>
                <Badge tone={settings.plan_status === 'active' ? 'success' : 'attention'}>{settings.plan_status === 'active' ? 'Actif' : 'Inactif'}</Badge>
              </InlineStack>
              <Text as="p" variant="bodySm" tone="subdued">{settings.plan_price || 29} €/mois · Facturation mensuelle</Text>
              {settings.plan_renewal_date && <Text as="p" variant="bodySm" tone="subdued">Renouvellement le {settings.plan_renewal_date}</Text>}
            </BlockStack>
            <Button variant="primary">Changer de forfait</Button>
          </InlineStack>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Ce qui est inclus</Text>
          <BlockStack gap="200">
            {[
              '✓ Jusqu\'à 1 000 commandes/mois',
              '✓ 2 membres d\'équipe',
              '✓ Rapports de base',
              '✓ Frais de transaction : 2%',
              '✓ Boutique en ligne + point de vente',
            ].map((f, i) => (
              <Text key={i} as="p" variant="bodySm">{f}</Text>
            ))}
          </BlockStack>
          <Divider />
          <Banner tone="info">
            <Text as="p">Passez au forfait <strong>Business (79 €/mois)</strong> pour réduire les frais de transaction à 1% et débloquer les rapports avancés.</Text>
          </Banner>
          <InlineStack gap="200">
            <Button variant="primary">Passer au Business</Button>
            <Button>Voir tous les forfaits</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'billing') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Facturation</Text>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <Text as="p" fontWeight="semibold">Plan actuel : {settings.plan_name || 'Starter'} · {settings.plan_price || 29} €/mois</Text>
              {settings.plan_renewal_date && <Text as="p" variant="bodySm" tone="subdued">Prochaine facturation le {settings.plan_renewal_date}</Text>}
            </BlockStack>
            <Button>Gérer l&apos;abonnement</Button>
          </InlineStack>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Méthode de paiement</Text>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div style={{ width: 36, height: 24, background: '#1A1F71', borderRadius: 4, display: 'grid', placeItems: 'center' }}>
                <Text as="span" variant="bodySm" fontWeight="bold" tone="caution">{(settings.billing_card_brand || 'VISA').toUpperCase()}</Text>
              </div>
              <BlockStack gap="0">
                <Text as="p" variant="bodySm" fontWeight="semibold">{settings.billing_card_brand || 'Visa'} se terminant par {settings.billing_card_last4 || '****'}</Text>
                <Text as="p" variant="bodySm" tone="subdued">Expire {settings.billing_card_expiry || 'N/A'}</Text>
              </BlockStack>
            </InlineStack>
            <Button size="slim">Modifier</Button>
          </InlineStack>
          <Divider />
          <TextField label="E-mail de facturation" value={settings.billing_email || ''} autoComplete="off" onChange={(v) => onChange('billing_email', v)} />
          <SaveButton />
        </BlockStack>
      </Card>
      <Card padding="0">
        <Box padding="400" paddingBlockEnd="300">
          <Text as="h3" variant="headingSm" fontWeight="semibold">Factures récentes</Text>
        </Box>
        <DataTable
          columnContentTypes={['text', 'text', 'numeric', 'text', 'text']}
          headings={['Date', 'Description', 'Montant', 'Statut', 'Action']}
          rows={[
            ['22 avr. 2026', `Forfait ${settings.plan_name || 'Starter'} — Avril 2026`, `${settings.plan_price || 29},00 €`, 'Payée', 'Télécharger'],
            ['22 mar. 2026', `Forfait ${settings.plan_name || 'Starter'} — Mars 2026`, `${settings.plan_price || 29},00 €`, 'Payée', 'Télécharger'],
            ['22 fév. 2026', `Forfait ${settings.plan_name || 'Starter'} — Février 2026`, `${settings.plan_price || 29},00 €`, 'Payée', 'Télécharger'],
          ]}
        />
      </Card>
    </BlockStack>
  )

  if (active === 'users') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h2" variant="headingMd" fontWeight="semibold">Membres de l&apos;équipe</Text>
            <Button icon={PlusIcon} variant="primary">Inviter un membre</Button>
          </InlineStack>
          <Divider />
          {[
            { name: 'Robin Dupont', email: 'robin@studionord.co', role: 'Propriétaire', avatar: 'R', status: 'Actif' },
            { name: 'Marie Lambert', email: 'marie@studionord.co', role: 'Employé', avatar: 'M', status: 'Actif' },
            { name: 'Thomas Blanc', email: 'thomas@studionord.co', role: 'Lecture seule', avatar: 'T', status: 'Invitation envoyée' },
          ].map((user, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="300" blockAlign="center">
                    <Avatar initials={user.avatar} name={user.name} />
                    <BlockStack gap="050">
                      <Text as="p" fontWeight="semibold">{user.name}</Text>
                      <Text as="p" variant="bodySm" tone="subdued">{user.email}</Text>
                    </BlockStack>
                  </InlineStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone={user.status === 'Actif' ? 'success' : 'attention'}>{user.status}</Badge>
                    <Text as="p" variant="bodySm" tone="subdued">{user.role}</Text>
                    <Button size="slim">Modifier</Button>
                  </InlineStack>
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingSm" fontWeight="semibold">Rôles et permissions</Text>
          {[
            { role: 'Propriétaire', desc: 'Accès complet à toutes les fonctionnalités et paramètres' },
            { role: 'Employé', desc: 'Accès aux commandes, produits, clients et analytics' },
            { role: 'Lecture seule', desc: 'Peut consulter mais pas modifier les données' },
          ].map((r, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '200' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{r.role}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{r.desc}</Text>
                  </BlockStack>
                  <Button size="slim" variant="plain">Modifier</Button>
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'payments') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="300">
          <InlineStack gap="200" blockAlign="center">
            <CreditCardIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Fournisseur de paiement</Text>
          </InlineStack>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <Text as="p" fontWeight="semibold">Merchant OS Payments</Text>
              <Text as="p" variant="bodySm" tone="subdued">Actif · Visa, Mastercard, Apple Pay, Google Pay</Text>
              <Text as="p" variant="bodySm" tone="subdued">Frais : 1,4% + 0,25 € par transaction</Text>
            </BlockStack>
            <Badge tone="success">Actif</Badge>
          </InlineStack>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Autres fournisseurs</Text>
          {[
            { name: 'Stripe', desc: 'Paiements en ligne 1,5% + 0,25€', field: 'stripe_enabled' as const },
            { name: 'PayPal', desc: 'PayPal, Pay Later, Venmo', field: 'paypal_enabled' as const },
            { name: 'Klarna', desc: 'Paiement en 3x 4x sans frais', field: 'klarna_enabled' as const },
          ].map((p, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '200' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{p.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{p.desc}</Text>
                  </BlockStack>
                  <Button size="slim" onClick={() => onChange(p.field, !settings[p.field])}>
                    {settings[p.field] ? 'Déconnecter' : 'Connecter'}
                  </Button>
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingSm" fontWeight="semibold">Paiements manuels</Text>
          {[
            { name: 'Virement bancaire', field: 'bank_transfer_enabled' as const },
            { name: 'Paiement à la livraison (COD)', field: 'cod_enabled' as const },
          ].map((m, i) => (
            <InlineStack key={i} align="space-between" blockAlign="center">
              <Text as="p" variant="bodySm">{m.name}</Text>
              <InlineStack gap="200">
                <Badge tone={settings[m.field] ? 'success' : undefined}>{settings[m.field] ? 'Activé' : 'Désactivé'}</Badge>
                <Button size="slim" variant="plain" onClick={() => onChange(m.field, !settings[m.field])}>
                  {settings[m.field] ? 'Désactiver' : 'Activer'}
                </Button>
              </InlineStack>
            </InlineStack>
          ))}
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'checkout') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Finalisation de commande</Text>
          <Text as="h3" variant="headingSm" fontWeight="semibold">Coordonnées client</Text>
          <Select
            label="Champs requis"
            options={[
              { label: 'E-mail uniquement', value: 'email' },
              { label: 'E-mail ou numéro de téléphone', value: 'email_phone' },
              { label: 'Numéro de téléphone uniquement', value: 'phone' },
            ]}
            value={settings.checkout_contact_method || 'email'}
            onChange={(v) => onChange('checkout_contact_method', v)}
          />
          <Checkbox label="Demander le prénom et le nom de famille séparément" checked={settings.checkout_separate_name} onChange={(v) => onChange('checkout_separate_name', v)} />
          <Checkbox label="Afficher une case pour les mises à jour marketing" checked={settings.checkout_marketing_optin} onChange={(v) => onChange('checkout_marketing_optin', v)} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Adresse de livraison</Text>
          <Checkbox label="Rendre le numéro de téléphone obligatoire" checked={settings.checkout_phone_required} onChange={(v) => onChange('checkout_phone_required', v)} />
          <Checkbox label="Pré-remplir les champs avec les infos enregistrées" checked={settings.checkout_prefill} onChange={(v) => onChange('checkout_prefill', v)} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Traitement des commandes</Text>
          <Select
            label="Après le paiement"
            options={[
              { label: 'Traiter automatiquement les commandes', value: 'true' },
              { label: 'Demander une confirmation manuelle', value: 'false' },
            ]}
            value={settings.checkout_auto_process ? 'true' : 'false'}
            onChange={(v) => onChange('checkout_auto_process', v === 'true')}
          />
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'accounts') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Comptes clients</Text>
          <Select
            label="Comptes clients"
            options={[
              { label: 'Désactivés', value: 'disabled' },
              { label: 'Facultatifs', value: 'optional' },
              { label: 'Obligatoires', value: 'required' },
            ]}
            value={settings.accounts_mode || 'optional'}
            onChange={(v) => onChange('accounts_mode', v)}
            helpText="Choisissez si les clients doivent créer un compte pour passer commande."
          />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Connexion client</Text>
          <Checkbox label="Activer la connexion sans mot de passe (lien magique)" checked={settings.accounts_magic_link} onChange={(v) => onChange('accounts_magic_link', v)} />
          <Checkbox label="Activer la connexion Google" checked={settings.accounts_google} onChange={(v) => onChange('accounts_google', v)} />
          <Checkbox label="Activer la connexion Facebook" checked={settings.accounts_facebook} onChange={(v) => onChange('accounts_facebook', v)} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Confidentialité</Text>
          <Checkbox label="Permettre aux clients de demander la suppression de leur compte" checked={settings.accounts_delete_request} onChange={(v) => onChange('accounts_delete_request', v)} />
          <Checkbox label="Afficher l'historique des commandes dans l'espace client" checked={settings.accounts_order_history} onChange={(v) => onChange('accounts_order_history', v)} />
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'shipping') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="300">
          <InlineStack gap="200" blockAlign="center">
            <ShippingLabelIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Expédition et livraison</Text>
          </InlineStack>
          {[
            { t: "Profil d'expédition général", s: "3 zones · 7 tarifs" },
            { t: "Expédition locale", s: "Non configurée" },
            { t: "Retrait en boutique", s: "Non configuré" },
          ].map((item, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{item.t}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{item.s}</Text>
                  </BlockStack>
                  <Button variant="plain" icon={ChevronRightIcon} />
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingSm" fontWeight="semibold">Transporteurs connectés</Text>
          {[
            { name: 'Colissimo (La Poste)', status: 'Actif' },
            { name: 'Mondial Relay', status: 'Actif' },
            { name: 'GLS France', status: 'Actif' },
            { name: 'DHL Express', status: 'Non connecté' },
          ].map((c, i) => (
            <InlineStack key={i} align="space-between" blockAlign="center">
              <Text as="p" variant="bodySm">{c.name}</Text>
              <InlineStack gap="200">
                <Badge tone={c.status === 'Actif' ? 'success' : undefined}>{c.status}</Badge>
                <Button size="slim" variant="plain">Configurer</Button>
              </InlineStack>
            </InlineStack>
          ))}
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'taxes') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="300">
          <InlineStack gap="200" blockAlign="center">
            <ReceiptEuroIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Taxes et droits de douane</Text>
          </InlineStack>
          {!settings.tax_oss_number && (
            <Banner tone="warning">
              <Text as="p" fontWeight="semibold">Configuration TVA UE requise</Text>
              <Text as="p" variant="bodySm">Configurez votre numéro OSS/IOSS pour les ventes en Europe.</Text>
            </Banner>
          )}
          <TextField
            label="Numéro OSS/IOSS"
            value={settings.tax_oss_number || ''}
            autoComplete="off"
            onChange={(v) => onChange('tax_oss_number', v)}
            placeholder="EU123456789"
            helpText="Obligatoire pour les ventes B2C en dehors de votre pays d'établissement."
          />
          <Checkbox label="Inclure les taxes dans les prix affichés" checked={settings.tax_included} onChange={(v) => onChange('tax_included', v)} />
          <Checkbox label="Facturer la taxe sur l'expédition" checked={settings.tax_on_shipping} onChange={(v) => onChange('tax_on_shipping', v)} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Taux par région</Text>
          {[
            ['France', '20% TVA standard', '10% réduit'],
            ['Allemagne', '19% TVA standard', '7% réduit'],
            ['Espagne', '21% IVA', '10% réduit'],
            ['Pays-Bas', '21% BTW', '9% réduit'],
            ['Belgique', '21% TVA', '6% réduit'],
          ].map(([country, standard, reduced], i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{country}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{standard} · {reduced}</Text>
                  </BlockStack>
                  <Button variant="plain" icon={ChevronRightIcon} />
                </InlineStack>
              </Box>
            </div>
          ))}
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'locations') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <LocationIcon width={16} height={16} />
              <Text as="h2" variant="headingMd" fontWeight="semibold">Emplacements</Text>
            </InlineStack>
            <Button icon={PlusIcon} variant="primary">Ajouter un emplacement</Button>
          </InlineStack>
          {(Array.isArray(settings.locations) && settings.locations.length > 0
            ? settings.locations as Array<{ name: string; address: string; type: string; default?: boolean }>
            : [
              { name: 'Valencia (Principal)', address: 'Calle Colón 12, 46004 Valencia, Espagne', type: 'Entrepôt', default: true },
              { name: 'App gelato', address: 'Gelato Print on Demand', type: 'Impression à la demande', default: false },
              { name: 'Paris — Atelier', address: '12 rue des Ateliers, 75011 Paris, France', type: 'Boutique physique', default: false },
            ]
          ).map((loc, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="p" fontWeight="semibold">{loc.name}</Text>
                      {loc.default && <Badge tone="info">Principal</Badge>}
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">{loc.address}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{loc.type}</Text>
                  </BlockStack>
                  <Button size="slim">Modifier</Button>
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'domains') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <GlobeIcon width={16} height={16} />
              <Text as="h2" variant="headingMd" fontWeight="semibold">Domaines</Text>
            </InlineStack>
            <Button icon={PlusIcon} variant="primary">Connecter un domaine</Button>
          </InlineStack>
          {[
            { domain: settings.primary_domain || 'example.com', type: 'Domaine principal', ssl: true, status: 'Connecté' },
            { domain: `www.${settings.primary_domain || 'example.com'}`, type: `Redirection → ${settings.primary_domain || 'example.com'}`, ssl: true, status: 'Actif' },
            { domain: `${settings.site_id}.mymerchant.com`, type: 'Domaine Merchant OS', ssl: true, status: 'Actif' },
          ].map((d, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="p" fontWeight="semibold">
                        <span style={{ fontFamily: 'monospace' }}>{d.domain}</span>
                      </Text>
                      {d.ssl && <Badge tone="success">SSL</Badge>}
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">{d.type}</Text>
                  </BlockStack>
                  <InlineStack gap="200" blockAlign="center">
                    <Badge tone={d.status === 'Connecté' ? 'success' : d.status === 'Actif' ? 'info' : 'attention'}>{d.status}</Badge>
                    <Button size="slim" variant="plain">Gérer</Button>
                  </InlineStack>
                </InlineStack>
              </Box>
            </div>
          ))}
          <Divider />
          <TextField label="Domaine principal" value={settings.primary_domain || ''} autoComplete="off" onChange={(v) => onChange('primary_domain', v)} />
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'notifications') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" blockAlign="center">
            <NotificationIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Notifications clients</Text>
          </InlineStack>
          <Text as="p" variant="bodySm" tone="subdued">Ces e-mails sont envoyés automatiquement à vos clients.</Text>
          {([
            { name: 'Confirmation de commande', field: 'notification_order_created', editable: true },
            { name: 'Commande expédiée', field: 'notification_order_shipped', editable: true },
            { name: 'Commande livrée', field: 'notification_order_delivered', editable: true },
            { name: 'Remboursement effectué', field: 'notification_refund', editable: true },
            { name: 'Panier abandonné', field: 'notification_abandoned_cart', editable: true },
            { name: 'Bienvenue client', field: 'notification_welcome', editable: true },
          ] as const).map((n, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '200' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm">{n.name}</Text>
                  <InlineStack gap="200">
                    <Badge tone={settings[n.field] ? 'success' : undefined}>{settings[n.field] ? 'Activé' : 'Désactivé'}</Badge>
                    {n.editable && <Button size="slim" variant="plain" onClick={() => onChange(n.field, !settings[n.field])}>
                      {settings[n.field] ? 'Désactiver' : 'Activer'}
                    </Button>}
                  </InlineStack>
                </InlineStack>
              </Box>
            </div>
          ))}
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="400">
          <Text as="h3" variant="headingSm" fontWeight="semibold">Notifications équipe</Text>
          <Text as="p" variant="bodySm" tone="subdued">Ces alertes sont envoyées à votre équipe interne.</Text>
          <TextField
            label="E-mail de l'équipe"
            value={settings.team_email || ''}
            autoComplete="off"
            onChange={(v) => onChange('team_email', v)}
            helpText="Toutes les alertes commande et stock seront envoyées ici."
          />
          {([
            { name: 'Nouvelle commande reçue', field: 'notification_order_paid' },
            { name: 'Stock critique (< 5 unités)', field: 'notification_stock_alert' },
            { name: 'Nouveau client inscrit', field: 'notification_new_customer' },
            { name: 'Rétrofacturation ouverte', field: 'notification_chargeback' },
          ] as const).map((n, i) => (
            <Checkbox key={i} label={n.name} checked={settings[n.field]} onChange={(v) => onChange(n.field, v)} />
          ))}
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'brand') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" blockAlign="center">
            <ImageIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Identité de marque</Text>
          </InlineStack>
          <BlockStack gap="200">
            <Text as="p" variant="bodySm" fontWeight="medium">Logo principal</Text>
            <div style={{
              width: 120, height: 60,
              border: '1.5px dashed #c4c4c4',
              borderRadius: 8,
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              background: '#fafafa',
            }}>
              <BlockStack gap="050" inlineAlign="center">
                <ImageIcon width={20} height={20} />
                <Text as="span" variant="bodySm" tone="subdued">Téléverser</Text>
              </BlockStack>
            </div>
          </BlockStack>
          <BlockStack gap="200">
            <Text as="p" variant="bodySm" fontWeight="medium">Favicon (32x32 px)</Text>
            <div style={{
              width: 48, height: 48,
              border: '1.5px dashed #c4c4c4',
              borderRadius: 8,
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              background: '#fafafa',
            }}>
              <Text as="span" variant="bodySm" tone="subdued">+</Text>
            </div>
          </BlockStack>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Couleurs de marque</Text>
          <InlineGrid columns={2} gap="300">
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" fontWeight="medium">Couleur principale</Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ width: 32, height: 32, borderRadius: 6, background: settings.brand_primary_color || '#1a1a1a', border: '1px solid #d0d0d0', cursor: 'pointer' }} />
                <TextField label="" labelHidden value={settings.brand_primary_color || '#1A1A1A'} autoComplete="off" onChange={(v) => onChange('brand_primary_color', v)} />
              </InlineStack>
            </BlockStack>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" fontWeight="medium">Couleur secondaire</Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ width: 32, height: 32, borderRadius: 6, background: settings.brand_secondary_color || '#f5f0eb', border: '1px solid #d0d0d0', cursor: 'pointer' }} />
                <TextField label="" labelHidden value={settings.brand_secondary_color || '#F5F0EB'} autoComplete="off" onChange={(v) => onChange('brand_secondary_color', v)} />
              </InlineStack>
            </BlockStack>
          </InlineGrid>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Typographie</Text>
          <Select
            label="Police des titres"
            options={[
              { label: 'Inter', value: 'inter' },
              { label: 'Playfair Display', value: 'playfair' },
              { label: 'Raleway', value: 'raleway' },
              { label: 'Montserrat', value: 'montserrat' },
            ]}
            value={settings.brand_heading_font || 'inter'}
            onChange={(v) => onChange('brand_heading_font', v)}
          />
          <Select
            label="Police du corps"
            options={[
              { label: 'Inter', value: 'inter' },
              { label: 'Georgia', value: 'georgia' },
              { label: 'Source Serif Pro', value: 'source-serif' },
            ]}
            value={settings.brand_body_font || 'inter'}
            onChange={(v) => onChange('brand_body_font', v)}
          />
          <SaveButton />
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'files') return (
    <BlockStack gap="400">
      <SaveBanner />
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <FolderIcon width={16} height={16} />
              <Text as="h2" variant="headingMd" fontWeight="semibold">Fichiers</Text>
            </InlineStack>
            <Button icon={PlusIcon} variant="primary">Téléverser des fichiers</Button>
          </InlineStack>
          <Text as="p" variant="bodySm" tone="subdued">
            Stockez vos images, vidéos et autres fichiers médias ici.
            Espace utilisé : <strong>142 Mo / 1 Go</strong>
          </Text>
          <div style={{
            background: '#f1f1f1',
            borderRadius: 8,
            height: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              width: '14%',
              height: '100%',
              background: 'var(--p-color-border-interactive)',
              borderRadius: 8,
            }} />
          </div>
        </BlockStack>
      </Card>
      <Card padding="0">
        <DataTable
          columnContentTypes={['text', 'text', 'numeric', 'text', 'text']}
          headings={['Nom', 'Type', 'Taille', 'Ajouté', 'Actions']}
          rows={[
            ['logo-studio-nord.png', 'PNG', '24 KB', '10 avr. 2026', 'Copier l\'URL'],
            ['banniere-homepage.jpg', 'JPEG', '1,2 MB', '8 avr. 2026', 'Copier l\'URL'],
            ['favicon.ico', 'ICO', '4 KB', '1 avr. 2026', 'Copier l\'URL'],
            ['presentation-produits.pdf', 'PDF', '3,8 MB', '28 mars 2026', 'Copier l\'URL'],
            ['og-image.jpg', 'JPEG', '280 KB', '25 mars 2026', 'Copier l\'URL'],
          ]}
        />
      </Card>
    </BlockStack>
  )

  return (
    <Card>
      <BlockStack gap="300" inlineAlign="center">
        <SettingsIcon width={40} height={40} />
        <Text as="h3" variant="headingMd">Section en cours de configuration</Text>
        <Text as="p" variant="bodySm" tone="subdued">Cette section sera bientôt disponible.</Text>
      </BlockStack>
    </Card>
  )
}

export default function SettingsPage() {
  const [active, setActive] = useState('general')
  const { activeSite } = useSite()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/settings?site=${activeSite}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur de chargement')
        return
      }
      const data = await res.json()
      setSettings(data)
    } catch {
      setError('Impossible de charger les paramètres')
    } finally {
      setLoading(false)
    }
  }, [activeSite])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleChange = (field: string, value: unknown) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, site_id: activeSite }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur de sauvegarde')
      } else {
        const data = await res.json()
        setSettings(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Impossible de sauvegarder')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <Page title="Paramètres" subtitle="Gérez votre boutique, votre compte et vos préférences.">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="300" inlineAlign="center">
                <Spinner size="large" />
                <Text as="p" variant="bodySm" tone="subdued">Chargement des paramètres...</Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  return (
    <Page
      title="Paramètres"
      subtitle="Gérez votre boutique, votre compte et vos préférences."
    >
      <Layout>
        <Layout.Section variant="oneThird">
          <Card padding="0">
            <Box padding="400" paddingBlockEnd="300">
              <InlineStack gap="300" blockAlign="center">
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, oklch(0.75 0.12 50), oklch(0.65 0.14 30))',
                  display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700
                }}>{(settings.store_name || 'S')[0].toUpperCase()}</div>
                <BlockStack gap="050">
                  <Text as="p" fontWeight="semibold">{settings.store_name || 'Ma boutique'}</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    <span style={{ fontFamily: 'monospace' }}>{settings.primary_domain || `${activeSite}.mymerchant.com`}</span>
                  </Text>
                </BlockStack>
              </InlineStack>
            </Box>
            <Divider />
            <BlockStack gap="050">
              {SETTINGS_NAV.map(item => (
                <Box key={item.key} padding="100" paddingInline="300">
                  <Button
                    variant={active === item.key ? 'secondary' : 'plain'}
                    fullWidth
                    textAlign="left"
                    onClick={() => setActive(item.key)}
                  >
                    {item.label}
                  </Button>
                </Box>
              ))}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <SettingContent
            active={active}
            settings={settings}
            onChange={handleChange}
            onSave={handleSave}
            saving={saving}
            saved={saved}
            error={error}
          />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
