import { defaultRegistry } from './default-registry.js';
import { fsUtils } from '../utils/fs.js';
import path from 'path';

export interface RegistrySkill {
  name: string;
  description: string;
  url?: string;
  tags: string[];
  skillType?: 'app' | 'engine';
  namespace?: string;
  version?: string;
}

export const getRegistry = async (): Promise<RegistrySkill[]> => {
  const registryPath = path.resolve(fsUtils.getPackageRoot(), 'registry/nos/index.json');
  
  try {
    if (await fsUtils.exists(registryPath)) {
      const data = await fsUtils.readJson<{ skills: RegistrySkill[] }>(registryPath);
      return data.skills;
    }
  } catch (e) {
    // fallback to default
  }
  
  return defaultRegistry.skills;
};
