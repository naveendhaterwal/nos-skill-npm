import { installSkill } from '../core/installers/engine.js';
import { resolveOfficialRegistrySkill } from '../core/installers/registry.js';
import { logger } from '../core/utils/logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addAllCommand = async (namespace: string = 'nos', options: { yes?: boolean } = {}) => {
  // Load the registry index for the given namespace
  const indexPath = join(__dirname, '../../registry', namespace, 'index.json');
  
  let skills: Array<{ name: string; description: string }>;
  try {
    const raw = readFileSync(indexPath, 'utf-8');
    const parsed = JSON.parse(raw);
    skills = parsed.skills ?? [];
  } catch {
    logger.error(`Could not find registry for namespace "${namespace}". Available: nos`);
    process.exit(1);
  }

  if (skills.length === 0) {
    logger.error(`No skills found in namespace "${namespace}".`);
    process.exit(1);
  }

  logger.info(`Installing all ${skills.length} skills from ${namespace} namespace...\n`);

  let installed = 0;
  let failed = 0;

  for (const skill of skills) {
    const source = `${namespace}/${skill.name}`;
    logger.info(`→ Installing ${source}...`);
    try {
      const officialPath = await resolveOfficialRegistrySkill(source);
      await installSkill(officialPath, true);
      logger.success(`  ✓ ${source}`);
      installed++;
    } catch (e: any) {
      logger.error(`  ✗ ${source}: ${e.message}`);
      failed++;
    }
  }

  logger.info(`\nDone. ${installed} installed, ${failed} failed.`);
};
