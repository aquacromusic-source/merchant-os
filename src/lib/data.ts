// Merchant OS — Mock Data (TypeScript)

export type SiteId = 'gaming-posters' | 'strap' | 'pdf-guide-store'

const SITE_IDS: SiteId[] = ['gaming-posters', 'strap', 'pdf-guide-store']

export interface Product {
  id: string
  title: string
  category: string
  price: number
  stock: number
  status: 'live' | 'draft' | 'archived'
  sku: string
  variants: number
  channels: number
  markets: number
  vendor: string
  type: string
  collections: number
  updated: string
  site_id: SiteId
}

export interface Customer {
  id: string
  name: string
  email: string
  orders: number
  spend: number
  lastOrder: string
  city: string
  country: string
  tags: string[]
  subscribed: boolean
  status: string
  site_id: SiteId
}

export interface OrderStatus {
  key: string
  label: string
  tone: string
}

export interface Order {
  id: string
  date: string
  customer: string
  customerId: string
  email: string
  items: number
  total: number
  currency: string
  payment: OrderStatus
  fulfill: OrderStatus
  ship: string
  channel: string
  tags: string[]
  risk: 'low' | 'medium' | 'high'
  location: string
  site_id: SiteId
}

export interface Collection {
  id: string
  title: string
  products: number
  type: string
  updated: string
  status: string
}

export interface Discount {
  code: string
  descr: string
  type: string
  kind: string
  status: string
  uses: number
}

export interface App {
  id: string
  name: string
  descr: string
  pinned: boolean
  status: string
  author: string
}

export interface AppMarket {
  id: string
  name: string
  descr: string
  tag: string
}

export interface Campaign {
  name: string
  channel: string
  status: string
  sent: number | null
  rate: string
  rev: number
  date: string
}

export interface Location {
  id: string
  name: string
  city: string
  role: string
  items: number
  orders: string
}

export interface Page {
  title: string
  url: string
  status: string
  updated: string
}

export interface Article {
  title: string
  author: string
  status: string
  date: string
  read: string
}

export interface Channel {
  id: string
  name: string
  descr: string
  status: string
  kind: string
}

export interface Analytics {
  timeseries: number[]
  sessions: number[]
  orders: number[]
  aov: number[]
  cvr: number[]
  channelsMix: { name: string; share: number; sessions: number; orders: number; rev: number }[]
  topProducts: { name: string; units: number; rev: number }[]
  countries: { name: string; share: number }[]
}

const FIRST_NAMES = ["Liam","Nora","Elias","Mila","Ivo","Clara","Arun","Sana","Yuki","Noa","Kofi","Anika","Theo","Ines","Juno","Rafa","Minh","Luca","Amira","Remi","Kian","Selin","Dario","Maren","Oskar","Iris","Sven","Tariq","Jana","Pelle"]
const LAST_NAMES = ["Sexton","Borowiec","Paasche","Schuhmacher","Frank","Garger","Keene","Aliro","Tressing","Eras","Andoulsi","Desormiers","Koens","Gatzka","Pike","Mehta","Nakamura","Okafor","Lindqvist","Rossi","Navarro","Haidari","Petit","Okonkwo","Vasquez","Bauer","Halonen","El Amrani","Castro","Brinkmann"]
const CITIES = ["Paris","Berlin","Madrid","Milano","Lisboa","Dublin","Amsterdam","Warszawa","Wien","København","Helsinki","Athens","Prague","Zagreb","Edinburgh","Stockholm","Oslo","Valencia"]
const COUNTRIES = ["France","Germany","Spain","Italy","Portugal","Ireland","Netherlands","Poland","Austria","Denmark","Finland","Greece","Czechia","Croatia","UK","Sweden","Norway","Spain"]

