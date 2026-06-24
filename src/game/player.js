import { state } from '../state.js';

export function updatePlayer() {
  const p = state.player;
  p.x += (p.targetX - p.x) * 0.18;
}

export function drawPlayer(ctx) {
  const { invincible, player: p } = state;
  const { x: px, y: py, w: pw, h: ph } = p;

  ctx.save();

  if (invincible > 0 && Math.floor(invincible / 6) % 2 === 0) {
    ctx.globalAlpha = 0.35;
  }

  // Shadow
  ctx.save();
  ctx.globalAlpha *= 0.25;
  ctx.fillStyle = '#0003';
  ctx.beginPath();
  ctx.ellipse(px + 3, py + ph * 0.5 + 6, pw * 0.45, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 8);
  ctx.fill();

  // Cabin (windshield)
  ctx.fillStyle = '#90caf9';
  ctx.beginPath();
  ctx.roundRect(px - pw * 0.35, py - ph * 0.42, pw * 0.7, ph * 0.35, 5);
  ctx.fill();

  // Wheels
  ctx.fillStyle = '#222';
  [[-1, -0.38], [1, -0.38], [-1, 0.3], [1, 0.3]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.ellipse(px + sx * pw * 0.54, py + sy * ph, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Headlights
  ctx.fillStyle = '#ffe082';
  ctx.beginPath(); ctx.ellipse(px - pw * 0.28, py - ph * 0.48, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(px + pw * 0.28, py - ph * 0.48, 5, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Taillights
  ctx.fillStyle = '#ef5350';
  ctx.beginPath(); ctx.ellipse(px - pw * 0.28, py + ph * 0.48, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(px + pw * 0.28, py + ph * 0.48, 5, 3, 0, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}
