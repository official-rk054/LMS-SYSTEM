import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Send,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  BarChart2,
  TrendingUp,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { MOCK_INTERVIEW_SESSIONS } from '../data/mockData';

export const MockInterviewer = ({ userProfile }) => {
  const [selectedRound, setSelectedRound] = useState(MOCK_INTERVIEW_SESSIONS[0]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 minutes
  const [isMicListening, setIsMicListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Transcript state
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);

  // Live metrics simulation
  const [confidenceScore, setConfidenceScore] = useState(82);
  const [paceWPM, setPaceWPM] = useState(135);

  const messagesEndRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isInterviewActive && !isFinished && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, isFinished, timerSeconds]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start interview
  const handleStartInterview = (round) => {
    setSelectedRound(round);
    setIsInterviewActive(true);
    setIsFinished(false);
    setTimerSeconds(round.durationMinutes * 60);
    setTurnIndex(0);

    const initialAiMessage = {
      sender: 'interviewer',
      text: round.starterPrompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialAiMessage]);
    speakText(round.starterPrompt);
  };

  // Text-to-speech helper
  const speakText = (text) => {
    if (!speechSynthesisEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available or blocked:', e);
    }
  };

  // Web Speech API Voice Input
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by this browser. You can type your responses in the text box below!');
      return;
    }

    if (isMicListening) {
      setIsMicListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsMicListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(prev => (prev ? prev + ' ' : '') + transcript);
        setIsMicListening(false);
      };

      recognition.onerror = () => {
        setIsMicListening(false);
      };

      recognition.onend = () => {
        setIsMicListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsMicListening(false);
    }
  };

  // Candidate sends response
  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessageText = currentInput.trim();
    const newUserMsg = {
      sender: 'candidate',
      text: userMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextTurn = turnIndex + 1;
    setTurnIndex(nextTurn);
    setMessages(prev => [...prev, newUserMsg]);
    setCurrentInput('');

    // Adaptive follow-up AI generator
    setTimeout(() => {
      let aiFollowUp = '';
      if (nextTurn === 1) {
        if (selectedRound.type === 'Technical') {
          aiFollowUp = `That is a solid explanation of processes versus threads, Aarav. Now, building on your point about shared memory: when multiple threads access a shared critical section, what concurrency issues can emerge, and how does a binary semaphore differ from a mutex lock in OS kernels?`;
        } else {
          aiFollowUp = `I appreciate your transparency on that project conflict. How did you ensure that personal friction did not affect project milestones, and what objective metrics or data did your team use to finalize the decision?`;
        }
      } else if (nextTurn === 2) {
        if (selectedRound.type === 'Technical') {
          aiFollowUp = `Excellent distinction. Let us pivot to databases. In MySQL or PostgreSQL, how does a B+ Tree index accelerate range queries, and what is the trade-off when having high-frequency write operations?`;
        } else {
          aiFollowUp = `Well handled. Now, tell me about a time you failed to meet an expected project deadline or deliverable. How did you communicate this to your mentor or professors?`;
        }
      } else {
        aiFollowUp = `Thank you so much, Aarav! You demonstrated strong technical clarity and thoughtful communication throughout our discussion. Let me compile your detailed evaluation report.`;
        setTimeout(() => {
          setIsFinished(true);
        }, 3000);
      }

      const aiMsg = {
        sender: 'interviewer',
        text: aiFollowUp,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(aiFollowUp);
    }, 1000);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Round Selector if not in active session */}
      {!isInterviewActive && !isFinished && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mic color="var(--primary)" />
                AI Adaptive Mock Interviewer
              </h2>
              <p style={{ fontSize: '0.85rem' }}>
                Experience realistic Technical, HR, and Leadership rounds. Voice-enabled with Web Speech API and dynamic follow-up questioning.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {MOCK_INTERVIEW_SESSIONS.map((round) => (
              <div
                key={round.id}
                style={{
                  padding: '1.35rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '2rem' }}>{round.avatar}</div>
                    <span className="badge badge-primary">{round.type}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-white)' }}>
                    {round.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {round.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Interviewer: <strong>{round.interviewerName}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ⏱️ {round.durationMinutes} Minutes
                  </span>
                  <button
                    onClick={() => handleStartInterview(round)}
                    className="btn btn-primary btn-sm"
                  >
                    Enter Room <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Interview Session Screen */}
      {isInterviewActive && !isFinished && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(450px, 1.8fr)', gap: '1.5rem' }}>
          {/* Left Column: Interviewer Video Avatar & Proctor HUD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Interviewer Display Card */}
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  margin: '0 auto 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {selectedRound.avatar}
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)', marginBottom: '0.2rem' }}>
                {selectedRound.interviewerName}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                {selectedRound.type} Round • {selectedRound.title}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">
                  <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>
                  Live AI Audio Active
                </span>
                <span className="badge badge-info">
                  Round Turn: {turnIndex + 1}
                </span>
              </div>
            </div>

            {/* Candidate Simulated Webcam / Proctor HUD */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Video size={16} color="var(--primary)" />
                  Candidate Feed & Proctor Monitor
                </h4>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    {isCameraActive ? <Video size={15} /> : <VideoOff size={15} />}
                  </button>
                  <button
                    onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    {speechSynthesisEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  </button>
                </div>
              </div>

              {/* Video simulation preview */}
              <div
                style={{
                  height: '180px',
                  background: isCameraActive ? '#111827' : '#030712',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {isCameraActive ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.35rem' }}>🎓</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {userProfile.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      Eye Tracking: Normal | Head Tilt: Stable
                    </div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Webcam Feed Paused</div>
                )}

                {/* HUD Overlay Stats */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    background: 'rgba(0, 0, 0, 0.65)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span style={{ color: '#34d399' }}>Confidence: {confidenceScore}%</span>
                  <span style={{ color: '#60a5fa' }}>Pace: {paceWPM} WPM</span>
                  <span style={{ color: '#fbbf24' }}>Fillers: 0 detected</span>
                </div>
              </div>
            </div>

            {/* End Interview Button */}
            <button
              onClick={() => setIsFinished(true)}
              className="btn btn-outline"
              style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            >
              Conclude Interview & Generate Report
            </button>
          </div>

          {/* Right Column: Live Chat & Audio Conversation Stream */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--warning)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Session Timer: {formatTimer(timerSeconds)}
                </span>
              </div>
              <span className="badge badge-primary">AI Adaptive Engine Active</span>
            </div>

            {/* Conversation Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {messages.map((msg, i) => {
                const isAi = msg.sender === 'interviewer';
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAi ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      <span>{isAi ? selectedRound.interviewerName : 'You'}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '0.85rem 1.15rem',
                        borderRadius: isAi ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        background: isAi ? 'rgba(99, 102, 241, 0.12)' : 'var(--primary)',
                        border: isAi ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                        color: isAi ? 'var(--text-main)' : '#ffffff',
                        fontSize: '0.88rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Candidate Input Bar */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={toggleSpeechRecognition}
                className={`btn ${isMicListening ? 'btn-accent' : 'btn-outline'}`}
                title="Speak Answer (Web Speech API)"
                style={{ padding: '0.6rem' }}
              >
                {isMicListening ? <Mic className="pulse-dot" size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                className="input"
                placeholder={isMicListening ? 'Listening to your microphone...' : 'Type your answer or speak with the mic...'}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />

              <button
                onClick={handleSendMessage}
                className="btn btn-primary"
                disabled={!currentInput.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Interview Comprehensive Report (Checkpoint 6) */}
      {isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                  Assessment Complete
                </span>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  AI Interview Performance Evaluation
                </h2>
                <p style={{ fontSize: '0.9rem' }}>
                  Candidate: <strong>{userProfile.name}</strong> • Evaluated for: <strong>{selectedRound.title}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setIsInterviewActive(false);
                  }}
                  className="btn btn-outline"
                >
                  <RotateCcw size={15} /> Practice Another Round
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary"
                >
                  Export Feedback Report
                </button>
              </div>
            </div>
          </div>

          {/* Competency Scores Grid */}
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <BarChart2 size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#818cf8' }}>88/100</div>
                <div className="stat-label">Technical Depth</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#38bdf8' }}>84/100</div>
                <div className="stat-label">Problem Solving</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#34d399' }}>82/100</div>
                <div className="stat-label">Communication & Tone</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#fbbf24' }}>85/100</div>
                <div className="stat-label">Overall Readiness</div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Breakdown */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <CheckCircle2 size={18} color="#10b981" />
                  Key Strengths Observed
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>Strong conceptual grasp of OS memory virtualization, process PCB structures, and thread concurrency.</li>
                <li>Clear verbal articulation without excessive filler words (Pace: 135 words/minute is optimal).</li>
                <li>Structured approach when breaking down multi-threaded synchronization edge cases.</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertCircle size={18} color="#f59e0b" />
                  Actionable Areas for Improvement
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>When asked about mutexes vs semaphores, emphasize kernel-level ownership (e.g. only the thread that locks a mutex can unlock it).</li>
                <li>In behavioral questions, format answers strictly with the STAR framework (Situation, Task, Action, Result).</li>
                <li>Elaborate more on production scale metrics (QPS, database indexing performance) when discussing capstone projects.</li>
              </ul>
            </div>
          </div>

          {/* Answer-Level Critique & Model Exemplar */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={18} color="var(--primary)" />
                Turn-by-Turn Answer Critique & Model Answers
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Question: Process vs Thread & Scheduling in Linux
                </div>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '0.5rem' }}>
                  <strong>Your Answer Score: 88/100 (Strong)</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(16, 185, 129, 0.06)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>AI Recruiter Feedback:</strong> You correctly identified that threads share address space and heaps while maintaining their own stack and registers. To make this an Amazon Bar Raiser level answer, cite Linux's `clone()` system call with `CLONE_VM` flags and the CFS (Completely Fair Scheduler).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
