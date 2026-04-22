'use client'
import React, { useState } from 'react'
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
} from '@shopify/polaris'
import {
  SettingsIcon,
  ShippingLabelIcon,
  CreditCardIcon,
  PersonFilledIcon,
  ReceiptEuroIcon,
  ChevronRightIcon,
  PlusIcon,
  EmailIcon,
  GlobeIcon,
  NotificationIcon,
  LocationIcon,
  ImageIcon,
  FolderIcon,
  ClipboardIcon,
} from '@shopify/polaris-icons'

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

function useSave() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  return { saving, saved, handleSave }
}

function SettingContent({ active }: { active: string }) {
  const { saving, saved, handleSave } = useSave()

  if (active === 'general') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Informations sur la boutique</Text>
          <TextField label="Nom de la boutique" value="Studio Nord & Co" autoComplete="off" onChange={() => {}} />
          <TextField label="E-mail du compte" type="email" value="hello@studionord.co" autoComplete="off" onChange={() => {}} />
          <TextField label="Numéro de téléphone" value="+33 1 42 00 00 00" autoComplete="off" onChange={() => {}} />
          <Select
            label="Devise"
            options={[
              { label: 'EUR — Euro', value: 'eur' },
              { label: 'USD — Dollar', value: 'usd' },
              { label: 'GBP — Livre sterling', value: 'gbp' },
            ]}
            value="eur"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingSm" fontWeight="semibold">Adresse de la boutique</Text>
          <TextField label="Adresse" value="12 rue des Ateliers" autoComplete="off" onChange={() => {}} />
          <InlineGrid columns={2} gap="300">
            <TextField label="Ville" value="Paris" autoComplete="off" onChange={() => {}} />
            <TextField label="Code postal" value="75011" autoComplete="off" onChange={() => {}} />
          </InlineGrid>
          <Select
            label="Pays"
            options={[{ label: 'France', value: 'fr' }, { label: 'Belgique', value: 'be' }, { label: 'Suisse', value: 'ch' }]}
            value="fr"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'plan') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Votre forfait actuel</Text>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="100">
              <InlineStack gap="200" blockAlign="center">
                <Text as="p" variant="headingLg" fontWeight="bold">Starter</Text>
                <Badge tone="success">Actif</Badge>
              </InlineStack>
              <Text as="p" variant="bodySm" tone="subdued">29 €/mois · Facturation mensuelle</Text>
              <Text as="p" variant="bodySm" tone="subdued">Renouvellement le 22 mai 2026</Text>
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
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd" fontWeight="semibold">Facturation</Text>
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <Text as="p" fontWeight="semibold">Plan actuel : Starter · 29 €/mois</Text>
              <Text as="p" variant="bodySm" tone="subdued">Prochaine facturation le 22 mai 2026</Text>
            </BlockStack>
            <Button>Gérer l&apos;abonnement</Button>
          </InlineStack>
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Méthode de paiement</Text>
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <div style={{ width: 36, height: 24, background: '#1A1F71', borderRadius: 4, display: 'grid', placeItems: 'center' }}>
                <Text as="span" variant="bodySm" fontWeight="bold" tone="caution">VISA</Text>
              </div>
              <BlockStack gap="0">
                <Text as="p" variant="bodySm" fontWeight="semibold">Visa se terminant par 8937</Text>
                <Text as="p" variant="bodySm" tone="subdued">Expire 09/2027</Text>
              </BlockStack>
            </InlineStack>
            <Button size="slim">Modifier</Button>
          </InlineStack>
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
            ['22 avr. 2026', 'Forfait Starter — Avril 2026', '29,00 €', 'Payée', 'Télécharger'],
            ['22 mar. 2026', 'Forfait Starter — Mars 2026', '29,00 €', 'Payée', 'Télécharger'],
            ['22 fév. 2026', 'Forfait Starter — Février 2026', '29,00 €', 'Payée', 'Télécharger'],
            ['22 jan. 2026', 'Forfait Starter — Janvier 2026', '29,00 €', 'Payée', 'Télécharger'],
          ]}
        />
      </Card>
    </BlockStack>
  )

  if (active === 'users') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
            { name: 'Stripe', desc: 'Paiements en ligne 1,5% + 0,25€', connected: false },
            { name: 'PayPal', desc: 'PayPal, Pay Later, Venmo', connected: false },
            { name: 'Klarna', desc: 'Paiement en 3x 4x sans frais', connected: false },
          ].map((p, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '200' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="050">
                    <Text as="p" fontWeight="semibold">{p.name}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">{p.desc}</Text>
                  </BlockStack>
                  <Button size="slim">Connecter</Button>
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
            { name: 'Virement bancaire', enabled: true },
            { name: 'Paiement à la livraison (COD)', enabled: false },
          ].map((m, i) => (
            <InlineStack key={i} align="space-between" blockAlign="center">
              <Text as="p" variant="bodySm">{m.name}</Text>
              <InlineStack gap="200">
                <Badge tone={m.enabled ? 'success' : undefined}>{m.enabled ? 'Activé' : 'Désactivé'}</Badge>
                <Button size="slim" variant="plain">{m.enabled ? 'Désactiver' : 'Activer'}</Button>
              </InlineStack>
            </InlineStack>
          ))}
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'checkout') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
            value="email"
            onChange={() => {}}
          />
          <Checkbox label="Demander le prénom et le nom de famille séparément" checked={false} onChange={() => {}} />
          <Checkbox label="Afficher une case pour les mises à jour marketing" checked={true} onChange={() => {}} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Adresse de livraison</Text>
          <Checkbox label="Rendre le numéro de téléphone obligatoire" checked={false} onChange={() => {}} />
          <Checkbox label="Pré-remplir les champs avec les infos enregistrées" checked={true} onChange={() => {}} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Traitement des commandes</Text>
          <Select
            label="Après le paiement"
            options={[
              { label: 'Traiter automatiquement les commandes', value: 'auto' },
              { label: 'Demander une confirmation manuelle', value: 'manual' },
            ]}
            value="auto"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'accounts') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
            value="optional"
            onChange={() => {}}
            helpText="Choisissez si les clients doivent créer un compte pour passer commande."
          />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Connexion client</Text>
          <Checkbox label="Activer la connexion sans mot de passe (lien magique)" checked={true} onChange={() => {}} />
          <Checkbox label="Activer la connexion Google" checked={false} onChange={() => {}} />
          <Checkbox label="Activer la connexion Facebook" checked={false} onChange={() => {}} />
          <Divider />
          <Text as="h3" variant="headingSm" fontWeight="semibold">Confidentialité</Text>
          <Checkbox label="Permettre aux clients de demander la suppression de leur compte" checked={true} onChange={() => {}} />
          <Checkbox label="Afficher l'historique des commandes dans l'espace client" checked={true} onChange={() => {}} />
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'shipping') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="300">
          <InlineStack gap="200" blockAlign="center">
            <ReceiptEuroIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Taxes et droits de douane</Text>
          </InlineStack>
          <Banner tone="warning">
            <Text as="p" fontWeight="semibold">Configuration TVA UE requise</Text>
            <Text as="p" variant="bodySm">Configurez votre numéro OSS/IOSS pour les ventes en Europe.</Text>
          </Banner>
          <TextField
            label="Numéro OSS/IOSS"
            value=""
            autoComplete="off"
            onChange={() => {}}
            placeholder="EU123456789"
            helpText="Obligatoire pour les ventes B2C en dehors de votre pays d'établissement."
          />
          <Checkbox label="Inclure les taxes dans les prix affichés" checked={true} onChange={() => {}} />
          <Checkbox label="Facturer la taxe sur l'expédition" checked={false} onChange={() => {}} />
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
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'locations') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <InlineStack gap="200" blockAlign="center">
              <LocationIcon width={16} height={16} />
              <Text as="h2" variant="headingMd" fontWeight="semibold">Emplacements</Text>
            </InlineStack>
            <Button icon={PlusIcon} variant="primary">Ajouter un emplacement</Button>
          </InlineStack>
          {[
            { name: 'Valencia (Principal)', address: 'Calle Colón 12, 46004 Valencia, Espagne', type: 'Entrepôt', default: true },
            { name: 'App gelato', address: 'Gelato Print on Demand', type: 'Impression à la demande', default: false },
            { name: 'Paris — Atelier', address: '12 rue des Ateliers, 75011 Paris, France', type: 'Boutique physique', default: false },
          ].map((loc, i) => (
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
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
            { domain: 'studionord.co', type: 'Domaine principal', ssl: true, status: 'Connecté' },
            { domain: 'www.studionord.co', type: 'Redirection → studionord.co', ssl: true, status: 'Actif' },
            { domain: 'studionord.mymerchant.com', type: 'Domaine Merchant OS', ssl: true, status: 'Actif' },
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
          <Banner tone="info">
            <Text as="p">Votre boutique est accessible sur <strong>studionord.co</strong>. Les visiteurs de <strong>www.studionord.co</strong> sont redirigés automatiquement.</Text>
          </Banner>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'notifications') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" blockAlign="center">
            <NotificationIcon width={16} height={16} />
            <Text as="h2" variant="headingMd" fontWeight="semibold">Notifications clients</Text>
          </InlineStack>
          <Text as="p" variant="bodySm" tone="subdued">Ces e-mails sont envoyés automatiquement à vos clients.</Text>
          {[
            { name: 'Confirmation de commande', enabled: true, editable: true },
            { name: 'Commande expédiée', enabled: true, editable: true },
            { name: 'Commande livrée', enabled: true, editable: true },
            { name: 'Remboursement effectué', enabled: true, editable: true },
            { name: 'Panier abandonné', enabled: true, editable: true },
            { name: 'Bienvenue client', enabled: false, editable: true },
            { name: 'Réinitialisation du mot de passe', enabled: true, editable: false },
          ].map((n, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <Box paddingBlockStart={i > 0 ? '200' : '0'}>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm">{n.name}</Text>
                  <InlineStack gap="200">
                    <Badge tone={n.enabled ? 'success' : undefined}>{n.enabled ? 'Activé' : 'Désactivé'}</Badge>
                    {n.editable && <Button size="slim" variant="plain">Modifier</Button>}
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
            value="equipe@studionord.co"
            autoComplete="off"
            onChange={() => {}}
            helpText="Toutes les alertes commande et stock seront envoyées ici."
          />
          {[
            { name: 'Nouvelle commande reçue', enabled: true },
            { name: 'Stock critique (< 5 unités)', enabled: true },
            { name: 'Nouveau client inscrit', enabled: false },
            { name: 'Rétrofacturation ouverte', enabled: true },
          ].map((n, i) => (
            <Checkbox key={i} label={n.name} checked={n.enabled} onChange={() => {}} />
          ))}
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'brand') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
            <Text as="p" variant="bodySm" fontWeight="medium">Favicon (32×32 px)</Text>
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
                <div style={{ width: 32, height: 32, borderRadius: 6, background: '#1a1a1a', border: '1px solid #d0d0d0', cursor: 'pointer' }} />
                <TextField label="" labelHidden value="#1A1A1A" autoComplete="off" onChange={() => {}} />
              </InlineStack>
            </BlockStack>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" fontWeight="medium">Couleur secondaire</Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ width: 32, height: 32, borderRadius: 6, background: '#f5f0eb', border: '1px solid #d0d0d0', cursor: 'pointer' }} />
                <TextField label="" labelHidden value="#F5F0EB" autoComplete="off" onChange={() => {}} />
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
            value="inter"
            onChange={() => {}}
          />
          <Select
            label="Police du corps"
            options={[
              { label: 'Inter', value: 'inter' },
              { label: 'Georgia', value: 'georgia' },
              { label: 'Source Serif Pro', value: 'source-serif' },
            ]}
            value="inter"
            onChange={() => {}}
          />
          <InlineStack>
            <Button variant="primary" loading={saving} onClick={handleSave}>Enregistrer</Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  )

  if (active === 'files') return (
    <BlockStack gap="400">
      {saved && <Banner tone="success" onDismiss={() => {}}>Modifications enregistrées ✓</Banner>}
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
                }}>S</div>
                <BlockStack gap="050">
                  <Text as="p" fontWeight="semibold">Studio Nord &amp; Co</Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    <span style={{ fontFamily: 'monospace' }}>studionord.co</span>
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
          <SettingContent active={active} />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
