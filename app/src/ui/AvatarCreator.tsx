import { useState } from 'react';
import { useGame, AVATAR_DEFAUT } from '../state/store';
import { AvatarSVG } from './AvatarSVG';
import { PEAUX, CHEVEUX, MECHES, YEUX, TENUES, COIFFURES, STYLES, ACCESSOIRES } from './avatarArt';

type Onglet = 'visage' | 'cheveux' | 'tenue';

/** Créateur d'avatar — personnalisation idole K-pop avant l'aventure. */
export function AvatarCreator() {
  const avatar = useGame((s) => s.avatar);
  const setAvatar = useGame((s) => s.setAvatar);
  const [onglet, setOnglet] = useState<Onglet>('cheveux');

  const aleatoire = () => {
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    setAvatar({
      peau: pick(PEAUX),
      cheveux: pick(CHEVEUX),
      meches: pick(MECHES),
      yeux: pick(YEUX),
      coiffure: pick(COIFFURES).id,
      tenue: pick(TENUES),
      style: pick(STYLES).id,
      accessoire: pick(ACCESSOIRES).id,
    });
  };

  return (
    <div className="overlay center">
      <div className="panel creator">
        <div className="kicker">CRÉE TON IDOLE ✦</div>

        <div className="creator-stage">
          <AvatarSVG a={avatar} size={172} />
        </div>

        <div className="creator-tabs">
          <button className={onglet === 'visage' ? 'on' : ''} onClick={() => setOnglet('visage')}>
            Visage
          </button>
          <button className={onglet === 'cheveux' ? 'on' : ''} onClick={() => setOnglet('cheveux')}>
            Cheveux
          </button>
          <button className={onglet === 'tenue' ? 'on' : ''} onClick={() => setOnglet('tenue')}>
            Tenue
          </button>
        </div>

        <div className="creator-body">
          {onglet === 'visage' && (
            <>
              <Swatches label="Peau" values={PEAUX} current={avatar.peau} onPick={(peau) => setAvatar({ peau })} />
              <Swatches label="Yeux" values={YEUX} current={avatar.yeux} onPick={(yeux) => setAvatar({ yeux })} />
            </>
          )}

          {onglet === 'cheveux' && (
            <>
              <Pills
                label="Coiffure"
                options={COIFFURES}
                current={avatar.coiffure}
                onPick={(coiffure) => setAvatar({ coiffure })}
              />
              <Swatches label="Couleur" values={CHEVEUX} current={avatar.cheveux} onPick={(cheveux) => setAvatar({ cheveux })} />
              <Swatches label="Mèches" values={MECHES} current={avatar.meches} onPick={(meches) => setAvatar({ meches })} />
            </>
          )}

          {onglet === 'tenue' && (
            <>
              <Pills label="Style" options={STYLES} current={avatar.style} onPick={(style) => setAvatar({ style })} />
              <Swatches label="Couleur" values={TENUES} current={avatar.tenue} onPick={(tenue) => setAvatar({ tenue })} />
              <Pills
                label="Accessoire"
                options={ACCESSOIRES}
                current={avatar.accessoire}
                onPick={(accessoire) => setAvatar({ accessoire })}
              />
            </>
          )}
        </div>

        <div className="creator-actions">
          <button className="ghost" onClick={aleatoire}>
            🎲 Surprise
          </button>
          <button className="ghost" onClick={() => setAvatar({ ...AVATAR_DEFAUT, personnalise: false })}>
            ↺ Reset
          </button>
        </div>

        <button className="cta full" onClick={() => setAvatar({ personnalise: true })}>
          Entrer dans Luméria ✦
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

function Pills<T extends string>({
  label,
  options,
  current,
  onPick,
}: {
  label: string;
  options: { id: T; label: string }[];
  current: T;
  onPick: (v: T) => void;
}) {
  return (
    <div className="creator-field">
      <span>{label}</span>
      <div className="pills">
        {options.map((o) => (
          <button key={o.id} className={`pill ${current === o.id ? 'on' : ''}`} onClick={() => onPick(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
