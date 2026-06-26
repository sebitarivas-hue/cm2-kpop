import { bus, EVENTS } from './eventBus';

/**
 * Audio 100 % procédural (Web Audio API) — aucun fichier externe.
 * Ambiances par royaume + effets (réussite, erreur, sort, Phare, warp).
 * Le contexte démarre suspendu et se réveille au premier geste utilisateur
 * (politique d'autoplay des navigateurs).
 */
const MUET_KEY = 'lumeria.muet';

// Fréquence racine (note grave) par royaume — couleur sonore distincte.
const ROOTS: Record<string, number> = {
  numeria: 196.0, // G3
  verba: 220.0, // A3
  vivaria: 174.6, // F3
  chronos: 164.8, // E3
  terra: 146.8, // D3
  babel: 233.1, // A#3
  chroma: 261.6, // C4
};

type ToneOpts = { type?: OscillatorType; vol?: number; glide?: number };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private amb: { stop: () => void } | null = null;
  private faust: { gain: GainNode; dispose: () => void } | null = null;
  private ambToken = 0;
  private muet = typeof localStorage !== 'undefined' && localStorage.getItem(MUET_KEY) === '1';

  private ensure(): AudioContext {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muet ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  resume() {
    const ctx = this.ensure();
    if (ctx.state === 'suspended') ctx.resume();
  }

  estMuet() {
    return this.muet;
  }

  setMuet(v: boolean) {
    this.muet = v;
    try {
      localStorage.setItem(MUET_KEY, v ? '1' : '0');
    } catch {
      /* mode privé */
    }
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(v ? 0 : 0.5, this.ctx.currentTime, 0.05);
  }

  private tone(freq: number, t0: number, dur: number, o: ToneOpts = {}) {
    const ctx = this.ensure();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(o.glide, t0 + dur);
    const vol = o.vol ?? 0.25;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  private noise(t0: number, dur: number, from = 400, to = 3000, vol = 0.2) {
    const ctx = this.ensure();
    const src = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(from, t0);
    bp.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master!);
    src.start(t0);
    src.stop(t0 + dur);
  }

  sfx(name: 'success' | 'error' | 'click' | 'open' | 'warp' | 'victory') {
    if (this.muet) return;
    const ctx = this.ensure();
    const t = ctx.currentTime;
    switch (name) {
      case 'success':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, t + i * 0.08, 0.2, { type: 'triangle', vol: 0.22 }));
        break;
      case 'error':
        this.tone(220, t, 0.2, { type: 'sawtooth', vol: 0.16, glide: 150 });
        this.tone(146, t + 0.05, 0.22, { type: 'sine', vol: 0.14, glide: 110 });
        break;
      case 'click':
        this.tone(880, t, 0.06, { type: 'sine', vol: 0.16 });
        break;
      case 'open':
        this.noise(t, 0.3, 300, 2400, 0.14);
        this.tone(330, t, 0.26, { type: 'sine', vol: 0.12, glide: 520 });
        break;
      case 'warp':
        this.noise(t, 0.7, 200, 3200, 0.2);
        this.tone(660, t, 0.6, { type: 'sine', vol: 0.12, glide: 130 });
        this.tone(110, t, 0.5, { type: 'triangle', vol: 0.1, glide: 70 });
        break;
      case 'victory':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, t + i * 0.12, 0.6, { type: 'triangle', vol: 0.2 }));
        this.tone(261.6, t, 1.5, { type: 'sine', vol: 0.12 });
        break;
    }
  }

  /**
   * Ambiance du royaume : nappe d'oscillateurs immédiate (repli instantané),
   * puis montée vers la nappe FAUST (plus riche) dès qu'elle est compilée.
   */
  ambiance(royaume: string) {
    this.stopAmbiance();
    const ctx = this.ensure();
    const root = ROOTS[royaume] ?? 196;
    const token = ++this.ambToken;
    this.nappeOscillateurs(root); // son immédiat
    this.monterVersFaust(ctx, root, token); // upgrade asynchrone
  }

  private async monterVersFaust(ctx: AudioContext, root: number, token: number) {
    try {
      const { createFaustPad } = await import('./faustPad');
      const pad = await createFaustPad(ctx);
      if (!pad || token !== this.ambToken) {
        pad?.dispose();
        return;
      }
      pad.setRoot(root);
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 3); // swell d'entrée
      pad.node.connect(g);
      g.connect(this.master!);
      this.stopOscPad(); // on relâche le repli, la nappe Faust prend le relais
      this.faust = {
        gain: g,
        dispose: () => {
          try {
            g.disconnect();
            pad.dispose();
          } catch {
            /* déjà détaché */
          }
        },
      };
    } catch {
      /* Faust indisponible : on garde la nappe d'oscillateurs. */
    }
  }

  /** Nappe d'oscillateurs (repli), accordée à la couleur du royaume. */
  private nappeOscillateurs(root: number) {
    const ctx = this.ensure();
    const t = ctx.currentTime;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 3);
    g.connect(this.master!);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    lp.connect(g);

    // LFO lent sur le filtre : la nappe « respire ».
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoG.gain.value = 320;
    lfo.connect(lfoG);
    lfoG.connect(lp.frequency);
    lfo.start();

    const oscs = [root / 2, root, root * 1.5].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      o.connect(lp);
      o.start();
      return o;
    });

    this.amb = {
      stop: () => {
        const tt = ctx.currentTime;
        g.gain.cancelScheduledValues(tt);
        g.gain.setTargetAtTime(0.0001, tt, 0.5);
        oscs.forEach((o) => o.stop(tt + 1.2));
        lfo.stop(tt + 1.2);
      },
    };
  }

  private stopOscPad() {
    if (this.amb) {
      this.amb.stop();
      this.amb = null;
    }
  }

  stopAmbiance() {
    this.ambToken++; // invalide une compilation Faust en cours
    this.stopOscPad();
    if (this.faust && this.ctx) {
      const g = this.faust.gain;
      const tt = this.ctx.currentTime;
      try {
        g.gain.cancelScheduledValues(tt);
        g.gain.setTargetAtTime(0.0001, tt, 0.4);
      } catch {
        /* ignore */
      }
      const f = this.faust;
      setTimeout(() => f.dispose(), 1300);
      this.faust = null;
    }
  }
}

export const audio = new AudioEngine();

/** Branche l'audio sur les gestes utilisateur et les événements de jeu. */
export function brancherAudio() {
  const resume = () => audio.resume();
  window.addEventListener('pointerdown', resume);
  window.addEventListener('keydown', resume);

  bus.on(EVENTS.CHALLENGE_RESOLVED, (p) => audio.sfx((p as { success: boolean }).success ? 'success' : 'error'));
  bus.on(EVENTS.CHALLENGE_OPEN, () => audio.sfx('open'));
  bus.on(EVENTS.PHARE_LIT, () => audio.sfx('victory'));
}
