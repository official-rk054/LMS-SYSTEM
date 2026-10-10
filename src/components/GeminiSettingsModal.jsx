import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Eye,
  EyeOff,
  Cpu,
  Layers,
  Zap,
  Clock,
  X
} from 'lucide-react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  clearGeminiApiKey,
  testGeminiConnection,
  orchestrator,
} from '../services/gemini';

export const GeminiSettingsModal = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeStatus, setActiveStatus] = useState(() => orchestrator.getStatus());

  useEffect(() => {
    if (isOpen) {
      const current = getGeminiApiKey() || '';
      setApiKeyInput(current);
      setTestResult(null);
      setActiveStatus(orchestrator.getStatus());
    }
  }, [isOpen]);

  useEffect(() => {
    return orchestrator.subscribe(status => {
      setActiveStatus(status);
    });
  }, []);

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setTestResult({
        success: false,
        error: 'Please enter a Gemini API Key to test and activate.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testGeminiConnection(apiKeyInput.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      orchestrator.saveKey(apiKeyInput.trim());
    }
  };

  const handleClearKey = () => {
    orchestrator.removeKey();
    setApiKeyInput('');
    setTestResult({
      success: true,
      message: 'Gemini API key cleared. LMS reverted to intelligent heuristic fallback mode.',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-glass-strong)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
              }}
            >
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-bright)' }}>
                  Google Gemini AI Engine
                </h3>
                {activeStatus.hasKey ? (
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    ● 2.5 Flash Active
                  </span>
                ) : (
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    ○ Heuristic Fallback Mode
                  </span>
                )}
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Power real-time interview generation, ATS rewrites, coding review & multi-agent debate.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-muted)', padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Key size={14} color="var(--primary)" /> Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Get free key from Google AI Studio <ExternalLink size={11} />
              </a>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="input"
                style={{
                  width: '100%',
                  paddingRight: '2.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.86rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.35rem' }}>
              Key is stored securely in your browser's local sandbox or loaded from Vercel environment variables.
            </span>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className="card"
              style={{
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                borderColor: testResult.success ? 'rgba(52, 211, 153, 0.4)' : 'rgba(248, 113, 113, 0.4)',
                background: testResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: testResult.success ? '#34d399' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              {testResult.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <div style={{ flex: 1 }}>
                <div>{testResult.success ? testResult.message || 'Verification successful!' : testResult.error}</div>
                {testResult.latencyMs && (
                  <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                    Model: <strong>{testResult.model}</strong> • Response Time: <strong>{testResult.latencyMs}ms</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {activeStatus.hasKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--text-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <RotateCcw size={14} /> Clear Key
              </button>
            )}

            <button
              type="submit"
              disabled={isTesting}
              className="btn btn-primary btn-sm"
              style={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                border: 'none',
                minWidth: '140px',
              }}
            >
              {isTesting ? (
                <>
                  <div className="btn-spinner" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} /> Verify & Activate
                </>
              )}
            </button>
          </div>
        </form>

        {/* Step-by-Step Instructions */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Zap size={14} color="var(--primary)" /> How to get a Free Google Gemini API Key in 30 Seconds:
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
            <li>
              Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Google AI Studio (aistudio.google.com/app/apikey)</a>.
            </li>
            <li>Sign in with any standard Google account.</li>
            <li>Click the blue <strong>"Create API key"</strong> button.</li>
            <li>Copy the generated key (starts with <code>AIzaSy...</code>) and paste it into the field above.</li>
            <li>Click <strong>Verify & Activate</strong>. PlaceIQ will immediately switch from mock to live AI!</li>
          </ol>
        </div>

        {/* Feature Power Matrix */}
        <div style={{ marginTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={14} color="var(--primary)" /> Multi-Agent Integration Matrix:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem' }}>
            <div className="card" style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem', background: 'var(--bg-glass)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>🎙️ Live Mock Interviewer</div>
              <div style={{ color: 'var(--text-muted)' }}>Context-aware follow-ups & dynamic rubric scorecard</div>
            </div>
            <div className="card" style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem', background: 'var(--bg-glass)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>📄 ATS Resume Analyzer</div>
              <div style={{ color: 'var(--text-muted)' }}>Google XYZ formula bullet rewrites & semantic JD audit</div>
            </div>
            <div className="card" style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem', background: 'var(--bg-glass)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>💻 Coding Arena</div>
              <div style={{ color: 'var(--text-muted)' }}>Big-O time/space complexity analysis & Socratic hints</div>
            </div>
            <div className="card" style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem', background: 'var(--bg-glass)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>👥 GD Simulator</div>
              <div style={{ color: 'var(--text-muted)' }}>Real counter-debater arguments & contribution grading</div>
            </div>
            <div className="card" style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem', background: 'var(--bg-glass)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)' }}>📚 Doubt Clearing & MCQ</div>
              <div style={{ color: 'var(--text-muted)' }}>Interactive FAANG concept coaching & option explanations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
