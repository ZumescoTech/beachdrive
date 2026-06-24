const STORAGE_KEY = 'beachDriveLeaderboard';
const MAX_ENTRIES = 5;

export function saveScore(score) {
  const board = loadScores();
  board.push({ score, date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_) {
    return [];
  }
}

// Renders the leaderboard into #leaderboardDisplay.
// Highlights the entry matching `currentScore`.
export function renderLeaderboard(currentScore) {
  const el = document.getElementById('leaderboardDisplay');
  if (!el) return;

  const scores = loadScores();
  if (scores.length === 0) {
    el.innerHTML = '';
    return;
  }

  const items = scores
    .map((entry, i) => {
      const highlight = entry.score === currentScore ? ' class="current-run"' : '';
      return `<li${highlight}>#${i + 1} &nbsp; ${entry.score} &nbsp; <small>${entry.date}</small></li>`;
    })
    .join('');

  el.innerHTML = `<h3>Top Scores</h3><ol>${items}</ol>`;
}
