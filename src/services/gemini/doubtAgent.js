import { callGeminiApi } from './geminiClient';

/**
 * DoubtAgent: Specialized AI Agent for Learning Module Doubts and MCQ Tutor Deep-Dives
 */
export class DoubtAgent {
  /**
   * Answer a student's technical doubt in Learning Modules
   */
  static async answerDoubt({
    moduleTitle = 'Core Computer Science',
    topicTitle = 'Topic',
    userQuestion = '',
    chatHistory = [],
  }) {
    const systemInstruction = `You are a Senior Technical Instructor and FAANG Interview Coach at PlaceIQ LMS.
Help the student master the concept for their campus placements.
Provide crystal-clear explanations with:
1. Core intuition (why does this work?)
2. A short code snippet or mental model if applicable
3. Time/Space complexity or high-frequency interview trap
Keep it engaging, concise (under 180 words), and encouraging.`;

    const recent = chatHistory.slice(-4).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

    const prompt = `Module: ${moduleTitle}
Topic: ${topicTitle}
Previous Chat:
${recent}

Student Question:
"${userQuestion}"

Provide a structured, helpful explanation:`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.5,
    });

    return raw.trim();
  }

  /**
   * Deep Conceptual Explanation for MCQ Questions
   */
  static async explainMCQ({
    questionText = '',
    options = [],
    correctOptionIndex = 0,
    selectedOptionIndex = null,
    topic = 'Aptitude / Core CS',
  }) {
    const systemInstruction = `You are an expert Campus Placement Aptitude and CS Exam Tutor.
Provide an insightful explanation for this multiple-choice question.
Explain:
1. Why the correct answer is right.
2. Why the common distractor option is a trap.
3. A quick mental trick or formula for fast solving in 30 seconds.
Keep the explanation crisp and formatted with clear headings.`;

    const optionsFormatted = options.map((opt, i) => `Option ${i + 1}: ${opt}`).join('\n');

    const prompt = `Topic: ${topic}
Question:
"${questionText}"

Options:
${optionsFormatted}

Correct Answer: Option ${correctOptionIndex + 1}
Student Selected: ${selectedOptionIndex !== null ? `Option ${selectedOptionIndex + 1}` : 'None'}

Provide clear conceptual explanation:`;

    const raw = await callGeminiApi({
      prompt,
      systemInstruction,
      temperature: 0.4,
    });

    return raw.trim();
  }
}
