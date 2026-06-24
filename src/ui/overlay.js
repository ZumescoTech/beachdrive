import { renderLeaderboard } from './leaderboard.js';

const overlayEl      = document.getElementById('overlay');
const startScreenEl  = document.getElementById('startScreen');
const gameoverEl     = document.getElementById('gameoverScreen');
const finalScoreEl   = document.getElementById('finalScore');

export function showStart() {
  startScreenEl.classList.remove('hidden');
  gameoverEl.classList.add('hidden');
  overlayEl.classList.remove('hidden');
}

export function showGameOver(score, hiScore) {
  finalScoreEl.textContent = `Score: ${score}  |  Best: ${hiScore}`;
  renderLeaderboard(score);
  startScreenEl.classList.add('hidden');
  gameoverEl.classList.remove('hidden');
  overlayEl.classList.remove('hidden');
}

export function hideOverlay() {
  overlayEl.classList.add('hidden');
  startScreenEl.classList.add('hidden');
  gameoverEl.classList.add('hidden');
}
