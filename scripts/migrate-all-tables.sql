-- Merchant OS — Full migration: create all missing tables
-- Run in Supabase SQL Editor or via /api/migrate endpoint

-- 1. Collections
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  products integer DEFAULT 0,
  type text DEFAULT 'Manual',
  status text DEFAULT 'live',
  updated text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_collections_site ON collections(site_id);

-- 2. Discounts
CREATE TABLE IF NOT EXISTS discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  code text NOT NULL,
  descr text,
  status text DEFAULT 'Actif',
  type text DEFAULT '% commande',
  kind text DEFAULT 'Code',
  uses integer DEFAULT 0,
  value numeric DEFAULT 0,
  min_amount numeric DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_discounts_site ON discounts(site_id);

-- 3. Channels
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  name text NOT NULL,
  status text DEFAULT 'Connectée',
  icon text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_channels_site ON channels(site_id);

-- 4. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  name text NOT NULL,
  channel text,
  status text DEFAULT 'Brouillon',
  sent integer DEFAULT 0,
  rate text,
  rev numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_campaigns_site ON campaigns(site_id);

-- 5. Blog posts (articles)
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  title text NOT NULL,
  content text,
  slug text NOT NULL,
  author text,
  status text DEFAULT 'Brouillon',
  date text,
  read text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_site ON blog_posts(site_id);

-- 6. Pages (CMS)
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  title text NOT NULL,
  content text,
  slug text NOT NULL,
  url text,
  status text DEFAULT 'Brouillon',
  updated text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pages_site ON pages(site_id);

-- 7. Themes
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  name text NOT NULL,
  version text,
  saved text,
  role text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_themes_site ON themes(site_id);

-- 8. Locations
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  name text NOT NULL,
  city text,
  role text DEFAULT 'Entrepôt',
  items integer DEFAULT 0,
  orders integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_locations_site ON locations(site_id);

-- 9. Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id text NOT NULL,
  event_type text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_site ON analytics_events(site_id);

-- RLS policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY IF NOT EXISTS "service_role_all_collections" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_discounts" ON discounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_channels" ON channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_pages" ON pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_themes" ON themes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_locations" ON locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "service_role_all_analytics_events" ON analytics_events FOR ALL USING (true) WITH CHECK (true);
