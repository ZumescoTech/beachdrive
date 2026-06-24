import { state } from '../state.js';
import { LANE_CENTERS } from '../constants.js';

export function initKeyboard() {
  const held = {};

  document.addEventListener('keydown', e => {
    if (held[e.key]) return;
    held[e.key] = true;
    if (state.phase === 'playing') handleMove(e.key);
  });

  document.addEventListener('keyup', e => {
    held[e.key] = false;
  });
}

export function handleMove(key) {
  const p = state.player;
  if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
    if (p.lane > 0) { p.lane--; p.targetX = LANE_CENTERS[p.lane]; }
  } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
    if (p.lane < 2) { p.lane++; p.targetX = LANE_CENTERS[p.lane]; }
  }
}
