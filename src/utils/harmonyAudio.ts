// Romantic Grand Piano synthesizer playing "River Flows in You" (Yiruma, A Major, 4/4 solo piano arrangement)
// Built with Web Audio API multi-harmonic felt piano timbre, velocity-scaled low-pass hammer envelope,
// and stereo concert hall reverb so background music plays reliably with zero external audio/CORS failures.

export interface PianoNoteEvent {
  step: number; // 0..15 within a 4/4 bar (sixteenth-note grid)
  midi: number;
  durationSec: number;
  velocity: number; // 0..1
}

export interface PianoBar {
  notes: PianoNoteEvent[];
}

const STEP_SEC = 0.215; // ~70 BPM tender solo piano ballad tempo
const STEPS_PER_BAR = 16;
const LOOKAHEAD_MS = 50;
const SCHEDULE_AHEAD_SEC = 0.22;

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function halfBarSplitArp(
  b1: number,
  f1: number,
  o1: number,
  t1: number,
  b2: number,
  f2: number,
  o2: number,
  t2: number
): PianoNoteEvent[] {
  return [
    { step: 0, midi: b1, durationSec: 2.6, velocity: 0.25 },
    { step: 2, midi: f1, durationSec: 2.1, velocity: 0.18 },
    { step: 4, midi: o1, durationSec: 1.9, velocity: 0.20 },
    { step: 6, midi: t1, durationSec: 1.5, velocity: 0.16 },
    { step: 8, midi: b2, durationSec: 2.6, velocity: 0.25 },
    { step: 10, midi: f2, durationSec: 2.1, velocity: 0.18 },
    { step: 12, midi: o2, durationSec: 1.9, velocity: 0.20 },
    { step: 14, midi: t2, durationSec: 1.5, velocity: 0.16 },
  ];
}

// Open-5th + octave accompaniment (Intro & Verse)
const LH_FSHARPM_D_SOFT = () => halfBarSplitArp(54, 61, 66, 61, 50, 57, 62, 57);
const LH_A_E_SOFT = () => halfBarSplitArp(57, 64, 69, 64, 52, 59, 64, 59);

// Sweeping chorus accompaniment (adds upper 3rd color on beats 2& and 4&)
const LH_FSHARPM_D_FLOW = () => halfBarSplitArp(54, 61, 66, 69, 50, 57, 62, 66);
const LH_A_E_FLOW = () => halfBarSplitArp(57, 64, 69, 73, 52, 59, 64, 68);

