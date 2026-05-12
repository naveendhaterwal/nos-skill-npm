import { getRegistry } from '../core/registry/index.js';
import { logger } from '../core/utils/logger.js';
import chalk from 'chalk';

export const listCommand = async () => {
  logger.startSpinner('Fetching official Nosana registry...');
  const skills = await getRegistry();
  logger.succeedSpinner('Registry loaded.');

  const apps = skills.filter(s => s.skillType === 'app');
  const engines = skills.filter(s => s.skillType === 'engine');

  if (apps.length > 0) {
    console.log('\n' + chalk.bold.blue('Official Nosana Apps (' + apps.length + ')'));
    console.log('='.repeat(80));
    console.log(
      chalk.bold('NAME'.padEnd(30)) +
      chalk.bold('VERSION'.padEnd(10)) +
      chalk.bold('DESCRIPTION')
    );
    console.log('-'.repeat(80));
    for (const skill of apps) {
      console.log(
        chalk.green(skill.name.padEnd(30)) +
        chalk.dim((skill.version || '1.0.0').padEnd(10)) +
        skill.description.substring(0, 40) + '...'
      );
    }
  }

  if (engines.length > 0) {
    console.log('\n' + chalk.bold.yellow('Operational Engines (' + engines.length + ')'));
    console.log('='.repeat(80));
    console.log(
      chalk.bold('NAME'.padEnd(40)) +
      chalk.bold('VERSION'.padEnd(10)) +
      chalk.bold('STATUS')
    );
    console.log('-'.repeat(80));
    for (const skill of engines) {
      console.log(
        chalk.cyan(skill.name.padEnd(40)) +
        chalk.dim((skill.version || '1.0.0').padEnd(10)) +
        chalk.green('verified')
      );
    }
  }

  console.log('\n' + chalk.dim('Use "nos-skill installed" to see skills physically linked to your agents.'));
};
