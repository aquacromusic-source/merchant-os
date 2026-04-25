-- Migration: add vendor, seo_title, seo_desc, slug, images columns
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- posters: needs vendor
ALTER TABLE posters ADD COLUMN IF NOT EXISTS vendor text DEFAULT 'PIXELWALL';

-- kettel_products: needs vendor, seo_title, seo_desc, slug
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS vendor text DEFAULT 'STRAP.';
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS seo_desc text;
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE kettel_products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;

-- guides: needs vendor, seo_title, seo_desc, slug, images
ALTER TABLE guides ADD COLUMN IF NOT EXISTS vendor text DEFAULT 'PDF Guide Store';
ALTER TABLE guides ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS seo_desc text;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
