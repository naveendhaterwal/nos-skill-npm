import os from 'os';
import path from 'path';

export const HOMEDIR = os.homedir();

export const AGENT_PATHS = {
  cursor: path.join(HOMEDIR, '.cursor', 'skills'),
  codex: path.join(HOMEDIR, '.codex', 'skills'),
  claude: path.join(HOMEDIR, '.claude', 'skills'),
  windsurf: path.join(HOMEDIR, '.windsurf', 'skills'),
  goose: path.join(HOMEDIR, '.goose', 'skills'),
  gemini: path.join(HOMEDIR, '.gemini', 'skills'),
  antigravity: path.join(HOMEDIR, '.gemini', 'antigravity', 'skills'),
  copilot: path.join(HOMEDIR, '.github', 'skills'),
};