const productSeeds: [string, string, number, number, Product['status']][] = [
  ["Pro Reel 900 Tote","Accessory",48.00,140,"live"],
  ["Riviera Oversized Sweater","Apparel",125.00,28,"live"],
  ["Field Notes Pocket Pad","Stationery",9.95,1240,"live"],
  ["Ember Ceramic Mug","Home",22.50,312,"live"],
  ["Nomad Roll-Top Backpack","Bags",189.00,52,"live"],
  ["Halftone Linen Cap","Apparel",39.00,96,"live"],
  ["Mill & Stone Cutting Board","Home",68.00,44,"draft"],
  ["Midnight Cold Brew 1L","Food",11.50,0,"live"],
  ["Atlas Wool Scarf","Apparel",74.00,112,"live"],
  ["Terra Studio Lamp","Home",246.00,14,"live"],
  ["Ridge Trail Running Tee","Apparel",52.00,180,"live"],
  ["Soft Cotton Crew Socks 3pk","Apparel",24.00,420,"live"],
  ["Clay French Press 1L","Home",96.00,38,"live"],
  ["Canvas Weekender Duffel","Bags",168.00,22,"live"],
  ["Field Pen Matte Black","Stationery",28.00,260,"live"],
  ["Roasted Single Origin 250g","Food",18.90,340,"live"],
  ["Nordic Raincoat","Apparel",235.00,18,"archived"],
  ["Studio Apron Charcoal","Apparel",54.00,72,"live"],
  ["Garden Snips Brass","Tools",38.00,63,"live"],
  ["Acacia Serving Bowl","Home",62.00,28,"live"],
  ["Utility Work Pant 2-pack","Apparel",118.00,48,"draft"],
  ["Lumen Bedside Lantern","Home",88.00,36,"live"],
  ["Corduroy Overshirt Olive","Apparel",128.00,26,"live"],
  ["Earl Grey Loose Leaf 120g","Food",14.50,210,"live"],
  ["Travel Kit Essentials","Accessory",54.00,84,"live"],
  ["Linen Table Runner","Home",46.00,92,"live"],
  ["Sunset Graphic Poster A2","Print",24.00,3,"live"],
  ["Woven Wool Blanket","Home",189.00,32,"live"],
  ["Heavyweight Sweatshirt","Apparel",98.00,164,"live"],
  ["Brass Keychain Loop","Accessory",18.00,520,"live"],
]

export const products: Product[] = productSeeds.map((s, i) => ({
  id: `P-${1000+i}`,
  title: s[0],
  category: s[1],
  price: s[2],
  stock: s[3],
  status: s[4],
  sku: `MOS-${1000+i}`,
  variants: 1 + (i % 8),
  channels: 3 + (i % 6),
  markets: 4 + (i % 5),
  vendor: i % 4 === 0 ? "Workshop No.7" : (i % 3 === 0 ? "Atelier Brun" : "House brand"),
  type: s[1],
  collections: i % 5 === 0 ? 2 : 1,
  updated: `Il y a ${1 + (i%22)} jours`,
  site_id: SITE_IDS[i % 3],
}))

export const customers: Customer[] = Array.from({ length: 26 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = LAST_NAMES[(i*3) % LAST_NAMES.length]
  const orders = 1 + ((i*7) % 9)
  const city = CITIES[(i*5) % CITIES.length]
  const country = COUNTRIES[(i*5) % COUNTRIES.length]
  return {
    id: `C-${2000+i}`,
    name: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g,"") + "@mail.co",
    orders,
    spend: +(orders * (28 + (i*5)%120)).toFixed(2),
    lastOrder: `Il y a ${1 + (i%28)}j`,
    city, country,
    tags: i % 4 === 0 ? ["VIP","Abonné"] : (i % 3 === 0 ? ["Gros panier"] : (i % 2 === 0 ? ["Nouveau"] : [])),
    subscribed: i % 3 !== 0,
    status: i % 11 === 0 ? "À risque" : "Actif",
    site_id: SITE_IDS[i % 3],
  }
})

const paymentStates: [string,string,string][] = [
  ["paid","Payée","ok"],
  ["paid","Payée","ok"],
  ["paid","Payée","ok"],
  ["paid","Payée","ok"],
  ["refunded","Remboursée","muted"],
  ["pending","En attente","warn"],
  ["authorized","Autorisée","info"],
  ["partial","Partielle","warn"],
]
const fulfillStates: [string,string,string][] = [
  ["fulfilled","Expédiée","ok"],
  ["fulfilled","Expédiée","ok"],
  ["fulfilled","Expédiée","ok"],
  ["unfulfilled","Non traitée","warn"],
  ["ready","Prête","info"],
  ["partial","Partielle","warn"],
  ["returned","Retournée","muted"],
]
const shipModes = [
  "EXPRESS · Livraison UPS","Relais GLS","Colissimo 48h","Chronopost J+1",
  "Standard · Mondial Relay","Retrait en magasin","VIP 24h · Livraison Premium",
]

