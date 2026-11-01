#!/usr/bin/env bash
# Assemble les clips d'une présentation en une piste de 60 s :
# chaque diapo i commence à i*10 s (comme SLIDE_S dans Presentation.tsx).
# Entrée : <dossier>/<slug>-<lang>-<i>.mp3  →  public/voix/<slug>-<lang>.mp3
set -euo pipefail
dir="${1:?dossier des clips}"
out="public/voix"; mkdir -p "$out"
for f in "$dir"/*-0.mp3; do
  base="$(basename "$f" -0.mp3)"
  args=(); filt=""
  for i in 0 1 2 3 4 5; do
    clip="$dir/$base-$i.mp3"
    args+=(-i "$clip")
    # 0,4 s de respiration en début de diapo ; coupé à 9,6 s pour ne pas déborder
    filt+="[$i:a]atrim=0:9.6,adelay=$(( i*10000 + 400 )):all=1[a$i];"
  done
  filt+="[a0][a1][a2][a3][a4][a5]amix=inputs=6:normalize=0,apad=whole_dur=60,atrim=0:60,loudnorm=I=-16:TP=-1.5[out]"
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$filt" -map "[out]" -ac 1 -ar 44100 -b:a 96k "$out/$base.mp3"
  echo "$out/$base.mp3"
done
