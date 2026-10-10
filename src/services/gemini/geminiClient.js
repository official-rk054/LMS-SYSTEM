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
 * Core caller for Gemini models with automatic backend proxy fallback
 */
export async function callGeminiApi({
  prompt,
  systemInstruction = '',
  temperature = 0.7,
  model = DEFAULT_MODEL,
}) {
  const clientKey = getGeminiApiKey();

  // 1. Direct Client-side execution if client key is available
  if (clientKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: clientKey });
      const config = {};
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (typeof temperature === 'number') {
        config.temperature = temperature;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      return response?.text || '';
    } catch (err) {
      console.warn('Direct Gemini call failed:', err?.message);
      // Fall through to backend proxy attempt before giving up
    }
  }

  // 2. Try Backend Server Proxy if server has GEMINI_API_KEY
  try {
    const backendRes = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction, temperature, model }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data?.text) {
        return data.text;
      }
    }
  } catch (_) {
    // Backend unreachable or offline
  }

  // 3. Neither client nor backend key is available
  const err = new Error('NO_GEMINI_API_KEY');
  err.code = 'NO_GEMINI_API_KEY';
  throw err;
}
