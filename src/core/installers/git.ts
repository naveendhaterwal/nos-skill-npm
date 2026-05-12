import { simpleGit } from 'simple-git';
import path from 'path';
import os from 'os';
import { fsUtils } from '../utils/fs.js';

export const parseGithubRepo = (input: string) => {
  // Input formats:
  // "owner/repo" -> https://github.com/owner/repo.git
  // "github:owner/repo" -> https://github.com/owner/repo.git
  // "https://github.com/owner/repo.git"
  let repoUrl = input;
  let repoName = 'unknown-skill';

  if (input.startsWith('github:')) {
    const parts = input.substring(7);
    repoUrl = `https://github.com/${parts}.git`;
    repoName = parts.split('/')[1] || parts;
  } else if (!input.startsWith('http') && input.includes('/')) {
    repoUrl = `https://github.com/${input}.git`;
    repoName = input.split('/')[1];
  } else if (input.startsWith('http')) {
    const parts = input.split('/');
    repoName = parts[parts.length - 1].replace('.git', '');
  }

  return { repoUrl, repoName };
};

export const fetchGithubSkill = async (input: string): Promise<string> => {
  const { repoUrl, repoName } = parseGithubRepo(input);
  const tempDir = path.join(os.tmpdir(), `nos-skill-${repoName}-${Date.now()}`);
  
  await fsUtils.ensureDir(tempDir);
  const git = simpleGit();
  
  try {
    await git.clone(repoUrl, tempDir, ['--depth', '1']);
    // Clean up .git folder so we don't copy it over as part of the skill
    await fsUtils.removeDir(path.join(tempDir, '.git'));
    return tempDir;
  } catch (error: any) {
    await fsUtils.removeDir(tempDir);
    throw new Error(`Failed to clone repository ${repoUrl}: ${error.message}`);
  }
};
