-- Ajouter colonnes vendor, seo, images pour STRAP. et PDF Guide Store

-- STRAP. (kettel_products)
ALTER TABLE kettel_products 
ADD COLUMN IF NOT EXISTS vendor TEXT DEFAULT 'STRAP.',
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_desc TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- PDF Guide Store (guides)
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS vendor TEXT DEFAULT 'PDF Guide Store',
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_desc TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Note: la colonne images[] existe déjà pour kettel_products
-- Si besoin pour guides:
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
