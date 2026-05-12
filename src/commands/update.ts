import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';
import { validateSkill } from '../core/validators/metadata.js';
import { getRegistry } from '../registry/index.js';
import { installSkill } from '../core/installers/engine.js';

export const updateCommand = async () => {
  logger.startSpinner('Checking for skill updates...');
  const agents = await detectAgents();
  const registry = await getRegistry();
  
  if (agents.length === 0) {
    logger.failSpinner('No agents detected.');
    return;
  }

  // We'll update based on the registry. For V1 we just reinstall matching registry skills.
  const uniqueSkillsToUpdate = new Set<string>();

  for (const agent of agents) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    for (const skill of skills) {
      if (registry.some(r => r.name === skill)) {
        uniqueSkillsToUpdate.add(skill);
      }
    }
  }

  logger.stopSpinner();

  if (uniqueSkillsToUpdate.size === 0) {
    logger.info('No skills found that are trackable by the default registry.');
    return;
  }

  logger.info(`Found ${uniqueSkillsToUpdate.size} skills eligible for updates. Updating...`);

  for (const skillName of uniqueSkillsToUpdate) {
    const registryEntry = registry.find(r => r.name === skillName);
    if (registryEntry) {
      logger.info(`Updating ${skillName}...`);
      await installSkill(registryEntry.url, false);
    }
  }
  
  logger.success('All eligible skills updated successfully.');
};
