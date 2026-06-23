import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { RoyaumeScene } from './scenes/RoyaumeScene';
import { gameController } from './gameController';

/**
 * Monte l'instance Phaser. La scène 'royaume' est enregistrée mais NON
 * démarrée automatiquement : c'est la carte-monde (React) qui déclenche
 * le royaume choisi via le gameController.
 */
export function PhaserGame() {
  const ref = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!ref.current || gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: ref.current,
      backgroundColor: '#0c0920',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scene: [], // aucune scène auto-démarrée
    });
    // Enregistre la scène SANS la démarrer (autoStart = false).
    game.scene.add('royaume', RoyaumeScene, false);
    gameRef.current = game;
    gameController.attach(game);

    return () => {
      gameController.detach();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
