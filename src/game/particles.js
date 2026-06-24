import { state } from '../state.js';

export function spawnCrashParticles(px, py) {
  for (let i = 0; i < 18; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 4;
    state.particles.push({
      x: px, y: py,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 40 + Math.random() * 30,
      maxLife: 70,
      color: `hsl(${Math.random() * 60 + 10}, 90%, 55%)`,
      r: 3 + Math.random() * 5,
    });
  }
}

export function spawnCoinParticles(x, y) {
  for (let i = 0; i < 7; i++) {
    const angle = Math.random() * Math.PI * 2;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2 - 2,
      life: 25,
      maxLife: 25,
      color: '#ffd700',
      r: 4,
    });
  }
}

export function updateParticles() {
  state.particles = state.particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life--;
    return p.life > 0;
  });
}

export function drawParticles(ctx) {
  state.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
