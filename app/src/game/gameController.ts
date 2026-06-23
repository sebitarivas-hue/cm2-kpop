import type Phaser from 'phaser';
import { ROYAUMES, type RoyaumeConfig } from './royaumes';
import type { Royaume } from '../content/schema';

/**
 * Contrôleur : seul point qui connaît l'instance Phaser.
 * L'UI React lui demande de démarrer/arrêter un royaume ; elle n'a jamais
 * de référence directe au moteur.
 */
class GameController {
  private game: Phaser.Game | null = null;

  attach(game: Phaser.Game) {
    this.game = game;
  }

  detach() {
    this.game = null;
  }

  demarrerRoyaume(id: Royaume) {
    const config: RoyaumeConfig | undefined = ROYAUMES[id];
    if (!this.game || !config) return;
    const mgr = this.game.scene;
    if (mgr.isActive('royaume') || mgr.isSleeping('royaume') || mgr.isPaused('royaume')) {
      mgr.stop('royaume');
    }
    mgr.start('royaume', { config });
  }

  quitterRoyaume() {
    if (this.game) this.game.scene.stop('royaume');
  }
}

export const gameController = new GameController();
