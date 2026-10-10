import { callGeminiApi } from './geminiClient';

/**
 * InterviewAgent: Specialized AI Agent for Live Mock Technical & Behavioral Interviews
 */
export class InterviewAgent {
  /**
   * Synthesize context-aware follow-up interview questions dynamically
   */
  static async generateFollowUpQuestion({
    roundTitle = 'SDE 1 Interview',
    company = 'Tech Company',
    roundType = 'Technical',
    turnIndex = 1,
    candidateName = 'Candidate',
    conversationHistory = [],
    candidateAnswer = '',
  }) {
    const systemInstruction = `You are a Principal Engineering & Technical Hiring Bar Raiser conducting an authentic campus placement interview for ${company} (${roundTitle}, Round Type: ${roundType}).
Your goal is to evaluate the candidate's technical depth, algorithmic foundations, system design awareness, or STAR-framework behavioral clarity.
Speak naturally and professionally in first person ("I noticed you mentioned...", "How would you handle...").
CRITICAL CONSTRAINTS:
1. Keep your spoken question concise (under 55 words) so it sounds natural when converted to speech.
2. Directly address what the candidate just explained. If their answer was surface-level, probe deeper into trade-offs, edge cases, or low-level mechanisms. If strong, elevate to distributed scale or edge cases.
3. Address the candidate by their first name (${candidateName}).
4. Do NOT output markdown symbols, bullet points, asterisks, or quotes around the whole text. Just the spoken question.`;

    const recentExchanges = conversationHistory
      .slice(-4)
      .map(m => `${m.sender === 'candidate' ? candidateName : 'Interviewer'}: ${m.text}`)
      .join('\n');

    const prompt = `Round: ${roundTitle} (${company} - ${roundType})
Turn Number: ${turnIndex} of 3
Conversation So Far:
${recentExchanges}

Candidate's Latest Spoken Answer:
"${candidateAnswer}"

Generate your next follow-up question:`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.75,
    });

    // Clean any formatting quotes/asterisks for natural speech
    return raw.replace(/[*_#"`]/g, '').trim();
  }

  /**
   * Synthesize real end-of-interview diagnostic report and scorecard
   */
  static async generateInterviewScorecard({
    roundTitle = 'SDE 1 Interview',
    company = 'Tech Company',
    roundType = 'Technical',
    candidateName = 'Candidate',
    messages = [],
    telemetry = {},
  }) {
    const systemInstruction = `You are an Executive Hiring Committee Bar Raiser for ${company}.
Evaluate this completed campus placement interview transcript. Output MUST be strictly valid JSON without code blocks or markdown wrappers.`;

    const formattedTranscript = messages
      .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');

    const prompt = `Analyze this interview transcript for ${candidateName} applying for ${roundTitle} at ${company} (${roundType}).

Candidate Telemetry:
- Gaze Attention / Focus: ${telemetry.attentionPercentage || 90}%
- Proctor Violations / Strikes: ${telemetry.totalStrikes || 0}
- Terminated by Proctor: ${telemetry.isTerminated ? 'Yes' : 'No'}

Transcript:
${formattedTranscript}

Return ONLY a JSON object matching this schema:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "verdict": string (e.g. "Strong Hire / Fast-Track to Bar Raiser" or "Needs Algorithmic Deepening"),
  "summary": string (2-3 sentences holistic feedback),
  "strengths": [string, string, string],
  "improvements": [string, string, string],
  "turnCritiques": [
    {
      "turn": number,
      "candidatePoints": string,
      "rating": string (e.g. "Exemplary", "Adequate", "Superficial"),
      "feedback": string
    }
  ]
}`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.4,
    });

    try {
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Failed to parse Gemini scorecard JSON, falling back:', parseErr);
      return null;
    }
  }
}
