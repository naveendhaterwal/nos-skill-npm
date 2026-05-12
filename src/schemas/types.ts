export interface AgentCompatibility {
  cursor: boolean;
  claude: boolean;
  codex: boolean;
  windsurf: boolean;
  goose: boolean;
  antigravity: boolean;
}

export interface SafetyReport {
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  dangerousCommands: string[];
  shellExecution: boolean;
  networkExecution: boolean;
}

export interface QualityReport {
  hasExamples: boolean;
  hasSchemas: boolean;
  hasTests: boolean;
  deterministicOutputs: boolean;
}

export interface WorkflowReport {
  hasStateMachine: boolean;
  workflowType: string;
}

export type TrustState = 'structured' | 'compatibility' | 'recoverable' | 'unsafe' | 'corrupted';

export interface IntelligenceReport {
  skillId: string;
  trustScore: number;
  complexity: 'simple' | 'moderate' | 'advanced' | 'dangerous';
  compatibility: AgentCompatibility;
  safety: SafetyReport;
  quality: QualityReport;
  workflow: WorkflowReport;
  dependencies: string[];
  recommendations: string[];
  trustState: TrustState;
}
