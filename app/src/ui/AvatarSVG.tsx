import type { AvatarConfig } from '../state/store';

/** Rendu SVG stylisé de l'Éveilleur — réutilisé dans le créateur et le HUD. */
export function AvatarSVG({ a, size = 160 }: { a: AvatarConfig; size?: number }) {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden>
      {/* aura */}
      <circle cx="50" cy="62" r="46" fill={a.tenue} opacity="0.12" />

      {/* corps / tunique */}
      <path d="M28 118 Q26 80 38 70 L62 70 Q74 80 72 118 Z" fill={a.tenue} />
      <path d="M38 70 L62 70 L58 84 L42 84 Z" fill="#ffffff" opacity="0.15" />

      {/* cou + tête */}
      <rect x="45" y="54" width="10" height="12" fill={a.peau} />
      <circle cx="50" cy="42" r="20" fill={a.peau} />

      {/* yeux + sourire */}
      <circle cx="43" cy="42" r="2.4" fill="#241a1a" />
      <circle cx="57" cy="42" r="2.4" fill="#241a1a" />
      <path d="M44 50 Q50 55 56 50" stroke="#241a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* cheveux selon coiffure */}
      <Hair a={a} />

      {/* accessoire */}
      <Accessoire a={a} />
    </svg>
  );
}

function Hair({ a }: { a: AvatarConfig }) {
  const c = a.cheveux;
  switch (a.coiffure) {
    case 'long':
      return (
        <>
          <path d="M28 44 Q26 70 32 78 L36 78 Q30 56 34 40 Z" fill={c} />
          <path d="M72 44 Q74 70 68 78 L64 78 Q70 56 66 40 Z" fill={c} />
          <path d="M30 40 Q50 18 70 40 Q70 30 50 24 Q30 30 30 40 Z" fill={c} />
        </>
      );
    case 'couettes':
      return (
        <>
          <circle cx="28" cy="40" r="9" fill={c} />
          <circle cx="72" cy="40" r="9" fill={c} />
          <path d="M31 38 Q50 16 69 38 Q69 28 50 23 Q31 28 31 38 Z" fill={c} />
        </>
      );
    case 'chignon':
      return (
        <>
          <circle cx="50" cy="20" r="8" fill={c} />
          <path d="M31 40 Q50 18 69 40 Q69 28 50 23 Q31 28 31 40 Z" fill={c} />
        </>
      );
    case 'boucle':
      return (
        <>
          <circle cx="34" cy="30" r="8" fill={c} />
          <circle cx="50" cy="24" r="9" fill={c} />
          <circle cx="66" cy="30" r="8" fill={c} />
          <circle cx="30" cy="40" r="7" fill={c} />
          <circle cx="70" cy="40" r="7" fill={c} />
        </>
      );
    default: // court
      return <path d="M30 42 Q50 16 70 42 Q70 28 50 22 Q30 28 30 42 Z" fill={c} />;
  }
}

function Accessoire({ a }: { a: AvatarConfig }) {
  switch (a.accessoire) {
    case 'lunettes':
      return (
        <g stroke="#241a1a" strokeWidth="1.6" fill="none">
          <circle cx="43" cy="42" r="5" />
          <circle cx="57" cy="42" r="5" />
          <line x1="48" y1="42" x2="52" y2="42" />
        </g>
      );
    case 'couronne':
      return <path d="M36 24 L40 16 L46 22 L50 13 L54 22 L60 16 L64 24 Z" fill="#ffd36b" stroke="#b8860b" strokeWidth="0.8" />;
    case 'fleur':
      return (
        <g>
          <circle cx="30" cy="30" r="3.4" fill="#ff6b9d" />
          <circle cx="26" cy="30" r="3.4" fill="#ff6b9d" />
          <circle cx="28" cy="27" r="3.4" fill="#ff6b9d" />
          <circle cx="28" cy="30" r="2" fill="#ffd36b" />
        </g>
      );
    case 'casque':
      return <path d="M28 40 Q50 14 72 40 L72 46 Q50 26 28 46 Z" fill="#9d7bff" opacity="0.9" />;
    default:
      return null;
  }
}
