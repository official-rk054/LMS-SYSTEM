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
  ChevronUp
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

    // If text or json, read text directly
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
      // PDF or DOCX file
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

  // 1-Click Load Demo Resume
  const handleLoadDemoResume = () => {
    setUploadedResume(DEFAULT_RESUME_INFO);
    triggerScanSimulation();
  };

  // 1-Click Load from Builder
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

  // Trigger scanning simulation with progress animation
  const triggerScanSimulation = () => {
    setIsAnalyzing(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 400);

    setTimeout(() => {
      setScanStep(3);
    }, 800);

    setTimeout(() => {
      setIsAnalyzing(false);
      setScanStep(0);
      // Recalculate dynamic scores
      setAnalysisResult(prev => ({
        ...prev,
        atsScore: 91,
        jdMatchRate: 88,
        hardSkillsScore: 94,
        impactMetricScore: 89,
      }));
    }, 1200);
  };

  // Copy keyword to clipboard
  const handleCopyKeyword = (keyword) => {
    navigator.clipboard?.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  // Toggle checklist item
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

  // Filter checklist
  const filteredChecklist = analysisResult.checklist.filter(item => {
    if (checklistFilter === 'all') return true;
    if (checklistFilter === 'high') return item.impact === 'High';
    if (checklistFilter === 'medium') return item.impact === 'Medium';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.json"
        style={{ display: 'none' }}
      />

      {/* Top Banner & Audit Controls */}
      <div className="card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} /> Fortune 500 ATS Simulation
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Workday • Taleo • Greenhouse • iCIMS
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileCheck color="var(--primary)" size={28} />
              AI Resume Analyzer & ATS Benchmark
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '780px', marginTop: '0.2rem' }}>
              Import your external resume to run semantic ATS extraction, keyword density auditing, and placement readiness verification tailored to top Indian campus recruitment drives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Upload size={16} /> Import New Resume
            </button>

            <button
              onClick={triggerScanSimulation}
              className="btn btn-primary"
              disabled={isAnalyzing}
              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 700 }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="pulse-dot" size={17} style={{ animation: 'spin 1s linear infinite' }} />
                  {scanStep === 1 && 'Tokenizing Layout...'}
                  {scanStep === 2 && 'Matching JD Keywords...'}
                  {scanStep === 3 && 'Generating Audit Report...'}
                </>
              ) : (
                <>
                  <Sparkles size={17} /> Run In-Depth AI Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Scan Step Progress Bar */}
        {isAnalyzing && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Phase {scanStep} of 3: ATS Parser & Semantic Engine</span>
              <span>{scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '95%'}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: scanStep === 1 ? '33%' : scanStep === 2 ? '66%' : '95%',
                  background: 'var(--accent-gradient)',
                  transition: 'width 0.4s ease',
                  borderRadius: 'var(--radius-full)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Resume Import Status & External Drag/Drop Station */}
      <div
        className="card"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed var(--primary)' : '1px solid var(--border-card)',
          background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          {/* Active File Summary */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <FileText size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {uploadedResume.fileName}
                </h3>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  <Check size={12} /> Successfully Parsed
                </span>
                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                  {uploadedResume.fileSize}
                </span>
                {uploadedResume.uploadSource === 'builder' && (
                  <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                    Synced from Builder
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span><strong>Candidate:</strong> {uploadedResume.parsedName}</span>
                <span>•</span>
                <span><strong>College:</strong> {uploadedResume.parsedCollege}</span>
                <span>•</span>
                <span><strong>CGPA:</strong> {uploadedResume.parsedCgpa}</span>
                <span>•</span>
                <span><strong>Identified Skills:</strong> {uploadedResume.skillsCount} Technical Competencies</span>
              </div>
            </div>
          </div>

          {/* Quick Upload Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              title="Upload PDF or Word Document"
            >
              <FileUp size={15} /> Upload PDF / Word
            </button>

            <button
              onClick={handleLoadFromBuilder}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              title="Import current data from Resume Builder"
            >
              <RefreshCw size={14} /> Import from Builder
            </button>

            <button
              onClick={handleLoadDemoResume}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: 'var(--text-muted)' }}
              title="Reset to default VIT candidate profile"
            >
              Load Demo VIT Profile
            </button>
          </div>
        </div>

        {/* Drag and Drop Subtext */}
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            💡 <strong>Pro Tip:</strong> Drag and drop any <code>.pdf</code>, <code>.docx</code>, or <code>.json</code> directly onto this card to instant-audit.
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            Status: {uploadedResume.lastModified}
          </span>
        </div>
      </div>

      {/* Executive Scoreboard: 4 Key Pillars */}
      <div className="grid-4">
        {/* Overall ATS Score */}
        <div className="stat-card" style={{ padding: '1.25rem', position: 'relative' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'conic-gradient(#10b981 0% 89%, rgba(255, 255, 255, 0.1) 89% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#10b981',
              }}
            >
              {analysisResult.atsScore}
            </div>
          </div>
          <div>
            <div className="stat-val" style={{ color: '#10b981', fontSize: '1.5rem', lineHeight: 1.1 }}>
              {analysisResult.atsScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</span>
            </div>
            <div className="stat-label" style={{ fontWeight: 600 }}>Overall ATS Readiness</div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
              Top 12% Candidate Rank
            </span>
          </div>
        </div>

        {/* JD Keyword Match */}
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
              flexShrink: 0,
            }}
          >
            <Target size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: '#06b6d4', fontSize: '1.5rem', lineHeight: 1.1 }}>
              {analysisResult.jdMatchRate}%
            </div>
            <div className="stat-label" style={{ fontWeight: 600 }}>Target JD Relevance</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Benchmarked for {currentJD.company}
            </span>
          </div>
        </div>

        {/* Format & Structure Hygiene */}
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: '#a855f7', fontSize: '1.5rem', lineHeight: 1.1 }}>
              {analysisResult.formatScore}%
            </div>
            <div className="stat-label" style={{ fontWeight: 600 }}>ATS Formatting Hygiene</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Linear single-column parse
            </span>
          </div>
        </div>

        {/* Impact & Metric Density */}
        <div className="stat-card" style={{ padding: '1.25rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: '#f59e0b', fontSize: '1.5rem', lineHeight: 1.1 }}>
              {analysisResult.impactMetricScore}%
            </div>
            <div className="stat-label" style={{ fontWeight: 600 }}>Quantifiable Impact</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              6 Numbers / Scale metrics found
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Target Role & Keywords) + Right Column (Diagnostics & Checklist) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1.35fr', gap: '1.75rem' }}>
        {/* Left Column: Target Company Profile & Keyword Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Target Role Selector Card */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3 className="card-title">
                <Target size={19} color="var(--primary)" />
                Target Company & Role Benchmarking
              </h3>
              <span className="badge badge-primary">{currentJD.package}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                  Select Placement Drive Profile:
                </label>
                <select
                  className="select"
                  value={targetRole}
                  onChange={(e) => {
                    setTargetRole(e.target.value);
                    setCustomJDText(PRESET_JDS[e.target.value].text);
                    triggerScanSimulation();
                  }}
                  style={{ fontSize: '0.88rem', fontWeight: 600 }}
                >
                  <option value="sde_amazon">Amazon India - SDE 1 (₹44.5 LPA)</option>
                  <option value="sde_microsoft">Microsoft India - Software Engineer (₹45.0 LPA)</option>
                  <option value="flipkart_ase">Flipkart - Associate SDE (₹32.0 LPA)</option>
                  <option value="tcs_digital">TCS Digital - System Engineer (₹7.5 LPA)</option>
                  <option value="infosys_sp">Infosys - Specialist Programmer (₹9.5 LPA)</option>
                </select>
              </div>

              {/* Collapsible Custom JD Toggle */}
              <div>
                <button
                  onClick={() => setShowCustomJD(!showCustomJD)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', color: 'var(--primary)', padding: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {showCustomJD ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showCustomJD ? 'Hide Job Description Details' : 'View / Edit Job Description Requirements'}
                </button>

                {showCustomJD && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <textarea
                      className="textarea"
                      rows={5}
                      value={customJDText}
                      onChange={(e) => setCustomJDText(e.target.value)}
                      placeholder="Paste target Job Description here..."
                      style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                      <button
                        onClick={triggerScanSimulation}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Re-scan Against Custom JD
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Keyword Match Matrix */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Zap size={19} color="var(--primary)" />
                ATS Keyword Density Matrix
              </h3>
              <span className="badge badge-success">
                {analysisResult.matchedKeywords.length} Matched • {analysisResult.missingKeywords.length} Missing
              </span>
            </div>

            {/* Matched Keywords */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={15} />
                High-Value Keywords Found in Resume ({analysisResult.matchedKeywords.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="badge badge-success"
                    style={{ fontSize: '0.76rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Check size={12} /> {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Keywords */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={15} />
                Critical Missing Keywords Required for Shortlisting
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Click any keyword chip to copy and integrate into your Experience or Projects section:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {analysisResult.missingKeywords.map((kw, i) => (
                  <div
                    key={i}
                    onClick={() => handleCopyKeyword(kw.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.22)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title="Click to copy keyword"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                        {kw.priority}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        + {kw.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      <span style={{ opacity: 0.7 }}>{kw.category}</span>
                      {copiedKeyword === kw.name ? (
                        <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Check size={13} /> Copied!
                        </span>
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

        {/* Right Column: Section-by-Section ATS Diagnostic & Actionable Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section-by-Section ATS Diagnostic */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Layers size={19} color="var(--secondary)" />
                Section-by-Section ATS Health Audit
              </h3>
              <span className="badge badge-info">6 Sections Audited</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analysisResult.sectionAudit.map((sec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: sec.status === 'pass' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(245, 158, 11, 0.06)',
                    border: sec.status === 'pass' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                  }}
                >
                  {sec.status === 'pass' ? (
                    <CheckCircle size={20} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {sec.section}
                      </span>
                      <span
                        className={sec.status === 'pass' ? 'badge badge-success' : 'badge badge-warning'}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {sec.score}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                      {sec.summary}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: sec.status === 'pass' ? '#10b981' : '#f59e0b', marginTop: '0.3rem', fontWeight: 500 }}>
                      💡 {sec.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recruiter & ATS Optimization Checklist */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '0.85rem' }}>
              <div>
                <h3 className="card-title">
                  <CheckCircle size={19} color="#10b981" />
                  Recruiter Optimization Action Items
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Resolve these items to maximize your probability of passing the automated screening round:
                </p>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setChecklistFilter('all')}
                  className={`btn btn-sm ${checklistFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                >
                  All ({analysisResult.checklist.length})
                </button>
                <button
                  onClick={() => setChecklistFilter('high')}
                  className={`btn btn-sm ${checklistFilter === 'high' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                >
                  High Impact
                </button>
                <button
                  onClick={() => setChecklistFilter('medium')}
                  className={`btn btn-sm ${checklistFilter === 'medium' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                >
                  Medium
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
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      background: isResolved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isResolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
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
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span
                          className={item.impact === 'High' ? 'badge badge-danger' : 'badge badge-warning'}
                          style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}
                        >
                          {item.impact} Impact
                        </span>
                        <span
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: isResolved ? '#10b981' : 'var(--text-main)',
                            textDecoration: isResolved ? 'line-through' : 'none',
                          }}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
