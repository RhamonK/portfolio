"""Allège un GLB très lourd (ex. Tripo / Rodin) sans faire planter Blender.

Usage (Windows) :
  "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" -b --factory-startup ^
    --python decimate_bust.py -- entree.glb sortie.glb 35000

Principe, pour limiter la mémoire :
- un seul objet traité à la fois, modificateur appliqué sur place (pas de copie évaluée) ;
- réduction en plusieurs passes (au plus /4 par passe) ;
- purge des données orphelines après chaque passe ;
- textures ramenées à 2048 px avant l'export.
"""
import bpy, os, sys, math, gc

argv = sys.argv[sys.argv.index("--") + 1:]
SRC, DST = argv[0], argv[1]
TARGET = int(argv[2]) if len(argv) > 2 else 35000
MAX_TEX = 2048

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
total = sum(len(o.data.polygons) for o in meshes)
print("FACES AVANT", total)


def purge():
    bpy.ops.outliner.orphans_purge(do_recursive=True)
    gc.collect()


for ob in meshes:
    share = len(ob.data.polygons) / max(total, 1)
    goal = max(500, int(TARGET * share))
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    # réduction progressive (une grosse réduction d'un coup fait manquer de mémoire)
    while len(ob.data.polygons) > goal * 1.05:
        ratio = max(goal / len(ob.data.polygons), 0.25)
        md = ob.modifiers.new("dec", "DECIMATE")
        md.decimate_type = "COLLAPSE"
        md.ratio = ratio
        md.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=md.name)
        purge()
        print(ob.name, "->", len(ob.data.polygons))

# textures : 2048 px maximum
for img in bpy.data.images:
    if img.size[0] > MAX_TEX or img.size[1] > MAX_TEX:
        s = MAX_TEX / max(img.size)
        img.scale(int(img.size[0] * s), int(img.size[1] * s))
        img.pack()

print("FACES APRES", sum(len(o.data.polygons) for o in meshes))
bpy.ops.export_scene.gltf(
    filepath=DST, export_format="GLB", export_yup=True, export_apply=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_image_format="WEBP",
)
print("EXPORTED", DST, os.path.getsize(DST))
