import { useState } from 'react';
import { useGame } from '../state/store';

/** Bouton de navigation global + panneau (carte, apparence, recommencer). */
export function Menu() {
  const menuOuvert = useGame((s) => s.menuOuvert);
  const ouvrirMenu = useGame((s) => s.ouvrirMenu);
  const fermerMenu = useGame((s) => s.fermerMenu);
  const royaumeActif = useGame((s) => s.royaumeActif);
  const retourCarte = useGame((s) => s.retourCarte);
  const changerApparence = useGame((s) => s.changerApparence);
  const reset = useGame((s) => s.reset);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <button className="menu-btn" onClick={ouvrirMenu} aria-label="Menu">
        ☰
      </button>

      {menuOuvert && (
        <div className="overlay menu-overlay" onClick={fermerMenu}>
          <nav className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="kicker">NAVIGATION</div>

            <button className="menu-item" onClick={fermerMenu}>
              ▸ Continuer
            </button>

            {royaumeActif && (
              <button className="menu-item" onClick={retourCarte}>
                🪐 Carte des royaumes
              </button>
            )}

            <button className="menu-item" onClick={changerApparence}>
              ✦ Changer d’apparence
            </button>

            {!confirmReset ? (
              <button className="menu-item danger" onClick={() => setConfirmReset(true)}>
                ↺ Recommencer l’aventure
              </button>
            ) : (
              <div className="menu-confirm">
                <p>Tout recommencer depuis le début ? Ta progression sera effacée.</p>
                <div className="menu-confirm-row">
                  <button
                    className="menu-item danger"
                    onClick={() => {
                      setConfirmReset(false);
                      reset();
                    }}
                  >
                    Oui, recommencer
                  </button>
                  <button className="menu-item" onClick={() => setConfirmReset(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
