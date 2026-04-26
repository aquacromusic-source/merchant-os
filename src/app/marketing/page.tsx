'use client'
import React, { useState, useEffect } from 'react'
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
  Box,
  DataTable,
} from '@shopify/polaris'
import {
  PlusIcon,
  ChevronDownIcon,
  AutomationIcon,
  ChartVerticalIcon,
  ChevronRightIcon,
} from '@shopify/polaris-icons'
import { useSite } from '@/contexts/SiteContext'
import { money, fmt } from '@/lib/utils'

function campaignBadge(status: string) {
  const toneMap: Record<string, 'success' | 'warning' | 'info' | undefined> = {
    'En cours': 'success', 'Active': 'success', 'Envoyée': 'info', 'Brouillon': undefined, 'Planifiée': 'warning',
  }
  return <Badge tone={toneMap[status]}>{status}</Badge>
}

interface Campaign {
  name: string
  channel: string
  status: string
  sent: number | null
  rate: string
  rev: number | null
}

export default function MarketingPage() {
  const { activeSite } = useSite()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/marketing?site=${activeSite}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCampaigns(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeSite])

  const campaignRows = campaigns.map(c => [
    c.name,
    c.channel,
    campaignBadge(c.status),
    c.sent ? fmt(c.sent) : '—',
    c.rate,
    c.rev ? money(c.rev) : '—',
  ])

  const totalRev = campaigns.reduce((sum, c) => sum + (c.rev || 0), 0)

  return (
    <Page
      title="Marketing"
      subtitle="Campagnes, automatisations et attribution à travers vos canaux."
      primaryAction={{ content: 'Créer une campagne', icon: PlusIcon }}
      secondaryActions={[{ content: 'Autres actions', icon: ChevronDownIcon }]}
    >
      <BlockStack gap="500">
        <InlineGrid columns={5} gap="300">
          {[
            { l: 'Chiffre attribué', v: totalRev > 0 ? money(totalRev) : '0 €', d: '+18%' },
            { l: 'Impressions', v: '1,4 M', d: '+6%' },
            { l: 'Clics', v: '38 412', d: '+9%' },
            { l: 'ROAS moyen', v: '4,8 ×', d: '+0,3' },
            { l: 'Automatisations actives', v: '12' },
          ].map((k, i) => (
            <Card key={i}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">{k.l}</Text>
                <InlineStack gap="100" blockAlign="center">
                  <Text as="p" variant="headingMd" fontWeight="bold">{k.v}</Text>
                  {k.d && k.d}
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <Layout>
          <Layout.Section>
            {/* Campaigns table */}
            <Card padding="0">
              <Box padding="400" paddingBlockEnd="0">
                <Text as="h2" variant="headingSm" fontWeight="semibold">Campagnes</Text>
              </Box>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'numeric', 'numeric', 'numeric']}
                headings={['Campagne', 'Canal', 'Statut', 'Envoyées', 'Taux', 'Revenu']}
                rows={campaignRows}
              />
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              {/* Automations */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <InlineStack gap="200" blockAlign="center">
                      <AutomationIcon width={16} height={16} />
                      <Text as="h2" variant="headingSm" fontWeight="semibold">Automatisations</Text>
                    </InlineStack>
                    <Button variant="plain">Voir tout</Button>
                  </InlineStack>
                  {[
                    ["Bienvenue nouveaux abonnés", "Actif", "E-mail · 3 étapes", "2 140 contacts"],
                    ["Panier abandonné", "Actif", "E-mail + SMS · 4 étapes", "6 842 contacts"],
                    ["Anniversaire client", "Actif", "E-mail · 1 étape", "348 ce mois"],
                    ["Réactivation 60 jours", "Pause", "E-mail · 2 étapes", "—"],
                    ["Achat croisé post-commande", "Actif", "E-mail · 2 étapes", "1 024 envoyés"],
                  ].map((a, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <Box paddingBlockStart={i > 0 ? '300' : '0'}>
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="050">
                            <Text as="p" variant="bodySm" fontWeight="semibold">{a[0]}</Text>
                            <Text as="p" variant="bodySm" tone="subdued">{a[2]} · {a[3]}</Text>
                          </BlockStack>
                          <Badge tone={a[1] === 'Actif' ? 'success' : undefined}>{a[1]}</Badge>
                        </InlineStack>
                      </Box>
                    </div>
                  ))}
                </BlockStack>
              </Card>

              {/* Attribution */}
              <Card>
                <BlockStack gap="300">
                  <InlineStack gap="200" blockAlign="center">
                    <ChartVerticalIcon width={16} height={16} />
                    <Text as="h2" variant="headingSm" fontWeight="semibold">Attribution (derniers 30j)</Text>
                  </InlineStack>
                  {[
                    ["Recherche payante", 22310, "35,9%"],
                    ["Email", 18420, "29,6%"],
                    ["Social", 12120, "19,5%"],
                    ["Direct", 7210, "11,6%"],
                    ["Affiliation", 2080, "3,4%"],
                  ].map((row, i) => (
                    <BlockStack key={i} gap="100">
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodySm">{row[0]}</Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {money(row[1] as number)} · {row[2]}
                        </Text>
                      </InlineStack>
                      <div style={{ height: 6, borderRadius: 3, background: 'var(--p-color-bg-fill-tertiary)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: String(row[2]), background: 'var(--p-color-bg-fill-emphasis)', borderRadius: 3 }} />
                      </div>
                    </BlockStack>
                  ))}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  )
}
