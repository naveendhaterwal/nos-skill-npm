import { installSkill } from '../core/installers/engine.js';
import { resolveOfficialRegistrySkill } from '../core/installers/registry.js';
import inquirer from 'inquirer';

export const addCommand = async (source: string, options: { yes?: boolean } = {}) => {
  // Official Nosana skills use the 'nos/' namespace
  const isOfficial = source.startsWith('nos/');
  
  // Determine if source is likely local path or remote
  const isLocal = isOfficial || source.startsWith('.') || source.startsWith('/') || source.startsWith('~');

  let installScope = 'global';

  if (!options.yes) {
    const { scope } = await inquirer.prompt([
      {
        type: 'list',
        name: 'scope',
        message: 'Where would you like to install this skill?',
        choices: [
          { name: 'Global (All Agents)', value: 'global' },
          { name: 'Project (Not implemented yet)', value: 'project', disabled: true }
        ]
      }
    ]);
    installScope = scope;
  }

  if (installScope === 'global') {
    if (isOfficial) {
      const officialPath = await resolveOfficialRegistrySkill(source);
      await installSkill(officialPath, true); // Treat as local since it's embedded
    } else {
      await installSkill(source, isLocal);
    }
  }
};
