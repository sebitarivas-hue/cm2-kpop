import type { ContentItem } from './schema';

/** Tire un item adapté à une difficulté cible (différenciation simple). */
export function tirerItem(pool: ContentItem[], cible: number, exclus: Set<string>): ContentItem {
  const dispo = pool.filter((i) => !exclus.has(i.id));
  const source = dispo.length ? dispo : pool;
  const tries = [...source].sort(
    (a, b) => Math.abs(a.difficulte - cible) - Math.abs(b.difficulte - cible),
  );
  const fenetre = tries.slice(0, Math.min(4, tries.length));
  return fenetre[Math.floor(Math.random() * fenetre.length)];
}
