/**
 * Web Audio API synthesizer for the sacred temple bell / singing bowl.
 * Creates an authentic, resonant, peaceful bell sound without external audio files.
 */

let audioCtx = null;

/**
 * Initializes or resumes the AudioContext safely.
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Plays a sacred temple bell / singing bowl completion sound.
 * Fundamental frequency ~528 Hz with authentic acoustic overtones and gentle decay.
 *
 * @param {boolean} isEnabled - Whether audio is enabled in settings.
 */
export function playMalaCompletionBell(isEnabled = true) {
  if (!isEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playBellSynthesis(ctx)).catch(() => {});
    } else {
      playBellSynthesis(ctx);
    }
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}

/**
 * Synthesizes the Tibetan singing bowl / temple bell harmonics.
 */
function playBellSynthesis(ctx) {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.45, now);

  // Fundamental frequency (528 Hz - sacred healing tone)
  const f0 = 528;

  // Harmonic and inharmonic overtones characteristic of bronze bells/bowls:
  // [Frequency multiplier, relative amplitude, decay duration]
  const harmonics = [
    { ratio: 1.0, gain: 0.55, decay: 3.5 },     // Fundamental
    { ratio: 1.003, gain: 0.45, decay: 3.2 },   // Slight detune for shimmer beat
    { ratio: 2.76, gain: 0.28, decay: 2.5 },    // Second chime mode
    { ratio: 5.40, gain: 0.15, decay: 1.8 },    // High metallic chime
    { ratio: 8.90, gain: 0.08, decay: 1.0 }     // Upper sparkle
  ];

  harmonics.forEach(({ ratio, gain, decay }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0 * ratio, now);

    // Envelope: Instant strike, soft exponential decay
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay + 0.1);
  });

  // Master fade out
  masterGain.gain.setValueAtTime(0.45, now + 2.5);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
}

/**
 * Plays a very subtle wooden bead click for tactile manual counting feedback.
 * Optional and very soft (40ms).
 */
export function playBeadTapSound(isEnabled = true) {
  if (!isEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'suspended') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    // Non-blocking
  }
}
