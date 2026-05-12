import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';

export const removeCommand = async (skillName: string, options: { yes?: boolean } = {}) => {
  logger.startSpinner(`Removing skill '${skillName}'...`);
  
  const agents = await detectAgents();
  let removedCount = 0;

  for (const agent of agents) {
    const destPath = path.join(agent.globalPath, skillName);
    if (await fsUtils.exists(destPath)) {
      await fsUtils.removeDir(destPath);
      logger.info(`Removed from ${agent.name}`);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    logger.succeedSpinner(`Successfully removed '${skillName}' from ${removedCount} agents.`);
  } else {
    logger.failSpinner(`Skill '${skillName}' not found in any detected agents.`);
  }
};
