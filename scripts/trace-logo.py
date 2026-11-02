# Extrait la signature RN du logo manuscrit et l'écrit pour la scène 3D.
#
#   pdftoppm -r 300 -png -gray docs/logo/rn-logo-v2.pdf /tmp/rn
#   python3 scripts/trace-logo.py /tmp/rn-1.png
#   npm run core            # régénère les images fixes et les tracés SVG
#
# Méthode : squelette du dessin (ligne centrale de l'encre), puis plus court chemin
# le long de ce squelette entre des repères posés à la main sur chaque trait. On lisse
# ensuite pour retirer le tremblement du scan sans perdre le geste.
# Sorties : src/components/core/signature-data.ts et un contrôle visuel (…-controle.png).
# Dépendances : numpy, scikit-image, pillow.
import heapq
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from skimage import io, measure, morphology

ROOT = Path(__file__).resolve().parent.parent
src = sys.argv[1]
img = io.imread(src)
if img.ndim == 3:
    img = img[..., 0]
ink = img < 128
ink = morphology.closing(ink, morphology.disk(3))
ink = morphology.remove_small_holes(ink, max_size=400)
skel = morphology.skeletonize(ink)
ys, xs = np.nonzero(skel)
pts = set(zip(ys.tolist(), xs.tolist()))


def snap(x, y):
    d = (xs - x) ** 2 + (ys - y) ** 2
    i = int(np.argmin(d))
    return (int(ys[i]), int(xs[i])), float(np.sqrt(d[i]))


def shortest(a, b):
    dist, prev, pq = {a: 0.0}, {}, [(0.0, a)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b:
            break
        if d > dist[u]:
            continue
        y, x = u
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                v = (y + dy, x + dx)
                if v == u or v not in pts:
                    continue
                nd = d + (1.4142 if dy and dx else 1.0)
                if nd < dist.get(v, 1e18):
                    dist[v], prev[v] = nd, u
                    heapq.heappush(pq, (nd, v))
    if b not in dist:
        raise SystemExit(f"aucun chemin entre {a} et {b}")
    seq = [b]
    while seq[-1] != a:
        seq.append(prev[seq[-1]])
    return seq[::-1]


# Repères (pixels à 150 dpi de la page), dans l'ordre du tracé de l'intro.
K = 2  # l'image est à 300 dpi
STROKES = {
    "fût du R": [(345, 345), (332, 500), (328, 620)],
    "R puis N": [(222, 497), (180, 522), (170, 480), (205, 400), (260, 330), (390, 235), (520, 180), (610, 163), (665, 215),
                 (668, 275), (625, 330), (560, 385), (468, 468), (530, 525), (600, 640), (655, 712), (760, 800), (870, 838),
                 (965, 805), (985, 700), (968, 520), (970, 400), (1000, 358), (1050, 385), (1048, 435), (1020, 455)],
    "crochet": [(650, 722), (640, 800), (630, 880), (600, 910), (575, 887)],
    "petit trait": [(622, 518), (628, 578)],
    "queue": [(988, 790), (1000, 860)],
}
SMOOTH = 31        # fenêtre de lissage (pixels du squelette)
TOLERANCE = 2.5    # simplification (pixels)
WIDTH = 2.75       # largeur de la signature dans la scène (unités 3D)

lines = {}
for name, wps in STROKES.items():
    snapped = []
    for x, y in wps:
        p, d = snap(x * K, y * K)
        if d > 30:
            print(f"  attention : repère {(x, y)} de « {name} » à {d:.0f} px du trait")
        snapped.append(p)
    seq = []
    for a, b in zip(snapped, snapped[1:]):
        seg = shortest(a, b)
        seq += seg if not seq else seg[1:]
    arr = np.array([(x, y) for (y, x) in seq], float)
    if len(arr) > SMOOTH:
        h = SMOOTH // 2
        pad = np.pad(arr, ((h, h), (0, 0)), mode="edge")
        sm = np.array([pad[i:i + SMOOTH].mean(0) for i in range(len(arr))])
        sm[0], sm[-1] = arr[0], arr[-1]  # extrémités conservées
        arr = sm
    lines[name] = measure.approximate_polygon(arr, tolerance=TOLERANCE)

# le crochet part du point de la jambe le plus proche (pas de trou à la jonction)
main, hook = lines["R puis N"], lines["crochet"]
j = main[np.argmin(((main - hook[0]) ** 2).sum(1))]
lines["crochet"] = np.vstack([j, hook])

# point final : la tache la plus proche de son repère
lab = measure.label(ink)
reg = min(measure.regionprops(lab), key=lambda r: (r.centroid[1] - 1095 * K) ** 2 + (r.centroid[0] - 835 * K) ** 2)
dot = (reg.centroid[1], reg.centroid[0], reg.equivalent_diameter_area / 2)

allp = np.vstack(list(lines.values()) + [[[dot[0] + dot[2], dot[1] + dot[2]]]])
(minx, miny), (maxx, maxy) = allp.min(0), allp.max(0)
k = WIDTH / (maxx - minx)
ox, oy = (minx + maxx) / 2, (miny + maxy) / 2
conv = lambda p: (round((p[0] - ox) * k, 4), round(-(p[1] - oy) * k, 4))

out = [
    "// Généré depuis docs/logo/rn-logo-v2.pdf par scripts/trace-logo.py — ne pas modifier à la main.",
    "// Ligne centrale de chaque trait de la signature, en unités de la scène 3D,",
    "// dans l'ordre du tracé de l'intro. Le relief (z) est ajouté dans shape.ts.",
    "",
    "export const SIGNATURE_STROKES: readonly (readonly (readonly [number, number])[])[] = [",
]
for name, line in lines.items():
    out.append(f"  // {name}")
    out.append("  [" + ", ".join(f"[{x}, {y}]" for x, y in map(conv, line)) + "],")
out.append("];")
dx, dy = conv(dot)
out += ["", "/** Point final de la signature : centre (x, y) et rayon. */",
        f"export const SIGNATURE_DOT = [{dx}, {dy}, {round(dot[2] * k * 0.85, 4)}] as const;", ""]
dest = ROOT / "src/components/core/signature-data.ts"
dest.write_text("\n".join(out))
print(f"{dest.relative_to(ROOT)} : {sum(len(l) for l in lines.values())} points, hauteur {round((maxy - miny) * k, 2)}")

# contrôle visuel : tracés extraits par-dessus le dessin
im = Image.open(src).convert("RGB")
dr = ImageDraw.Draw(im)
for line, col in zip(lines.values(), [(0, 200, 80), (255, 0, 200), (0, 160, 255), (255, 140, 0), (200, 0, 0)]):
    dr.line([tuple(p) for p in line], fill=col, width=5)
dr.ellipse([dot[0] - dot[2], dot[1] - dot[2], dot[0] + dot[2], dot[1] + dot[2]], outline=(200, 0, 0), width=5)
im.save(Path(src).with_name(Path(src).stem + "-controle.png"))
