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
  ChevronRight,
  Settings,
  Camera,
  Activity,
  Radio,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Volume1
} from 'lucide-react';
import { MOCK_INTERVIEW_SESSIONS } from '../data/mockData';
import { useMediaConnectivity } from '../hooks/useMediaConnectivity';

export const MockInterviewer = ({ userProfile }) => {
  const [selectedRound, setSelectedRound] = useState(MOCK_INTERVIEW_SESSIONS[0]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 minutes
  const [isMicListening, setIsMicListening] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);

  // Settings & hardware test panel
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [isPreCheckActive, setIsPreCheckActive] = useState(false);

  // Transcript state
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);

  // Live metrics simulation
  const [confidenceScore, setConfidenceScore] = useState(84);
  const [paceWPM, setPaceWPM] = useState(135);

  const messagesEndRef = useRef(null);
  const candidateVideoRef = useRef(null);
  const previewVideoRef = useRef(null);

  // WebRTC Media Connectivity Hook
  const {
    stream,
    isCameraActive,
    isMicActive,
    permissionStatus,
    errorMessage: mediaError,
    isLoading: isMediaLoading,
    isSupported: isMediaSupported,
    audioLevel,
    isSpeaking,
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    videoDiagnostics,
    startMedia,
    stopMedia,
    toggleCamera,
    toggleMic,
    switchCamera,
    switchMic,
    retryPermission,
  } = useMediaConnectivity({ autoStart: false });

  // Attach video streams to video elements
  useEffect(() => {
    if (candidateVideoRef.current) {
      if (stream && isCameraActive) {
        candidateVideoRef.current.srcObject = stream;
        candidateVideoRef.current.play().catch(e => console.warn('Candidate video play error:', e));
      } else {
        candidateVideoRef.current.srcObject = null;
      }
    }
  }, [stream, isCameraActive, isInterviewActive]);

  useEffect(() => {
    if (previewVideoRef.current) {
      if (stream && isCameraActive) {
        previewVideoRef.current.srcObject = stream;
        previewVideoRef.current.play().catch(e => console.warn('Preview video play error:', e));
      } else {
        previewVideoRef.current.srcObject = null;
      }
    }
  }, [stream, isCameraActive, isPreCheckActive]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

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

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dynamic confidence score adjustment based on real audio activity
  useEffect(() => {
    if (isInterviewActive && isSpeaking) {
      setConfidenceScore(prev => Math.min(98, Math.max(75, prev + Math.floor(Math.random() * 2))));
    }
  }, [isSpeaking, isInterviewActive]);

  // Start interview with video and mic connectivity
  const handleStartInterview = async (round) => {
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

    // Automatically request & start camera and mic stream
    try {
      await startMedia({ video: true, audio: true });
    } catch (err) {
      console.warn('Initial media stream start:', err);
    }
  };

  // Toggle hardware pre-check
  const handleTogglePreCheck = async () => {
    if (isPreCheckActive) {
      stopMedia();
      setIsPreCheckActive(false);
    } else {
      setIsPreCheckActive(true);
      await startMedia({ video: true, audio: true });
    }
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

    // Ensure mic is unmuted in stream
    if (!isMicActive) {
      toggleMic(true);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsMicListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentInput(prev => (prev ? prev + ' ' : '') + finalTranscript);
          setIsMicListening(false);
        } else if (interimTranscript) {
          setCurrentInput(prev => (prev ? prev.replace(/ [^ ]*$/, '') + ' ' : '') + interimTranscript);
        }
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
          stopMedia();
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

  const handleConcludeInterview = () => {
    stopMedia();
    setIsFinished(true);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ═════════════════════════════════════════════════════════════
          1. PRE-INTERVIEW ROUND SELECTOR & HARDWARE CONNECTIVITY HUB
          ═════════════════════════════════════════════════════════════ */}
      {!isInterviewActive && !isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Hero Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mic color="var(--primary)" />
                  AI Adaptive Mock Interviewer
                </h2>
                <p style={{ fontSize: '0.85rem' }}>
                  Experience realistic Technical, HR, and Leadership rounds. Full WebRTC Video & Microphone connectivity with real-time speech analysis and dynamic follow-up questioning.
                </p>
              </div>

              {/* Hardware Pre-Check Quick Button */}
              <button
                onClick={handleTogglePreCheck}
                className={`btn ${isPreCheckActive ? 'btn-accent' : 'btn-outline'} btn-sm`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Camera size={15} />
                {isPreCheckActive ? 'Close Hardware Diagnostic' : 'Test Video & Mic'}
              </button>
            </div>

            {/* Hardware Diagnostic Pre-Check Drawer */}
            {isPreCheckActive && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(22, 22, 26, 0.85)',
                  border: '1px solid var(--border-glass)',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(320px, 1.8fr)',
                  gap: '1.25rem',
                  alignItems: 'center',
                }}
              >
                {/* Left: Video Preview Window */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div
                    style={{
                      height: '190px',
                      background: '#09090b',
                      borderRadius: 'var(--radius-md)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCameraActive && stream ? (
                      <video
                        ref={previewVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="media-video-feed"
                      />
                    ) : (
                      <div className="media-video-placeholder">
                        <VideoOff size={28} color="var(--text-dim)" />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Camera Preview Paused</span>
                        <button onClick={() => toggleCamera(true)} className="btn btn-outline btn-sm" style={{ marginTop: '0.35rem' }}>
                          Enable Camera
                        </button>
                      </div>
                    )}

                    {/* Live overlay badge */}
                    <div className="media-hud-top">
                      <span className="media-hud-badge">
                        <span className="pulse-dot" style={{ width: '6px', height: '6px', background: stream ? '#22c55e' : '#ef4444' }}></span>
                        {stream ? 'Hardware Connected' : 'Camera Off'}
                      </span>
                      {stream && (
                        <span className="media-hud-badge">
                          {videoDiagnostics.width || 1280}x{videoDiagnostics.height || 720}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick video/mic toggle controls */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => toggleCamera()}
                      className={`media-control-pill ${isCameraActive ? 'active' : 'muted'}`}
                    >
                      {isCameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                      {isCameraActive ? 'Webcam Active' : 'Webcam Muted'}
                    </button>
                    <button
                      onClick={() => toggleMic()}
                      className={`media-control-pill ${isMicActive ? 'active' : 'muted'}`}
                    >
                      {isMicActive ? <Mic size={14} /> : <MicOff size={14} />}
                      {isMicActive ? 'Mic Active' : 'Mic Muted'}
                    </button>
                  </div>
                </div>

                {/* Right: Audio Level Meter & Device Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
                      <Activity size={16} color="var(--primary)" />
                      Live Audio Sensitivity & Device Routing
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: isSpeaking ? '#4ade80' : 'var(--text-dim)', fontWeight: 600 }}>
                      {isSpeaking ? '🎙️ Voice Detected!' : 'Speak to test mic...'}
                    </span>
                  </div>

                  {/* 12-segment Dynamic VU Audio Meter */}
                  <div style={{ background: 'rgba(9, 9, 11, 0.6)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                      <span>Input Volume Level: <strong>{audioLevel}%</strong></span>
                      <span>Noise Floor: <strong>-42 dB</strong></span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', height: '14px', alignItems: 'center' }}>
                      {[...Array(16)].map((_, i) => {
                        const threshold = (i + 1) * 6.25;
                        const isLit = audioLevel >= threshold;
                        let barColor = 'rgba(255, 255, 255, 0.08)';
                        if (isLit) {
                          if (i < 10) barColor = '#22c55e'; // green
                          else if (i < 13) barColor = '#eab308'; // yellow
                          else barColor = '#ef4444'; // red peak
                        }
                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: '100%',
                              borderRadius: '2px',
                              background: barColor,
                              transition: 'background-color 0.08s ease, transform 0.08s ease',
                              transform: isLit ? 'scaleY(1)' : 'scaleY(0.7)',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Device Selectors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                        Camera Device
                      </label>
                      <select
                        className="input"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', height: 'auto', background: 'rgba(12, 12, 15, 0.9)' }}
                        value={selectedVideoDeviceId}
                        onChange={(e) => switchCamera(e.target.value)}
                      >
                        {videoDevices.length > 0 ? (
                          videoDevices.map(d => (
                            <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                          ))
                        ) : (
                          <option value="">Default Integrated Camera</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                        Microphone Device
                      </label>
                      <select
                        className="input"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', height: 'auto', background: 'rgba(12, 12, 15, 0.9)' }}
                        value={selectedAudioDeviceId}
                        onChange={(e) => switchMic(e.target.value)}
                      >
                        {audioDevices.length > 0 ? (
                          audioDevices.map(d => (
                            <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                          ))
                        ) : (
                          <option value="">Default Microphone</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Permissions error banner if needed */}
                  {permissionStatus === 'denied' && (
                    <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#f87171', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>⚠️ Access blocked. Please allow Camera & Mic in your browser address bar.</span>
                      <button onClick={retryPermission} className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rounds Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
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
                      ⏱️ {round.durationMinutes} Minutes • 🎥 Live Video
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
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2. LIVE INTERVIEW SESSION SCREEN (WITH WEBRTC VIDEO & MIC)
          ═════════════════════════════════════════════════════════════ */}
      {isInterviewActive && !isFinished && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 1fr) minmax(460px, 1.8fr)', gap: '1.5rem' }}>
          {/* Left Column: Interviewer Video Avatar & Candidate Live Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Interviewer Display Card */}
            <div className="card" style={{ textAlign: 'center', padding: '1.35rem' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  margin: '0 auto 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.8rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                {selectedRound.avatar}
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)', marginBottom: '0.2rem' }}>
                {selectedRound.interviewerName}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.65rem' }}>
                {selectedRound.type} Round • {selectedRound.title}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">
                  <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>
                  AI Voice Stream Active
                </span>
                <span className="badge badge-info">
                  Turn: {turnIndex + 1}
                </span>
              </div>
            </div>

            {/* Candidate Live WebRTC Video Feed & Proctor HUD */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <h4 style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Video size={16} color="var(--primary)" />
                  Candidate Feed & Live Proctor
                </h4>

                {/* Video / Mic Toggle Bar */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => toggleCamera()}
                    className={`btn btn-ghost btn-sm ${!isCameraActive ? 'text-danger' : ''}`}
                    style={{ padding: '0.25rem 0.5rem' }}
                    title={isCameraActive ? 'Mute Webcam' : 'Turn on Webcam'}
                  >
                    {isCameraActive ? <Video size={15} color="#22c55e" /> : <VideoOff size={15} color="#f87171" />}
                  </button>
                  <button
                    onClick={() => toggleMic()}
                    className={`btn btn-ghost btn-sm ${!isMicActive ? 'text-danger' : ''}`}
                    style={{ padding: '0.25rem 0.5rem' }}
                    title={isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isMicActive ? <Mic size={15} color="#22c55e" /> : <MicOff size={15} color="#f87171" />}
                  </button>
                  <button
                    onClick={() => setShowDeviceSettings(!showDeviceSettings)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.25rem 0.5rem' }}
                    title="Media Device Settings"
                  >
                    <Settings size={15} />
                  </button>
                  <button
                    onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.25rem 0.5rem' }}
                    title={speechSynthesisEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                  >
                    {speechSynthesisEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  </button>
                </div>
              </div>

              {/* In-Interview Device Selector Popover */}
              {showDeviceSettings && (
                <div
                  style={{
                    background: 'rgba(18, 18, 22, 0.95)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--text-white)' }}>Select Input Devices</strong>
                    <button onClick={() => setShowDeviceSettings(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.1rem 0.3rem', fontSize: '0.7rem' }}>
                      ✕
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>Camera</span>
                      <select
                        className="input"
                        style={{ fontSize: '0.72rem', padding: '0.3rem', height: 'auto', background: '#09090b' }}
                        value={selectedVideoDeviceId}
                        onChange={(e) => switchCamera(e.target.value)}
                      >
                        {videoDevices.map(d => (
                          <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>Mic</span>
                      <select
                        className="input"
                        style={{ fontSize: '0.72rem', padding: '0.3rem', height: 'auto', background: '#09090b' }}
                        value={selectedAudioDeviceId}
                        onChange={(e) => switchMic(e.target.value)}
                      >
                        {audioDevices.map(d => (
                          <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Element Viewport */}
              <div
                style={{
                  height: '210px',
                  background: '#09090b',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {isCameraActive && stream ? (
                  <video
                    ref={candidateVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="media-video-feed"
                  />
                ) : (
                  <div className="media-video-placeholder">
                    <div style={{ fontSize: '2.4rem' }}>🎓</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {userProfile.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {permissionStatus === 'denied'
                        ? 'Camera blocked by browser'
                        : 'Webcam feed paused'}
                    </div>
                    <button
                      onClick={() => toggleCamera(true)}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '0.3rem', padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                    >
                      {permissionStatus === 'denied' ? 'Retry Permissions' : 'Turn On Camera'}
                    </button>
                  </div>
                )}

                {/* Top Overlay Badges */}
                <div className="media-hud-top">
                  <span className="media-hud-badge">
                    <span className="pulse-dot" style={{ width: '6px', height: '6px', background: stream ? '#22c55e' : '#f59e0b' }}></span>
                    {stream ? 'HD 720p • 30 FPS' : 'Virtual Mode'}
                  </span>
                  <span className="media-hud-badge">
                    <ShieldCheck size={12} color="#22c55e" /> Gaze Centered
                  </span>
                </div>

                {/* Bottom Overlay Proctor HUD + Live Audio VU Meter */}
                <div className="media-hud-overlay">
                  {/* Left: Audio VU meter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div className="audio-level-meter-bar">
                      {[...Array(6)].map((_, i) => {
                        const threshold = (i + 1) * 16;
                        const isLit = audioLevel >= threshold;
                        return (
                          <div
                            key={i}
                            className={`audio-meter-bar-segment ${
                              isLit ? (i < 4 ? 'active' : i < 5 ? 'active-warning' : 'active-peak') : ''
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span style={{ color: isSpeaking ? '#4ade80' : isMicActive ? 'var(--text-muted)' : '#f87171', fontWeight: 600 }}>
                      {isSpeaking ? 'Speaking' : isMicActive ? `${audioLevel}%` : 'Muted'}
                    </span>
                  </div>

                  <span style={{ color: '#60a5fa' }}>Pace: {paceWPM} WPM</span>
                  <span style={{ color: '#34d399' }}>Confidence: {confidenceScore}%</span>
                </div>
              </div>

              {/* Permission Alert if denied */}
              {permissionStatus === 'denied' && (
                <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.6rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: '#f87171', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Camera/Mic access blocked. Click address bar to allow.</span>
                  <button onClick={retryPermission} className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}>
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Conclude Interview Button */}
            <button
              onClick={handleConcludeInterview}
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
                        background: isAi ? 'rgba(255, 255, 255, 0.05)' : 'var(--primary)',
                        border: isAi ? '1px solid var(--border-subtle)' : 'none',
                        color: isAi ? 'var(--text-main)' : '#09090b',
                        fontWeight: isAi ? 400 : 600,
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

            {/* Candidate Voice/Text Input Bar */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <button
                onClick={toggleSpeechRecognition}
                className={`btn ${isMicListening ? 'btn-accent audio-pulse-ring' : 'btn-outline'}`}
                title="Speak Answer (Web Speech API + Mic Stream)"
                style={{
                  padding: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isMicListening ? '#ffffff' : 'transparent',
                  color: isMicListening ? '#09090b' : 'inherit',
                }}
              >
                {isMicListening ? <Mic className="pulse-dot" size={18} /> : <Mic size={18} />}
              </button>

              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="input"
                  style={{ width: '100%', paddingRight: isSpeaking ? '85px' : '1rem' }}
                  placeholder={
                    isMicListening
                      ? '🎙️ Listening to your microphone... Speak now'
                      : 'Type your answer or click mic to speak...'
                  }
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                {/* Live audio indicator badge inside input when speaking */}
                {isSpeaking && (
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.7rem',
                      color: '#4ade80',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(34, 197, 94, 0.12)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    <span className="pulse-dot" style={{ width: '5px', height: '5px', background: '#4ade80' }}></span>
                    Active
                  </span>
                )}
              </div>

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

      {/* ═════════════════════════════════════════════════════════════
          3. POST-INTERVIEW COMPREHENSIVE PERFORMANCE REPORT
          ═════════════════════════════════════════════════════════════ */}
      {isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(39, 39, 42, 0.6) 0%, rgba(9, 9, 11, 0.9) 100%)',
              borderColor: 'var(--border-glass)',
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
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <BarChart2 size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>88/100</div>
                <div className="stat-label">Technical Depth</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>84/100</div>
                <div className="stat-label">Problem Solving</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>86/100</div>
                <div className="stat-label">Verbal Fluency & Mic</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>87/100</div>
                <div className="stat-label">Overall Readiness</div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Breakdown */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <CheckCircle2 size={18} color="#22c55e" />
                  Key Strengths Observed
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>Strong conceptual grasp of OS memory virtualization, process PCB structures, and thread concurrency.</li>
                <li>Clear verbal articulation without excessive filler words (Pace: 135 words/minute is optimal).</li>
                <li>Microphone audio was crisp with solid speech cadence and zero clipping.</li>
                <li>Structured approach when breaking down multi-threaded synchronization edge cases.</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertCircle size={18} color="#eab308" />
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
                <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                  <strong>Your Answer Score: 88/100 (Strong)</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
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