// 16-bar solo piano arrangement of "River Flows in You" in A Major (4/4):
// Bars 0-3: Signature Motif Intro | Bars 4-7: Lyrical Verse | Bars 8-15: Flowing 16th-Note Chorus & Coda
export const RIVER_FLOWS_PIANO_BARS: PianoBar[] = [
  // --- Intro (Bars 0-3) ---
  {
    notes: [
      ...LH_FSHARPM_D_SOFT(),
      { step: 0, midi: 81, durationSec: 0.75, velocity: 0.42 }, // A5
      { step: 2, midi: 80, durationSec: 0.65, velocity: 0.39 }, // G#5
      { step: 4, midi: 81, durationSec: 0.75, velocity: 0.43 }, // A5
      { step: 6, midi: 80, durationSec: 0.65, velocity: 0.39 }, // G#5
      { step: 8, midi: 81, durationSec: 0.75, velocity: 0.44 }, // A5
      { step: 10, midi: 76, durationSec: 0.65, velocity: 0.40 }, // E5
      { step: 12, midi: 81, durationSec: 0.75, velocity: 0.43 }, // A5
      { step: 14, midi: 74, durationSec: 0.65, velocity: 0.40 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_SOFT(),
      { step: 0, midi: 73, durationSec: 2.3, velocity: 0.44 }, // C#5
    ],
  },
  {
    notes: [
      ...LH_FSHARPM_D_SOFT(),
      { step: 0, midi: 81, durationSec: 0.75, velocity: 0.43 }, // A5
      { step: 2, midi: 80, durationSec: 0.65, velocity: 0.40 }, // G#5
      { step: 4, midi: 81, durationSec: 0.75, velocity: 0.44 }, // A5
      { step: 6, midi: 80, durationSec: 0.65, velocity: 0.40 }, // G#5
      { step: 8, midi: 81, durationSec: 0.75, velocity: 0.45 }, // A5
      { step: 10, midi: 76, durationSec: 0.65, velocity: 0.41 }, // E5
      { step: 12, midi: 81, durationSec: 0.75, velocity: 0.44 }, // A5
      { step: 14, midi: 74, durationSec: 0.65, velocity: 0.41 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_SOFT(),
      { step: 0, midi: 73, durationSec: 2.0, velocity: 0.44 }, // C#5
      { step: 12, midi: 69, durationSec: 0.55, velocity: 0.37 }, // A4 pickup
      { step: 14, midi: 71, durationSec: 0.55, velocity: 0.40 }, // B4 pickup
    ],
  },

  // --- Lyrical Verse / Theme A (Bars 4-7) ---
  {
    notes: [
      ...LH_FSHARPM_D_SOFT(),
      { step: 0, midi: 73, durationSec: 1.0, velocity: 0.46 }, // C#5
      { step: 4, midi: 69, durationSec: 0.55, velocity: 0.40 }, // A4
      { step: 6, midi: 71, durationSec: 0.55, velocity: 0.42 }, // B4
      { step: 8, midi: 73, durationSec: 0.65, velocity: 0.45 }, // C#5
      { step: 10, midi: 74, durationSec: 0.65, velocity: 0.47 }, // D5
      { step: 12, midi: 76, durationSec: 0.65, velocity: 0.49 }, // E5
      { step: 14, midi: 74, durationSec: 0.65, velocity: 0.45 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_SOFT(),
      { step: 0, midi: 73, durationSec: 1.0, velocity: 0.46 }, // C#5
      { step: 4, midi: 71, durationSec: 0.55, velocity: 0.42 }, // B4
      { step: 6, midi: 69, durationSec: 0.55, velocity: 0.40 }, // A4
      { step: 8, midi: 68, durationSec: 1.2, velocity: 0.42 }, // G#4
      { step: 12, midi: 69, durationSec: 0.55, velocity: 0.38 }, // A4 pickup
      { step: 14, midi: 71, durationSec: 0.55, velocity: 0.41 }, // B4 pickup
    ],
  },
  {
    notes: [
      ...LH_FSHARPM_D_SOFT(),
      { step: 0, midi: 73, durationSec: 1.0, velocity: 0.47 }, // C#5
      { step: 4, midi: 69, durationSec: 0.55, velocity: 0.41 }, // A4
      { step: 6, midi: 71, durationSec: 0.55, velocity: 0.43 }, // B4
      { step: 8, midi: 73, durationSec: 0.65, velocity: 0.46 }, // C#5
      { step: 10, midi: 74, durationSec: 0.65, velocity: 0.48 }, // D5
      { step: 12, midi: 76, durationSec: 0.65, velocity: 0.50 }, // E5
      { step: 14, midi: 78, durationSec: 0.70, velocity: 0.52 }, // F#5
    ],
  },
  {
    notes: [
      ...LH_A_E_FLOW(),
      { step: 0, midi: 76, durationSec: 1.05, velocity: 0.50 }, // E5
      { step: 4, midi: 74, durationSec: 0.55, velocity: 0.45 }, // D5
      { step: 6, midi: 73, durationSec: 0.55, velocity: 0.44 }, // C#5
      { step: 8, midi: 71, durationSec: 1.1, velocity: 0.45 }, // B4
      { step: 13, midi: 76, durationSec: 0.40, velocity: 0.44 }, // E5 rising pickup
      { step: 14, midi: 78, durationSec: 0.40, velocity: 0.47 }, // F#5
      { step: 15, midi: 80, durationSec: 0.40, velocity: 0.50 }, // G#5
    ],
  },

  // --- Iconic Flowing Chorus / Theme B (Bars 8-11) ---
  {
    notes: [
      ...LH_FSHARPM_D_FLOW(),
      { step: 0, midi: 81, durationSec: 0.80, velocity: 0.56 }, // A5
      { step: 2, midi: 69, durationSec: 0.38, velocity: 0.35 }, // A4 echo
      { step: 3, midi: 80, durationSec: 0.42, velocity: 0.50 }, // G#5
      { step: 4, midi: 81, durationSec: 0.80, velocity: 0.55 }, // A5
      { step: 6, midi: 69, durationSec: 0.38, velocity: 0.35 }, // A4 echo
      { step: 7, midi: 80, durationSec: 0.42, velocity: 0.50 }, // G#5
      { step: 8, midi: 81, durationSec: 0.75, velocity: 0.55 }, // A5
      { step: 10, midi: 76, durationSec: 0.65, velocity: 0.48 }, // E5
      { step: 12, midi: 81, durationSec: 0.75, velocity: 0.54 }, // A5
      { step: 14, midi: 74, durationSec: 0.65, velocity: 0.48 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_FLOW(),
      { step: 0, midi: 73, durationSec: 0.80, velocity: 0.53 }, // C#5
      { step: 2, midi: 74, durationSec: 0.45, velocity: 0.49 }, // D5
      { step: 3, midi: 76, durationSec: 0.45, velocity: 0.51 }, // E5
      { step: 4, midi: 73, durationSec: 0.70, velocity: 0.48 }, // C#5
      { step: 6, midi: 71, durationSec: 0.65, velocity: 0.45 }, // B4
      { step: 8, midi: 68, durationSec: 1.05, velocity: 0.43 }, // G#4
      { step: 12, midi: 76, durationSec: 0.38, velocity: 0.47 }, // E5 cascading 16ths
      { step: 13, midi: 74, durationSec: 0.38, velocity: 0.45 }, // D5
      { step: 14, midi: 73, durationSec: 0.38, velocity: 0.43 }, // C#5
      { step: 15, midi: 71, durationSec: 0.38, velocity: 0.41 }, // B4
    ],
  },
  {
    notes: [
      ...LH_FSHARPM_D_FLOW(),
      { step: 0, midi: 81, durationSec: 0.80, velocity: 0.57 }, // A5
      { step: 2, midi: 69, durationSec: 0.38, velocity: 0.36 }, // A4 echo
      { step: 3, midi: 80, durationSec: 0.42, velocity: 0.51 }, // G#5
      { step: 4, midi: 81, durationSec: 0.80, velocity: 0.56 }, // A5
      { step: 6, midi: 69, durationSec: 0.38, velocity: 0.36 }, // A4 echo
      { step: 7, midi: 80, durationSec: 0.42, velocity: 0.51 }, // G#5
      { step: 8, midi: 81, durationSec: 0.75, velocity: 0.55 }, // A5
      { step: 10, midi: 76, durationSec: 0.65, velocity: 0.49 }, // E5
      { step: 12, midi: 81, durationSec: 0.75, velocity: 0.54 }, // A5
      { step: 14, midi: 74, durationSec: 0.65, velocity: 0.49 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_FLOW(),
      { step: 0, midi: 73, durationSec: 0.80, velocity: 0.53 }, // C#5
      { step: 2, midi: 74, durationSec: 0.45, velocity: 0.49 }, // D5
      { step: 3, midi: 76, durationSec: 0.45, velocity: 0.51 }, // E5
      { step: 4, midi: 73, durationSec: 0.70, velocity: 0.48 }, // C#5
      { step: 6, midi: 71, durationSec: 0.65, velocity: 0.45 }, // B4
      { step: 8, midi: 68, durationSec: 1.05, velocity: 0.44 }, // G#4
      { step: 12, midi: 73, durationSec: 0.42, velocity: 0.43 }, // C#5 pickup
      { step: 14, midi: 76, durationSec: 0.42, velocity: 0.47 }, // E5 pickup
    ],
  },

  // --- Expressive High Climax & Tender Coda (Bars 12-15) ---
  {
    notes: [
      ...LH_FSHARPM_D_FLOW(),
      { step: 0, midi: 81, durationSec: 0.80, velocity: 0.56 }, // A5
      { step: 2, midi: 83, durationSec: 0.42, velocity: 0.53 }, // B5 sparkle
      { step: 3, midi: 81, durationSec: 0.42, velocity: 0.51 }, // A5
      { step: 4, midi: 80, durationSec: 0.70, velocity: 0.49 }, // G#5
      { step: 6, midi: 81, durationSec: 0.65, velocity: 0.52 }, // A5
      { step: 8, midi: 76, durationSec: 0.70, velocity: 0.48 }, // E5
      { step: 10, midi: 78, durationSec: 0.65, velocity: 0.50 }, // F#5
      { step: 12, midi: 74, durationSec: 1.00, velocity: 0.47 }, // D5
    ],
  },
  {
    notes: [
      ...LH_A_E_FLOW(),
      { step: 0, midi: 73, durationSec: 0.85, velocity: 0.52 }, // C#5
      { step: 2, midi: 74, durationSec: 0.45, velocity: 0.48 }, // D5
      { step: 3, midi: 76, durationSec: 0.45, velocity: 0.50 }, // E5
      { step: 4, midi: 73, durationSec: 0.70, velocity: 0.47 }, // C#5
      { step: 6, midi: 71, durationSec: 0.65, velocity: 0.44 }, // B4
      { step: 8, midi: 68, durationSec: 1.0, velocity: 0.42 }, // G#4
      { step: 12, midi: 71, durationSec: 0.55, velocity: 0.42 }, // B4
      { step: 14, midi: 76, durationSec: 0.55, velocity: 0.45 }, // E5
    ],
  },
  {
    notes: [
      ...LH_FSHARPM_D_SOFT(),
      { step: 0, midi: 81, durationSec: 0.75, velocity: 0.46 }, // A5
      { step: 2, midi: 80, durationSec: 0.65, velocity: 0.42 }, // G#5
      { step: 4, midi: 81, durationSec: 0.75, velocity: 0.45 }, // A5
      { step: 6, midi: 80, durationSec: 0.65, velocity: 0.41 }, // G#5
      { step: 8, midi: 81, durationSec: 0.75, velocity: 0.44 }, // A5
      { step: 10, midi: 76, durationSec: 0.65, velocity: 0.40 }, // E5
      { step: 12, midi: 74, durationSec: 0.90, velocity: 0.39 }, // D5
    ],
  },
  {
    notes: [
      { step: 0, midi: 57, durationSec: 3.1, velocity: 0.25 }, // A3
      { step: 2, midi: 64, durationSec: 2.6, velocity: 0.19 }, // E4
      { step: 4, midi: 69, durationSec: 2.3, velocity: 0.21 }, // A4
      { step: 6, midi: 73, durationSec: 2.2, velocity: 0.41 }, // C#5 tender resolve
      { step: 10, midi: 76, durationSec: 1.8, velocity: 0.28 }, // E5 soft overtone
      { step: 12, midi: 69, durationSec: 1.6, velocity: 0.22 }, // A4
    ],
  },
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;
let schedulerId: number | null = null;
let nextStepTime = 0;
let currentBarIdx = 0;
let currentStepInBar = 0;

function createReverbImpulseResponse(
  ctx: AudioContext,
  durationSec = 2.4,
  decay = 2.6
): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * durationSec);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i += 1) {
      const env = Math.pow(1 - i / length, decay);
      data[i] = (Math.random() * 2 - 1) * env;
    }
  }
  return impulse;
}

function ensureAudioGraph(ctx: AudioContext): GainNode {
  if (!masterGain || masterGain.context !== ctx) {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.32, ctx.currentTime);

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.68, ctx.currentTime);

    const wetGain = ctx.createGain();
    wetGain.gain.setValueAtTime(0.36, ctx.currentTime);

    reverbNode = ctx.createConvolver();
    reverbNode.buffer = createReverbImpulseResponse(ctx);

    masterGain.connect(dryGain);
    dryGain.connect(ctx.destination);

    masterGain.connect(reverbNode);
    reverbNode.connect(wetGain);
    wetGain.connect(ctx.destination);
  }
  return masterGain;
}

