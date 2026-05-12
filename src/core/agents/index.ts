import { AgentConfig } from '../types/index.js';
import { AGENT_PATHS } from '../constants/paths.js';
import { fsUtils } from '../utils/fs.js';
import path from 'path';

export const createAgent = (id: string, name: string, globalPath: string): AgentConfig => ({
  id,
  name,
  globalPath,
  checkExists: async () => {
    // We assume the agent exists if its parent directory (e.g., ~/.cursor) exists.
    // We check the parent because the skills directory might not exist yet.
    const parentPath = path.dirname(globalPath);
    return await fsUtils.exists(parentPath);
  }
});

export const cursorAgent = createAgent('cursor', 'Cursor', AGENT_PATHS.cursor);
export const codexAgent = createAgent('codex', 'Codex', AGENT_PATHS.codex);
export const claudeAgent = createAgent('claude', 'Claude Code', AGENT_PATHS.claude);
export const windsurfAgent = createAgent('windsurf', 'Windsurf', AGENT_PATHS.windsurf);
export const gooseAgent = createAgent('goose', 'Goose', AGENT_PATHS.goose);
export const geminiAgent = createAgent('gemini', 'Gemini CLI', AGENT_PATHS.gemini);
export const antigravityAgent = createAgent('antigravity', 'Antigravity', AGENT_PATHS.antigravity);
export const copilotAgent = createAgent('copilot', 'GitHub Copilot', AGENT_PATHS.copilot);

export const ALL_AGENTS = [
  cursorAgent,
  codexAgent,
  claudeAgent,
  windsurfAgent,
  gooseAgent,
  geminiAgent,
  antigravityAgent,
  copilotAgent
];

export const detectAgents = async (): Promise<AgentConfig[]> => {
  const detected: AgentConfig[] = [];
  for (const agent of ALL_AGENTS) {
    if (await agent.checkExists()) {
      detected.push(agent);
    }
  }
  return detected;
};
