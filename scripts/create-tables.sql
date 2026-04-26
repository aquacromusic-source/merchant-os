-- Table STRAP. (bracelets Kettel)
CREATE TABLE IF NOT EXISTS kettel_products (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  compare_price NUMERIC,
  description TEXT,
  full_description TEXT,
  sport TEXT,
  category TEXT,
  finish TEXT,
  badge TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  thumb_image TEXT,
  hero_image TEXT,
  cord_colors JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table PDF Guide Store
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  price NUMERIC NOT NULL,
  cover_url TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table commandes (pour les 3 BO)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL, -- 'gaming-posters' | 'strap' | 'pdf-guide-store'
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  items JSONB DEFAULT '[]'::jsonb,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table clients (pour les 3 BO)
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address JSONB,
  total_spent NUMERIC DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_orders_site ON orders(site_id);
CREATE INDEX IF NOT EXISTS idx_customers_site ON customers(site_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
