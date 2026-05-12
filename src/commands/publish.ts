import { logger } from '../core/utils/logger.js';
import { fsUtils } from '../core/utils/fs.js';
import path from 'path';
import chalk from 'chalk';
import { validateSkill } from '../core/validators/metadata.js';
import { analyzeSecurity } from '../engines/security-audit/index.js';

export const publishCommand = async (skillPath: string) => {
  logger.startSpinner(`Validating skill at ${skillPath} for publishing...`);
  
  const absolutePath = path.resolve(process.cwd(), skillPath);
  
  if (!(await fsUtils.exists(absolutePath))) {
    logger.failSpinner(`Skill directory not found at ${absolutePath}`);
    return;
  }

  try {
    // 1. Validate Structure
    const normalized = await validateSkill(absolutePath, false, false);

    // 2. Security Check
    const mdPath = path.join(absolutePath, 'SKILL.md');
    let mdContent = '';
    if (await fsUtils.exists(mdPath)) {
      mdContent = await fsUtils.readFile(mdPath);
    }
    
    const security = analyzeSecurity(mdContent);
    if (security.riskLevel === 'critical' || security.riskLevel === 'high') {
      logger.failSpinner('Security Audit Failed. Cannot publish unsafe skill.');
      console.log(chalk.red('\nThreats detected:'));
      security.dangerousCommands.forEach(cmd => console.log(chalk.red(`  ✖ ${cmd}`)));
      return;
    }

    logger.succeedSpinner('Validation passed. Skill is safe for ecosystem.');

    console.log('\n' + chalk.bold.green('📦 Publish Manifest Generated'));
    console.log('='.repeat(50));
    console.log(`${chalk.bold('Name:')}       ${normalized.normalizedName}`);
    console.log(`${chalk.bold('Version:')}    ${normalized.normalizedVersion}`);
    console.log(`${chalk.bold('Hash:')}       ${normalized.hash}`);
    console.log(`${chalk.bold('Risk:')}       ${security.riskLevel.toUpperCase()}`);
    console.log('='.repeat(50));
    console.log(chalk.blue('\nRun `npm publish` or open a PR to the default registry to complete publishing.'));

  } catch (e: any) {
    logger.failSpinner('Publish validation failed.');
    console.log(chalk.red(e.message));
  }
};
