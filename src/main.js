import './style.css';
import { resetState } from './state.js';
import { startLoop } from './game/loop.js';
import { initKeyboard, initTouch } from './input/index.js';
import { showStart, hideOverlay } from './ui/overlay.js';
import { updateHUD } from './ui/hud.js';
import { preloadSounds } from './audio/sounds.js';

const canvas = document.getElementById('gameCanvas');

// Wire up inputs
initKeyboard();
initTouch(canvas);

// Wire up buttons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);

async function startGame() {
  await preloadSounds(); // no-op after first call
  resetState();
  hideOverlay();
  updateHUD(0, 3);
  startLoop();
}

// Show start screen on load
showStart();
