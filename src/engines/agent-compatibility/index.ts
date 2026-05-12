import { AgentCompatibility } from '../../schemas/types.js';

export const analyzeAgentCompatibility = (markdownContent: string): AgentCompatibility => {
  // Check for specific markers or terminology in the markdown
  const lowerContent = markdownContent.toLowerCase();

  return {
    cursor: lowerContent.includes('.cursorrules') || lowerContent.includes('@cursor'),
    claude: lowerContent.includes('claude') || lowerContent.includes('mcp server'),
    codex: lowerContent.includes('codex'),
    windsurf: lowerContent.includes('windsurf') || lowerContent.includes('.windsurfrules'),
    goose: lowerContent.includes('goose'),
    antigravity: lowerContent.includes('<antigravity>') || lowerContent.includes('antigravity')
  };
};
