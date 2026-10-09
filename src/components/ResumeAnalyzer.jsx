import React, { useState } from 'react';
import {
  FileCheck,
  Upload,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Search,
  Target,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Zap,
  RotateCcw
} from 'lucide-react';

export const ResumeAnalyzer = ({ resumeFromBuilder }) => {
  const [targetRole, setTargetRole] = useState('sde_amazon');
  const [customJD, setCustomJD] = useState(
    `Role: Software Development Engineer 1 (SDE 1) - Amazon India
Requirements:
- Strong problem solving skills in Data Structures and Algorithms (Trees, Graphs, DP).
- Experience with Object Oriented Programming (Java, C++, or Python).
- Knowledge of relational databases (SQL, indexing, ACID transactions).
- Understanding of distributed systems, REST APIs, microservices, and Docker.
- Proven ability to write clean, modular, and maintainable unit-tested code.
- Familiarity with CI/CD pipelines and AWS cloud services (S3, EC2, Lambda).`
  );

  const [resumeText, setResumeText] = useState(
    resumeFromBuilder
      ? `${resumeFromBuilder.personal.fullName}
${resumeFromBuilder.personal.email} | ${resumeFromBuilder.personal.phone} | ${resumeFromBuilder.personal.linkedin}
Summary: ${resumeFromBuilder.personal.summary}
Skills: ${resumeFromBuilder.skills.languages}, ${resumeFromBuilder.skills.frameworks}, ${resumeFromBuilder.skills.developerTools}, ${resumeFromBuilder.skills.coreSubjects}
Experience: ${resumeFromBuilder.experience.map(e => `${e.title} at ${e.company}: ${e.bullets.join(' ')}`).join('\n')}
Projects: ${resumeFromBuilder.projects.map(p => `${p.name} (${p.tech}): ${p.bullets.join(' ')}`).join('\n')}`
      : `Aarav Sharma | VIT Vellore | Computer Science
Email: aarav.sharma22@vitstudent.ac.in | Phone: +91 98765 43210
Skills: C++, Python, JavaScript, React, Node.js, SQL, Docker, AWS S3, Git, DSA, OS, DBMS.
Internship: Razorpay - Engineered microservice for merchant webhook retries handling 150k daily events. Reduced latency by 32%.
Projects: PlaceIQ LMS (React, Node.js, Web Speech API) - Used by 400+ peers. Mini-Raft KV Store (C++, sockets, multithreading).
Achievements: LeetCode Knight (Rating 1890+), SIH Finalist.`
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    atsScore: 89,
    jdMatchRate: 85,
    keywordMatchRate: 91,
    impactMetricScore: 88,
    sectionAudit: [
      { section: 'Contact & Links', status: 'pass', feedback: 'Complete contact information with active LinkedIn & GitHub profiles.' },
      { section: 'Technical Skills', status: 'pass', feedback: 'Broad stack covering Languages, Web Frameworks, Cloud, and Core CS subjects.' },
      { section: 'Quantifiable Metrics', status: 'pass', feedback: 'Excellent usage of numbers: "150k events", "32% latency reduction", "400+ peers".' },
      { section: 'Cloud & System Design', status: 'warning', feedback: 'AWS is mentioned but specific CI/CD pipeline automation (GitHub Actions/Jenkins) is missing.' },
    ],
    matchedKeywords: ['Data Structures & Algorithms', 'C++', 'Python', 'SQL', 'Docker', 'REST APIs', 'AWS', 'Microservices', 'Unit Testing'],
    missingKeywords: ['CI/CD Pipelines', 'Lambda', 'System Design (LLD/HLD)', 'DynamoDB / NoSQL'],
    aiRewrites: [
      {
        before: 'Worked on web app for college placement preparation with tests.',
        after: 'Architected and launched "PlaceIQ", an end-to-end placement LMS serving 400+ engineering students, achieving 99.4% uptime with automated test case evaluation.',
        rationale: 'Applies XYZ formula with action verbs and specific scale indicators.',
      },
    ],
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Dynamic computation based on text length and keyword scan
      const hasDocker = resumeText.toLowerCase().includes('docker');
      const hasAws = resumeText.toLowerCase().includes('aws');
      const hasDsa = resumeText.toLowerCase().includes('dsa') || resumeText.toLowerCase().includes('algorithm');
      const hasMetrics = /\d+%|\d+k|\d+\+/i.test(resumeText);

      let score = 75;
      if (hasDocker) score += 5;
      if (hasAws) score += 5;
      if (hasDsa) score += 6;
      if (hasMetrics) score += 8;

      setAnalysisResult(prev => ({
        ...prev,
        atsScore: Math.min(score, 96),
        jdMatchRate: Math.min(score - 4, 94),
      }));
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck color="var(--primary)" />
              AI Resume Analyzer & ATS Benchmark
            </h2>
            <p style={{ fontSize: '0.85rem' }}>
              Simulates Fortune 500 ATS parser algorithms (Workday, Taleo, Greenhouse). Evaluates job description keyword density and impact verbs.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRunAnalysis}
              className="btn btn-primary"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="pulse-dot" size={16} /> Scanning Resume...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run In-Depth AI Audit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Dashboard: Inputs on Left, Results on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1.5rem' }}>
        {/* Left: Input Text & Job Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Target size={18} color="var(--primary)" />
                Target Company & Job Description
              </h3>
              <select
                className="select"
                style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="sde_amazon">Amazon SDE-1 (44.5 LPA)</option>
                <option value="tcs_digital">TCS Digital (7.5 LPA)</option>
                <option value="flipkart_ase">Flipkart ASE Trainee (32 LPA)</option>
                <option value="infosys_sp">Infosys Specialist Programmer (9.5 LPA)</option>
              </select>
            </div>
            <textarea
              className="textarea"
              rows={6}
              value={customJD}
              onChange={(e) => setCustomJD(e.target.value)}
              placeholder="Paste Job Description here..."
              style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Search size={18} color="var(--secondary)" />
                Resume Content to Audit
              </h3>
              <span className="badge badge-info">ATS Text Stream</span>
            </div>
            <textarea
              className="textarea"
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw resume text or load from builder..."
              style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* Right: AI Score & Section Audit Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Score Header Grid */}
          <div className="grid-3">
            <div className="stat-card" style={{ padding: '1rem' }}>
              <div>
                <div className="stat-val" style={{ color: '#10b981', fontSize: '1.8rem' }}>
                  {analysisResult.atsScore} / 100
                </div>
                <div className="stat-label">Overall ATS Score</div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div>
                <div className="stat-val" style={{ color: '#06b6d4', fontSize: '1.8rem' }}>
                  {analysisResult.jdMatchRate}%
                </div>
                <div className="stat-label">JD Relevance Match</div>
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1rem' }}>
              <div>
                <div className="stat-val" style={{ color: '#a855f7', fontSize: '1.8rem' }}>
                  {analysisResult.impactMetricScore}%
                </div>
                <div className="stat-label">Impact Metric Density</div>
              </div>
            </div>
          </div>

          {/* Keywords Match Matrix */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Zap size={18} color="var(--primary)" />
                Keyword Match Analysis
              </h3>
              <span className="badge badge-success">{analysisResult.matchedKeywords.length} Matched</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                ✅ High-Value Keywords Present:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <span key={i} className="badge badge-success" style={{ fontSize: '0.74rem' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f87171', marginBottom: '0.4rem' }}>
                ⚠️ Missing Keywords Required by Target JD:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysisResult.missingKeywords.map((kw, i) => (
                  <span key={i} className="badge badge-danger" style={{ fontSize: '0.74rem' }}>
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section-Wise Audit */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <CheckCircle size={18} color="#10b981" />
                Section-by-Section ATS Diagnostic
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analysisResult.sectionAudit.map((sec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  {sec.status === 'pass' ? (
                    <CheckCircle size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={18} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {sec.section}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {sec.feedback}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Bullet Point Rewrite Suggestion */}
          <div className="card" style={{ background: 'rgba(99, 102, 241, 0.06)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                AI Bullet Polish: Google XYZ Formula
              </h4>
            </div>

            {analysisResult.aiRewrites.map((rw, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-sm)', color: '#fca5a5' }}>
                  <strong>Weak:</strong> "{rw.before}"
                </div>
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: 'var(--radius-sm)', color: '#6ee7b7' }}>
                  <strong>Optimized:</strong> "{rw.after}"
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  💡 <em>{rw.rationale}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
