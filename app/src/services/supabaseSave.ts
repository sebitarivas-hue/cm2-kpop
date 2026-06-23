import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { SaveData } from '../state/store';
import type { SaveAdapter } from './save';

/**
 * Adaptateur de sauvegarde CLOUD (Supabase).
 *
 * Activé uniquement si VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis.
 * Sinon on retombe sur LocalSaveAdapter (cf. save.ts). Aucune donnée personnelle
 * d'enfant : la table stocke un état de jeu pseudonyme rattaché à un compte
 * créé par parent/enseignant (RLS côté Supabase).
 *
 * Schéma SQL attendu (à créer côté Supabase, sécurisé par Row Level Security) :
 *   create table saves (
 *     user_id uuid primary key references auth.users on delete cascade,
 *     data jsonb not null,
 *     updated_at timestamptz default now()
 *   );
 */
export class SupabaseSaveAdapter implements SaveAdapter {
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  private async userId(): Promise<string | null> {
    const { data } = await this.client.auth.getUser();
    return data.user?.id ?? null;
  }

  async load(): Promise<SaveData | null> {
    const uid = await this.userId();
    if (!uid) return null;
    const { data, error } = await this.client
      .from('saves')
      .select('data')
      .eq('user_id', uid)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as SaveData;
  }

  async save(data: SaveData): Promise<void> {
    const uid = await this.userId();
    if (!uid) return;
    await this.client.from('saves').upsert({ user_id: uid, data, updated_at: new Date().toISOString() });
  }
}
