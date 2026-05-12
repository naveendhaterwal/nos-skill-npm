import { searchSemantic } from '../engines/vector-search/index.js';
import { logger } from '../core/utils/logger.js';
import chalk from 'chalk';

export const searchCommand = async (query: string) => {
  logger.startSpinner(`Semantic searching for '${query}'...`);
  
  const results = await searchSemantic(query);

  logger.stopSpinner();

  if (results.length === 0) {
    logger.info(`No skills found matching '${query}'.`);
    return;
  }

  console.log('\n' + chalk.bold(`Semantic Search Results (${results.length} found):`));
  console.log('='.repeat(80));

  for (const { skill, score } of results) {
    console.log(`${chalk.green.bold(skill.name)} ${chalk.dim(`(Score: ${score.toFixed(1)})`)}`);
    console.log(`${chalk.gray(skill.description)}`);
    console.log(`${chalk.dim('URL:')}  ${chalk.cyan(skill.url)}`);
    console.log(`${chalk.dim('Tags:')} ${skill.tags.join(', ')}`);
    console.log('-'.repeat(80));
  }
};
