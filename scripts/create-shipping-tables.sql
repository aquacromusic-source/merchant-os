-- Tables pour Expédition et Livraison

-- Table zones d'expédition (pays/régions)
CREATE TABLE IF NOT EXISTS shipping_zones (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL, -- 'gaming-posters' | 'strap' | 'pdf-guide-store'
  name TEXT NOT NULL, -- ex: 'France', 'European Union', 'International'
  countries JSONB DEFAULT '[]'::jsonb, -- ['FR', 'DE', 'ES']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table tarifs d'expédition
CREATE TABLE IF NOT EXISTS shipping_rates (
  id TEXT PRIMARY KEY,
  zone_id TEXT REFERENCES shipping_zones(id) ON DELETE CASCADE,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL, -- ex: 'Standard', 'Express'
  carrier TEXT, -- ex: 'Colissimo', 'Chronopost', 'GLS'
  price NUMERIC NOT NULL,
  min_order NUMERIC DEFAULT 0, -- Commande minimum
  max_order NUMERIC, -- Commande maximum (optionnel)
  delivery_time TEXT, -- ex: '2-3 jours ouvrés'
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table marchés (pour la page Marchés)
CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL, -- ex: 'France', 'Germany'
  code TEXT NOT NULL, -- ex: 'FR', 'DE'
  currency TEXT DEFAULT 'EUR',
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_shipping_zones_site ON shipping_zones(site_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone ON shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_site ON shipping_rates(site_id);
CREATE INDEX IF NOT EXISTS idx_markets_site ON markets(site_id);
