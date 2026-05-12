import { logger } from '../core/utils/logger.js';
import { fsUtils } from '../core/utils/fs.js';
import path from 'path';
import chalk from 'chalk';

export const initCommand = async (targetDir: string, options: { type?: string } = {}) => {
  const type = options.type || 'basic';
  const absolutePath = path.resolve(process.cwd(), targetDir);
  const templatePath = path.resolve(fsUtils.getPackageRoot(), 'templates', type);
  
  if (await fsUtils.exists(absolutePath)) {
    logger.error(`Directory ${absolutePath} already exists.`);
    return;
  }

  if (!(await fsUtils.exists(templatePath))) {
    logger.error(`Template type '${type}' not found. Available types: basic, minimal, workflow, operational, nosana-app, nosana-engine`);
    return;
  }

  logger.startSpinner(`Scaffolding ${chalk.cyan(type)} skill in ${targetDir}...`);

  // Copy template
  await fsUtils.copy(templatePath, absolutePath);

  // Customize metadata
  const metadataPath = path.join(absolutePath, 'metadata.json');
  if (await fsUtils.exists(metadataPath)) {
    const metadata = await fsUtils.readJson<any>(metadataPath);
    metadata.name = path.basename(targetDir).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    await fsUtils.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  logger.succeedSpinner(`Skill scaffolded successfully from ${type} template.`);
  
  console.log('\n' + chalk.green(`✓ Created ${type} skill at ${targetDir}`));
  console.log(chalk.blue(`\nNext steps:`));
  console.log(`  cd ${targetDir}`);
  console.log(`  edit SKILL.md`);
  console.log(`  nos-skill publish .`);
};
