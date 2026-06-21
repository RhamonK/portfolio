# Portfolio — Rhamone Komi Nyavedji (rhamon.dev)

Portfolio personnel construit en **Next.js 14 (App Router)** + **Tailwind CSS v4** + **TypeScript**.
Cadrage **hybride** : message principal orienté embauche (junior), porte freelance discrète.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Où modifier le contenu (sans toucher au code)

Tout le contenu est centralisé dans `src/data/` :

| Fichier | Contenu |
|---|---|
| `src/data/site.ts` | Nom, eyebrow, **email**, **liens GitHub/LinkedIn/X**, chemin du CV, bande marquee, facts |
| `src/data/projects.ts` | Les 3 projets (titre, description, **liens**, méta, stack) |
| `src/data/skills.ts` | Les cercles de compétences |

## ✅ À compléter avant de publier (checklist recruteur)

Cherche les `TODO` dans `src/data/` — ce sont les placeholders à remplir :

1. **Liens GitHub / LinkedIn réels** (`site.ts`) — un recruteur clique toujours dessus.
2. **Liens des projets** (`projects.ts`) — remplace les `"#"` par de vraies URLs
   (étude de cas, démo, repo). Les liens morts tuent la crédibilité.
3. **CV PDF** — dépose ton CV dans `public/cv.pdf` (les boutons « Télécharger le CV » pointent dessus).
4. **Captures d'écran réelles** des apps (MamaShop, ABO) — bien plus parlant qu'un faux éditeur de code.
5. *(recommandé)* Vraies pages d'**études de cas** : `app/projets/[slug]/page.tsx`
   (problème → ton rôle → décisions techniques → obstacle résolu → résultat).
6. *(recommandé)* **Version anglaise** (toggle FR/EN) — Ottawa/Gatineau = contexte bilingue.

## Structure

```
src/
  app/
    layout.tsx       # polices (next/font) + métadonnées SEO
    page.tsx         # assemblage des sections
    globals.css      # tokens design (@theme Tailwind v4) + animations
  components/        # ProjectCard, SkillCircle, StatBlock, Hero, Nav, Reveal…
  data/              # 👈 contenu éditable
```

## Déploiement Vercel

Pousse le repo sur GitHub puis importe-le sur [vercel.com](https://vercel.com).
Aucune variable d'environnement requise.
