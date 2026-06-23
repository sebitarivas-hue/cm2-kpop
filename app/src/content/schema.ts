/**
 * Schéma de contenu pédagogique.
 *
 * Principe fondateur de la refonte : le CONTENU est séparé du CODE et
 * TAGUÉ par compétence du programme. C'est ce qui alimentera plus tard
 * les tableaux de bord parent/enseignant et la promesse EdTech.
 *
 * Un "Item" n'est jamais "une question de quiz" du point de vue du joueur :
 * c'est la donnée qui alimente un SORT (mécanique de jeu).
 */

/** Royaumes = domaines d'apprentissage. */
export type Royaume =
  | 'numeria' // Mathématiques
  | 'verba' // Français
  | 'vivaria' // Sciences
  | 'chronos' // Histoire
  | 'terra' // Géographie
  | 'babel' // Langues
  | 'chroma'; // Arts

/**
 * Codes de compétences (extrait du programme Cycle 3 / CM1-CM2).
 * Format DOMAINE.SOUS-DOMAINE — extensible matière par matière.
 */
export type Competence =
  // Maths — Numéria
  | 'NUM.FRACTION'
  | 'NUM.DECIMAL'
  | 'NUM.ENTIER'
  | 'CALC.MENTAL'
  | 'CALC.POSE'
  | 'GEOM.PERIMETRE'
  | 'GEOM.AIRE'
  | 'GEOM.FIGURE'
  | 'MES.DUREE'
  | 'MES.LONGUEUR'
  | 'MES.MASSE'
  | 'PROBLEME'
  // Français — Verba
  | 'FR.CLASSE_MOT'
  | 'FR.ACCORD_GN'
  | 'FR.SUJET_VERBE'
  | 'FR.CONJUG_PRESENT'
  | 'FR.CONJUG_IMPARFAIT'
  | 'FR.CONJUG_FUTUR'
  | 'FR.HOMOPHONE'
  | 'FR.VOCABULAIRE'
  | 'FR.ORTHOGRAPHE';

/** Type d'interaction (réskinné en "sort" à l'écran). */
export type ItemKind = 'qcm' | 'saisie';

export interface ContentItem {
  id: string;
  royaume: Royaume;
  competence: Competence;
  /** 1 (CM1 facile) -> 5 (CM2 expert). Pilote la différenciation. */
  difficulte: 1 | 2 | 3 | 4 | 5;
  kind: ItemKind;
  /** Énoncé, formulé dans la fiction quand c'est pertinent. */
  enonce: string;
  /** QCM uniquement. */
  choix?: string[];
  /** QCM : index de la bonne réponse. Saisie : réponses acceptées (normalisées). */
  reponse: number | string[];
  /** Indice optionnel donné par le Sage. */
  indice?: string;
}

/** Normalise une saisie joueur pour comparaison tolérante. */
export function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/€|min|cm²|cm|m|kg|g/g, '')
    .replace(',', '.');
}

/** Vérifie la réponse d'un item. */
export function estCorrect(item: ContentItem, reponse: number | string): boolean {
  if (item.kind === 'qcm') return reponse === item.reponse;
  const attendu = (item.reponse as string[]).map(normalise);
  return attendu.includes(normalise(String(reponse)));
}
