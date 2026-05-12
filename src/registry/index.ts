import path from 'path';
import { fileURLToPath } from 'url';
import { fsUtils } from '../core/utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RegistrySkill {
  name: string;
  description: string;
  url: string;
  tags: string[];
}

export interface RegistryData {
  skills: RegistrySkill[];
}

export const getRegistry = async (): Promise<RegistrySkill[]> => {
  const registryPath = path.join(__dirname, 'default-registry.json');
  try {
    const data = await fsUtils.readJson<RegistryData>(registryPath);
    return data.skills;
  } catch {
    return [];
  }
};
