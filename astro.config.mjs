// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// ⚠️ URL définitive du site en production — À CONFIRMER (nom de domaine pas
// encore acheté). Provisoirement aligné sur le domaine de l'e-mail proposé.
// Sert au sitemap, aux balises Open Graph et aux liens canoniques.
const SITE_URL = 'https://amexpress-transport.fr';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind(),
    sitemap(), // génère sitemap-index.xml automatiquement au build
  ],
  // Compression HTML pour alléger le poids des pages
  compressHTML: true,
});