function playPianoNote(
  ctx: AudioContext,
  dest: AudioNode,
  midi: number,
  when: number,
  durationSec: number,
  velocity: number
) {
  const freq = midiToFreq(midi);

  // Felt grand-piano brightness envelope filter
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  const brightStart = Math.min(3400, 950 + velocity * 2600 + (midi - 48) * 30);
  filter.frequency.setValueAtTime(brightStart, when);
  filter.frequency.exponentialRampToValueAtTime(Math.max(420, brightStart * 0.34), when + durationSec * 0.85);
  filter.Q.setValueAtTime(0.7, when);

  const noteGain = ctx.createGain();
  const peak = Math.max(0.02, velocity * 0.28);
  noteGain.gain.setValueAtTime(0.0001, when);
  noteGain.gain.linearRampToValueAtTime(peak, when + 0.012);
  noteGain.gain.exponentialRampToValueAtTime(peak * 0.42, when + 0.28);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, when + durationSec);

  // Fundamental string (warm triangle) + upper octave & 12th piano partials
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, when);

  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, when);
  g2.gain.setValueAtTime(0.34, when);
  g2.gain.exponentialRampToValueAtTime(0.05, when + durationSec * 0.7);

  const osc3 = ctx.createOscillator();
  const g3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(freq * 3, when);
  g3.gain.setValueAtTime(0.13, when);
  g3.gain.exponentialRampToValueAtTime(0.01, when + Math.min(0.65, durationSec * 0.45));

  osc1.connect(filter);
  osc2.connect(g2);
  g2.connect(filter);
  osc3.connect(g3);
  g3.connect(filter);

  filter.connect(noteGain);
  noteGain.connect(dest);

  const stopAt = when + durationSec + 0.05;
  osc1.start(when);
  osc2.start(when);
  osc3.start(when);
  osc1.stop(stopAt);
  osc2.stop(stopAt);
  osc3.stop(stopAt);
}

