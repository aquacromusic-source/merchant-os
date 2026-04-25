CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL DEFAULT 'gaming-posters',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_apps_site ON apps(site_id);
