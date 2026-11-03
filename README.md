# Portfolio — Rhamone Nyavedji (rhamonenyavedji.com)

Portfolio immersif construit en **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS v4**,
avec **GSAP / ScrollTrigger** et **Lenis** pour le défilement, et **React Three Fiber** pour le présentateur 3D
(chargé seulement à l'ouverture d'une présentation).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # site statique dans out/
npm start        # sert out/ en local
```

## Contenu

| Fichier | Contenu |
|---|---|
| `src/data/site.ts` | Nom, rôle, contact, liens, chemins des CV |
| `src/data/projects.ts` | Les 5 projets : ce que chacun fait |
| `src/data/parcours.ts` | Les 3 étapes du parcours |

- CV : `public/cv/Rhamone_Nyavedji.pdf` (FR) et `public/cv/Rhamone_Nyavedji_EN.pdf` (EN).
- Deux langues : français à la racine (`/`, `/rapide`), anglais sous `/en` (`/en`, `/en/quick`).
  Textes de l'interface : `src/i18n.ts` ; textes des projets et du parcours : champs `fr` / `en` dans `src/data/`.
- `/rapide` (`/en/quick`) : Mode rapide, tout l'essentiel sans animation.
- Captures et dessins des projets : `public/projets/<slug>/`. Les dessins (`dessin.svg`) sont générés
  depuis `src/components/ProjectArt.tsx` avec `npm run art`.
- Présentations de 60 s (FR / EN) : `src/data/presentations.ts`.
- Salle d'écrans 3D : modèle Blender `public/salle/salle.glb` (prompt : `docs/prompt-blender-salle.md`),
  affiché par `src/components/Room3D.tsx` (WebGL, desktop). Décodeur Draco dans `public/draco/`.
  Sans WebGL, sur mobile ou en mouvement réduit : écrans en CSS / carrousel plat.
- INFINITY CORE (noyau du Hero) : la signature manuscrite `docs/logo/rn-logo-v2.pdf` dans un bloc de verre.
  Scène Three.js `src/components/core/scene.ts`, chargée après l'intro ; image fixe et tracés SVG pour les
  appareils légers. Pour régénérer après un changement de signature :
  `pdftoppm -r 300 -png -gray docs/logo/rn-logo-v2.pdf /tmp/rn && python3 scripts/trace-logo.py /tmp/rn-1.png && npm run core`.
- Palette : `src/app/globals.css` (`:root`) et son miroir JS `src/lib/palette.ts`, vérifiés par `npm run check`.
- Expertise (`src/data/expertise.ts`) et Labo (`src/data/lab.ts`) : uniquement du contenu réel. Images du labo
  rendues depuis les vrais modèles 3D : `npm run labo`.
- Fil INFINITE (`src/components/InfiniteThread.tsx`) : progression dans la marge, repères de sections cliquables.
- Ce qui manque encore : voir `ASSETS_MANQUANTS.md`.

## Règles
- Tout le texte reste du vrai HTML ; la 3D ne cache jamais le contenu.
- `prefers-reduced-motion` coupe les animations lourdes.
- Rien d'inventé : un asset manquant = emplacement neutre.

## Sécurité
- Site 100 % statique (`output: "export"`) : aucun serveur Next en production, donc pas d'API,
  pas de formulaire côté serveur, aucune donnée stockée.
- En-têtes de sécurité dans `vercel.json` : Content-Security-Policy stricte, HSTS, anti-iframe,
  `nosniff`, Referrer-Policy, Permissions-Policy.
- Liens externes en `rel="noreferrer"` ; aucune clé ni secret dans le code.

## Déploiement
Vercel détecte Next.js et publie le dossier `out/`. Aucune variable d'environnement requise.
