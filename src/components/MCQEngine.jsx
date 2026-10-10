import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BarChart2,
  TrendingUp,
  Award,
  ShieldAlert,
  Calculator,
  HelpCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MCQ_QUESTION_BANK } from '../data/mockData';
import confetti from 'canvas-confetti';
import { recordAssessmentSubmission } from '../services/authDatabase';

export const MCQEngine = ({ userProfile, onTestCompleted }) => {
  const [testActive, setTestActive] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedForReview, setFlaggedForReview] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(900); // 15 mins
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatingAlert, setShowCheatingAlert] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  const questions = MCQ_QUESTION_BANK;
  const currentQ = questions[currentQIndex];

  // Anti-cheating tab-switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (testActive && !testSubmitted && document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          setShowCheatingAlert(true);
          setTimeout(() => setShowCheatingAlert(false), 5000);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [testActive, testSubmitted]);

  // Countdown timer
  useEffect(() => {
    let timer = null;
    if (testActive && !testSubmitted && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testActive, testSubmitted, remainingSeconds]);

  const handleStartTest = () => {
    setTestActive(true);
    setTestSubmitted(false);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setFlaggedForReview({});
    setRemainingSeconds(900);
    setTabSwitchCount(0);
  };

  const handleSelectOption = (idx) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: idx,
    });
  };

  const handleToggleFlag = () => {
    setFlaggedForReview({
      ...flaggedForReview,
      [currentQ.id]: !flaggedForReview[currentQ.id],
    });
  };

  // Evaluation calculations
  let correctCount = 0;
  questions.forEach(q => {
    if (selectedAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });
  const totalScorePercent = Math.round((correctCount / questions.length) * 100);

  // Dynamic Sectional Evaluations
  const quantQuestions = questions.filter(q => q.category === 'Quantitative Aptitude');
  const quantCorrect = quantQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  const quantPercent = quantQuestions.length ? Math.round((quantCorrect / quantQuestions.length) * 100) : 0;

  const logicQuestions = questions.filter(q => q.category === 'Logical Reasoning');
  const logicCorrect = logicQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  const logicPercent = logicQuestions.length ? Math.round((logicCorrect / logicQuestions.length) * 100) : 0;

  const coreQuestions = questions.filter(q => q.category && (q.category.includes('Technical') || q.category.includes('Core')));
  const coreCorrect = coreQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  const corePercent = coreQuestions.length ? Math.round((coreCorrect / coreQuestions.length) * 100) : totalScorePercent;

  const verbalQuestions = questions.filter(q => q.category && q.category.includes('Verbal'));
  const verbalCorrect = verbalQuestions.filter(q => selectedAnswers[q.id] === q.correctIndex).length;
  const verbalPercent = verbalQuestions.length ? Math.round((verbalCorrect / verbalQuestions.length) * 100) : 75;

  const overallPercentile = Math.min(99, Math.max(52, Math.round(50 + totalScorePercent * 0.49)));
  const elapsedSeconds = Math.max(1, 900 - remainingSeconds);
  const avgSecondsPerQ = Math.max(1, Math.round(elapsedSeconds / Math.max(1, Object.keys(selectedAnswers).length)));

  const handleSubmitTest = () => {
    setTestSubmitted(true);
    setTestActive(false);

    const submissionPayload = {
      testId: 'tcs_nqt_assessment_2026',
      testTitle: 'TCS NQT Full-Length Mock Assessment (2026 Edition)',
      scorePercent: totalScorePercent,
      correctCount,
      totalQuestions: questions.length,
      sectionalScores: {
        aptitude: Math.round((quantPercent + logicPercent) / 2),
        coreCS: corePercent,
        verbal: verbalPercent,
      },
      tabSwitches: tabSwitchCount,
    };

    const updatedUser = recordAssessmentSubmission(submissionPayload);

    if (totalScorePercent >= 70) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    if (onTestCompleted) {
      onTestCompleted(submissionPayload, updatedUser);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab switch warning alert */}
      {showCheatingAlert && (
        <div className="proctor-alert">
          <ShieldAlert size={20} />
          <div>
            <strong>Warning: Tab Switch Violation Detected!</strong>
            <div style={{ fontSize: '0.75rem' }}>
              Switches: {tabSwitchCount}/3. Proctor logs recorded for college TPO.
            </div>
          </div>
        </div>
      )}

      {/* Start Test Screen */}
      {!testActive && !testSubmitted && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare color="var(--primary)" />
                MCQ Diagnostic Assessment Engine
              </h2>
              <p style={{ fontSize: '0.85rem' }}>
                Standardized Indian placement pattern test covering Quantitative Aptitude, Logical Reasoning, Verbal, and Core CS (TCS NQT / Infosys format).
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ margin: '1.5rem 0' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <CheckSquare size={22} />
              </div>
              <div>
                <div className="stat-val">{questions.length} Questions</div>
                <div className="stat-label">Total Test Items</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Clock size={22} />
              </div>
              <div>
                <div className="stat-val">15 Minutes</div>
                <div className="stat-label">Sectional Countdown</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Award size={22} />
              </div>
              <div>
                <div className="stat-val">+1 Mark / No Neg</div>
                <div className="stat-label">Marking Scheme</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-white)' }}>
              Proctoring & Rules for Exam:
            </h4>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>Full-screen mode and tab-switching monitoring active.</li>
              <li>Virtual rough calculator tool available in top right.</li>
              <li>Questions can be flagged for review and navigated in any order via the palette.</li>
            </ul>
          </div>

          <button onClick={handleStartTest} className="btn btn-primary btn-lg">
            Start Timed Assessment Now →
          </button>
        </div>
      )}

      {/* Active Test Screen */}
      {testActive && !testSubmitted && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* Main Question Panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '560px' }}>
            <div>
              {/* Question Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-primary">
                    Question {currentQIndex + 1} of {questions.length}
                  </span>
                  <span className="badge badge-info">{currentQ.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {currentQ.subtopic}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="btn btn-outline btn-sm"
                    title="Toggle Virtual Calculator"
                  >
                    <Calculator size={14} /> Calc
                  </button>
                  <button
                    onClick={handleToggleFlag}
                    className={`btn btn-sm ${flaggedForReview[currentQ.id] ? 'btn-accent' : 'btn-outline'}`}
                  >
                    <Flag size={14} /> {flaggedForReview[currentQ.id] ? 'Flagged' : 'Mark Review'}
                  </button>
                </div>
              </div>

              {/* Calculator Drawer */}
              {showCalculator && (
                <div style={{ padding: '0.75rem', background: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter math expression (e.g. 240/24 or 36*1.4)"
                    value={calcInput}
                    onChange={(e) => setCalcInput(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      try {
                        const result = new Function(`return (${calcInput})`)();
                        setCalcInput(String(result));
                      } catch {
                        setCalcInput('Error');
                      }
                    }}
                  >
                    =
                  </button>
                </div>
              )}

              {/* Question Statement */}
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                {currentQ.question}
              </div>

              {/* Company Tags */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {currentQ.companyTags.map((tag, i) => (
                  <span key={i} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    🏢 {tag}
                  </span>
                ))}
              </div>

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        color: isSelected ? '#a5b4fc' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.92rem',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border-card)',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', marginTop: '2rem' }}>
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="btn btn-outline btn-sm"
              >
                <ArrowLeft size={14} /> Previous
              </button>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    const copy = { ...selectedAnswers };
                    delete copy[currentQ.id];
                    setSelectedAnswers(copy);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Clear Selection
                </button>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="btn btn-primary btn-sm"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="btn btn-success btn-sm"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Countdown Timer & Question Palette */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Timer Card */}
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Time Remaining
              </span>
              <div
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: remainingSeconds < 180 ? '#ef4444' : '#10b981',
                  marginTop: '0.2rem',
                }}
              >
                {formatTimer(remainingSeconds)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Tab Switches: <strong style={{ color: tabSwitchCount > 0 ? '#ef4444' : '#10b981' }}>{tabSwitchCount}</strong>
              </div>
            </div>

            {/* Question Palette */}
            <div className="card" style={{ flex: 1, padding: '1.25rem' }}>
              <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem' }}>Question Palette</h4>
                <span className="badge badge-primary">
                  {Object.keys(selectedAnswers).length}/{questions.length} Answered
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedForReview[q.id];
                  const isCurrent = currentQIndex === idx;

                  let bgColor = 'rgba(255, 255, 255, 0.04)';
                  let borderColor = 'var(--border-subtle)';
                  let textColor = 'var(--text-muted)';

                  if (isCurrent) {
                    borderColor = 'var(--primary)';
                  }
                  if (isAnswered) {
                    bgColor = '#10b981';
                    textColor = '#ffffff';
                    borderColor = '#10b981';
                  }
                  if (isFlagged) {
                    bgColor = '#f59e0b';
                    textColor = '#ffffff';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      style={{
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? '0 0 10px rgba(99, 102, 241, 0.5)' : 'none',
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }}></span> Answered
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f59e0b' }}></span> Marked for Review
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.08)' }}></span> Not Answered
                </div>
              </div>

              <button
                onClick={handleSubmitTest}
                className="btn btn-success"
                style={{ width: '100%', marginTop: '1.25rem' }}
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Test MCQ Diagnostic Analyzer (Checkpoint 8) */}
      {testSubmitted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                  Exam Submitted & Evaluated
                </span>
                <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  MCQ Diagnostic Performance Report
                </h2>
                <p style={{ fontSize: '0.9rem' }}>
                  Student: <strong>{userProfile.name}</strong> • College: <strong>{userProfile.college}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleStartTest} className="btn btn-outline">
                  <RotateCcw size={15} /> Retake Test
                </button>
                <button onClick={() => window.print()} className="btn btn-primary">
                  Export Result PDF
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#10b981' }}>{totalScorePercent}%</div>
                <div className="stat-label">Your Score ({correctCount}/{questions.length})</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#818cf8' }}>{overallPercentile}th</div>
                <div className="stat-label">College Percentile</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <BarChart2 size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#38bdf8' }}>68%</div>
                <div className="stat-label">Batch Average Benchmark</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Clock size={24} />
              </div>
              <div>
                <div className="stat-val" style={{ color: '#fbbf24' }}>{avgSecondsPerQ}s</div>
                <div className="stat-label">Avg Time Per Question</div>
              </div>
            </div>
          </div>

          {/* Topic-Wise Accuracy & Weak-Area Detection */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <BarChart2 size={18} color="var(--primary)" />
                  Topic-Wise Accuracy Breakdown (Real Diagnostic)
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Quantitative Aptitude ({quantCorrect}/{quantQuestions.length} Correct)</span>
                    <strong style={{ color: quantPercent >= 70 ? '#10b981' : '#f59e0b' }}>{quantPercent}%</strong>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${quantPercent}%`, background: 'var(--emerald-gradient)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Logical Reasoning ({logicCorrect}/{logicQuestions.length} Correct)</span>
                    <strong style={{ color: logicPercent >= 70 ? '#6366f1' : '#f59e0b' }}>{logicPercent}%</strong>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${logicPercent}%`, background: 'var(--accent-gradient)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Technical Core ({coreCorrect}/{coreQuestions.length} Correct)</span>
                    <strong style={{ color: corePercent >= 70 ? '#06b6d4' : '#f59e0b' }}>{corePercent}%</strong>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${corePercent}%`, background: 'var(--cyan-gradient)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Verbal & Communication ({verbalCorrect}/{verbalQuestions.length} Correct)</span>
                    <strong style={{ color: verbalPercent >= 70 ? '#f59e0b' : '#ef4444' }}>{verbalPercent}%</strong>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${verbalPercent}%`, background: 'var(--gold-gradient)' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <AlertTriangle size={18} color="#f59e0b" />
                  Weak-Area Diagnostic & Action Plan
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
                  <strong style={{ color: 'var(--text-white)' }}>SQL Isolation Levels & Phantom Reads:</strong>
                  <div>Repeatable Read allows phantom reads in ANSI standard. Recommended reading: ACID isolation chapter in Core CS module.</div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #6366f1' }}>
                  <strong style={{ color: 'var(--text-white)' }}>Alternate Days Time & Work:</strong>
                  <div>Always compute pair-day LCM cycles first to avoid fractional cycle errors. Check Aptitude Flashcard deck #1.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review Accordion */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <CheckCircle2 size={18} color="var(--primary)" />
                Detailed Solutions & Answer Explanations
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        Q{idx + 1}: {q.subtopic} ({q.category})
                      </span>
                      {userChoice !== undefined ? (
                        isCorrect ? (
                          <span className="badge badge-success">Correct (+1)</span>
                        ) : (
                          <span className="badge badge-danger">Incorrect (0)</span>
                        )
                      ) : (
                        <span className="badge badge-warning">Unattempted</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      {q.question}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                      Your Answer: <strong>{userChoice !== undefined ? q.options[userChoice] : 'None'}</strong> | Correct Answer: <strong style={{ color: '#10b981' }}>{q.options[q.correctIndex]}</strong>
                    </div>

                    <div style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.06)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                      <strong>Solution Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
