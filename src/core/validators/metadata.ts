import { z } from 'zod';
import { SkillMetadata, NormalizedSkill } from '../types/index.js';
import path from 'path';
import { fsUtils } from '../utils/fs.js';
import { inferMetadata } from './inferMetadata.js';
import { normalizeSkill } from './normalizeSkill.js';

export const metadataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  namespace: z.string().optional().default('global'),
  version: z.string().min(1, 'Version is required'),
  description: z.string().optional().default(''),
  author: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  agentCompatibility: z.array(z.string()).optional().default([]),
  entry: z.string().default('SKILL.md'),
  compatibilityMode: z.boolean().optional()
});

export const validateSkill = async (
  skillPath: string,
  isSymlink: boolean,
  isRemote: boolean
): Promise<NormalizedSkill> => {
  const metadataPath = path.join(skillPath, 'metadata.json');
  let metadata: SkillMetadata;

  if (await fsUtils.exists(metadataPath)) {
    // LEVEL 1 — STRUCTURED MODE
    const rawMetadata = await fsUtils.readJson<unknown>(metadataPath);
    const parsed = metadataSchema.safeParse(rawMetadata);

    if (!parsed.success) {
      throw new Error(`Invalid metadata.json: ${parsed.error.errors.map(e => e.message).join(', ')}`);
    }
    metadata = parsed.data as SkillMetadata;
  } else {
    // LEVEL 2 — LEGACY COMPATIBILITY MODE
    const legacyEntryPath = path.join(skillPath, 'SKILL.md');
    if (!(await fsUtils.exists(legacyEntryPath))) {
      throw new Error('Skill must contain at least SKILL.md');
    }
    metadata = inferMetadata(skillPath);
  }

  const entryPath = path.join(skillPath, metadata.entry);
  if (!(await fsUtils.exists(entryPath))) {
    throw new Error(`Entry file '${metadata.entry}' not found in skill directory.`);
  }

  return await normalizeSkill(skillPath, metadata, isSymlink, isRemote);
};
