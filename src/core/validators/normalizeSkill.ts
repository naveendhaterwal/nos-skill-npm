import path from 'path';
import { NormalizedSkill, SkillMetadata } from '../types/index.js';
import { hashSkillDirectory } from '../utils/hash.js';
import { fsUtils } from '../utils/fs.js';

export const normalizeSkill = async (
  skillDir: string,
  metadata: SkillMetadata,
  isSymlink: boolean,
  isRemote: boolean
): Promise<NormalizedSkill> => {
  const hash = await hashSkillDirectory(skillDir);
  
  const isCompatibility = metadata.compatibilityMode === true;

  // Determine trust level
  let trustLevel: NormalizedSkill['trustLevel'] = 'unknown';
  if (isCompatibility) {
    trustLevel = 'legacy';
  } else {
    // For now we assume if it has metadata.json it's at least community
    trustLevel = 'community';
    // We'll upgrade this to verified if it matches our registry later.
  }

  return {
    normalizedName: metadata.name.replace(/\s+/g, '-').toLowerCase(),
    normalizedVersion: metadata.version,
    namespace: metadata.namespace || 'global',
    compatibilityMode: isCompatibility,
    sourceType: isRemote ? 'remote' : 'local',
    installType: isSymlink ? 'symlink' : 'copy',
    metadata,
    paths: {
      baseDir: skillDir,
      entryFile: path.join(skillDir, metadata.entry),
      metadataFile: path.join(skillDir, 'metadata.json')
    },
    hash,
    trustLevel
  };
};
