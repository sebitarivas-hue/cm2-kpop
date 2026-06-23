import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { NumeriaScene } from './scenes/NumeriaScene';

/** Monte l'instance Phaser dans un conteneur React et la détruit au démontage. */
export function PhaserGame() {
  const ref = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!ref.current || gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: ref.current,
      backgroundColor: '#120e2e',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
      },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scene: [NumeriaScene],
    });
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
