import { useMemo } from 'react';
import { useGame } from '../state/store';
import { ROYAUMES_JOUABLES } from '../game/royaumes';
import type { Royaume } from '../content/schema';

interface Noeud {
  id: Royaume;
  nom: string;
  matiere: string;
  x: number;
  y: number;
  couleur: string;
}

// Constellation : un chemin sinueux qui s'élève (le "voyage").
const NOEUDS: Noeud[] = [
  { id: 'numeria', nom: 'Numéria', matiere: 'Mathématiques', x: 50, y: 122, couleur: '#9d7bff' },
  { id: 'verba', nom: 'Verba', matiere: 'Français', x: 27, y: 102, couleur: '#36c47e' },
  { id: 'vivaria', nom: 'Vivaria', matiere: 'Sciences', x: 62, y: 84, couleur: '#3ad1c4' },
  { id: 'chronos', nom: 'Chronos', matiere: 'Histoire', x: 33, y: 64, couleur: '#ffd36b' },
  { id: 'terra', nom: 'Terra', matiere: 'Géographie', x: 66, y: 46, couleur: '#ff7a45' },
  { id: 'babel', nom: 'Babel', matiere: 'Langues', x: 40, y: 30, couleur: '#ff5fa2' },
  { id: 'chroma', nom: 'Chroma', matiere: 'Arts', x: 56, y: 14, couleur: '#7c5cff' },
];

/** Carte-monde : voyage cosmique entre les royaumes du Savoir. */
export function WorldMap() {
  const { pseudo, pharesAllumes, entrerRoyaume } = useGame();

  const etoiles = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 140,
        r: Math.random() * 0.5 + 0.15,
        d: Math.random() * 3 + 1.5,
        delay: Math.random() * 3,
      })),
    [],
  );

  // Position courante : premier royaume jouable pas encore éclairé.
  const ici = NOEUDS.find((n) => ROYAUMES_JOUABLES.includes(n.id) && !pharesAllumes.includes(n.id));

  const chemin = NOEUDS.map((n, i) => `${i === 0 ? 'M' : 'L'}${n.x},${n.y}`).join(' ');

  return (
    <div className="overlay cosmos">
      <header className="cosmos-head">
        <div className="kicker">CARTE DU VOYAGE</div>
        <h1>{pseudo || 'Éveilleur'}</h1>
        <p className="lead">{pharesAllumes.length}/7 Phares rallumés — suis le fil de lumière.</p>
      </header>

      <svg className="cosmos-svg" viewBox="0 0 100 136" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="neb1" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#7c5cff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neb2" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#3ad1c4" stopOpacity="0.4" />
            <stop offset="1" stopColor="#3ad1c4" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* nébuleuses */}
        <ellipse cx="30" cy="40" rx="40" ry="34" fill="url(#neb1)" />
        <ellipse cx="74" cy="96" rx="34" ry="30" fill="url(#neb2)" />

        {/* étoiles scintillantes */}
        {etoiles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff">
            <animate attributeName="opacity" values="0.15;0.9;0.15" dur={`${s.d}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* fil de lumière reliant les royaumes */}
        <path d={chemin} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="2 2" />
        <path d={chemin} fill="none" stroke="#fff3d6" strokeOpacity="0.5" strokeWidth="0.5" filter="url(#glow)" strokeDasharray="1 3">
          <animate attributeName="stroke-dashoffset" values="0;-8" dur="3s" repeatCount="indefinite" />
        </path>

        {/* royaumes (planètes) */}
        {NOEUDS.map((n) => {
          const allume = pharesAllumes.includes(n.id);
          const jouable = ROYAUMES_JOUABLES.includes(n.id);
          const estIci = ici?.id === n.id;
          return (
            <g
              key={n.id}
              className={`planete ${jouable ? 'jouable' : 'verrou'}`}
              onClick={() => jouable && entrerRoyaume(n.id)}
              transform={`translate(${n.x} ${n.y})`}
            >
              {(allume || estIci) && (
                <circle r="9" fill={n.couleur} opacity={allume ? 0.28 : 0.18}>
                  {estIci && <animate attributeName="r" values="7;11;7" dur="2.2s" repeatCount="indefinite" />}
                  {estIci && <animate attributeName="opacity" values="0.28;0.06;0.28" dur="2.2s" repeatCount="indefinite" />}
                </circle>
              )}
              <circle r="5" fill={n.couleur} opacity={jouable ? 1 : 0.32} filter={jouable ? 'url(#glow)' : undefined} />
              <circle r="5" fill="none" stroke="#ffffff" strokeOpacity={allume ? 0.9 : 0.3} strokeWidth="0.4" />
              {allume && <text y="1.4" textAnchor="middle" fontSize="4.4">✦</text>}
              {!jouable && (
                <text y="1.6" textAnchor="middle" fontSize="4" fill="#ffffff" opacity="0.7">
                  🔒
                </text>
              )}
              <text y="10.5" textAnchor="middle" fontSize="3.4" fill="#ffffff" fontWeight="700">
                {n.nom}
              </text>
              <text y="14.2" textAnchor="middle" fontSize="2.6" fill="#b8b2d8">
                {n.matiere}
              </text>
              {estIci && (
                <text y="-8" textAnchor="middle" fontSize="3" fill="#fff3d6" fontWeight="800">
                  tu es ici
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
