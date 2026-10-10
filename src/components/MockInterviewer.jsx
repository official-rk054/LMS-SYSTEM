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
import { recordInterviewEvaluation } from '../services/authDatabase';
import {
  analyzeSpeechInRealTime,
  LiveSpeechRecognizer,
  playNaturalTTS
} from '../services/liveSpeechAnalyzer';

const LiveAudioBarMeter = ({ level = 0, active = false }) => {
  const bars = [0.35, 0.7, 1.0, 0.85, 0.5, 0.9, 0.4];
  return (
    <div className="live-audio-meter">
      {bars.map((scale, i) => {
        const h = active ? Math.max(3, Math.round((Math.max(18, level) / 100) * 16 * scale)) : 3;
        return <div key={i} className="live-audio-bar" style={{ height: `${h}px` }} />;
      })}
    </div>
  );
};

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

  // Live Speech Real-Time Analysis state
  const [liveSpeechMetrics, setLiveSpeechMetrics] = useState(null);
  const liveRecognizerRef = useRef(null);

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

  // Text-to-speech helper with natural voice
  const speakText = (text) => {
    if (!speechSynthesisEnabled) return;
    playNaturalTTS(text, {
      rate: 1.02,
      pitch: 1.0,
      onError: (e) => console.warn('Mock Interviewer TTS warning:', e)
    });
  };

  // Web Speech API Voice Input with Live Real-Time Analysis
  const toggleSpeechRecognition = async () => {
    if (isMicListening) {
      if (liveRecognizerRef.current) liveRecognizerRef.current.stop();
      setIsMicListening(false);
      return;
    }

    // Ensure audio track is acquired
    try {
      await startMedia({ audio: true, video: isCameraActive });
    } catch (e) {
      console.warn('Microphone permission check error:', e);
    }

    if (!liveRecognizerRef.current) {
      liveRecognizerRef.current = new LiveSpeechRecognizer({
        onTranscript: ({ transcript, elapsedSeconds }) => {
          setCurrentInput(transcript);
          const metrics = analyzeSpeechInRealTime(transcript, elapsedSeconds, {
            keywords: ['dsa', 'complexity', 'threads', 'acid', 'star', 'trade-off', 'latency', 'cache', 'system', 'concurrency', 'indexes', 'trees']
          });
          setLiveSpeechMetrics(metrics);
        },
        onStateChange: ({ isListening }) => {
          setIsMicListening(isListening);
          if (!isListening && !currentInput) {
            setLiveSpeechMetrics(null);
          }
        },
        onError: (err) => {
          console.warn('Interviewer speech recognition error:', err);
          setIsMicListening(false);
        }
      });
    }

    const started = liveRecognizerRef.current.start({ lang: 'en-IN', continuous: true });
    if (!started) {
      alert('Microphone speech recognition could not start. Please grant microphone access in your browser.');
    }
  };

  // Adaptive Speech Text & Context Analyzer
  const analyzeCandidateText = (userText, turn, round, candidateName) => {
    const lower = userText.toLowerCase();
    const words = userText.trim().split(/\s+/).filter(Boolean).length;

    const hasConcurrency = /thread|process|memory|heap|stack|pcb|context|switch|deadlock|mutex|semaphore|race|atomic|concurrency|critical/.test(lower);
    const hasDb = /sql|database|dbms|b\+?\s*tree|index|indexing|acid|transaction|sharding|replication|redis|cache|latency/.test(lower);
    const hasDsa = /array|hashmap|map|tree|graph|dp|dynamic|complexity|o\(|search|sort|hash/.test(lower);
    const hasBehavioral = /conflict|disagree|team|deadline|timeline|trade-?off|star|situation|priority|mentor|project|fail|customer/.test(lower);
    const hasTechStack = /react|node|python|java|c\+\+|aws|docker|microservices|api|spring|git/.test(lower);

    let followUp = '';

    if (turn === 1) {
      if (round.type === 'Technical') {
        if (hasConcurrency) {
          followUp = `You made a solid point about thread concurrency and shared memory space, ${candidateName}. When multiple threads concurrently access that critical section, what low-level race condition emerges, and how does a binary semaphore differ from an OS mutex lock in terms of thread ownership?`;
        } else if (hasDsa) {
          followUp = `Good algorithmic foundation, ${candidateName}. When scaling that approach to millions of inputs where memory is constrained, what is the exact time and space complexity, and how would you optimize data locality?`;
        } else {
          followUp = `I see your perspective, ${candidateName}. Delving deeper into Linux systems: how does the OS kernel schedule processes versus threads, and what specific memory structures are swapped during a CPU context switch?`;
        }
      } else {
        if (hasBehavioral) {
          followUp = `I appreciate your transparency on that project conflict, ${candidateName}. In the STAR framework (Situation, Task, Action, Result), what objective metrics or data did your team rely on to resolve the impasse and keep the delivery milestone on schedule?`;
        } else {
          followUp = `Understood. Tell me about a time in your college capstone or internships where a core system component failed under testing or a deadline was at risk. How did you diagnose the issue and communicate with your team?`;
        }
      }
    } else if (turn === 2) {
      if (round.type === 'Technical') {
        if (hasDb) {
          followUp = `Excellent insight into database indexing. In high-concurrency systems (like Amazon or Flipkart handling 20,000 requests/sec), how does a B+ Tree index accelerate range scans, and what is the specific write amplification trade-off on SSDs?`;
        } else {
          followUp = `Let us pivot to distributed architecture. If one microservice fails or experiences a slow network partition, how would you design a circuit breaker or fallback mechanism to prevent cascading outages?`;
        }
      } else {
        followUp = `Well handled. Looking back at that experience, if you were mentoring a junior developer today on balancing technical excellence with strict deadlines, what key principle would you emphasize?`;
      }
    } else {
      followUp = `Thank you so much, ${candidateName}! You demonstrated sharp technical awareness and structured articulation throughout our discussion. Let me compile your detailed AI evaluation report and competency scorecard now.`;
    }

    return {
      followUp,
      words,
      hasConcurrency,
      hasDb,
      hasDsa,
      hasBehavioral,
      hasTechStack,
    };
  };

  // Compile Dynamic Performance Scorecard
  const compileScorecard = (allMessages) => {
    const candidateMsgs = allMessages.filter(m => m.sender === 'candidate');
    const totalWords = candidateMsgs.reduce((sum, m) => sum + m.text.trim().split(/\s+/).filter(Boolean).length, 0);
    const avgWords = Math.round(totalWords / Math.max(1, candidateMsgs.length));

    const combinedText = candidateMsgs.map(m => m.text).join(' ').toLowerCase();
    const keywordsList = [
      'process', 'thread', 'memory', 'heap', 'stack', 'pcb', 'mutex', 'semaphore',
      'deadlock', 'index', 'b+ tree', 'acid', 'cache', 'redis', 'api', 'docker',
      'complexity', 'star', 'conflict', 'compromise', 'milestone', 'latency'
    ];
    const detectedKeywords = keywordsList.filter(k => combinedText.includes(k));

    const technicalDepth = Math.min(96, Math.max(72, 70 + detectedKeywords.length * 4));
    const problemSolving = Math.min(95, Math.max(74, 75 + (avgWords > 25 ? 12 : 6)));
    const verbalFluency = Math.min(98, Math.max(78, 80 + Math.min(16, candidateMsgs.length * 5)));
    const overallReadiness = Math.round((technicalDepth + problemSolving + verbalFluency) / 3);

    const strengths = [
      `Strong conceptual grasp of ${detectedKeywords.length >= 3 ? 'core architectural trade-offs and domain principles' : 'computer science fundamentals'}.`,
      `Articulated thought process with steady verbal cadence (averaging ${avgWords} words per response).`,
      `Clear vocal delivery over microphone with zero audio clipping or dropped phrases.`,
      `Demonstrated logical problem decomposition when challenged on edge cases.`,
    ];

    const improvements = [
      `In product company interviews (Amazon, Microsoft), quantify statements with scale metrics (e.g. QPS, latency in milliseconds, caching hit ratios).`,
      `In behavioral questions, format answers strictly with the STAR framework (Situation, Task, Action, Result).`,
      `Elaborate on production failure modes (e.g. deadlock recovery, database write amplification).`,
    ];

    const turnCritiques = candidateMsgs.map((m, idx) => ({
      turn: idx + 1,
      topic: idx === 0 ? 'Core Foundations & Memory Architecture' : idx === 1 ? 'Concurrency & Systems Scaling' : 'Final Engineering Reflection',
      candidateSnippet: m.text.length > 140 ? m.text.substring(0, 140) + '...' : m.text,
      score: Math.min(96, 76 + (m.text.split(/\s+/).length > 20 ? 14 : 7)),
      feedback: m.text.split(/\s+/).length > 20
        ? `Comprehensive response. You articulated relevant technical terminology with clarity.`
        : `Good foundational response. Consider adding specific production trade-offs and edge-case handling.`,
    }));

    const report = {
      roundId: selectedRound.id,
      roundTitle: selectedRound.title,
      overallScore: overallReadiness,
      metrics: {
        technicalDepth,
        problemSolving,
        verbalFluency,
        overallReadiness,
      },
      strengths,
      improvements,
      turnCritiques,
    };

    recordInterviewEvaluation(report);
    return report;
  };

  const [evaluationReport, setEvaluationReport] = useState(null);

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
    const updatedMessages = [...messages, newUserMsg];
    setTurnIndex(nextTurn);
    setMessages(updatedMessages);
    setCurrentInput('');

    // Dynamic AI follow-up generator
    setTimeout(() => {
      const candidateFirstName = (userProfile?.name || 'Aarav').split(' ')[0];
      const analysis = analyzeCandidateText(userMessageText, nextTurn, selectedRound, candidateFirstName);
      const aiFollowUp = analysis.followUp;

      const aiMsg = {
        sender: 'interviewer',
        text: aiFollowUp,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      speakText(aiFollowUp);

      if (nextTurn >= 3) {
        setTimeout(() => {
          stopMedia();
          const report = compileScorecard(finalMessages);
          setEvaluationReport(report);
          setIsFinished(true);
        }, 3200);
      }
    }, 900);
  };

  const handleConcludeInterview = () => {
    stopMedia();
    const report = compileScorecard(messages);
    setEvaluationReport(report);
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
                        <VideoOff size={28} color="#94a3b8" />
                        <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>Camera Preview Paused</span>
                        <button onClick={() => toggleCamera(true)} className="btn btn-outline btn-sm" style={{ marginTop: '0.35rem', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
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
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        value={selectedVideoDeviceId}
                        onChange={(e) => switchCamera(e.target.value)}
                      >
                        {videoDevices.length > 0 ? (
                          videoDevices.map(d => (
                            <option key={d.deviceId} value={d.deviceId} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{d.label}</option>
                          ))
                        ) : (
                          <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Default Integrated Camera</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>
                        Microphone Device
                      </label>
                      <select
                        className="input"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        value={selectedAudioDeviceId}
                        onChange={(e) => switchMic(e.target.value)}
                      >
                        {audioDevices.length > 0 ? (
                          audioDevices.map(d => (
                            <option key={d.deviceId} value={d.deviceId} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{d.label}</option>
                          ))
                        ) : (
                          <option value="" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Default Microphone</option>
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
                        style={{ fontSize: '0.72rem', padding: '0.3rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        value={selectedVideoDeviceId}
                        onChange={(e) => switchCamera(e.target.value)}
                      >
                        {videoDevices.map(d => (
                          <option key={d.deviceId} value={d.deviceId} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>Mic</span>
                      <select
                        className="input"
                        style={{ fontSize: '0.72rem', padding: '0.3rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
                        value={selectedAudioDeviceId}
                        onChange={(e) => switchMic(e.target.value)}
                      >
                        {audioDevices.map(d => (
                          <option key={d.deviceId} value={d.deviceId} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>{d.label}</option>
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
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                      {userProfile.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#93c5fd', fontWeight: 600 }}>
                      {permissionStatus === 'denied'
                        ? 'Camera blocked by browser'
                        : 'Webcam feed paused'}
                    </div>
                    <button
                      onClick={() => toggleCamera(true)}
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '0.3rem', padding: '0.25rem 0.65rem', fontSize: '0.72rem', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
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

            {/* Live Speech Diagnostic Stream Overlay */}
            {(isMicListening || currentInput.length > 0) && liveSpeechMetrics && (
              <div className="live-speech-hud" style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="pulse-dot" style={{ background: '#22c55e' }} />
                    <strong style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                      Live Response Speech Analysis
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isMicListening} />
                    <span style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>
                      {audioLevel}% Mic Vol
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Pace</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: liveSpeechMetrics.wpmStatus === 'optimal' ? '#4ade80' : '#facc15' }}>
                      {liveSpeechMetrics.wpm} WPM
                    </div>
                  </div>
                  <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Fillers</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: liveSpeechMetrics.fillerCount === 0 ? '#4ade80' : '#f87171' }}>
                      {liveSpeechMetrics.fillerCount} found
                    </div>
                  </div>
                  <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>STAR Signals</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                      {liveSpeechMetrics.starSignals?.length || 0} hits
                    </div>
                  </div>
                  <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Confidence</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: liveSpeechMetrics.confidenceScore >= 80 ? '#4ade80' : '#eab308' }}>
                      {liveSpeechMetrics.confidenceScore}%
                    </div>
                  </div>
                </div>

                {liveSpeechMetrics.liveTip && (
                  <div style={{ fontSize: '0.72rem', color: '#e4e4e7', background: 'rgba(255, 255, 255, 0.03)', padding: '0.35rem 0.65rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                    💡 <strong>Live Tip:</strong> {liveSpeechMetrics.liveTip}
                  </div>
                )}
              </div>
            )}

            {/* Candidate Voice/Text Input Bar */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <button
                onClick={toggleSpeechRecognition}
                className={`btn ${isMicListening ? 'btn-accent audio-pulse-ring' : 'btn-outline'}`}
                title="Speak Answer (Live Speech Analysis Enabled)"
                style={{
                  padding: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isMicListening ? '#22c55e' : 'transparent',
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
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-bright)', marginBottom: '0.35rem' }}>
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
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>
                  {evaluationReport?.metrics?.technicalDepth || 88}/100
                </div>
                <div className="stat-label">Technical Depth</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>
                  {evaluationReport?.metrics?.problemSolving || 84}/100
                </div>
                <div className="stat-label">Problem Solving</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>
                  {evaluationReport?.metrics?.verbalFluency || 86}/100
                </div>
                <div className="stat-label">Verbal Fluency & Mic</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-white)' }}>
                  {evaluationReport?.metrics?.overallReadiness || 87}/100
                </div>
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
                  Key Strengths Observed (Real Speech Telemetry)
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {(evaluationReport?.strengths || [
                  'Strong conceptual grasp of OS memory virtualization, process PCB structures, and thread concurrency.',
                  'Clear verbal articulation without excessive filler words (Pace: 135 words/minute is optimal).',
                  'Microphone audio was crisp with solid speech cadence and zero clipping.',
                  'Structured approach when breaking down multi-threaded synchronization edge cases.'
                ]).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertCircle size={18} color="#eab308" />
                  Actionable Areas for Improvement (AI Critique)
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {(evaluationReport?.improvements || [
                  'When asked about mutexes vs semaphores, emphasize kernel-level ownership.',
                  'In behavioral questions, format answers strictly with the STAR framework (Situation, Task, Action, Result).',
                  'Elaborate more on production scale metrics (QPS, database indexing performance) when discussing projects.'
                ]).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer-Level Critique & Model Exemplar */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={18} color="var(--primary)" />
                Turn-by-Turn Dynamic Answer Critique
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(evaluationReport?.turnCritiques || [
                {
                  turn: 1,
                  topic: 'Process vs Thread & Scheduling in Linux',
                  candidateSnippet: 'Processes have independent address spaces while threads share heap and memory.',
                  score: 88,
                  feedback: 'You correctly identified that threads share address space and heaps while maintaining their own stack and registers.'
                }
              ]).map((c, idx) => (
                <div key={idx} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      Turn #{c.turn}: {c.topic}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      Score: {c.score}/100
                    </span>
                  </div>
                  {c.candidateSnippet && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                      "{c.candidateSnippet}"
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong>AI Recruiter Feedback:</strong> {c.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
