# AM Express Transport — Site vitrine

Site vitrine statique construit avec **[Astro](https://astro.build)** et **[Tailwind CSS](https://tailwindcss.com)**.
Objectif : présenter l'activité de transport et inciter à demander un devis.

> **Sprint 1** — Socle technique + page d'accueil (page modèle de référence).
> **Sprint 2** — Toutes les pages restantes + formulaires de devis et contact (envoi e-mail).
> **Sprint 3** — Adresses complètes, notification WhatsApp, carte de la zone, RGPD.

---

## 🚀 Lancer le projet en local

Prérequis : **Node.js 18+** (testé sur Node 24).

```bash
npm install     # installe les dépendances (une seule fois)
npm run dev     # démarre le serveur de développement
```

Le site est alors accessible sur **http://localhost:4321**.
Toute modification d'un fichier est rechargée automatiquement dans le navigateur.

### Autres commandes

| Commande          | Effet                                                        |
| ----------------- | ------------------------------------------------------------ |
| `npm run build`   | Génère le site final dans le dossier `dist/`                 |
| `npm run preview` | Prévisualise localement le site généré (après `build`)       |

---

## 📧 Formulaires (devis + contact) — envoi par e-mail

Les formulaires de **devis** (`/devis`) et de **contact** (`/contact`) envoient un
e-mail via **[Web3Forms](https://web3forms.com)**.

### Pourquoi Web3Forms ?

- **Gratuit** (250 envois/mois) et **sans backend à héberger** : idéal pour un site
  statique Astro.
- **Indépendant de l'hébergeur** : fonctionne aussi bien sur Netlify que sur Vercel
  (contrairement à *Netlify Forms* qui n'existe que sur Netlify) — pratique tant que
  le choix d'hébergement n'est pas figé.
- Configuration par **une simple clé publique**, anti-spam intégré (honeypot +
  hCaptcha optionnel).

### Configurer l'envoi (à faire une fois)

1. Aller sur [web3forms.com](https://web3forms.com), saisir l'e-mail de réception
   (provisoirement `contact@amexpress-transport.fr`) → une **clé d'accès** est envoyée
   par e-mail.
2. Copier `.env.example` en `.env` et y coller la clé :
   ```bash
   cp .env.example .env
   # puis éditer .env :
   # PUBLIC_WEB3FORMS_KEY=la-vraie-cle-recue-par-email
   ```
3. Relancer `npm run dev` (ou `npm run build`). La clé n'est **jamais en dur** dans
   le code : elle vient de la variable d'environnement `PUBLIC_WEB3FORMS_KEY`.

> En production (Netlify/Vercel) : ajouter `PUBLIC_WEB3FORMS_KEY` dans les variables
> d'environnement du projet, avec le même nom.

### Tester l'envoi

1. Avec une clé valide dans `.env`, lancer `npm run dev`.
2. Ouvrir `/devis`, remplir le formulaire et envoyer.
3. Un message de confirmation s'affiche (« Merci, votre demande est envoyée ! ») et
   l'e-mail arrive dans la boîte de réception configurée.
4. Sans clé configurée, le formulaire affiche un message invitant à appeler — c'est
   le comportement attendu.

> 🛡️ Anti-spam : un champ caché *honeypot* (`botcheck`) bloque les robots. Pour
> renforcer, activer hCaptcha (invisible) depuis le tableau de bord Web3Forms.

---

## 📲 Notification WhatsApp des nouveaux devis (CallMeBot)

À chaque **devis** envoyé, en plus de l'e-mail, une **notification WhatsApp** part
vers le gérant via **[CallMeBot](https://www.callmebot.com/)** (gratuit).

### Pourquoi cette solution (et pas un backend) ?

Le site est 100 % statique : l'appel CallMeBot se fait donc **directement depuis le
navigateur** (requête `fetch` en *fire-and-forget*). C'est la solution la plus simple,
gratuite et sans serveur à héberger. L'e-mail reste le **canal officiel** : si la
notification WhatsApp échoue, **le devis part quand même** (l'erreur WhatsApp est
ignorée silencieusement).

> ⚠️ **Limite assumée en V1** : la clé CallMeBot est utilisée côté navigateur, donc
> visible dans le code de la page. Le risque est faible (cette clé permet seulement
> d'envoyer un message au numéro du gérant, et elle est révocable). Pour une
> confidentialité totale, on pourra déplacer cet appel dans une **fonction serverless**
> (Netlify/Vercel) au Sprint 4, une fois l'hébergeur choisi.

### Configurer (une fois)

1. Ajouter le contact CallMeBot **+34 644 51 95 23** sur le WhatsApp du gérant.
2. Lui envoyer : `I allow callmebot to send me messages` → CallMeBot renvoie une **apikey**.
3. Renseigner dans `.env` :
   ```bash
   PUBLIC_CALLMEBOT_PHONE=33769725464      # numéro qui reçoit (international, sans +)
   PUBLIC_CALLMEBOT_APIKEY=la-cle-recue
   ```
4. `npm run build`. Sans ces variables, le devis fonctionne normalement **sans** notif.

---

## 🗺️ Carte de la zone (page /zone)

Carte **OpenStreetMap via Leaflet** : légère, gratuite, **sans clé API payante**
(contrairement à Google Maps). Elle est **chargée en lazy** : le code Leaflet et les
tuiles ne se téléchargent que lorsque la carte arrive à l'écran → aucun impact sur la
performance des pages. Pour ajuster le centre ou le rayon, voir `src/components/ZoneMap.astro`.

---

## 🍪 RGPD

- **Bandeau d'information** discret (non bloquant) : voir `src/components/CookieBanner.astro`.
  Aucun traceur publicitaire n'est chargé. Quand un outil de mesure d'audience sera
  ajouté (Sprint 4), ne charger ses scripts qu'**après** le clic « J'ai compris ».
- **Mention RGPD** sous chaque formulaire + page **Politique de confidentialité**
  (`/confidentialite`) listant données, finalités et sous-traitants (Web3Forms, CallMeBot).

---

## ✏️ Où modifier les contenus ?

Le projet est pensé pour qu'on retrouve facilement où changer un texte.

| Je veux modifier…                              | Fichier à ouvrir                          |
| ---------------------------------------------- | ----------------------------------------- |
| Téléphone, WhatsApp, e-mail, nom, menu         | `src/data/site.ts`                        |
| Les 4 services (titres, textes, pages SEO)     | `src/data/site.ts` (tableau `services`)   |
| « Pourquoi nous », valeurs, villes desservies  | `src/data/site.ts` (`reasons`, `valeurs`, `villes`) |
| Le grand titre / sous-titre d'accueil          | `src/components/Hero.astro`               |
| Les champs du formulaire de devis              | `src/components/QuoteForm.astro`          |
| La clé du service d'e-mail                     | fichier `.env` (voir section Formulaires) |
| Les couleurs et la police                      | `tailwind.config.mjs`                     |
| L'URL du site (mise en ligne)                  | `astro.config.mjs` + `public/robots.txt`  |

Chaque fichier de composant (`src/components/`) commence par un commentaire
expliquant son rôle. Les zones de texte modifiables sont signalées par `TEXTE`.

### Structure du projet

```
src/
  data/site.ts              → configuration centrale (contacts, menu, services, villes…)
  layouts/BaseLayout.astro  → gabarit commun (SEO, <head>, assemblage)
  scripts/web3form.ts       → validation + envoi des formulaires (Web3Forms)
  components/
    Header / Footer / FloatingContact   → en-tête, pied de page, barre mobile
    Hero / ServicesPreview / WhyUs      → sections de l'accueil
    ZonePreview / Testimonials / FinalCTA→ sections de l'accueil (témoignages masqués)
    PageHeader.astro        → bandeau de titre des pages internes (+ fil d'Ariane)
    Breadcrumb.astro        → fil d'Ariane + données structurées SEO
    ServiceCard.astro       → carte de service (accueil + /services)
    CtaBand.astro           → bandeau d'appel à l'action réutilisable
    FormField.astro         → champ de formulaire accessible (label + erreur)
    QuoteForm / ContactForm → formulaires (devis / contact) via Web3Forms
    Icon.astro              → icônes SVG (aucune dépendance)
  pages/
    index.astro             → accueil          services.astro      → liste des services
    services/[service].astro→ 4 pages SEO       devis.astro         → formulaire de devis
    zone.astro · a-propos.astro · contact.astro
    mentions-legales · confidentialite · cgv  → pages légales (provisoires)
  styles/global.css         → styles globaux + boutons + champs de formulaire
public/                     → favicon, robots.txt, images
```

---

## 🌐 Déployer en ligne (gratuit)

Le site est statique : il s'héberge gratuitement sur **Netlify** ou **Vercel**.

### Option A — Netlify

1. Poussez le code sur un dépôt GitHub/GitLab.
2. Sur [netlify.com](https://netlify.com) : *Add new site → Import an existing project*.
3. Réglages détectés automatiquement (sinon) :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
4. *Deploy*. Le site est en ligne en quelques minutes.

### Option B — Vercel

1. Poussez le code sur un dépôt GitHub/GitLab.
2. Sur [vercel.com](https://vercel.com) : *Add New → Project* → importez le dépôt.
3. Le preset **Astro** est détecté automatiquement (`npm run build`, sortie `dist`).
4. *Deploy*.

> ⚠️ Après déploiement, pensez à :
> - remplacer l'URL `https://amexpress-transport.fr` par le vrai domaine dans
>   `astro.config.mjs` et `public/robots.txt` (sitemap + référencement) ;
> - ajouter les variables d'environnement dans les réglages du projet :
>   **`PUBLIC_WEB3FORMS_KEY`** (sinon pas d'e-mail), et pour la notif WhatsApp
>   **`PUBLIC_CALLMEBOT_PHONE`** + **`PUBLIC_CALLMEBOT_APIKEY`**.

---

## ✅ À confirmer / prochaines étapes

- **Contenus** : tout le site intègre le contenu officiel V1
  (zone : **Antibes & Côte d'Azur**, ~50 km).
- **Clé Web3Forms** : configurée dans `.env` (e-mails OK).
- **Clé CallMeBot** : **à créer** par le sponsor puis à mettre dans `.env`
  (`PUBLIC_CALLMEBOT_*`) pour activer la notif WhatsApp (voir section dédiée).
- **Nom de domaine** : pas encore acheté. L'URL est provisoirement
  `https://amexpress-transport.fr` (alignée sur l'e-mail proposé) dans
  `astro.config.mjs` et `public/robots.txt` — à mettre à jour à l'achat.
- **E-mail** provisoire : `contact@amexpress-transport.fr` (dans `src/data/site.ts`).
- **WhatsApp** : supposé identique au téléphone (07 69 72 54 64) — à confirmer.
- **Pages légales** : versions **provisoires** en place (à finaliser après le SIREN).
- Encore à fournir par le client : type/capacité du véhicule, adresse du siège,
  horaires, SIREN, attestation de capacité (DREAL PACA), avis clients.
- **Sprint 4 (mise en ligne)** : achat du domaine + déploiement, Google Search
  Console + Analytics (à charger après consentement), contenu légal définitif,
  envoi du sitemap à Google, vraies photos. Option : déplacer l'appel CallMeBot
  dans une fonction serverless pour masquer la clé.
