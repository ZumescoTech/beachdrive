import { state } from '../state.js';
import { W, H, MAX_SPEED } from '../constants.js';
import { getMultiplier } from './obstacles.js';

export function drawCanvasHUD(ctx) {
  const { speed, combo, comboFlash } = state;

  // Speed indicator badge
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.roundRect(W - 80, H - 44, 72, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`⚡ ${Math.round((speed / MAX_SPEED) * 100)}%`, W - 44, H - 28);
  ctx.restore();

  // Combo badge (only show at combo >= 3, i.e. multiplier >= 2)
  const multiplier = getMultiplier();
  if (combo >= 3) {
    const flash = comboFlash > 0;
    const scale = flash ? 1 + (comboFlash / 40) * 0.3 : 1;
    ctx.save();
    ctx.translate(52, H - 28);
    ctx.scale(scale, scale);
    ctx.fillStyle = flash ? '#ffe566' : 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.roundRect(-38, -16, 76, 32, 8);
    ctx.fill();
    ctx.fillStyle = flash ? '#1a1a1a' : '#ffd700';
    ctx.font = `bold 13px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`x${multiplier} COMBO`, 0, 0);
    ctx.restore();
  }

  // Speed streaks at high speed
  if (speed > 7) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.18, (speed - 7) * 0.04);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    const ROAD_LEFT = 30, ROAD_WIDTH = 360;
    for (let i = 0; i < 8; i++) {
      const lx = ROAD_LEFT + Math.random() * ROAD_WIDTH;
      const ly = H * 0.4 + Math.random() * H * 0.5;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + 20); ctx.stroke();
    }
    ctx.restore();
  }
}
