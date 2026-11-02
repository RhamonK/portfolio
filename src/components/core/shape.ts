// INFINITY CORE — la signature RN de Rhamone, reproduite d'après son logo manuscrit
// (docs/logo/rn-logo-v2.pdf). Les traits sont extraits automatiquement de la ligne
// centrale du dessin (scripts/trace-logo.py → signature-data.ts) ; ce fichier leur
// ajoute un léger relief dans l'épaisseur du verre et définit le bloc, la pose et le cadrage.

import * as THREE from "three";
import { SIGNATURE_STROKES } from "./signature-data";

/** Profondeur moyenne de la signature dans le verre, et amplitude du relief. */
export const SIGNATURE_Z = 0.06;
export const RELIEF = 0.11;

/** Une courbe 3D par trait, avec une ondulation douce en profondeur (le trait « respire » dans le verre). */
export function signatureCurves() {
  return SIGNATURE_STROKES.map((stroke, si) => {
    const n = stroke.length;
    const pts = stroke.map(([x, y], i) => {
      const s = n > 1 ? i / (n - 1) : 0;
      const z = SIGNATURE_Z + RELIEF * Math.sin(s * Math.PI * 2.2 + si * 1.3) * (si === 1 ? 1 : 0.5);
      return new THREE.Vector3(x, y, z);
    });
    return new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  });
}

/** Bloc de verre poli : superellipsoïde (demi-axes et exposant). */
export const BODY = { rx: 1.75, ry: 1.38, rz: 0.5, exponent: 0.55 } as const;

/** Pose de repos de l'objet (radians) et cadrage caméra, communs à la 3D et à l'image fixe. */
export const POSE = { x: 0.08, y: -0.22, z: 0.02 } as const;
export const CAMERA = { fov: 32, z: 6.2, y: 0.15 } as const;

/** Rapport largeur / hauteur de la zone du noyau (l'image fixe est rendue à ce format). */
export const CORE_ASPECT = 4 / 3;
