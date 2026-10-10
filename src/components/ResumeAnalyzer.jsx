import React, { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  FileText,
  Check,
  Plus,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award,
  FileUp,
  RefreshCw,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  Wand2
} from 'lucide-react';
import {
  runResumeAuditAgent,
  ROLE_PROFILES,
  extractCandidateMetadata
} from '../services/resumeAuditAgent';

const PRESET_JDS = {
  sde_amazon: {
    title: 'Amazon India - SDE 1 (₹44.5 LPA)',
    company: 'Amazon',
    role: 'Software Development Engineer 1',
    package: '₹44.5 LPA',
    text: `Role: Software Development Engineer 1 (SDE 1) - Amazon India
Requirements:
- Strong problem solving skills in Data Structures and Algorithms (Trees, Graphs, DP).
- Experience with Object Oriented Programming (Java, C++, or Python).
- Knowledge of relational databases (SQL, indexing, ACID transactions).
- Understanding of distributed systems, REST APIs, microservices, and Docker.
- Proven ability to write clean, modular, and maintainable unit-tested code.
- Familiarity with CI/CD pipelines and AWS cloud services (S3, EC2, Lambda).`,
    keywords: ['Data Structures & Algorithms', 'C++', 'Python', 'SQL', 'Docker', 'REST APIs', 'AWS', 'Microservices', 'Unit Testing', 'CI/CD Pipelines', 'AWS Lambda', 'System Design (LLD/HLD)', 'DynamoDB / NoSQL']
  },
  sde_microsoft: {
    title: 'Microsoft India - Software Engineer (₹45.0 LPA)',
    company: 'Microsoft',
    role: 'Software Engineer (L59/L60)',
    package: '₹45.0 LPA',
    text: `Role: Software Engineer - Microsoft IDC
Requirements:
- Deep foundation in Computer Science Fundamentals (OS, DBMS, Computer Networks, DSA).
- Proficiency in C#, C++, Java, or modern Python with clean design patterns.
- Experience with Azure cloud architecture, microservices, and containerization.
- Excellent debugging, multi-threading, asynchronous programming skills.
- Automated testing, Git workflows, and CI/CD GitHub Actions pipelines.`,
    keywords: ['DSA & Algorithms', 'C++', 'Java', 'Python', 'OS & Concurrency', 'DBMS & SQL', 'Azure / Cloud', 'Microservices', 'Git Workflows', 'CI/CD GitHub Actions', 'Multi-threading', 'Design Patterns']
  },
  flipkart_ase: {
    title: 'Flipkart - Associate SDE (₹32.0 LPA)',
    company: 'Flipkart',
    role: 'Associate Software Engineer',
    package: '₹32.0 LPA',
    text: `Role: Associate Software Engineer - Flipkart
Requirements:
- Exceptional analytical and algorithmic problem-solving capabilities.
- Hands-on proficiency in Java or Golang for high-throughput backend services.
- Experience building RESTful APIs, caching (Redis/Memcached), and SQL/NoSQL databases.
- Familiarity with Docker, Kafka/RabbitMQ message queues, and distributed systems.`,
    keywords: ['Data Structures', 'Java', 'Algorithms', 'SQL & RDBMS', 'RESTful APIs', 'Redis Caching', 'Docker', 'Kafka / Message Queues', 'Distributed Systems', 'Git']
  },
  tcs_digital: {
    title: 'TCS Digital - System Engineer (₹7.5 LPA)',
    company: 'Tata Consultancy Services',
    role: 'TCS Digital Cadre',
    package: '₹7.5 LPA',
    text: `Role: Systems Engineer - TCS Digital Cadre
Requirements:
- Strong programming fundamentals in Python, Java, or C++.
- Understanding of Database Management Systems, SQL, and normalization.
- Knowledge of Web Development (HTML5, CSS3, JavaScript, React or Angular).
- Foundational concepts in Machine Learning, Cloud Basics, or IoT.
- Agile methodologies, Git version control, and sound software engineering principles.`,
    keywords: ['Python', 'Java', 'C++', 'SQL & DBMS', 'JavaScript', 'React', 'Git', 'Agile Principles', 'Cloud Basics', 'REST APIs']
  },
  infosys_sp: {
    title: 'Infosys - Specialist Programmer (₹9.5 LPA)',
    company: 'Infosys',
    role: 'Specialist Programmer (SP)',
    package: '₹9.5 LPA',
    text: `Role: Specialist Programmer - Infosys Power Programmer
Requirements:
- Competitive programming pedigree (LeetCode/CodeChef/Hackerearth).
- Advanced DSA: Segment Trees, Disjoint Set Union, Dynamic Programming, Graphs.
- Polyglot development skills (Java, Python, C++, Go).
- Full Stack development with React/Node.js or Spring Boot microservices.
- Relational and document databases, Docker containerization.`,
    keywords: ['Competitive Programming', 'Advanced DSA', 'Dynamic Programming', 'Java', 'Python', 'Spring Boot', 'React', 'Docker', 'SQL', 'Microservices']
  }
};

