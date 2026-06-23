import { useGame, type AvatarConfig } from '../state/store';
import { AvatarSVG } from './AvatarSVG';

const PEAUX = ['#f7d9bf', '#f1c9a5', '#e0ac7e', '#c68642', '#8d5524', '#5c3a21'];
const CHEVEUX = ['#1a1a1a', '#3a2a1a', '#7a4a1a', '#b8860b', '#d9d9d9', '#7c5cff', '#ff6b9d'];
const TENUES = ['#18d3ff', '#7c5cff', '#ff6b9d', '#36c47e', '#ffd36b', '#ff7a45'];
const COIFFURES: AvatarConfig['coiffure'][] = ['court', 'long', 'couettes', 'chignon', 'boucle'];
const ACCESSOIRES: { id: AvatarConfig['accessoire']; label: string }[] = [
  { id: 'aucun', label: '—' },
  { id: 'lunettes', label: '👓' },
  { id: 'couronne', label: '👑' },
  { id: 'fleur', label: '🌸' },
  { id: 'casque', label: '🪖' },
];
const COIFFURE_LABEL: Record<AvatarConfig['coiffure'], string> = {
  court: 'Court',
  long: 'Long',
  couettes: 'Couettes',
  chignon: 'Chignon',
  boucle: 'Bouclé',
};

/** Créateur d'avatar — personnalisation de l'Éveilleur avant l'aventure. */
export function AvatarCreator() {
  const avatar = useGame((s) => s.avatar);
  const setAvatar = useGame((s) => s.setAvatar);

  return (
    <div className="overlay center">
      <div className="panel creator">
        <div className="kicker">CRÉE TON ÉVEILLEUR</div>
        <div className="creator-preview">
          <AvatarSVG a={avatar} size={150} />
        </div>

        <Swatches label="Peau" values={PEAUX} current={avatar.peau} onPick={(peau) => setAvatar({ peau })} />
        <Swatches label="Cheveux" values={CHEVEUX} current={avatar.cheveux} onPick={(cheveux) => setAvatar({ cheveux })} />

        <div className="creator-field">
          <span>Coiffure</span>
          <div className="pills">
            {COIFFURES.map((c) => (
              <button key={c} className={`pill ${avatar.coiffure === c ? 'on' : ''}`} onClick={() => setAvatar({ coiffure: c })}>
                {COIFFURE_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <Swatches label="Tenue" values={TENUES} current={avatar.tenue} onPick={(tenue) => setAvatar({ tenue })} />

        <div className="creator-field">
          <span>Accessoire</span>
          <div className="pills">
            {ACCESSOIRES.map((ac) => (
              <button
                key={ac.id}
                className={`pill ${avatar.accessoire === ac.id ? 'on' : ''}`}
                onClick={() => setAvatar({ accessoire: ac.id })}
              >
                {ac.label}
              </button>
            ))}
          </div>
        </div>

        <button className="cta full" onClick={() => setAvatar({ personnalise: true })}>
          Commencer l’aventure ✦
        </button>
      </div>
    </div>
  );
}

function Swatches({
  label,
  values,
  current,
  onPick,
}: {
  label: string;
  values: string[];
  current: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="creator-field">
      <span>{label}</span>
      <div className="swatches">
        {values.map((v) => (
          <button
            key={v}
            className={`swatch ${current === v ? 'on' : ''}`}
            style={{ background: v }}
            onClick={() => onPick(v)}
            aria-label={`${label} ${v}`}
          />
        ))}
      </div>
    </div>
  );
}