export const orders: Order[] = Array.from({ length: 32 }, (_, i) => {
  const cust = customers[i % customers.length]
  const pay = paymentStates[(i*3) % paymentStates.length]
  const fulfill = fulfillStates[(i*2) % fulfillStates.length]
  const ship = shipModes[(i*5) % shipModes.length]
  const items = 1 + (i % 6)
  const total = +(items * (24 + (i*11) % 110) + 5).toFixed(2)
  const dateMap = ["Aujourd'hui · 09:28","Aujourd'hui · 08:14","Hier · 23:02","Hier · 21:48","Hier · 21:03","Hier · 20:46","Hier · 20:32","Hier · 20:22","Hier · 19:30","Hier · 19:15","Hier · 18:59","Hier · 18:28","Hier · 17:12","Hier · 12:41","Hier · 11:17","Hier · 09:01","Hier · 07:08","Hier · 03:14","Il y a 2j","Il y a 2j","Il y a 2j","Il y a 3j","Il y a 3j","Il y a 3j","Il y a 4j","Il y a 4j","Il y a 5j","Il y a 5j","Il y a 6j","Il y a 7j","Il y a 8j","Il y a 9j"]
  return {
    id: `#${16990 - i}`,
    date: dateMap[i],
    customer: cust.name,
    customerId: cust.id,
    email: cust.email,
    items,
    total,
    currency: "€",
    payment: { key: pay[0], label: pay[1], tone: pay[2] },
    fulfill: { key: fulfill[0], label: fulfill[1], tone: fulfill[2] },
    ship,
    channel: i % 7 === 0 ? "Point de vente" : (i % 4 === 0 ? "Instagram" : "Boutique en ligne"),
    tags: i % 9 === 0 ? ["Abonnement"] : (i % 5 === 0 ? ["Cadeau"] : []),
    risk: i % 13 === 0 ? "high" : (i % 7 === 0 ? "medium" : "low"),
    location: i % 3 === 0 ? "Valencia" : (i % 2 === 0 ? "Lille · Entrepôt A" : "Lyon · Studio"),
    site_id: SITE_IDS[i % 3],
  }
})

export const collections: Collection[] = [
  { id: "col-1", title: "Nouveautés printemps", products: 24, type: "Automatique", updated: "Hier", status: "live" },
  { id: "col-2", title: "Best-sellers", products: 18, type: "Automatique", updated: "Il y a 2j", status: "live" },
  { id: "col-3", title: "Édition limitée", products: 6, type: "Manuelle", updated: "Il y a 5j", status: "live" },
  { id: "col-4", title: "Pour la maison", products: 42, type: "Automatique", updated: "Il y a 1j", status: "live" },
  { id: "col-5", title: "Café & Thé", products: 15, type: "Manuelle", updated: "Il y a 3j", status: "live" },
  { id: "col-6", title: "Cadeaux < 50€", products: 32, type: "Automatique", updated: "Aujourd'hui", status: "live" },
  { id: "col-7", title: "Collection hivernale", products: 28, type: "Automatique", updated: "Il y a 22j", status: "archived" },
  { id: "col-8", title: "Accessoires", products: 19, type: "Manuelle", updated: "Il y a 4j", status: "live" },
  { id: "col-9", title: "Atelier maison", products: 11, type: "Manuelle", updated: "Il y a 9j", status: "draft" },
  { id: "col-10", title: "Ateliers & Kits", products: 7, type: "Manuelle", updated: "Il y a 12j", status: "live" },
]

