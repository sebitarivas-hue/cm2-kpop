import { useState } from 'react';
import { useGame } from '../state/store';

const PAGES = [
  {
    titre: 'Le monde s’éteint',
    texte:
      "Luméria était un monde de lumière. Mais la Grisaille — l’Oubli — efface peu à peu les couleurs, les mots et les nombres. Sept Phares du Savoir se sont éteints.",
  },
  {
    titre: 'Tu es un Éveilleur',
    texte:
      "Tu possèdes un don rare : canaliser TOUS les Savoirs. En apprenant, tu gagnes des pouvoirs. Ton voyage : rallumer les Phares, royaume après royaume.",
  },
  {
    titre: 'Premier royaume : Numéria',
    texte:
      "Ici règne la Cristomancie, la magie des nombres. Le Sage Numéa t’attend. Reforme ses Ponts de Lumière pour rallumer son Phare.",
  },
];

export function Onboarding() {
  const [page, setPage] = useState(0);
  const [pseudo, setPseudo] = useState('');
  const setPseudoStore = useGame((s) => s.setPseudo);
  const finir = useGame((s) => s.finirOnboarding);
  const dernier = page === PAGES.length - 1;

  return (
    <div className="overlay center">
      <div className="panel">
        <div className="kicker">LUMÉRIA · Chapitre 1</div>
        <h1>{PAGES[page].titre}</h1>
        <p className="lead">{PAGES[page].texte}</p>

        {dernier && (
          <label className="field">
            <span>Quel est ton nom d’Éveilleur ?</span>
            <input
              value={pseudo}
              maxLength={16}
              placeholder="Ton nom…"
              onChange={(e) => setPseudo(e.target.value)}
            />
          </label>
        )}

        <div className="row">
          <div className="dots">
            {PAGES.map((_, i) => (
              <span key={i} className={i === page ? 'dot on' : 'dot'} />
            ))}
          </div>
          {!dernier ? (
            <button className="cta" onClick={() => setPage((p) => p + 1)}>
              Continuer →
            </button>
          ) : (
            <button
              className="cta"
              disabled={!pseudo.trim()}
              onClick={() => {
                setPseudoStore(pseudo.trim());
                finir();
              }}
            >
              Entrer dans Luméria ✦
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
