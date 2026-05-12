import { installSkill } from '../core/installers/engine.js';
import inquirer from 'inquirer';

export const addCommand = async (source: string) => {
  // Determine if source is likely local path or remote
  const isLocal = source.startsWith('.') || source.startsWith('/') || source.startsWith('~');

  // We could prompt for global/project here if needed, but the prompt asked to build like skill.fish
  // For V1, we will install to all global agent paths as detected.
  
  const { installScope } = await inquirer.prompt([
    {
      type: 'list',
      name: 'installScope',
      message: 'Where would you like to install this skill?',
      choices: [
        { name: 'Global (All Agents)', value: 'global' },
        { name: 'Project (Not implemented yet)', value: 'project', disabled: true }
      ]
    }
  ]);

  if (installScope === 'global') {
    await installSkill(source, isLocal);
  }
};
