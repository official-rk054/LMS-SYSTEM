import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building,
  PlusCircle,
  Upload,
  Download,
  Filter,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { USERS_PROFILES } from '../data/mockData';

export const AdminPanel = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster', 'create_test', 'reports'
  const [searchQuery, setSearchQuery] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('7.5');
  const [minReadinessFilter, setMinReadinessFilter] = useState('80');

  // Test Creation Form State
  const [newTest, setNewTest] = useState({
    title: 'TCS NQT Pre-Assessment Mock 2',
    category: 'Quantitative Aptitude',
    batch: '2026 CSE Batch A',
    duration: 30,
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
  });

  const [createdTestsList, setCreatedTestsList] = useState([
    { id: 1, title: 'Amazon SDE-1 Coding Screening 2026', batch: '2026 CSE & IT', questionsCount: 15, duration: '45 mins' },
    { id: 2, title: 'Infosys DSE Core CS Foundations', batch: 'All Engineering', questionsCount: 20, duration: '30 mins' },
  ]);

  const studentsList = [
    { id: '1', name: 'Aarav Sharma', regNo: '22BCE1042', branch: 'CSE', cgpa: 8.85, readiness: 84, status: 'Amazon OA Shortlisted', phone: '+91 98765 43210' },
    { id: '2', name: 'Priya Patel', regNo: '22BIT1015', branch: 'IT', cgpa: 9.15, readiness: 96, status: 'Google L3 Interview', phone: '+91 98765 43211' },
    { id: '3', name: 'Tanmay Saxena', regNo: '22BCE1180', branch: 'CSE', cgpa: 8.92, readiness: 94, status: 'Flipkart Offer Received', phone: '+91 98765 43212' },
    { id: '4', name: 'Rohan Deshmukh', regNo: '22BAD1008', branch: 'AI-DS', cgpa: 7.95, readiness: 80, status: 'TCS Digital Shortlisted', phone: '+91 98765 43213' },
    { id: '5', name: 'Ananya Iyer', regNo: '22BEC1099', branch: 'ECE', cgpa: 8.60, readiness: 91, status: 'Qualcomm Hardware OA', phone: '+91 98765 43214' },
    { id: '6', name: 'Kavya Madhavan', regNo: '22BCE1240', branch: 'CSE', cgpa: 7.40, readiness: 78, status: 'Eligible for Mass Drives', phone: '+91 98765 43215' },
    { id: '7', name: 'Nikhil Verma', regNo: '22BCE1312', branch: 'CSE', cgpa: 7.20, readiness: 76, status: 'Needs Aptitude Booster', phone: '+91 98765 43216' },
  ];

  // Shortlisting Filter
  const filteredStudents = studentsList.filter((std) => {
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) || std.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCgpa = std.cgpa >= parseFloat(minCgpaFilter || '0');
    const matchesReadiness = std.readiness >= parseInt(minReadinessFilter || '0', 10);
    return matchesSearch && matchesCgpa && matchesReadiness;
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = 'Registration No,Name,Branch,CGPA,Readiness Score,Placement Status,Phone\n';
    const rows = filteredStudents.map(s => `${s.regNo},"${s.name}",${s.branch},${s.cgpa},${s.readiness}%,"${s.status}",${s.phone}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlaceIQ_Placement_Shortlist_2026.csv`;
    a.click();
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newTest.questionText.trim()) return;

    setCreatedTestsList(prev => [
      ...prev,
      {
        id: prev.length + 1,
        title: newTest.title,
        batch: newTest.batch,
        questionsCount: 1,
        duration: `${newTest.duration} mins`,
      },
    ]);

    alert(`Successfully published test "${newTest.title}" to ${newTest.batch}!`);
    setNewTest({ ...newTest, questionText: '', optionA: '', optionB: '', optionC: '', optionD: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top TPO Metrics Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span className="badge badge-primary">
                {userRole === 'admin' ? 'TPO Office Command Portal' : 'Faculty Trainer Suite'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--text-bright)', marginBottom: '0.2rem' }}>
              Campus Placement Operations & Cohort Analytics
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Vellore Institute of Technology • Batch 2026 Engineering Recruitment Cycle
            </p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-primary">
            <Download size={15} /> Export Placement Roster (CSV)
          </button>
        </div>
      </div>

      {/* College-wide Stats Grid */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">1,850</div>
            <div className="stat-label">Registered Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">1,320 (71.4%)</div>
            <div className="stat-label">Placed Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Building size={22} />
          </div>
          <div>
            <div className="stat-val">74 Companies</div>
            <div className="stat-label">Visited Campus</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className="stat-val">44.5 LPA</div>
            <div className="stat-label">Highest CTC (Amazon)</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          <Users size={15} /> Student Cohort Roster & Shortlisting
        </button>
        <button
          className={`tab-btn ${activeTab === 'create_test' ? 'active' : ''}`}
          onClick={() => setActiveTab('create_test')}
        >
          <PlusCircle size={15} /> Test Creator & Bulk Upload
        </button>
      </div>

      {/* Tab 1: Student Roster & Shortlisting Filter */}
      {activeTab === 'roster' && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="card-title">
              <Filter size={18} color="var(--primary)" />
              Candidate Shortlisting Engine
            </h3>

            {/* Filter Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                placeholder="Search by student name or Reg No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <span>Min CGPA:</span>
                <select
                  className="select"
                  style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  value={minCgpaFilter}
                  onChange={(e) => setMinCgpaFilter(e.target.value)}
                >
                  <option value="6.0">6.0+</option>
                  <option value="7.0">7.0+</option>
                  <option value="7.5">7.5+ (Amazon/GS)</option>
                  <option value="8.0">8.0+ (Flipkart/Tier 1)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <span>Min Readiness:</span>
                <select
                  className="select"
                  style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  value={minReadinessFilter}
                  onChange={(e) => setMinReadinessFilter(e.target.value)}
                >
                  <option value="50">50%+</option>
                  <option value="70">70%+</option>
                  <option value="80">80%+ (High Readiness)</option>
                  <option value="90">90%+ (Top Tier)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Reg Number</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Candidate Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Branch</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CGPA</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Readiness Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Placement Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std) => (
                  <tr key={std.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {std.regNo}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      {std.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {std.branch}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {std.cgpa}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-success">{std.readiness}%</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-primary">{std.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => alert(`Sent targeted mock interview recommendation to ${std.name}`)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--primary)', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <span>Showing {filteredStudents.length} candidate(s) meeting criteria</span>
            <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
              <FileSpreadsheet size={14} /> Download Shortlist CSV
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Test Creator & Bulk Upload */}
      {activeTab === 'create_test' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Create Question Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <PlusCircle size={18} color="var(--primary)" />
                Create New Assessment / Question
              </h3>
            </div>

            <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Test Title</label>
                  <input
                    type="text"
                    className="input"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Target Batch</label>
                  <select
                    className="select"
                    value={newTest.batch}
                    onChange={(e) => setNewTest({ ...newTest, batch: e.target.value })}
                  >
                    <option value="2026 CSE Batch A">2026 CSE Batch A</option>
                    <option value="2026 CSE Batch B">2026 CSE Batch B</option>
                    <option value="2026 AI-DS Batch">2026 AI-DS Batch</option>
                    <option value="All Engineering Batches">All Engineering Batches</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Question Statement</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Enter question text..."
                  value={newTest.questionText}
                  onChange={(e) => setNewTest({ ...newTest, questionText: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Option A"
                  value={newTest.optionA}
                  onChange={(e) => setNewTest({ ...newTest, optionA: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Option B"
                  value={newTest.optionB}
                  onChange={(e) => setNewTest({ ...newTest, optionB: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Option C"
                  value={newTest.optionC}
                  onChange={(e) => setNewTest({ ...newTest, optionC: e.target.value })}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Option D"
                  value={newTest.optionD}
                  onChange={(e) => setNewTest({ ...newTest, optionD: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span>Correct Option:</span>
                  <select
                    className="select"
                    style={{ width: 'auto', padding: '0.3rem 0.6rem' }}
                    value={newTest.correctOption}
                    onChange={(e) => setNewTest({ ...newTest, correctOption: e.target.value })}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  Publish to Batch
                </button>
              </div>
            </form>
          </div>

          {/* Bulk Upload & Active Assessments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Upload size={18} color="var(--secondary)" />
                  Bulk Question Importer (JSON / CSV)
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                Upload question banks with format: <code>question, optionA, optionB, optionC, optionD, answer</code>.
              </p>

              <div
                style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)',
                  cursor: 'pointer',
                }}
                onClick={() => alert('Bulk JSON/CSV Question Bank parsed! 50 Questions successfully queued.')}
              >
                <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to Upload Question Bank</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Supported: .CSV, .JSON, .XLSX</div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Layers size={18} color="var(--primary)" />
                  Active Assigned Tests
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {createdTestsList.map(t => (
                  <div key={t.id} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{t.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Assigned to: {t.batch} • {t.duration}</div>
                    </div>
                    <span className="badge badge-success">Live</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
