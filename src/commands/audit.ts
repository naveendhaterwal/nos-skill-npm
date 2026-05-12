import { logger } from '../core/utils/logger.js';
import { fsUtils } from '../core/utils/fs.js';
import path from 'path';
import chalk from 'chalk';
import { buildIntelligenceReport } from '../engines/skill-intelligence/index.js';
import { determinePhysicalState } from '../engines/trust-engine/index.js';
import { detectAgents } from '../core/agents/index.js';
import { globalQueue } from '../workers/index.js';

export const auditCommand = async (options: { registry?: boolean } = {}) => {
  const sourceName = options.registry ? 'Nosana registry' : 'ecosystem';
  logger.startSpinner(`Running ${sourceName} security and architecture audit...`);
  
  let totalSkills = 0;
  let unsafeCount = 0;
  let criticalThreats: { source: string, skill: string, threats: string[] }[] = [];

  const tasks: Promise<void>[] = [];

  if (options.registry) {
    const registryDir = path.resolve(fsUtils.getPackageRoot(), 'registry/nos');
    const apps = (await fsUtils.getDirectories(path.join(registryDir, 'apps'))).map(d => path.join('apps', d));
    const engines = (await fsUtils.getDirectories(path.join(registryDir, 'engines'))).map(d => path.join('engines', d));
    const registrySkills = [...apps, ...engines];

    for (const skillSubPath of registrySkills) {
      tasks.push(globalQueue.enqueue(async () => {
        totalSkills++;
        const skillName = path.basename(skillSubPath);
        const skillPath = path.join(registryDir, skillSubPath);
        const state = await determinePhysicalState(skillPath);
        
        if (state !== 'corrupted') {
          let markdown = '';
          if (await fsUtils.exists(path.join(skillPath, 'SKILL.md'))) {
            markdown = await fsUtils.readFile(path.join(skillPath, 'SKILL.md'));
          }
          const report = buildIntelligenceReport(skillName, markdown, state === 'structured');
          
          if (report.safety.riskLevel === 'critical' || report.safety.riskLevel === 'high') {
            unsafeCount++;
            criticalThreats.push({ source: 'registry', skill: skillName, threats: report.safety.dangerousCommands });
          }
        }
      }));
    }
  } else {
    const agents = await detectAgents();
    if (agents.length === 0) {
      logger.failSpinner('No agents detected.');
      return;
    }

    for (const agent of agents) {
      const skills = await fsUtils.getDirectories(agent.globalPath);
      for (const skill of skills) {
        tasks.push(globalQueue.enqueue(async () => {
          totalSkills++;
          const skillPath = path.join(agent.globalPath, skill);
          const state = await determinePhysicalState(skillPath);
          
          if (state !== 'corrupted' && state !== 'recoverable') {
            let markdown = '';
            if (await fsUtils.exists(path.join(skillPath, 'SKILL.md'))) {
              markdown = await fsUtils.readFile(path.join(skillPath, 'SKILL.md'));
            }
            const report = buildIntelligenceReport(skill, markdown, state === 'structured');
            
            if (report.safety.riskLevel === 'critical' || report.safety.riskLevel === 'high') {
              unsafeCount++;
              if (report.safety.dangerousCommands.length > 0) {
                criticalThreats.push({ source: agent.name, skill, threats: report.safety.dangerousCommands });
              }
            }
          }
        }));
      }
    }
  }

  await Promise.all(tasks);
  logger.stopSpinner();

  console.log('\n' + chalk.bold.bgRed.white(' ECOSYSTEM SECURITY AUDIT '));
  console.log(`\nTotal Skills Scanned: ${chalk.cyan(totalSkills)}`);
  console.log(`Unsafe Skills Found:  ${unsafeCount > 0 ? chalk.red(unsafeCount) : chalk.green(0)}`);

  if (criticalThreats.length > 0) {
    console.log('\n' + chalk.bold.underline('Critical Threats Detected'));
    for (const threat of criticalThreats) {
      console.log(`• [${threat.source}] ${chalk.bold(threat.skill)} contains: ${chalk.red(threat.threats.join(', '))}`);
    }
  } else {
    console.log('\n' + chalk.green('✓ No critical threats detected across the ecosystem.'));
  }
};
