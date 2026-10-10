import { callGeminiApi } from './geminiClient';

/**
 * CodeReviewAgent: Specialized AI Agent for Algorithmic Reviews, Big-O Analysis & Socratic Hints
 */
export class CodeReviewAgent {
  /**
   * Comprehensive Code Review & Complexity Analysis
   */
  static async reviewCode({
    problemTitle = 'Algorithmic Problem',
    problemDescription = '',
    userCode = '',
    language = 'javascript',
  }) {
    const systemInstruction = `You are a Principal Software Engineer and Competitive Programming Coach at Google.
Review the candidate's code submission. Provide rigorous, actionable feedback including Big-O complexity analysis and edge case detection.
Output strictly valid JSON.`;

    const prompt = `Problem: ${problemTitle}
Problem Description:
${problemDescription.slice(0, 800)}

Candidate Code (${language}):
\`\`\`${language}
${userCode}
\`\`\`

Return a JSON object matching this schema:
{
  "timeComplexity": string (e.g. "O(N log N)"),
  "spaceComplexity": string (e.g. "O(1) auxiliary"),
  "isOptimal": boolean,
  "verdict": string (1-sentence assessment),
  "strengths": [string, string],
  "potentialBugsOrEdgeCases": [string, string],
  "cleanCodeAdvice": string
}`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.3,
    });

    try {
      const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Code review JSON parse failed:', err);
      return null;
    }
  }

  /**
   * Socratic Hint Generator (guiding without spoiling the direct solution)
   */
  static async generateHint({
    problemTitle = 'Algorithmic Problem',
    problemDescription = '',
    userCode = '',
    language = 'javascript',
  }) {
    const systemInstruction = `You are an expert DSA Mentor. Give a helpful Socratic hint for the problem below.
DO NOT provide the full complete solution code. Instead, point out the pattern, invariant, or data structure choice.
Keep response concise (under 80 words).`;

    const prompt = `Problem: ${problemTitle}
Problem Details: ${problemDescription.slice(0, 600)}

Candidate's current code attempt:
\`\`\`${language}
${userCode.slice(0, 800)}
\`\`\`

Provide a progressive conceptual hint:`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.6,
    });

    return raw.trim();
  }

  /**
   * Simulate Multi-Language Sandboxed Execution (Python, C++, Java) with Custom Input
   */
  static async simulateExecution({
    problemTitle = 'Coding Problem',
    userCode = '',
    language = 'python',
    customInput = '',
  }) {
    const systemInstruction = `You are an accurate code execution engine sandbox.
Predict and format the exact standard output, execution time estimate, and status code of the provided code with the given input.
Output plain text representing terminal output.`;

    const prompt = `Language: ${language}
Problem: ${problemTitle}
Code:
\`\`\`${language}
${userCode}
\`\`\`

Input data (stdin / function parameters):
${customInput || 'Default test parameters'}

Provide realistic compiler/interpreter stdout:`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.2,
    });

    return raw.trim();
  }
}
