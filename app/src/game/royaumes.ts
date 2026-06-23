import type { ContentItem, Royaume } from '../content/schema';
import { NUMERIA } from '../content/numeria';
import { VERBA } from '../content/verba';
import { VIVARIA } from '../content/vivaria';
import { CHRONOS } from '../content/chronos';
import { TERRA } from '../content/terra';
import { BABEL } from '../content/babel';
import { CHROMA } from '../content/chroma';

/**
 * Configuration d'un royaume. Le moteur (RoyaumeScene) est piloté par
 * ces données : ajouter un royaume = ajouter une config + un pool de contenu,
 * sans toucher au moteur. C'est ce qui rend les 7 royaumes scalables.
 */
export interface RoyaumeConfig {
  id: Royaume;
  nom: string;
  sage: string;
  pouvoir: string; // "Cristomancie"
  objet: string; // ce que l'on répare : "Pont de Lumière", "Rune brisée"
  intro: string;
  tout: string; // réplique quand tous les objets sont réparés
  pool: ContentItem[];
  // Palette de rendu procédural.
  ciel: [number, number, number, number];
  accent: number;
  joueur: number;
  emoji: string;
}

export const ROYAUMES: Record<string, RoyaumeConfig> = {
  numeria: {
    id: 'numeria',
    nom: 'Numéria',
    sage: 'Sage Numéa',
    pouvoir: 'Cristomancie',
    objet: 'Pont de Lumière',
    intro:
      'Éveilleur… la Grisaille a brisé mes Ponts de Lumière. Reforme-les par la Cristomancie, et rallume mon Phare.',
    tout: 'Tous les ponts brillent ! Viens jusqu’à moi rallumer le Phare de Numéria.',
    pool: NUMERIA,
    ciel: [0x1a1140, 0x2a1a5e, 0x4326a6, 0x6d3bd6],
    accent: 0x9d7bff,
    joueur: 0x18d3ff,
    emoji: '✦',
  },
  verba: {
    id: 'verba',
    nom: 'Verba',
    sage: 'Sage Lettra',
    pouvoir: 'Runomancie',
    objet: 'Rune brisée',
    intro:
      'Bienvenue, Éveilleur. Les mots-runes de Verba sont fendus par l’Oubli. Répare-les par la Runomancie pour rallumer mon Phare.',
    tout: 'Toutes les runes scintillent ! Rejoins-moi pour rallumer le Phare de Verba.',
    pool: VERBA,
    ciel: [0x10331f, 0x14503a, 0x1f7a52, 0x36c47e],
    accent: 0x7bffb0,
    joueur: 0xffd36b,
    emoji: '✦',
  },
  vivaria: {
    id: 'vivaria',
    nom: 'Vivaria',
    sage: 'Sage Florae',
    pouvoir: 'Biomancie',
    objet: 'Bourgeon de Vie',
    intro:
      'Éveilleur, l’Arbre-monde de Vivaria se flétrit. Ranime ses Bourgeons par la Biomancie pour rallumer mon Phare.',
    tout: 'La sève remonte, l’Arbre-monde reverdit ! Rejoins-moi pour rallumer le Phare de Vivaria.',
    pool: VIVARIA,
    ciel: [0x0a2a2e, 0x0f4a48, 0x149c8a, 0x3ad1c4],
    accent: 0x6bf0d8,
    joueur: 0xffe06b,
    emoji: '❀',
  },
  chronos: {
    id: 'chronos',
    nom: 'Chronos',
    sage: 'Sage Tempus',
    pouvoir: 'Chronomancie',
    objet: 'Fragment du Temps',
    intro:
      'Le Temps s’est brisé, Éveilleur. Recolle mes Fragments par la Chronomancie et le Phare de Chronos battra de nouveau.',
    tout: 'Les rouages tournent à nouveau ! Viens rallumer le Phare de Chronos.',
    pool: CHRONOS,
    ciel: [0x3a2410, 0x5e3c12, 0x9c6a1e, 0xffd36b],
    accent: 0xffd36b,
    joueur: 0x7c5cff,
    emoji: '⧖',
  },
  terra: {
    id: 'terra',
    nom: 'Terra',
    sage: 'Sage Orbis',
    pouvoir: 'Géomancie',
    objet: 'Fragment de Carte',
    intro:
      'Bienvenue, Éveilleur. Les Cartes de Terra sont déchirées. Recompose-les par la Géomancie pour rallumer mon Phare.',
    tout: 'Le monde retrouve ses contours ! Rejoins-moi pour rallumer le Phare de Terra.',
    pool: TERRA,
    ciel: [0x3a1808, 0x6e2e10, 0xb24a1e, 0xff7a45],
    accent: 0xff9d6b,
    joueur: 0x3ad1c4,
    emoji: '✦',
  },
  babel: {
    id: 'babel',
    nom: 'Babel',
    sage: 'Sage Lingua',
    pouvoir: 'Glossomancie',
    objet: 'Mot perdu',
    intro:
      'Éveilleur, les langues de Babel se sont tues. Réveille les Mots perdus par la Glossomancie et rallume mon Phare.',
    tout: 'Les voix s’élèvent de nouveau ! Viens rallumer le Phare de Babel.',
    pool: BABEL,
    ciel: [0x3a0e2a, 0x6e1648, 0xb22a6e, 0xff5fa2],
    accent: 0xff8fc4,
    joueur: 0xffe06b,
    emoji: '✦',
  },
  chroma: {
    id: 'chroma',
    nom: 'Chroma',
    sage: 'Sage Iris',
    pouvoir: 'Chromancie',
    objet: 'Couleur éteinte',
    intro:
      'Tout est gris, Éveilleur… Ranime mes Couleurs éteintes par la Chromancie pour rallumer le dernier Phare, celui de Chroma.',
    tout: 'Le monde explose de couleurs ! Rejoins-moi pour rallumer le Phare de Chroma.',
    pool: CHROMA,
    ciel: [0x1c1140, 0x35206e, 0x5a36b2, 0x7c5cff],
    accent: 0xb89dff,
    joueur: 0xff5fa2,
    emoji: '✦',
  },
};

/** Royaumes jouables aujourd'hui (les autres sont "à venir"). */
export const ROYAUMES_JOUABLES: Royaume[] = ['numeria', 'verba', 'vivaria', 'chronos', 'terra', 'babel', 'chroma'];
