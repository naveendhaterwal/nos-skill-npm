import path from 'path';
import { fsUtils } from '../utils/fs.js';

export const resolveLocalSkill = async (input: string): Promise<string> => {
  const absolutePath = path.resolve(process.cwd(), input);
  if (!(await fsUtils.exists(absolutePath))) {
    throw new Error(`Local path does not exist: ${absolutePath}`);
  }
  return absolutePath;
};
