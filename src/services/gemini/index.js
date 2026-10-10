import { orchestrator } from './orchestrator';

export {
  getGeminiApiKey,
  setGeminiApiKey,
  clearGeminiApiKey,
  testGeminiConnection,
} from './geminiClient';

export { orchestrator };

// Convenient direct helpers
export const generateInterviewQuestion = (params) => orchestrator.generateInterviewQuestion(params);
export const generateInterviewScorecard = (params) => orchestrator.generateInterviewScorecard(params);
export const rewriteResumeBullet = (params) => orchestrator.rewriteResumeBullet(params);
export const auditResumeWithGemini = (params) => orchestrator.auditResume(params);
export const reviewCodeWithGemini = (params) => orchestrator.reviewCode(params);
export const generateCodeHintWithGemini = (params) => orchestrator.generateCodeHint(params);
export const simulateCodeExecutionWithGemini = (params) => orchestrator.simulateCodeExecution(params);
export const generateGdReactions = (params) => orchestrator.generateGdReactions(params);
export const evaluateGdContribution = (params) => orchestrator.evaluateGdContribution(params);
export const answerDoubtWithGemini = (params) => orchestrator.answerDoubt(params);
export const explainMCQWithGemini = (params) => orchestrator.explainMCQ(params);
