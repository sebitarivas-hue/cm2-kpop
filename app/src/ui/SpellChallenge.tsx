import { useEffect, useState } from 'react';
import { bus, EVENTS } from '../services/eventBus';
import { estCorrect, type ContentItem } from '../content/schema';

/**
 * L'épreuve "lancer un sort" : c'est ICI que l'apprentissage devient gameplay.
 * Le joueur ne "répond pas à une question" — il canalise la Cristomancie.
 */
export function SpellChallenge() {
  const [item, setItem] = useState<ContentItem | null>(null);
  const [saisie, setSaisie] = useState('');
  const [etat, setEtat] = useState<'idle' | 'ok' | 'ko'>('idle');
  const [indice, setIndice] = useState(false);

  useEffect(() => {
    return bus.on(EVENTS.CHALLENGE_OPEN, (payload) => {
      setItem((payload as { item: ContentItem }).item);
      setSaisie('');
      setEtat('idle');
      setIndice(false);
    });
  }, []);

  if (!item) return null;

  function valider(reponse: number | string) {
    if (!item) return;
    const bon = estCorrect(item, reponse);
    setEtat(bon ? 'ok' : 'ko');
    if (bon) {
      setTimeout(() => {
        bus.emit(EVENTS.CHALLENGE_RESOLVED, { id: item.id, success: true });
        setItem(null);
      }, 900);
    } else {
      setTimeout(() => setEtat('idle'), 700);
    }
  }

  function abandonner() {
    bus.emit(EVENTS.CHALLENGE_RESOLVED, { id: item!.id, success: false });
    setItem(null);
  }

  return (
    <div className="overlay center">
      <div className={`spell ${etat}`}>
        <div className="kicker">CRISTOMANCIE · {item.competence}</div>
        <p className="enonce">{item.enonce}</p>

        {item.kind === 'qcm' && (
          <div className="choices">
            {item.choix!.map((c, i) => (
              <button key={i} className="choice" onClick={() => valider(i)} disabled={etat === 'ok'}>
                {c}
              </button>
            ))}
          </div>
        )}

        {item.kind === 'saisie' && (
          <form
            className="saisie"
            onSubmit={(e) => {
              e.preventDefault();
              valider(saisie);
            }}
          >
            <input
              autoFocus
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Ta réponse…"
              inputMode="numeric"
            />
            <button className="cta" type="submit" disabled={!saisie.trim() || etat === 'ok'}>
              Lancer ✦
            </button>
          </form>
        )}

        {etat === 'ok' && <div className="verdict ok">Sort réussi ! Le pont se reforme ✦</div>}
        {etat === 'ko' && <div className="verdict ko">La lumière vacille… réessaie.</div>}

        <div className="spell-foot">
          {item.indice && !indice && (
            <button className="ghost" onClick={() => setIndice(true)}>
              Demander un indice au Sage
            </button>
          )}
          {indice && <span className="indice">💡 {item.indice}</span>}
          <button className="ghost faded" onClick={abandonner}>
            Reculer
          </button>
        </div>
      </div>
    </div>
  );
}
