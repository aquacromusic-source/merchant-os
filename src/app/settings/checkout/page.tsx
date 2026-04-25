'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  TextField,
  Banner,
  Divider,
  Box,
  Checkbox,
} from '@shopify/polaris'
import { useSite } from '@/contexts/SiteContext'

interface CheckoutSettings {
  stripe: { secretKeyConfigured: boolean; publishableKeyConfigured: boolean }
  googleMaps: { apiKeyConfigured: boolean }
  endpoints: { shipping: string; payment: string }
}

export default function CheckoutSettingsPage() {
  const { activeSite } = useSite()
  const [settings, setSettings] = useState<CheckoutSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true)
  const [applePayEnabled, setApplePayEnabled] = useState(false)
  const [googlePayEnabled, setGooglePayEnabled] = useState(false)
  const [googleMapsKey, setGoogleMapsKey] = useState('********')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/checkout/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const shippingSnippet = `fetch('${baseUrl}/api/checkout/shipping?site=${activeSite}&country=FR')
  .then(r => r.json())
  .then(data => console.log(data.options))`

  const paymentSnippet = `fetch('${baseUrl}/api/checkout/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 29.99,
    currency: 'eur',
    site: '${activeSite}'
  })
})`

  return (
    <Page
      title="Parametres du checkout"
      backAction={{ content: 'Parametres', url: '/settings' }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* API Endpoints Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd" fontWeight="semibold">
                  Points d&apos;acces API
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  URLs a integrer dans vos storefronts externes pour le checkout.
                </Text>

                <BlockStack gap="300">
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" fontWeight="semibold">
                          Tarifs de livraison
                        </Text>
                        <Text as="p" variant="bodySm">
                          <span style={{ fontFamily: 'monospace' }}>
                            GET {baseUrl}/api/checkout/shipping?site={activeSite}&amp;country=FR
                          </span>
                        </Text>
                      </BlockStack>
                      <Button
                        size="slim"
                        onClick={() =>
                          copyToClipboard(
                            `${baseUrl}/api/checkout/shipping?site=${activeSite}&country=FR`,
                            'shipping'
                          )
                        }
                      >
                        {copied === 'shipping' ? 'Copie !' : 'Copier'}
                      </Button>
                    </InlineStack>
                  </Box>

                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" fontWeight="semibold">
                          Paiement (Stripe PaymentIntent)
                        </Text>
                        <Text as="p" variant="bodySm">
                          <span style={{ fontFamily: 'monospace' }}>
                            POST {baseUrl}/api/checkout/payment
                          </span>
                        </Text>
                      </BlockStack>
                      <Button
                        size="slim"
                        onClick={() =>
                          copyToClipboard(
                            `${baseUrl}/api/checkout/payment`,
                            'payment'
                          )
                        }
                      >
                        {copied === 'payment' ? 'Copie !' : 'Copier'}
                      </Button>
                    </InlineStack>
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Google Places Autocomplete Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd" fontWeight="semibold">
                  Google Places Autocomplete
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Activez l&apos;autocompletion d&apos;adresse dans le formulaire de checkout
                  pour ameliorer l&apos;experience utilisateur.
                </Text>

                <TextField
                  label="Cle API Google Maps"
                  value={googleMapsKey}
                  onChange={setGoogleMapsKey}
                  autoComplete="off"
                  type="password"
                  helpText="Ajoutez votre cle API Google Maps dans les variables d'environnement Vercel sous NEXT_PUBLIC_GOOGLE_MAPS_KEY"
                />

                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm">
                    Statut de la cle
                  </Text>
                  {settings?.googleMaps.apiKeyConfigured ? (
                    <Badge tone="success">Configuree</Badge>
                  ) : (
                    <Badge tone="attention">Non configuree</Badge>
                  )}
                </InlineStack>

                <Checkbox
                  label="Activer l'autocompletion Google Places"
                  checked={autocompleteEnabled}
                  onChange={setAutocompleteEnabled}
                  helpText="Suggere automatiquement des adresses pendant la saisie."
                />
              </BlockStack>
            </Card>

            {/* Paiements Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd" fontWeight="semibold">
                  Paiements
                </Text>

                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm">
                      Stripe Secret Key
                    </Text>
                    {settings?.stripe.secretKeyConfigured ? (
                      <Badge tone="success">Connecte</Badge>
                    ) : (
                      <Badge tone="critical">Non configure</Badge>
                    )}
                  </InlineStack>

                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm">
                      Stripe Publishable Key
                    </Text>
                    {settings?.stripe.publishableKeyConfigured ? (
                      <Badge tone="success">Connecte</Badge>
                    ) : (
                      <Badge tone="critical">Non configure</Badge>
                    )}
                  </InlineStack>
                </BlockStack>

                <Divider />

                <Text as="h3" variant="headingSm" fontWeight="semibold">
                  Methodes de paiement express
                </Text>

                <Checkbox
                  label="Apple Pay"
                  checked={applePayEnabled}
                  onChange={setApplePayEnabled}
                  helpText="Necessite la verification du domaine dans le tableau de bord Stripe. Ajoutez le fichier apple-developer-merchantid-domain-association dans .well-known/."
                />

                <Checkbox
                  label="Google Pay"
                  checked={googlePayEnabled}
                  onChange={setGooglePayEnabled}
                  helpText="Active automatiquement lorsque les methodes de paiement automatiques sont activees dans Stripe."
                />

                {!settings?.stripe.secretKeyConfigured && (
                  <Banner tone="warning">
                    <Text as="p" variant="bodySm">
                      Configurez STRIPE_SECRET_KEY et NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans vos
                      variables d&apos;environnement Vercel pour activer les paiements.
                    </Text>
                  </Banner>
                )}
              </BlockStack>
            </Card>

            {/* Persistance donnees checkout Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd" fontWeight="semibold">
                  Persistance des donnees checkout
                </Text>

                <Text as="p" variant="bodySm" tone="subdued">
                  Les donnees de checkout (adresse, mode de livraison) sont
                  sauvegardees dans le localStorage du navigateur du client.
                </Text>

                <Banner tone="info">
                  <BlockStack gap="200">
                    <Text as="p" variant="bodySm">
                      Lorsqu&apos;un client revient sur votre storefront, ses informations de
                      livraison et ses preferences sont automatiquement restaurees depuis le
                      localStorage.
                    </Text>
                    <Text as="p" variant="bodySm">
                      Cela permet de reduire les abandons de panier en evitant au client de
                      re-saisir ses informations a chaque visite.
                    </Text>
                  </BlockStack>
                </Banner>

                <BlockStack gap="200">
                  <Text as="p" variant="bodySm" fontWeight="semibold">
                    Donnees persistees :
                  </Text>
                  <Text as="p" variant="bodySm">
                    - Adresse de livraison
                  </Text>
                  <Text as="p" variant="bodySm">
                    - Mode de livraison selectionne
                  </Text>
                  <Text as="p" variant="bodySm">
                    - Adresse e-mail du client
                  </Text>
                  <Text as="p" variant="bodySm">
                    - Numero de telephone
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Exemple d'integration Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd" fontWeight="semibold">
                  Exemple d&apos;integration
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Utilisez ces extraits de code dans votre storefront pour integrer le checkout.
                </Text>

                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      Recuperer les options de livraison
                    </Text>
                    <Button
                      size="slim"
                      onClick={() => copyToClipboard(shippingSnippet, 'snippet-shipping')}
                    >
                      {copied === 'snippet-shipping' ? 'Copie !' : 'Copier'}
                    </Button>
                  </InlineStack>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <pre
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {shippingSnippet}
                    </pre>
                  </Box>
                </BlockStack>

                <Divider />

                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      Creer un PaymentIntent
                    </Text>
                    <Button
                      size="slim"
                      onClick={() => copyToClipboard(paymentSnippet, 'snippet-payment')}
                    >
                      {copied === 'snippet-payment' ? 'Copie !' : 'Copier'}
                    </Button>
                  </InlineStack>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <pre
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {paymentSnippet}
                    </pre>
                  </Box>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
