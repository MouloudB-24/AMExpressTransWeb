# Rapport Lighthouse

**Outil** : Lighthouse 12 (Chrome headless) · build de production (`npm run build` + `npm run preview`)
**Date** : 29/05/2026

## Sprint 3 — pages enrichies (carte, adresses, RGPD)

| Page                          | Perf | A11y | Best | SEO |
| ----------------------------- | :--: | :--: | :--: | :-: |
| `/zone` (carte Leaflet, mobile) | 100 | 100 | 100 | 100 |
| `/devis` (adresses complètes, mobile) | 100 | 100 | 100 | 100 |
| `/` accueil (contrôle régression) | 100 | 100 | 100 | 100 |

> La **carte est chargée en lazy** (Leaflet JS + CSS + tuiles uniquement au scroll) :
> aucun impact sur le score de `/zone`. Aucune régression.
>
> **Tests fonctionnels Sprint 3** : 19/19 réussis (navigateur headless) — adresses
> obligatoires, code postal validé (5 chiffres), cas « même ville » accepté,
> notification WhatsApp déclenchée avec le bon contenu, **devis non bloqué si la notif
> WhatsApp échoue**, mention RGPD présente, bandeau de consentement (apparition +
> mémorisation), carte chargée avec ses tuiles.

## Sprint 2 — pages auditées (dont le formulaire de devis)

| Page                          | Perf | A11y | Best | SEO |
| ----------------------------- | :--: | :--: | :--: | :-: |
| `/devis` (mobile)             | 100  | 100  | 100  | 100 |
| `/devis` (desktop)            | 100  | 100  | 100  | 100 |
| `/services/transport-pro` (mobile) | 100 | 100 | 100 | 100 |
| `/` accueil (mobile, contrôle régression) | 100 | 100 | 100 | 100 |

> Objectif du brief : > 90 sur toutes les pages → ✅ atteint (100 partout, dont la
> page formulaire). Aucune régression sur l'accueil.

## Sprint 1 — Page d'accueil (rappel)

| Catégorie         | Mobile  | Desktop |
| ----------------- | :-----: | :-----: |
| **Performance**   | **100** | **100** |
| **Accessibilité** | **100** | **100** |
| **Bonnes pratiques** | **100** | **100** |
| **SEO**           | **100** | **100** |

> Objectif du brief : score mobile **et** desktop > 90 → ✅ atteint (100 partout).

## Web Vitals

| Métrique                         | Mobile | Desktop |
| -------------------------------- | :----: | :-----: |
| LCP (Largest Contentful Paint)   | 1,5 s  | 0,4 s   |
| TBT (Total Blocking Time)        | 0 ms   | 0 ms    |
| CLS (Cumulative Layout Shift)    | 0      | 0,001   |

> Objectif du brief : accueil < 2 s en 4G → ✅ (LCP mobile 1,5 s).

## Poids de la page

- Page d'accueil (HTML) : ~28 Ko
- CSS global : ~28 Ko
- Police Inter (sous-ensemble latin, woff2) : ~96 Ko (4 graisses)
- **Total du build (`dist/`) : ~296 Ko** → ✅ bien en dessous de la limite de 1 Mo.

## Notes

- Aucune image lourde : le visuel repose sur des dégradés CSS et des icônes SVG
  en ligne (zéro requête réseau supplémentaire). Des photos WebP pourront être
  ajoutées ultérieurement avec dimensions explicites et `loading="lazy"`.
- Le seul JavaScript de la page sert à ouvrir/fermer le menu mobile.
- Contraste : l'orange de marque (#F97316) est conservé sur fonds sombres et en
  fond de bouton ; sur fond blanc, le texte orange utilise une nuance plus
  foncée (orange-700) pour respecter le contraste WCAG AA.
- Formulaires : champs avec `<label>` associés, erreurs annoncées (`role="alert"`
  + `aria-invalid`), focus visibles. Le JS des formulaires est chargé uniquement
  sur `/devis` et `/contact` (≈ 1,2 Ko gzip), ce qui n'impacte pas le score.
- **Test fonctionnel des formulaires** : 9/9 tests automatisés réussis (navigateur
  headless) — validation des champs obligatoires, e-mail invalide rejeté, et
  affichage du message de confirmation après envoi (devis + contact).

## Comment reproduire l'audit

```bash
npm run build
npm run preview            # sert le site sur http://localhost:4321
# dans un autre terminal :
npx lighthouse http://localhost:4321/ --view          # rapport HTML interactif
```
