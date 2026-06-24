import { state } from '../state.js';
import { LANE_CENTERS } from '../constants.js';
import { spawnCoinParticles } from './particles.js';
import { updateHUD } from '../ui/hud.js';
import { playSound } from '../audio/sounds.js';

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return Math.abs(ax - bx) < (aw + bw) / 2 - 6
      && Math.abs(ay - by) < (ah + bh) / 2 - 6;
}

export function spawnCoin() {
  const lane = Math.floor(Math.random() * 3);
  state.coins.push({ lane, x: LANE_CENTERS[lane], y: -30, r: 14 });
}

export function updateCoins() {
  const { speed, player: p } = state;

  state.coins = state.coins.filter(c => {
    c.y += speed;
    if (c.y > 680) return false;

    if (rectsOverlap(p.x, p.y, p.w, p.h, c.x, c.y, c.r * 2, c.r * 2)) {
      state.score += 50;
      spawnCoinParticles(c.x, c.y);
      playSound('coin');
      updateHUD(state.score, state.lives);
      return false;
    }

    return true;
  });
}

export function drawCoins(ctx) {
  state.coins.forEach(c => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    const cg = ctx.createRadialGradient(c.x - 3, c.y - 3, 2, c.x, c.y, c.r);
    cg.addColorStop(0, '#fff8a0');
    cg.addColorStop(0.5, '#ffd700');
    cg.addColorStop(1, '#c8820a');
    ctx.fillStyle = cg;
    ctx.fill();
    ctx.strokeStyle = '#a06800';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#a06800';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', c.x, c.y);
    ctx.restore();
  });
}
