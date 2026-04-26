import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../kettel-products.mjs';

const supabase = createClient(
  'https://depztempjsdlpnfcjxir.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHp0ZW1wanNkbHBuZmNqeGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTQwNiwiZXhwIjoyMDkyMDM1NDA2fQ.fldUtbH9jF6F1-Z-oKEp15xp1WSB4VsXnMm44n2olqE'
);

async function importKettelProducts() {
  console.log(`Importing ${PRODUCTS.length} Kettel products...`);
  
  const rows = PRODUCTS.map(p => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    subtitle: p.subtitle,
    price: p.price,
    compare_price: p.comparePrice || null,
    description: p.description,
    full_description: p.fullDescription,
    sport: p.sport,
    category: p.category,
    finish: p.finish,
    badge: p.badge || null,
    images: p.images,
    thumb_image: p.thumbImage,
    hero_image: p.heroImage,
    cord_colors: p.cordColors,
    featured: p.featured,
    tags: p.tags,
    specs: p.specs
  }));

  const { data, error } = await supabase
    .from('kettel_products')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('Import error:', error);
  } else {
    console.log(`✅ ${rows.length} products imported to kettel_products`);
  }
}

importKettelProducts();
