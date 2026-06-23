import { useEffect, useState } from 'react';
import { bus, EVENTS } from '../services/eventBus';

/** Bulle de dialogue des Sages. */
export function Narration() {
  const [msg, setMsg] = useState<{ qui: string; texte: string } | null>(null);

  useEffect(() => {
    return bus.on(EVENTS.NARRATE, (p) => {
      setMsg(p as { qui: string; texte: string });
      const t = setTimeout(() => setMsg(null), 7000);
      return () => clearTimeout(t);
    });
  }, []);

  if (!msg) return null;
  return (
    <div className="narration" onClick={() => setMsg(null)}>
      <div className="narr-qui">{msg.qui}</div>
      <div className="narr-texte">{msg.texte}</div>
      <div className="narr-hint">toucher pour fermer</div>
    </div>
  );
}
