import { useEffect } from 'react';
import { useGame } from './state/store';
import { PhaserGame } from './game/PhaserGame';
import { gameController } from './game/gameController';
import { Onboarding } from './ui/Onboarding';
import { WorldMap } from './ui/WorldMap';
import { HUD } from './ui/HUD';
import { SpellChallenge } from './ui/SpellChallenge';
import { Narration } from './ui/Narration';
import { Victory } from './ui/Victory';

export default function App() {
  const pretCharge = useGame((s) => s.pretCharge);
  const onboardingFait = useGame((s) => s.onboardingFait);
  const royaumeActif = useGame((s) => s.royaumeActif);
  const retourCarte = useGame((s) => s.retourCarte);
  const init = useGame((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  // Démarre / arrête la scène Phaser selon le royaume choisi sur la carte.
  useEffect(() => {
    if (royaumeActif) gameController.demarrerRoyaume(royaumeActif);
    else gameController.quitterRoyaume();
  }, [royaumeActif]);

  if (!pretCharge) {
    return (
      <div className="overlay center">
        <div className="loader">Luméria s’éveille…</div>
      </div>
    );
  }

  if (!onboardingFait) return <Onboarding />;

  return (
    <>
      {/* Le canvas Phaser est toujours monté ; la scène ne tourne que dans un royaume. */}
      <PhaserGame />

      {royaumeActif ? (
        <>
          <HUD />
          <button className="back-map" onClick={retourCarte}>
            ◂ Carte
          </button>
          <Narration />
          <SpellChallenge />
          <Victory />
        </>
      ) : (
        <WorldMap />
      )}
    </>
  );
}
