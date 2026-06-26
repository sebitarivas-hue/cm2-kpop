import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/store';
import { audio } from '../services/audio';

/**
 * Transition « passage entre dimensions » : un vortex cosmique recouvre
 * brièvement l'écran à chaque entrée/sortie de royaume, puis se dissipe
 * pour révéler la nouvelle scène.
 */
export function Transition() {
  const royaumeActif = useGame((s) => s.royaumeActif);
  const [actif, setActif] = useState(false);
  const [cle, setCle] = useState(0);
  const prev = useRef<typeof royaumeActif>(royaumeActif);
  const premier = useRef(true);

  useEffect(() => {
    if (prev.current === royaumeActif) return;
    prev.current = royaumeActif;
    if (premier.current) {
      premier.current = false;
      return; // pas d'effet au tout premier rendu
    }
    setCle((k) => k + 1);
    setActif(true);
    audio.sfx('warp');
    const t = setTimeout(() => setActif(false), 1100);
    return () => clearTimeout(t);
  }, [royaumeActif]);

  if (!actif) return null;

  return (
    <div className="warp" key={cle} aria-hidden>
      <div className="warp-rings" />
      <div className="warp-core" />
      <div className="warp-flash" />
    </div>
  );
}
