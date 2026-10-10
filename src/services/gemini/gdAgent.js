import { callGeminiApi } from './geminiClient';

/**
 * GDAgent: Specialized AI Agent for Multi-Participant Group Discussion Simulations
 */
export class GDAgent {
  /**
   * Synthesize real participant responses countering or supporting the candidate
   */
  static async generateParticipantReactions({
    topic = 'AI in India Campus Placements',
    chatHistory = [],
    candidateName = 'Candidate',
    candidateArgument = '',
  }) {
    const systemInstruction = `You are a Group Discussion Simulation Engine orchestrating a campus placement round.
Participants include:
- Rohan (DTU Delhi): Direct, assertive, challenges assumptions, cites market competition.
- Priya (PICT Pune): Collaborative, empathetic, cites statistical evidence and ethical aspects.
- Aditya (VIT Vellore): Pragmatic, balances trade-offs, synthesizes opposing sides.
- Moderator AI: Keeps time, directs flow, evaluates etiquette.

Based on what the candidate just argued, choose 1 or 2 participants (or Moderator) to respond directly.
Output strictly valid JSON.`;

    const recentChat = chatHistory.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');

    const prompt = `Topic: "${topic}"
Recent Discussion:
${recentChat}

${candidateName} just contributed:
"${candidateArgument}"

Generate 1 or 2 immediate follow-up responses from participants or the Moderator reacting directly to ${candidateName}'s point.
Return JSON array:
[
  {
    "sender": "Rohan (DTU Delhi)" | "Priya (PICT Pune)" | "Aditya (VIT Vellore)" | "Moderator AI",
    "text": string (conversational, under 45 words),
    "tone": string (e.g. "Counter-argument", "Supportive with data", "Moderation")
  }
]`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.75,
    });

    try {
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('GD participant reaction JSON parse failed:', err);
      return null;
    }
  }

  /**
   * Evaluate the candidate's GD intervention dynamically
   */
  static async evaluateContribution({
    topic = '',
    candidateName = 'Candidate',
    candidateArgument = '',
  }) {
    const systemInstruction = `You are an HR Evaluator grading a candidate in an engineering placement Group Discussion. Output strictly valid JSON.`;

    const prompt = `Topic: "${topic}"
Candidate Argument by ${candidateName}:
"${candidateArgument}"

Return JSON:
{
  "entryTimingScore": number (70-98),
  "argumentDepthScore": number (70-98),
  "collaborationScore": number (70-98),
  "verdict": string (1-sentence assessment of their intervention),
  "feedbackPoints": [string, string, string]
}`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.4,
    });

    try {
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('GD evaluation parse failed:', err);
      return null;
    }
  }
}
