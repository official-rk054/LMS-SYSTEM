import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Calendar,
  CreditCard,
  FileCheck,
  Award,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Phone,
  PhoneOff,
  Activity,
  ShieldCheck,
  Settings,
  Volume2,
  VolumeX,
  Radio,
  Gauge,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GROUP_DISCUSSION_TOPICS, APTITUDE_FLASHCARDS, ALUMNI_MENTORS } from '../data/mockData';
import { useMediaConnectivity } from '../hooks/useMediaConnectivity';
import {
  analyzeSpeechInRealTime,
  LiveSpeechRecognizer,
  playNaturalTTS
} from '../services/liveSpeechAnalyzer';
import {
  generateGdReactions,
  evaluateGdContribution,
  orchestrator,
} from '../services/gemini';

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

export const ExtraFeaturesSuite = ({ userProfile, initialTool = 'gd' }) => {
  const [activeTool, setActiveTool] = useState(initialTool);

  useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  // GD state
  const [selectedGdTopic, setSelectedGdTopic] = useState(GROUP_DISCUSSION_TOPICS[0]);
  const [gdMessages, setGdMessages] = useState([
    { sender: 'Moderator AI', text: `Welcome participants to this Group Discussion on: "${GROUP_DISCUSSION_TOPICS[0].topic}". You have 10 minutes. Please begin the discussion.`, time: '00:01' },
    { sender: 'Rohan (DTU Delhi)', text: GROUP_DISCUSSION_TOPICS[0].participants[0].initialOpinion, time: '00:25' },
    { sender: 'Priya (PICT Pune)', text: GROUP_DISCUSSION_TOPICS[0].participants[1].initialOpinion, time: '01:10' },
    { sender: 'Aditya (VIT Vellore)', text: GROUP_DISCUSSION_TOPICS[0].participants[2].initialOpinion, time: '02:05' },
  ]);
  const [candidateGdInput, setCandidateGdInput] = useState('');
  const [isGdMicListening, setIsGdMicListening] = useState(false);
  const [gdEvaluation, setGdEvaluation] = useState(null);

  // Live Speech & TTS Real-Time Analysis state
  const [activeTtsSpeaker, setActiveTtsSpeaker] = useState(null);
  const [activeTtsInfo, setActiveTtsInfo] = useState(null);
  const [liveSpeechMetrics, setLiveSpeechMetrics] = useState(null);
  const [speechElapsedSecs, setSpeechElapsedSecs] = useState(0);
  const recognizerRef = useRef(null);
  const fluencyRecognizerRef = useRef(null);

  // Fluency Analyzer state
  const [speechText, setSpeechText] = useState('');
  const [isFluencyRecording, setIsFluencyRecording] = useState(false);
  const [fluencyReport, setFluencyReport] = useState(null);
  const [liveFluencyMetrics, setLiveFluencyMetrics] = useState(null);
  const [fluencyError, setFluencyError] = useState('');
  const fluencyTranscriptRef = useRef('');
  const fluencyElapsedRef = useRef(0);

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock Placement Drive & Offer Letter state
  const [driveStage, setDriveStage] = useState('idle'); // 'idle', 'round1', 'round2', 'round3', 'offered'
  const [showOfferLetter, setShowOfferLetter] = useState(false);

  // Alumni Live Call Modal state
  const [activeMentorCall, setActiveMentorCall] = useState(null);

  // Media connectivity hook
  const {
    stream,
    isCameraActive,
    isMicActive,
    audioLevel,
    isSpeaking,
    startMedia,
    stopMedia,
    toggleCamera,
    toggleMic,
    retryPermission,
  } = useMediaConnectivity({ autoStart: false });

  const gdVideoRef = useRef(null);
  const mentorCallVideoRef = useRef(null);

  // Attach stream to video elements
  useEffect(() => {
    if (gdVideoRef.current && stream && isCameraActive) {
      gdVideoRef.current.srcObject = stream;
      gdVideoRef.current.play().catch(e => console.warn('GD video play error:', e));
    }
    if (mentorCallVideoRef.current && stream && isCameraActive) {
      mentorCallVideoRef.current.srcObject = stream;
      mentorCallVideoRef.current.play().catch(e => console.warn('Mentor video play error:', e));
    }
  }, [stream, isCameraActive, activeTool, activeMentorCall]);

  // Clean up media when switching away
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  // Handle Candidate GD Entry (Multi-Agent Gemini Simulation & Evaluation)
  const handleSendGdPoint = async () => {
    if (!candidateGdInput.trim()) return;

    const userEntry = {
      sender: `${userProfile.name} (Candidate)`,
      text: candidateGdInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...gdMessages, userEntry];
    setGdMessages(updated);
    const pointText = candidateGdInput.trim();
    setCandidateGdInput('');

    // 1. Evaluate candidate's intervention via Gemini GDAgent
    try {
      const evalRes = await evaluateGdContribution({
        topic: selectedGdTopic.topic,
        candidateName: userProfile.name,
        candidateArgument: pointText,
      });

      if (evalRes.success && evalRes.evaluation) {
        setGdEvaluation(evalRes.evaluation);
      } else {
        // Fallback evaluation
        setGdEvaluation({
          entryTimingScore: 92,
          argumentDepthScore: 88,
          collaborationScore: 90,
          verdict: 'Constructive Intervention: You addressed the discussion prompt and presented structured reasoning.',
          feedbackPoints: [
            'Polite delivery and timely intervention.',
            'Citing quantitative benchmark metrics will strengthen your argument further.',
            'Encourage peers to synthesize on your point.',
          ],
        });
      }
    } catch (_) {}

    // 2. Synthesize dynamic reactions from other debate participants reacting directly
    try {
      const reactRes = await generateGdReactions({
        topic: selectedGdTopic.topic,
        chatHistory: updated,
        candidateName: userProfile.name,
        candidateArgument: pointText,
      });

      if (reactRes.success && Array.isArray(reactRes.reactions) && reactRes.reactions.length > 0) {
        reactRes.reactions.forEach((r, idx) => {
          setTimeout(() => {
            setGdMessages(prev => [
              ...prev,
              {
                sender: r.sender,
                text: r.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                tone: r.tone || 'Conversational',
              },
            ]);
          }, (idx + 1) * 750);
        });
        return;
      }
    } catch (_) {}

    // Fallback peer response
    setTimeout(() => {
      setGdMessages(prev => [
        ...prev,
        {
          sender: 'Moderator AI',
          text: `Well articulated by ${userProfile.name}. Bringing up institutional upskilling bridges the gap nicely. Rohan, how do you counter that?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  // Natural TTS playback with active speaker highlighting & tone analysis
  const handlePlayGdMessageTts = (msg) => {
    let speakerKey = null;
    let speakerRole = '';
    let tone = 'Analytical & Structured';

    if (msg.sender.includes('Rohan')) {
      speakerKey = 'Rohan';
      speakerRole = 'Aggressive Debater (DTU Delhi)';
      tone = 'Challenging & Direct';
    } else if (msg.sender.includes('Priya')) {
      speakerKey = 'Priya';
      speakerRole = 'Constructive Collaborator (PICT Pune)';
      tone = 'Collaborative & Evidence-Based';
    } else if (msg.sender.includes('Aditya')) {
      speakerKey = 'Aditya';
      speakerRole = 'Strategic Balancer (VIT Vellore)';
      tone = 'Pragmatic & Synthesizing';
    } else if (msg.sender.includes('Moderator')) {
      speakerKey = 'Moderator AI';
      speakerRole = 'Placement Evaluation Moderator';
      tone = 'Authoritative & Guiding';
    } else {
      speakerKey = userProfile.name;
      speakerRole = 'Candidate';
      tone = 'Articulate & Persuasive';
    }

    // Toggle stop if already playing this speaker
    if (activeTtsSpeaker === speakerKey) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActiveTtsSpeaker(null);
      setActiveTtsInfo(null);
      return;
    }

    setActiveTtsSpeaker(speakerKey);
    setActiveTtsInfo({
      speaker: msg.sender,
      role: speakerRole,
      tone,
      snippet: msg.text.slice(0, 120) + (msg.text.length > 120 ? '...' : '')
    });

    playNaturalTTS(msg.text, {
      rate: 1.05,
      pitch: speakerKey === 'Priya' ? 1.15 : 0.98,
      onStart: () => {},
      onEnd: () => {
        setActiveTtsSpeaker(null);
        setActiveTtsInfo(null);
      },
      onError: () => {
        setActiveTtsSpeaker(null);
        setActiveTtsInfo(null);
      }
    });
  };

  // Toggle GD Speech Recognition with Live Diagnostic Analysis
  const toggleGdSpeech = async () => {
    if (isGdMicListening) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsGdMicListening(false);
      return;
    }

    // Acquire or verify audio mic stream
    try {
      await startMedia({ audio: true, video: isCameraActive });
    } catch (err) {
      console.warn('Audio media permission check:', err);
    }

    if (!recognizerRef.current) {
      recognizerRef.current = new LiveSpeechRecognizer({
        onTranscript: ({ transcript, elapsedSeconds }) => {
          setCandidateGdInput(transcript);
          setSpeechElapsedSecs(elapsedSeconds);
          const metrics = analyzeSpeechInRealTime(transcript, elapsedSeconds, {
            keywords: ['curriculum', 'governance', 'AI', 'upskilling', 'integration', 'automation', 'nasscom', 'skills', 'engineering']
          });
          setLiveSpeechMetrics(metrics);
        },
        onStateChange: ({ isListening }) => {
          setIsGdMicListening(isListening);
          if (!isListening && !candidateGdInput) {
            setLiveSpeechMetrics(null);
          }
        },
        onError: (err) => {
          console.warn('Live Speech Error:', err);
          setIsGdMicListening(false);
        }
      });
    }

    const started = recognizerRef.current.start({ lang: 'en-IN', continuous: true });
    if (!started) {
      alert('Microphone speech recognition could not start. Please ensure microphone permissions are granted in your browser.');
    }
  };

  // Live Speech Recording for Fluency Analyzer with Real-Time Metrics
  const toggleFluencyRecording = async () => {
    if (isFluencyRecording) {
      if (fluencyRecognizerRef.current) fluencyRecognizerRef.current.stop();
      return;
    }

    setFluencyError('');
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setFluencyError('Microphone access requires a secure page. Open this app on localhost or over HTTPS.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setFluencyError('This browser does not provide microphone access. Use a current version of Chrome, Edge, or Firefox.');
      return;
    }
    try {
      const mediaStream = await startMedia({ audio: true, video: false, throwOnError: true });
      if (!mediaStream) {
        setFluencyError('Could not access your microphone. Check browser permissions, or paste a transcript below.');
        return;
      }
    } catch (err) {
      const mediaMessages = {
        NotAllowedError: 'Microphone permission is blocked. Allow microphone access for this site in your browser settings, then retry.',
        PermissionDeniedError: 'Microphone permission is blocked. Allow microphone access for this site in your browser settings, then retry.',
        NotFoundError: 'No microphone was found. Connect or enable a microphone, then retry.',
        DevicesNotFoundError: 'No microphone was found. Connect or enable a microphone, then retry.',
        NotReadableError: 'The microphone is busy or unavailable. Close other apps using it, then retry.',
        TrackStartError: 'The microphone is busy or unavailable. Close other apps using it, then retry.'
      };
      setFluencyError(mediaMessages[err.name] || err.message || 'Could not access your microphone. Check browser permissions, or paste a transcript below.');
      return;
    }
    setSpeechText('');
    fluencyTranscriptRef.current = '';
    fluencyElapsedRef.current = 0;
    setFluencyReport(null);
    setLiveFluencyMetrics(null);

    if (!fluencyRecognizerRef.current) {
      fluencyRecognizerRef.current = new LiveSpeechRecognizer({
        onTranscript: ({ transcript, elapsedSeconds }) => {
          fluencyTranscriptRef.current = transcript;
          fluencyElapsedRef.current = elapsedSeconds;
          setSpeechText(transcript);
          const metrics = analyzeSpeechInRealTime(transcript, elapsedSeconds);
          setLiveFluencyMetrics(metrics);
        },
        onStateChange: ({ isListening, error }) => {
          setIsFluencyRecording(isListening);
          if (!isListening) {
            if (fluencyTranscriptRef.current.trim()) {
              handleAnalyzeFluency(fluencyTranscriptRef.current, fluencyElapsedRef.current);
            } else if (error === 'no-speech') {
              setFluencyError('No speech was transcribed. Check that your microphone is selected and enabled, then try speaking again.');
            } else if (!error) {
              setFluencyError('No speech was transcribed. Speak clearly for a few seconds, or paste a transcript below.');
            }
            stopMedia();
          }
        },
        onError: (err) => {
          console.warn('Fluency mic error:', err);
          const messages = {
            'not-allowed': 'Microphone access was blocked. Allow microphone access in your browser settings and try again.',
            'permission-denied': 'Microphone access was blocked. Allow microphone access in your browser settings and try again.',
            'service-not-allowed': 'Speech recognition is unavailable for this page. Try Chrome or Edge, or paste a transcript below.',
            'audio-capture': 'No microphone was found. Connect a microphone or paste a transcript below.',
            'network': 'The browser speech recognition service could not connect. Check your connection or paste a transcript below.',
            'aborted': 'Speech recognition was interrupted. Start recording again or paste a transcript below.',
            'no-speech': 'No speech detected yet. Speak clearly for a few seconds; you can also paste a transcript below.'
          };
          setFluencyError(messages[err.error] || err.message || 'Speech recognition could not start. You can still analyze a pasted transcript.');
        }
      });
    }

    const started = fluencyRecognizerRef.current.start({ lang: 'en-IN', continuous: true });
    if (!started) {
      stopMedia();
      setFluencyError('Live speech recognition is not supported in this browser. Try Chrome or Edge, or paste a transcript below.');
      return;
    }
    setIsFluencyRecording(true);
  };

  // Analyze Fluency
  const handleAnalyzeFluency = (text = speechText, elapsedSeconds = 0) => {
    const cleanText = text.trim();
    if (!cleanText) {
      setFluencyError('Add or record a few sentences before analyzing your speech.');
      setFluencyReport(null);
      return;
    }
    const estimatedSeconds = Math.max(2, cleanText.split(/\s+/).length / 2);
    const metrics = analyzeSpeechInRealTime(cleanText, elapsedSeconds || estimatedSeconds);
    const suggestions = [];
    if (metrics.fillerCount) suggestions.push(`Replace filler words (${metrics.fillersFound.map(item => `“${item.word}”`).join(', ')}) with a brief pause.`);
    if (elapsedSeconds && metrics.wpmStatus === 'fast') suggestions.push('Slow down slightly and leave a short pause between key ideas.');
    if (elapsedSeconds && metrics.wpmStatus === 'slow' && metrics.wordCount > 6) suggestions.push('Build a steadier pace with complete, connected sentences.');
    if (!metrics.assertiveSignals.length) suggestions.push('Use specific action verbs and evidence to make your points sound more confident.');
    if (metrics.wordCount < 30) suggestions.push('Try a 30–60 second response for a more reliable pace estimate.');
    if (!suggestions.length) suggestions.push('Strong delivery signals. Keep this pace and support your points with specific examples.');
    setFluencyReport({
      fillerCount: metrics.fillerCount,
      fillersFound: metrics.fillersFound,
      wordsCount: metrics.wordCount,
      clarityScore: metrics.clarityScore,
      wpm: elapsedSeconds ? metrics.wpm : null,
      wpmStatus: elapsedSeconds ? metrics.wpmStatus : 'unmeasured',
      confidenceScore: metrics.confidenceScore,
      suggestions
    });
    setFluencyError('');
  };

  // End-to-End Mock Drive Progression
  const handleStartDrive = () => {
    setDriveStage('round1');
    setTimeout(() => {
      setDriveStage('round2');
      setTimeout(() => {
        setDriveStage('round3');
        setTimeout(() => {
          setDriveStage('offered');
          setShowOfferLetter(true);
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // Start Alumni 1-on-1 Call
  const handleStartAlumniCall = async (mentor) => {
    setActiveMentorCall(mentor);
    try {
      await startMedia({ video: true, audio: true });
    } catch (err) {
      console.warn('Mentor video start error:', err);
    }
  };

  const handleEndAlumniCall = () => {
    stopMedia();
    setActiveMentorCall(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="#a855f7" />
          Campus Acceleration Supercharged Suite
        </h2>
        <p style={{ fontSize: '0.85rem' }}>
          Specialized preparation tools requested by top placement trainers: AI Group Discussions with video/mic connectivity, Speech Fluency, 30-Day Roadmaps, Flashcards, and Drive Simulations.
        </p>

        {/* Tool Navigation Tabs */}
        <div className="tabs-nav" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
          <button className={`tab-btn ${activeTool === 'gd' ? 'active' : ''}`} onClick={() => setActiveTool('gd')}>
            <Users size={15} /> AI Group Discussion (GD)
          </button>
          <button className={`tab-btn ${activeTool === 'fluency' ? 'active' : ''}`} onClick={() => setActiveTool('fluency')}>
            <Mic size={15} /> Fluency & Speech Analyzer
          </button>
          <button className={`tab-btn ${activeTool === 'plan' ? 'active' : ''}`} onClick={() => setActiveTool('plan')}>
            <Calendar size={15} /> 30-Day Weak Area Plan
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          Tool 1: AI Group Discussion Simulator with Live Video & Mic
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'gd' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Roundtable Video Presence Strip (Universal High-Contrast Stage) */}
          <div className="video-conference-stage">
            {/* Candidate Live Tile */}
            <div className={`video-participant-tile ${isSpeaking || isGdMicListening ? 'speaking' : ''}`}>
              {stream && isCameraActive ? (
                <video
                  ref={gdVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="media-video-feed"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>🎓</div>
                  <div className="video-participant-name">You ({userProfile.name})</div>
                  <button
                    onClick={() => startMedia({ video: true, audio: true })}
                    className="btn btn-sm"
                    style={{
                      background: '#ffffff',
                      color: '#09090b',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.68rem',
                      marginTop: '6px',
                      borderRadius: '4px',
                    }}
                  >
                    Turn On Video
                  </button>
                </div>
              )}

              {/* Candidate bottom HUD */}
              <div className="video-participant-hud">
                <span className={isSpeaking ? 'video-status-active' : 'video-status-listening'}>
                  <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isGdMicListening} />
                  <span>You {isSpeaking ? '🎙️ Speaking' : ''}</span>
                </span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button onClick={() => toggleCamera()} className="btn btn-ghost btn-sm" style={{ padding: '2px', color: '#ffffff' }} title="Toggle Video">
                    {isCameraActive ? <Video size={12} color="#22c55e" /> : <VideoOff size={12} color="var(--text-danger)" />}
                  </button>
                  <button onClick={() => toggleMic()} className="btn btn-ghost btn-sm" style={{ padding: '2px', color: '#ffffff' }} title="Toggle Microphone">
                    {isMicActive ? <Mic size={12} color="#22c55e" /> : <MicOff size={12} color="var(--text-danger)" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Participant 1: Rohan */}
            <div className={`video-participant-tile ${activeTtsSpeaker === 'Rohan' ? 'speaking' : ''}`}>
              <div style={{ fontSize: '2rem' }}>👨‍💻</div>
              <div className="video-participant-name">Rohan</div>
              <div className="video-participant-college">DTU Delhi</div>
              <div className="video-participant-hud">
                <span className={activeTtsSpeaker === 'Rohan' ? 'video-status-active' : 'video-status-listening'}>
                  <span style={{ fontSize: '0.65rem' }}>{activeTtsSpeaker === 'Rohan' ? '●' : '○'}</span>
                  <span>{activeTtsSpeaker === 'Rohan' ? 'Active Speaker' : 'Active'}</span>
                </span>
                <span className={activeTtsSpeaker === 'Rohan' ? 'video-status-active' : 'video-status-listening'}>
                  {activeTtsSpeaker === 'Rohan' ? (
                    <>
                      <LiveAudioBarMeter level={75} active={true} />
                      <span>🎙️ Speaking</span>
                    </>
                  ) : (
                    <span>🎧 Listening</span>
                  )}
                </span>
              </div>
            </div>

            {/* Simulated Participant 2: Priya */}
            <div className={`video-participant-tile ${activeTtsSpeaker === 'Priya' ? 'speaking' : ''}`}>
              <div style={{ fontSize: '2rem' }}>👩‍🎓</div>
              <div className="video-participant-name">Priya</div>
              <div className="video-participant-college">PICT Pune</div>
              <div className="video-participant-hud">
                <span className={activeTtsSpeaker === 'Priya' ? 'video-status-active' : 'video-status-listening'}>
                  <span style={{ fontSize: '0.65rem' }}>{activeTtsSpeaker === 'Priya' ? '●' : '○'}</span>
                  <span>{activeTtsSpeaker === 'Priya' ? 'Active Speaker' : 'Active'}</span>
                </span>
                <span className={activeTtsSpeaker === 'Priya' ? 'video-status-active' : 'video-status-listening'}>
                  {activeTtsSpeaker === 'Priya' ? (
                    <>
                      <LiveAudioBarMeter level={70} active={true} />
                      <span>🎙️ Speaking</span>
                    </>
                  ) : (
                    <span>🎧 Listening</span>
                  )}
                </span>
              </div>
            </div>

            {/* Simulated Participant 3: Aditya */}
            <div className={`video-participant-tile ${activeTtsSpeaker === 'Aditya' ? 'speaking' : ''}`}>
              <div style={{ fontSize: '2rem' }}>👨‍💼</div>
              <div className="video-participant-name">Aditya</div>
              <div className="video-participant-college">VIT Vellore</div>
              <div className="video-participant-hud">
                <span className={activeTtsSpeaker === 'Aditya' ? 'video-status-active' : 'video-status-listening'}>
                  <span style={{ fontSize: '0.65rem' }}>{activeTtsSpeaker === 'Aditya' ? '●' : '○'}</span>
                  <span>{activeTtsSpeaker === 'Aditya' ? 'Active Speaker' : 'Active'}</span>
                </span>
                <span className={activeTtsSpeaker === 'Aditya' ? 'video-status-active' : 'video-status-listening'}>
                  {activeTtsSpeaker === 'Aditya' ? (
                    <>
                      <LiveAudioBarMeter level={65} active={true} />
                      <span>🎙️ Speaking</span>
                    </>
                  ) : (
                    <span>🎧 Listening</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Active Live TTS Speaker Subtitle & Tone HUD */}
          {activeTtsInfo && (
            <div
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, rgba(14, 14, 18, 0.95) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b', fontWeight: 800 }}>
                  <Volume2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Speaking: {activeTtsInfo.speaker}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.64rem' }}>{activeTtsInfo.tone}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '2px' }}>
                    "{activeTtsInfo.snippet}"
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                  setActiveTtsSpeaker(null);
                  setActiveTtsInfo(null);
                }}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-danger)', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
              >
                <VolumeX size={14} /> Stop Audio
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.4fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
            {/* Discussion Room Chat */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '560px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-bright)' }}>
                    Topic: {selectedGdTopic.topic}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {selectedGdTopic.category} • Live WebRTC Presence Active
                  </span>
                </div>
                <span className="badge badge-success">Live Room Active</span>
              </div>

              {/* Conversation Log */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {gdMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: msg.sender.includes('Candidate') ? 'rgba(255, 255, 255, 0.06)' : msg.sender.includes('Moderator') ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      border: msg.sender.includes('Candidate') ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: msg.sender.includes('Candidate') ? '#fafafa' : '#e4e4e7', marginBottom: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {msg.sender}
                        {activeTtsSpeaker && msg.sender.includes(activeTtsSpeaker) && (
                          <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                            🎙️ Speaking
                          </span>
                        )}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handlePlayGdMessageTts(msg)}
                          className="btn btn-ghost btn-sm"
                          style={{
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.68rem',
                            color: activeTtsSpeaker && msg.sender.includes(activeTtsSpeaker) ? '#22c55e' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title="Listen with Natural Voice TTS"
                        >
                          <Volume2 size={12} />
                          {activeTtsSpeaker && msg.sender.includes(activeTtsSpeaker) ? 'Pause' : 'Listen'}
                        </button>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>{msg.time}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-Time Live Speech Analysis HUD */}
              {(isGdMicListening || candidateGdInput.length > 0) && liveSpeechMetrics && (
                <div className="live-speech-hud" style={{ marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="pulse-dot" style={{ background: '#22c55e' }} />
                      <strong style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                        Real-Time Speech Diagnostic Stream
                      </strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isGdMicListening} />
                      <span style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>
                        {audioLevel}% Vol
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Words / Sec</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>{liveSpeechMetrics.wordCount} words</div>
                    </div>

                    <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Pace (WPM)</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: liveSpeechMetrics.wpmStatus === 'optimal' ? 'var(--text-success)' : liveSpeechMetrics.wpmStatus === 'fast' ? 'var(--text-danger)' : '#facc15' }}>
                        {liveSpeechMetrics.wpm} WPM
                      </div>
                    </div>

                    <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Filler Words</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: liveSpeechMetrics.fillerCount === 0 ? 'var(--text-success)' : '#facc15' }}>
                        {liveSpeechMetrics.fillerCount} detected
                      </div>
                    </div>

                    <div style={{ padding: '0.45rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.64rem', color: '#a1a1aa' }}>Confidence</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: liveSpeechMetrics.confidenceScore >= 80 ? 'var(--text-success)' : '#eab308' }}>
                        {liveSpeechMetrics.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  {liveSpeechMetrics.liveTip && (
                    <div style={{ fontSize: '0.72rem', color: '#e4e4e7', background: 'rgba(255, 255, 255, 0.03)', padding: '0.35rem 0.65rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                      💡 <strong>Live Coaching:</strong> {liveSpeechMetrics.liveTip}
                    </div>
                  )}
                </div>
              )}

              {/* Candidate Entry Input with Voice & Text */}
              <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                <button
                  onClick={toggleGdSpeech}
                  className={`btn ${isGdMicListening ? 'btn-accent audio-pulse-ring' : 'btn-outline'}`}
                  title="Speak via Microphone (Live Analysis Enabled)"
                  style={{ padding: '0.65rem', background: isGdMicListening ? '#22c55e' : 'transparent', color: isGdMicListening ? '#09090b' : 'inherit' }}
                >
                  {isGdMicListening ? <Mic className="pulse-dot" size={17} /> : <Mic size={17} />}
                </button>
                <input
                  type="text"
                  className="input"
                  placeholder={isGdMicListening ? '🎙️ Listening live... Speak your viewpoint now' : 'Pitch your viewpoint or counter someone\'s point (or click mic)...'}
                  value={candidateGdInput}
                  onChange={(e) => {
                    setCandidateGdInput(e.target.value);
                    if (e.target.value) {
                      const metrics = analyzeSpeechInRealTime(e.target.value, 15, {
                        keywords: ['curriculum', 'governance', 'AI', 'upskilling', 'integration', 'automation', 'nasscom', 'skills']
                      });
                      setLiveSpeechMetrics(metrics);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendGdPoint();
                  }}
                />
                <button onClick={handleSendGdPoint} className="btn btn-primary" disabled={!candidateGdInput.trim()}>
                  <Send size={15} /> Speak Point
                </button>
              </div>
            </div>

            {/* AI GD Evaluator & Feedback */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Award size={18} color="var(--primary)" />
                    AI GD Evaluator & Scoring Matrix
                  </h3>
                </div>

                {gdEvaluation ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="grid-3">
                      <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>{gdEvaluation.entryTimingScore}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Entry Timing</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-bright)' }}>{gdEvaluation.argumentDepthScore}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Argument Depth</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-bright)' }}>{gdEvaluation.collaborationScore}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Collaboration</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', color: '#fafafa', border: '1px solid var(--border-subtle)' }}>
                      <strong>Verdict:</strong> {gdEvaluation.verdict}
                    </div>

                    <div>
                      <h5 style={{ fontSize: '0.8rem', color: 'var(--text-bright)', marginBottom: '0.4rem' }}>Key Observations:</h5>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {gdEvaluation.feedbackPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                    Speak or type a point in the discussion room to trigger live AI evaluation on your entry timing, argument validity, and active listening skills.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          Tool 2: Communication & Fluency Analyzer with Live Mic
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'fluency' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Mic size={18} color="var(--primary)" />
                Communication & English Fluency Evaluator
              </h3>

              {/* Live Mic Recording CTA */}
              <button
                onClick={toggleFluencyRecording}
                className={`btn ${isFluencyRecording ? 'btn-accent audio-pulse-ring' : 'btn-outline'} btn-sm`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {isFluencyRecording ? <MicOff size={14} /> : <Mic size={14} />}
                {isFluencyRecording ? 'Stop recording' : 'Start recording'}
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Record a short answer or paste a transcript. Review your speaking pace, filler words, clarity, and confidence cues.
            </p>

            {fluencyError && (
              <div role="alert" style={{ marginBottom: '1rem', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(248, 113, 113, 0.35)', background: 'rgba(127, 29, 29, 0.18)', color: '#fecaca', fontSize: '0.82rem' }}>
                {fluencyError}
              </div>
            )}

            {/* Live Audio Visualizer when recording */}
            {isFluencyRecording && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(9, 9, 11, 0.85)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <span className="pulse-dot" style={{ background: 'var(--text-success)' }}></span>
                  Recording • Speak naturally, then stop when finished
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LiveAudioBarMeter level={audioLevel} active={true} />
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{audioLevel}% Vol</span>
                </div>
              </div>
            )}

            {/* Real-Time Live Speech Metrics HUD during Recording */}
            {isFluencyRecording && liveFluencyMetrics && (
              <div className="live-speech-hud" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Words</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{liveFluencyMetrics.wordCount}</div>
                  </div>
                  <div style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Pace</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: liveFluencyMetrics.wpmStatus === 'optimal' ? 'var(--text-success)' : '#facc15' }}>
                      {liveFluencyMetrics.wpm} WPM
                    </div>
                  </div>
                  <div style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Fillers</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: liveFluencyMetrics.fillerCount === 0 ? 'var(--text-success)' : 'var(--text-danger)' }}>
                      {liveFluencyMetrics.fillerCount}
                    </div>
                  </div>
                  <div style={{ padding: '0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Confidence</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-success)' }}>
                      {liveFluencyMetrics.confidenceScore}%
                    </div>
                  </div>
                </div>
                {liveFluencyMetrics.liveTip && (
                  <div style={{ fontSize: '0.7rem', color: '#e4e4e7', background: 'rgba(255, 255, 255, 0.04)', padding: '0.35rem 0.65rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                    💡 <strong>Live Tip:</strong> {liveFluencyMetrics.liveTip}
                  </div>
                )}
              </div>
            )}

            <textarea
              className="textarea"
              rows={8}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Paste or type a response here, or start recording to transcribe your speech…"
              aria-label="Speech transcript to analyze"
              disabled={isFluencyRecording}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <span style={{ alignSelf: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>{speechText.trim() ? `${speechText.trim().split(/\s+/).length} words` : 'No transcript yet'}</span>
              <button onClick={() => handleAnalyzeFluency()} className="btn btn-primary" disabled={!speechText.trim() || isFluencyRecording}>
                Analyze speech
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FileCheck size={18} color="#22c55e" />
                Fluency Metrics & Recommendations
              </h3>
            </div>

            {fluencyReport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem' }}>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#22c55e', fontSize: '1.5rem' }}>{fluencyReport.clarityScore}%</div>
                      <div className="stat-label">Clarity Index</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#eab308', fontSize: '1.5rem' }}>{fluencyReport.fillerCount}</div>
                      <div className="stat-label">Filler Words</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: 'var(--text-bright)', fontSize: '1.5rem' }}>{fluencyReport.wordsCount}</div>
                      <div className="stat-label">Total Words</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#38bdf8', fontSize: '1.5rem' }}>{fluencyReport.wpm ?? '—'}</div>
                      <div className="stat-label">Words / min</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge badge-success">Confidence {fluencyReport.confidenceScore}%</span>
                  <span className="badge">Pace: {fluencyReport.wpmStatus === 'optimal' ? 'steady' : fluencyReport.wpmStatus === 'fast' ? 'fast' : fluencyReport.wpmStatus === 'slow' ? 'slow' : 'not measured'}</span>
                  {fluencyReport.fillersFound.map(item => <span key={item.word} className="badge">“{item.word}” × {item.count}</span>)}
                  {!fluencyReport.fillersFound.length && <span className="badge badge-success">No filler words detected</span>}
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <h5 style={{ fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-bright)' }}>
                    Actionable Polish Suggestions:
                  </h5>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {fluencyReport.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                Your analysis will appear here with delivery metrics and tailored practice tips.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          Tool 3: End-to-End Placement Drive Simulation & Official Offer Letter
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'mock_drive' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Award size={18} color="var(--primary)" />
                End-to-End On-Campus Placement Drive Simulation
              </h3>
              <p style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Experience the complete 3-round campus process: Round 1 (Online Assessment) → Round 2 (Technical DSA) → Round 3 (HR & Leadership) → Official Offer Letter Generation!
              </p>
            </div>

            <button onClick={handleStartDrive} className="btn btn-primary" disabled={driveStage !== 'idle' && driveStage !== 'offered'}>
              {driveStage === 'idle' ? 'Start Mock Campus Drive' : driveStage === 'offered' ? 'Simulate Another Drive' : 'Drive in Progress...'}
            </button>
          </div>

          {/* Drive Stages Pipeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round1' || driveStage === 'round2' || driveStage === 'round3' || driveStage === 'offered' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📝</div>
              <strong>Round 1: Online Assessment</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Aptitude + Coding OA</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round2' || driveStage === 'round3' || driveStage === 'offered' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>💻</div>
              <strong>Round 2: Technical DSA</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Live Algorithms & Systems</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round3' || driveStage === 'offered' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🤝</div>
              <strong>Round 3: HR & Leadership</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Cultural Fit & Fitment</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'offered' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🎉</div>
              <strong>Official Offer Letter</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Campus Selection</div>
            </div>
          </div>

          {/* Downloadable / Printable Offer Letter */}
          {showOfferLetter && (
            <div
              style={{
                background: '#ffffff',
                color: '#09090b',
                padding: '2.5rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1.5rem',
                border: '2px solid #27272a',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              id="printable-offer-letter"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #09090b', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', color: '#09090b', margin: 0, fontWeight: 800 }}>AMAZON DEVELOPMENT CENTRE INDIA</h2>
                  <div style={{ fontSize: '0.8rem', color: '#52525b' }}>Brigade Gateway, Bengaluru, Karnataka, India</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>CAMPUS RECRUITMENT 2026</span>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Ref: AMZN-IND-CAMPUS-2026-SDE1</div>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#27272a' }}>
                <p><strong>Dear {userProfile.name},</strong></p>
                <p style={{ marginTop: '0.5rem' }}>
                  Following your exceptional performance in the Campus Recruitment Drive held at <strong>{userProfile.college}</strong>, Amazon India is pleased to extend an offer of employment for the position of <strong>Software Development Engineer 1 (SDE-1)</strong>.
                </p>
                <div style={{ background: '#f4f4f5', padding: '1rem', borderRadius: '6px', margin: '1rem 0', color: '#09090b' }}>
                  <div><strong>Annual Total Compensation (CTC):</strong> ₹44,50,000 (44.5 LPA)</div>
                  <div><strong>Base Salary:</strong> ₹16,50,000 per annum</div>
                  <div><strong>Joining Bonus (Year 1):</strong> ₹9,50,000</div>
                  <div><strong>Restricted Stock Units (RSUs):</strong> ₹18,50,000 vested over 4 years</div>
                  <div><strong>Joining Location:</strong> Bengaluru / Hyderabad, India</div>
                </div>
                <p>We look forward to welcoming you to Amazon and building the future together!</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e4e4e7' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#09090b' }}>Authorized Signatory</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>University Talent Acquisition, Amazon India</div>
                </div>
                <button onClick={() => window.print()} className="btn btn-primary btn-sm no-print">
                  <Download size={14} /> Download & Print Official Offer Letter
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          Tool 4: Aptitude Shortcuts Flashcards
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="card"
            style={{
              width: '100%',
              maxWidth: '600px',
              minHeight: '260px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              background: isFlipped ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)',
              border: isFlipped ? '2px solid #ffffff' : '1px solid var(--border-subtle)',
              transition: 'var(--transition)',
            }}
          >
            <span className="badge badge-warning" style={{ marginBottom: '1rem' }}>
              {APTITUDE_FLASHCARDS[currentCardIdx].topic} • Click to Flip
            </span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-bright)', marginBottom: '0.75rem' }}>
              {isFlipped ? '💡 Formula & Shortcut Trick' : APTITUDE_FLASHCARDS[currentCardIdx].front}
            </h3>
            <div style={{ fontSize: '0.9rem', color: isFlipped ? '#fafafa' : 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {isFlipped ? APTITUDE_FLASHCARDS[currentCardIdx].back : 'Tap to reveal quick calculation formula'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx(prev => (prev > 0 ? prev - 1 : APTITUDE_FLASHCARDS.length - 1));
              }}
              className="btn btn-outline btn-sm"
            >
              Previous Card
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
              {currentCardIdx + 1} of {APTITUDE_FLASHCARDS.length}
            </span>
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx(prev => (prev < APTITUDE_FLASHCARDS.length - 1 ? prev + 1 : 0));
              }}
              className="btn btn-primary btn-sm"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          Tool 5: 30-Day Weak Area Placement Plan
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'plan' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} color="var(--primary)" />
              Personalized 30-Day Placement Sprint Plan
            </h3>
            <span className="badge badge-success">Target: Amazon & TCS Digital</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)', marginBottom: '0.35rem' }}>Week 1: Aptitude & Speed Math</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Master Time & Work, Percentages, and Syllogisms. Complete 2 timed sectional mocks daily.</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)', marginBottom: '0.35rem' }}>Week 2: High-Yield DSA (Trees & DP)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solve 20 high-frequency dynamic programming and graph problems. Focus on space-optimized state transitions.</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)', marginBottom: '0.35rem' }}>Week 3: Core CS & Low-Level Design</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deep dive into OS Paging, Deadlocks, SQL Indexing, and OOP design patterns (Factory, Singleton, Observer).</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-bright)', marginBottom: '0.35rem' }}>Week 4: Mock Drives & Leadership Principles</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Conduct 3 AI voice mock interviews, refine resume impact bullets, and rehearse STAR method anecdotes.</p>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          Tool 6: Alumni Mentors with Live 1-on-1 Video & Mic Room
          ═════════════════════════════════════════════════════════════ */}
      {activeTool === 'alumni' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MessageCircle size={18} color="var(--primary)" />
              Alumni Mentorship Network (Indian Tech Pioneers)
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            Connect with recent campus alumni working at Amazon, Flipkart, Infosys, and Google for live 1-on-1 video & mic guidance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {ALUMNI_MENTORS.map((m) => (
              <div key={m.id} style={{ padding: '1.15rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.8rem' }}>{m.avatar}</div>
                    <span className="badge badge-success">{m.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-bright)', margin: 0 }}>{m.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.role} • {m.company}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{m.collegeBatch} • CTC: {m.packageCTC}</div>
                </div>

                <button onClick={() => handleStartAlumniCall(m)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Video size={14} /> Request 1-on-1 Video Session
                </button>
              </div>
            ))}
          </div>

          {/* 1-on-1 Alumni Video Modal */}
          {activeMentorCall && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '750px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Video size={18} color="#22c55e" />
                      1-on-1 Mentorship Session: {activeMentorCall.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {activeMentorCall.role} at {activeMentorCall.company} • WebRTC Live Audio/Video Room
                    </span>
                  </div>
                  <span className="badge badge-success">Live Session</span>
                </div>

                {/* 2-Pane Video Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Mentor Window */}
                  <div style={{ height: '230px', background: '#09090b', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.15)', position: 'relative' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{activeMentorCall.avatar}</div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{activeMentorCall.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#93c5fd', fontWeight: 600 }}>{activeMentorCall.company}</div>
                    <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.7rem', background: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-success)', fontWeight: 600, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      🟢 Audio Connected
                    </div>
                  </div>

                  {/* Candidate Real Webcam Window */}
                  <div style={{ height: '230px', background: '#09090b', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stream && isCameraActive ? (
                      <video
                        ref={mentorCallVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="media-video-feed"
                      />
                    ) : (
                      <div className="media-video-placeholder">
                        <VideoOff size={24} color="#94a3b8" />
                        <span style={{ fontSize: '0.78rem', color: '#ffffff' }}>Camera Off</span>
                        <button onClick={() => toggleCamera(true)} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                          Turn On
                        </button>
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.7rem', background: 'rgba(0,0,0,0.75)', padding: '2px 8px', borderRadius: '4px', color: isSpeaking ? 'var(--text-success)' : '#e4e4e7', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600 }}>
                      You ({userProfile.name}) {isSpeaking ? '• 🎙️ Speaking' : ''}
                    </div>
                  </div>
                </div>

                {/* Call Control Strip */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => toggleCamera()} className={`media-control-pill ${isCameraActive ? 'active' : 'muted'}`}>
                    {isCameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                    {isCameraActive ? 'Camera On' : 'Camera Off'}
                  </button>
                  <button onClick={() => toggleMic()} className={`media-control-pill ${isMicActive ? 'active' : 'muted'}`}>
                    {isMicActive ? <Mic size={14} /> : <MicOff size={14} />}
                    {isMicActive ? 'Mic Unmuted' : 'Mic Muted'}
                  </button>
                  <button onClick={handleEndAlumniCall} className="btn btn-outline btn-sm" style={{ borderColor: '#ef4444', color: 'var(--text-danger)' }}>
                    <PhoneOff size={14} /> End Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
