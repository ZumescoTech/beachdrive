import { state } from '../state.js';
import { BASE_SPEED, MAX_SPEED } from '../constants.js';
import { updateBackground, drawBackground } from './background.js';
import { updatePlayer, drawPlayer } from './player.js';
import { updateObstacles, spawnObstacle, drawObstacles } from './obstacles.js';
import { updateCoins, spawnCoin, drawCoins } from './coins.js';
import { updateParticles, drawParticles } from './particles.js';
import { drawCanvasHUD } from './hud.js';
import { updateHUD } from '../ui/hud.js';
import { showGameOver } from '../ui/overlay.js';
import { saveScore } from '../ui/leaderboard.js';
import { playSound } from '../audio/sounds.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function update() {
  state.frame++;

  // Speed ramp
  state.speed = Math.min(BASE_SPEED + Math.floor(state.score / 200) * 0.5, MAX_SPEED);

  // Score per frame
  state.score++;
  if (state.frame % 10 === 0) updateHUD(state.score, state.lives);

  // Invincibility countdown
  if (state.invincible > 0) state.invincible--;

  updateBackground();
  updatePlayer();

  // Spawn obstacles
  const obsInterval = Math.max(40, 90 - Math.floor(state.score / 300) * 5);
  if (state.frame % obsInterval === 0) spawnObstacle();

  // Spawn coins
  if (state.frame % 120 === 60) spawnCoin();

  const isDead = updateObstacles();
  if (isDead) {
    endGame();
    return;
  }

  updateCoins();
  updateParticles();
}

function draw() {
  drawBackground(ctx);
  drawObstacles(ctx);
  drawCoins(ctx);
  drawPlayer(ctx);
  drawParticles(ctx);
  drawCanvasHUD(ctx);
}

function tick() {
  if (state.phase !== 'playing') return;
  update();
  draw();
  requestAnimationFrame(tick);
}

function endGame() {
  state.phase = 'dead';
  if (state.score > state.hiScore) state.hiScore = state.score;
  saveScore(state.score);
  playSound('gameover');
  showGameOver(state.score, state.hiScore);
}

export function startLoop() {
  requestAnimationFrame(tick);
}
