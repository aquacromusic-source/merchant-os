import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://depztempjsdlpnfcjxir.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcHp0ZW1wanNkbHBuZmNqeGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ1OTQwNiwiZXhwIjoyMDkyMDM1NDA2fQ.fldUtbH9jF6F1-Z-oKEp15xp1WSB4VsXnMm44n2olqE'
);

// Import Kettel products (depuis /Users/robin/kettel/src/lib/products.ts)
async function importKettelProducts() {
  const { PRODUCTS } = await import('../kettel-products-raw.ts');
  
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

  const { error } = await supabase
    .from('kettel_products')
    .insert(rows);

  if (error) {
    console.error('❌ Kettel import error:', error);
  } else {
    console.log(`✅ ${rows.length} produits STRAP. importés`);
  }
}

// Import PDF guides
async function importGuides() {
  const guides = [
    { id: 'guide-1', title: 'Gas Station', category: 'Automotive', price: 97, cover_url: '/covers/gas-station.jpg', description: 'Guide complet pour ouvrir une station-service', is_published: true },
    { id: 'guide-2', title: 'Bar à Tiramisu', category: 'Food & Beverage', price: 97, cover_url: '/covers/tiramisu.jpg', description: 'Guide pour lancer un bar à desserts', is_published: true },
    { id: 'guide-3', title: 'Hôtel pour Chien', category: 'Pet Services', price: 97, cover_url: '/covers/hotel-chien.jpg', description: 'Guide pour créer un hôtel canin', is_published: true },
    { id: 'guide-4', title: 'Bar à Cookie', category: 'Food & Beverage', price: 97, cover_url: '/covers/cookie.jpg', description: 'Guide pour ouvrir un cookie shop', is_published: true },
    { id: 'guide-5', title: 'Lancer de Haches', category: 'Entertainment', price: 97, cover_url: '/covers/haches.jpg', description: 'Guide pour lancer un bar à haches', is_published: true },
    { id: 'guide-6', title: 'Station Service', category: 'Automotive', price: 97, cover_url: '/covers/station-service.jpg', description: 'Guide station-service premium', is_published: true },
    { id: 'guide-7', title: 'Nettoyage Cryo', category: 'Services', price: 97, cover_url: '/covers/cryo.jpg', description: 'Guide nettoyage cryogénique', is_published: true },
    { id: 'guide-8', title: 'Café Moderne', category: 'Food & Beverage', price: 97, cover_url: '/covers/cafe.jpg', description: 'Guide pour ouvrir un café', is_published: true },
    { id: 'guide-9', title: 'Salle de Sport', category: 'Fitness', price: 97, cover_url: '/covers/gym.jpg', description: 'Guide pour créer une salle de sport', is_published: true },
    { id: 'guide-10', title: 'Food Truck', category: 'Food & Beverage', price: 97, cover_url: '/covers/foodtruck.jpg', description: 'Guide pour lancer un food truck', is_published: true },
    { id: 'guide-11', title: 'Coworking', category: 'Real Estate', price: 97, cover_url: '/covers/coworking.jpg', description: 'Guide pour ouvrir un espace coworking', is_published: true },
    { id: 'guide-12', title: 'Laverie Automatique', category: 'Services', price: 97, cover_url: '/covers/laverie.jpg', description: 'Guide laverie automatique', is_published: true },
    { id: 'guide-13', title: 'Escape Game', category: 'Entertainment', price: 97, cover_url: '/covers/escape.jpg', description: 'Guide pour créer un escape game', is_published: true },
    { id: 'guide-14', title: 'Restaurant Rapide', category: 'Food & Beverage', price: 97, cover_url: '/covers/fast-food.jpg', description: 'Guide restauration rapide', is_published: true },
    { id: 'guide-15', title: 'Salon de Thé', category: 'Food & Beverage', price: 97, cover_url: '/covers/salon-the.jpg', description: 'Guide pour ouvrir un salon de thé', is_published: true },
    { id: 'guide-16', title: 'Centre de Bien-être', category: 'Wellness', price: 97, cover_url: '/covers/wellness.jpg', description: 'Guide centre bien-être', is_published: true },
    { id: 'guide-17', title: 'Boulangerie', category: 'Food & Beverage', price: 97, cover_url: '/covers/boulangerie.jpg', description: 'Guide pour ouvrir une boulangerie', is_published: true },
    { id: 'guide-18', title: 'Auto-École', category: 'Education', price: 97, cover_url: '/covers/auto-ecole.jpg', description: 'Guide pour créer une auto-école', is_published: true }
  ];

  const { error } = await supabase
    .from('guides')
    .insert(guides);

  if (error) {
    console.error('❌ Guides import error:', error);
  } else {
    console.log(`✅ ${guides.length} guides PDF importés`);
  }
}

// Import test orders & customers
async function importTestData() {
  const orders = [
    {
      id: 'order-gaming-1',
      site_id: 'gaming-posters',
      customer_email: 'test@gaming.com',
      customer_name: 'Jean Dupont',
      total: 35.85,
      status: 'paid',
      items: [{ product_id: 'poster-123', title: 'Fight Club Poster', qty: 1, price: 11.95 }, { product_id: 'poster-456', title: 'GTA V Poster', qty: 2, price: 11.95 }],
      shipping_address: { country: 'France', city: 'Paris', zip: '75001' }
    },
    {
      id: 'order-strap-1',
      site_id: 'strap',
      customer_email: 'test@strap.com',
      customer_name: 'Marie Martin',
      total: 69,
      status: 'shipped',
      items: [{ product_id: 'shopify-4444348612677', title: 'Kettlebell Rose Gold', qty: 1, price: 69 }],
      shipping_address: { country: 'France', city: 'Lyon', zip: '69001' }
    },
    {
      id: 'order-pdf-1',
      site_id: 'pdf-guide-store',
      customer_email: 'test@guides.com',
      customer_name: 'Pierre Dubois',
      total: 97,
      status: 'delivered',
      items: [{ product_id: 'guide-1', title: 'Gas Station Guide', qty: 1, price: 97 }],
      shipping_address: null
    }
  ];

  const customers = [
    {
      id: 'customer-gaming-1',
      site_id: 'gaming-posters',
      email: 'test@gaming.com',
      name: 'Jean Dupont',
      phone: '+33612345678',
      address: { country: 'France', city: 'Paris', zip: '75001' },
      total_spent: 35.85,
      orders_count: 1
    },
    {
      id: 'customer-strap-1',
      site_id: 'strap',
      email: 'test@strap.com',
      name: 'Marie Martin',
      phone: '+33698765432',
      address: { country: 'France', city: 'Lyon', zip: '69001' },
      total_spent: 69,
      orders_count: 1
    },
    {
      id: 'customer-pdf-1',
      site_id: 'pdf-guide-store',
      email: 'test@guides.com',
      name: 'Pierre Dubois',
      phone: '+33611223344',
      address: null,
      total_spent: 97,
      orders_count: 1
    }
  ];

  const { error: ordersError } = await supabase.from('orders').insert(orders);
  const { error: customersError } = await supabase.from('customers').insert(customers);

  if (ordersError) console.error('❌ Orders import error:', ordersError);
  else console.log(`✅ ${orders.length} commandes test importées`);

  if (customersError) console.error('❌ Customers import error:', customersError);
  else console.log(`✅ ${customers.length} clients test importés`);
}

// Run all imports
(async () => {
  console.log('🚀 Import des données Supabase...\n');
  await importKettelProducts();
  await importGuides();
  await importTestData();
  console.log('\n✅ Import terminé !');
})();
