# 🔄 Reprise du projet — AM Express Transport

> Fiche pour reprendre rapidement après un redémarrage du PC.
> (Dernière mise à jour : 30/05/2026)

## ✅ Où en est-on ?

- **Sprints 1, 2 et 3 terminés** : site complet (13 pages), formulaires e-mail
  (Web3Forms) + notification WhatsApp (CallMeBot), carte de la zone (Leaflet/OSM),
  RGPD. Lighthouse 100 partout. Aucune régression connue.
- **Clés configurées** dans `.env` (Web3Forms + CallMeBot). Ce fichier reste sur le
  disque (il n'est pas dans Git). Si `.env` disparaît, le recréer depuis `.env.example`.
- **En cours / à confirmer** : tester de bout en bout l'envoi du devis
  (e-mail reçu sur `contact@amexpress-transport.fr` **+** notif WhatsApp sur le
  07 69 72 54 64). Le code est testé (19/19), il reste la validation « en vrai ».

## ▶️ Relancer le site en local (après redémarrage)

Le serveur de prévisualisation s'arrête au reboot — pour le relancer :

```bash
cd ~/Documents/projects/Big_projects/AM-Express-Transport

# Mode développement (rechargement auto, lit .env à chaque démarrage) :
npm run dev
#   → http://localhost:4321

# OU mode "build de production" (à refaire après TOUTE modif de .env) :
npm run build && npm run preview
#   → http://localhost:4321   (et http://<ip-locale>:4321 pour le mobile)
```

> ⚠️ **Rappel clé** : les variables `.env` sont lues **au build**. Après avoir modifié
> `.env`, relancer `npm run build` (en mode `dev`, il suffit de redémarrer `npm run dev`).

> Si `node_modules` a disparu : `npm install` d'abord.

## 🧪 Tester l'envoi du devis

1. Ouvrir `/devis`, remplir le formulaire, envoyer.
2. Vérifier : message de confirmation ✅, e-mail reçu 📧, notif WhatsApp 📲.
3. Test automatisé disponible : `node /tmp/formtest/test-sprint3.mjs` (⚠️ `/tmp` est
   effacé au reboot ; le script utilise des mocks, il ne valide pas l'envoi réel).

## 🗺️ Prochaine étape — Sprint 4 (mise en ligne)

- Achat du nom de domaine + déploiement (Netlify ou Vercel).
- Reporter les variables `.env` dans les réglages d'environnement de l'hébergeur.
- Mettre à jour l'URL du site dans `astro.config.mjs` et `public/robots.txt`.
- Google Search Console + Analytics (à charger **après** consentement RGPD).
- Contenu légal définitif (après SIREN + attestation DREAL PACA).
- Option : déplacer l'appel CallMeBot dans une fonction serverless (masquer la clé).

## 📚 Repères utiles

- Tout le contenu modifiable : `src/data/site.ts`.
- Doc complète (config e-mail, WhatsApp, carte, RGPD, déploiement) : `README.md`.
- Scores de performance : `RAPPORT-LIGHTHOUSE.md`.
- 💡 Conseil : initialiser un dépôt **Git** (`git init`) pour garder un historique et
  des points de restauration — non fait pour l'instant (le `.gitignore` est déjà prêt
  et exclut `.env`, `node_modules`, `dist`).
```