function scheduleStep(ctx: AudioContext, dest: AudioNode) {
  const bar = RIVER_FLOWS_PIANO_BARS[currentBarIdx % RIVER_FLOWS_PIANO_BARS.length];
  for (const note of bar.notes) {
    if (note.step === currentStepInBar) {
      playPianoNote(ctx, dest, note.midi, nextStepTime, note.durationSec, note.velocity);
    }
  }

  nextStepTime += STEP_SEC;
  currentStepInBar += 1;
  if (currentStepInBar >= STEPS_PER_BAR) {
    currentStepInBar = 0;
    currentBarIdx = (currentBarIdx + 1) % RIVER_FLOWS_PIANO_BARS.length;
  }
}

export function startHarmonyAudio(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    return false;
  }

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }

  const dest = ensureAudioGraph(audioCtx);

  if (schedulerId !== null) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }

  nextStepTime = audioCtx.currentTime + 0.04;

  const tick = () => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    if (nextStepTime < audioCtx.currentTime - 0.1) {
      nextStepTime = audioCtx.currentTime + 0.02;
    }
    while (nextStepTime < audioCtx.currentTime + SCHEDULE_AHEAD_SEC) {
      scheduleStep(audioCtx, dest);
    }
  };

  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().then(() => {
      if (!audioCtx || schedulerId === null) return;
      nextStepTime = audioCtx.currentTime + 0.02;
      tick();
    });
  }

  tick();
  schedulerId = window.setInterval(tick, LOOKAHEAD_MS);

  return true;
}

export function stopHarmonyAudio(): void {
  if (schedulerId !== null) {
    window.clearInterval(schedulerId);
    schedulerId = null;
  }
  if (audioCtx && audioCtx.state === 'running') {
    void audioCtx.suspend();
  }
}
