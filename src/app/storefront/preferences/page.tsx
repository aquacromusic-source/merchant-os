'use client'
import React from 'react'
import { Page, Layout, Card, BlockStack, Text, TextField, Button, Checkbox } from '@shopify/polaris'

export default function StorefrontPreferencesPage() {
  return (
    <Page title="Préférences" primaryAction={{ content: 'Enregistrer' }}>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Titre et méta-description</Text>
                <TextField label="Titre de la boutique" value="Studio Nord & Co — Objets durables pour la maison" autoComplete="off" />
                <TextField label="Méta-description" value="Objets durables, papeterie, café — conçus en France." autoComplete="off" multiline={3} />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Réseaux sociaux</Text>
                <TextField label="Instagram" value="@studionord.co" autoComplete="off" />
                <TextField label="Facebook" value="Studio Nord & Co" autoComplete="off" />
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Confidentialité</Text>
                <Checkbox label="Afficher la bannière de cookies" checked={true} onChange={() => {}} />
                <Checkbox label="Activer Google Analytics" checked={false} onChange={() => {}} />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingSm" fontWeight="semibold">Mot de passe</Text>
              <Text as="p" variant="bodySm" tone="subdued">Votre boutique est accessible au public.</Text>
              <Button>Activer le mot de passe</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
