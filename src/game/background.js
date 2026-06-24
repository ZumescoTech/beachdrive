import { W, H, ROAD_LEFT, ROAD_WIDTH, LANE_W } from '../constants.js';
import { state } from '../state.js';

const ROAD_RIGHT = ROAD_LEFT + ROAD_WIDTH;
const HORIZON_Y  = H * 0.40;

// ---- Twelve Apostles mountain silhouette points (left background) ----
// Normalised [0..1] x within left half of canvas, [0..1] y within sky zone
const MOUNTAIN_PEAKS = [
  [0.00, 0.82], [0.04, 0.58], [0.08, 0.72], [0.13, 0.44], [0.18, 0.60],
  [0.23, 0.36], [0.29, 0.50], [0.35, 0.28], [0.40, 0.42], [0.46, 0.22],
  [0.52, 0.38], [0.58, 0.30], [0.64, 0.46], [0.70, 0.34], [0.76, 0.52],
  [0.82, 0.42], [0.88, 0.60], [0.94, 0.50], [1.00, 0.70], [1.00, 1.00],
  [0.00, 1.00],
];

function drawMountains(ctx) {
  const skyH = HORIZON_Y;
  const mtnW = ROAD_LEFT + ROAD_WIDTH * 0.55; // mountains span left + part of road bg

  ctx.save();
  // Far peaks — lighter, hazy (atmospheric perspective)
  ctx.fillStyle = '#8a9aaa';
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  MOUNTAIN_PEAKS.forEach(([nx, ny], i) => {
    const x = nx * mtnW;
    const y = ny * skyH * 0.85;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  // Near peaks — darker, more defined
  const NEAR = [
    [0.00, 0.88], [0.06, 0.62], [0.11, 0.78], [0.17, 0.48], [0.22, 0.64],
    [0.28, 0.40], [0.34, 0.55], [0.40, 0.32], [0.46, 0.48], [0.52, 0.38],
    [0.58, 0.55], [0.63, 0.44], [0.68, 0.60], [0.74, 0.52], [0.80, 0.68],
    [0.86, 0.58], [0.92, 0.74], [1.00, 0.80], [1.00, 1.00], [0.00, 1.00],
  ];
  ctx.globalAlpha = 0.70;
  ctx.fillStyle = '#5a6670';
  ctx.beginPath();
  NEAR.forEach(([nx, ny], i) => {
    const x = nx * mtnW;
    const y = ny * skyH * 0.92;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  // Closest ridge — dark brown rock
  const RIDGE = [
    [0.00, 0.94], [0.05, 0.72], [0.10, 0.86], [0.16, 0.60], [0.22, 0.76],
    [0.28, 0.55], [0.34, 0.68], [0.40, 0.46], [0.47, 0.62], [0.53, 0.50],
    [0.60, 0.66], [0.66, 0.58], [0.72, 0.72], [0.78, 0.64], [0.85, 0.78],
    [0.92, 0.70], [1.00, 0.84], [1.00, 1.00], [0.00, 1.00],
  ];
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = '#3d3830';
  ctx.beginPath();
  RIDGE.forEach(([nx, ny], i) => {
    const x = nx * mtnW * 0.72;
    const y = ny * skyH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawSky(ctx) {
  // Cape Town cerulean sky
  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  sky.addColorStop(0, '#2a8fcc');
  sky.addColorStop(0.5, '#5bb8e8');
  sky.addColorStop(1, '#a8daf5');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HORIZON_Y);
}

function drawOceanHorizon(ctx) {
  // Ocean fills the right portion of the sky from the horizon line upward
  const oceanX = ROAD_RIGHT - ROAD_WIDTH * 0.15;
  const grad = ctx.createLinearGradient(oceanX, HORIZON_Y * 0.55, W, HORIZON_Y);
  grad.addColorStop(0, 'rgba(10,120,130,0)');
  grad.addColorStop(1, 'rgba(10,120,130,0.85)');
  ctx.fillStyle = grad;
  ctx.fillRect(oceanX, HORIZON_Y * 0.55, W - oceanX, HORIZON_Y * 0.45);

  // Hard horizon water line
  const hz = ctx.createLinearGradient(0, HORIZON_Y - 4, 0, HORIZON_Y + 6);
  hz.addColorStop(0, 'rgba(255,255,255,0.55)');
  hz.addColorStop(1, 'rgba(10,140,150,0)');
  ctx.fillStyle = hz;
  ctx.fillRect(ROAD_RIGHT - 20, HORIZON_Y - 4, W - ROAD_RIGHT + 20, 10);
}

function drawBeachStrip(ctx, frame) {
  // Left of road: Camps Bay white sand beach
  const sand = ctx.createLinearGradient(0, HORIZON_Y, ROAD_LEFT, H);
  sand.addColorStop(0, '#e8dab8');
  sand.addColorStop(0.3, '#f2e8c8');
  sand.addColorStop(1, '#f5edd0');
  ctx.fillStyle = sand;
  ctx.fillRect(0, HORIZON_Y, ROAD_LEFT, H - HORIZON_Y);

  // Wet sand strip near road edge
  const wetSand = ctx.createLinearGradient(ROAD_LEFT - 12, 0, ROAD_LEFT, 0);
  wetSand.addColorStop(0, 'rgba(180,160,100,0.0)');
  wetSand.addColorStop(1, 'rgba(140,120,70,0.3)');
  ctx.fillStyle = wetSand;
  ctx.fillRect(0, HORIZON_Y, ROAD_LEFT, H - HORIZON_Y);

  // Sand ripple lines (subtle)
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#c8a860';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const y = HORIZON_Y + 20 + i * 30 + ((frame * 0.4) % 30);
    if (y > H) break;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ROAD_LEFT, y);
    ctx.stroke();
  }
  ctx.restore();

  // Pebbles / shell dots
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#b8a070';
  for (let i = 0; i < 8; i++) {
    const sx = (i * 11) % ROAD_LEFT;
    const sy = HORIZON_Y + 30 + (i * 53) % (H - HORIZON_Y - 40);
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawOceanStrip(ctx, frame) {
  // Right of road: teal Atlantic ocean
  const ocean = ctx.createLinearGradient(ROAD_RIGHT, HORIZON_Y, W, H);
  ocean.addColorStop(0, '#0e9ea8');
  ocean.addColorStop(0.3, '#0a8a94');
  ocean.addColorStop(1, '#076870');
  ctx.fillStyle = ocean;
  ctx.fillRect(ROAD_RIGHT, HORIZON_Y, W - ROAD_RIGHT, H - HORIZON_Y);

  // Deep water gradient from road edge
  const deepGrad = ctx.createLinearGradient(ROAD_RIGHT, 0, W, 0);
  deepGrad.addColorStop(0, 'rgba(0,40,50,0.25)');
  deepGrad.addColorStop(1, 'rgba(0,40,50,0)');
  ctx.fillStyle = deepGrad;
  ctx.fillRect(ROAD_RIGHT, HORIZON_Y, W - ROAD_RIGHT, H - HORIZON_Y);

  // Animated wave highlights
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#a0f0f8';
  const waveCount = 5;
  for (let i = 0; i < waveCount; i++) {
    const t = (frame * 0.8 + i * 40) % (H - HORIZON_Y);
    const y = HORIZON_Y + t;
    const waveW = W - ROAD_RIGHT;
    ctx.fillRect(ROAD_RIGHT, y, waveW, 3);
  }
  ctx.restore();

  // Sea foam near road edge
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) {
    const t = (frame * 1.2 + i * 55) % (H - HORIZON_Y);
    const y = HORIZON_Y + t;
    ctx.fillRect(ROAD_RIGHT, y, 6, 2);
  }
  ctx.restore();

  // Sparkle glints on water
  ctx.save();
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const gx = ROAD_RIGHT + 2 + (i * 7 + Math.floor(frame / 8) * 3) % (W - ROAD_RIGHT - 4);
    const gy = HORIZON_Y + 10 + (i * 41 + frame) % (H - HORIZON_Y - 20);
    ctx.globalAlpha = 0.15 + 0.25 * Math.abs(Math.sin(frame * 0.08 + i));
    ctx.beginPath();
    ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRoad(ctx, frame, dashOffsets) {
  // Asphalt — warm grey with slight perspective taper (visual only)
  const road = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_RIGHT, 0);
  road.addColorStop(0, '#484840');
  road.addColorStop(0.15, '#565650');
  road.addColorStop(0.5, '#606058');
  road.addColorStop(0.85, '#565650');
  road.addColorStop(1, '#484840');
  ctx.fillStyle = road;
  ctx.fillRect(ROAD_LEFT, HORIZON_Y, ROAD_WIDTH, H - HORIZON_Y);

  // Kerb lines — white
  ctx.strokeStyle = '#e8e8d8';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(ROAD_LEFT,  HORIZON_Y); ctx.lineTo(ROAD_LEFT,  H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ROAD_RIGHT, HORIZON_Y); ctx.lineTo(ROAD_RIGHT, H); ctx.stroke();

  // Lane dashes — white
  ctx.setLineDash([28, 28]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,240,0.65)';
  for (let d = 0; d < 2; d++) {
    const lx = ROAD_LEFT + LANE_W * (d + 1);
    ctx.beginPath();
    const startY = HORIZON_Y - 56 + dashOffsets[d];
    for (let y = startY; y < H + 56; y += 56) {
      ctx.moveTo(lx, y);
      ctx.lineTo(lx, y + 28);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawPalmTrees(ctx, frame) {
  // A couple of palm trees on the beach side — scroll slowly upward with parallax
  const palms = [
    { bx: 14, by: H * 0.62 },
    { bx:  8, by: H * 0.82 },
  ];

  palms.forEach(({ bx, by }) => {
    const scrollY = (frame * 0.6) % H;
    const y = by - scrollY;
    if (y < HORIZON_Y - 60 || y > H + 40) return;

    ctx.save();
    // Trunk
    ctx.strokeStyle = '#7a5c30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx, y);
    ctx.quadraticCurveTo(bx + 3, y - 28, bx + 1, y - 48);
    ctx.stroke();

    // Fronds
    ctx.strokeStyle = '#2d7a30';
    ctx.lineWidth = 2;
    const tipX = bx + 1, tipY = y - 48;
    const fronds = [
      [[-14, -8], [10, -4]],
      [[-10, -14], [8, 2]],
      [[-4, -16], [14, -10]],
      [[4, -18], [14, -4]],
      [[10, -12], [4, 6]],
    ];
    fronds.forEach(([[ax, ay], [bfx, bfy]]) => {
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.quadraticCurveTo(tipX + ax, tipY + ay, tipX + bfx, tipY + bfy);
      ctx.stroke();
    });
    ctx.restore();
  });
}

function drawClouds(ctx, clouds) {
  clouds.forEach(c => {
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w * 0.5, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(c.x - c.w * 0.2, c.y + 5, c.w * 0.28, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(c.x + c.w * 0.22, c.y + 3, c.w * 0.25, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawSeagulls(ctx, birds) {
  birds.forEach(b => {
    ctx.save();
    ctx.strokeStyle = '#334';
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
}

// ---- Public API ----

export function drawBackground(ctx) {
  const { frame, dashOffsets, clouds, birds } = state;

  drawSky(ctx);
  drawMountains(ctx);
  drawOceanHorizon(ctx);
  drawBeachStrip(ctx, frame);
  drawOceanStrip(ctx, frame);
  drawRoad(ctx, frame, dashOffsets);
  drawPalmTrees(ctx, frame);
  drawClouds(ctx, clouds);
  drawSeagulls(ctx, birds);
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

  state.dashOffsets[0] = (state.dashOffsets[0] + speed) % 56;
  state.dashOffsets[1] = (state.dashOffsets[1] + speed) % 56;
}
