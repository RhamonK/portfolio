// Partagé entre la présentation et le présentateur 3D, sans charger Three.js.

export type PresenterSignals = {
  /** Ouverture de la bouche, 0 à 1. */
  speaking: number;
  /** Lève le bâton vers la diapo. */
  pointing: boolean;
  /** Souris normalisée, -1 à 1. */
  mouse: { x: number; y: number };
  /** Mouvement réduit : pas de balancement. */
  still: boolean;
  /** Position réelle de la bouche (fraction depuis le haut), donnée par le modèle 3D. */
  mouthY?: number;
  /** Position horizontale réelle de la bouche (fraction depuis la gauche). */
  mouthX?: number;
};

/** Position verticale de la bouche dans le canvas (fraction depuis le haut). */
export const MOUTH_Y = 0.48;
