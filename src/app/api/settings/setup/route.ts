import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!

const MIGRATION_SQL = `-- Run this SQL in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,

  -- Informations générales
  store_name text,
  store_email text,
  store_phone text,
  store_currency text DEFAULT 'EUR',
  store_timezone text DEFAULT 'Europe/Paris',
  store_language text DEFAULT 'fr',

  -- Adresse
  address_line1 text,
  address_line2 text,
  address_city text,
  address_zip text,
  address_country text DEFAULT 'FR',

  -- Paiements
  stripe_enabled boolean DEFAULT false,
  paypal_enabled boolean DEFAULT false,
  klarna_enabled boolean DEFAULT false,
  bank_transfer_enabled boolean DEFAULT true,
  cod_enabled boolean DEFAULT false,

  -- Notifications
  notification_email_enabled boolean DEFAULT true,
  notification_sms_enabled boolean DEFAULT false,
  notification_order_created boolean DEFAULT true,
  notification_order_paid boolean DEFAULT true,
  notification_order_shipped boolean DEFAULT true,
  notification_order_delivered boolean DEFAULT true,
  notification_refund boolean DEFAULT true,
  notification_abandoned_cart boolean DEFAULT true,
  notification_welcome boolean DEFAULT false,
  notification_stock_alert boolean DEFAULT true,
  notification_new_customer boolean DEFAULT false,
  notification_chargeback boolean DEFAULT true,
  team_email text,

  -- Checkout
  checkout_contact_method text DEFAULT 'email',
  checkout_separate_name boolean DEFAULT false,
  checkout_marketing_optin boolean DEFAULT true,
  checkout_phone_required boolean DEFAULT false,
  checkout_prefill boolean DEFAULT true,
  checkout_auto_process boolean DEFAULT true,

  -- Comptes clients
  accounts_mode text DEFAULT 'optional',
  accounts_magic_link boolean DEFAULT true,
  accounts_google boolean DEFAULT false,
  accounts_facebook boolean DEFAULT false,
  accounts_delete_request boolean DEFAULT true,
  accounts_order_history boolean DEFAULT true,

  -- Taxes
  tax_enabled boolean DEFAULT true,
  tax_rate numeric DEFAULT 20,
  tax_included boolean DEFAULT true,
  tax_on_shipping boolean DEFAULT false,
  tax_oss_number text,

  -- SEO
  seo_title text,
  seo_description text,
  seo_keywords text,

  -- Domaines
  primary_domain text,
  custom_domains jsonb DEFAULT '[]',

  -- Marque
  brand_primary_color text DEFAULT '#1a1a1a',
  brand_secondary_color text DEFAULT '#f5f0eb',
  brand_heading_font text DEFAULT 'inter',
  brand_body_font text DEFAULT 'inter',

  -- Plan & Facturation
  plan_name text DEFAULT 'Starter',
  plan_price numeric DEFAULT 29,
  plan_status text DEFAULT 'active',
  plan_renewal_date text,
  billing_email text,
  billing_card_last4 text,
  billing_card_expiry text,
  billing_card_brand text DEFAULT 'Visa',

  -- Emplacements
  locations jsonb DEFAULT '[]',

  -- Métadonnées
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(site_id)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: full access for service_role
CREATE POLICY "Settings full access service_role" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings for 3 sites
INSERT INTO settings (site_id, store_name, store_email, store_currency, primary_domain) VALUES
  ('gaming-posters', 'Gaming Posters', 'contact@gamingposters.com', 'EUR', 'gamingposters.com'),
  ('strap', 'STRAP.', 'contact@strap.com', 'EUR', 'strap-store.com'),
  ('pdf-guide-store', 'PDF Guide Store', 'contact@pdfguidestore.com', 'EUR', 'pdfguidestore.com')
ON CONFLICT (site_id) DO NOTHING;`

export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?limit=0`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    })

    const tableExists = res.ok

    let rowCount = 0
    if (tableExists) {
      const countRes = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=id`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'count=exact',
        },
      })
      rowCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0')
    }

    return NextResponse.json({
      table_exists: tableExists,
      row_count: rowCount,
      ...(tableExists ? {} : { migration_sql: MIGRATION_SQL }),
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg, table_exists: false }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({
    migration_sql: MIGRATION_SQL,
    instructions: 'Copy the SQL above and run it in Supabase Dashboard > SQL Editor.',
  })
}
