import { state } from '../state.js';
import { LANE_CENTERS, OBS_TYPES, INVINCIBLE_FRAMES } from '../constants.js';
import { spawnCrashParticles } from './particles.js';
import { updateHUD } from '../ui/hud.js';
import { playSound } from '../audio/sounds.js';

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return Math.abs(ax - bx) < (aw + bw) / 2 - 6
      && Math.abs(ay - by) < (ah + bh) / 2 - 6;
}

export function spawnObstacle() {
  const lane = Math.floor(Math.random() * 3);
  const type = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
  state.obstacles.push({ lane, x: LANE_CENTERS[lane], y: -60, ...type });
}

// Returns true if the game should end (lives hit 0).
export function updateObstacles() {
  const { speed, invincible, player: p } = state;

  state.obstacles = state.obstacles.filter(o => {
    o.y += speed;
    if (o.y > 680) return false;

    if (invincible === 0 && rectsOverlap(p.x, p.y, p.w, p.h, o.x, o.y, o.w, o.h)) {
      state.lives--;
      state.invincible = INVINCIBLE_FRAMES;
      spawnCrashParticles(o.x, o.y);
      playSound('hit');
      updateHUD(state.score, state.lives);
      return false;
    }

    return true;
  });

  return state.lives <= 0;
}

export function drawObstacles(ctx) {
  state.obstacles.forEach(o => {
    ctx.font = `${Math.max(o.w, o.h) * 0.75}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(o.label, o.x, o.y);
  });
}
