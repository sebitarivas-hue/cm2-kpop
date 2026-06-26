import { useState } from 'react';
import { audio } from '../services/audio';

/** Bascule son on/off (persistée). */
export function MuteButton() {
  const [muet, setMuet] = useState(audio.estMuet());
  return (
    <button
      className="mute-btn"
      aria-label={muet ? 'Activer le son' : 'Couper le son'}
      onClick={() => {
        const v = !muet;
        audio.setMuet(v);
        audio.resume();
        if (!v) audio.sfx('click');
        setMuet(v);
      }}
    >
      {muet ? '🔇' : '🔊'}
    </button>
  );
}
