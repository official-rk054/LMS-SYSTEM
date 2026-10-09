import React, { useState, useRef } from 'react';
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
  Code,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';

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
  fileName: 'Aarav_Sharma_SDE_Resume_2026.pdf',
  fileSize: '194 KB',
  fileType: 'application/pdf',
  uploadSource: 'external',
  lastModified: 'Today at 01:24 AM',
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

export const ResumeAnalyzer = ({ resumeFromBuilder }) => {
  const [targetRole, setTargetRole] = useState('sde_amazon');
  const [showCustomJD, setShowCustomJD] = useState(false);
  const [customJDText, setCustomJDText] = useState(PRESET_JDS.sde_amazon.text);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('keywords'); // 'keywords', 'sections', 'checklist', 'parsed_text'

  // File Import State
  const [uploadedResume, setUploadedResume] = useState(() => {
    if (resumeFromBuilder) {
      return {
        fileName: `${resumeFromBuilder.personal.fullName.replace(/\s+/g, '_')}_Resume.json`,
        fileSize: '42 KB',
        fileType: 'application/json',
        uploadSource: 'builder',
        lastModified: 'Synced from PlaceIQ Resume Builder',
        parsedName: resumeFromBuilder.personal.fullName,
        parsedCollege: 'Vellore Institute of Technology (VIT)',
        parsedDegree: `${resumeFromBuilder.education?.[0]?.degree || 'B.Tech'} in ${resumeFromBuilder.education?.[0]?.field || 'CSE'}`,
        parsedCgpa: `${resumeFromBuilder.education?.[0]?.cgpa || '8.85'} / 10.0`,
        skillsCount: 18,
        rawText: `${resumeFromBuilder.personal.fullName}
${resumeFromBuilder.personal.email} | ${resumeFromBuilder.personal.phone} | ${resumeFromBuilder.personal.linkedin}
Summary: ${resumeFromBuilder.personal.summary}
Skills: ${resumeFromBuilder.skills?.languages || ''}, ${resumeFromBuilder.skills?.frameworks || ''}, ${resumeFromBuilder.skills?.developerTools || ''}, ${resumeFromBuilder.skills?.coreSubjects || ''}
Experience: ${resumeFromBuilder.experience?.map(e => `${e.title} at ${e.company}: ${e.bullets?.join(' ')}`).join('\n') || ''}
Projects: ${resumeFromBuilder.projects?.map(p => `${p.name} (${p.tech}): ${p.bullets?.join(' ')}`).join('\n') || ''}`
      };
    }
    return DEFAULT_RESUME_INFO;
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const [checklistFilter, setChecklistFilter] = useState('all');

  // Resolved Checklist items
  const [resolvedChecklist, setResolvedChecklist] = useState({
    item1: false,
    item2: true,
    item3: false,
    item4: true,
    item5: false,
  });

  const fileInputRef = useRef(null);

  // Current JD data
  const currentJD = PRESET_JDS[targetRole] || PRESET_JDS.sde_amazon;

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState({
    atsScore: 89,
    jdMatchRate: 86,
    formatScore: 98,
    hardSkillsScore: 91,
    impactMetricScore: 84,
    matchedKeywords: [
      'Data Structures & Algorithms',
      'C++',
      'Python',
      'SQL',
      'Docker',
      'REST APIs',
      'AWS S3',
      'Microservices',
      'Unit Testing',
      'Git',
    ],
    missingKeywords: [
      { name: 'CI/CD Pipelines (GitHub Actions / Jenkins)', priority: 'High', category: 'DevOps' },
      { name: 'AWS Lambda / Serverless', priority: 'High', category: 'Cloud' },
      { name: 'System Design (LLD / HLD)', priority: 'Medium', category: 'Architecture' },
      { name: 'DynamoDB / NoSQL Databases', priority: 'Medium', category: 'Database' },
    ],
    sectionAudit: [
      {
        section: 'Contact Info & Profile Links',
        status: 'pass',
        score: '100%',
        summary: 'Complete header with email, Indian mobile (+91), active LinkedIn and GitHub links.',
        tip: 'All contact hyperlinks are recognized as clickable ATS-safe URLs.'
      },
      {
        section: 'Academics & CGPA Cutoff Compliance',
        status: 'pass',
        score: '96%',
        summary: 'B.Tech CSE at VIT Vellore with CGPA 8.85 comfortably clears company 7.0 eligibility.',
        tip: 'Standardized degree naming adheres to Fortune 500 recruiting filters.'
      },
      {
        section: 'Technical Skills Categorization',
        status: 'pass',
        score: '92%',
        summary: 'Clear division into Languages, Web, Cloud, and Core CS subjects.',
        tip: 'Includes high-demand campus recruiting skills: C++, Python, SQL, Docker.'
      },
      {
        section: 'Quantifiable Metrics & Scale Indicators',
        status: 'pass',
        score: '88%',
        summary: 'Excellent usage of numbers: "150k daily events", "32% latency reduction", "400+ peers".',
        tip: 'Recruiters prioritize candidates with tangible business & performance metrics.'
      },
      {
        section: 'Cloud & Systems Architecture',
        status: 'warning',
        score: '76%',
        summary: 'AWS S3 is mentioned, but CI/CD automation & serverless components are omitted.',
        tip: 'Amazon SDE-1 JD specifically looks for continuous integration pipeline exposure.'
      },
      {
        section: 'ATS Formatting & Typography Hygiene',
        status: 'pass',
        score: '100%',
        summary: 'Single-column structure, standard bullet points, 0 unparseable icons/tables.',
        tip: 'Clean linear parse stream guaranteed across Workday, Taleo, and Greenhouse.'
      }
    ],
    checklist: [
      {
        id: 'item1',
        impact: 'High',
        title: 'Include CI/CD Pipeline Keyword in Skills/Projects',
        description: 'Amazon automated ATS parsers search specifically for "CI/CD" or "GitHub Actions" in backend roles.',
      },
      {
        id: 'item2',
        impact: 'High',
        title: 'Include Indian Mobile Code (+91) with WhatsApp Accessibility',
        description: 'Recruiters send interview shortlisting links and drive schedules directly via SMS/WhatsApp.',
      },
      {
        id: 'item3',
        impact: 'High',
        title: 'Specify Serverless AWS Stack (e.g. Lambda, S3, API Gateway)',
        description: 'Mentioning serverless deployment elevates cloud score by +8% for cloud-first tier-1 firms.',
      },
      {
        id: 'item4',
        impact: 'Medium',
        title: 'Single-Column Linear Reading Format Verified',
        description: 'Two-column tables often scramble parse order in older university ATS systems.',
      },
      {
        id: 'item5',
        impact: 'Medium',
        title: 'Include Live GitHub Demo Links for Top 2 Projects',
        description: 'Helps technical interviewers directly inspect clean commit history and test coverage.',
      }
    ]
  });

  // Handle external file upload
  const handleFileUpload = (file) => {
    if (!file) return;

    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;
    const fileType = file.type || 'application/pdf';

    if (file.name.endsWith('.txt') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setUploadedResume({
          fileName,
          fileSize,
          fileType,
          uploadSource: 'external',
          lastModified: 'Uploaded just now',
          parsedName: 'Aarav Sharma',
          parsedCollege: 'Vellore Institute of Technology (VIT)',
          parsedDegree: 'B.Tech Computer Science & Engineering',
          parsedCgpa: '8.85 / 10.0',
          skillsCount: 17,
          rawText: content
        });
        triggerScanSimulation();
      };
      reader.readAsText(file);
    } else {
      setUploadedResume({
        fileName,
        fileSize,
        fileType,
        uploadSource: 'external',
        lastModified: 'Uploaded just now',
        parsedName: 'Aarav Sharma',
        parsedCollege: 'Vellore Institute of Technology (VIT)',
        parsedDegree: 'B.Tech Computer Science & Engineering',
        parsedCgpa: '8.85 / 10.0',
        skillsCount: 16,
        rawText: DEFAULT_RESUME_INFO.rawText
      });
      triggerScanSimulation();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
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
    triggerScanSimulation();
  };

  const handleLoadFromBuilder = () => {
    if (resumeFromBuilder) {
      setUploadedResume({
        fileName: `${resumeFromBuilder.personal.fullName.replace(/\s+/g, '_')}_Resume.json`,
        fileSize: '42 KB',
        fileType: 'application/json',
        uploadSource: 'builder',
        lastModified: 'Synced from PlaceIQ Resume Builder',
        parsedName: resumeFromBuilder.personal.fullName,
        parsedCollege: 'Vellore Institute of Technology (VIT)',
        parsedDegree: `${resumeFromBuilder.education?.[0]?.degree || 'B.Tech'} in ${resumeFromBuilder.education?.[0]?.field || 'CSE'}`,
        parsedCgpa: `${resumeFromBuilder.education?.[0]?.cgpa || '8.85'} / 10.0`,
        skillsCount: 18,
        rawText: `${resumeFromBuilder.personal.fullName}
${resumeFromBuilder.personal.email} | ${resumeFromBuilder.personal.phone} | ${resumeFromBuilder.personal.linkedin}
Summary: ${resumeFromBuilder.personal.summary}
Skills: ${resumeFromBuilder.skills?.languages || ''}, ${resumeFromBuilder.skills?.frameworks || ''}, ${resumeFromBuilder.skills?.developerTools || ''}, ${resumeFromBuilder.skills?.coreSubjects || ''}
Experience: ${resumeFromBuilder.experience?.map(e => `${e.title} at ${e.company}: ${e.bullets?.join(' ')}`).join('\n') || ''}
Projects: ${resumeFromBuilder.projects?.map(p => `${p.name} (${p.tech}): ${p.bullets?.join(' ')}`).join('\n') || ''}`
      });
    } else {
      handleLoadDemoResume();
    }
    triggerScanSimulation();
  };

  const triggerScanSimulation = () => {
    setIsAnalyzing(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 350);

    setTimeout(() => {
      setScanStep(3);
    }, 700);

    setTimeout(() => {
      setIsAnalyzing(false);
      setScanStep(0);
      setAnalysisResult(prev => ({
        ...prev,
        atsScore: 91,
        jdMatchRate: 88,
        hardSkillsScore: 94,
        impactMetricScore: 89,
      }));
    }, 1100);
  };

  const handleCopyKeyword = (keyword) => {
    navigator.clipboard?.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const toggleChecklistItem = (id) => {
    setResolvedChecklist(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const resolvedCount = Object.values(next).filter(Boolean).length;
      const bonusScore = Math.min(84 + resolvedCount * 3, 98);
      setAnalysisResult(curr => ({
        ...curr,
        atsScore: bonusScore,
      }));
      return next;
    });
  };

  const filteredChecklist = analysisResult.checklist.filter(item => {
    if (checklistFilter === 'all') return true;
    if (checklistFilter === 'high') return item.impact === 'High';
    if (checklistFilter === 'medium') return item.impact === 'Medium';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.json"
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
            <FileCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0 }}>
                AI Resume Analyzer & ATS Benchmark
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                Fortune 500 Ready
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
              Benchmarked against Indian campus recruiting filters: Workday, Taleo & Greenhouse
            </p>
          </div>
        </div>

        {/* Global Action Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Target Role Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(24, 24, 28, 0.8)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Target size={14} color="var(--text-muted)" />
            <select
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                setCustomJDText(PRESET_JDS[e.target.value].text);
                triggerScanSimulation();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-bright)',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="sde_amazon" style={{ background: '#09090b' }}>Amazon SDE 1 (₹44.5 LPA)</option>
              <option value="sde_microsoft" style={{ background: '#09090b' }}>Microsoft SWE (₹45.0 LPA)</option>
              <option value="flipkart_ase" style={{ background: '#09090b' }}>Flipkart Assoc. SDE (₹32.0 LPA)</option>
              <option value="tcs_digital" style={{ background: '#09090b' }}>TCS Digital (₹7.5 LPA)</option>
              <option value="infosys_sp" style={{ background: '#09090b' }}>Infosys SP (₹9.5 LPA)</option>
            </select>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Upload size={14} /> Import File
          </button>

          <button
            onClick={handleLoadFromBuilder}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <RefreshCw size={13} /> Sync Builder
          </button>

          <button
            onClick={triggerScanSimulation}
            className="btn btn-primary btn-sm"
            disabled={isAnalyzing}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem', fontWeight: 700 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={13} className="pulse-dot" style={{ animation: 'spin 1s linear infinite' }} />
                Scanning...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Run AI Audit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Scan Step Progress Bar */}
      {isAnalyzing && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(24, 24, 28, 0.9)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <span>
              {scanStep === 1 && 'Tokenizing single-column layout stream...'}
              {scanStep === 2 && 'Cross-referencing JD keyword weights & density...'}
              {scanStep === 3 && 'Evaluating quantifiable impact metrics...'}
            </span>
            <span style={{ fontWeight: 700, color: '#fafafa' }}>{scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '100%'}</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '100%',
                background: '#fafafa',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          2. UNIFIED BENTO ROW: DOCUMENT HUB + ATS READINESS GAUGE
          ═════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1.25rem' }}>
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

              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <Check size={11} /> 100% Parsed
              </span>
            </div>

            {/* Candidate Metadata Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                padding: '0.65rem',
                background: 'rgba(9, 9, 11, 0.5)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.68rem' }}>Candidate</span>
                <strong style={{ color: 'var(--text-bright)' }}>{uploadedResume.parsedName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.68rem' }}>College</span>
                <strong style={{ color: 'var(--text-bright)' }}>VIT Vellore</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.68rem' }}>CGPA</span>
                <strong style={{ color: '#22c55e' }}>{uploadedResume.parsedCgpa}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.68rem' }}>Extracted Skills</span>
                <strong style={{ color: '#fafafa' }}>{uploadedResume.skillsCount} Technical</strong>
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
            <span>Drag & drop <code>.pdf</code>, <code>.docx</code>, <code>.json</code> here to re-scan</span>
            <button
              onClick={handleLoadDemoResume}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}
            >
              Reset to Demo Profile
            </button>
          </div>
        </div>

        {/* Card B: Executive ATS Gauge & 3 Key Pillars */}
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
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fafafa', lineHeight: 1 }}>
                {analysisResult.atsScore}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                / 100
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-bright)' }}>
              ATS Score
            </div>
            <span style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600 }}>
              Top 12% Candidate
            </span>
          </div>

          {/* 3 Metric Pillar Progress Bars */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target JD Relevance</span>
                <strong style={{ color: 'var(--text-bright)' }}>{analysisResult.jdMatchRate}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.jdMatchRate}%`, background: '#fafafa', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>ATS Structure & Hygiene</span>
                <strong style={{ color: '#22c55e' }}>{analysisResult.formatScore}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.formatScore}%`, background: '#22c55e', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Quantifiable Metrics & Scale</span>
                <strong style={{ color: '#eab308' }}>{analysisResult.impactMetricScore}%</strong>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisResult.impactMetricScore}%`, background: '#eab308', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveWorkspaceTab('keywords')}
            className={`btn btn-sm ${activeWorkspaceTab === 'keywords' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            <Zap size={14} /> Keyword Intelligence ({analysisResult.matchedKeywords.length + analysisResult.missingKeywords.length})
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('sections')}
            className={`btn btn-sm ${activeWorkspaceTab === 'sections' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            <Layers size={14} /> Section Health Audit (6)
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('checklist')}
            className={`btn btn-sm ${activeWorkspaceTab === 'checklist' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            <ListChecks size={14} /> Optimization Checklist ({analysisResult.checklist.length})
          </button>

          <button
            onClick={() => setActiveWorkspaceTab('parsed_text')}
            className={`btn btn-sm ${activeWorkspaceTab === 'parsed_text' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            <Code size={14} /> Extracted ATS Stream
          </button>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Target: <strong>{currentJD.company} ({currentJD.package})</strong>
        </span>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          4. WORKSPACE TAB CONTENTS
          ═════════════════════════════════════════════════════════════ */}

      {/* TAB 1: KEYWORD INTELLIGENCE & JD MATCH MATRIX */}
      {activeWorkspaceTab === 'keywords' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '1.25rem' }}>
          {/* Left Column: Target Role Benchmark & Custom JD */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Target size={16} /> Role Requirements
              </h3>
              <span className="badge badge-primary">{currentJD.package}</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', whiteSpace: 'pre-line', background: 'rgba(9, 9, 11, 0.4)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {currentJD.text}
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
                      onClick={triggerScanSimulation}
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
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} />
                  Found in Your Resume ({analysisResult.matchedKeywords.length})
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>High-Frequency JD Match</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      color: '#4ade80',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Check size={12} /> {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Missing Keywords with 1-Click Copy */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={15} />
                  Missing Required Keywords ({analysisResult.missingKeywords.length})
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Click chip to copy</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Adding these keywords into your Projects or Skills section increases shortlisting probability by up to 28%:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                {analysisResult.missingKeywords.map((kw, i) => (
                  <div
                    key={i}
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: kw.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: kw.priority === 'High' ? '#f87171' : '#facc15',
                          fontWeight: 700,
                        }}
                      >
                        {kw.priority}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-bright)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        + {kw.name}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-dim)', flexShrink: 0, marginLeft: '0.4rem' }}>
                      {copiedKeyword === kw.name ? (
                        <span style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 700 }}>Copied!</span>
                      ) : (
                        <Copy size={13} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTION HEALTH AUDIT (2X3 BALANCED GRID) */}
      {activeWorkspaceTab === 'sections' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {analysisResult.sectionAudit.map((sec, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: sec.status === 'pass' ? '1px solid var(--border-subtle)' : '1px solid rgba(234, 179, 8, 0.3)',
                background: 'var(--bg-card)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0 }}>
                    {sec.section}
                  </h4>
                  <span
                    className={sec.status === 'pass' ? 'badge badge-success' : 'badge badge-warning'}
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    {sec.score}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0 0 0.85rem' }}>
                  {sec.summary}
                </p>
              </div>

              <div
                style={{
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(9, 9, 11, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.72rem',
                  color: sec.status === 'pass' ? 'var(--text-main)' : '#facc15',
                }}
              >
                💡 {sec.tip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RECRUITER OPTIMIZATION CHECKLIST */}
      {activeWorkspaceTab === 'checklist' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={17} color="#22c55e" /> Actionable Shortlisting Recommendations
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', margin: '0.2rem 0 0' }}>
                Check items as you apply them to your resume. Each verified resolution boosts your ATS score dynamically.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setChecklistFilter('all')}
                className={`btn btn-sm ${checklistFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                All ({analysisResult.checklist.length})
              </button>
              <button
                onClick={() => setChecklistFilter('high')}
                className={`btn btn-sm ${checklistFilter === 'high' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                High Impact
              </button>
              <button
                onClick={() => setChecklistFilter('medium')}
                className={`btn btn-sm ${checklistFilter === 'medium' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                Medium Impact
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredChecklist.map((item) => {
              const isResolved = resolvedChecklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isResolved ? 'rgba(34, 197, 94, 0.05)' : 'rgba(9, 9, 11, 0.4)',
                    border: isResolved ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isResolved}
                    onChange={() => toggleChecklistItem(item.id)}
                    style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#22c55e' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: item.impact === 'High' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: item.impact === 'High' ? '#f87171' : '#facc15',
                          fontWeight: 700,
                        }}
                      >
                        {item.impact} Impact
                      </span>
                      <strong
                        style={{
                          fontSize: '0.84rem',
                          color: isResolved ? '#4ade80' : 'var(--text-bright)',
                          textDecoration: isResolved ? 'line-through' : 'none',
                        }}
                      >
                        {item.title}
                      </strong>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: EXTRACTED ATS TEXT STREAM */}
      {activeWorkspaceTab === 'parsed_text' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-bright)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Code size={16} /> Raw Linear ATS Parse Stream
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: '0.15rem 0 0' }}>
                This is the exact tokenized text stream consumed by Fortune 500 ATS parsers without styling or column breaks.
              </p>
            </div>
            <span className="badge badge-success">0 Unparseable Characters</span>
          </div>

          <pre
            style={{
              padding: '1rem',
              background: '#09090b',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-main)',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '380px',
              overflowY: 'auto',
            }}
          >
            {uploadedResume.rawText}
          </pre>
        </div>
      )}
    </div>
  );
};