export const discounts: Discount[] = [
  { code: "SPRING15", descr: "15% sur la totalité de la commande · achat min. 40€", type: "Code", kind: "% commande", status: "Actif", uses: 128 },
  { code: "FREESHIP50", descr: "Expédition gratuite · achat minimum 50€ · Pour tous les pays", type: "Code", kind: "Expédition gratuite", status: "Actif", uses: 942 },
  { code: "WELCOME10", descr: "10% pour les nouveaux clients · une utilisation par client", type: "Code", kind: "% commande", status: "Actif", uses: 1420 },
  { code: "BUNDLE2FOR35", descr: "Achetez 2 produits · réduction 20% · Exclut les collections Ateliers", type: "Automatique", kind: "Achat de X = Y", status: "Actif", uses: 86 },
  { code: "VIP25", descr: "25% sur la totalité · réservé au segment VIP", type: "Code", kind: "% commande", status: "Actif", uses: 42 },
  { code: "SUMMER12", descr: "12% sur les articles sélectionnés · plafond 40€", type: "Code", kind: "% produit", status: "Programmée", uses: 0 },
  { code: "EARLYBIRD", descr: "Offre anticipée · -20€ achat minimum 120€", type: "Code", kind: "Montant fixe", status: "Expirée", uses: 613 },
  { code: "FREEGIFT", descr: "Offrez un carnet Field Notes · achat minimum 60€", type: "Automatique", kind: "Cadeau offert", status: "Actif", uses: 51 },
  { code: "LOYAL100", descr: "100€ offerts après 5 commandes · clients fidèles", type: "Automatique", kind: "Montant fixe", status: "Actif", uses: 8 },
  { code: "FRIENDS20", descr: "20% pour les ambassadeurs · une utilisation par client", type: "Code", kind: "% commande", status: "Actif", uses: 29 },
  { code: "STUDIO5", descr: "5€ sur commande Studio · achat min 30€", type: "Code", kind: "Montant fixe", status: "Actif", uses: 204 },
  { code: "B2B10", descr: "10% grossistes · sur compte pro", type: "Code", kind: "% commande", status: "Actif", uses: 14 },
]

export const apps: App[] = [
  { id: "review-flow", name: "ReviewFlow", descr: "Avis produits, photos clients et rich snippets Google.", pinned: true, status: "Installée", author: "Fieldsmith" },
  { id: "ship-desk", name: "ShipDesk", descr: "Édition d'étiquettes multi-transporteurs, retours et API.", pinned: true, status: "Installée", author: "Cargobox" },
  { id: "subscribe", name: "SubscribeKit", descr: "Abonnements récurrents et gestion de la dunning.", pinned: true, status: "Installée", author: "Merchant OS" },
  { id: "mailbuilder", name: "MailBuilder", descr: "Automatisations e-mail et panier abandonné.", pinned: false, status: "Installée", author: "Merchant OS" },
  { id: "loyalty-hub", name: "Loyalty Hub", descr: "Programme de fidélité points, paliers, parrainage.", pinned: false, status: "Installée", author: "Fieldsmith" },
  { id: "tax-guard", name: "Tax Guard", descr: "Calcul TVA UE, OSS/IOSS et rapports comptables.", pinned: false, status: "Installée", author: "Numina" },
  { id: "stockpilot", name: "StockPilot", descr: "Prévision de stock et alertes SKU.", pinned: false, status: "Installée", author: "Merchant OS" },
  { id: "gift-cards", name: "Giftcard+", descr: "Cartes cadeaux avancées, personnalisation et relances.", pinned: false, status: "Installée", author: "Briza Labs" },
  { id: "po-light", name: "PO Light", descr: "Bons de commande fournisseurs et réconciliation.", pinned: false, status: "Installée", author: "Cargobox" },
  { id: "crmbridge", name: "CRM Bridge", descr: "Synchronisation Klaviyo, HubSpot, Brevo.", pinned: false, status: "Installée", author: "Fieldsmith" },
  { id: "tiktok-sync", name: "TikTok Sync", descr: "Catalogue produits TikTok Shop temps réel.", pinned: false, status: "Installée", author: "TikTok" },
  { id: "help-center", name: "Help Center", descr: "Base de connaissance et chat client.", pinned: false, status: "Installée", author: "Merchant OS" },
]

export const appsMarket: AppMarket[] = [
  { id: "bundler", name: "Bundler Pro", descr: "Packs et ventes croisées automatiques.", tag: "Marketing" },
  { id: "reviewr", name: "ReviewR Ultra", descr: "Avis vidéo et formulaires enrichis.", tag: "Contenu" },
  { id: "back-calc", name: "BackCalc", descr: "Calculs tarifs dégressifs complexes.", tag: "Pricing" },
  { id: "prefetch", name: "Prefetch CDN", descr: "Accélère les pages produit.", tag: "Perf" },
]

