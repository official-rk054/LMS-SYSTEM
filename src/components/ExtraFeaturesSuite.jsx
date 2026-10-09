import React, { useState } from 'react';
import {
  Users,
  Mic,
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
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GROUP_DISCUSSION_TOPICS, APTITUDE_FLASHCARDS, ALUMNI_MENTORS } from '../data/mockData';

export const ExtraFeaturesSuite = ({ userProfile }) => {
  const [activeTool, setActiveTool] = useState('gd'); // 'gd', 'fluency', 'plan', 'flashcards', 'mock_drive', 'alumni', 'profile_audit'

  // GD state
  const [selectedGdTopic, setSelectedGdTopic] = useState(GROUP_DISCUSSION_TOPICS[0]);
  const [gdMessages, setGdMessages] = useState([
    { sender: 'Moderator AI', text: `Welcome participants to this Group Discussion on: "${GROUP_DISCUSSION_TOPICS[0].topic}". You have 10 minutes. Please begin the discussion.`, time: '00:01' },
    { sender: 'Rohan (DTU Delhi)', text: GROUP_DISCUSSION_TOPICS[0].participants[0].initialOpinion, time: '00:25' },
    { sender: 'Priya (PICT Pune)', text: GROUP_DISCUSSION_TOPICS[0].participants[1].initialOpinion, time: '01:10' },
    { sender: 'Aditya (VIT Vellore)', text: GROUP_DISCUSSION_TOPICS[0].participants[2].initialOpinion, time: '02:05' },
  ]);
  const [candidateGdInput, setCandidateGdInput] = useState('');
  const [gdEvaluation, setGdEvaluation] = useState(null);

  // Fluency Analyzer state
  const [speechText, setSpeechText] = useState('Actually, um, in our college project we, like, implemented a microservice that, you know, handled database transactions. It was basically very fast.');
  const [fluencyReport, setFluencyReport] = useState(null);

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mock Placement Drive & Offer Letter state
  const [driveStage, setDriveStage] = useState('idle'); // 'idle', 'round1', 'round2', 'round3', 'offered'
  const [showOfferLetter, setShowOfferLetter] = useState(false);

  // Handle Candidate GD Entry
  const handleSendGdPoint = () => {
    if (!candidateGdInput.trim()) return;

    const userEntry = {
      sender: `${userProfile.name} (Candidate)`,
      text: candidateGdInput.trim(),
      time: '02:50',
    };

    setGdMessages(prev => [...prev, userEntry]);
    setCandidateGdInput('');

    // AI Moderator evaluates candidate's entry point
    setTimeout(() => {
      setGdEvaluation({
        entryTimingScore: 92,
        argumentDepthScore: 88,
        collaborationScore: 90,
        verdict: 'Excellent Intervention: You validated previous points while introducing a fresh perspective on Indian tech education.',
        feedbackPoints: [
          'Good acknowledgement of Aditya\'s point before presenting your argument.',
          'Maintained polite tone without interrupting others.',
          'Recommended adding specific stats (e.g. India\'s GCC growth) in your next point.',
        ],
      });

      const moderatorSummary = {
        sender: 'Moderator AI',
        text: `Well articulated by ${userProfile.name}. Bringing up institutional upskilling bridges the gap nicely. Rohan, how do you counter that?`,
        time: '03:15',
      };
      setGdMessages(prev => [...prev, moderatorSummary]);
    }, 1000);
  };

  // Analyze Fluency
  const handleAnalyzeFluency = () => {
    const textLower = speechText.toLowerCase();
    const fillers = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
    let count = 0;
    fillers.forEach(f => {
      const regex = new RegExp(`\\b${f}\\b`, 'g');
      const matches = textLower.match(regex);
      if (matches) count += matches.length;
    });

    setFluencyReport({
      fillerCount: count,
      wordsCount: speechText.split(/\s+/).filter(Boolean).length,
      clarityScore: count > 3 ? 68 : count > 1 ? 82 : 94,
      vocabularyDiversity: 'Good Technical Lexicon (B+)',
      suggestions: [
        'Replace "basically" with concise direct statements.',
        'Pause for 1 second instead of saying "um" to gather your thoughts.',
        'Use transition phrases like "Furthermore" or "In particular".',
      ],
    });
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="#a855f7" />
          Campus Acceleration Supercharged Suite
        </h2>
        <p style={{ fontSize: '0.85rem' }}>
          Specialized preparation tools requested by top placement trainers: AI Group Discussions, Speech Fluency, 30-Day Roadmaps, Flashcards, and Drive Simulations.
        </p>

        {/* Tool Navigation Tabs */}
        <div className="tabs-nav" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
          <button className={`tab-btn ${activeTool === 'gd' ? 'active' : ''}`} onClick={() => setActiveTool('gd')}>
            <Users size={15} /> AI Group Discussion (GD)
          </button>
          <button className={`tab-btn ${activeTool === 'fluency' ? 'active' : ''}`} onClick={() => setActiveTool('fluency')}>
            <Mic size={15} /> Fluency & Speech Analyzer
          </button>
          <button className={`tab-btn ${activeTool === 'mock_drive' ? 'active' : ''}`} onClick={() => setActiveTool('mock_drive')}>
            <Award size={15} /> End-to-End Drive & Offer Letter
          </button>
          <button className={`tab-btn ${activeTool === 'flashcards' ? 'active' : ''}`} onClick={() => setActiveTool('flashcards')}>
            <CreditCard size={15} /> Aptitude Flashcards
          </button>
          <button className={`tab-btn ${activeTool === 'plan' ? 'active' : ''}`} onClick={() => setActiveTool('plan')}>
            <Calendar size={15} /> 30-Day Weak Area Plan
          </button>
          <button className={`tab-btn ${activeTool === 'alumni' ? 'active' : ''}`} onClick={() => setActiveTool('alumni')}>
            <MessageCircle size={15} /> Alumni Mentors
          </button>
        </div>
      </div>

      {/* Tool 1: AI Group Discussion Simulator */}
      {activeTool === 'gd' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.4fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
          {/* Discussion Room */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-white)' }}>
                  Topic: {selectedGdTopic.topic}
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {selectedGdTopic.category} • 4 Simulated AI Participants
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
                    background: msg.sender.includes('Candidate') ? 'rgba(99, 102, 241, 0.15)' : msg.sender.includes('Moderator') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: msg.sender.includes('Candidate') ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: msg.sender.includes('Candidate') ? '#818cf8' : '#38bdf8', marginBottom: '0.25rem' }}>
                    <span>{msg.sender}</span>
                    <span style={{ color: 'var(--text-dim)' }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Candidate Entry Input */}
            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <input
                type="text"
                className="input"
                placeholder="Pitch your viewpoint or counter someone's point..."
                value={candidateGdInput}
                onChange={(e) => setCandidateGdInput(e.target.value)}
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
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{gdEvaluation.entryTimingScore}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Entry Timing</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6366f1' }}>{gdEvaluation.argumentDepthScore}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Argument Depth</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.6rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4' }}>{gdEvaluation.collaborationScore}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Collaboration</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', color: '#6ee7b7' }}>
                    <strong>Verdict:</strong> {gdEvaluation.verdict}
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.8rem', color: 'var(--text-white)', marginBottom: '0.4rem' }}>Key Observations:</h5>
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
      )}

      {/* Tool 2: Communication & Fluency Analyzer */}
      {activeTool === 'fluency' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Mic size={18} color="var(--primary)" />
                Communication & English Fluency Evaluator
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Paste your spoken interview transcription or speech text to identify filler words, pace, and clarity bottlenecks.
            </p>

            <textarea
              className="textarea"
              rows={6}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Paste speech transcript..."
            />

            <button onClick={handleAnalyzeFluency} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Analyze Communication Quality
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FileCheck size={18} color="#10b981" />
                Fluency Metrics & Recommendations
              </h3>
            </div>

            {fluencyReport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="grid-3">
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#10b981', fontSize: '1.5rem' }}>{fluencyReport.clarityScore}%</div>
                      <div className="stat-label">Clarity Index</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#f59e0b', fontSize: '1.5rem' }}>{fluencyReport.fillerCount}</div>
                      <div className="stat-label">Filler Words</div>
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.75rem' }}>
                    <div>
                      <div className="stat-val" style={{ color: '#6366f1', fontSize: '1.5rem' }}>{fluencyReport.wordsCount}</div>
                      <div className="stat-label">Total Words</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <h5 style={{ fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-white)' }}>
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
                Click "Analyze Communication Quality" to view clarity score and filler word frequency.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 3: End-to-End Placement Drive Simulation & Official Offer Letter */}
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
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round1' || driveStage === 'round2' || driveStage === 'round3' || driveStage === 'offered' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📝</div>
              <strong>Round 1: Online Assessment</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Aptitude + Coding OA</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round2' || driveStage === 'round3' || driveStage === 'offered' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>💻</div>
              <strong>Round 2: Technical DSA</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Live Algorithms & Systems</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'round3' || driveStage === 'offered' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🤝</div>
              <strong>Round 3: HR & Leadership</strong>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Cultural Fit & Fitment</div>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: driveStage === 'offered' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
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
                color: '#0f172a',
                padding: '2.5rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '1.5rem',
                border: '2px solid #2563eb',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              id="printable-offer-letter"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>AMAZON DEVELOPMENT CENTRE INDIA</h2>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>Brigade Gateway, Bengaluru, Karnataka, India</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>CAMPUS RECRUITMENT 2026</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ref: AMZN-IND-CAMPUS-2026-SDE1</div>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#334155' }}>
                <p><strong>Dear {userProfile.name},</strong></p>
                <p style={{ marginTop: '0.5rem' }}>
                  Following your exceptional performance in the Campus Recruitment Drive held at <strong>{userProfile.college}</strong>, Amazon India is pleased to extend an offer of employment for the position of <strong>Software Development Engineer 1 (SDE-1)</strong>.
                </p>
                <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '6px', margin: '1rem 0' }}>
                  <div><strong>Annual Total Compensation (CTC):</strong> ₹44,50,000 (44.5 LPA)</div>
                  <div><strong>Base Salary:</strong> ₹16,50,000 per annum</div>
                  <div><strong>Joining Bonus (Year 1):</strong> ₹9,50,000</div>
                  <div><strong>Restricted Stock Units (RSUs):</strong> ₹18,50,000 vested over 4 years</div>
                  <div><strong>Joining Location:</strong> Bengaluru / Hyderabad, India</div>
                </div>
                <p>We look forward to welcoming you to Amazon and building the future together!</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Authorized Signatory</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>University Talent Acquisition, Amazon India</div>
                </div>
                <button onClick={() => window.print()} className="btn btn-primary btn-sm no-print">
                  <Download size={14} /> Download & Print Official Offer Letter
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 4: Aptitude Shortcuts Flashcards */}
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
              background: isFlipped ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: isFlipped ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
              transition: 'var(--transition)',
            }}
          >
            <span className="badge badge-warning" style={{ marginBottom: '1rem' }}>
              {APTITUDE_FLASHCARDS[currentCardIdx].topic} • Click to Flip
            </span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-white)', marginBottom: '0.75rem' }}>
              {isFlipped ? '💡 Formula & Shortcut Trick' : APTITUDE_FLASHCARDS[currentCardIdx].front}
            </h3>
            <div style={{ fontSize: '0.9rem', color: isFlipped ? '#a5b4fc' : 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
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

      {/* Tool 5: 30-Day Weak Area Placement Plan */}
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
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem' }}>Week 1: Aptitude & Speed Math</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Master Time & Work, Percentages, and Syllogisms. Complete 2 timed sectional mocks daily.</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>Week 2: High-Yield DSA (Trees & DP)</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solve 20 high-frequency dynamic programming and graph problems. Focus on space-optimized state transitions.</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.35rem' }}>Week 3: Core CS & Low-Level Design</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deep dive into OS Paging, Deadlocks, SQL Indexing, and OOP design patterns (Factory, Singleton, Observer).</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '0.35rem' }}>Week 4: Mock Drives & Leadership Principles</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Conduct 3 AI voice mock interviews, refine resume impact bullets, and rehearse STAR method anecdotes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tool 6: Alumni Mentors */}
      {activeTool === 'alumni' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MessageCircle size={18} color="var(--primary)" />
              Alumni Mentorship Network (Indian Tech Pioneers)
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>
            Connect with recent campus alumni working at Amazon, Flipkart, Infosys, and Google.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {ALUMNI_MENTORS.map((m) => (
              <div key={m.id} style={{ padding: '1.15rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.8rem' }}>{m.avatar}</div>
                    <span className="badge badge-success">{m.status}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-white)', margin: 0 }}>{m.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>{m.role} • {m.company}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{m.collegeBatch} • CTC: {m.packageCTC}</div>
                </div>

                <button onClick={() => alert(`Connecting with ${m.name}... A chat window will open!`)} className="btn btn-outline btn-sm">
                  Request 1-on-1 Guidance
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
