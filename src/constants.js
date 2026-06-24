export const W = 420;
export const H = 600;

export const ROAD_LEFT = 30;
export const ROAD_WIDTH = 360;
export const LANE_W = ROAD_WIDTH / 3;
export const LANE_CENTERS = [
  ROAD_LEFT + LANE_W * 0.5,
  ROAD_LEFT + LANE_W * 1.5,
  ROAD_LEFT + LANE_W * 2.5,
];

export const MAX_SPEED = 12;
export const BASE_SPEED = 4;
export const INVINCIBLE_FRAMES = 90;

export const OBS_TYPES = [
  { label: '🪨', color: '#888',    w: 46, h: 46, pts: 0 },
  { label: '🌴', color: '#2d8c3c', w: 34, h: 60, pts: 0 },
  { label: '🦀', color: '#e05a1c', w: 44, h: 34, pts: 0 },
  { label: '🚧', color: '#e8a020', w: 52, h: 30, pts: 0 },
  { label: '🐚', color: '#d4a96a', w: 36, h: 28, pts: 0 },
];