export const campaigns: Campaign[] = [
  { name: "Teasing collection printemps", channel: "Email", status: "En cours", sent: 42040, rate: "28%", rev: 12420, date: "Aujourd'hui" },
  { name: "Reciblage Meta panier", channel: "Meta Ads", status: "En cours", sent: null, rate: "—", rev: 8720, date: "Hier" },
  { name: "Newsletter hebdo n°14", channel: "Email", status: "Envoyée", sent: 58120, rate: "32%", rev: 9120, date: "Il y a 3j" },
  { name: "Campagne Google Performance", channel: "Google Ads", status: "En cours", sent: null, rate: "—", rev: 22410, date: "Il y a 4j" },
  { name: "Relance panier abandonné", channel: "Automation", status: "Active", sent: 12840, rate: "41%", rev: 6140, date: "Automatisé" },
  { name: "Lancement produit — Clay Press", channel: "Email", status: "Brouillon", sent: null, rate: "—", rev: 0, date: "—" },
  { name: "SMS flash week-end", channel: "SMS", status: "Programmée", sent: 8420, rate: "—", rev: 0, date: "Dans 2j" },
  { name: "Pinterest collections saison", channel: "Pinterest", status: "En cours", sent: null, rate: "—", rev: 3140, date: "Il y a 5j" },
]

export const locations: Location[] = [
  { id: "loc-lille", name: "Lille · Entrepôt A", city: "Lille, FR", role: "Primaire", items: 412, orders: "Actif" },
  { id: "loc-lyon", name: "Lyon · Studio", city: "Lyon, FR", role: "Studio", items: 184, orders: "Actif" },
  { id: "loc-valencia", name: "Valencia Hub", city: "Valencia, ES", role: "3PL", items: 290, orders: "Actif" },
  { id: "loc-nantes", name: "Nantes Pop-up", city: "Nantes, FR", role: "Point de vente", items: 42, orders: "Actif" },
  { id: "loc-berlin", name: "Berlin · Fulfilment", city: "Berlin, DE", role: "3PL", items: 158, orders: "Actif" },
]

export const pages: Page[] = [
  { title: "À propos", url: "/pages/about", status: "Publié", updated: "Il y a 4j" },
  { title: "Service client", url: "/pages/support", status: "Publié", updated: "Hier" },
  { title: "Livraison & retours", url: "/pages/shipping", status: "Publié", updated: "Il y a 9j" },
  { title: "Journal d'atelier", url: "/pages/journal", status: "Publié", updated: "Il y a 14j" },
  { title: "FAQ — Abonnements", url: "/pages/faq-subs", status: "Brouillon", updated: "Il y a 2j" },
  { title: "Programme de fidélité", url: "/pages/loyalty", status: "Programmée", updated: "—" },
  { title: "Mentions légales", url: "/pages/legal", status: "Publié", updated: "Il y a 22j" },
  { title: "Politique de confidentialité", url: "/pages/privacy", status: "Publié", updated: "Il y a 22j" },
]

export const articles: Article[] = [
  { title: "Comment nous sélectionnons nos matières", author: "Camille R.", status: "Publié", date: "12 avr 2026", read: "5 min" },
  { title: "Atelier carnets — dans les coulisses", author: "Julien B.", status: "Publié", date: "3 avr 2026", read: "7 min" },
  { title: "Notre partenariat avec Workshop No.7", author: "Camille R.", status: "Publié", date: "22 mar 2026", read: "4 min" },
  { title: "Prendre soin de votre sweat en coton", author: "Marie L.", status: "Brouillon", date: "—", read: "3 min" },
  { title: "Lancement printemps — notes", author: "Julien B.", status: "Programmée", date: "28 avr 2026", read: "6 min" },
  { title: "Pourquoi nous imprimons en France", author: "Camille R.", status: "Publié", date: "14 fév 2026", read: "5 min" },
]

