/**
 * Pipeline de validation du contenu pédagogique.
 *
 * Vérifie que chaque item respecte le schéma (id unique, compétence présente,
 * QCM avec index valide, saisie avec réponses non vides, difficulté 1..5).
 * À brancher en CI : un contenu invalide bloque le build.
 *
 * Lancement : npm run validate:content
 */
import { NUMERIA } from '../src/content/numeria.ts';
import { VERBA } from '../src/content/verba.ts';
import type { ContentItem } from '../src/content/schema.ts';

const POOLS: Record<string, ContentItem[]> = { numeria: NUMERIA, verba: VERBA };

let erreurs = 0;
const ids = new Set<string>();

function err(id: string, msg: string) {
  erreurs++;
  console.error(`  ✗ [${id}] ${msg}`);
}

for (const [royaume, pool] of Object.entries(POOLS)) {
  for (const it of pool) {
    if (!it.id) err('(sans id)', 'id manquant');
    if (ids.has(it.id)) err(it.id, 'id en double');
    ids.add(it.id);
    if (it.royaume !== royaume) err(it.id, `royaume "${it.royaume}" != pool "${royaume}"`);
    if (!it.competence) err(it.id, 'compétence manquante');
    if (it.difficulte < 1 || it.difficulte > 5) err(it.id, `difficulté hors bornes: ${it.difficulte}`);
    if (!it.enonce?.trim()) err(it.id, 'énoncé vide');

    if (it.kind === 'qcm') {
      if (!Array.isArray(it.choix) || it.choix.length < 2) err(it.id, 'QCM: au moins 2 choix requis');
      if (typeof it.reponse !== 'number' || it.reponse < 0 || it.reponse >= (it.choix?.length ?? 0))
        err(it.id, 'QCM: index de réponse invalide');
    } else if (it.kind === 'saisie') {
      if (!Array.isArray(it.reponse) || it.reponse.length === 0)
        err(it.id, 'saisie: au moins une réponse acceptée requise');
    } else {
      err(it.id, `type inconnu: ${(it as { kind: string }).kind}`);
    }
  }
}

const total = ids.size;
if (erreurs > 0) {
  console.error(`\n❌ Contenu invalide : ${erreurs} erreur(s) sur ${total} items.`);
  process.exit(1);
} else {
  console.log(`✅ Contenu valide : ${total} items, ${Object.keys(POOLS).length} royaumes.`);
}
