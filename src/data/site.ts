/**
 * ============================================================================
 *  CONFIGURATION CENTRALE DU SITE — AM Express Transport
 * ============================================================================
 *  👉 C'est ICI qu'on modifie les informations qui reviennent partout sur le
 *     site : nom, téléphone, WhatsApp, e-mail, menu de navigation, etc.
 *
 *  Pas besoin de toucher au reste du code : changez juste les valeurs
 *  ci-dessous entre les guillemets.
 * ============================================================================
 */

export const site = {
  /** Nom affiché de l'entreprise (logo texte, pied de page, SEO). */
  name: 'AM Express Transport',

  /** Activité (utile pour le SEO et les mentions légales à venir). */
  activite: 'Transport routier léger de marchandises (véhicules ≤ 3,5 t)',

  /** Petite phrase de présentation (sert au SEO et aux réseaux sociaux). */
  slogan: 'Transport léger de marchandises à Antibes et sur la Côte d\'Azur',

  /** Description par défaut pour les moteurs de recherche (~150 caractères). */
  description:
    "Besoin de transporter des marchandises sur la Côte d'Azur ? AM Express Transport, votre transporteur léger à Antibes. Devis gratuit sous 24 h.",

  // --- COORDONNÉES -----------------------------------------------------------

  /** Numéro de téléphone affiché (format lisible). */
  phoneDisplay: '07 69 72 54 64',
  /** Même numéro au format technique pour le clic-pour-appeler (sans espaces). */
  phoneLink: 'tel:0769725464',

  /** Lien WhatsApp (même numéro que le téléphone — à confirmer avec le client). */
  whatsapp: 'https://wa.me/33769725464',

  /** E-mail de contact (provisoire, proposé par le client). */
  email: 'contact@amexpress-transport.fr',

  /** Ville de rattachement. */
  ville: 'Antibes',
  /** Zone d'intervention principale. */
  zone: 'la Côte d\'Azur',
};

/**
 * MENU DE NAVIGATION (en-tête + pied de page).
 * Les pages autres que l'accueil seront créées dans les prochains sprints :
 * les liens peuvent déjà pointer vers elles.
 */
