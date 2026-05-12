import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';
import chalk from 'chalk';
import { determinePhysicalState } from '../engines/trust-engine/index.js';
import { globalQueue } from '../workers/index.js';

export const repairCommand = async () => {
  logger.startSpinner('Scanning for recoverable skills...');
  
  const agents = await detectAgents();
  let repairedCount = 0;

  const tasks: Promise<void>[] = [];

  for (const agent of agents) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    for (const skill of skills) {
      tasks.push(globalQueue.enqueue(async () => {
        const skillPath = path.join(agent.globalPath, skill);
        const state = await determinePhysicalState(skillPath);
        
        if (state === 'recoverable') {
          const metadataPath = path.join(skillPath, 'metadata.json');
          const skillMdPath = path.join(skillPath, 'SKILL.md');
          
          if (!(await fsUtils.exists(skillMdPath))) {
            // Repair by stubbing SKILL.md
            await fsUtils.writeFile(skillMdPath, `# ${skill}\n\nThis skill was auto-repaired. Please update instructions.`);
            repairedCount++;
            console.log(`${chalk.green('✓')} Repaired missing SKILL.md for [${agent.name}] ${skill}`);
          } else {
            // JSON is broken, repair by deleting and inferring
            await fsUtils.writeFile(metadataPath, JSON.stringify({
              name: skill,
              version: "0.1.0",
              description: "Auto-repaired metadata",
              entry: "SKILL.md"
            }, null, 2));
            repairedCount++;
            console.log(`${chalk.green('✓')} Repaired corrupted metadata.json for [${agent.name}] ${skill}`);
          }
        }
      }));
    }
  }

  await Promise.all(tasks);
  logger.stopSpinner();

  if (repairedCount > 0) {
    console.log(chalk.green(`\nSuccessfully repaired ${repairedCount} skills.`));
  } else {
    console.log(chalk.blue(`\nNo recoverable skills found. System is clean.`));
  }
};
