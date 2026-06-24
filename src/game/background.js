import { W, H, ROAD_LEFT, ROAD_WIDTH, LANE_W } from '../constants.js';
import { state } from '../state.js';

export function drawBackground(ctx) {
  const { frame, dashOffsets, clouds, birds } = state;

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.38);
  sky.addColorStop(0, '#4ec8f8');
  sky.addColorStop(1, '#aee4fb');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H * 0.38);

  // Ocean strip
  const ocean = ctx.createLinearGradient(0, H * 0.30, 0, H * 0.42);
  ocean.addColorStop(0, '#1a8fd1');
  ocean.addColorStop(1, '#0e6fa3');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, H * 0.30, W, H * 0.12);

  // Ocean shimmer
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(30 + i * 60 + (frame * 0.5) % 60, H * 0.33, 30, 4);
  }
  ctx.restore();

  // Sand
  const sand = ctx.createLinearGradient(0, H * 0.38, 0, H);
  sand.addColorStop(0, '#f5d88a');
  sand.addColorStop(1, '#e8c46a');
  ctx.fillStyle = sand;
  ctx.fillRect(0, H * 0.38, W, H);

  // Road
  const road = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_LEFT + ROAD_WIDTH, 0);
  road.addColorStop(0, '#7a7a6e');
  road.addColorStop(0.5, '#8a8a7e');
  road.addColorStop(1, '#7a7a6e');
  ctx.fillStyle = road;
  ctx.fillRect(ROAD_LEFT, H * 0.35, ROAD_WIDTH, H);

  // Road edge lines
  ctx.strokeStyle = '#c8b860';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(ROAD_LEFT, H * 0.35); ctx.lineTo(ROAD_LEFT, H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ROAD_LEFT + ROAD_WIDTH, H * 0.35); ctx.lineTo(ROAD_LEFT + ROAD_WIDTH, H); ctx.stroke();

  // Lane dashes
  ctx.setLineDash([30, 30]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,200,0.55)';
  for (let d = 0; d < 2; d++) {
    const lx = ROAD_LEFT + LANE_W * (d + 1);
    ctx.beginPath();
    const startY = H * 0.35 - 60 + dashOffsets[d];
    for (let y = startY; y < H + 60; y += 60) {
      ctx.moveTo(lx, y);
      ctx.lineTo(lx, y + 30);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Clouds
  clouds.forEach(c => {
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w * 0.5, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(c.x - c.w * 0.2, c.y + 6, c.w * 0.28, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(c.x + c.w * 0.22, c.y + 4, c.w * 0.25, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Birds (seagulls)
  birds.forEach(b => {
    ctx.save();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (b.wingUp) {
      ctx.moveTo(b.x - 10, b.y); ctx.quadraticCurveTo(b.x - 5, b.y - 6, b.x, b.y);
      ctx.moveTo(b.x, b.y);      ctx.quadraticCurveTo(b.x + 5, b.y - 6, b.x + 10, b.y);
    } else {
      ctx.moveTo(b.x - 10, b.y); ctx.quadraticCurveTo(b.x - 5, b.y + 4, b.x, b.y);
      ctx.moveTo(b.x, b.y);      ctx.quadraticCurveTo(b.x + 5, b.y + 4, b.x + 10, b.y);
    }
    ctx.stroke();
    ctx.restore();
  });

  // Sand texture dots
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#c9a030';
  for (let i = 0; i < 18; i++) {
    const sx = (i * 73 + frame * 0.3) % W;
    const sy = H * 0.45 + (i * 47) % (H * 0.55);
    if (sx < ROAD_LEFT || sx > ROAD_LEFT + ROAD_WIDTH) {
      ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

export function updateBackground() {
  const { speed, clouds, birds } = state;

  clouds.forEach(c => { c.x -= c.s; if (c.x + c.w < 0) c.x = W + 20; });

  birds.forEach(b => {
    b.x -= b.spd;
    b.t++;
    if (b.x < -40) b.x = W + 40;
    if (b.t % 20 === 0) b.wingUp = !b.wingUp;
  });

  state.dashOffsets[0] = (state.dashOffsets[0] + speed) % 60;
  state.dashOffsets[1] = (state.dashOffsets[1] + speed) % 60;
}
