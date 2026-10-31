# Portfolio — Rhamone Nyavedji (rhamonenyavedji.com)

Portfolio immersif construit en **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS v4**,
avec **GSAP / ScrollTrigger** et **Lenis** pour le défilement, et **React Three Fiber** pour le présentateur 3D
(chargé seulement à l'ouverture d'une présentation).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Contenu

| Fichier | Contenu |
|---|---|
| `src/data/site.ts` | Nom, rôle, contact, liens, chemins des CV |
| `src/data/projects.ts` | Les 5 projets : ce que chacun fait |
| `src/data/parcours.ts` | Les 3 étapes du parcours |

- CV : `public/cv/Rhamone_Nyavedji.pdf` (FR) et `public/cv/Rhamone_Nyavedji_EN.pdf` (EN).
- `/rapide` : Mode rapide, tout l'essentiel sans animation.
- Captures et dessins des projets : `public/projets/<slug>/`. Les dessins (`dessin.svg`) sont générés
  depuis `src/components/ProjectArt.tsx` avec `npm run art`.
- Présentations de 60 s (FR / EN) : `src/data/presentations.ts`.
- Ce qui manque encore : voir `ASSETS_MANQUANTS.md`.

## Règles
- Tout le texte reste du vrai HTML ; la 3D ne cache jamais le contenu.
- `prefers-reduced-motion` coupe les animations lourdes.
- Rien d'inventé : un asset manquant = emplacement neutre.

## Déploiement
Vercel, aucune variable d'environnement requise.
