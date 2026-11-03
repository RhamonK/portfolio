# Variantes réduites des captures, pour servir la bonne taille selon l'écran (srcset).
#
#   python3 scripts/make-thumbs.py
#
#   public/projets/<slug>/slides/<nom>.webp  ->  <nom>-360.webp   (vignettes des galeries)
#   public/projets/<slug>/<nom>.webp         ->  <nom>-720.webp   (capture principale des cartes)
#   public/labo/<nom>.webp                   ->  <nom>-520.webp   (cartes du labo)
#
# Les originaux restent intacts (présentations de 60 s, salle 3D). Dépendance : pillow.
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public"
RULES = [("projets/*/slides/*.webp", 360), ("projets/*/*.webp", 720), ("labo/*.webp", 520)]
VARIANT = re.compile(r"-\d+\.webp$")

total_in = total_out = 0
for pattern, width in RULES:
    for src in sorted(ROOT.glob(pattern)):
        if VARIANT.search(src.name):
            continue
        dest = src.with_name(f"{src.stem}-{width}.webp")
        with Image.open(src) as im:
            if im.width <= width:
                continue
            h = round(im.height * width / im.width)
            im.convert("RGB").resize((width, h), Image.LANCZOS).save(dest, "WEBP", quality=82, method=6)
        total_in += src.stat().st_size
        total_out += dest.stat().st_size
        print(f"{dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} Ko")
print(f"originaux {total_in // 1024} Ko -> variantes {total_out // 1024} Ko")
