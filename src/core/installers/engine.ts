import { fetchGithubSkill } from './git.js';
import { resolveLocalSkill } from './local.js';
import { validateSkill } from '../validators/metadata.js';
import { detectAgents } from '../agents/index.js';
import { fsUtils } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export const installSkill = async (source: string, isLocal: boolean, agentsToInstall?: string[]) => {
  let skillPath = '';
  
  try {
    logger.startSpinner('Resolving skill source...');
    if (isLocal) {
      skillPath = await resolveLocalSkill(source);
    } else {
      skillPath = await fetchGithubSkill(source);
    }
    logger.succeedSpinner('Skill source resolved.');

    logger.startSpinner('Validating skill...');
    const normalized = await validateSkill(skillPath, isLocal, !isLocal);
    
    if (normalized.compatibilityMode) {
      logger.warn('Legacy skill detected');
      logger.success('Metadata inferred');
      logger.success('Compatibility mode enabled');
    } else {
      logger.succeedSpinner(`Validated skill: ${normalized.normalizedName} (v${normalized.normalizedVersion})`);
    }

    logger.startSpinner('Detecting installed agents...');
    const allAgents = await detectAgents();
    let targetAgents = allAgents;

    if (agentsToInstall && agentsToInstall.length > 0) {
      targetAgents = allAgents.filter(a => agentsToInstall.includes(a.id));
    }

    if (targetAgents.length === 0) {
      logger.failSpinner('No supported AI agents detected on this machine.');
      return;
    }
    logger.succeedSpinner(`Detected ${targetAgents.length} compatible agents.`);

    logger.startSpinner('Installing skill into agents...');
    const rollbackPaths: string[] = [];

    try {
      for (const agent of targetAgents) {
        const destPath = path.join(agent.globalPath, normalized.normalizedName);
        
        // IDEMPOTENCY: Remove existing installation before re-installing
        if (await fsUtils.exists(destPath)) {
          await fsUtils.removeDir(destPath);
        }

        if (normalized.installType === 'symlink') {
          await fsUtils.createSymlink(skillPath, destPath);
          logger.info(`Symlinked to ${agent.name} (${destPath})`);
        } else {
          await fsUtils.copyDir(skillPath, destPath);
          logger.info(`Copied to ${agent.name} (${destPath})`);
        }
        rollbackPaths.push(destPath);
      }
      logger.succeedSpinner('Installation complete!');
      logger.success(`Successfully installed '${normalized.normalizedName}' into ${targetAgents.map(a => a.name).join(', ')}.`);
    } catch (installError: any) {
      logger.failSpinner(`Installation failed during agent loop: ${installError.message}`);
      logger.startSpinner('Rolling back partial installation...');
      for (const rbPath of rollbackPaths) {
        await fsUtils.removeDir(rbPath);
      }
      logger.succeedSpinner('Rollback complete. System restored.');
      throw installError;
    }

  } catch (error: any) {
    logger.failSpinner(`Installation failed: ${error.message}`);
  } finally {
    // Clean up temp dir if it was a github clone
    if (!isLocal && skillPath.includes('nos-skill-')) {
      await fsUtils.removeDir(skillPath);
    }
  }
};
