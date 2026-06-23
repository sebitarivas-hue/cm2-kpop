import type { ContentItem } from './schema';

/**
 * NUMÉRIA — Mathématiques. Pouvoir : CRISTOMANCIE.
 *
 * Échantillon migré et TAGUÉ depuis la banque existante (752 items),
 * pour prouver le pipeline contenu -> compétence -> mécanique.
 * Chaque item est rattaché à une compétence du programme CM1-CM2.
 *
 * À terme : ce fichier est généré/édité via un CMS par des pédagogues,
 * pas par des développeurs.
 */
export const NUMERIA: ContentItem[] = [
  {
    id: 'num-frac-001',
    royaume: 'numeria',
    competence: 'NUM.FRACTION',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Le cristal est fendu : 3/4 + 1/4. Quelle part de lumière reformes-tu ?',
    choix: ['1 (le cristal entier)', '2/4', '4/8', '3/4'],
    reponse: 0,
    indice: 'Quand le haut et le bas se rejoignent, le cristal redevient entier.',
  },
  {
    id: 'num-frac-002',
    royaume: 'numeria',
    competence: 'NUM.FRACTION',
    difficulte: 3,
    kind: 'qcm',
    enonce: 'Coupe le cristal en deux moitiés égales. Quelle fraction représente une moitié ?',
    choix: ['1/4', '1/2', '2/3', '1/3'],
    reponse: 1,
  },
  {
    id: 'num-decim-001',
    royaume: 'numeria',
    competence: 'NUM.DECIMAL',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Parmi ces éclats, lequel brille le plus FAIBLEMENT (le plus petit) ?',
    choix: ['0,5', '0,05', '0,55', '0,2'],
    reponse: 1,
  },
  {
    id: 'num-decim-002',
    royaume: 'numeria',
    competence: 'NUM.DECIMAL',
    difficulte: 2,
    kind: 'qcm',
    enonce: 'Deux éclats de 0,1 fusionnent. Quelle est leur lumière totale ?',
    choix: ['0,11', '0,2', '1', '0,02'],
    reponse: 1,
  },
  {
    id: 'num-calc-001',
    royaume: 'numeria',
    competence: 'CALC.MENTAL',
    difficulte: 2,
    kind: 'saisie',
    enonce: 'Forge la rune-nombre : 7 × 8',
    reponse: ['56'],
    indice: "C'est la table de 8.",
  },
  {
    id: 'num-calc-002',
    royaume: 'numeria',
    competence: 'CALC.MENTAL',
    difficulte: 3,
    kind: 'saisie',
    enonce: 'Forge la rune-nombre : 12 × 12',
    reponse: ['144'],
  },
  {
    id: 'num-calc-003',
    royaume: 'numeria',
    competence: 'CALC.POSE',
    difficulte: 3,
    kind: 'saisie',
    enonce: 'Assemble les cristaux : 456 + 789',
    reponse: ['1245', '1 245'],
  },
  {
    id: 'num-geom-001',
    royaume: 'numeria',
    competence: 'GEOM.PERIMETRE',
    difficulte: 3,
    kind: 'qcm',
    enonce: 'Le pont est un carré de côté 5 pas. Combien de pas pour en faire le tour ?',
    choix: ['10', '25', '20', '15'],
    reponse: 2,
    indice: 'Le tour du carré = 4 côtés.',
  },
  {
    id: 'num-geom-002',
    royaume: 'numeria',
    competence: 'GEOM.AIRE',
    difficulte: 3,
    kind: 'qcm',
    enonce: "Dalle de lumière : 4 pas sur 3 pas. Combien de dalles d'aire ?",
    choix: ['7', '12', '14', '24'],
    reponse: 1,
    indice: 'Aire du rectangle = longueur × largeur.',
  },
  {
    id: 'num-mes-001',
    royaume: 'numeria',
    competence: 'MES.DUREE',
    difficulte: 2,
    kind: 'saisie',
    enonce: 'Le sablier coule pendant 2 h 30. Combien de minutes de lumière ?',
    reponse: ['150'],
    indice: 'Une heure = 60 minutes.',
  },
];

/** Tire un item adapté à une difficulté cible (différenciation simple). */
export function tirerItem(pool: ContentItem[], cible: number, exclus: Set<string>): ContentItem {
  const dispo = pool.filter((i) => !exclus.has(i.id));
  const source = dispo.length ? dispo : pool;
  // Trie par proximité à la difficulté cible, garde un peu d'aléa.
  const tries = [...source].sort(
    (a, b) => Math.abs(a.difficulte - cible) - Math.abs(b.difficulte - cible),
  );
  const fenetre = tries.slice(0, Math.min(4, tries.length));
  return fenetre[Math.floor(Math.random() * fenetre.length)];
}