export const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services' },
  { label: "Zone d'intervention", href: '/zone' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

/**
 * LES 4 SERVICES.
 * Chaque service alimente À LA FOIS :
 *   - les cartes d'aperçu (accueil + page /services) : title, description, icon ;
 *   - sa page SEO dédiée (/services/<slug>) : metaTitle, metaDescription, h1, longText, ctaLabel.
 * `href` est calculé à partir du `slug`. Tarifs : tout est « sur devis ».
 */
export const services = [
  {
    slug: 'transport-pro',
    title: 'Transport pour professionnels (B2B)',
    description:
      "Livraisons et transferts de marchandises pour commerçants, restaurateurs, artisans et e-commerçants.",
    icon: 'truck',
    metaTitle:
      "Transport B2B pour professionnels — Antibes & Côte d'Azur | AM Express",
    metaDescription:
      "Transport léger pour commerçants, restaurateurs, agences et e-commerçants sur la Côte d'Azur. Service fiable et réactif. Devis gratuit sous 24 h.",
    h1: 'Transport de marchandises pour les professionnels',
    longText:
      "Commerçants, restaurateurs, artisans, agences immobilières ou e-commerçants — AM Express Transport assure vos livraisons et transferts de marchandises sur toute la Côte d'Azur. Un partenaire de confiance, réactif, pour ne jamais faire attendre vos clients. (Tarifs sur devis.)",
    ctaLabel: 'Demander un devis pro',
  },
  {
    slug: 'livraison-ecommerce',
    title: 'Livraison e-commerce',
    description:
      "Le dernier kilomètre pour votre boutique en ligne : rapide et soigné, à l'image de votre marque.",
    icon: 'bolt',
    metaTitle:
      "Livraison e-commerce & dernier kilomètre — Côte d'Azur | AM Express",
    metaDescription:
      "Solution de livraison locale pour votre boutique en ligne sur la Côte d'Azur. Dernier kilomètre rapide et soigné à Antibes, Nice, Cannes. Devis gratuit.",
    h1: "Livraison e-commerce sur la Côte d'Azur",
    longText:
      "Vous vendez en ligne et cherchez une livraison locale fiable ? Nous assurons le dernier kilomètre pour vos clients sur la Côte d'Azur, avec rapidité et soin. Idéal pour les boutiques locales qui veulent une livraison à leur image. (Sur devis.)",
    ctaLabel: 'Demander un devis e-commerce',
  },
  {
    slug: 'demenagement',
    title: 'Déménagement',
    description:
      "Petit déménagement, transport de meubles et cartons, sans les tarifs d'un gros déménageur.",
    icon: 'box',
    metaTitle:
      "Déménagement & transport de meubles — Antibes, Côte d'Azur | AM Express",
    metaDescription:
      "Petit déménagement, transport de meubles et cartons sur la Côte d'Azur. Service soigné et abordable à Antibes et alentours. Devis gratuit sous 24 h.",
    h1: 'Déménagement et transport de meubles',
    longText:
      "Un studio à déménager, quelques meubles à transporter, un encombrant à déplacer ? AM Express Transport propose une solution souple et soignée pour vos déménagements sur la Côte d'Azur, sans les tarifs d'un gros déménageur. (Sur devis.)",
    ctaLabel: 'Demander un devis déménagement',
  },
  {
    slug: 'transport-volumineux',
    title: "Transport d'objets volumineux",
    description:
      "Électroménager, mobilier, achats encombrants transportés en toute sécurité, manutention soignée.",
    icon: 'pallet',
    metaTitle:
      "Transport d'objets volumineux & encombrants — Côte d'Azur | AM Express",
    metaDescription:
      "Transport d'objets volumineux, électroménager, mobilier et encombrants sur la Côte d'Azur. Service rapide et soigné. Devis gratuit. Antibes (06).",
    h1: "Transport d'objets volumineux et encombrants",
    longText:
      "Électroménager, mobilier, achat volumineux à rapatrier… Nous transportons vos objets encombrants en toute sécurité partout sur la Côte d'Azur. Manutention soignée, intervention rapide. (Sur devis.)",
    ctaLabel: 'Demander un devis',
  },
].map((s) => ({ ...s, href: `/services/${s.slug}` }));

/**
 * BLOC « POURQUOI NOUS CHOISIR » — 4 arguments clés (issus du contenu officiel).
 */
export const reasons = [
  {
    title: 'Réactivité',
    description: "Réponse rapide, intervention sous court délai.",
    icon: 'flash',
  },
  {
    title: 'Proximité',
    description: "Un interlocuteur unique, basé à Antibes, qui connaît la région.",
    icon: 'pin',
  },
  {
    title: 'Soin',
    description: "Vos marchandises traitées avec attention, du chargement à la livraison.",
    icon: 'check',
  },
  {
    title: 'Transparence',
    description: "Un devis clair et gratuit, sans engagement.",
    icon: 'euro',
  },
];

/**
 * VILLES DESSERVIES (page /zone). Liste ajustable selon les préférences.
 */
export const villes = [
  'Antibes',
  'Juan-les-Pins',
  "Cap d'Antibes",
  'Nice',
  'Cannes',
  'Mougins',
  'Vallauris',
  'Golfe-Juan',
  'Cagnes-sur-Mer',
  'Villeneuve-Loubet',
  'Biot',
  'Valbonne',
  'Sophia Antipolis',
  'Grasse',
  'Le Cannet',
  'Vence',
  'Saint-Laurent-du-Var',
];

/**
 * TYPES DE PRESTATION proposés dans le menu déroulant du formulaire de devis.
 */
export const prestationTypes = [
  'Transport pro',
  'E-commerce',
  'Déménagement',
  'Objet volumineux',
  'Autre',
];

/**
 * VALEURS de l'entreprise (page /a-propos).
 */
export const valeurs = [
  {
    title: 'Fiabilité',
    description: 'On tient nos engagements et nos horaires.',
    icon: 'check',
  },
  {
    title: 'Soin',
    description: 'Vos marchandises arrivent comme elles sont parties.',
    icon: 'box',
  },
  {
    title: 'Proximité',
    description: 'Un service local, humain et joignable directement.',
    icon: 'pin',
  },
];

/**
 * Phrase de réassurance à répéter près des boutons d'action (CTA).
 */
export const reassurance = 'Réponse sous 24 h · Devis gratuit · Sans engagement';
