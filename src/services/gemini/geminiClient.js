import { GoogleGenAI } from '@google/genai';

const STORAGE_KEY = 'placeiq_gemini_api_key';
const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Get active Gemini API key from localStorage or Vite environment variable
 */
export function getGeminiApiKey() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY.trim();
  }
  return null;
}

/**
 * Save Gemini API key to localStorage
 */
export function setGeminiApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

/**
 * Remove Gemini API key from localStorage
 */
export function clearGeminiApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Test connectivity with provided or stored API key
 */
export async function testGeminiConnection(candidateKey = null) {
  const key = candidateKey ? candidateKey.trim() : getGeminiApiKey();
  if (!key) {
    return {
      success: false,
      error: 'No API key provided. Please generate a free key from Google AI Studio and enter it.',
    };
  }

  const startTime = performance.now();
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: 'Respond with exactly: "PlaceIQ Gemini AI connection verified successfully."',
    });

    const elapsed = Math.round(performance.now() - startTime);
    const text = response?.text || '';

    return {
      success: true,
      model: DEFAULT_MODEL,
      latencyMs: elapsed,
      message: text.trim() || 'Connection verified successfully.',
    };
  } catch (err) {
    console.error('Gemini connection test failed:', err);
    return {
      success: false,
      error: err?.message || 'Failed to authenticate with Google Gemini API. Please check your key.',
    };
  }
}

/**
 * Core caller for Gemini models. Prefer the server proxy so production can use
 * a server-side GEMINI_API_KEY without exposing it in the browser. If the
 * backend is unavailable or unconfigured, fall back to a user-provided key.
 */
export async function callGeminiApi({
  prompt,
  systemInstruction = '',
  temperature = 0.7,
  model = DEFAULT_MODEL,
}) {
  const clientKey = getGeminiApiKey();

  let backendError = '';
  // 1. Try the backend first (required for server-side keys and Vercel).
  try {
    const backendRes = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction, temperature, model }),
    });

    const data = await backendRes.json().catch(() => ({}));
    if (backendRes.ok && typeof data?.text === 'string' && data.text.trim()) {
      return data.text;
    }
    backendError = data?.error || `Gemini backend returned HTTP ${backendRes.status}`;
  } catch (err) {
    backendError = err?.message || 'Gemini backend is unreachable';
  }

  // 2. Support the existing user-provided browser key as a fallback.
  if (clientKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: clientKey });
      const config = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (typeof temperature === 'number') config.temperature = temperature;
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: Object.keys(config).length ? config : undefined,
      });
      const text = response?.text || '';
      if (text.trim()) return text;
      throw new Error('Gemini returned an empty response.');
    } catch (err) {
      console.warn('Direct Gemini call failed:', err?.message);
      backendError = err?.message || backendError;
    }
  }

  const err = new Error(clientKey
    ? `Gemini request failed: ${backendError}`
    : 'Gemini is not configured. Set GEMINI_API_KEY on the backend or add a Gemini API key in AI settings.');
  err.code = clientKey ? 'GEMINI_REQUEST_FAILED' : 'NO_GEMINI_API_KEY';
  throw err;
}
