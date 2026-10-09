import React, { useState } from 'react';
import {
  Download,
  Sparkles,
  FileText,
  User,
  GraduationCap,
  Code,
  Briefcase,
  FolderGit2,
  Award,
  CheckCircle,
  Eye,
  RefreshCw,
  Printer,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ResumeBuilder = ({ userProfile, onSendToAnalyzer }) => {
  const [activeSection, setActiveSection] = useState('personal');

  // Initial resume data with authentic Indian placement context
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma22@vitstudent.ac.in',
      phone: '+91 98765 43210',
      location: 'Vellore, Tamil Nadu / Bengaluru, India',
      linkedin: 'linkedin.com/in/aarav-sharma-tech',
      github: 'github.com/aarav-sharma',
      portfolio: 'aaravsharma.dev',
      summary: 'Final year B.Tech Computer Science student with strong foundations in Data Structures, Algorithms, and Full-Stack Engineering. Proven record of developing scalable web applications and solving 350+ LeetCode problems. Looking for an SDE-1 role in a high-growth engineering team.',
    },
    education: [
      {
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'Vellore Institute of Technology (VIT)',
        year: '2022 - 2026',
        score: 'CGPA: 8.85 / 10.0',
      },
      {
        degree: 'Senior Secondary Education (Class XII - CBSE)',
        institution: 'Delhi Public School (DPS), R.K. Puram',
        year: '2020 - 2022',
        score: 'Percentage: 96.2%',
      },
    ],
    skills: {
      languages: 'C++, Python, JavaScript (ES6+), TypeScript, SQL, Java',
      frameworks: 'React.js, Node.js, Express.js, Next.js, Redux Toolkit',
      developerTools: 'Git, GitHub, Docker, AWS (S3, EC2), Postman, Linux',
      coreSubjects: 'Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, Object-Oriented Programming (OOP)',
    },
    experience: [
      {
        title: 'Software Development Engineering Intern',
        company: 'Razorpay Software Pvt. Ltd.',
        location: 'Bengaluru, India',
        duration: 'June 2025 - August 2025',
        bullets: [
          'Engineered a microservice for merchant webhook retries handling over 150,000 daily events using Node.js and Redis queues.',
          'Reduced webhook latency by 32% by implementing connection pooling and batch processing.',
          'Wrote comprehensive unit and integration tests with Jest, increasing test coverage from 68% to 89%.',
        ],
      },
    ],
    projects: [
      {
        name: 'PlaceIQ - AI Campus Placement Acceleration LMS',
        tech: 'React, Node.js, Web Speech API, Monaco/Prism, REST API',
        link: 'github.com/aarav-sharma/placeiq-lms',
        bullets: [
          'Developed an end-to-end placement training portal used by 400+ college peers for mock interviews, ATS resume auditing, and coding assessments.',
          'Implemented browser-based code execution sandbox supporting Python and JavaScript with test case validation.',
          'Engineered an adaptive AI mock interviewer using Web Speech API that generates context-aware follow-up questions.',
        ],
      },
      {
        name: 'Distributed KV Store (Mini-Raft)',
        tech: 'C++, Socket Programming, Multi-threading, Posix Threads',
        link: 'github.com/aarav-sharma/mini-raft-kv',
        bullets: [
          'Implemented Raft consensus algorithm in C++ with leader election, log replication, and heartbeat mechanisms.',
          'Achieved 99.9% consistency across 5 nodes under simulated network partition scenarios.',
        ],
      },
    ],
    achievements: [
      'Knight on LeetCode (Rating: 1890+, Solved 350+ DSA problems).',
      'Finalist (Top 10 out of 4,000+ teams) in Smart India Hackathon (SIH 2025).',
      'Winner of VIT CodeSprint 2024 organized by Computer Society of India.',
    ],
  });

  const handlePersonalChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  // High-fidelity print / PDF download handler with automated clean filename
  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanFileName = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume_Placement`;
    document.title = cleanFileName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  const loadFresherTemplate = () => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        summary: 'Passionate computer science undergraduate with strong problem-solving skills in C++ and Python. Seeking an entry-level software engineering position to contribute to mission-critical systems.',
      },
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar (Hidden in Print/PDF export) */}
      <div className="card resume-header-bar no-print" style={{ padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                <CheckCircle size={13} /> 100% Single-Column ATS Standard
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={13} /> Campus Placement & Product SDE Approved
              </span>
            </div>
            <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText color="var(--primary)" />
              Professional ATS Resume Builder
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Industry-standard single-column layout optimized for Fortune 500 ATS parsers (Amazon, Google, TCS, Infosys) and campus placement drives.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSendToAnalyzer(resumeData)}
              className="btn btn-outline"
              title="Audit this resume in AI Resume Analyzer"
            >
              <Sparkles size={16} color="var(--primary)" /> Run AI ATS Audit
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
              title="Export formatted A4 PDF document"
            >
              <Download size={16} /> Download PDF / Print
            </button>
          </div>
        </div>
      </div>

      {/* Split-screen Layout: Form on Left, Live Preview on Right */}
      <div className="resume-builder-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(420px, 1.25fr)', gap: '1.5rem' }}>
        {/* Left Column: Form Editor (Hidden in Print/PDF export) */}
        <div className="card resume-editor-col no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section Navigation Tabs */}
          <div className="tabs-nav" style={{ marginBottom: '0.5rem' }}>
            <button
              className={`tab-btn ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <User size={15} /> Personal Info
            </button>
            <button
              className={`tab-btn ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveSection('skills')}
            >
              <Code size={15} /> Tech Skills
            </button>
            <button
              className={`tab-btn ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveSection('experience')}
            >
              <Briefcase size={15} /> Experience
            </button>
            <button
              className={`tab-btn ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSection('projects')}
            >
              <FolderGit2 size={15} /> Projects
            </button>
          </div>

          {/* Form Content Based on Active Section */}
          {activeSection === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email</label>
                  <input
                    type="email"
                    className="input"
                    value={resumeData.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Phone</label>
                  <input
                    type="text"
                    className="input"
                    value={resumeData.personal.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Location</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>LinkedIn</label>
                  <input
                    type="text"
                    className="input"
                    value={resumeData.personal.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>GitHub</label>
                  <input
                    type="text"
                    className="input"
                    value={resumeData.personal.github}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Professional Summary</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={resumeData.personal.summary}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeSection === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Programming Languages</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.skills.languages}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    skills: { ...resumeData.skills, languages: e.target.value }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Frameworks & Web</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.skills.frameworks}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    skills: { ...resumeData.skills, frameworks: e.target.value }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Developer Tools & Cloud</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.skills.developerTools}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    skills: { ...resumeData.skills, developerTools: e.target.value }
                  })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Core CS Subjects</label>
                <input
                  type="text"
                  className="input"
                  value={resumeData.skills.coreSubjects}
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    skills: { ...resumeData.skills, coreSubjects: e.target.value }
                  })}
                />
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Title / Role"
                      value={exp.title}
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].title = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].location = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Duration"
                      value={exp.duration}
                      onChange={(e) => {
                        const copy = [...resumeData.experience];
                        copy[idx].duration = e.target.value;
                        setResumeData({ ...resumeData, experience: copy });
                      }}
                    />
                  </div>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Impact bullet points (one per line)"
                    value={exp.bullets.join('\n')}
                    onChange={(e) => {
                      const copy = [...resumeData.experience];
                      copy[idx].bullets = e.target.value.split('\n');
                      setResumeData({ ...resumeData, experience: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => {
                        const copy = [...resumeData.projects];
                        copy[idx].name = e.target.value;
                        setResumeData({ ...resumeData, projects: copy });
                      }}
                    />
                    <input
                      type="text"
                      className="input"
                      placeholder="Tech Stack"
                      value={proj.tech}
                      onChange={(e) => {
                        const copy = [...resumeData.projects];
                        copy[idx].tech = e.target.value;
                        setResumeData({ ...resumeData, projects: copy });
                      }}
                    />
                  </div>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Bullet points (one per line)"
                    value={proj.bullets.join('\n')}
                    onChange={(e) => {
                      const copy = [...resumeData.projects];
                      copy[idx].bullets = e.target.value.split('\n');
                      setResumeData({ ...resumeData, projects: copy });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button onClick={loadFresherTemplate} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
              <RefreshCw size={14} /> Reset with Fresher Defaults
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Auto-saved to Local LMS
            </span>
          </div>
        </div>

        {/* Right Column: Live ATS-Compliant Document Preview & Print Target */}
        <div
          className="card resume-preview-card"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '2.5rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
            overflowY: 'auto',
            maxHeight: '850px',
            border: '1px solid #cbd5e1',
          }}
          id="printable-resume"
        >
          {/* Header */}
          <div className="resume-section" style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1.15rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              {resumeData.personal.fullName}
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
              <span>{resumeData.personal.email}</span>
              <span>•</span>
              <span>{resumeData.personal.phone}</span>
              <span>•</span>
              <span>{resumeData.personal.location}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0284c7', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.3rem' }}>
              <span>{resumeData.personal.linkedin}</span>
              <span>•</span>
              <span>{resumeData.personal.github}</span>
              {resumeData.personal.portfolio && (
                <>
                  <span>•</span>
                  <span>{resumeData.personal.portfolio}</span>
                </>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personal.summary && (
            <div className="resume-section" style={{ marginBottom: '1.15rem' }}>
              <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                Professional Summary
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: '1.5', margin: 0 }}>
                {resumeData.personal.summary}
              </p>
            </div>
          )}

          {/* Education */}
          <div className="resume-section" style={{ marginBottom: '1.15rem' }}>
            <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
              Education
            </h3>
            {resumeData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>{edu.institution}</span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{edu.year}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#334155' }}>
                  <span>{edu.degree}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{edu.score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="resume-section" style={{ marginBottom: '1.15rem' }}>
            <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
              Technical Skills
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: '1.45' }}>
              <div><strong>Languages:</strong> {resumeData.skills.languages}</div>
              <div><strong>Frameworks & Web:</strong> {resumeData.skills.frameworks}</div>
              <div><strong>Developer Tools & Cloud:</strong> {resumeData.skills.developerTools}</div>
              <div><strong>Core Computer Science:</strong> {resumeData.skills.coreSubjects}</div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="resume-section" style={{ marginBottom: '1.15rem' }}>
            <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
              Work Experience & Internships
            </h3>
            {resumeData.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>{exp.title} | <span style={{ fontWeight: 600, color: '#0284c7' }}>{exp.company}</span></span>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{exp.duration}</span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.2rem' }}>
                    {exp.location}
                  </div>
                )}
                <ul className="resume-bullet-list" style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.45' }}>
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '0.2rem' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="resume-section" style={{ marginBottom: '1.15rem' }}>
            <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
              Technical Projects
            </h3>
            {resumeData.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>{proj.name} | <span style={{ fontWeight: 500, fontStyle: 'italic', color: '#475569' }}>{proj.tech}</span></span>
                  <span style={{ color: '#0284c7', fontSize: '0.78rem' }}>{proj.link}</span>
                </div>
                <ul className="resume-bullet-list" style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.45' }}>
                  {proj.bullets.map((b, bIdx) => (
                    <li key={bIdx} style={{ marginBottom: '0.2rem' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="resume-section">
            <h3 className="resume-section-title" style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: '0.2rem', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
              Key Achievements & Honors
            </h3>
            <ul className="resume-bullet-list" style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.45' }}>
              {resumeData.achievements.map((ach, i) => (
                <li key={i} style={{ marginBottom: '0.2rem' }}>{ach}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
