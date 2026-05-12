import { detectAgents } from '../core/agents/index.js';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import path from 'path';
import { validateSkill } from '../core/validators/metadata.js';
import fs from 'fs';

export const exportCommand = async () => {
  logger.startSpinner('Compiling installed skills map...');
  const agents = await detectAgents();
  
  const processedSkills = new Set<string>();
  let skillCount = 0;

  const outputPath = path.resolve(process.cwd(), 'nos-skill-export.yaml');
  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

  // Write YAML header
  writeStream.write(`version: "1.0"\n`);
  writeStream.write(`exportedAt: "${new Date().toISOString()}"\n`);
  writeStream.write(`skills:\n`);

  for (const agent of agents) {
    const skills = await fsUtils.getDirectories(agent.globalPath);
    for (const skill of skills) {
      if (processedSkills.has(skill)) continue;

      const skillPath = path.join(agent.globalPath, skill);
      try {
        const isSymlink = await fsUtils.isSymlink(skillPath);
        const normalized = await validateSkill(skillPath, isSymlink, false);
        
        // Stream chunk to disk directly, bypassing RAM
        writeStream.write(`  - name: "${normalized.normalizedName}"\n`);
        writeStream.write(`    version: "${normalized.normalizedVersion}"\n`);
        writeStream.write(`    compatibilityMode: ${normalized.compatibilityMode}\n`);
        writeStream.write(`    trustLevel: "${normalized.trustLevel}"\n`);
        writeStream.write(`    hash: "${normalized.hash}"\n`);

        processedSkills.add(skill);
        skillCount++;
      } catch {
        // ignore invalid
      }
    }
  }

  writeStream.end();
  
  await new Promise<void>((resolve) => writeStream.on('finish', () => resolve()));

  logger.succeedSpinner('Compilation complete.');

  if (skillCount === 0) {
    logger.info('No installed skills to export.');
    return;
  }

  logger.success(`Exported ${skillCount} skills to ${outputPath}`);
};
