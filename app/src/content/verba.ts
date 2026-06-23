import type { ContentItem } from './schema';

/**
 * VERBA — Français. Pouvoir : RUNOMANCIE.
 *
 * Les mots sont des runes. La Grisaille les brise (mauvais accord, mauvais temps).
 * L'Éveilleur les répare pour rouvrir les portes du royaume.
 * Items tagués par compétence du programme CM1-CM2.
 */
export const VERBA: ContentItem[] = [
  {
    id: 'fr-classe-001',
    royaume: 'verba',
    competence: 'FR.CLASSE_MOT',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Dans la rune « le dragon ROUGE vole », quelle est la nature de « rouge » ?',
    choix: ['un nom', 'un adjectif', 'un verbe', 'un déterminant'],
    reponse: 1,
    indice: "Il décrit le dragon : c'est un adjectif qualificatif.",
  },
  {
    id: 'fr-accord-001',
    royaume: 'verba',
    competence: 'FR.ACCORD_GN',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Répare la rune : « les sages ___ ».',
    choix: ['gardien', 'gardiens', 'gardienne', 'gardiens.'],
    reponse: 1,
    indice: 'Pluriel : le nom prend un -s.',
  },
  {
    id: 'fr-sujet-001',
    royaume: 'verba',
    competence: 'FR.SUJET_VERBE',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Dans « Les étoiles brillent », quel est le sujet ?',
    choix: ['brillent', 'Les étoiles', 'étoiles brillent', 'Les'],
    reponse: 1,
  },
  {
    id: 'fr-present-001',
    royaume: 'verba',
    competence: 'FR.CONJUG_PRESENT',
    difficulte: 2,
    kind: 'saisie',
    enonce: 'Conjugue au présent : « nous (chanter) » → nous ___',
    reponse: ['chantons'],
    indice: 'Présent, 1re personne du pluriel : terminaison -ons.',
  },
  {
    id: 'fr-imparfait-001',
    royaume: 'verba',
    competence: 'FR.CONJUG_IMPARFAIT',
    difficulte: 3,
    kind: 'saisie',
    enonce: 'Conjugue à l’imparfait : « il (manger) » → il ___',
    reponse: ['mangeait'],
    indice: 'Imparfait, 3e personne : -ait (et le e garde le son doux).',
  },
  {
    id: 'fr-futur-001',
    royaume: 'verba',
    competence: 'FR.CONJUG_FUTUR',
    difficulte: 3,
    kind: 'saisie',
    enonce: 'Conjugue au futur : « tu (partir) » → tu ___',
    reponse: ['partiras'],
  },
  {
    id: 'fr-homo-001',
    royaume: 'verba',
    competence: 'FR.HOMOPHONE',
    difficulte: 3,
    kind: 'qcm',
    enonce: 'Choisis la bonne rune : « Il ___ allé à la tour. »',
    choix: ['est', 'es', 'et', 'ai'],
    reponse: 0,
    indice: "On peut remplacer par « était » → c'est le verbe être : « est ».",
  },
  {
    id: 'fr-homo-002',
    royaume: 'verba',
    competence: 'FR.HOMOPHONE',
    difficulte: 3,
    kind: 'qcm',
    enonce: 'Choisis : « ___ amis sont là. »',
    choix: ['Ses', 'Ces', 'C’est', 'Sais'],
    reponse: 1,
    indice: 'On montre ces amis-là (démonstratif) → « Ces ».',
  },
  {
    id: 'fr-voc-001',
    royaume: 'verba',
    competence: 'FR.VOCABULAIRE',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Quel mot est le contraire (antonyme) de « clair » ?',
    choix: ['lumineux', 'sombre', 'brillant', 'pâle'],
    reponse: 1,
  },
];
