import { create } from 'zustand';
import type { Competence, Royaume } from '../content/schema';
import { saveAdapter } from '../services/save';

/** Maîtrise d'une compétence (0..1) — alimentera les dashboards. */
export type Mastery = Partial<Record<Competence, number>>;

/** Apparence de l'Éveilleur — style idole K-pop. Couleurs en hex. */
export interface AvatarConfig {
  peau: string;
  cheveux: string; // couleur principale
  meches: string; // mèches / dégradé secondaire
  yeux: string; // couleur des yeux
  coiffure: 'idol_long' | 'wolfcut' | 'twin' | 'bob' | 'updo' | 'mullet';
  tenue: string; // couleur dominante de la tenue
  style: 'scene' | 'bomber' | 'hoodie' | 'crop';
  accessoire: 'aucun' | 'boucles' | 'choker' | 'casque' | 'lunettes' | 'cap' | 'couronne';
  personnalise: boolean;
}

export const AVATAR_DEFAUT: AvatarConfig = {
  peau: '#f1c9a5',
  cheveux: '#2a1a3a',
  meches: '#ff5fa2',
  yeux: '#5b3a2a',
  coiffure: 'idol_long',
  tenue: '#ff4d8d',
  style: 'scene',
  accessoire: 'boucles',
  personnalise: false,
};

export interface SaveData {
  pseudo: string;
  niveau: number;
  xp: number;
  eclats: number; // monnaie de collection (gagnée en jouant, jamais achetée pour gagner)
  pharesAllumes: Royaume[];
  mastery: Mastery;
  itemsReussis: string[];
  derniereVisite: string; // ISO date — pour la boucle quotidienne
  streak: number;
  avatar: AvatarConfig;
}

const XP_PAR_NIVEAU = 100;

interface GameState extends SaveData {
  pretCharge: boolean;
  onboardingFait: boolean;
  royaumeActif: Royaume | null; // null = on est sur la carte-monde
  menuOuvert: boolean;
  // actions
  init: () => Promise<void>;
  entrerRoyaume: (r: Royaume) => void;
  retourCarte: () => void;
  ouvrirMenu: () => void;
  fermerMenu: () => void;
  changerApparence: () => void;
  setAvatar: (patch: Partial<AvatarConfig>) => void;
  gagnerXP: (xp: number) => void;
  enregistrerReussite: (itemId: string, competence: Competence) => void;
  allumerPhare: (r: Royaume) => void;
  setPseudo: (p: string) => void;
  finirOnboarding: () => void;
  reset: () => void;
}

const ETAT_INITIAL: SaveData = {
  pseudo: '',
  niveau: 1,
  xp: 0,
  eclats: 0,
  pharesAllumes: [],
  mastery: {},
  itemsReussis: [],
  derniereVisite: new Date().toISOString(),
  streak: 1,
  avatar: AVATAR_DEFAUT,
};

function snapshot(s: GameState): SaveData {
  return {
    pseudo: s.pseudo,
    niveau: s.niveau,
    xp: s.xp,
    eclats: s.eclats,
    pharesAllumes: s.pharesAllumes,
    mastery: s.mastery,
    itemsReussis: s.itemsReussis,
    derniereVisite: s.derniereVisite,
    streak: s.streak,
    avatar: s.avatar,
  };
}

export const useGame = create<GameState>((set, get) => ({
  ...ETAT_INITIAL,
  pretCharge: false,
  onboardingFait: false,
  royaumeActif: null,
  menuOuvert: false,

  entrerRoyaume: (r) => set({ royaumeActif: r, menuOuvert: false }),
  retourCarte: () => set({ royaumeActif: null, menuOuvert: false }),
  ouvrirMenu: () => set({ menuOuvert: true }),
  fermerMenu: () => set({ menuOuvert: false }),

  // Revenir au créateur d'avatar (puis retour à la carte).
  changerApparence: () => {
    set({ avatar: { ...get().avatar, personnalise: false }, royaumeActif: null, menuOuvert: false });
    saveAdapter.save(snapshot(get()));
  },

  setAvatar: (patch) => {
    set({ avatar: { ...get().avatar, ...patch } });
    saveAdapter.save(snapshot(get()));
  },

  init: async () => {
    const data = await saveAdapter.load();
    if (data) {
      // Streak bienveillant : +1 si nouveau jour, jamais de remise à zéro punitive.
      const hier = new Date(data.derniereVisite).toDateString();
      const ajd = new Date().toDateString();
      const streak = hier === ajd ? data.streak : data.streak + 1;
      set({
        ...data,
        avatar: data.avatar ?? AVATAR_DEFAUT, // compat anciennes sauvegardes
        streak,
        derniereVisite: new Date().toISOString(),
        pretCharge: true,
        onboardingFait: !!data.pseudo,
      });
    } else {
      set({ pretCharge: true });
    }
  },

  gagnerXP: (xp) => {
    const s = get();
    let total = s.xp + xp;
    let niveau = s.niveau;
    while (total >= XP_PAR_NIVEAU) {
      total -= XP_PAR_NIVEAU;
      niveau += 1;
    }
    set({ xp: total, niveau, eclats: s.eclats + Math.round(xp / 5) });
    saveAdapter.save(snapshot(get()));
  },

  enregistrerReussite: (itemId, competence) => {
    const s = get();
    const actuel = s.mastery[competence] ?? 0;
    const mastery = { ...s.mastery, [competence]: Math.min(1, actuel + 0.15) };
    const itemsReussis = s.itemsReussis.includes(itemId)
      ? s.itemsReussis
      : [...s.itemsReussis, itemId];
    set({ mastery, itemsReussis });
    saveAdapter.save(snapshot(get()));
  },

  allumerPhare: (r) => {
    const s = get();
    if (s.pharesAllumes.includes(r)) return;
    set({ pharesAllumes: [...s.pharesAllumes, r] });
    saveAdapter.save(snapshot(get()));
  },

  setPseudo: (p) => {
    set({ pseudo: p });
    saveAdapter.save(snapshot(get()));
  },

  finirOnboarding: () => {
    set({ onboardingFait: true });
    saveAdapter.save(snapshot(get()));
  },

  reset: () => {
    set({ ...ETAT_INITIAL, pretCharge: true, onboardingFait: false, royaumeActif: null, menuOuvert: false });
    saveAdapter.save(ETAT_INITIAL);
  },
}));
