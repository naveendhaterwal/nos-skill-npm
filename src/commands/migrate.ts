import path from 'path';
import chalk from 'chalk';
import { fsUtils } from '../core/utils/fs.js';
import { logger } from '../core/utils/logger.js';
import { inferMetadata } from '../core/validators/inferMetadata.js';

export const migrateCommand = async (skillDir: string) => {
  const targetPath = path.resolve(process.cwd(), skillDir);
  
  logger.startSpinner(`Migrating skill at ${targetPath}...`);

  if (!(await fsUtils.exists(targetPath))) {
    logger.failSpinner(`Directory does not exist: ${targetPath}`);
    return;
  }

  const metadataPath = path.join(targetPath, 'metadata.json');
  if (await fsUtils.exists(metadataPath)) {
    logger.failSpinner(`Skill already has metadata.json. No migration needed.`);
    return;
  }

  const skillMdPath = path.join(targetPath, 'SKILL.md');
  if (!(await fsUtils.exists(skillMdPath))) {
    logger.failSpinner(`Legacy skill must have a SKILL.md to be migrated.`);
    return;
  }

  // Infer metadata
  const inferred = inferMetadata(targetPath);
  delete inferred.compatibilityMode; // Remove the internal runtime flag before writing

  try {
    await fsUtils.writeFile(metadataPath, JSON.stringify(inferred, null, 2));
    
    // Create recommended folders
    await fsUtils.ensureDir(path.join(targetPath, 'examples'));
    await fsUtils.ensureDir(path.join(targetPath, 'workflows'));
    
    logger.succeedSpinner(`Migration complete!`);
    logger.success(`Generated metadata.json for ${chalk.bold(inferred.name)}.`);
    logger.success(`Created examples/ and workflows/ directories.`);
    logger.info(`Skill is now fully structured. You should update metadata.json with actual values.`);
  } catch (e: any) {
    logger.failSpinner(`Migration failed: ${e.message}`);
  }
};
