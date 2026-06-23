import { useId } from 'react';
import type { AvatarConfig } from '../state/store';
import { avatarInner } from './avatarArt';

/** Rendu de l'avatar idole — source unique partagée avec le HUD et Phaser. */
export function AvatarSVG({ a, size = 160 }: { a: AvatarConfig; size?: number }) {
  const uid = useId();
  return (
    <svg
      viewBox="0 0 200 250"
      width={size}
      height={size * 1.25}
      role="img"
      aria-label="Avatar"
      dangerouslySetInnerHTML={{ __html: avatarInner(a, uid) }}
    />
  );
}
