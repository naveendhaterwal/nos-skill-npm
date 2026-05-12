import chalk from 'chalk';
import ora, { Ora } from 'ora';

const args = process.argv.slice(2);
const isSilent = args.includes('--silent');
const isJson = args.includes('--json');
const isCI = process.env.CI === 'true' || args.includes('--no-tty') || isSilent || isJson;

// If we are in JSON mode, we shouldn't output any chalk or spinner data to stdout
export const logger = {
  spinner: null as Ora | null,

  isSilent,
  isJson,

  startSpinner(text: string) {
    if (this.isSilent || this.isJson) return;
    if (isCI) {
      console.log(`[INFO] ${text}`);
      return;
    }
    if (this.spinner) {
      this.spinner.text = text;
    } else {
      this.spinner = ora(text).start();
    }
  },

  succeedSpinner(text?: string) {
    if (this.isSilent || this.isJson) return;
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    } else if (text) {
      console.log(chalk.green('✓ ') + text);
    }
  },

  failSpinner(text?: string) {
    if (this.isSilent || this.isJson) return;
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    } else if (text) {
      console.log(chalk.red('✖ ') + text);
    }
  },

  stopSpinner() {
    if (this.isSilent || this.isJson) return;
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  },

  info(text: string) {
    if (this.isSilent || this.isJson) return;
    this.stopSpinner();
    console.log(chalk.blue('ℹ ') + text);
  },

  success(text: string) {
    if (this.isSilent || this.isJson) return;
    this.stopSpinner();
    console.log(chalk.green('✓ ') + text);
  },

  warn(text: string) {
    if (this.isSilent || this.isJson) return;
    this.stopSpinner();
    console.log(chalk.yellow('⚠ ') + text);
  },

  error(text: string) {
    if (this.isSilent || this.isJson) return;
    this.stopSpinner();
    console.log(chalk.red('✖ ') + text);
  },

  log(text: string) {
    if (this.isSilent || this.isJson) return;
    this.stopSpinner();
    console.log(text);
  },

  json(data: any) {
    if (this.isSilent) return;
    console.log(JSON.stringify(data, null, 2));
  },

  printLogo() {
    if (this.isSilent || this.isJson) return;
    const logo = `
   ██████╗  ██████╗  ███████╗      ███████╗██╗  ██╗██╗██╗     ██╗     
   ██╔══██╗██╔═══██╗██╔════╝      ██╔════╝██║ ██╔╝██║██║     ██║     
   ██║  ██║██║   ██║███████╗█████╗███████╗█████╔╝ ██║██║     ██║     
   ██║  ██║██║   ██║╚════██║╚════╝╚════██║██╔═██╗ ██║██║     ██║     
   ██████╔╝╚██████╔╝███████║      ███████║██║  ██╗██║███████╗███████╗
   ╚═════╝  ╚═════╝ ╚══════╝      ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
    `;
    console.log(chalk.cyan(logo));
    console.log(chalk.dim('   Universal AI Skill Installer — v1.0.0\n'));
  }
};
