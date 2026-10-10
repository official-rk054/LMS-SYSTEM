import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ShieldAlert,
  Volume1,
  AlertTriangle,
  Eye,
  EyeOff,
  XCircle,
  FileText,
  CheckCircle,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Keyboard,
  FastForward,
  Check
} from 'lucide-react';
import { MOCK_INTERVIEW_SESSIONS } from '../data/mockData';
import { useMediaConnectivity } from '../hooks/useMediaConnectivity';
import { recordInterviewEvaluation } from '../services/authDatabase';
import {
  generateInterviewQuestion,
  generateInterviewScorecard,
  orchestrator,
} from '../services/gemini';
import {
  analyzeSpeechInRealTime,
  LiveSpeechRecognizer,
  playNaturalTTS
} from '../services/liveSpeechAnalyzer';
import { GazeAttentionProctor, playProctorSound } from '../services/gazeProctorAgent';

// Audio VU Bar Meter Component
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

export const MockInterviewer = ({ userProfile = {} }) => {
  const candidateName = userProfile?.name || 'Aarav Sharma';
  const candidateFirstName = candidateName.split(' ')[0];

  // 1. Session Navigation & State
  const [selectedRound, setSelectedRound] = useState(MOCK_INTERVIEW_SESSIONS[0]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1200); // 20 mins default
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);

  // 2. Hardware Pre-Check & Device Settings
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [isPreCheckActive, setIsPreCheckActive] = useState(false);

  // 3. Conversation & Question Flow
  const [messages, setMessages] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [currentAiQuestion, setCurrentAiQuestion] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(() => orchestrator.getStatus().hasKey);

  useEffect(() => {
    return orchestrator.subscribe(status => {
      setHasGeminiKey(status.hasKey);
    });
  }, []);

  // 4. Live Audio Input & Real-Time Interpretation
  const [isMicListening, setIsMicListening] = useState(false);
  const [liveSpokenTranscript, setLiveSpokenTranscript] = useState('');
  const [liveInterimSnippet, setLiveInterimSnippet] = useState('');
  const [liveSpeechMetrics, setLiveSpeechMetrics] = useState(null);
  const [candidateAnswerText, setCandidateAnswerText] = useState('');
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'type'
  const [speechErrorNotice, setSpeechErrorNotice] = useState(null);
  const liveRecognizerRef = useRef(null);
  const speechSecondsRef = useRef(0);
  const speechTimerIntervalRef = useRef(null);
  const ttsTimeoutRef = useRef(null);

  // Accumulated speech telemetry across the entire interview
  const sessionTranscriptsRef = useRef([]);
  const sessionFillersRef = useRef({});
  const sessionPaceSamplesRef = useRef([]);

  // 5. Gaze & Attention Proctoring (3-Strike System)
  const proctorRef = useRef(null);
  const [gazeAttentionState, setGazeAttentionState] = useState({
    status: 'focused',
    strikes: 0,
    lookAwaySeconds: 0,
    attentionPercentage: 100,
    reason: '',
  });
  const [proctorWarning, setProctorWarning] = useState(null); // { level: 1|2, message, infraction, strikes }
  const [isTerminatedByProctor, setIsTerminatedByProctor] = useState(false);
  const [terminationInfo, setTerminationInfo] = useState(null);
  const [proctorInfractions, setProctorInfractions] = useState([]);

  // 6. Real Performance Evaluation Report
  const [evaluationReport, setEvaluationReport] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const candidateVideoRef = useRef(null);
  const previewVideoRef = useRef(null);

  // WebRTC Media Connectivity
  const {
    stream,
    isCameraActive,
    isMicActive,
    permissionStatus,
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

  // Bind WebRTC stream to video elements
  useEffect(() => {
    if (candidateVideoRef.current) {
      if (stream && isCameraActive) {
        candidateVideoRef.current.srcObject = stream;
        candidateVideoRef.current.play().catch(e => console.warn('Candidate video play:', e));
      } else {
        candidateVideoRef.current.srcObject = null;
      }
    }
  }, [stream, isCameraActive, isInterviewActive]);

  useEffect(() => {
    if (previewVideoRef.current) {
      if (stream && isCameraActive) {
        previewVideoRef.current.srcObject = stream;
        previewVideoRef.current.play().catch(e => console.warn('Preview video play:', e));
      } else {
        previewVideoRef.current.srcObject = null;
      }
    }
  }, [stream, isCameraActive, isPreCheckActive]);

  // Clean up media and speech recognition on unmount
  useEffect(() => {
    return () => {
      stopMedia();
      if (proctorRef.current) proctorRef.current.stop();
      if (liveRecognizerRef.current) liveRecognizerRef.current.stop();
      if (speechTimerIntervalRef.current) clearInterval(speechTimerIntervalRef.current);
    };
  }, [stopMedia]);

  // Session countdown timer
  useEffect(() => {
    let interval = null;
    if (isInterviewActive && !isFinished && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            handleConcludeInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, isFinished, timerSeconds]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─────────────────────────────────────────────────────────────
  // ANSWER INPUT & REAL-TIME SPEECH/TYPING METRICS
  // ─────────────────────────────────────────────────────────────
  const handleUpdateAnswerText = (text) => {
    setCandidateAnswerText(text);
    if (!text.trim()) {
      setLiveSpeechMetrics(null);
      return;
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const roundKeywords = selectedRound?.keywordsExpected || [];
    const simulatedElapsed = Math.max(1, speechSecondsRef.current || Math.round(words / 2.2));
    const metrics = analyzeSpeechInRealTime(text, simulatedElapsed, { keywords: roundKeywords });
    setLiveSpeechMetrics(metrics);
  };

  // ─────────────────────────────────────────────────────────────
  // SPEECH RECOGNITION & AUTOMATIC MIC ACTIVATION
  // ─────────────────────────────────────────────────────────────
  const startSpeechRecognition = async () => {
    if (isFinished || isTerminatedByProctor) return;

    try {
      await startMedia({ audio: true, video: isCameraActive });
    } catch (e) {
      console.warn('Microphone permission check error:', e);
    }

    speechSecondsRef.current = 0;
    if (speechTimerIntervalRef.current) clearInterval(speechTimerIntervalRef.current);
    speechTimerIntervalRef.current = setInterval(() => {
      speechSecondsRef.current += 1;
    }, 1000);

    const roundKeywords = selectedRound?.keywordsExpected || [];

    if (!liveRecognizerRef.current) {
      liveRecognizerRef.current = new LiveSpeechRecognizer({
        onTranscript: ({ transcript, interim }) => {
          setLiveSpokenTranscript(transcript);
          setLiveInterimSnippet(interim);
          setCandidateAnswerText(transcript);

          const metrics = analyzeSpeechInRealTime(
            transcript,
            Math.max(1, speechSecondsRef.current),
            { keywords: roundKeywords }
          );
          setLiveSpeechMetrics(metrics);

          if (metrics.wpm > 0) {
            sessionPaceSamplesRef.current.push(metrics.wpm);
          }

          if (metrics.fillersFound) {
            metrics.fillersFound.forEach(f => {
              sessionFillersRef.current[f.word] = Math.max(
                sessionFillersRef.current[f.word] || 0,
                f.count
              );
            });
          }
        },
        onStateChange: ({ isListening }) => {
          setIsMicListening(isListening);
          if (!isListening) {
            setLiveInterimSnippet('');
            if (speechTimerIntervalRef.current) clearInterval(speechTimerIntervalRef.current);
          }
        },
        onError: (err) => {
          console.warn('Speech recognition error:', err);
          setIsMicListening(false);
          const errCode = err?.error || err?.message || 'network';
          if (errCode === 'network' || errCode === 'not-allowed' || errCode === 'service-not-allowed') {
            setSpeechErrorNotice(
              '⚠️ Live speech recognition cloud service is unreachable or blocked on this connection. Keyboard Input mode has been enabled so you can type your answers directly without interruption!'
            );
            setInputMode('type');
          }
        },
      });
    }

    const started = liveRecognizerRef.current.start({ lang: 'en-IN', continuous: true });
    if (started) {
      setIsMicListening(true);
      setSpeechErrorNotice(null);
    }
  };

  const stopSpeechRecognition = () => {
    if (liveRecognizerRef.current) {
      liveRecognizerRef.current.stop();
    }
    if (speechTimerIntervalRef.current) {
      clearInterval(speechTimerIntervalRef.current);
    }
    setIsMicListening(false);
    setLiveInterimSnippet('');
  };

  // Automatically start candidate mic once interviewer ends sentence
  const autoStartMic = () => {
    if (isFinished || isTerminatedByProctor) return;
    if (inputMode === 'type') return; // Do not auto-open mic if user chose typing mode
    // 400ms pause for natural conversational cadence before activating microphone
    setTimeout(() => {
      startSpeechRecognition();
    }, 450);
  };

  // Skip AI voice speaking to answer immediately
  const handleSkipAiSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    setIsAiSpeaking(false);
    if (turnIndex < 3 && inputMode === 'voice') {
      autoStartMic();
    }
  };

  // Text-to-speech helper: speaks interviewer question and automatically triggers mic on conclusion
  const speakText = (text, onComplete = null) => {
    // If mic is currently open, pause it immediately so it doesn't transcribe the AI's question
    stopSpeechRecognition();
    setIsAiSpeaking(true);

    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }

    const onSentenceFinished = () => {
      setIsAiSpeaking(false);
      if (onComplete) {
        onComplete();
      } else {
        // Automatically start the mic once the interviewer ends their sentence!
        autoStartMic();
      }
    };

    if (!speechSynthesisEnabled) {
      // If AI voice output is toggled off, estimate conversational reading time, then auto-activate mic
      const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
      const readingDelay = Math.min(2500, Math.max(1200, Math.round((words / 3.5) * 1000)));
      ttsTimeoutRef.current = setTimeout(() => {
        onSentenceFinished();
      }, readingDelay);
      return;
    }

    let isDone = false;
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    // Safety fallback timeout in case browser drops utterance.onend
    const fallbackMs = Math.max(3000, Math.round((words / 2.0) * 1000) + 1200);

    ttsTimeoutRef.current = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        onSentenceFinished();
      }
    }, fallbackMs);

    playNaturalTTS(text, {
      rate: 1.05,
      pitch: 1.0,
      onEnd: () => {
        if (!isDone) {
          isDone = true;
          if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
          onSentenceFinished();
        }
      },
      onError: () => {
        if (!isDone) {
          isDone = true;
          if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
          onSentenceFinished();
        }
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // START INTERVIEW & ATTACH GAZE PROCTOR
  // ─────────────────────────────────────────────────────────────
  const handleStartInterview = async (round) => {
    setSelectedRound(round);
    setIsInterviewActive(true);
    setIsFinished(false);
    setTimerSeconds(round.durationMinutes * 60);
    setTurnIndex(0);
    setProctorWarning(null);
    setIsTerminatedByProctor(false);
    setTerminationInfo(null);
    setProctorInfractions([]);
    setLiveSpokenTranscript('');
    setCandidateAnswerText('');
    setLiveInterimSnippet('');
    setLiveSpeechMetrics(null);
    setSpeechErrorNotice(null);
    sessionTranscriptsRef.current = [];
    sessionFillersRef.current = {};
    sessionPaceSamplesRef.current = [];

    const starterText = (round.starterPrompt || '').replace(/Aarav/g, candidateFirstName);
    setCurrentAiQuestion(starterText);

    const initialAiMessage = {
      sender: 'interviewer',
      text: starterText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialAiMessage]);
    speakText(starterText);

    // Request webcam and microphone
    try {
      await startMedia({ video: true, audio: true });
    } catch (err) {
      console.warn('Initial media stream start:', err);
    }

    // Initialize Gaze & Attention Proctor
    if (proctorRef.current) {
      proctorRef.current.stop();
    }

    proctorRef.current = new GazeAttentionProctor({
      videoElementRef: candidateVideoRef,
      onGazeChange: (info) => {
        setGazeAttentionState(info);
      },
      onWarning: ({ level, message, infraction, strikes }) => {
        setProctorWarning({ level, message, infraction, strikes });
        setProctorInfractions(prev => [...prev, infraction]);
        // Auto-dismiss warning banner 1 after 8 seconds
        if (level === 1) {
          setTimeout(() => {
            setProctorWarning(w => (w?.level === 1 ? null : w));
          }, 8000);
        }
      },
      onTermination: ({ message, infraction, strikes, infractionsLog }) => {
        setIsTerminatedByProctor(true);
        setTerminationInfo({ message, strikes, infractionsLog });
        setProctorInfractions(infractionsLog);

        // Stop media and audio streams
        stopMedia();
        if (liveRecognizerRef.current) liveRecognizerRef.current.stop();
        setIsMicListening(false);

        // Compile real report with termination audit
        const allTelemetry = {
          totalStrikes: 3,
          maxStrikes: 3,
          isTerminated: true,
          attentionPercentage: Math.max(25, 65 - infractionsLog.length * 10),
          infractionsLog,
        };

        setTimeout(() => {
          concludeAndFinalizeReport(messages, allTelemetry);
        }, 1200);
      },
    });

    // Start proctoring engine
    proctorRef.current.start();
  };

  // Hardware pre-check toggle
  const handleTogglePreCheck = async () => {
    if (isPreCheckActive) {
      stopMedia();
      setIsPreCheckActive(false);
    } else {
      setIsPreCheckActive(true);
      await startMedia({ video: true, audio: true });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // LIVE AUDIO INPUT & SPEECH INTERPRETATION ENGINE
  // ─────────────────────────────────────────────────────────────
  const toggleSpeechRecognition = () => {
    if (isMicListening) {
      stopSpeechRecognition();
    } else {
      setInputMode('voice');
      startSpeechRecognition();
    }
  };

  // Manual or clear reset of spoken response
  const handleClearSpeech = () => {
    setLiveSpokenTranscript('');
    setCandidateAnswerText('');
    setLiveInterimSnippet('');
    setLiveSpeechMetrics(null);
    speechSecondsRef.current = 0;
  };

  // ─────────────────────────────────────────────────────────────
  // QUICK SAMPLE ANSWERS (PER ROUND AND TURN)
  // ─────────────────────────────────────────────────────────────
  const getSampleAnswersForRound = (round, turn) => {
    if (!round) return [];
    if (round.id === 'round_tech') {
      if (turn === 0) {
        return [
          {
            label: 'Process vs Thread (In-Depth)',
            text: 'In Linux, a Process possesses its own independent virtual address space, memory pages (heap, stack, data), and a dedicated Process Control Block (PCB). A Thread is a lightweight execution unit inside a process that shares that address space, heap, and open file descriptors, while maintaining its own registers and stack. The Linux kernel CFS treats both as task_struct entities, but switching between threads minimizes cache and TLB flushing overhead.',
          },
          {
            label: 'Concise Core Summary',
            text: 'Processes are isolated execution environments requiring IPC like pipes or shared memory to communicate. Threads share process memory, allowing high-speed communication but requiring synchronization primitives like mutexes and semaphores to prevent race conditions.',
          },
        ];
      } else if (turn === 1) {
        return [
          {
            label: 'B+ Tree & Concurrency Scaling',
            text: 'A B+ Tree index accelerates range queries by storing data pointers strictly in doubly linked leaf nodes, achieving O(log N) lookups. Under high write concurrency, however, frequent node splits and page rebalancing cause write amplification and lock contention on storage.',
          },
        ];
      } else {
        return [
          {
            label: 'Circuit Breaker & Partition Tolerance',
            text: 'To prevent cascading outages during microservice network partitions, I implement the Circuit Breaker pattern with Closed, Open, and Half-Open states. If downstream errors exceed our error rate threshold, requests fail fast with cached fallbacks to protect system thread pools.',
          },
        ];
      }
    } else if (round.id === 'round_hr') {
      if (turn === 0) {
        return [
          {
            label: 'STAR Conflict Resolution',
            text: 'During our college capstone project, our team disagreed on adopting React vs vanilla templates with only 3 weeks until submission. Using the STAR framework, I organized a comparative benchmark measuring build velocity and reusability, leading us to agree on a lightweight React component structure that shipped two days ahead of schedule.',
          },
        ];
      } else {
        return [
          {
            label: 'Code Quality vs Deadlines',
            text: 'When mentoring developers under tight release schedules, I advocate for writing clean, modular code with unit tests for critical business logic while postponing premature optimizations. Technical debt accumulated today slows down tomorrow\'s velocity.',
          },
        ];
      }
    } else {
      return [
        {
          label: 'Customer Obsession & Root Cause',
          text: 'During our placement portal launch, unindexed queries caused database connection pool exhaustion under 2,000 concurrent students. I quickly initiated a temporary connection throttle, added Redis query caching, and ran a comprehensive 5-Why root cause audit to permanently prevent recurrence.',
        },
      ];
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CONCLUDE AND FINALIZE REPORT (LOCAL + GEMINI)
  // ─────────────────────────────────────────────────────────────
  const concludeAndFinalizeReport = async (finalMessages = messages, customTelemetry = null) => {
    stopMedia();
    if (proctorRef.current) proctorRef.current.stop();
    if (liveRecognizerRef.current) liveRecognizerRef.current.stop();
    setIsMicListening(false);
    setIsAiSpeaking(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const telemetry = customTelemetry || (proctorRef.current
      ? proctorRef.current.getTelemetry()
      : {
          totalStrikes: proctorInfractions.length,
          maxStrikes: 3,
          isTerminated: isTerminatedByProctor,
          attentionPercentage: Math.max(30, 100 - proctorInfractions.length * 15),
          infractionsLog: proctorInfractions,
        });

    const baseReport = compileRealScorecard(finalMessages, telemetry);
    setEvaluationReport(baseReport);
    setIsFinished(true);

    try {
      const scorecardRes = await generateInterviewScorecard({
        roundTitle: selectedRound.title,
        company: selectedRound.company,
        roundType: selectedRound.type,
        candidateName,
        messages: finalMessages,
        telemetry,
      });

      if (scorecardRes.success && scorecardRes.report) {
        const gr = scorecardRes.report;
        setEvaluationReport(prev => {
          const updated = { ...(prev || baseReport) };
          if (gr.overallScore) updated.overallScore = Math.round((updated.overallScore + gr.overallScore) / 2);
          if (gr.technicalScore && updated.metrics) updated.metrics.technicalDepth = gr.technicalScore;
          if (gr.summary) updated.aiSummary = gr.summary;
          if (gr.verdict) updated.aiVerdict = gr.verdict;
          if (Array.isArray(gr.strengths) && gr.strengths.length > 0) {
            updated.strengths = [...gr.strengths, ...updated.strengths.slice(0, 1)];
          }
          if (Array.isArray(gr.improvements) && gr.improvements.length > 0) {
            updated.improvements = [...gr.improvements, ...updated.improvements.slice(0, 1)];
          }
          recordInterviewEvaluation(updated);
          return updated;
        });
      }
    } catch (_) {}
  };

  // ─────────────────────────────────────────────────────────────
  // SUBMIT CANDIDATE SPOKEN OR TYPED RESPONSE & GENERATE AI FOLLOW-UP
  // ─────────────────────────────────────────────────────────────
  const handleSubmitCandidateResponse = async (forcedText = null) => {
    const responseText = (typeof forcedText === 'string' ? forcedText : (candidateAnswerText || liveSpokenTranscript)).trim();
    if (!responseText) return;

    // Immediately stop mic while AI evaluates and speaks the next sentence
    stopSpeechRecognition();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsTimeoutRef.current) {
      clearTimeout(ttsTimeoutRef.current);
      ttsTimeoutRef.current = null;
    }
    setIsAiSpeaking(false);

    const newUserMsg = {
      sender: 'candidate',
      text: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metrics: liveSpeechMetrics ? { ...liveSpeechMetrics } : null,
    };

    sessionTranscriptsRef.current.push({
      turn: turnIndex + 1,
      question: currentAiQuestion,
      answer: responseText,
      metrics: liveSpeechMetrics ? { ...liveSpeechMetrics } : null,
    });

    const nextTurn = turnIndex + 1;
    const updatedMessages = [...messages, newUserMsg];
    setTurnIndex(nextTurn);
    setMessages(updatedMessages);
    setCandidateAnswerText('');
    setLiveSpokenTranscript('');
    setLiveInterimSnippet('');
    setLiveSpeechMetrics(null);
    setSpeechErrorNotice(null);
    speechSecondsRef.current = 0;
    setIsAiThinking(true);

    // Dynamic AI follow-up generator: First try Gemini InterviewAgent, else fallback
    let aiFollowUp = '';
    try {
      const geminiRes = await generateInterviewQuestion({
        roundTitle: selectedRound.title,
        company: selectedRound.company,
        roundType: selectedRound.type,
        turnIndex: nextTurn,
        candidateName: candidateFirstName,
        conversationHistory: updatedMessages,
        candidateAnswer: responseText,
      });

      if (geminiRes.success && geminiRes.question) {
        aiFollowUp = geminiRes.question;
      }
    } catch (_) {}

    if (!aiFollowUp) {
      const analysis = analyzeCandidateText(
        responseText,
        nextTurn,
        selectedRound,
        candidateFirstName
      );
      aiFollowUp = analysis.followUp;
    }

    setIsAiThinking(false);
    setCurrentAiQuestion(aiFollowUp);

    const aiMsg = {
      sender: 'interviewer',
      text: aiFollowUp,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const finalMessages = [...updatedMessages, aiMsg];
    setMessages(finalMessages);

    if (nextTurn >= 3) {
      // Conclude after 3 full turns: AI speaks closing reflection, then compile scorecard
      speakText(aiFollowUp, () => {
        concludeAndFinalizeReport(finalMessages);
      });
    } else {
      // Turn 1 and 2: speak follow-up question
      speakText(aiFollowUp);
    }
  };

  // Adaptive Question Generator based on Candidate's Actual Spoken Words
  const analyzeCandidateText = (userText, turn, round, candidateName) => {
    const lower = userText.toLowerCase();
    const words = userText.trim().split(/\s+/).filter(Boolean).length;

    const hasConcurrency = /thread|process|memory|heap|stack|pcb|context|switch|deadlock|mutex|semaphore|race|atomic|concurrency|critical/.test(lower);
    const hasDb = /sql|database|dbms|b\+?\s*tree|index|indexing|acid|transaction|sharding|replication|redis|cache|latency/.test(lower);
    const hasDsa = /array|hashmap|map|tree|graph|dp|dynamic|complexity|o\(|search|sort|hash/.test(lower);
    const hasBehavioral = /conflict|disagree|team|deadline|timeline|trade-?off|star|situation|priority|mentor|project|fail|customer/.test(lower);

    let followUp = '';

    if (turn === 1) {
      if (round.type === 'Technical') {
        if (hasConcurrency) {
          followUp = `You made a solid point about thread concurrency and shared memory, ${candidateName}. When multiple threads concurrently write to that shared structure, what race condition emerges, and how does a binary semaphore differ from a mutex in terms of thread ownership?`;
        } else if (hasDsa) {
          followUp = `Good algorithmic foundation, ${candidateName}. When scaling that solution to millions of streaming items with strict memory limits, what is the exact time and space complexity, and how would you optimize memory cache locality?`;
        } else {
          followUp = `I see your perspective, ${candidateName}. Delving deeper into Linux systems: how does the OS kernel schedule processes versus threads, and what specific memory registers are swapped during a CPU context switch?`;
        }
      } else {
        if (hasBehavioral) {
          followUp = `I appreciate your transparency on that project conflict, ${candidateName}. In the STAR framework (Situation, Task, Action, Result), what objective metrics or data did your team rely on to resolve the disagreement and deliver on schedule?`;
        } else {
          followUp = `Understood. Tell me about a time in your college capstone or internships where a core system component failed under testing or a deadline was at risk. How did you diagnose the issue and communicate with your team?`;
        }
      }
    } else if (turn === 2) {
      if (round.type === 'Technical') {
        if (hasDb) {
          followUp = `Excellent insight into database indexing. In high-concurrency architectures (like Flipkart or Amazon handling 25,000 requests/sec), how does a B+ Tree index accelerate range scans, and what is the specific write amplification trade-off on storage?`;
        } else {
          followUp = `Let us pivot to distributed systems. If one microservice experiences a slow network partition or crashes, how would you design a circuit breaker or fallback mechanism to prevent cascading outages across the cluster?`;
        }
      } else {
        followUp = `Well handled. Looking back at that experience, if you were mentoring a junior developer today on balancing code quality with strict product delivery deadlines, what key principle would you emphasize?`;
      }
    } else {
      followUp = `Thank you so much, ${candidateName}! You demonstrated sharp technical awareness and structured articulation throughout our session. Let me compile your detailed AI evaluation report and competency scorecard now.`;
    }

    return { followUp, words };
  };

  // ─────────────────────────────────────────────────────────────
  // SIMULATE LOOKAWAY TEST BUTTON (FOR DEMO & TESTING)
  // ─────────────────────────────────────────────────────────────
  const simulateLookawayTest = () => {
    if (!proctorRef.current) return;
    const currentStrikes = gazeAttentionState.strikes || 0;
    if (currentStrikes === 0) {
      proctorRef.current.triggerStrike('Simulated Alert: Student diverted gaze off-screen for >3.0s');
    } else if (currentStrikes === 1) {
      proctorRef.current.triggerStrike('Simulated Alert: Off-screen gaze / window unfocused');
    } else {
      proctorRef.current.triggerStrike('Simulated Alert: Third consecutive gaze deviation violation');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CONCLUDE INTERVIEW MANUALLY
  // ─────────────────────────────────────────────────────────────
  const handleConcludeInterview = () => {
    concludeAndFinalizeReport(messages);
  };

  // ─────────────────────────────────────────────────────────────
  // COMPILE REAL REPORT BASED ON SPOKEN RESPONSES & PROCTOR AUDIT
  // ─────────────────────────────────────────────────────────────
  const compileRealScorecard = (allMessages, telemetry = null) => {
    const candidateMsgs = allMessages.filter(m => m.sender === 'candidate');
    const totalWords = candidateMsgs.reduce(
      (sum, m) => sum + m.text.trim().split(/\s+/).filter(Boolean).length,
      0
    );
    const avgWords = Math.round(totalWords / Math.max(1, candidateMsgs.length));

    // Calculate real pacing from samples
    const paceSamples = sessionPaceSamplesRef.current;
    const realAvgPace = paceSamples.length > 0
      ? Math.round(paceSamples.reduce((a, b) => a + b, 0) / paceSamples.length)
      : Math.min(160, Math.max(110, Math.round(totalWords * 3.5)));

    // Calculate real filler words detected across turns
    const combinedCandidateText = candidateMsgs.map(m => m.text).join(' ').toLowerCase();
    const fillersDetected = [];
    let totalFillersCount = 0;
    const commonFillers = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'kind of'];

    commonFillers.forEach(filler => {
      const reg = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = combinedCandidateText.match(reg);
      if (matches && matches.length > 0) {
        fillersDetected.push({ word: filler, count: matches.length });
        totalFillersCount += matches.length;
      }
    });

    // Check actual keywords matched against the round requirements
    const expectedKeywords = selectedRound.keywordsExpected || [];
    const matchedDomainKeywords = expectedKeywords.filter(kw =>
      combinedCandidateText.includes(kw.toLowerCase())
    );

    // Dynamic competency scores based on REAL telemetry
    const keywordBonus = Math.min(25, matchedDomainKeywords.length * 6);
    const lengthBonus = avgWords >= 35 ? 15 : avgWords >= 20 ? 10 : 4;
    const fillerPenalty = Math.min(20, totalFillersCount * 3);

    let technicalDepth = Math.min(98, Math.max(45, 68 + keywordBonus + lengthBonus - fillerPenalty));
    let problemSolving = Math.min(96, Math.max(50, 72 + lengthBonus + (avgWords > 30 ? 10 : 0)));
    let verbalFluency = Math.min(98, Math.max(40, 85 - fillerPenalty + (realAvgPace >= 115 && realAvgPace <= 160 ? 10 : -8)));

    // Proctor telemetry audit & penalty
    const proctorAudit = telemetry || {
      totalStrikes: proctorInfractions.length,
      maxStrikes: 3,
      isTerminated: isTerminatedByProctor,
      attentionPercentage: 98,
      infractionsLog: [...proctorInfractions],
    };

    const isTerminated = proctorAudit.isTerminated || isTerminatedByProctor;
    const strikes = proctorAudit.totalStrikes || proctorInfractions.length;

    let integrityStatus = 'Verified (Exemplary Screen Focus)';
    let integrityScore = 100;

    if (isTerminated || strikes >= 3) {
      integrityStatus = 'Disqualified (3/3 Gaze Infractions — Session Terminated)';
      integrityScore = 30;
      // Cap scores due to academic/interview integrity violation
      technicalDepth = Math.min(50, technicalDepth);
      problemSolving = Math.min(50, problemSolving);
      verbalFluency = Math.min(50, verbalFluency);
    } else if (strikes === 2) {
      integrityStatus = 'Caution Flagged (2 Gaze Warnings)';
      integrityScore = 70;
    } else if (strikes === 1) {
      integrityStatus = 'Minor Warning (1 Gaze Warning)';
      integrityScore = 88;
    }

    let overallReadiness = Math.round(
      (technicalDepth * 0.35 + problemSolving * 0.35 + verbalFluency * 0.2 + integrityScore * 0.1)
    );

    if (isTerminated) {
      overallReadiness = Math.min(42, overallReadiness);
    }

    // Dynamic, truthful strengths derived from real data
    const strengths = [];
    if (matchedDomainKeywords.length > 0) {
      strengths.push(
        `Applied relevant technical terminology (${matchedDomainKeywords.slice(0, 3).join(', ')}) directly to the problem scope.`
      );
    } else {
      strengths.push('Demonstrated willingness to communicate and tackle engineering questions.');
    }

    if (totalFillersCount <= 2 && totalWords > 20) {
      strengths.push(
        `Clear verbal delivery with low crutch word frequency (${totalFillersCount} fillers detected across entire interview).`
      );
    } else {
      strengths.push(`Spoke with steady pacing (averaging ~${realAvgPace} words per minute).`);
    }

    if (avgWords >= 25) {
      strengths.push(
        `Thorough elaboration: averaged ${avgWords} words per response, providing descriptive answers rather than one-word replies.`
      );
    }

    if (strikes === 0) {
      strengths.push('100% Screen Attention: maintained focused eye contact with interviewer throughout.');
    }

    // Dynamic actionable improvements
    const improvements = [];
    if (totalFillersCount > 2) {
      improvements.push(
        `Reduce filler words (${fillersDetected.map(f => `"${f.word}" (${f.count})`).join(', ')}). Practice pausing silently instead of using verbal fillers.`
      );
    }

    if (matchedDomainKeywords.length < expectedKeywords.length) {
      const missing = expectedKeywords.filter(k => !matchedDomainKeywords.includes(k));
      if (missing.length > 0) {
        improvements.push(
          `Incorporate deeper systems terminology such as ${missing.slice(0, 2).map(m => `"${m}"`).join(' and ')} to showcase senior architectural awareness.`
        );
      }
    }

    if (avgWords < 25) {
      improvements.push(
        'Elaborate more deeply on answers. Aim for at least 3-4 structured sentences detailing the context, decision, and technical trade-offs.'
      );
    }

    if (strikes > 0) {
      improvements.push(
        `Screen Focus: Recorded ${strikes} gaze distraction alert${strikes > 1 ? 's' : ''}. In formal campus placement drives, recruiters penalize looking away from the camera.`
      );
    }

    // Real turn-by-turn critiques
    const turnCritiques = candidateMsgs.map((m, idx) => {
      const wordsCount = m.text.trim().split(/\s+/).filter(Boolean).length;
      const snippet = m.text.length > 150 ? m.text.substring(0, 150) + '...' : m.text;
      const score = Math.min(
        98,
        Math.max(50, 70 + (wordsCount >= 30 ? 16 : wordsCount >= 15 ? 8 : 0) - (isTerminated ? 25 : 0))
      );

      let feedback = '';
      if (wordsCount >= 30) {
        feedback = `Comprehensive answer. You clearly articulated relevant domain logic with solid verbal depth.`;
      } else if (wordsCount >= 15) {
        feedback = `Good foundational answer. Consider supplementing your response with concrete scale numbers (latency, throughput, edge cases).`;
      } else {
        feedback = `Brief response. Expand your thought process out loud to show the recruiter your architectural reasoning.`;
      }

      return {
        turn: idx + 1,
        topic:
          idx === 0
            ? 'Core Principles & Domain Fundamentals'
            : idx === 1
            ? 'Deep-Dive Scaling & Concurrency'
            : 'Engineering Reflection & Synthesis',
        candidateSnippet: snippet,
        fullAnswer: m.text,
        wordCount: wordsCount,
        score,
        feedback,
      };
    });

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
      speechTelemetry: {
        totalWords,
        avgWordsPerTurn: avgWords,
        avgPaceWpm: realAvgPace,
        fillerCount: totalFillersCount,
        fillersDetected,
        matchedKeywords: matchedDomainKeywords,
      },
      proctorAudit: {
        ...proctorAudit,
        integrityStatus,
        integrityScore,
      },
      strengths,
      improvements,
      turnCritiques,
    };

    // Save to local database
    recordInterviewEvaluation(report);
    return report;
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER INTERVIEW HUB
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ═════════════════════════════════════════════════════════════
          1. PRE-INTERVIEW SETUP & HARDWARE DIAGNOSTIC
          ═════════════════════════════════════════════════════════════ */}
      {!isInterviewActive && !isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mic color="var(--primary)" />
                  AI Live Mock Interviewer & Proctor
                </h2>
                <p style={{ fontSize: '0.85rem' }}>
                  Real-time microphone interpretation, WebRTC video streaming, and automated gaze proctoring with a strict 3-strike alert policy.
                </p>
              </div>

              <button
                onClick={handleTogglePreCheck}
                className={`btn ${isPreCheckActive ? 'btn-accent' : 'btn-outline'} btn-sm`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Camera size={15} />
                {isPreCheckActive ? 'Close Hardware Diagnostic' : 'Test Camera & Mic'}
              </button>
            </div>

            {/* Hardware Pre-Check Drawer */}
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
                        <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>Webcam Inactive</span>
                        <button onClick={() => toggleCamera(true)} className="btn btn-outline btn-sm" style={{ marginTop: '0.35rem', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                          Enable Camera
                        </button>
                      </div>
                    )}

                    <div className="media-hud-top">
                      <span className="media-hud-badge">
                        <span className="pulse-dot" style={{ width: '6px', height: '6px', background: stream ? '#22c55e' : '#ef4444' }}></span>
                        {stream ? 'Hardware Connected' : 'Camera Off'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => toggleCamera()}
                      className={`media-control-pill ${isCameraActive ? 'active' : 'muted'}`}
                    >
                      {isCameraActive ? <Video size={14} /> : <VideoOff size={14} />}
                      {isCameraActive ? 'Camera On' : 'Camera Off'}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-bright)' }}>Proctoring & Audio Diagnostics</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Make sure your face is well-lit and centered. The proctor monitors attention: looking away from the screen for &gt;3 seconds triggers Warning 1, then Warning 2, and ends the session on the 3rd infraction.
                  </p>

                  <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(0, 0, 0, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Live Mic Level:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isMicActive} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: audioLevel > 20 ? 'var(--text-success)' : 'var(--text-muted)' }}>
                        {audioLevel}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rounds Selector Grid */}
            <div className="grid-3" style={{ marginTop: '1.25rem' }}>
              {MOCK_INTERVIEW_SESSIONS.map((round) => (
                <div
                  key={round.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '2rem' }}>{round.avatar}</div>
                      <span className="badge badge-primary">{round.type}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-bright)' }}>
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
                      ⏱️ {round.durationMinutes} Mins • 🎥 Proctor Active
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
          2. ACTIVE INTERVIEW SESSION SCREEN
          ═════════════════════════════════════════════════════════════ */}
      {isInterviewActive && !isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* PROCTOR WARNING BANNERS (WARNING 1 & WARNING 2) */}
          {proctorWarning && proctorWarning.level === 1 && (
            <div className="proctor-alert-banner warning-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                <span>
                  <strong>⚠️ Proctor Warning (1/2):</strong> Please keep your eyes focused on the screen! Lookaway gaze deviation was detected.
                </span>
              </div>
              <button
                onClick={() => setProctorWarning(null)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              >
                Acknowledge
              </button>
            </div>
          )}

          {proctorWarning && proctorWarning.level === 2 && (
            <div className="proctor-alert-banner warning-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} />
                <span>
                  <strong>⚠️ URGENT FINAL WARNING (2/2):</strong> Off-screen gaze detected! You have 1 strike remaining. A 3rd infraction will IMMEDIATELY terminate this interview and record an integrity breach.
                </span>
              </div>
              <button
                onClick={() => setProctorWarning(null)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#ffffff' }}
              >
                I am looking at screen
              </button>
            </div>
          )}

          {/* TWO-COLUMN LAYOUT: VIDEO & INTERVIEWER (LEFT) vs LIVE AUDIO INTERPRETATION (RIGHT) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(500px, 1.8fr)', gap: '1.25rem' }}>
            {/* LEFT COLUMN: INTERVIEWER & CANDIDATE VIDEO FEED */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Interviewer Persona Card */}
              <div className="card" style={{ padding: '1.1rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    margin: '0 auto 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.4rem',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  {selectedRound.avatar}
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-bright)', marginBottom: '0.2rem' }}>
                  {selectedRound.interviewerName}
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  {selectedRound.type} • Turn {turnIndex + 1} of 3
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${isAiSpeaking ? 'badge-primary' : 'badge-success'}`}>
                    <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>
                    {isAiSpeaking ? 'Interviewer Speaking' : 'Listening to You'}
                  </span>
                  <span className="badge badge-info">
                    Question {turnIndex + 1}/3
                  </span>
                </div>
              </div>

              {/* Candidate Webcam Feed & Proctor Attention HUD */}
              <div className="card" style={{ padding: '0.85rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                    <Video size={15} color="var(--primary)" />
                    Candidate Feed & Proctor
                  </h4>

                  {/* Device toggles */}
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => toggleCamera()}
                      className={`btn btn-ghost btn-sm ${!isCameraActive ? 'text-danger' : ''}`}
                      style={{ padding: '0.2rem 0.4rem' }}
                      title="Toggle Camera"
                    >
                      {isCameraActive ? <Video size={14} color="#22c55e" /> : <VideoOff size={14} color="var(--text-danger)" />}
                    </button>
                    <button
                      onClick={() => toggleMic()}
                      className={`btn btn-ghost btn-sm ${!isMicActive ? 'text-danger' : ''}`}
                      style={{ padding: '0.2rem 0.4rem' }}
                      title="Toggle Mic"
                    >
                      {isMicActive ? <Mic size={14} color="#22c55e" /> : <MicOff size={14} color="var(--text-danger)" />}
                    </button>
                    <button
                      onClick={() => setShowDeviceSettings(!showDeviceSettings)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.2rem 0.4rem' }}
                      title="Settings"
                    >
                      <Settings size={14} />
                    </button>
                    <button
                      onClick={() => setSpeechSynthesisEnabled(!speechSynthesisEnabled)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.2rem 0.4rem' }}
                      title="Toggle AI Voice"
                    >
                      {speechSynthesisEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                  </div>
                </div>

                {/* Device settings drawer */}
                {showDeviceSettings && (
                  <div
                    style={{
                      background: 'rgba(18, 18, 22, 0.95)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.72rem',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>Camera</span>
                        <select
                          className="input"
                          style={{ fontSize: '0.7rem', padding: '0.25rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
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
                          style={{ fontSize: '0.7rem', padding: '0.25rem', height: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)' }}
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

                {/* Video Feed Screen */}
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
                      <div style={{ fontSize: '2rem' }}>🎓</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                        {candidateName}
                      </div>
                      <button
                        onClick={() => toggleCamera(true)}
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '0.3rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {/* Top Overlay Badges: Attention State & Strikes */}
                  <div className="media-hud-top">
                    {gazeAttentionState.status === 'looking_away' ? (
                      <span className="media-hud-badge" style={{ background: 'rgba(239, 68, 68, 0.85)', color: '#ffffff' }}>
                        <EyeOff size={12} /> Diverted: {gazeAttentionState.lookAwaySeconds || '1.0'}s
                      </span>
                    ) : (
                      <span className="media-hud-badge" style={{ background: 'rgba(34, 197, 94, 0.25)', color: 'var(--text-success)' }}>
                        <Eye size={12} /> Screen Focused ({gazeAttentionState.attentionPercentage || 100}%)
                      </span>
                    )}

                    <span
                      className="media-hud-badge"
                      style={{
                        background:
                          proctorInfractions.length >= 2
                            ? 'rgba(239, 68, 68, 0.4)'
                            : proctorInfractions.length === 1
                            ? 'rgba(245, 158, 11, 0.4)'
                            : 'rgba(0, 0, 0, 0.6)',
                        color:
                          proctorInfractions.length >= 2
                            ? 'var(--text-danger)'
                            : proctorInfractions.length === 1
                            ? 'var(--text-warning)'
                            : '#fafafa',
                      }}
                    >
                      <ShieldCheck size={12} /> Strikes: {proctorInfractions.length}/3
                    </span>
                  </div>

                  {/* Bottom Proctor Overlay: Mic Meter & Audio Level */}
                  <div className="media-hud-overlay">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isMicListening} />
                      <span style={{ fontSize: '0.7rem', color: isSpeaking ? 'var(--text-success)' : 'var(--text-muted)' }}>
                        {isSpeaking ? 'Speaking' : `${audioLevel}% Mic`}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                      Pace: {liveSpeechMetrics?.wpm || 135} WPM
                    </span>
                  </div>
                </div>

                {/* Simulate Lookaway Button for instant verification */}
                <div style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={simulateLookawayTest}
                    className="btn btn-outline btn-sm"
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.25rem 0.65rem',
                      borderColor: 'rgba(245, 158, 11, 0.4)',
                      color: 'var(--text-warning)',
                    }}
                    title="Simulate looking away to test Alert 1, Alert 2, and Strike 3 termination"
                  >
                    🧪 Test Lookaway Alert ({proctorInfractions.length}/3)
                  </button>

                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Auto-proctor active (3.0s debounce)
                  </span>
                </div>
              </div>

              {/* Conclude Session Button */}
              <button
                onClick={handleConcludeInterview}
                className="btn btn-outline"
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--text-danger)', fontSize: '0.82rem' }}
              >
                Conclude Interview & Generate Report
              </button>
            </div>

            {/* RIGHT COLUMN: LIVE AUDIO INTERPRETATION AS TEXT NEXT TO VIDEO */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '640px', padding: '1.15rem' }}>
              {/* Header: Session Timer & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={16} color="var(--warning)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Time Remaining: {formatTimer(timerSeconds)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {hasGeminiKey ? (
                    <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.35)', fontSize: '0.7rem', fontWeight: 700 }}>
                      ✨ Gemini 2.5 Active
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', fontSize: '0.7rem', fontWeight: 700 }}>
                      ⚡ Heuristic Fallback
                    </span>
                  )}
                  <span className={`badge ${proctorInfractions.length >= 2 ? 'badge-danger' : 'badge-success'}`}>
                    Proctor: {3 - proctorInfractions.length} Strikes Left
                  </span>
                </div>
              </div>

              {/* AI Thinking Indicator Banner */}
              {isAiThinking && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    color: '#c084fc',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                  }}
                >
                  <Sparkles size={16} className="pulse-dot" />
                  <span>Gemini AI is analyzing your response and formulating dynamic technical probe...</span>
                </div>
              )}

              {/* Current Question Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem 1.1rem',
                  marginBottom: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} />
                    {selectedRound.interviewerName} asks:
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isAiSpeaking && (
                      <button
                        onClick={handleSkipAiSpeaking}
                        className="btn btn-sm btn-accent"
                        style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title="Skip voice and start answering immediately"
                      >
                        <FastForward size={13} /> Skip Voice & Answer Now
                      </button>
                    )}
                    <button
                      onClick={() => speakText(currentAiQuestion)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}
                      title="Replay Voice"
                    >
                      <Volume1 size={13} /> Replay
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#fafafa', fontWeight: 500 }}>
                  {currentAiQuestion}
                </div>

                {selectedRound.keywordsExpected && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Expected Focus:</span>
                    {selectedRound.keywordsExpected.map((kw, i) => (
                      <span key={i} className="badge" style={{ fontSize: '0.66rem', background: 'rgba(255, 255, 255, 0.06)' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE CANDIDATE AUDIO / TYPING INTERPRETATION CONSOLE */}
              <div className="live-interpretation-console" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Status Bar & Input Mode Switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      className="pulse-dot"
                      style={{
                        background: isAiSpeaking ? 'var(--primary)' : isMicListening ? '#22c55e' : '#71717a',
                        boxShadow: isAiSpeaking ? '0 0 8px var(--primary)' : isMicListening ? '0 0 8px #22c55e' : 'none',
                      }}
                    />
                    <strong style={{ fontSize: '0.78rem', color: '#ffffff' }}>
                      {isAiSpeaking
                        ? '🤖 Interviewer Speaking... (Mic activates once done)'
                        : isMicListening
                        ? '🎙️ Mic Active — Transcribing Voice Live'
                        : inputMode === 'type'
                        ? '⌨️ Keyboard Input Mode Active'
                        : '🎙️ Mic Paused — Speak or Type Answer'}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Mode Toggle Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px', padding: '2px' }}>
                      <button
                        onClick={() => {
                          setInputMode('voice');
                          if (!isMicListening && !isAiSpeaking) startSpeechRecognition();
                        }}
                        className={`btn btn-sm ${inputMode === 'voice' ? 'btn-accent' : 'btn-ghost'}`}
                        style={{ padding: '0.18rem 0.55rem', fontSize: '0.7rem', height: 'auto', borderRadius: '4px' }}
                      >
                        <Mic size={12} style={{ marginRight: '3px' }} /> Voice
                      </button>
                      <button
                        onClick={() => {
                          setInputMode('type');
                          stopSpeechRecognition();
                        }}
                        className={`btn btn-sm ${inputMode === 'type' ? 'btn-accent' : 'btn-ghost'}`}
                        style={{ padding: '0.18rem 0.55rem', fontSize: '0.7rem', height: 'auto', borderRadius: '4px' }}
                      >
                        <Keyboard size={12} style={{ marginRight: '3px' }} /> Type
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <LiveAudioBarMeter level={audioLevel} active={isSpeaking || isMicListening} />
                      <span style={{ fontSize: '0.68rem', color: isSpeaking ? 'var(--text-success)' : '#a1a1aa' }}>
                        {audioLevel}% Vol
                      </span>
                    </div>
                  </div>
                </div>

                {/* Speech Error / Guidance Notice (if network/mic blocked) */}
                {speechErrorNotice && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.73rem',
                      color: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                      <span>{speechErrorNotice}</span>
                    </div>
                    <button
                      onClick={() => setSpeechErrorNotice(null)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.1rem 0.35rem', fontSize: '0.68rem', color: '#ffffff' }}
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Dual-Mode Response Workspace */}
                <div
                  className={`live-interpretation-box ${isMicListening ? 'listening' : ''}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '130px',
                    padding: '0.75rem',
                  }}
                >
                  {inputMode === 'type' ? (
                    /* 1. TYPE INPUT MODE */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        <span>⌨️ Type or edit your response below:</span>
                        <span style={{ fontWeight: 600, color: candidateAnswerText.trim() ? '#38bdf8' : 'inherit' }}>
                          {candidateAnswerText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        value={candidateAnswerText}
                        onChange={(e) => handleUpdateAnswerText(e.target.value)}
                        placeholder="Type your structured interview response here... (e.g. explain architectural principles, memory management, concurrency, or use the STAR framework)"
                        className="input"
                        style={{
                          flex: 1,
                          minHeight: '95px',
                          fontSize: '0.84rem',
                          lineHeight: '1.5',
                          resize: 'vertical',
                          background: 'rgba(0, 0, 0, 0.45)',
                          color: '#fafafa',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.65rem',
                        }}
                      />
                    </div>
                  ) : (
                    /* 2. VOICE INPUT MODE WITH EDITABLE MIRROR */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.4rem' }}>
                      {liveSpokenTranscript || liveInterimSnippet || candidateAnswerText ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.35rem' }}>
                          <div style={{ fontSize: '0.84rem', color: '#ffffff', lineHeight: '1.4' }}>
                            <span>{liveSpokenTranscript || candidateAnswerText}</span>
                            {liveInterimSnippet && (
                              <span className="live-interim-text"> {liveInterimSnippet}</span>
                            )}
                            {isMicListening && <span className="live-typing-cursor" />}
                          </div>

                          {/* Editable Text Area to fine-tune spoken words */}
                          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                              <span>✏️ You can edit or add to your response before submitting:</span>
                              <span>{candidateAnswerText.trim().split(/\s+/).filter(Boolean).length} words</span>
                            </div>
                            <textarea
                              value={candidateAnswerText}
                              onChange={(e) => handleUpdateAnswerText(e.target.value)}
                              placeholder="Spoken words sync here. You can edit directly..."
                              className="input"
                              style={{
                                width: '100%',
                                minHeight: '55px',
                                fontSize: '0.78rem',
                                resize: 'vertical',
                                background: 'rgba(0, 0, 0, 0.35)',
                                color: '#ffffff',
                                padding: '0.4rem 0.6rem',
                              }}
                            />
                          </div>
                        </div>
                      ) : isAiSpeaking ? (
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.45rem', textAlign: 'center' }}>
                          <Volume2 className="pulse-dot" size={24} color="var(--primary)" />
                          <span style={{ color: '#fafafa', fontWeight: 600 }}>{selectedRound.interviewerName} is asking a question...</span>
                          <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>Listen carefully, or click "Skip Voice & Answer Now" above to answer immediately.</span>
                        </div>
                      ) : isMicListening ? (
                        <div style={{ color: 'var(--text-success)', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.45rem', textAlign: 'center' }}>
                          <Mic className="pulse-dot" size={24} color="#22c55e" />
                          <span style={{ fontWeight: 700 }}>🎙️ Microphone Listening — Your turn to speak!</span>
                          <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>Speak clearly into your microphone, or switch to Type mode above.</span>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.45rem', textAlign: 'center' }}>
                          <Mic size={24} color="#71717a" />
                          <span>Microphone paused. Click <strong>"Start Mic"</strong> below or switch to <strong>"Type"</strong> mode to enter your answer.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Sample Answer Chips for Instant Practice & Testing */}
                {getSampleAnswersForRound(selectedRound, turnIndex).length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                      padding: '0.35rem 0.55rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '6px',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>💡 Sample Answers:</span>
                    {getSampleAnswersForRound(selectedRound, turnIndex).map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUpdateAnswerText(sample.text)}
                        className="btn btn-outline btn-sm"
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.5rem',
                          height: 'auto',
                          background: 'rgba(56, 189, 248, 0.08)',
                          borderColor: 'rgba(56, 189, 248, 0.35)',
                          color: '#38bdf8',
                        }}
                        title="Click to insert this high-scoring response"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Real-time Telemetry Strip (Pace, Fillers, Keywords, Confidence) */}
                {liveSpeechMetrics && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Pace</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: liveSpeechMetrics.wpmStatus === 'optimal' ? 'var(--text-success)' : '#facc15' }}>
                        {liveSpeechMetrics.wpm} WPM
                      </div>
                    </div>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Fillers</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: liveSpeechMetrics.fillerCount === 0 ? 'var(--text-success)' : 'var(--text-danger)' }}>
                        {liveSpeechMetrics.fillerCount} found
                      </div>
                    </div>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Keywords</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                        {liveSpeechMetrics.matchedKeywords?.length || 0} hits
                      </div>
                    </div>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>Confidence</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: liveSpeechMetrics.confidenceScore >= 80 ? 'var(--text-success)' : '#eab308' }}>
                        {liveSpeechMetrics.confidenceScore}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Coach Guidance Tip */}
                {liveSpeechMetrics?.liveTip && (
                  <div style={{ fontSize: '0.72rem', color: '#e4e4e7', background: 'rgba(255, 255, 255, 0.03)', padding: '0.3rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                    💡 <strong>Coaching:</strong> {liveSpeechMetrics.liveTip}
                  </div>
                )}

                {/* Candidate Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                  {inputMode === 'voice' && (
                    <button
                      onClick={toggleSpeechRecognition}
                      disabled={isAiSpeaking}
                      className={`btn ${isMicListening ? 'btn-accent audio-pulse-ring' : 'btn-outline'}`}
                      style={{
                        flex: 1,
                        minWidth: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        background: isMicListening ? '#22c55e' : 'transparent',
                        color: isMicListening ? '#09090b' : 'inherit',
                        fontWeight: 600,
                        opacity: isAiSpeaking ? 0.75 : 1,
                      }}
                    >
                      {isAiSpeaking ? (
                        <>
                          <Volume1 size={16} />
                          <span>AI Speaking...</span>
                        </>
                      ) : isMicListening ? (
                        <>
                          <Mic className="pulse-dot" size={16} />
                          <span>🎙️ Pause Mic</span>
                        </>
                      ) : (
                        <>
                          <Mic size={16} />
                          <span>🎙️ Start Mic</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleSubmitCandidateResponse()}
                    className="btn btn-primary"
                    disabled={!candidateAnswerText.trim() && !liveSpokenTranscript.trim()}
                    style={{
                      flex: inputMode === 'type' ? 1 : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      fontWeight: 600,
                    }}
                  >
                    <Send size={15} />
                    Submit Answer (Turn {turnIndex + 1}/3)
                  </button>

                  {(candidateAnswerText || liveSpokenTranscript) && (
                    <button
                      onClick={handleClearSpeech}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.5rem', color: 'var(--text-dim)' }}
                      title="Clear Response"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Conversation History Timeline */}
              {messages.length > 1 && (
                <div style={{ marginTop: '0.65rem', maxHeight: '110px', overflowY: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Turn History:</span>
                  {messages.slice(0, -1).map((m, idx) => (
                    <div key={idx} style={{ fontSize: '0.74rem', color: m.sender === 'candidate' ? 'var(--text-success)' : 'var(--text-muted)' }}>
                      <strong>{m.sender === 'candidate' ? 'You' : 'Interviewer'}:</strong> {m.text.length > 90 ? m.text.substring(0, 90) + '...' : m.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          3. POST-INTERVIEW REAL EVALUATION REPORT
          ═════════════════════════════════════════════════════════════ */}
      {isFinished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Main Assessment Header Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 28, 0.9) 0%, rgba(9, 9, 11, 0.98) 100%)',
              borderColor: isTerminatedByProctor ? 'rgba(239, 68, 68, 0.6)' : 'var(--border-glass)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className={`badge ${isTerminatedByProctor ? 'badge-danger' : 'badge-success'}`} style={{ marginBottom: '0.4rem' }}>
                  {isTerminatedByProctor ? '❌ Session Terminated by Proctor' : '✓ Assessment Completed'}
                </span>
                <h2 style={{ fontSize: '1.7rem', color: 'var(--text-bright)', marginBottom: '0.3rem' }}>
                  Real Candidate Interview Performance Evaluation
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Candidate: <strong>{candidateName}</strong> • Evaluated for: <strong>{selectedRound.title}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setIsInterviewActive(false);
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <RotateCcw size={14} /> Practice Another Round
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                >
                  <FileText size={14} /> Export Feedback Report
                </button>
              </div>
            </div>
          </div>

          {/* DISQUALIFICATION / TERMINATION BANNER IF APPLICABLE */}
          {isTerminatedByProctor && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ color: '#ef4444', marginTop: '2px' }}>
                <XCircle size={28} />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-danger)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Integrity Disqualification Notice: 3/3 Gaze Infractions
                </h3>
                <p style={{ color: '#fca5a5', fontSize: '0.82rem', lineHeight: '1.5', margin: 0 }}>
                  This mock interview was terminated automatically because the candidate diverted their gaze away from the screen for &gt;3.0 seconds three separate times. In campus placement drives and enterprise recruitment (Amazon, TCS, Infosys), persistent off-screen eye contact flags potential malpractice.
                </p>
              </div>
            </div>
          )}

          {/* REAL COMPETENCY SCORES GRID */}
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <BarChart2 size={22} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-bright)' }}>
                  {evaluationReport?.metrics?.technicalDepth || 75}/100
                </div>
                <div className="stat-label">Technical Depth</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-bright)' }}>
                  {evaluationReport?.metrics?.problemSolving || 72}/100
                </div>
                <div className="stat-label">Problem Solving</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <UserCheck size={22} />
              </div>
              <div>
                <div className="stat-val" style={{ color: 'var(--text-bright)' }}>
                  {evaluationReport?.metrics?.verbalFluency || 70}/100
                </div>
                <div className="stat-label">Verbal Fluency & Mic</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fafafa' }}>
                <Award size={22} />
              </div>
              <div>
                <div
                  className="stat-val"
                  style={{
                    color: isTerminatedByProctor ? 'var(--text-danger)' : 'var(--text-bright)',
                  }}
                >
                  {evaluationReport?.metrics?.overallReadiness || 72}/100
                </div>
                <div className="stat-label">Placement Readiness</div>
              </div>
            </div>
          </div>

          {/* REAL SPEECH TELEMETRY & PROCTOR INTEGRITY AUDIT CARDS */}
          <div className="grid-2">
            {/* Real Speech Telemetry Breakdown */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Activity size={18} color="var(--primary)" />
                  Real Speech Telemetry Audit
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total Spoken Words</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fafafa' }}>
                    {evaluationReport?.speechTelemetry?.totalWords || 0}
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Speaking Pace</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {evaluationReport?.speechTelemetry?.avgPaceWpm || 135} WPM
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Filler Words Used</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: (evaluationReport?.speechTelemetry?.fillerCount || 0) === 0 ? 'var(--text-success)' : 'var(--text-danger)' }}>
                    {evaluationReport?.speechTelemetry?.fillerCount || 0}
                  </div>
                </div>
              </div>

              {/* Detected Fillers List */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Filler Word Breakdown: </strong>
                {evaluationReport?.speechTelemetry?.fillersDetected?.length > 0 ? (
                  <span>
                    {evaluationReport.speechTelemetry.fillersDetected.map(f => `"${f.word}" (${f.count}x)`).join(', ')}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-success)' }}>0 verbal fillers detected. Commendable verbal discipline!</span>
                )}
              </div>

              {/* Matched Keywords */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                <strong>Domain Keywords Articulated: </strong>
                {evaluationReport?.speechTelemetry?.matchedKeywords?.length > 0 ? (
                  <div style={{ display: 'inline-flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {evaluationReport.speechTelemetry.matchedKeywords.map((kw, i) => (
                      <span key={i} className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#facc15' }}>None of the expected keywords were spoken.</span>
                )}
              </div>
            </div>

            {/* Proctor Integrity & Gaze Infraction Audit */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <ShieldCheck size={18} color={isTerminatedByProctor ? 'var(--text-danger)' : '#22c55e'} />
                  Proctor Gaze & Attention Audit
                </h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0.6rem 0.8rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Integrity Status</div>
                  <strong style={{ fontSize: '0.88rem', color: isTerminatedByProctor ? 'var(--text-danger)' : 'var(--text-success)' }}>
                    {evaluationReport?.proctorAudit?.integrityStatus || 'Verified'}
                  </strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Attention Score</div>
                  <strong style={{ fontSize: '0.88rem', color: '#fafafa' }}>
                    {evaluationReport?.proctorAudit?.attentionPercentage || 98}%
                  </strong>
                </div>
              </div>

              {/* Infraction Log Table */}
              <div>
                <strong style={{ fontSize: '0.78rem', color: 'var(--text-bright)' }}>
                  Chronological Infraction History ({evaluationReport?.proctorAudit?.infractionsLog?.length || 0} strikes recorded):
                </strong>
                {evaluationReport?.proctorAudit?.infractionsLog?.length > 0 ? (
                  <table className="proctor-infractions-table">
                    <thead>
                      <tr>
                        <th>Strike</th>
                        <th>Time</th>
                        <th>Violation Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluationReport.proctorAudit.infractionsLog.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ color: item.strike >= 3 ? '#ef4444' : 'var(--text-warning)', fontWeight: 700 }}>
                            Strike {item.strike}/3
                          </td>
                          <td style={{ color: 'var(--text-dim)' }}>{item.timestamp}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-success)', marginTop: '0.4rem', padding: '0.5rem', background: 'rgba(34, 197, 94, 0.08)', borderRadius: 'var(--radius-sm)' }}>
                    ✓ Flawless focus. No lookaway infractions or tab switches recorded.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STRENGTHS & IMPROVEMENTS BREAKDOWN */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <CheckCircle2 size={18} color="#22c55e" />
                  Key Strengths Observed (Real Telemetry)
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {evaluationReport?.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertCircle size={18} color="#eab308" />
                  Actionable Areas for Improvement
                </h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {evaluationReport?.improvements?.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* TURN-BY-TURN REAL ANSWER CRITIQUE */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Sparkles size={18} color="var(--primary)" />
                Turn-by-Turn Spoken Response Critique
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {evaluationReport?.turnCritiques?.length > 0 ? (
                evaluationReport.turnCritiques.map((c, idx) => (
                  <div key={idx} style={{ padding: '0.9rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                        Turn #{c.turn}: {c.topic}
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        Score: {c.score}/100 • {c.wordCount} words
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginBottom: '0.45rem', fontStyle: 'italic', background: 'rgba(0, 0, 0, 0.25)', padding: '0.45rem 0.65rem', borderRadius: '4px' }}>
                      "{c.candidateSnippet}"
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      <strong>AI Recruiter Feedback:</strong> {c.feedback}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>
                  No candidate spoken responses were submitted prior to session conclusion.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
