const scoreLabelEl = document.getElementById('scoreLabel');
const livesLabelEl = document.getElementById('livesLabel');

export function updateHUD(score, lives) {
  scoreLabelEl.textContent = `Score: ${score}`;
  livesLabelEl.textContent = '❤️'.repeat(Math.max(0, lives));
}
