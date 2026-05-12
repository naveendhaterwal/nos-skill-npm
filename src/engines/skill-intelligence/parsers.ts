import { QualityReport, WorkflowReport, TrustState } from '../../schemas/types.js';

export const analyzeQuality = (markdownContent: string): QualityReport => {
  const lowerContent = markdownContent.toLowerCase();
  
  return {
    hasExamples: lowerContent.includes('example') || lowerContent.includes('usage:'),
    hasSchemas: lowerContent.includes('```json') || lowerContent.includes('schema'),
    hasTests: lowerContent.includes('test') || lowerContent.includes('verify'),
    deterministicOutputs: lowerContent.includes('always output') || lowerContent.includes('do not deviate') || lowerContent.includes('deterministic')
  };
};

export const analyzeWorkflow = (markdownContent: string): WorkflowReport => {
  const lowerContent = markdownContent.toLowerCase();
  const hasStateMachine = lowerContent.includes('step 1') || lowerContent.includes('phase 1') || lowerContent.includes('state machine');
  
  let workflowType = 'unstructured';
  if (lowerContent.includes('pipeline')) {
    workflowType = 'pipeline';
  } else if (lowerContent.includes('agentic loop')) {
    workflowType = 'agentic-loop';
  } else if (hasStateMachine) {
    workflowType = 'state-machine';
  }

  return {
    hasStateMachine,
    workflowType
  };
};

export const calculateComplexity = (markdownContent: string): 'simple' | 'moderate' | 'advanced' | 'dangerous' => {
  const length = markdownContent.length;
  if (length > 10000) return 'advanced';
  if (length > 3000) return 'moderate';
  return 'simple';
};
