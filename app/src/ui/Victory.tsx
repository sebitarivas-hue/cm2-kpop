import { useEffect, useState } from 'react';
import { bus, EVENTS } from '../services/eventBus';

/** Écran de victoire : le Phare du royaume est rallumé (fin du vertical slice). */
export function Victory() {
  const [open, setOpen] = useState(false);
  useEffect(() => bus.on(EVENTS.PHARE_LIT, () => setOpen(true)), []);
  if (!open) return null;

  return (
    <div className="overlay center">
      <div className="panel victory">
        <div className="phare-icon">🗼✨</div>
        <div className="kicker">PHARE RALLUMÉ</div>
        <h1>Numéria s’illumine</h1>
        <p className="lead">
          Tu as repoussé la Grisaille du royaume des nombres. La Cristomancie t’appartient désormais.
          Six autres Phares attendent leur Éveilleur…
        </p>
        <div className="next-realms">
          <span className="locked">🔒 Verba</span>
          <span className="locked">🔒 Vivaria</span>
          <span className="locked">🔒 Chronos</span>
          <span className="locked">🔒 Terra</span>
        </div>
        <button className="cta" onClick={() => setOpen(false)}>
          Continuer l’aventure
        </button>
        <p className="demo-note">Fin de la démo jouable · prochain royaume en développement</p>
      </div>
    </div>
  );
}
