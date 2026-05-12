export type TrustLevel = 'verified' | 'community' | 'legacy' | 'unknown';

export interface SkillMetadata {
  name: string;
  namespace?: string;
  version: string;
  description: string;
  author: string;
  tags: string[];
  agentCompatibility: string[];
  entry: string;
  compatibilityMode?: boolean; // new field for legacy inferred skills
}

export interface NormalizedSkill {
  normalizedName: string;
  normalizedVersion: string;
  namespace: string;
  compatibilityMode: boolean;
  sourceType: 'remote' | 'local';
  installType: 'symlink' | 'copy';
  metadata: SkillMetadata;
  paths: {
    baseDir: string;
    entryFile: string;
    metadataFile: string;
  };
  hash: string;
  trustLevel: TrustLevel;
}

export interface AgentConfig {
  id: string;
  name: string;
  globalPath: string;
  checkExists: () => Promise<boolean>;
}

export interface InstalledSkill {
  id: string;
  normalized: NormalizedSkill;
  path: string;
}
