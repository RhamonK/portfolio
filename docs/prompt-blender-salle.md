# Prompt Blender — la salle d'écrans du portfolio

À coller tel quel dans une session Claude qui a accès à Blender (4.x).

---

Tu vas modéliser dans Blender la « salle d'écrans » du portfolio de Rhamone Nyavedji (rhamonenyavedji.com), puis l'exporter pour le web. Le site est en Next.js + React Three Fiber : ton modèle sera chargé tel quel, et le site posera lui-même la capture de chaque projet sur les écrans.

## 1. L'idée

Le visiteur est debout au centre d'une salle ronde. Cinq grands écrans courbés l'entourent et forment un cercle presque complet. La molette fait tourner le cercle : l'écran de face est net et lumineux, les voisins s'éloignent dans la pénombre. Ambiance : agence tech haut de gamme, sombre, précise, minimaliste. Pas science-fiction, pas néon partout : du noir mat, du verre, du métal graphite et une seule couleur d'accent, le lime.

Références d'ambiance : un showroom de nuit, une salle d'exposition de musée moderne, les écrans courbés d'un poste de contrôle épuré.

## 2. Unités et repère

- Unités : mètres. Échelle 1. Axe vertical : Z dans Blender (exporté en Y-up pour le web).
- Origine (0, 0, 0) : centre de la salle, au niveau du sol. C'est là que se tient le visiteur.
- Caméra du visiteur : position (0, 0, 1,60 m), regard horizontal vers +Y, focale 20 mm sur capteur 36 mm (champ horizontal ≈ 84°).

## 3. Dimensions

### Salle
- Pièce circulaire, rayon intérieur des murs : 6,00 m. Hauteur sous plafond : 4,20 m.
- Les murs et le plafond sont presque invisibles (noir mat, aucune texture) : on doit sentir l'espace sans le voir.

### Anneau d'écrans (le plus important — à respecter exactement)
- 5 écrans sur un cylindre de rayon 4,00 m centré sur l'origine, face intérieure tournée vers le centre.
- Chaque écran couvre un arc de 60°. Écart entre deux écrans : 6°. Pas angulaire : 66° (écran 01 centré à 0°, face à la caméra ; 02 à +66°, 03 à +132°, 04 à +198°, 05 à +264°, sens anti-horaire vu de dessus).
- Largeur d'un écran le long de l'arc : 4,19 m. Hauteur : 2,50 m. Bas de l'écran à 0,45 m du sol, haut à 2,95 m.
- Rapport largeur / hauteur de la surface d'affichage : 1,676 (textures prévues en 2048 × 1222 px).
- Courbure : vraie courbe lisse, au moins 64 segments par écran sur la largeur.

### Construction d'un écran (de l'avant vers l'arrière)
1. Vitre de protection : 5 mm d'épaisseur, 4 mm devant la dalle. Verre très légèrement fumé, rugosité 0,05, reflets discrets.
2. Dalle d'affichage (« screen_slot ») : la surface qui recevra la capture du projet. Matériau émissif, couleur de base #10120e. UV parfaitement dépliées de 0 à 1 (U le long de l'arc, de gauche à droite vu du centre ; V de bas en haut), sans étirement.
3. Cadre : 2,0 cm de large sur les quatre côtés, 4 cm de profondeur, métal graphite #1b1e18, rugosité 0,35, métallique 0,8. Coins arrondis rayon 1,2 cm.
4. Liserés lumineux : un fin filet lime #d4ff3a, 4 mm de haut, émissif (intensité 3), le long du bord haut et du bord bas de chaque écran, collé au cadre, qui suit la courbe.
5. Dos : coque arrière noir mat, 6 cm de profondeur, légèrement bombée.
6. Fixation : deux tiges fines (Ø 2 cm, graphite) qui descendent du bas de l'écran jusqu'au sol, à 25 % et 75 % de la largeur. Pas de pied massif.

### Sol
- Disque de rayon 6,00 m, noir #0a0b0a, légèrement réfléchissant (rugosité 0,25), avec un reflet doux des écrans.
- Trois anneaux lime gravés dans le sol, très fins (1,5 cm), émissifs faibles (intensité 0,8), rayons 1,20 m, 2,20 m et 3,20 m.
- Une lueur lime très diffuse qui monte du centre du sol (lumière ponctuelle ou zone émissive), comme si la lumière venait d'en dessous.

### Plafond
- Un anneau de lumière linéaire très fin (2 cm) à 4,10 m de haut, rayon 4,00 m, juste au-dessus des écrans, blanc chaud 4000 K, faible. Il dessine le cercle dans l'obscurité.

## 4. Lumière et ambiance

- Fond et murs : #0a0b0a. Rien de plus clair que les écrans dans la pièce.
- Couleur d'accent unique : lime #d4ff3a (liserés, anneaux au sol, lueur du sol). Texte et détails clairs : #f2f3ee. Gris : #9a9d93.
- Brume volumétrique très légère (densité 0,02) pour que les liserés et la lueur du sol « respirent ».
- Les écrans sont la source de lumière principale : ils éclairent le sol et les cadres voisins.
- Pas de logo, pas de texte, pas d'interface inventée dans la scène : les écrans restent vides, le site y mettra les vraies captures.

## 5. Ce que tu livres

Dans un dossier `salle/` :

1. `salle.glb` — la scène pour le web.
   - Export glTF binaire, Y-up, compression Draco, textures en WebP.
   - Poids total ≤ 2 Mo. Moins de 80 000 triangles. Au plus 8 matériaux.
   - Noms d'objets exacts : `screen_01` … `screen_05` (les dalles d'affichage, matériau `screen_slot`), `glass_01` … `glass_05`, `frame_01` … `frame_05`, `led_top_01` … `led_top_05`, `led_bottom_01` … `led_bottom_05`, `floor`, `floor_rings`, `ceiling_ring`.
   - Chaque `screen_0X` a son propre matériau (`screen_slot_01` … `screen_slot_05`) pour que le site puisse y poser une texture différente.
   - Pas de caméra ni de lumières dans le GLB (le site les gère), mais un lightmap du sol cuit (« bake ») en 1024 × 1024 WebP, appliqué au matériau `floor`.
2. `salle.blend` — le fichier source, propre, avec les collections nommées (Écrans, Sol, Plafond, Lumières, Caméras).
3. Trois images de contrôle (rendu Cycles, 128 échantillons, débruitage activé), avec des textures de test unies sur les écrans :
   - `apercu-face.webp` : 1920 × 1080, depuis la caméra du visiteur, écran 01 de face.
   - `apercu-plongee.webp` : 1920 × 1080, vue de haut à 45° qui montre tout l'anneau.
   - `apercu-mobile.webp` : 1080 × 1350, cadrage vertical sur l'écran de face.
4. `NOTES.md` : dimensions finales, liste des objets, poids du GLB, nombre de triangles, et tout écart par rapport à ce prompt.

## 6. Règles

- Respecte exactement les dimensions de la section 3 : le site calcule la rotation (66° par projet) et le cadrage à partir d'elles.
- Une seule couleur d'accent (lime). Pas de bleu, pas de violet, pas de dégradés arc-en-ciel.
- Élégance avant effet : si un détail n'ajoute pas de la qualité, enlève-le.
- Ne lance aucun service payant et n'utilise aucun asset sous licence restrictive. Tout est modélisé à la main ou procédural.
- Avant de finir, montre-moi les trois images de contrôle et attends ma validation.
