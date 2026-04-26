-- Table product_variants (variantes produit, partagée entre tous les sites)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  site TEXT NOT NULL DEFAULT 'gaming-posters',
  option1_name TEXT DEFAULT 'Size',
  option1_value TEXT,
  option2_name TEXT DEFAULT 'Frame',
  option2_value TEXT,
  sku TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  compare_at_price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  barcode TEXT,
  weight_grams INTEGER,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id, site);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku) WHERE sku IS NOT NULL AND sku != '';

-- Ajouter colonnes collections et channels aux tables produit
ALTER TABLE posters
ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;

ALTER TABLE kettel_products
ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;

ALTER TABLE guides
ADD COLUMN IF NOT EXISTS collections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '[]'::jsonb;
