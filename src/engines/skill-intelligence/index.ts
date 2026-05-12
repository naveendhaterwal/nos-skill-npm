import { IntelligenceReport, TrustState } from '../../schemas/types.js';
import { analyzeSecurity } from '../security-audit/index.js';
import { analyzeAgentCompatibility } from '../agent-compatibility/index.js';
import { extractDependencies } from '../dependency-graph/index.js';
import { analyzeQuality, analyzeWorkflow, calculateComplexity } from './parsers.js';

export const buildIntelligenceReport = (
  skillId: string,
  markdownContent: string,
  isStructured: boolean
): IntelligenceReport => {
  
  const safety = analyzeSecurity(markdownContent);
  const compatibility = analyzeAgentCompatibility(markdownContent);
  const quality = analyzeQuality(markdownContent);
  const workflow = analyzeWorkflow(markdownContent);
  const dependencies = extractDependencies(markdownContent);
  let complexity = calculateComplexity(markdownContent);

  if (safety.riskLevel === 'critical' || safety.riskLevel === 'high') {
    complexity = 'dangerous';
  }

  // Calculate Trust Score (0-100)
  let trustScore = 50; // baseline
  if (isStructured) trustScore += 20;
  if (safety.riskLevel === 'safe') trustScore += 20;
  if (safety.riskLevel === 'critical') trustScore -= 50;
  if (quality.hasExamples) trustScore += 5;
  if (quality.hasSchemas) trustScore += 5;

  trustScore = Math.max(0, Math.min(100, trustScore));

  const recommendations: string[] = [];
  if (!quality.hasExamples) recommendations.push('Add usage examples.');
  if (safety.riskLevel !== 'safe') recommendations.push(`Security warning: ${safety.riskLevel} risk level.`);

  // Determine trust state
  let trustState: TrustState = 'compatibility';
  if (isStructured) trustState = 'structured';
  if (safety.riskLevel === 'critical' || safety.riskLevel === 'high') trustState = 'unsafe';

  return {
    skillId,
    trustScore,
    complexity,
    compatibility,
    safety,
    quality,
    workflow,
    dependencies,
    recommendations,
    trustState
  };
};
