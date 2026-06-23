/**
 * Couche de persistance — ABSTRAITE derrière une interface.
 *
 * Aujourd'hui : LocalSaveAdapter (localStorage), pour que le MVP tourne
 * sans backend. Demain : SupabaseSaveAdapter (comptes + sauvegarde cloud +
 * tableaux de bord parent/enseignant) — sans toucher au reste du code.
 */
import type { SaveData } from '../state/store';
import { SupabaseSaveAdapter } from './supabaseSave';

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

/**
 * Sélection de l'adaptateur — POINT DE BASCULE UNIQUE vers le cloud.
 * Si les variables d'env Supabase sont présentes : sauvegarde cloud + comptes.
 * Sinon : sauvegarde locale (le MVP tourne sans backend).
 */
function choisirAdapter(): SaveAdapter {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) return new SupabaseSaveAdapter(url, key);
  return new LocalSaveAdapter();
}

export const saveAdapter: SaveAdapter = choisirAdapter();
