import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { listCommand } from './commands/list.js';
import { installedCommand } from './commands/installed.js';
import { doctorCommand } from './commands/doctor.js';
import { syncCommand } from './commands/sync.js';
import { migrateCommand } from './commands/migrate.js';
import { searchCommand } from './commands/search.js';
import { exportCommand } from './commands/export.js';
import { updateCommand } from './commands/update.js';
import { inspectCommand } from './commands/inspect.js';
import { auditCommand } from './commands/audit.js';
import { graphCommand } from './commands/graph.js';
import { repairCommand } from './commands/repair.js';
import { publishCommand } from './commands/publish.js';
import { initCommand } from './commands/init.js';
import { logger } from './core/utils/logger.js';

const program = new Command();

program
  .name('nos-skill')
  .description('Universal AI Skill Operating System')
  .version('2.0.0');

// Core Package Management
program
  .command('add <source>')
  .description('Install a skill from a GitHub repo, remote URL, or local path.')
  .action(async (source) => {
    try { await addCommand(source); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('remove <skill>')
  .description('Remove an installed skill from all agents.')
  .action(async (skill) => {
    try { await removeCommand(skill); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('update')
  .description('Update eligible skills against the registry.')
  .action(async () => {
    try { await updateCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('init <dir>')
  .description('Scaffold a new structured AI skill.')
  .option('-t, --type <type>', 'Template type: basic, minimal, workflow, operational, nosana-app, nosana-engine', 'basic')
  .action(async (dir, options) => {
    try { await initCommand(dir, options); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('publish <path>')
  .description('Validate and package a skill for registry publishing.')
  .action(async (path) => {
    try { await publishCommand(path); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

// Discovery & State
program
  .command('list')
  .description('List all official available skills in the Nosana registry.')
  .action(async () => {
    try { await listCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('installed')
  .description('List all skills physically installed in your AI agents.')
  .option('-a, --all', 'Show all skills including legacy and compatibility modes.')
  .action(async (options) => {
    try { await installedCommand(options); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('search <query>')
  .description('Semantic search the skill registry.')
  .action(async (query) => {
    try { await searchCommand(query); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('export')
  .description('Export all installed skills to JSON/YAML.')
  .action(async () => {
    try { await exportCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

// Intelligence & Operations
program
  .command('inspect <skill>')
  .description('Generate a deep AI intelligence report for a skill.')
  .action(async (skill) => {
    try { await inspectCommand(skill); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('audit')
  .description('Run a security and architecture audit across all installed skills.')
  .option('-r, --registry', 'Audit the local Nosana registry instead of installed skills.')
  .action(async (options) => {
    try { await auditCommand(options); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('graph [skill]')
  .description('Visualize dependency graph between skills.')
  .action(async (skill) => {
    try { await graphCommand(skill); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('doctor')
  .description('Run system diagnostics and detect skill corruption.')
  .action(async () => {
    try { await doctorCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('repair')
  .description('Automatically fix recoverable or corrupted skills.')
  .action(async () => {
    try { await repairCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('migrate <skill-path>')
  .description('Migrate a legacy skill to a structured metadata format.')
  .action(async (skillPath) => {
    try { await migrateCommand(skillPath); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

program
  .command('sync')
  .description('Synchronize all installed skills across all detected agents.')
  .action(async () => {
    try { await syncCommand(); } catch (e: any) { logger.error(e.message); process.exit(1); }
  });

// Print logo if no args provided
if (process.argv.length === 2) {
  logger.printLogo();
  program.help();
}

program.parse(process.argv);
