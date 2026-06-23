import { useGame } from '../state/store';
import { ROYAUMES, ROYAUMES_JOUABLES } from '../game/royaumes';
import type { Royaume } from '../content/schema';

/** Royaumes affichés sur la carte (jouables + à venir). */
const CARTE: { id: Royaume; nom: string; matiere: string; emoji: string; jouable: boolean }[] = [
  { id: 'numeria', nom: 'Numéria', matiere: 'Mathématiques', emoji: '🔷', jouable: true },
  { id: 'verba', nom: 'Verba', matiere: 'Français', emoji: '🔠', jouable: true },
  { id: 'vivaria', nom: 'Vivaria', matiere: 'Sciences', emoji: '🌿', jouable: false },
  { id: 'chronos', nom: 'Chronos', matiere: 'Histoire', emoji: '⏳', jouable: false },
  { id: 'terra', nom: 'Terra', matiere: 'Géographie', emoji: '🧭', jouable: false },
  { id: 'babel', nom: 'Babel', matiere: 'Langues', emoji: '💬', jouable: false },
  { id: 'chroma', nom: 'Chroma', matiere: 'Arts', emoji: '🎨', jouable: false },
];

/** Carte-monde : hub de sélection des royaumes (esprit "carte d'aventure"). */
export function WorldMap() {
  const { pseudo, pharesAllumes, entrerRoyaume } = useGame();

  return (
    <div className="overlay center map">
      <div className="map-inner">
        <div className="kicker">LUMÉRIA · Carte du Savoir</div>
        <h1>
          Bonjour {pseudo || 'Éveilleur'} — {pharesAllumes.length}/7 Phares rallumés
        </h1>
        <p className="lead">Choisis un royaume. Rallume son Phare pour repousser la Grisaille.</p>

        <div className="realm-grid">
          {CARTE.map((r) => {
            const allume = pharesAllumes.includes(r.id);
            const jouable = r.jouable && ROYAUMES_JOUABLES.includes(r.id);
            return (
              <button
                key={r.id}
                className={`realm ${jouable ? '' : 'realm-locked'} ${allume ? 'realm-lit' : ''}`}
                disabled={!jouable}
                onClick={() => jouable && entrerRoyaume(r.id)}
              >
                <span className="realm-emoji">{r.emoji}</span>
                <span className="realm-nom">{r.nom}</span>
                <span className="realm-mat">{r.matiere}</span>
                <span className="realm-tag">
                  {!jouable ? '🔒 à venir' : allume ? '✨ Phare allumé' : `${ROYAUMES[r.id].pouvoir}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
