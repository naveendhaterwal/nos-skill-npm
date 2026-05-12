import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';
import chalk from 'chalk';
import { validateSkill } from '../core/validators/metadata.js';
import { NormalizedSkill } from '../core/types/index.js';

export const installedCommand = async (options: { all?: boolean } = {}) => {
  logger.startSpinner('Scanning installed skills...');
  const agents = await detectAgents();
  
  const skillMap = new Map<string, { normalized: NormalizedSkill, agents: string[] }>();

  for (const agent of agents) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    
    for (const skill of skills) {
      const skillPath = path.join(agent.globalPath, skill);
      
      try {
        const isSymlink = await fsUtils.isSymlink(skillPath);
        const normalized = await validateSkill(skillPath, isSymlink, false);
        
        // Default filter: ONLY show nos namespace unless --all is passed
        if (!options.all && normalized.namespace !== 'nos' && !normalized.compatibilityMode) {
          continue;
        }

        // Hide legacy/compatibility skills unless --all is passed
        if (!options.all && normalized.compatibilityMode) {
          continue;
        }

        if (!skillMap.has(skill)) {
          skillMap.set(skill, { normalized, agents: [agent.name] });
        } else {
          skillMap.get(skill)!.agents.push(agent.name);
        }
      } catch {
        // ignore strictly malformed skills in list view
      }
    }
  }

  logger.succeedSpinner('Scan complete.');

  if (skillMap.size === 0) {
    if (options.all) {
      logger.info('No skills installed yet.');
    } else {
      logger.info('No official Nosana skills installed. Use --all to see legacy or compatibility skills.');
    }
    return;
  }

  console.log('\n' + chalk.bold('Installed Skills (Official Nosana Ecosystem):'));
  console.log('='.repeat(80));
  console.log(
    chalk.bold('NAME'.padEnd(30)) +
    chalk.bold('VERSION'.padEnd(10)) +
    chalk.bold('NAMESPACE'.padEnd(15)) +
    chalk.bold('MODE'.padEnd(15))
  );
  console.log('-'.repeat(80));
  
  for (const [id, data] of skillMap.entries()) {
    const name = data.normalized.normalizedName;
    const version = 'v' + data.normalized.normalizedVersion;
    const namespace = data.normalized.namespace || 'global';
    const mode = data.normalized.compatibilityMode ? chalk.yellow('compatibility') : chalk.green('structured');
    
    console.log(
      name.padEnd(30) +
      version.padEnd(10) +
      namespace.padEnd(15) +
      mode.padEnd(25)
    );
    console.log(chalk.dim('Agents: ') + chalk.cyan(data.agents.join(', ')));
    console.log('-'.repeat(80));
  }
};
