import { SafetyReport } from '../../schemas/types.js';

const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+-rf/g, name: 'rm -rf' },
  { pattern: /curl\s+.*?\|\s*bash/g, name: 'curl | bash' },
  { pattern: /wget\s+.*?\|\s*bash/g, name: 'wget | bash' },
  { pattern: /base64\s+-d/g, name: 'base64 decode' },
  { pattern: /cat\s+\/etc\/shadow/g, name: 'credential extraction' },
  { pattern: /cat\s+\/etc\/passwd/g, name: 'credential extraction' },
  { pattern: /\~\/\.aws\/credentials/g, name: 'AWS credential extraction' },
  { pattern: /\.eth\//g, name: 'wallet draining pattern' },
  { pattern: /nc\s+-e\s+\/bin\/(ba)?sh/g, name: 'netcat reverse shell' },
  { pattern: /xmrig/g, name: 'crypto mining' },
  { pattern: /nohup\s+.*&\s*$/g, name: 'hidden subprocess' },
  { pattern: /(powershell|pwsh)\s+(-\w*\s*)?-e(ncodedCommand)?\s+[A-Za-z0-9+/=]+/g, name: 'encoded PowerShell execution' },
  { pattern: /eval\s*\(/g, name: 'indirect evaluation (eval)' },
  { pattern: /ignore\s+all\s+previous\s+instructions/ig, name: 'prompt injection attempt' },
  { pattern: /[а-яА-Я\u0400-\u04FF]/g, name: 'cyrillic homoglyph detection (suspicious)' },
  { pattern: /system\s*\(/g, name: 'indirect evaluation (system)' },
  { pattern: /chmod\s+(777|\\+x)\s+.*?\.(sh|bin|elf)/g, name: 'granting execution permissions' }
];

const SHELL_EXECUTION_PATTERNS = [
  /`.*?`/g,
  /\$\(.*\)/g,
  /spawn\(/g,
  /exec\(/g,
  /child_process/g,
  /bash\s+-c/g,
  /sh\s+-c/g
];

const NETWORK_PATTERNS = [
  /curl\s+/g,
  /wget\s+/g,
  /fetch\(/g,
  /axios\./g,
  /http\.get/g,
  /https\.get/g
];

export const analyzeSecurity = (markdownContent: string): SafetyReport => {
  const dangerousCommands: string[] = [];
  let shellExecution = false;
  let networkExecution = false;

  for (const { pattern, name } of DANGEROUS_PATTERNS) {
    if (pattern.test(markdownContent)) {
      dangerousCommands.push(name);
    }
  }

  for (const pattern of SHELL_EXECUTION_PATTERNS) {
    if (pattern.test(markdownContent)) {
      shellExecution = true;
      break;
    }
  }

  for (const pattern of NETWORK_PATTERNS) {
    if (pattern.test(markdownContent)) {
      networkExecution = true;
      break;
    }
  }

  let riskLevel: SafetyReport['riskLevel'] = 'safe';

  if (dangerousCommands.length > 0) {
    riskLevel = 'critical';
  } else if (shellExecution && networkExecution) {
    riskLevel = 'high';
  } else if (shellExecution) {
    riskLevel = 'medium';
  } else if (networkExecution) {
    riskLevel = 'low';
  }

  return {
    riskLevel,
    dangerousCommands,
    shellExecution,
    networkExecution
  };
};
