import type { ContentItem, Royaume } from '../content/schema';
import { NUMERIA } from '../content/numeria';
import { VERBA } from '../content/verba';

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
};

/** Royaumes jouables aujourd'hui (les autres sont "à venir"). */
export const ROYAUMES_JOUABLES: Royaume[] = ['numeria', 'verba'];
