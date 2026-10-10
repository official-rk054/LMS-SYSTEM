import express from 'express';

const router = express.Router();

/**
 * GET /api/gemini/status
 * Check if backend server has a GEMINI_API_KEY configured in environment
 */
router.get('/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    available: hasKey,
    model: 'gemini-2.5-flash',
    mode: hasKey ? 'backend_proxy_ready' : 'client_key_required',
  });
});

/**
 * POST /api/gemini/generate
 * Secure proxy endpoint for server-side Gemini execution
 */
router.post('/generate', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Backend GEMINI_API_KEY is not configured. Use client-side key.',
    });
  }

  const {
    prompt,
    systemInstruction = '',
    temperature = 0.7,
    model = 'gemini-2.5-flash',
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    const bodyPayload = {
      contents,
      generationConfig: {
        temperature,
      },
    };

    if (systemInstruction) {
      bodyPayload.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || `Gemini API error: ${response.statusText}`,
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({ text: candidateText });
  } catch (err) {
    console.error('Backend Gemini proxy error:', err);
    res.status(500).json({ error: err.message || 'Internal server error calling Gemini API' });
  }
});

export default router;
