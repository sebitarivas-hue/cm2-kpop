/**
 * Bus d'événements Phaser <-> React.
 * Le moteur de jeu (Phaser) et l'UI (React) ne se connaissent pas :
 * ils communiquent uniquement par événements. Découplage = testabilité + remplaçabilité.
 */
type Handler = (payload?: unknown) => void;

class EventBus {
  private handlers = new Map<string, Set<Handler>>();

  on(event: string, fn: Handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn);
    return () => this.off(event, fn);
  }

  off(event: string, fn: Handler) {
    this.handlers.get(event)?.delete(fn);
  }

  emit(event: string, payload?: unknown) {
    this.handlers.get(event)?.forEach((fn) => fn(payload));
  }
}

export const bus = new EventBus();

/** Événements du jeu (contrat partagé). */
export const EVENTS = {
  CHALLENGE_OPEN: 'challenge:open', // Phaser -> React : ouvrir une épreuve (lancer un sort)
  CHALLENGE_RESOLVED: 'challenge:resolved', // React -> Phaser : épreuve réussie/échouée
  PHARE_LIT: 'phare:lit', // Phaser -> React : le Phare du royaume est rallumé
  NARRATE: 'narrate', // Phaser -> React : afficher une réplique narrative
} as const;