export const channels: Channel[] = [
  { id: "online", name: "Boutique en ligne", descr: "Votre site Merchant OS publié.", status: "Connectée", kind: "online" },
  { id: "pos", name: "Point de vente", descr: "Terminal iPad, lecteur, tiroir-caisse.", status: "Connectée", kind: "pos" },
  { id: "insta", name: "Instagram Shop", descr: "Tag produits dans les publications et stories.", status: "Connectée", kind: "social" },
  { id: "fb", name: "Facebook Shop", descr: "Catalogue et boutique Meta.", status: "Connectée", kind: "social" },
  { id: "tiktok", name: "TikTok Shop", descr: "Catalogue temps réel et lives shopping.", status: "Connectée", kind: "social" },
  { id: "pint", name: "Pinterest Catalog", descr: "Épingles shopping & Rich Pins.", status: "Connectée", kind: "social" },
  { id: "yt", name: "YouTube Shopping", descr: "Tag produits dans vos vidéos.", status: "À connecter", kind: "social" },
  { id: "gmc", name: "Google Shopping", descr: "Flux produits Merchant Center.", status: "Connectée", kind: "mkt" },
  { id: "mkt-ebay", name: "Marketplace — eBay", descr: "Listing automatique.", status: "À connecter", kind: "mkt" },
  { id: "mkt-fnac", name: "Marketplace — Fnac", descr: "Flux catalogue et commandes.", status: "Suspendue", kind: "mkt" },
]

export const themes = {
  current: { name: "Atlas — Boutique officielle", version: "5.3.2 dispo", saved: "Aujourd'hui · 13:04" },
  drafts: [
    { name: "Atlas — Demo saisonnière", note: "Essai", saved: "Il y a 3 j", version: "1.0.0" },
    { name: "Atlas — Dark showroom", note: "Essai", saved: "Il y a 12 j", version: "1.2.0" },
    { name: "Atlas — Campagne printemps", note: "Essai", saved: "Il y a 18 j", version: "1.4.1" },
  ],
}

function sparkline(n: number, seed: number): number[] {
  const a: number[] = []
  let v = 40 + (seed % 30)
  for (let i = 0; i < n; i++) {
    v += (Math.sin((i+seed)*0.7) * 8) + (Math.cos(i*0.3)*4) + ((seed*13)%7 - 3)/2
    a.push(Math.max(5, Math.min(95, v)))
  }
  return a
}

export const analytics: Analytics = {
  timeseries: sparkline(30, 3),
  sessions: sparkline(30, 5),
  orders: sparkline(30, 9),
  aov: sparkline(30, 13),
  cvr: sparkline(30, 17),
  channelsMix: [
    { name: "Direct", share: 34, sessions: 15840, orders: 188, rev: 12420 },
    { name: "Recherche payante", share: 24, sessions: 11210, orders: 142, rev: 9840 },
    { name: "Social", share: 18, sessions: 8410, orders: 96, rev: 7240 },
    { name: "Recherche organique", share: 14, sessions: 6580, orders: 62, rev: 4120 },
    { name: "E-mail", share: 7, sessions: 3210, orders: 48, rev: 3180 },
    { name: "Référent", share: 3, sessions: 1420, orders: 16, rev: 1040 },
  ],
  topProducts: [
    { name: "Nomad Roll-Top Backpack", units: 146, rev: 27594 },
    { name: "Riviera Oversized Sweater", units: 112, rev: 14000 },
    { name: "Atlas Wool Scarf", units: 98, rev: 7252 },
    { name: "Ember Ceramic Mug", units: 214, rev: 4815 },
    { name: "Heavyweight Sweatshirt", units: 66, rev: 6468 },
    { name: "Roasted Single Origin 250g", units: 186, rev: 3515 },
    { name: "Soft Cotton Crew Socks 3pk", units: 210, rev: 5040 },
  ],
  countries: [
    { name: "France", share: 38 },
    { name: "Allemagne", share: 18 },
    { name: "Espagne", share: 14 },
    { name: "Pays-Bas", share: 9 },
    { name: "Italie", share: 7 },
    { name: "Belgique", share: 5 },
    { name: "Autre", share: 9 },
  ],
}

export const DATA = {
  products, customers, orders, collections, discounts, apps, appsMarket,
  campaigns, locations, pages, articles, channels, themes, analytics,
}
