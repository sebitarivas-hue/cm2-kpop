/**
 * Couche de persistance — ABSTRAITE derrière une interface.
 *
 * Aujourd'hui : LocalSaveAdapter (localStorage), pour que le MVP tourne
 * sans backend. Demain : SupabaseSaveAdapter (comptes + sauvegarde cloud +
 * tableaux de bord parent/enseignant) — sans toucher au reste du code.
 */
import type { SaveData } from '../state/store';

export interface SaveAdapter {
  load(): Promise<SaveData | null>;
  save(data: SaveData): Promise<void>;
}

const KEY = 'lumeria.save.v1';

export class LocalSaveAdapter implements SaveAdapter {
  async load(): Promise<SaveData | null> {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as SaveData) : null;
    } catch {
      return null;
    }
  }

  async save(data: SaveData): Promise<void> {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* quota / mode privé : on échoue silencieusement */
    }
  }
}

// Point de bascule unique vers le cloud le moment venu.
export const saveAdapter: SaveAdapter = new LocalSaveAdapter();
