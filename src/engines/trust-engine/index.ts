import { TrustState } from '../../schemas/types.js';
import { fsUtils } from '../../core/utils/fs.js';
import path from 'path';

/**
 * Validates the physical integrity of a skill directory.
 * - structured: Has valid metadata.json + SKILL.md
 * - compatibility: Has SKILL.md but no metadata.json
 * - recoverable: Has metadata.json but missing SKILL.md, or malformed JSON that we can regenerate.
 * - corrupted: Completely missing required files or totally unreadable directory.
 */
export const determinePhysicalState = async (skillDir: string): Promise<TrustState> => {
  const hasMetadata = await fsUtils.exists(path.join(skillDir, 'metadata.json'));
  const hasSkillMd = await fsUtils.exists(path.join(skillDir, 'SKILL.md'));

  if (!hasSkillMd && !hasMetadata) {
    return 'corrupted';
  }

  if (hasMetadata && !hasSkillMd) {
    return 'recoverable';
  }

  if (hasMetadata && hasSkillMd) {
    // Try parse metadata
    try {
      await fsUtils.readJson(path.join(skillDir, 'metadata.json'));
      return 'structured';
    } catch {
      return 'recoverable'; // JSON is broken, but we can fall back to compatibility inference
    }
  }

  return 'compatibility'; // Has SKILL.md only
};
