# Prompt Blender — le présentateur 3D (Rhamone)

À coller tel quel dans une session Claude qui a accès à Blender (4.x ou 5.x) sur le PC de Rhamone.
Mettre les photos dans `portfolio_presentateur/photos/` avant de lancer.

---

Tu vas créer dans Blender le **présentateur 3D** du portfolio de Rhamone Nyavedji (rhamonenyavedji.com), puis l'exporter pour le web. C'est un personnage qui **me ressemble** (je suis Rhamone), debout, **toujours de face**, qui présente mes projets avec un bâton de présentation, à droite d'une grande diapo. Le site est en Next.js + React Three Fiber : ton fichier sera chargé tel quel et piloté par le code (bouche, regard, bras, clignements). Respecte exactement les noms et formats de la section 6, sinon le site ne pourra pas l'animer.

## 1. Le style (important)

- **Stylisé, pas photoréaliste.** Un personnage 3D élégant, façon court-métrage d'animation haut de gamme : formes propres, proportions légèrement stylisées (tête un peu plus grande : environ 1/6,5 de la hauteur), peau mate et douce, pas de pores, pas de sueur, pas d'effet « vallée de l'étrange ».
- **Ressemblance** : on doit me reconnaître. Elle vient de la forme du visage, de la couleur et de la sous-teinte exacte de la peau, de la forme des yeux, du nez, des lèvres, des oreilles, de la coiffure, de la pilosité (barbe, moustache, sourcils) et des lunettes si j'en porte sur les photos. Prends ces éléments **uniquement sur mes photos** ; ne devine rien. Si un détail n'est pas visible, demande-moi.
- **Tenue** : look agence tech sobre. Haut noir ou anthracite uni (t-shirt col rond ou chemise à col mao), sans logo ni texte. Pantalon sombre. Chaussures sombres. Un seul accent : un fin liseré ou un petit détail **lime #d4ff3a** (par exemple le bord du col ou une couture), discret.
- **Ambiance du site** : fond quasi noir #0a0b0a, accent lime #d4ff3a, texte #f2f3ee. Le personnage doit se lire sur fond sombre : prévois un léger contraste sur les épaules et le haut du crâne (le site ajoute un liseré de lumière lime derrière lui).

## 2. Mes photos

Dans `photos/`, j'ai mis 3 à 5 photos : face, trois-quarts gauche, trois-quarts droit, et si possible profil et plein pied.
1. Ouvre-les toutes et décris-moi en une liste ce que tu vois (forme du visage, teint, coiffure, barbe, lunettes, signes distinctifs, corpulence). **Attends ma validation de cette liste** avant de modéliser.
2. Utilise-les comme images de référence dans Blender (vues de face et de côté alignées) pour caler les proportions.
3. Ne les envoie à aucun service en ligne et ne les inclus pas dans les fichiers livrés.
4. Ma taille : demande-la-moi (sinon 1,75 m par défaut).

## 3. Modélisation

- Unités : mètres, échelle 1. Hauteur totale = ma taille.
- Origine (0, 0, 0) entre les pieds, au sol. Le personnage **regarde vers -Y dans Blender** (soit **+Z en glTF**, vers la caméra Three.js).
- Pose de repos : pose en A (bras à 45°), pour un bon skinning.
- Topologie propre en quads, boucles autour des yeux et de la bouche (indispensable pour la bouche qui parle).
- Yeux : globes séparés (`eye_L`, `eye_R`), iris à ma couleur, petit reflet. Dents et langue simples, visibles quand la bouche s'ouvre.
- Cheveux et barbe : en géométrie (cartes ou volumes sculptés), **pas** de système de particules (non exportable).
- Mains : 5 doigts, bien formées ; la main **droite** (la mienne) est fermée sur le bâton.
- **Bâton de présentation** : tige fine (Ø 1,2 cm, 55 cm) en métal graphite #1b1e18, avec une petite sphère lime émissive au bout. Objet séparé `baton`, attaché à l'os de la main droite (parenté d'os), avec son embout `baton_tip` (matériau `lime_emissive`, émission 3).
- Budget : **35 000 triangles maximum** au total, dont environ la moitié pour la tête et les mains.

## 4. Squelette (armature)

Une armature `rig`, compatible avec les noms suivants (exactement) :

`hips`, `spine`, `chest`, `neck`, `head`, `jaw`,
`shoulder_L`, `upperarm_L`, `forearm_L`, `hand_L`,
`shoulder_R`, `upperarm_R`, `forearm_R`, `hand_R`,
doigts : `thumb_01_L/R` à `thumb_03_L/R`, `index_01_L/R`…, `middle_…`, `ring_…`, `pinky_…`,
`thigh_L`, `shin_L`, `foot_L`, `thigh_R`, `shin_R`, `foot_R`.

- `head` : le site le tourne un peu pour suivre la souris (± 20° gauche/droite, ± 10° haut/bas). Vérifie que la peau du cou suit proprement à ces angles.
- Poids de peau propres : aucune déformation cassée aux épaules, coudes, poignets et au cou.
- Pas de contraintes ni de drivers dans l'export (ils ne passent pas en glTF) : tout est cuit dans les animations.

