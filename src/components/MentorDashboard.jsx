import React, { useState } from 'react';
import {
  School,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  PlusCircle,
  FileSpreadsheet,
  BarChart3,
  Award,
  Sparkles,
  ArrowUpRight,
  Send,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import { USERS_PROFILES } from '../data/mockData';

export const MentorDashboard = ({ userProfile, setActiveTab }) => {
  const [selectedBatch, setSelectedBatch] = useState('2026 CSE Batch A');
  const [searchStudent, setSearchStudent] = useState('');
  const [activeDoubtFilter, setActiveDoubtFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [activeDoubtId, setActiveDoubtId] = useState(null);

  // Mentor Batches Mock Data
  const batchesList = [
    {
      id: 'b1',
      name: '2026 CSE Batch A',
      studentsCount: 140,
      avgReadiness: 85,
      activeTests: 2,
      topSkill: 'Data Structures & Algorithms',
      topCompanyTarget: 'Amazon & Flipkart',
    },
    {
      id: 'b2',
      name: '2026 CSE Batch B',
      studentsCount: 150,
      avgReadiness: 81,
      activeTests: 1,
      topSkill: 'Operating Systems & DBMS',
      topCompanyTarget: 'TCS Digital & Infosys DSE',
    },
    {
      id: 'b3',
      name: '2026 AI-DS Batch',
      studentsCount: 130,
      avgReadiness: 88,
      activeTests: 3,
      topSkill: 'Machine Learning & Python DSA',
      topCompanyTarget: 'Goldman Sachs & Qualcomm',
    },
  ];

  // Doubts / Questions Resolution Queue
  const [doubtsQueue, setDoubtsQueue] = useState([
    {
      id: 'd1',
      studentName: 'Aarav Sharma',
      regNo: '22BCE1042',
      batch: '2026 CSE Batch A',
      topic: 'Dynamic Programming - 0/1 Knapsack Space Optimization',
      question: 'Prof. Sundaram, in the bottom-up DP table for 0/1 Knapsack, why can we iterate backwards when reducing 2D space to 1D array?',
      timeAgo: '15 mins ago',
      status: 'pending',
      companyTarget: 'Amazon SDE-1',
    },
    {
      id: 'd2',
      studentName: 'Priya Patel',
      regNo: '22BIT1015',
      batch: '2026 CSE Batch A',
      topic: 'DBMS Transaction Isolation Levels',
      question: 'What is the exact distinction between Non-Repeatable Read and Phantom Read in SQL Server under Repeatable Read isolation?',
      timeAgo: '1 hour ago',
      status: 'pending',
      companyTarget: 'Google L3',
    },
    {
      id: 'd3',
      studentName: 'Rohan Deshmukh',
      regNo: '22BAD1008',
      batch: '2026 AI-DS Batch',
      topic: 'TCS NQT Time & Distance Shortcuts',
      question: 'Can you verify if the relative speed formula applies directly when two trains cross each other on non-parallel tracks?',
      timeAgo: '3 hours ago',
      status: 'resolved',
      reply: 'No Rohan, relative speed (S1 + S2) applies strictly to parallel opposite tracks. For non-parallel vectors, vector components must be resolved.',
      companyTarget: 'TCS Digital',
    },
  ]);

  // Student Cohort List under selected batch
  const cohortStudents = [
    { name: 'Aarav Sharma', regNo: '22BCE1042', readiness: 84, mcqScore: '92%', codingScore: '88%', status: 'Top Tier' },
    { name: 'Priya Patel', regNo: '22BIT1015', readiness: 96, mcqScore: '98%', codingScore: '94%', status: 'Top Tier' },
    { name: 'Tanmay Saxena', regNo: '22BCE1180', readiness: 94, mcqScore: '95%', codingScore: '92%', status: 'Offer Received' },
    { name: 'Rohan Deshmukh', regNo: '22BAD1008', readiness: 80, mcqScore: '82%', codingScore: '78%', status: 'Progressing' },
    { name: 'Ananya Iyer', regNo: '22BEC1099', readiness: 91, mcqScore: '94%', codingScore: '89%', status: 'Top Tier' },
    { name: 'Kavya Madhavan', regNo: '22BCE1240', readiness: 78, mcqScore: '76%', codingScore: '74%', status: 'Needs Guidance' },
  ];

  const handleSendReply = (doubtId) => {
    if (!replyText.trim()) return;
    setDoubtsQueue(prev =>
      prev.map(d =>
        d.id === doubtId ? { ...d, status: 'resolved', reply: replyText.trim() } : d
      )
    );
    setReplyText('');
    setActiveDoubtId(null);
    alert('Answer published to student discussion board!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mentor Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(192, 132, 252, 0.06) 100%)',
          borderColor: 'rgba(34, 211, 238, 0.3)',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <School size={20} color="var(--secondary)" />
              <span className="badge badge-info">Faculty Mentor & Trainer Portal</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--text-bright)', marginBottom: '0.2rem' }}>
              Welcome back, {userProfile.name}! 👋
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {userProfile.designation || 'Head of Technical Training & Competitive Coding'} • {userProfile.college}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('admin_panel')}
              className="btn btn-primary"
              style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)', color: '#0f172a', fontWeight: 700 }}
            >
              <PlusCircle size={16} /> Create New Assessment
            </button>
            <button
              onClick={() => setActiveTab('mcq_engine')}
              className="btn btn-outline"
            >
              <BookOpen size={16} /> Question Bank Bank
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>
            <School size={22} />
          </div>
          <div>
            <div className="stat-val">3 Batches</div>
            <div className="stat-label">Assigned Cohorts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">420 Students</div>
            <div className="stat-label">Active Under Mentorship</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="stat-val">84.5%</div>
            <div className="stat-label">Batch Placement Readiness</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--text-warning)' }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <div className="stat-val">{doubtsQueue.filter(d => d.status === 'pending').length} Pending</div>
            <div className="stat-label">Student Doubt Queries</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Batches Overview & Doubt Resolution Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '1.5rem' }}>
        {/* Assigned Batches Cards */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <School size={18} color="var(--secondary)" />
              Assigned Cohort Batches
            </h3>
            <span className="badge badge-info">2026 Placement Season</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {batchesList.map((batch) => (
              <div
                key={batch.id}
                onClick={() => setSelectedBatch(batch.name)}
                style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  background: selectedBatch === batch.name ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${selectedBatch === batch.name ? '#22d3ee' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-bright)' }}>{batch.name}</div>
                  <span className="badge badge-success">{batch.studentsCount} Students</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <div>Focus: <strong>{batch.topSkill}</strong></div>
                  <div>Targets: <strong>{batch.topCompanyTarget}</strong></div>
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${batch.avgReadiness}%`, height: '100%', background: 'linear-gradient(90deg, #22d3ee, #818cf8)' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {batch.avgReadiness}% Avg Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doubt & Query Resolution Queue */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <MessageSquare size={18} color="var(--primary)" />
              Student Technical Doubts Queue
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                className={`btn btn-xs ${activeDoubtFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveDoubtFilter('all')}
              >
                All
              </button>
              <button
                className={`btn btn-xs ${activeDoubtFilter === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveDoubtFilter('pending')}
              >
                Pending ({doubtsQueue.filter(d => d.status === 'pending').length})
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {doubtsQueue
              .filter(d => activeDoubtFilter === 'all' || d.status === activeDoubtFilter)
              .map((doubt) => (
                <div
                  key={doubt.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(24, 24, 28, 0.75)',
                    border: `1px solid ${doubt.status === 'pending' ? 'rgba(251, 191, 36, 0.4)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-bright)' }}>{doubt.studentName}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginLeft: '0.5rem' }}>({doubt.regNo}) • {doubt.batch}</span>
                    </div>
                    <span className={`badge ${doubt.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                      {doubt.status === 'pending' ? 'Needs Answer' : 'Answered'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary)', marginBottom: '0.35rem' }}>
                    Topic: {doubt.topic}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.4', margin: '0 0 0.6rem 0' }}>
                    "{doubt.question}"
                  </p>

                  {doubt.status === 'resolved' ? (
                    <div style={{ padding: '0.65rem', background: 'rgba(52, 211, 153, 0.08)', borderLeft: '3px solid var(--success)', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      <strong>Your Answer:</strong> {doubt.reply}
                    </div>
                  ) : (
                    <div>
                      {activeDoubtId === doubt.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <textarea
                            className="textarea"
                            rows={2}
                            placeholder="Write your explanation or code hint..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setActiveDoubtId(null)}>
                              Cancel
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleSendReply(doubt.id)}>
                              <Send size={14} /> Send Answer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontSize: '0.76rem' }}
                          onClick={() => {
                            setActiveDoubtId(doubt.id);
                            setReplyText('');
                          }}
                        >
                          <Send size={13} /> Reply to Student
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Cohort Performance Roster Table */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className="card-title">
            <Users size={18} color="var(--secondary)" />
            {selectedBatch} — Student Performance Roster
          </h3>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
              placeholder="Search student by name..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Reg No</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Readiness Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>MCQ Avg</th>
                <th style={{ padding: '0.75rem 1rem' }}>Coding Pass Rate</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cohortStudents
                .filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()))
                .map((std, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {std.regNo}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      {std.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-success">{std.readiness}%</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {std.mcqScore}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {std.codingScore}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-primary">{std.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => alert(`Assigned targeted DSA booster module to ${std.name}`)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--secondary)', fontSize: '0.76rem' }}
                      >
                        Assign Remedial Test
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
