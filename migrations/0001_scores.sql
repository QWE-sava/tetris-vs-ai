CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lines INTEGER NOT NULL,
  won INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'versus',
  created_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours'))
);
CREATE INDEX IF NOT EXISTS idx_scores_lines ON scores (lines DESC);
