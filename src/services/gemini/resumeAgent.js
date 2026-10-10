import { callGeminiApi } from './geminiClient';

/**
 * ResumeAgent: Specialized AI Agent for ATS Resume Audits and Google XYZ Bullet Rewrites
 */
export class ResumeAgent {
  /**
   * Rewrite a candidate resume bullet using the Google XYZ Impact Formula:
   * "Accomplished [X] as measured by [Y] by doing [Z]"
   */
  static async rewriteBulletWithGoogleXYZ({
    originalBullet = '',
    targetRole = 'Software Development Engineer 1',
    company = 'Amazon',
    missingKeywords = [],
  }) {
    const systemInstruction = `You are a Principal Technical Recruiter and Staff Software Engineer at ${company}.
Your mission is to rewrite weak or average engineering resume bullets into high-impact bullets adhering strictly to the Google XYZ formula:
"Accomplished [X] as measured by [Y] by doing [Z]".
Guidelines:
1. Never fabricate impossible claims; use bracketed realistic metrics (e.g., "[35% latency reduction]", "[15,000+ daily requests]").
2. Naturally incorporate relevant keywords (${missingKeywords.slice(0, 3).join(', ') || 'Docker, CI/CD, Redis, SQL'}).
3. Output strictly valid JSON without markdown wrapping.`;

    const prompt = `Target Role: ${targetRole} at ${company}
Original Bullet:
"${originalBullet}"

Return a JSON object matching this schema:
{
  "beforeText": "${originalBullet.replace(/"/g, '\\"')}",
  "afterText": "Accomplished [X] as measured by [Y] by doing [Z]",
  "critique": "Brief 1-sentence analysis of why the original was passive or weak",
  "rationale": "Why this rewrite passes Fortune 500 ATS and recruiter screeners"
}`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.6,
    });

    try {
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Resume bullet rewrite JSON parsing failed:', err);
      return null;
    }
  }

  /**
   * Perform comprehensive semantic alignment audit of candidate resume against JD
   */
  static async auditResumeContent({
    resumeText = '',
    roleKey = 'sde_amazon',
    roleTitle = 'Amazon SDE 1',
    jdText = '',
  }) {
    const systemInstruction = `You are a Fortune 500 ATS & Hiring Screening Engine for ${roleTitle}.
Analyze the provided candidate resume against the Job Description. Output strictly valid JSON.`;

    const prompt = `Job Description:
${jdText.slice(0, 1500)}

Candidate Resume Content:
${resumeText.slice(0, 3000)}

Analyze and return JSON:
{
  "atsScore": number (0-100),
  "executiveSummary": string,
  "matchedSkills": [string],
  "missingSkills": [string],
  "keyRecommendations": [string],
  "suggestedRewrites": [
    {
      "original": string,
      "improved": string,
      "reason": string
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
    } catch (err) {
      console.warn('Resume audit JSON parsing failed:', err);
      return null;
    }
  }
}
