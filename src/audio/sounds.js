// Lightweight sound manager using the Web Audio API.
// Falls back silently if audio is unavailable.

let ctx = null;

function getCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  }
  return ctx;
}

// Cache of decoded AudioBuffers keyed by name.
const buffers = {};

const SOUND_FILES = {
  coin:     '/sounds/coin.mp3',
  hit:      '/sounds/hit.mp3',
  gameover: '/sounds/gameover.mp3',
  engine:   '/sounds/engine.mp3',
};

export async function preloadSounds() {
  const ac = getCtx();
  if (!ac) return;

  await Promise.all(
    Object.entries(SOUND_FILES).map(async ([name, path]) => {
      try {
        const res = await fetch(path);
        if (!res.ok) return; // file not yet added — skip silently
        const arrayBuffer = await res.arrayBuffer();
        buffers[name] = await ac.decodeAudioData(arrayBuffer);
      } catch (_) {
        // Missing or unsupported file — skip silently
      }
    })
  );
}

export function playSound(name, { volume = 1, loop = false } = {}) {
  const ac = getCtx();
  if (!ac || !buffers[name]) return null;

  // Resume context if it was suspended (browser autoplay policy)
  if (ac.state === 'suspended') ac.resume();

  const source = ac.createBufferSource();
  source.buffer = buffers[name];
  source.loop = loop;

  const gainNode = ac.createGain();
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(ac.destination);
  source.start(0);

  return { source, gainNode };
}

export function stopSound(handle) {
  if (!handle) return;
  try { handle.source.stop(); } catch (_) {}
}