## 5. Visage : formes (shape keys / morph targets)

Avec ces noms exacts, de 0 (repos) à 1 :
- `mouthOpen` — bouche ouverte naturellement (mâchoire + lèvres), pour la parole. Le site l'anime selon le volume de la voix.
- `mouthSmile` — sourire léger, bouche fermée.
- `mouthO` — bouche arrondie (« o »).
- `blink` — les deux paupières fermées.
- `browUp` — sourcils levés (étonnement léger).

Elles doivent se combiner sans artefact (ex. `mouthOpen` 0,6 + `mouthSmile` 0,4).

## 6. Animations (actions exportées)

30 images par seconde. Toutes **de face**, le corps ne tourne jamais de plus de 10°. Noms exacts :

| Nom | Durée | Boucle | Description |
|---|---|---|---|
| `idle` | 4 s | oui | Respiration, léger balancement du poids, mains au repos, bâton tenu vers le bas dans la main droite. |
| `talk` | 2 s | oui | Comme `idle` + gestes mesurés de la main gauche (paume ouverte), léger mouvement de tête. **Pas** de bouche (le site la pilote avec `mouthOpen`). |
| `point` | 0,8 s | non | Le bras droit lève le bâton vers la **gauche de l'image** (là où est la diapo, côté droit du personnage), à hauteur d'épaule, et finit immobile sur la pose. Le site la joue en avant pour pointer, en arrière pour revenir. |
| `wave` | 2 s | non | Salut de la main gauche, sourire (`mouthSmile` animé dans l'action), retour au repos. |
| `nod` | 1 s | non | Petit hochement de tête « oui ». |

Les clignements ne sont pas une animation : le site utilise `blink`.

## 7. Matériaux

- Au plus **6 matériaux** : `skin`, `hair`, `eyes`, `cloth_top`, `cloth_bottom`, `lime_emissive` (et `metal` pour le bâton si besoin, max 7).
- Principled BSDF uniquement, sans nœuds exotiques (seuls couleur, rugosité, métal, normal map et émission passent en glTF).
- Textures cuites en **2048 × 2048 maximum**, format WebP à l'export ; une normal map pour la peau du visage est bienvenue.
- Peau : couleur et sous-teinte prises sur les photos (en lumière neutre), rugosité 0,55, pas de transluminescence (non exportée).

## 8. Livrables

Dans un dossier `presentateur/` :
1. `presenter.glb` — glTF binaire, Y-up, compression Draco, textures WebP, **4 Mo maximum**. Contient : le maillage, l'armature `rig`, les formes du §5, les actions du §6, le `baton` et son `baton_tip`. Pas de caméra ni de lumière.
2. `presenter.blend` — le fichier source propre (collections : Personnage, Rig, Références, Caméras, Lumières).
3. Images de contrôle (rendu Cycles ou EEVEE, fond #0a0b0a, liseré lime derrière) :
   - `apercu-face.webp` 1080 × 1350, plan buste, de face.
   - `apercu-pied.webp` 1080 × 1350, plein pied, de face.
   - `apercu-point.webp` 1080 × 1350, pose finale de `point`.
   - `apercu-bouche.webp` 1600 × 400 : 4 vignettes du visage (repos, `mouthOpen` 1, `mouthSmile` 1, `blink` 1).
   - `apercu-comparaison.webp` : ma photo de face à côté du rendu de face, **pour ton contrôle uniquement**, à me montrer mais à ne pas mettre dans les livrables finaux.
4. `NOTES.md` : taille finale, nombre de triangles, liste des os, des formes et des actions (avec durées), poids du GLB, et tout écart par rapport à ce prompt.
5. Le script Python utilisé, pour pouvoir refaire l'export.

## 9. Vérifications avant de livrer

- Réimporte `presenter.glb` dans une scène vide : les noms des os, des formes et des actions sont exactement ceux des §4 à §6 ; le personnage regarde la caméra par défaut (+Z en glTF) ; il mesure ma taille.
- Joue chaque action : aucune déformation cassée, le bâton reste dans la main, `point` vise bien le côté gauche de l'image.
- `mouthOpen` à 1 montre les dents sans traverser le menton.
- Poids ≤ 4 Mo, triangles ≤ 35 000.

## 10. Procédure

1. Lis mes photos et donne-moi la liste du §2. Attends mon accord.
2. Modélise la tête en premier ; montre-moi `apercu-face` et `apercu-comparaison`. **Attends mon accord** (c'est l'étape de la ressemblance : on itère ici, pas après).
3. Corps, tenue, mains, bâton ; montre `apercu-pied`. Attends mon accord.
4. Squelette, poids, formes du visage ; montre `apercu-bouche`.
5. Animations ; montre `apercu-point`.
6. Export, vérifications du §9, `NOTES.md`.

Règles : rien de payant, aucun asset téléchargé sous licence restrictive, aucune photo envoyée en ligne. Élégance avant détail : si un élément n'ajoute pas de qualité, enlève-le.
