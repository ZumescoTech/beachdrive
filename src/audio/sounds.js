// Procedural sound synthesizer — no audio files required.
// All sounds are generated via the Web Audio API.
// Falls back silently if audio is unavailable.

let ctx = null;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  }
  return ctx;
}

function resume(ac) {
  if (ac.state === 'suspended') ac.resume();
}

// ---- Synth helpers ----

function osc(ac, type, freq, start, duration, gainStart, gainEnd, dest) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(gainStart, start);
  g.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.001), start + duration);
  o.connect(g);
  g.connect(dest);
  o.start(start);
  o.stop(start + duration);
}

function noise(ac, start, duration, gainStart, gainEnd, dest) {
  const bufSize = ac.sampleRate * duration;
  const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const g = ac.createGain();
  g.gain.setValueAtTime(gainStart, start);
  g.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.001), start + duration);
  src.connect(g);
  g.connect(dest);
  src.start(start);
  src.stop(start + duration);
}

// ---- Sound definitions ----

function playCoin() {
  const ac = getCtx();
  if (!ac) return;
  resume(ac);
  const t = ac.currentTime;
  const dest = ac.destination;
  // Rising ping: two sine tones
  osc(ac, 'sine', 880,  t,       0.08, 0.3, 0.001, dest);
  osc(ac, 'sine', 1320, t + 0.05, 0.12, 0.3, 0.001, dest);
}

function playHit() {
  const ac = getCtx();
  if (!ac) return;
  resume(ac);
  const t = ac.currentTime;
  const dest = ac.destination;
  // Low thud + noise burst
  osc(ac, 'sawtooth', 120, t, 0.15, 0.5, 0.001, dest);
  noise(ac, t, 0.12, 0.4, 0.001, dest);
  // Pitch drop
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(200, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.2);
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g); g.connect(dest);
  o.start(t); o.stop(t + 0.2);
}

function playGameOver() {
  const ac = getCtx();
  if (!ac) return;
  resume(ac);
  const t = ac.currentTime;
  const dest = ac.destination;
  // Descending tones
  const notes = [440, 349, 294, 220];
  notes.forEach((freq, i) => {
    osc(ac, 'sawtooth', freq, t + i * 0.18, 0.22, 0.25, 0.001, dest);
  });
  // Low rumble
  noise(ac, t, 0.9, 0.15, 0.001, dest);
}

function playEngine(volume = 0.04) {
  const ac = getCtx();
  if (!ac) return null;
  resume(ac);

  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.value = 55;
  g.gain.value = volume;
  o.connect(g);
  g.connect(ac.destination);
  o.start();
  return { source: o, gainNode: g };
}

// ---- Public API ----

// preloadSounds is a no-op now — kept for API compatibility with main.js
export function preloadSounds() {
  return Promise.resolve();
}

export function playSound(name, options = {}) {
  switch (name) {
    case 'coin':     return playCoin();
    case 'hit':      return playHit();
    case 'gameover': return playGameOver();
    case 'engine':   return playEngine(options.volume);
    default: return null;
  }
}

export function stopSound(handle) {
  if (!handle) return;
  try { handle.source.stop(); } catch (_) {}
}

// Update engine pitch based on speed (call each frame)
export function updateEngineSound(handle, speed, maxSpeed) {
  if (!handle) return;
  try {
    handle.source.frequency.value = 55 + (speed / maxSpeed) * 80;
  } catch (_) {}
}
