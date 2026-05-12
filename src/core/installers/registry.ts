import { fsUtils } from '../utils/fs.js';
import path from 'path';
import fs from 'fs-extra';

/**
 * Resolves an official Nosana skill from the embedded registry within the npm package.
 * Supported format: nos/skill-name
 */
export const resolveOfficialRegistrySkill = async (source: string): Promise<string> => {
  const packageRoot = fsUtils.getPackageRoot();
  
  // Strip 'nos/' prefix if present
  const skillName = source.startsWith('nos/') ? source.substring(4) : source;
  
  const possiblePaths = [
    path.join(packageRoot, 'registry', 'nos', 'apps', skillName),
    path.join(packageRoot, 'registry', 'nos', 'engines', skillName)
  ];

  for (const p of possiblePaths) {
    if (await fs.pathExists(p)) {
      return p;
    }
  }

  throw new Error(`Official skill '${skillName}' not found in registry (apps or engines).`);
};
