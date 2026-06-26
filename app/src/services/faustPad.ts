import { instantiateFaustModuleFromFile, LibFaust, FaustCompiler, FaustMonoDspGenerator } from '@grame/faustwasm';
import faustJsUrl from '@grame/faustwasm/libfaust-wasm/libfaust-wasm.js?url';
import faustDataUrl from '@grame/faustwasm/libfaust-wasm/libfaust-wasm.data?url';
import faustWasmUrl from '@grame/faustwasm/libfaust-wasm/libfaust-wasm.wasm?url';

/**
 * Nappe d'ambiance écrite en FAUST (DSP fonctionnel), compilée en
 * AudioWorklet dans le navigateur. Plus riche et « vivante » que des
 * oscillateurs bruts : super-saw désaccordé, sous-octave, filtre balayé par
 * LFO, chorus stéréo modulé, trémolo lent et réverbe.
 *
 * Paramètres pilotables depuis JS : freq (note racine), bright, gain.
 */
const DSP = `
import("stdfaust.lib");

freq   = hslider("freq", 110, 40, 440, 0.001) : si.smoo;
bright = hslider("bright", 0.6, 0, 1, 0.01) : si.smoo;
gain   = hslider("gain", 0.32, 0, 1, 0.01) : si.smoo;

// Super-saw : 7 dents de scie légèrement désaccordées + sous-octave.
supersaw = sum(i, 7, os.sawtooth(freq * (1 + 0.0045 * (i - 3)))) / 7;
sub      = os.osc(freq * 0.5) * 0.4;

// LFOs lents : le timbre oscille et « respire ».
lfoA = os.osc(0.07) * 0.5 + 0.5;
lfoB = os.osc(0.13) * 0.5 + 0.5;
cutoff = 200 + (400 + bright * 3200) * lfoA;

filtered = (supersaw + sub) : fi.lowpass(3, cutoff);

// Chorus stéréo : delays fractionnaires modulés.
voiceL = filtered : de.fdelay(4096, 240 + lfoB * 120);
voiceR = filtered : de.fdelay(4096, 320 + (1 - lfoB) * 120);

trem = os.osc(0.05) * 0.1 + 0.9;

dry  = filtered * trem * gain;
wetL = voiceL * trem * gain * 0.6;
wetR = voiceR * trem * gain * 0.6;

process = (dry + wetL), (dry + wetR) : re.stereo_freeverb(0.86, 0.5, 0.6, 1);
`;

export interface FaustPad {
  node: AudioNode;
  setRoot(freq: number): void;
  dispose(): void;
}

// Le générateur (compilation libfaust) est coûteux : on ne compile qu'une fois.
let genPromise: Promise<FaustMonoDspGenerator> | null = null;

async function getGenerator(): Promise<FaustMonoDspGenerator> {
  if (!genPromise) {
    genPromise = (async () => {
      const mod = await instantiateFaustModuleFromFile(faustJsUrl, faustDataUrl, faustWasmUrl);
      const libFaust = new LibFaust(mod);
      const compiler = new FaustCompiler(libFaust);
      const gen = new FaustMonoDspGenerator();
      await gen.compile(compiler, 'lumeria_pad', DSP, '');
      return gen;
    })();
  }
  return genPromise;
}

/** Crée un nœud audio Faust prêt à connecter (ou null si indisponible). */
export async function createFaustPad(ctx: BaseAudioContext): Promise<FaustPad | null> {
  const gen = await getGenerator();
  const node = (await gen.createNode(ctx)) as unknown as
    | (AudioNode & { getParams(): string[]; setParamValue(p: string, v: number): void; destroy?(): void })
    | null;
  if (!node) return null;

  const params = node.getParams();
  const find = (k: string) =>
    params.find((p) => p.toLowerCase().endsWith('/' + k)) ?? params.find((p) => p.toLowerCase().includes(k));
  const pFreq = find('freq');

  return {
    node,
    setRoot: (f: number) => {
      if (pFreq) node.setParamValue(pFreq, f);
    },
    dispose: () => {
      try {
        node.destroy?.();
        node.disconnect();
      } catch {
        /* déjà détaché */
      }
    },
  };
}
