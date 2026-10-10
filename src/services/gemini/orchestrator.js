import {
  getGeminiApiKey,
  setGeminiApiKey,
  clearGeminiApiKey,
  testGeminiConnection,
} from './geminiClient';
import { InterviewAgent } from './interviewAgent';
import { ResumeAgent } from './resumeAgent';
import { CodeReviewAgent } from './codeReviewAgent';
import { GDAgent } from './gdAgent';
import { DoubtAgent } from './doubtAgent';

/**
 * GeminiOrchestrator: Central Master Controller for All PlaceIQ AI Sub-Agents
 * Enforces multi-agent separation of concerns, fallback guarantees, and lifecycle tracking.
 */
class GeminiOrchestrator {
  constructor() {
    this.activeModel = 'gemini-2.5-flash';
    this.listeners = new Set();
  }

  // Subscribe to API key or connection status changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const status = this.getStatus();
    this.listeners.forEach(cb => {
      try {
        cb(status);
      } catch (e) {
        console.warn('Listener error in GeminiOrchestrator:', e);
      }
    });
  }

  // Check current key and availability status
  getStatus() {
    const key = getGeminiApiKey();
    return {
      hasKey: !!key,
      maskedKey: key ? `${key.slice(0, 6)}••••••••${key.slice(-4)}` : null,
      model: this.activeModel,
    };
  }

  // Save key and notify subscribers
  saveKey(key) {
    setGeminiApiKey(key);
    this.notify();
  }

  // Remove key and notify subscribers
  removeKey() {
    clearGeminiApiKey();
    this.notify();
  }

  // Test connection
  async testConnection(candidateKey = null) {
    return await testGeminiConnection(candidateKey);
  }

  // ─────────────────────────────────────────────────────────────
  // 1. MOCK INTERVIEW AGENT ORCHESTRATION
  // ─────────────────────────────────────────────────────────────
  async generateInterviewQuestion(params) {
    try {
      const question = await InterviewAgent.generateFollowUpQuestion(params);
      if (question && question.trim()) {
        return { success: true, isGemini: true, question };
      }
    } catch (err) {
      console.info('InterviewAgent fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async generateInterviewScorecard(params) {
    try {
      const report = await InterviewAgent.generateInterviewScorecard(params);
      if (report && typeof report === 'object') {
        return { success: true, isGemini: true, report };
      }
    } catch (err) {
      console.info('InterviewAgent scorecard fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  // ─────────────────────────────────────────────────────────────
  // 2. RESUME AUDIT AGENT ORCHESTRATION
  // ─────────────────────────────────────────────────────────────
  async rewriteResumeBullet(params) {
    try {
      const rewrite = await ResumeAgent.rewriteBulletWithGoogleXYZ(params);
      if (rewrite && rewrite.afterText) {
        return { success: true, isGemini: true, rewrite };
      }
    } catch (err) {
      console.info('ResumeAgent rewrite fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async auditResume(params) {
    try {
      const audit = await ResumeAgent.auditResumeContent(params);
      if (audit && audit.atsScore !== undefined) {
        return { success: true, isGemini: true, audit };
      }
    } catch (err) {
      console.info('ResumeAgent audit fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CODING ARENA AGENT ORCHESTRATION
  // ─────────────────────────────────────────────────────────────
  async reviewCode(params) {
    try {
      const review = await CodeReviewAgent.reviewCode(params);
      if (review) {
        return { success: true, isGemini: true, review };
      }
    } catch (err) {
      console.info('CodeReviewAgent fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async generateCodeHint(params) {
    try {
      const hint = await CodeReviewAgent.generateHint(params);
      if (hint) {
        return { success: true, isGemini: true, hint };
      }
    } catch (err) {
      console.info('CodeReviewAgent hint fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async simulateCodeExecution(params) {
    try {
      const output = await CodeReviewAgent.simulateExecution(params);
      if (output) {
        return { success: true, isGemini: true, output };
      }
    } catch (err) {
      console.info('CodeReviewAgent execution fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  // ─────────────────────────────────────────────────────────────
  // 4. GD SIMULATOR AGENT ORCHESTRATION
  // ─────────────────────────────────────────────────────────────
  async generateGdReactions(params) {
    try {
      const reactions = await GDAgent.generateParticipantReactions(params);
      if (reactions && Array.isArray(reactions) && reactions.length > 0) {
        return { success: true, isGemini: true, reactions };
      }
    } catch (err) {
      console.info('GDAgent reactions fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async evaluateGdContribution(params) {
    try {
      const evaluation = await GDAgent.evaluateContribution(params);
      if (evaluation) {
        return { success: true, isGemini: true, evaluation };
      }
    } catch (err) {
      console.info('GDAgent evaluation fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  // ─────────────────────────────────────────────────────────────
  // 5. DOUBT & MCQ TUTOR AGENT ORCHESTRATION
  // ─────────────────────────────────────────────────────────────
  async answerDoubt(params) {
    try {
      const answer = await DoubtAgent.answerDoubt(params);
      if (answer) {
        return { success: true, isGemini: true, answer };
      }
    } catch (err) {
      console.info('DoubtAgent answer fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }

  async explainMCQ(params) {
    try {
      const explanation = await DoubtAgent.explainMCQ(params);
      if (explanation) {
        return { success: true, isGemini: true, explanation };
      }
    } catch (err) {
      console.info('DoubtAgent MCQ fallback triggered:', err?.message || err);
    }
    return { success: false, isGemini: false };
  }
}

export const orchestrator = new GeminiOrchestrator();
