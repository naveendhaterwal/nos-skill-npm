import { logger } from '../core/utils/logger.js';
import { fsUtils } from '../core/utils/fs.js';
import path from 'path';
import chalk from 'chalk';
import { extractDependencies } from '../engines/dependency-graph/index.js';
import { detectAgents } from '../core/agents/index.js';
import { globalQueue } from '../workers/index.js';

export const graphCommand = async (targetSkill?: string) => {
  logger.startSpinner('Building dependency graph from Nosana registry...');
  
  const registryDir = path.resolve(process.cwd(), 'registry/nos');
  const appDirs = (await fsUtils.getDirectories(path.join(registryDir, 'apps'))).map(d => path.join('apps', d));
  const engineDirs = (await fsUtils.getDirectories(path.join(registryDir, 'engines'))).map(d => path.join('engines', d));
  const skills = [...appDirs, ...engineDirs];
  
  const graph = new Map<string, string[]>();
  const tasks: Promise<void>[] = [];

  for (const skillSubPath of skills) {
    tasks.push(globalQueue.enqueue(async () => {
      const skillName = path.basename(skillSubPath);
      const skillPath = path.join(registryDir, skillSubPath);
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      if (await fsUtils.exists(skillMdPath)) {
        const markdown = await fsUtils.readFile(skillMdPath);
        const deps = extractDependencies(markdown);
        graph.set(skillName, deps);
      }
    }));
  }

  await Promise.all(tasks);
  logger.stopSpinner();

  console.log('\n' + chalk.bold.magenta(' 🕸️  SKILL DEPENDENCY GRAPH '));
  console.log('='.repeat(50));

  if (targetSkill) {
    if (!graph.has(targetSkill)) {
      console.log(chalk.red(`Skill '${targetSkill}' not found in installed skills.`));
      return;
    }
    const deps = graph.get(targetSkill)!;
    console.log(`${chalk.bold(targetSkill)} depends on:`);
    if (deps.length === 0) {
      console.log(chalk.gray('  (None)'));
    } else {
      deps.forEach(d => console.log(`  └─ ${chalk.cyan(d)}`));
    }
  } else {
    // Print all
    for (const [skill, deps] of graph.entries()) {
      if (deps.length > 0) {
        console.log(`${chalk.bold(skill)}`);
        deps.forEach(d => console.log(`  └─ ${chalk.cyan(d)}`));
      }
    }
    
    const countWithDeps = Array.from(graph.values()).filter(d => d.length > 0).length;
    if (countWithDeps === 0) {
      console.log(chalk.gray('No dependencies found between registry skills.'));
    }
  }
  console.log('');
};