const DEFAULT_RESUME_INFO = {
  fileName: 'Sample_SDE_Resume.txt',
  fileSize: '194 KB',
  fileType: 'text/plain',
  uploadSource: 'demo',
  lastModified: 'Sample profile — replace with your resume',
  parsedName: 'Aarav Sharma',
  parsedCollege: 'Vellore Institute of Technology (VIT)',
  parsedDegree: 'B.Tech Computer Science & Engineering (2026 Batch)',
  parsedCgpa: '8.85 / 10.0',
  skillsCount: 16,
  rawText: `Aarav Sharma | VIT Vellore | Computer Science
Email: aarav.sharma22@vitstudent.ac.in | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/aarav-sharma | GitHub: github.com/aarav-vit
Summary: Aspiring Software Engineer with strong foundations in Data Structures, Algorithms, Distributed Systems, and Full-Stack Development.
Skills: C++, Python, JavaScript, React, Node.js, SQL, Docker, AWS S3, Git, DSA, OS, DBMS, Computer Networks, REST APIs, Microservices, Unit Testing.
Experience: Razorpay - Software Engineering Intern (May 2025 - July 2025). Engineered microservice for merchant webhook retries handling 150k daily events. Reduced payment processing latency by 32%. Built end-to-end integration tests achieving 94% coverage.
Projects: PlaceIQ LMS - Architected full-stack placement portal with React, Node.js, and Web Speech API used by 400+ students. Mini-Raft KV Store - Distributed fault-tolerant key-value store using C++ sockets and Raft consensus algorithm.
Achievements: LeetCode Knight (Rating 1890+), Smart India Hackathon (SIH) National Finalist 2024.`
};

