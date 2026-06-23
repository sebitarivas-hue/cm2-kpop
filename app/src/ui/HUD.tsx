import { useGame } from '../state/store';
import { AvatarSVG } from './AvatarSVG';

/** Bandeau de progression : niveau, XP, Éclats, streak quotidien. */
export function HUD() {
  const { pseudo, niveau, xp, eclats, streak, avatar } = useGame();
  return (
    <div className="hud">
      <div className="hud-id">
        <div className="hud-avatar">
          <AvatarSVG a={avatar} size={34} />
        </div>
        <div>
          <div className="hud-pseudo">{pseudo || 'Éveilleur'}</div>
          <div className="hud-royaume">Royaume de Numéria</div>
        </div>
      </div>
      <div className="hud-stats">
        <div className="stat">
          <span className="stat-num">Nv {niveau}</span>
          <div className="xpbar">
            <div className="xpfill" style={{ width: `${xp}%` }} />
          </div>
        </div>
        <div className="chip">✦ {eclats}</div>
        <div className="chip flame">🔥 {streak}</div>
      </div>
    </div>
  );
}
