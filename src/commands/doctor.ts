import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';
import chalk from 'chalk';
import { determinePhysicalState } from '../engines/trust-engine/index.js';
import { globalQueue } from '../workers/index.js';

export const doctorCommand = async () => {
  logger.printLogo();
  console.log(chalk.bold('Running System Diagnostics...\n'));

  const detected = await detectAgents();
  const registryPath = path.resolve(fsUtils.getPackageRoot(), 'registry/nos');
  const registryExists = await fsUtils.exists(registryPath);
  const indexExists = await fsUtils.exists(path.join(registryPath, 'index.json'));

  console.log(chalk.bold.underline('Ecosystem Registry Check'));
  if (!registryExists) {
    console.log(`${chalk.red('✖')} Canonical registry not found at ./registry/nos`);
  } else if (!indexExists) {
    console.log(`${chalk.yellow('⚠')} Registry index missing. Use 'nos-skill list' to force regeneration if applicable.`);
  } else {
    console.log(`${chalk.green('✓')} Canonical Nosana registry detected.`);
  }
  console.log('');
  
  let issues = 0;
  const tasks: Promise<void>[] = [];

  console.log(chalk.bold.underline('Skill Integrity Validation'));
  
  for (const agent of detected) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    for (const skill of skills) {
      tasks.push(globalQueue.enqueue(async () => {
        const skillPath = path.join(agent.globalPath, skill);
        const state = await determinePhysicalState(skillPath);
        
        if (state === 'corrupted') {
          issues++;
          console.log(`${chalk.red('✖')} [${agent.name}] ${skill} is ${chalk.red('corrupted')} (missing SKILL.md)`);
        } else if (state === 'recoverable') {
          issues++;
          console.log(`${chalk.yellow('⚠')} [${agent.name}] ${skill} is ${chalk.yellow('recoverable')} (metadata exists but broken/missing entry)`);
        } else if (state === 'compatibility') {
          console.log(`${chalk.blue('ℹ')} [${agent.name}] ${skill} is a ${chalk.blue('compatibility mode')} skill`);
        } else {
          console.log(`${chalk.green('✓')} [${agent.name}] ${skill} is a ${chalk.green('structured')} skill`);
        }
      }));
    }
  }

  await Promise.all(tasks);

  console.log('\n' + '='.repeat(50));
  if (issues === 0) {
    console.log(chalk.green.bold(`✓ System Healthy. 0 corrupted/recoverable issues found.`));
  } else {
    console.log(chalk.red.bold(`✖ System Degraded. ${issues} corrupted/recoverable issues found. Run 'nos-skill repair' to fix recoverable skills.`));
  }
};
