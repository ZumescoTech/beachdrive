import './style.css';

// Polyfill CanvasRenderingContext2D.roundRect for Safari < 15.4 and older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(typeof r === 'number' ? r : r?.[0] ?? 0, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y,     x + w, y + h, radius);
    this.arcTo(x + w, y + h, x,     y + h, radius);
    this.arcTo(x,     y + h, x,     y,     radius);
    this.arcTo(x,     y,     x + w, y,     radius);
    this.closePath();
  };
}
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
