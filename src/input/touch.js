import { state } from '../state.js';
import { handleMove } from './keyboard.js';
import { W } from '../constants.js';

export function initTouch(canvas) {
  // Swipe / tap on canvas
  canvas.addEventListener('touchstart', e => {
    if (state.phase !== 'playing') return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const tx = t.clientX - rect.left;
    handleMove(tx < W / 2 ? 'ArrowLeft' : 'ArrowRight');
  }, { passive: true });

  canvas.addEventListener('click', e => {
    if (state.phase !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    handleMove(e.clientX - rect.left < W / 2 ? 'ArrowLeft' : 'ArrowRight');
  });

  // On-screen buttons (visible on touch devices via CSS)
  const btnLeft  = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');

  if (btnLeft) {
    btnLeft.addEventListener('touchstart',  e => { e.preventDefault(); if (state.phase === 'playing') handleMove('ArrowLeft');  }, { passive: false });
    btnLeft.addEventListener('click',       ()  => { if (state.phase === 'playing') handleMove('ArrowLeft');  });
  }
  if (btnRight) {
    btnRight.addEventListener('touchstart', e => { e.preventDefault(); if (state.phase === 'playing') handleMove('ArrowRight'); }, { passive: false });
    btnRight.addEventListener('click',      ()  => { if (state.phase === 'playing') handleMove('ArrowRight'); });
  }
}
