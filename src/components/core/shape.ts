// INFINITY CORE — la signature RN : un seul trait fermé, sans début ni fin.
// R puis N, puis une boucle de retour qui repasse en profondeur sous les
// lettres, comme le soulignement d'une signature. Unités de la scène 3D.

export const SIGNATURE: readonly (readonly [number, number, number])[] = [
  [-1.15, -0.72, 0.1], [-1.15, -0.1, 0.1], [-1.15, 0.68, 0.1], [-1.1, 0.76, 0.1], // fût du R
  [-0.72, 0.77, 0.1], [-0.47, 0.6, 0.1], [-0.45, 0.32, 0.1], //                       panse
  [-0.66, 0.12, 0.1], [-1.08, 0.08, 0.1], [-0.92, 0.0, 0.1],
  [-0.62, -0.4, 0.1], [-0.42, -0.7, 0.1], //                                            jambe
  [-0.3, -0.74, 0.02], [-0.05, -0.74, 0.02], //                                         liaison, un peu en retrait
  [0.1, -0.7, 0.1], [0.12, -0.05, 0.1], [0.14, 0.7, 0.1], [0.2, 0.74, 0.1], //          N, premier jambage
  [0.58, 0.0, 0.1], [0.94, -0.7, 0.1], [1.0, -0.72, 0.1], //                             diagonale
  [1.02, -0.05, 0.1], [1.04, 0.74, 0.1], //                                              N, second jambage
  [1.2, 0.5, -0.3], [1.24, -0.5, -0.4], //                                               retour, en profondeur
  [0.95, -0.98, -0.42], [0.0, -1.04, -0.42], [-0.95, -0.98, -0.4], //                    soulignement
  [-1.28, -0.86, -0.22],
];

/** Bloc de verre poli : superellipsoïde (demi-axes et exposant). */
export const BODY = { rx: 1.75, ry: 1.3, rz: 0.5, exponent: 0.55 } as const;

/** Pose de repos de l'objet (radians) et cadrage caméra, communs à la 3D et à l'image fixe. */
export const POSE = { x: 0.08, y: -0.22, z: 0.02 } as const;
export const CAMERA = { fov: 32, z: 6.2, y: 0.15 } as const;

/** Rapport largeur / hauteur de la zone du noyau (l'image fixe est rendue à ce format). */
export const CORE_ASPECT = 4 / 3;
