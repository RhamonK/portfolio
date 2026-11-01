# Prompt — voix clonée pour les présentations

À coller dans une session Claude qui a le connecteur fal.ai **et** accès à internet sans restriction (Claude desktop / Claude Code sur ton ordi).

---

Tu travailles sur mon portfolio : repo `RhamonK/portfolio`, branche `claude/artifact-session-tek3m2` (clone-la ou fais `git pull` si elle est déjà là). Objectif : cloner ma voix avec fal.ai et générer la narration des présentations de projets, en FR et en EN.

**Fichiers déjà prêts dans le repo**
- `scripts/voix/textes.json` : 60 entrées `{slug, lang, slide, text}` (5 projets × 6 diapos × fr/en, 6 113 caractères au total).
- `scripts/voix/assemble.sh <dossier>` : prend `<dossier>/<slug>-<lang>-<i>.mp3` (i = 0 à 5) et produit `public/voix/<slug>-<lang>.mp3`, une piste de 60 s où chaque diapo commence à i × 10 s (+0,4 s). Chaque clip est coupé à 9,6 s.
- Le site lit déjà `public/voix/<slug>-<lang>.mp3` (voir `src/components/presentation/Presentation.tsx`, `SLIDE_S = 10`), et la bouche du présentateur suit le volume de l'audio.

**Mon échantillon de voix** : `Rue_Lavigne_2.m4a` (162 s, mono). Je te le donne en pièce jointe.

**Étapes**
1. Prépare l'échantillon : `ffmpeg -i Rue_Lavigne_2.m4a -t 90 -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 1 -b:a 192k sample.mp3`
2. Coût : clonage `fal-ai/minimax/voice-clone` ≈ 1,50 $ + `fal-ai/minimax/speech-2.8-hd` ≈ 0,10 $ / 1 000 caractères ≈ 0,61 $. **Total ≈ 2,11 $. C'est déjà approuvé : ne dépasse pas 3 $ sans me demander.** Si fal signale un blocage de facturation, arrête-toi et dis-le-moi, ne relance rien automatiquement.
3. Envoie `sample.mp3` sur fal (`upload_file` avec `prepare_upload`, puis PUT du fichier), puis lance `fal-ai/minimax/voice-clone` avec `audio_url`, `noise_reduction: true`, `need_volume_normalization: true`. Note le `custom_voice_id`.
4. Fais d'abord **un seul** test : la diapo 0 de `mamashop` en FR. Fais-la-moi écouter et attends mon ok avant la suite.
5. Après mon ok, génère les 59 autres avec `fal-ai/minimax/speech-2.8-hd` (par lots de 8 avec `submit_jobs`) :
   - `prompt` : le `text` de l'entrée
   - `voice_setting` : `{ voice_id: <custom_voice_id>, speed: 1, vol: 1, pitch: 0 }`
   - `language_boost` : `"French"` pour fr, `"English"` pour en
   - `output_format: "url"`, `audio_setting: { format: "mp3", sample_rate: 44100, bitrate: 128000, channel: 1 }`
   Télécharge chaque résultat dans `voix-clips/<slug>-<lang>-<slide>.mp3` (hors du repo).
6. Vérifie avec ffprobe qu'aucun clip ne dépasse 9,6 s. S'il y en a un, régénère-le avec `speed: 1.1` (ou 1.15), pas plus. Liste-moi ceux que tu as régénérés.
7. Lance `bash scripts/voix/assemble.sh voix-clips` depuis la racine du repo : tu dois obtenir 10 fichiers dans `public/voix/`.
8. Dans `ASSETS_MANQUANTS.md`, coche la ligne « Voix ».
9. Lance `npm run build` et vérifie qu'il passe. Ouvre une présentation dans le navigateur, son activé, et vérifie que la voix colle aux diapos et aux sous-titres.
10. Commit (« Voix : narration FR/EN avec la voix clonée de Rhamone ») et push sur `claude/artifact-session-tek3m2`. Pas de PR.
11. Donne-moi le coût réel dépensé sur fal.

**Règles** : n'invente aucun texte, utilise exactement ceux de `textes.json`. Ne change rien d'autre dans le site. Tiens-moi au courant à chaque étape.
