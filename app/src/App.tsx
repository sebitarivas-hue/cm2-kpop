import { useEffect } from 'react';
import { useGame } from './state/store';
import { PhaserGame } from './game/PhaserGame';
import { Onboarding } from './ui/Onboarding';
import { HUD } from './ui/HUD';
import { SpellChallenge } from './ui/SpellChallenge';
import { Narration } from './ui/Narration';
import { Victory } from './ui/Victory';

export default function App() {
  const pretCharge = useGame((s) => s.pretCharge);
  const onboardingFait = useGame((s) => s.onboardingFait);
  const init = useGame((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

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
      <PhaserGame />
      <HUD />
      <Narration />
      <SpellChallenge />
      <Victory />
    </>
  );
}
