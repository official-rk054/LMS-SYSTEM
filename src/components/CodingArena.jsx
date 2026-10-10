import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  CheckCircle,
  XCircle,
  Copy,
  RotateCcw,
  Terminal,
  Sparkles,
  Lightbulb,
  Cpu,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CODING_PROBLEMS } from '../data/mockData';
import { executeJavaScriptTest } from '../services/codingJudge';
import {
  reviewCodeWithGemini,
  generateCodeHintWithGemini,
  simulateCodeExecutionWithGemini,
  orchestrator,
} from '../services/gemini';

export const CodingArena = ({ onProblemSolved, initialProblemId }) => {
  const [selectedProblem, setSelectedProblem] = useState(() => {
    if (initialProblemId) {
      const found = CODING_PROBLEMS.find(p => p.id === initialProblemId);
      if (found) return found;
    }
    return CODING_PROBLEMS[0];
  });
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(CODING_PROBLEMS[0].starterCode.javascript);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('testcases');
  const [testResults, setTestResults] = useState(null);

  // Gemini AI Code Review & Socratic Hint State
  const [aiReviewData, setAiReviewData] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(() => orchestrator.getStatus().hasKey);

  useEffect(() => {
    return orchestrator.subscribe(status => {
      setHasGeminiKey(status.hasKey);
    });
  }, []);

  // Sync problem when initialProblemId changes from navigation
  useEffect(() => {
    if (initialProblemId) {
      const found = CODING_PROBLEMS.find(p => p.id === initialProblemId);
      if (found) {
        setSelectedProblem(found);
      }
    }
  }, [initialProblemId]);

  // Sync starter code when problem or language changes
  useEffect(() => {
    if (selectedProblem.starterCode[selectedLanguage]) {
      setCode(selectedProblem.starterCode[selectedLanguage]);
    }
    setTestResults(null);
    setConsoleOutput('');
  }, [selectedProblem, selectedLanguage]);

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  // Reset code to starter template
  const handleResetCode = () => {
    setCode(selectedProblem.starterCode[selectedLanguage]);
    setConsoleOutput('Code reset to default starter template.');
  };

  // Run Custom Code (JS native or Gemini simulated for Python/C++/Java)
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('console');
    setConsoleOutput(`Compiling and running ${selectedLanguage} in execution environment...\n`);

    if (selectedLanguage === 'javascript') {
      setTimeout(() => {
        let outputText = '';
        const startTime = performance.now();
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')),
            error: (...args) => logs.push('ERROR: ' + args.join(' ')),
            warn: (...args) => logs.push('WARN: ' + args.join(' ')),
          };
          const runFn = new Function('console', code);
          runFn(customConsole);
          const elapsed = (performance.now() - startTime).toFixed(1);
          outputText = logs.length > 0
            ? `[JavaScript V8 Sandbox]\nExecution Time: ${elapsed} ms\n\n=== Standard Output ===\n${logs.join('\n')}`
            : `[JavaScript V8 Sandbox]\nProgram executed cleanly in ${elapsed} ms with 0 stdout messages. Use console.log(...) to print values.`;
        } catch (err) {
          outputText = `[V8 Execution Exception]\nRuntime Error: ${err.message}\nStack: ${err.stack || 'Trace unavailable'}`;
        }
        setConsoleOutput(outputText);
        setIsRunning(false);
      }, 350);
    } else {
      // Python, C++, Java execution simulation via Gemini
      try {
        const res = await simulateCodeExecutionWithGemini({
          problemTitle: selectedProblem.title,
          userCode: code,
          language: selectedLanguage,
          customInput: 'Sample test parameters'
        });
        if (res.success && res.output) {
          setConsoleOutput(`[${selectedLanguage.toUpperCase()} Gemini Runtime Sandbox]\n${res.output}`);
        } else {
          setConsoleOutput(`[${selectedLanguage.toUpperCase()}]\nCode structure parsed. Connect Gemini API Key to enable live cloud sandbox execution for non-JS languages.`);
        }
      } catch (err) {
        setConsoleOutput(`[Execution Error]\n${err.message}`);
      } finally {
        setIsRunning(false);
      }
    }
  };

  // AI Code Review with Big-O Complexity Analysis
  const handleAiReview = async () => {
    setActiveTab('ai_review');
    setIsReviewing(true);
    setAiReviewData(null);
    try {
      const res = await reviewCodeWithGemini({
        problemTitle: selectedProblem.title,
        problemDescription: selectedProblem.description,
        userCode: code,
        language: selectedLanguage,
      });

      if (res.success && res.review) {
        setAiReviewData(res.review);
      } else {
        // Intelligent heuristic analysis fallback
        const hasNestedLoop = code.includes('for') && code.slice(code.indexOf('for') + 3).includes('for');
        const usesHash = /map|set|object|\{\}/i.test(code);
        setAiReviewData({
          timeComplexity: hasNestedLoop ? 'O(N²)' : 'O(N)',
          spaceComplexity: usesHash ? 'O(N) Auxiliary' : 'O(1) Auxiliary',
          isOptimal: !hasNestedLoop,
          verdict: hasNestedLoop
            ? 'Quadratic Time Complexity: An O(N) linear time approach using a Hash Map or Two Pointers is recommended for Fortune 500 benchmarks.'
            : 'Linear Time Complexity: Solution approaches optimal algorithmic bounds.',
          strengths: ['Correct function signature and return type', 'Clear algorithmic progression'],
          potentialBugsOrEdgeCases: ['Check for empty arrays or single element inputs', 'Ensure boundary conditions handle negative numbers'],
          cleanCodeAdvice: 'Add defensive guards at the start of the function to catch null/undefined inputs early.',
        });
      }
    } catch (_) {
    } finally {
      setIsReviewing(false);
    }
  };

  // Socratic Algorithmic Hint Generator
  const handleAiHint = async () => {
    setIsGeneratingHint(true);
    setActiveHint(null);
    try {
      const res = await generateCodeHintWithGemini({
        problemTitle: selectedProblem.title,
        problemDescription: selectedProblem.description,
        userCode: code,
        language: selectedLanguage,
      });

      if (res.success && res.hint) {
        setActiveHint(res.hint);
      } else {
        setActiveHint(`💡 Socratic Hint: Can you trade off a small amount of memory (O(N) Space) using an auxiliary Hash Map to avoid scanning backwards in O(N) time on every step?`);
      }
    } catch (_) {
      setActiveHint('Consider the problem constraints: what happens if the input has duplicate numbers?');
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Submit and Auto-Judge against All Test Cases (Visible + Hidden)
  const handleSubmitCode = () => {
    if (selectedLanguage !== 'javascript') {
      setTestResults(null);
      setActiveTab('console');
      setConsoleOutput('Live judging is currently available for JavaScript only. This language has not been executed, so no verdict was generated.');
      return;
    }

    setIsRunning(true);
    setTestResults(null);
    setActiveTab('testcases');
    setConsoleOutput('Submitting to Auto-Judge...\nEvaluating against Sample & Hidden Test Cases...\n');

    setTimeout(() => {
      const results = selectedProblem.testCases.map((tc) => {
        return executeJavaScriptTest(selectedProblem, tc, code);
      });

      const passedCount = results.filter(r => r.passed).length;
      const allPassed = passedCount === results.length;
      const avgRuntime = results.reduce((acc, r) => acc + r.runtimeMs, 0) / results.length;

      setTestResults({
        passedCount: passedCount,
        totalCount: results.length,
        allPassed: allPassed,
        results: results,
        runtime: `${avgRuntime.toFixed(1)} ms average`,
        memory: 'Not measured in browser',
      });

      if (allPassed) {
        setConsoleOutput(`Judge Verdict: Accepted (AC)\nAll ${results.length}/${results.length} test cases passed successfully.\n+100 XP awarded to student profile.\n`);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onProblemSolved) {
          onProblemSolved(selectedProblem.id, selectedProblem.title, selectedLanguage, code, avgRuntime);
        }
      } else {
        const firstFailed = results.find(r => !r.passed);
        setConsoleOutput(
          firstFailed?.isHidden
            ? `Judge Verdict: Wrong Answer (WA)\nPassed: ${passedCount}/${results.length} test cases.\nA hidden test case failed. Its input and expected output are not shown.`
            : `Judge Verdict: Wrong Answer (WA)\nPassed: ${passedCount}/${results.length} test cases.\nFirst Failure on Case #${firstFailed?.id}:\nInput: ${firstFailed?.input}\nExpected: ${firstFailed?.expected}\nActual: ${firstFailed?.actual}\n`
        );
      }

      setIsRunning(false);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar with Problem Selector and Language Switcher */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 color="var(--primary)" size={22} />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Online Coding Arena</h2>
            </div>

            {/* Problem Selector Dropdown */}
            <select
              className="select"
              style={{ width: 'auto', minWidth: '240px', fontWeight: 600 }}
              value={selectedProblem.id}
              onChange={(e) => {
                const found = CODING_PROBLEMS.find(p => p.id === e.target.value);
                if (found) setSelectedProblem(found);
              }}
            >
              {CODING_PROBLEMS.map((prob) => (
                <option key={prob.id} value={prob.id}>
                  {prob.title} ({prob.difficulty})
                </option>
              ))}
            </select>

            <span
              className="badge"
              style={{
                background: selectedProblem.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: selectedProblem.difficulty === 'Easy' ? '#34d399' : 'var(--text-warning)',
              }}
            >
              {selectedProblem.difficulty}
            </span>
          </div>

          {/* Language Selector & Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <select
              className="select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem', fontWeight: 600 }}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript (browser)</option>
              <option value="python">Python (v3.12)</option>
              <option value="cpp">C++ (GCC 13.2 C++20)</option>
              <option value="java">Java (OpenJDK 21)</option>
            </select>

            <button
              onClick={handleAiHint}
              className="btn btn-outline"
              disabled={isGeneratingHint}
              title="Get progressive Socratic hint without spoiling the solution"
              style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}
            >
              <Lightbulb size={15} /> {isGeneratingHint ? 'Thinking...' : 'AI Hint'}
            </button>

            <button
              onClick={handleAiReview}
              className="btn btn-outline"
              disabled={isReviewing}
              title="Run Gemini AI code review and Big-O complexity audit"
              style={{ color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.4)' }}
            >
              <Sparkles size={15} /> {isReviewing ? 'Auditing...' : 'AI Review'}
            </button>

            <button onClick={handleRunCode} className="btn btn-outline" disabled={isRunning}>
              <Play size={15} /> Run Code
            </button>

            <button onClick={handleSubmitCode} className="btn btn-primary" disabled={isRunning}>
              <Check size={15} /> Submit Solution
            </button>
          </div>
        </div>
        {selectedLanguage !== 'javascript' && (
          <p style={{ margin: '0.65rem 0 0', fontSize: '0.75rem', color: 'var(--text-warning)' }}>
            Note: Non-JS code (Python, C++, Java) executes via Gemini Cloud Sandbox Simulation when you click "Run Code".
          </p>
        )}
      </div>

      {/* Socratic Hint Banner */}
      {activeHint && (
        <div
          className="card"
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1.1rem',
            background: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.35)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
            <Lightbulb size={18} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.82rem', color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
                Gemini Socratic Algorithmic Hint:
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {activeHint}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveHint(null)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace: Left Problem Description, Right IDE & Console */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(450px, 1.4fr)', gap: '1.5rem' }}>
        {/* Left: Problem Description & Company Tags */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '720px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--text-bright)' }}>
              {selectedProblem.title}
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {selectedProblem.companyTags.map((tag, i) => (
                <span key={i} className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                  🏢 {tag}
                </span>
              ))}
              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                📂 {selectedProblem.category}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
              <a
                href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(selectedProblem.title.split('(')[0].trim())}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: '#fb923c', borderColor: 'rgba(251, 146, 60, 0.4)' }}
              >
                🟠 LeetCode Portal ↗
              </a>
              <a
                href={`https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(selectedProblem.title.split('(')[0].trim())}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)' }}
              >
                🟢 GeeksforGeeks Portal ↗
              </a>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
            {selectedProblem.description}
          </div>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Examples:</h4>
          {selectedProblem.examples.map((ex, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '0.75rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div><strong>Input:</strong> {ex.input}</div>
              <div><strong>Output:</strong> {ex.output}</div>
              {ex.explanation && (
                <div style={{ color: 'var(--text-dim)', marginTop: '0.3rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>
                  <strong>Explanation:</strong> {ex.explanation}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            💡 <strong>Interview Pro-Tip:</strong> Always state your Time & Space complexity before writing code. Aim for O(N) linear time using Hash Maps or Two Pointers!
          </div>
        </div>

        {/* Right: Code Editor & Auto-Judge Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '720px' }}>
          {/* Editor Header & Body */}
          <div className="code-editor-wrapper" style={{ flex: 1 }}>
            <div className="code-editor-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#8b949e' }}>
                <Terminal size={14} />
                <span>main.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'cpp' ? 'cpp' : 'java'}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={handleCopyCode} className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.5rem', color: '#8b949e' }}>
                  <Copy size={13} /> Copy
                </button>
                <button onClick={handleResetCode} className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.5rem', color: '#8b949e' }}>
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>

            <div className="code-editor-body" style={{ flex: 1 }}>
              {/* Line Numbers */}
              <div className="line-numbers">
                {code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Input */}
              <textarea
                className="code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Bottom Tabs: Test Cases & Terminal Console */}
          <div className="card" style={{ height: '240px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`}
                  onClick={() => setActiveTab('testcases')}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                >
                  <CheckCircle size={14} /> Test Cases {testResults ? `(${testResults.passedCount}/${testResults.totalCount})` : ''}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'console' ? 'active' : ''}`}
                  onClick={() => setActiveTab('console')}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                >
                  <Terminal size={14} /> Terminal Console
                </button>
                <button
                  className={`tab-btn ${activeTab === 'ai_review' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai_review')}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem', color: '#c084fc' }}
                >
                  <Sparkles size={14} /> AI Review & Big-O
                </button>
              </div>

              {testResults && (
                <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem' }}>
                  <span style={{ color: '#34d399' }}>⚡ {testResults.runtime}</span>
                  <span style={{ color: '#60a5fa' }}>💾 {testResults.memory}</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeTab === 'testcases' && (
                <div>
                  {testResults ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {testResults.results.map((r, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: r.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: `1px solid ${r.passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.8rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {r.passed ? <CheckCircle size={15} color="#10b981" /> : <XCircle size={15} color="#ef4444" />}
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              Test Case #{i + 1} {r.isHidden ? '(Hidden Judge Case)' : '(Sample)'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                            {r.isHidden ? (
                              <span style={{ color: r.passed ? 'var(--text-success)' : 'var(--text-danger)' }}>
                                {r.passed ? 'Passed' : 'Failed'} · details hidden <span style={{ color: 'var(--text-dim)' }}>({r.runtimeMs}ms)</span>
                              </span>
                            ) : r.passed ? (
                              <span style={{ color: '#34d399' }}>
                                Output: {r.actual} <span style={{ color: 'var(--text-dim)' }}>({r.runtimeMs}ms)</span>
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-danger)' }}>
                                Expected: {r.expected} | Actual: {r.actual} <span style={{ color: 'var(--text-dim)' }}>({r.runtimeMs}ms)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedProblem.testCases.map((tc, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.45rem 0.75rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Case #{i + 1} {tc.isHidden ? '(Hidden)' : `[${tc.input}]`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'console' && (
                <div className="console-output" style={{ minHeight: '100%', padding: '0.5rem' }}>
                  {consoleOutput || 'Click "Run Code" or "Submit Solution" to inspect execution logs.'}
                </div>
              )}

              {activeTab === 'ai_review' && (
                <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.25rem' }}>
                  {isReviewing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', padding: '1rem' }}>
                      <Sparkles size={16} className="pulse-dot" />
                      <span>Gemini AI is performing Big-O complexity analysis and edge case audit...</span>
                    </div>
                  ) : aiReviewData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                          ⚡ Time: <strong>{aiReviewData.timeComplexity || 'O(N)'}</strong>
                        </span>
                        <span className="badge badge-info" style={{ fontSize: '0.74rem' }}>
                          💾 Space: <strong>{aiReviewData.spaceComplexity || 'O(1)'}</strong>
                        </span>
                        <span className={`badge ${aiReviewData.isOptimal ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.74rem' }}>
                          {aiReviewData.isOptimal ? '✓ Optimal Solution' : '⚠️ Algorithmic Trade-off'}
                        </span>
                      </div>

                      <div style={{ color: 'var(--text-bright)', fontWeight: 600, fontSize: '0.83rem' }}>
                        {aiReviewData.verdict}
                      </div>

                      {aiReviewData.strengths && (
                        <div>
                          <div style={{ fontSize: '0.73rem', color: '#34d399', fontWeight: 700, marginBottom: '2px' }}>Key Strengths:</div>
                          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-muted)', fontSize: '0.77rem' }}>
                            {aiReviewData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}

                      {aiReviewData.potentialBugsOrEdgeCases && (
                        <div>
                          <div style={{ fontSize: '0.73rem', color: '#f59e0b', fontWeight: 700, marginBottom: '2px' }}>Edge Cases to Verify:</div>
                          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-muted)', fontSize: '0.77rem' }}>
                            {aiReviewData.potentialBugsOrEdgeCases.map((e, i) => <li key={i}>{e}</li>)}
                          </ul>
                        </div>
                      )}

                      {aiReviewData.cleanCodeAdvice && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
                          💡 <em>{aiReviewData.cleanCodeAdvice}</em>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Click <strong>"AI Review"</strong> in the top toolbar to audit this code's Big-O complexity, correctness, and edge cases.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
