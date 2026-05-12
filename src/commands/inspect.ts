import { logger } from '../core/utils/logger.js';
import { fsUtils } from '../core/utils/fs.js';
import path from 'path';
import chalk from 'chalk';
import { buildIntelligenceReport } from '../engines/skill-intelligence/index.js';
import { determinePhysicalState } from '../engines/trust-engine/index.js';

export const inspectCommand = async (skillPath: string) => {
  let targetPath = path.resolve(process.cwd(), skillPath);
  
  if (!(await fsUtils.exists(targetPath))) {
    // Try to find in registry
    const appPath = path.resolve(process.cwd(), 'registry/nos/apps', skillPath);
    const enginePath = path.resolve(process.cwd(), 'registry/nos/engines', skillPath);
    
    if (await fsUtils.exists(appPath)) {
      targetPath = appPath;
    } else if (await fsUtils.exists(enginePath)) {
      targetPath = enginePath;
    } else {
      logger.failSpinner(`Skill path or registry name not found: ${skillPath}`);
      return;
    }
  }

  logger.startSpinner(`Inspecting skill at ${targetPath}...`);

  const trustState = await determinePhysicalState(targetPath);
  if (trustState === 'corrupted') {
    logger.failSpinner('Skill is corrupted. Cannot inspect.');
    return;
  }

  let markdownContent = '';
  if (await fsUtils.exists(path.join(targetPath, 'SKILL.md'))) {
    markdownContent = await fsUtils.readFile(path.join(targetPath, 'SKILL.md'));
  }

  const report = buildIntelligenceReport(
    path.basename(targetPath),
    markdownContent,
    trustState === 'structured'
  );

  logger.stopSpinner();

  console.log('\n' + chalk.bold.bgBlue.white(` 🧠 INTELLIGENCE REPORT: ${report.skillId} `));
  
  console.log('\n' + chalk.bold.underline('Core Metrics'));
  console.log(`Trust Score:  ${report.trustScore >= 70 ? chalk.green(report.trustScore) : chalk.yellow(report.trustScore)}/100`);
  console.log(`Trust State:  ${chalk.cyan(report.trustState)}`);
  console.log(`Complexity:   ${report.complexity === 'dangerous' ? chalk.red(report.complexity) : chalk.green(report.complexity)}`);

  console.log('\n' + chalk.bold.underline('Agent Compatibility'));
  const agents = Object.entries(report.compatibility)
    .filter(([_, supported]) => supported)
    .map(([agent]) => agent)
    .join(', ');
  console.log(agents || chalk.gray('None explicitly detected (Universal fallback)'));

  console.log('\n' + chalk.bold.underline('Safety & Security'));
  const safeColor = report.safety.riskLevel === 'safe' ? chalk.green : chalk.red;
  console.log(`Risk Level:   ${safeColor(report.safety.riskLevel.toUpperCase())}`);
  if (report.safety.dangerousCommands.length > 0) {
    console.log(`Threats:      ${chalk.red(report.safety.dangerousCommands.join(', '))}`);
  }
  console.log(`Shell Exec:   ${report.safety.shellExecution ? chalk.yellow('Yes') : chalk.green('No')}`);
  console.log(`Network Exec: ${report.safety.networkExecution ? chalk.yellow('Yes') : chalk.green('No')}`);

  console.log('\n' + chalk.bold.underline('Quality & Structure'));
  console.log(`Examples:     ${report.quality.hasExamples ? chalk.green('Yes') : chalk.red('No')}`);
  console.log(`Schemas:      ${report.quality.hasSchemas ? chalk.green('Yes') : chalk.yellow('No')}`);
  console.log(`Workflow:     ${chalk.cyan(report.workflow.workflowType)}`);

  if (report.dependencies.length > 0) {
    console.log('\n' + chalk.bold.underline('Dependencies'));
    console.log(chalk.cyan(report.dependencies.join(', ')));
  }

  if (report.recommendations.length > 0) {
    console.log('\n' + chalk.bold.underline('Recommendations'));
    report.recommendations.forEach(r => console.log(chalk.yellow(`• ${r}`)));
  }
  
  console.log('');
};
