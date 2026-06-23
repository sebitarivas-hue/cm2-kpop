import { useEffect, useState } from 'react';
import { bus, EVENTS } from '../services/eventBus';
import { useGame } from '../state/store';

/** Écran de victoire : le Phare du royaume est rallumé. Retour à la carte. */
export function Victory() {
  const [nom, setNom] = useState<string | null>(null);
  const retourCarte = useGame((s) => s.retourCarte);

  useEffect(
    () =>
      bus.on(EVENTS.PHARE_LIT, (p) => {
        setNom((p as { nom: string }).nom);
      }),
    [],
  );

  if (!nom) return null;

  return (
    <div className="overlay center">
      <div className="panel victory">
        <div className="phare-icon">🗼✨</div>
        <div className="kicker">PHARE RALLUMÉ</div>
        <h1>{nom} s’illumine</h1>
        <p className="lead">
          Tu as repoussé la Grisaille de ce royaume. Son pouvoir t’appartient désormais.
          D’autres Phares attendent leur Éveilleur…
        </p>
        <button
          className="cta"
          onClick={() => {
            setNom(null);
            retourCarte();
          }}
        >
          Retour à la carte ✦
        </button>
      </div>
    </div>
  );
}
