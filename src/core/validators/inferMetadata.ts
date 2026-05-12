import path from 'path';
import { SkillMetadata } from '../types/index.js';

export const inferMetadata = (skillDir: string): SkillMetadata => {
  const folderName = path.basename(skillDir);
  return {
    name: folderName,
    version: '0.1.0',
    description: 'Legacy compatibility skill',
    author: 'unknown',
    tags: [],
    agentCompatibility: [],
    entry: 'SKILL.md',
    compatibilityMode: true
  };
};
