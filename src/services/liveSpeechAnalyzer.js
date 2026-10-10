/**
 * PlaceIQ Live Speech & Voice Analysis Engine
 * Real-time Speech-to-Text, Audio Decibel Analysis, Pacing (WPM),
 * Filler Word Tracking, STAR Framework Metrics, and Natural Text-to-Speech.
 */

export const COMMON_FILLER_WORDS = [
  'um', 'uh', 'like', 'actually', 'basically', 'you know',
  'sort of', 'kind of', 'i mean', 'right', 'so yeah', 'literally'
];

export const ASSERTIVE_MARKERS = [
  'specifically', 'demonstrated', 'implemented', 'optimized', 'architected',
  'engineered', 'measured', 'achieved', 'resolved', 'consequently', 'furthermore',
  'principally', 'in conclusion', 'firstly', 'secondly', 'decisively'
];

export const HESITATION_MARKERS = [
  'maybe', 'probably', 'i guess', 'not sure', 'kind of', 'i think maybe',
  'somewhat', 'hopefully', 'might be wrong', 'sort of'
];

export const STAR_METHOD_MARKERS = [
  'situation', 'task', 'action', 'result', 'impact', 'challenge',
  'metric', 'reduced', 'increased', 'delivered', 'collaborated', 'designed'
];

/**
 * Performs real-time diagnostic analysis on spoken or typed text
 * @param {string} text Current transcript text
 * @param {number} elapsedSeconds Seconds elapsed since speech started
 * @param {object} context Topic, domain or interview round context
 */
export function analyzeSpeechInRealTime(text, elapsedSeconds = 1, context = {}) {
  const clean = (text || '').trim();
  if (!clean) {
    return {
      wordCount: 0,
      wpm: 0,
      wpmStatus: 'idle',
      wpmLabel: 'Awaiting speech...',
      fillersFound: [],
      fillerCount: 0,
      fillerRatio: 0,
      confidenceScore: 75,
      confidenceLabel: 'Ready',
      starSignals: [],
      assertiveSignals: [],
      hesitationSignals: [],
      matchedKeywords: [],
      liveTip: 'Click the microphone and begin speaking clearly.',
      clarityScore: 100,
    };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerText = clean.toLowerCase();

  // 1. Calculate WPM (Words Per Minute)
  const safeSeconds = Math.max(2, elapsedSeconds);
  const rawWpm = Math.round((wordCount / safeSeconds) * 60);
  // Bound to realistic ranges
  const wpm = Math.min(260, Math.max(0, rawWpm));

  let wpmStatus = 'optimal';
  let wpmLabel = 'Optimal & Poised (120-155 WPM)';
  if (wpm < 105 && wordCount > 3) {
    wpmStatus = 'slow';
    wpmLabel = 'Pacing Slow (< 110 WPM) — Pick up cadence';
  } else if (wpm > 165) {
    wpmStatus = 'fast';
    wpmLabel = 'Rushing (> 165 WPM) — Take a breath & pause';
  }

  // 2. Filler Word Detection
  const fillersFound = [];
  let fillerCount = 0;
  COMMON_FILLER_WORDS.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillersFound.push({ word: filler, count: matches.length });
      fillerCount += matches.length;
    }
  });

  const fillerRatio = wordCount > 0 ? Math.round((fillerCount / wordCount) * 100) : 0;
  const clarityScore = Math.max(35, Math.round(100 - (fillerCount * 8)));

  // 3. Assertive vs Hesitation Signals
  const assertiveSignals = ASSERTIVE_MARKERS.filter(m => lowerText.includes(m));
  const hesitationSignals = HESITATION_MARKERS.filter(m => lowerText.includes(m));
  const starSignals = STAR_METHOD_MARKERS.filter(m => lowerText.includes(m));

  // 4. Domain & Target Keywords Matching
  const targetKeywords = context.keywords || [];
  const matchedKeywords = targetKeywords.filter(kw => lowerText.includes(kw.toLowerCase()));

  // 5. Confidence Score Calculation
  let confidenceScore = 80;
  if (wpmStatus === 'optimal') confidenceScore += 8;
  if (wpmStatus === 'slow') confidenceScore -= 6;
  if (wpmStatus === 'fast') confidenceScore -= 5;
  confidenceScore -= Math.min(25, fillerCount * 5);
  confidenceScore += Math.min(15, assertiveSignals.length * 4);
  confidenceScore -= Math.min(15, hesitationSignals.length * 5);
  confidenceScore += Math.min(12, starSignals.length * 3);
  confidenceScore = Math.min(98, Math.max(40, confidenceScore));

  let confidenceLabel = 'Moderate';
  if (confidenceScore >= 85) confidenceLabel = 'High & Assertive';
  else if (confidenceScore >= 70) confidenceLabel = 'Balanced & Clear';
  else confidenceLabel = 'Needs Conviction';

  // 6. Dynamic Live Actionable Tip
  let liveTip = 'Good rhythm! Maintain strong eye contact and structured flow.';
  if (fillerCount >= 3) {
    liveTip = `Detected ${fillerCount} fillers (e.g. "${fillersFound[0]?.word}"). Pause briefly instead of using crutch words.`;
  } else if (wpmStatus === 'fast') {
    liveTip = 'Cadence is slightly rapid. Enunciate technical terms clearly.';
  } else if (wpmStatus === 'slow' && wordCount > 6) {
    liveTip = 'Pacing is reserved. Speak with active verb initiative.';
  } else if (hesitationSignals.length > 0) {
    liveTip = `Replace tentative phrase "${hesitationSignals[0]}" with assertive evidence.`;
  } else if (starSignals.length > 0) {
    liveTip = 'Strong STAR structuring detected! Quantify the outcome.';
  }

  return {
    wordCount,
    wpm,
    wpmStatus,
    wpmLabel,
    fillersFound,
    fillerCount,
    fillerRatio,
    confidenceScore,
    confidenceLabel,
    starSignals,
    assertiveSignals,
    hesitationSignals,
    matchedKeywords,
    liveTip,
    clarityScore,
  };
}

