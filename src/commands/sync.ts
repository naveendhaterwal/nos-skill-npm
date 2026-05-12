import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';

export const syncCommand = async () => {
  logger.startSpinner('Analyzing installed skills for synchronization...');
  
  const agents = await detectAgents();
  if (agents.length === 0) {
    logger.failSpinner('No supported agents detected.');
    return;
  }

  // Find all unique skills by mapping their physical source path or metadata
  // For V1, we simply copy all valid skills to ALL detected agents
  const validSkillsToSync = new Map<string, string>(); // skillId -> originPath

  for (const agent of agents) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    for (const skill of skills) {
      const skillPath = path.join(agent.globalPath, skill);
      if (!validSkillsToSync.has(skill)) {
        validSkillsToSync.set(skill, skillPath);
      }
    }
  }

  logger.succeedSpinner(`Found ${validSkillsToSync.size} unique skills to synchronize.`);

  let syncCount = 0;
  for (const [skillId, originPath] of validSkillsToSync.entries()) {
    for (const agent of agents) {
      const destPath = path.join(agent.globalPath, skillId);
      if (!(await fsUtils.exists(destPath))) {
        // We found a missing skill! Sync it.
        try {
          if (await fsUtils.isSymlink(originPath)) {
             // We can't easily resolve symlink origin cleanly cross-platform without fs.readlink, but for V1 we can copy it
             await fsUtils.copyDir(originPath, destPath);
          } else {
             await fsUtils.copyDir(originPath, destPath);
          }
          syncCount++;
          logger.info(`Synced ${skillId} -> ${agent.name}`);
        } catch {
          // ignore
        }
      }
    }
  }

  if (syncCount > 0) {
    logger.success(`Synchronized ${syncCount} skill instances across agents.`);
  } else {
    logger.success('All agents are already fully synchronized.');
  }
};
