CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'gaming-posters',
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  countries JSONB DEFAULT '[]',
  currency TEXT DEFAULT 'EUR',
  language TEXT DEFAULT 'fr',
  domain TEXT,
  tax_config JSONB DEFAULT '{"tax_included": true, "vat_rate": 20}',
  shipping_config JSONB DEFAULT '{}',
  payment_methods JSONB DEFAULT '["stripe"]',
  fulfillment_center TEXT,
  active_products JSONB DEFAULT '[]',
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_markets_site ON markets(site_id);
