import crypto from 'crypto';
import path from 'path';
import { fsUtils } from './fs.js';

/**
 * Computes a deterministic SHA256 hash for a skill directory.
 * We hash the contents of SKILL.md and metadata.json (if it exists).
 */
export const hashSkillDirectory = async (skillDir: string): Promise<string> => {
  const hash = crypto.createHash('sha256');
  
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (await fsUtils.exists(skillMdPath)) {
    const content = await fsUtils.readFile(skillMdPath);
    hash.update(content);
  }

  const metadataPath = path.join(skillDir, 'metadata.json');
  if (await fsUtils.exists(metadataPath)) {
    const content = await fsUtils.readFile(metadataPath);
    hash.update(content);
  }

  return hash.digest('hex');
};
