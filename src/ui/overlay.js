import { renderLeaderboard, loadScores } from './leaderboard.js';

const overlayEl      = document.getElementById('overlay');
const startScreenEl  = document.getElementById('startScreen');
const gameoverEl     = document.getElementById('gameoverScreen');
const finalScoreEl   = document.getElementById('finalScore');
const startHiScoreEl = document.getElementById('startHiScore');

export function showStart() {
  const scores = loadScores();
  if (scores.length > 0) {
    startHiScoreEl.textContent = `Best: ${scores[0].score}`;
    startHiScoreEl.style.display = '';
  } else {
    startHiScoreEl.style.display = 'none';
  }
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
