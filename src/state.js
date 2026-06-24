import { LANE_CENTERS, BASE_SPEED } from './constants.js';

// Single shared mutable game state — all modules import this object.
export const state = {
  phase: 'start', // 'start' | 'playing' | 'dead'
  score: 0,
  lives: 3,
  hiScore: 0,
  speed: BASE_SPEED,
  frame: 0,
  invincible: 0,

  player: {
    lane: 1,
    x: LANE_CENTERS[1],
    y: 490,
    w: 38,
    h: 64,
    targetX: LANE_CENTERS[1],
  },

  dashOffsets: [0, 0],

  combo: 0,          // consecutive dodges since last hit
  comboFlash: 0,     // frames to show combo-up flash

  obstacles: [],
  coins: [],
  particles: [],

  clouds: [
    { x: 60,  y: 40,  w: 90,  s: 0.3 },
    { x: 260, y: 20,  w: 110, s: 0.2 },
    { x: 160, y: 70,  w: 70,  s: 0.25 },
  ],

  birds: [
    { x: 80,  y: 80,  spd: 0.6, wingUp: true,  t: 0 },
    { x: 320, y: 50,  spd: 0.4, wingUp: false, t: 30 },
  ],
};

export function resetState() {
  state.phase = 'playing';
  state.score = 0;
  state.lives = 3;
  state.speed = BASE_SPEED;
  state.frame = 0;
  state.invincible = 0;

  state.player.lane = 1;
  state.player.x = LANE_CENTERS[1];
  state.player.targetX = LANE_CENTERS[1];

  state.combo = 0;
  state.comboFlash = 0;
  state.dashOffsets = [0, 0];
  state.obstacles = [];
  state.coins = [];
  state.particles = [];
}