/**
 * Robust Speech Recognition Controller
 */
export class LiveSpeechRecognizer {
  constructor({ onTranscript, onStateChange, onError }) {
    this.onTranscript = onTranscript || (() => {});
    this.onStateChange = onStateChange || (() => {});
    this.onError = onError || (() => {});
    this.recognition = null;
    this.isListening = false;
    this.startTime = null;
    this.finalTranscript = '';
    this.timerInterval = null;
    this.elapsedSeconds = 0;
  }

  isSupported() {
    return typeof window !== 'undefined' &&
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }

  start({ lang = 'en-IN', continuous = true } = {}) {
    if (!this.isSupported()) {
      this.onError(new Error('SpeechRecognition API is not supported in this browser.'));
      return false;
    }

    if (this.isListening) {
      this.stop();
      return true;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = continuous;
      this.recognition.interimResults = true;
      this.recognition.lang = lang;

      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.finalTranscript = '';

      this.timerInterval = setInterval(() => {
        if (this.startTime) {
          this.elapsedSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
        }
      }, 500);

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange({ isListening: true });
      };

      this.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            this.finalTranscript += (this.finalTranscript ? ' ' : '') + res[0].transcript.trim();
          } else {
            interim += res[0].transcript;
          }
        }

        const fullText = (this.finalTranscript + (interim ? ' ' + interim : '')).trim();
        this.onTranscript({
          transcript: fullText,
          interim,
          final: this.finalTranscript,
          elapsedSeconds: this.elapsedSeconds,
        });
      };

      this.recognition.onerror = (err) => {
        console.warn('LiveSpeechRecognizer error:', err.error);
        if (err.error !== 'no-speech') {
          this.onError(err);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        clearInterval(this.timerInterval);
        this.onStateChange({ isListening: false });
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Failed to start SpeechRecognizer:', err);
      this.isListening = false;
      this.onError(err);
      return false;
    }
  }

  stop() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    this.onStateChange({ isListening: false });
  }
}

/**
 * Natural Text-to-Speech Player with live word and sentence boundary tracking
 */
export function playNaturalTTS(text, {
  rate = 1.0,
  pitch = 1.0,
  volume = 1.0,
  onStart = () => {},
  onEnd = () => {},
  onBoundary = () => {},
  onError = () => {}
} = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onError(new Error('SpeechSynthesis is not supported by this browser.'));
    return null;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Pick natural voice (prefer Google, Microsoft, or en-US/en-IN)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => onStart();
    utterance.onend = () => onEnd();
    utterance.onerror = (e) => onError(e);
    utterance.onboundary = (event) => {
      onBoundary({
        charIndex: event.charIndex,
        elapsedTime: event.elapsedTime,
        name: event.name,
      });
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    onError(err);
    return null;
  }
}