export const ResumeAnalyzer = ({ userProfile, resumeFromBuilder }) => {
  const [targetRole, setTargetRole] = useState('sde_amazon');
  const [showCustomJD, setShowCustomJD] = useState(false);
  const [isCustomJdActive, setIsCustomJdActive] = useState(false);
  const [customJDText, setCustomJDText] = useState('');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('keywords'); // 'keywords', 'rewrites', 'sections', 'checklist'
  const [uploadError, setUploadError] = useState('');
  const [copiedRewrite, setCopiedRewrite] = useState(null);

  // File Import State
  const [uploadedResume, setUploadedResume] = useState(() => {
    if (resumeFromBuilder) {
      const candidateName = resumeFromBuilder.personal?.fullName || userProfile?.name || 'Candidate';
      const text = `${candidateName} | ${resumeFromBuilder.education?.[0]?.institution || userProfile?.college || 'Engineering College'} | Computer Science
Email: ${resumeFromBuilder.personal?.email || userProfile?.email || 'email@domain.com'} | Phone: ${resumeFromBuilder.personal?.phone || userProfile?.phone || '+91 98765 43210'} | LinkedIn: ${resumeFromBuilder.personal?.linkedin || 'linkedin.com/in/candidate'} | GitHub: ${resumeFromBuilder.personal?.github || 'github.com/candidate'}
Summary: ${resumeFromBuilder.personal?.summary || 'Engineering student focused on high-scale systems.'}
Skills: ${resumeFromBuilder.skills?.languages || ''}, ${resumeFromBuilder.skills?.frameworks || ''}, ${resumeFromBuilder.skills?.developerTools || ''}, ${resumeFromBuilder.skills?.coreSubjects || ''}
Experience: ${resumeFromBuilder.experience?.map(e => `${e.title} at ${e.company}: ${e.bullets?.join(' ')}`).join('\n') || ''}
Projects: ${resumeFromBuilder.projects?.map(p => `${p.name} (${p.tech}): ${p.bullets?.join(' ')}`).join('\n') || ''}`;

      const meta = extractCandidateMetadata(text, userProfile, `${candidateName.replace(/\s+/g, '_')}_Resume.json`);

      return {
        fileName: `${candidateName.replace(/\s+/g, '_')}_Resume.json`,
        fileSize: `${Math.max(12, Math.round(text.length / 30))} KB`,
        fileType: 'application/json',
        uploadSource: 'builder',
        lastModified: 'Synced from PlaceIQ Resume Builder',
        parsedName: candidateName,
        parsedCollege: resumeFromBuilder.education?.[0]?.institution || meta.parsedCollege,
        parsedDegree: `${resumeFromBuilder.education?.[0]?.degree || 'B.Tech'} in ${resumeFromBuilder.education?.[0]?.field || 'Computer Science'}`,
        parsedCgpa: resumeFromBuilder.education?.[0]?.cgpa ? `${resumeFromBuilder.education[0].cgpa} / 10.0` : meta.parsedCgpa,
        skillsCount: meta.skillsCount,
        rawText: text
      };
    }
    return DEFAULT_RESUME_INFO;
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [isExtractingResume, setIsExtractingResume] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  const fileInputRef = useRef(null);
  const auditTimersRef = useRef([]);

  // Real Agent Analysis State
  const [analysisResult, setAnalysisResult] = useState(() => {
    const initialText = uploadedResume?.rawText || DEFAULT_RESUME_INFO.rawText;
    return runResumeAuditAgent(initialText, 'sde_amazon', PRESET_JDS.sde_amazon.text, userProfile);
  });

  // Resolved Checklist items initialized from live audit
  const [resolvedChecklist, setResolvedChecklist] = useState(() => {
    const initial = {};
    if (analysisResult?.checklist) {
      analysisResult.checklist.forEach(item => {
        initial[item.id] = !!item.isInitialResolved;
      });
    }
    return initial;
  });

  // Current JD metadata
  const currentJD = PRESET_JDS[targetRole] || PRESET_JDS.sde_amazon;
  const activeJDText = isCustomJdActive ? customJDText : currentJD.text;

  // Run audit agent whenever resume text or target role changes
  const executeAgentAudit = (rawText, roleKey, jdText = isCustomJdActive ? customJDText : PRESET_JDS[roleKey]?.text || '') => {
    auditTimersRef.current.forEach(clearTimeout);
    auditTimersRef.current = [];
    setIsAnalyzing(true);

    const stepOneTimer = setTimeout(() => {
      setScanStep(1);
    }, 0);
    const stepTwoTimer = setTimeout(() => {
      setScanStep(2);
    }, 280);

    const stepThreeTimer = setTimeout(() => {
      setScanStep(3);
    }, 560);

    const resultTimer = setTimeout(() => {
      const result = runResumeAuditAgent(rawText, roleKey, jdText, userProfile);
      setAnalysisResult(result);
      setResolvedChecklist(prev => {
        const next = { ...prev };
        result.checklist.forEach(item => {
          if (next[item.id] === undefined) {
            next[item.id] = !!item.isInitialResolved;
          }
        });
        return next;
      });
      setIsAnalyzing(false);
      setScanStep(0);
      auditTimersRef.current = [];
    }, 850);
    auditTimersRef.current = [stepOneTimer, stepTwoTimer, stepThreeTimer, resultTimer];
  };

  useEffect(() => () => auditTimersRef.current.forEach(clearTimeout), []);

  // Handle text uploads. PDF and DOCX extraction are added through dedicated parsers below.
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploadError('');
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('This file is larger than 10 MB. Choose a smaller resume file.');
      return;
    }

    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;
    const fileType = file.type || 'application/pdf';
    const extension = file.name.split('.').pop()?.toLowerCase();

    setIsExtractingResume(true);
    try {
      let text = '';
      if (['txt', 'json', 'md'].includes(extension)) {
        text = await file.text();
      } else if (extension === 'pdf') {
        const pdfjs = await import('pdfjs-dist');
        const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
        pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          const content = await page.getTextContent();
          return content.items.map(item => item.str).join(' ');
        }));
        text = pages.join('\n');
      } else if (extension === 'docx') {
        const mammothModule = await import('mammoth/mammoth.browser');
        const mammoth = mammothModule.default || mammothModule;
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = result.value;
      } else {
        setUploadError('Unsupported file type. Upload a PDF, DOCX, TXT, JSON, or Markdown file.');
        return;
      }

      text = text.trim();
      if (text.length < 80) {
        setUploadError('We could not extract enough selectable text from this file. If it is a scanned PDF, run OCR first or upload a text-based PDF/DOCX.');
        return;
      }
      const meta = extractCandidateMetadata(text, userProfile, fileName);
      setUploadedResume({
        fileName,
        fileSize,
        fileType,
        uploadSource: 'external',
        lastModified: 'Uploaded just now',
        parsedName: meta.parsedName,
        parsedCollege: meta.parsedCollege,
        parsedDegree: meta.parsedDegree,
        parsedCgpa: meta.parsedCgpa,
        skillsCount: meta.skillsCount,
        rawText: text
      });
      executeAgentAudit(text, targetRole);
    } catch (err) {
      console.error('Resume extraction failed:', err);
      setUploadError(`Could not read this resume (${err.message || 'unknown error'}). Try another file or paste its text into a TXT file.`);
    } finally {
      setIsExtractingResume(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleLoadDemoResume = () => {
    setUploadedResume(DEFAULT_RESUME_INFO);
    executeAgentAudit(DEFAULT_RESUME_INFO.rawText, targetRole);
  };

  const handleLoadFromBuilder = () => {
    if (resumeFromBuilder) {
      const candidateName = resumeFromBuilder.personal?.fullName || userProfile?.name || 'Candidate';
      const text = `${candidateName} | ${resumeFromBuilder.education?.[0]?.institution || userProfile?.college || 'Engineering College'} | Computer Science
Email: ${resumeFromBuilder.personal?.email || userProfile?.email || 'email@domain.com'} | Phone: ${resumeFromBuilder.personal?.phone || userProfile?.phone || '+91 98765 43210'} | LinkedIn: ${resumeFromBuilder.personal?.linkedin || 'linkedin.com/in/candidate'} | GitHub: ${resumeFromBuilder.personal?.github || 'github.com/candidate'}
Summary: ${resumeFromBuilder.personal?.summary || 'Engineering student focused on high-scale systems.'}
Skills: ${resumeFromBuilder.skills?.languages || ''}, ${resumeFromBuilder.skills?.frameworks || ''}, ${resumeFromBuilder.skills?.developerTools || ''}, ${resumeFromBuilder.skills?.coreSubjects || ''}
Experience: ${resumeFromBuilder.experience?.map(e => `${e.title} at ${e.company}: ${e.bullets?.join(' ')}`).join('\n') || ''}
Projects: ${resumeFromBuilder.projects?.map(p => `${p.name} (${p.tech}): ${p.bullets?.join(' ')}`).join('\n') || ''}`;

      const meta = extractCandidateMetadata(text, userProfile, `${candidateName.replace(/\s+/g, '_')}_Resume.json`);

      const generated = {
        fileName: `${candidateName.replace(/\s+/g, '_')}_Resume.json`,
        fileSize: `${Math.max(12, Math.round(text.length / 30))} KB`,
        fileType: 'application/json',
        uploadSource: 'builder',
        lastModified: 'Synced from PlaceIQ Resume Builder',
        parsedName: candidateName,
        parsedCollege: resumeFromBuilder.education?.[0]?.institution || meta.parsedCollege,
        parsedDegree: `${resumeFromBuilder.education?.[0]?.degree || 'B.Tech'} in ${resumeFromBuilder.education?.[0]?.field || 'Computer Science'}`,
        parsedCgpa: resumeFromBuilder.education?.[0]?.cgpa ? `${resumeFromBuilder.education[0].cgpa} / 10.0` : meta.parsedCgpa,
        skillsCount: meta.skillsCount,
        rawText: text
      };
      setUploadedResume(generated);
      executeAgentAudit(generated.rawText, targetRole);
    } else {
      handleLoadDemoResume();
    }
  };

  const handleCopyKeyword = async (keyword) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(keyword);
      setCopiedKeyword(keyword);
      setTimeout(() => setCopiedKeyword(null), 2000);
    } catch (err) {
      setUploadError('Clipboard access was blocked. Copy the keyword manually.');
    }
  };

  const getKeywordEvidence = (keyword) => {
    const lines = uploadedResume.rawText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const tokens = keyword.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter(token => token.length > 1);
    const fullMatch = lines.find(line => tokens.every(token => line.toLowerCase().includes(token)));
    if (fullMatch) return fullMatch;
    const relatedLines = tokens.map(token => lines.find(line => line.toLowerCase().includes(token))).filter(Boolean);
    return [...new Set(relatedLines)].slice(0, 2).join(' • ') || 'Matched in extracted resume text';
  };

  const handleCopyRewrite = async (rewrite, id) => {
    try {
      await navigator.clipboard.writeText(rewrite);
      setCopiedRewrite(id);
      setTimeout(() => setCopiedRewrite(null), 1800);
    } catch (err) {
      setUploadError('Clipboard access was blocked. Select and copy the rewrite text manually.');
    }
  };

  const toggleChecklistItem = (id) => {
    setResolvedChecklist(prev => {
      return { ...prev, [id]: !prev[id] };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.json,.md"
        style={{ display: 'none' }}
      />

      {/* ═════════════════════════════════════════════════════════════
          1. COMPACT COMMAND HEADER WITH ROLE BENCHMARK & ACTIONS
          ═════════════════════════════════════════════════════════════ */}
      <div
        className="card"
        style={{
          padding: '1.15rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-bright)',
            }}
          >
            <Wand2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0 }}>
                Resume Audit & Feedback
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Rule-Based Estimate
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Resume-text checks for role keywords, impact metrics, and ATS structure
            </p>
          </div>
        </div>

        {/* Global Action Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Target Role Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-glass-strong)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <Target size={14} color="var(--primary)" />
            <select
              value={targetRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setTargetRole(newRole);
                setIsCustomJdActive(false);
                executeAgentAudit(uploadedResume.rawText, newRole, PRESET_JDS[newRole].text);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="sde_amazon" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Amazon SDE 1</option>
              <option value="sde_microsoft" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Microsoft SWE</option>
              <option value="flipkart_ase" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Flipkart Associate SDE</option>
              <option value="tcs_digital" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>TCS Digital</option>
              <option value="infosys_sp" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Infosys Specialist Programmer</option>
            </select>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtractingResume}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Upload size={14} /> {isExtractingResume ? 'Reading Resume…' : 'Upload Resume'}
          </button>

          <button
            onClick={handleLoadFromBuilder}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <RefreshCw size={13} /> {resumeFromBuilder ? 'Sync Builder' : 'Load Demo Resume'}
          </button>

          <button
            onClick={() => executeAgentAudit(uploadedResume.rawText, targetRole)}
            className="btn btn-primary btn-sm"
            disabled={isAnalyzing}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem', fontWeight: 700 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={13} className="pulse-dot" style={{ animation: 'spin 1s linear infinite' }} />
                Auditing...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Re-run Agent Loop
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Scan Step Progress Bar */}
      {isAnalyzing && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass-strong)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>
              {scanStep === 1 && 'Ingesting & parsing candidate resume profile...'}
              {scanStep === 2 && 'Evaluating 2026 tech trends, metric density, and ATS hygiene...'}
              {scanStep === 3 && 'Finalizing ATS audit metrics and actionable checklist...'}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '100%'}</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--bg-glass-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '100%',
                background: 'var(--primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2. UNIFIED BENTO ROW: DOCUMENT HUB + ATS READINESS GAUGE
          ═════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: '1.25rem' }}>
        {/* Card A: Active Document Station & Drag-Drop Hub */}
        <div
          className="card"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: isDragOver ? '2px dashed #fafafa' : '1px solid var(--border-glass)',
            background: isDragOver ? 'rgba(255, 255, 255, 0.04)' : 'var(--bg-card)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="var(--text-bright)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0 }}>
                    {uploadedResume.fileName}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {uploadedResume.fileSize} • {uploadedResume.lastModified}
                  </div>
                </div>
              </div>

              <span className={`badge ${uploadedResume.uploadSource === 'demo' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                <Check size={11} /> {uploadedResume.uploadSource === 'demo' ? 'Demo profile' : uploadedResume.uploadSource === 'builder' ? 'Builder profile' : 'Resume loaded'}
              </span>
            </div>

            {/* Candidate Metadata Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-glass-strong)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>Candidate</span>
                <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{uploadedResume.parsedName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>College</span>
                <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{uploadedResume.parsedCollege || 'VIT Vellore'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>CGPA</span>
                <strong style={{ color: '#10b981', fontWeight: 800 }}>{uploadedResume.parsedCgpa || 'Not found'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', fontWeight: 600 }}>Extracted Skills</span>
                <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{uploadedResume.skillsCount} Technical</strong>
              </div>
            </div>
          </div>

          {/* Embedded Dropzone Subtext */}
          <div
            style={{
              marginTop: '0.85rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
            }}
          >
            <span>Drag & drop a selectable-text PDF, DOCX, TXT, JSON, or Markdown resume (max 10 MB)</span>
            <button
              onClick={handleLoadDemoResume}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}
            >
              Reset to Demo Profile
            </button>
          </div>
        </div>

        {/* Card B: Executive ATS Gauge & 5-Factor Score Strip */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          {/* Numerical ATS Circular Gauge */}
          <div style={{ textAlign: 'center', minWidth: '110px' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '3px solid #22c55e',
                margin: '0 auto 0.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(34, 197, 94, 0.08)',
              }}
            >
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {analysisResult.atsScore}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                / 100
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-bright)' }}>
              Estimated Resume Fit
            </div>
            <span style={{ fontSize: '0.68rem', color: analysisResult.atsScore >= 80 ? '#22c55e' : analysisResult.atsScore >= 70 ? '#eab308' : '#f87171', fontWeight: 600 }}>
              Rule-based estimate • not a candidate ranking
            </span>
            <div style={{ maxWidth: '180px', margin: '0.4rem auto 0', color: 'var(--text-dim)', fontSize: '0.62rem', lineHeight: 1.45 }}>
              JD match 35% · impact 25% · structure 20% · verbs 10% · scan estimate 10%
            </div>
          </div>

          {/* 3 Metric Pillar Progress Bars */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target JD Relevance</span>
                <strong style={{ color: 'var(--text-bright)' }}>{analysisResult.jdMatchRate}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'var(--bg-glass-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.jdMatchRate}%`, background: 'var(--primary)', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Impact & Metrics</span>
                <strong style={{ color: '#22c55e' }}>{analysisResult.impactMetricScore}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.impactMetricScore}%`, background: '#22c55e', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>ATS Structure & Hygiene</span>
                <strong style={{ color: '#eab308' }}>{analysisResult.formatScore}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.formatScore}%`, background: '#eab308', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <div role="alert" className="card" style={{ padding: '0.75rem 1rem', color: '#fecaca', borderColor: 'rgba(248, 113, 113, 0.35)', background: 'rgba(127, 29, 29, 0.18)', fontSize: '0.82rem' }}>
          {uploadError}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          3. WORKSPACE SEGMENTED TAB NAVIGATION
          ═════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
          marginTop: '0.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>

          <button
            onClick={() => setActiveWorkspaceTab('keywords')}
            className={`btn btn-sm ${activeWorkspaceTab === 'keywords' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          >
            <Zap size={13} /> Keywords ({analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length})
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('rewrites')}
            className={`btn btn-sm ${activeWorkspaceTab === 'rewrites' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          >
            <Wand2 size={13} /> Rewrite drafts ({analysisResult.feedbackLoop.length})
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('sections')}
            className={`btn btn-sm ${activeWorkspaceTab === 'sections' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          >
            <Layers size={13} /> Section Audit ({analysisResult.sectionAudit.length})
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('checklist')}
            className={`btn btn-sm ${activeWorkspaceTab === 'checklist' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
          >
            <ListChecks size={13} /> Checklist ({analysisResult.checklist.length})
          </button>
        </div>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          Target: <strong>{isCustomJdActive ? 'Custom job description' : `${currentJD.company} — ${currentJD.role}`}</strong>
        </span>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          4. WORKSPACE TAB CONTENTS (COMPACT & PRECISE)
          ═════════════════════════════════════════════════════════════ */}

      {activeWorkspaceTab === 'rewrites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div className="card" style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            These are writing templates based on your bullets. Replace every bracketed placeholder with a result you can verify; don’t add numbers or claims you can’t support.
          </div>
          {analysisResult.feedbackLoop.length ? analysisResult.feedbackLoop.map((item) => (
            <article key={item.id} className="card" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '0.85rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>Current bullet</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.55 }}>{item.beforeText}</p>
                <p style={{ margin: '0.65rem 0 0', color: 'var(--text-dim)', fontSize: '0.76rem' }}>{item.critique}</p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem', color: '#86efac', fontSize: '0.78rem' }}>Rewrite template</h4>
                <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{item.afterText}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.73rem' }}>{item.rationale}</span>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => handleCopyRewrite(item.afterText, item.id)}>
                    <Copy size={13} /> {copiedRewrite === item.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </article>
          )) : (
            <div className="card" style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              No rewrite drafts were generated. Add experience or project bullets to your resume and run the audit again.
            </div>
          )}
        </div>
      )}

      {/* TAB: KEYWORD INTELLIGENCE & JD MATCH MATRIX */}
      {activeWorkspaceTab === 'keywords' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1.25rem' }}>
          {/* Left Column: Target Role Benchmark & Custom JD */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Target size={16} /> Role Requirements
              </h3>
              <span className="badge badge-primary">{isCustomJdActive ? 'Custom description' : 'Sample role template'}</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', whiteSpace: 'pre-line', background: 'var(--bg-glass-strong)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              {activeJDText}
            </div>

            {/* Custom JD Editor Accordion */}
            <div>
              <button
                onClick={() => setShowCustomJD(!showCustomJD)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.76rem', color: 'var(--text-muted)', padding: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {showCustomJD ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showCustomJD ? 'Close Custom JD Editor' : 'Paste Custom Job Description'}
              </button>

              {showCustomJD && (
                <div style={{ marginTop: '0.65rem' }}>
                  <textarea
                    className="textarea"
                    rows={5}
                    value={customJDText}
                    onChange={(e) => setCustomJDText(e.target.value)}
                    placeholder="Paste job description requirements here..."
                    style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                    <button
                      onClick={() => {
                        setIsCustomJdActive(true);
                        executeAgentAudit(uploadedResume.rawText, targetRole, customJDText);
                      }}
                      disabled={customJDText.trim().length < 30 || isAnalyzing}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    >
                      Audit Against Custom JD
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Keyword Match vs Missing Matrix */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Matched Keywords Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} />
                  Found in Your Resume ({analysisResult.matchedKeywords.length})
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>High-Frequency JD Match</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.5rem' }}>
                {analysisResult.matchedKeywords.map((kw) => (
                  <details key={kw} style={{ padding: '0.45rem 0.6rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.22)' }}>
                    <summary style={{ color: '#10b981', fontSize: '0.75rem', cursor: 'pointer' }}><Check size={12} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />{kw}</summary>
                    <p style={{ margin: '0.45rem 0 0', color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: 1.45 }}>{getKeywordEvidence(kw)}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Critical Missing Keywords */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={15} />
                  Missing Required Keywords ({analysisResult.missingKeywords.length})
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click chip to copy</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Add a term only when it accurately describes your skills or experience. These are copied as prompts, not recommendations to claim experience you don’t have.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.55rem' }}>
                {analysisResult.missingKeywords.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCopyKeyword(kw.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: 'inherit',
                      textAlign: 'left',
                      font: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: kw.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: kw.priority === 'High' ? '#f87171' : '#f59e0b',
                          fontWeight: 700,
                        }}
                      >
                        {kw.priority}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        + {kw.name}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.4rem' }}>
                      {copiedKeyword === kw.name ? (
                        <span style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>Copied!</span>
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECTION AUDIT */}
      {activeWorkspaceTab === 'sections' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '0.75rem' }}>
          {analysisResult.sectionAudit.map((sec, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: sec.status === 'pass' ? '1px solid var(--border-subtle)' : '1px solid rgba(234, 179, 8, 0.3)',
                background: 'var(--bg-card)',
                gap: '0.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0 }}>
                    {sec.section}
                  </h4>
                  <span
                    className={sec.status === 'pass' ? 'badge badge-success' : 'badge badge-warning'}
                    style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
                  >
                    {sec.score}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                  {sec.summary}
                </p>
              </div>

              <div
                style={{
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass-strong)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.72rem',
                  color: sec.status === 'pass' ? 'var(--text-main)' : '#f59e0b',
                }}
              >
                💡 {sec.tip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CHECKLIST */}
      {activeWorkspaceTab === 'checklist' && (
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={15} color="#22c55e" /> Actionable Fixes ({analysisResult.checklist.length})
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Mark as reviewed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {analysisResult.checklist.map((item) => {
              const isResolved = resolvedChecklist[item.id];
              return (
                <label
                  key={item.id}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isResolved ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-glass-strong)',
                    border: isResolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <input
                    id={`check-${item.id}`}
                    type="checkbox"
                    checked={isResolved}
                    onChange={() => toggleChecklistItem(item.id)}
                    style={{ cursor: 'pointer', accentColor: '#22c55e' }}
                  />

                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: item.impact === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: item.impact === 'High' ? '#f87171' : '#facc15',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.impact}
                  </span>

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <strong
                      style={{
                        fontSize: '0.78rem',
                        color: isResolved ? '#4ade80' : 'var(--text-bright)',
                        textDecoration: isResolved ? 'line-through' : 'none',
                      }}
                    >
                      {item.title}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                      {item.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
