import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  AlertTriangle,
  Award,
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TrainerDashboard = ({ userProfile, setActiveTab }) => {
  const recentSubmissions = [
    { id: 1, student: 'Aarav Sharma', regNo: '22BCE1042', test: 'TCS NQT Diagnostic Mock 1', score: '90%', status: 'Reviewed', date: 'Today, 14:20' },
    { id: 2, student: 'Priya Patel', regNo: '22BIT1015', test: 'Amazon DSA Trees & Graphs', score: '96%', status: 'Reviewed', date: 'Today, 11:45' },
    { id: 3, student: 'Rohan Deshmukh', regNo: '22BAD1008', test: 'Core CS (OS & DBMS) Booster', score: '72%', status: 'Needs Guidance', date: 'Yesterday' },
    { id: 4, student: 'Ananya Iyer', regNo: '22BEC1099', test: 'Quantitative Speed Math', score: '88%', status: 'Reviewed', date: 'Yesterday' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-success">👨‍🏫 Faculty & Technical Trainer Portal</span>
              <span className="badge badge-primary">{userProfile.college}</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-bright)', marginBottom: '0.35rem' }}>
              Welcome, {userProfile.name}!
            </h1>
            <p style={{ fontSize: '0.92rem', maxWidth: '650px' }}>
              {userProfile.designation} • {userProfile.department}. You are currently supervising{' '}
              <strong style={{ color: '#38bdf8' }}>384 students</strong> across 3 engineering batches.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('trainer_tests')}
              className="btn btn-primary"
            >
              <PlusCircle size={16} /> Create Batch Test
            </button>
            <button
              onClick={() => setActiveTab('trainer_roster')}
              className="btn btn-outline"
            >
              <Users size={16} /> View Student Roster
            </button>
          </div>
        </div>
      </div>

      {/* Key Faculty Stats Grid */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">384</div>
            <div className="stat-label">Students Assigned</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <FileText size={22} />
          </div>
          <div>
            <div className="stat-val">8 Tests</div>
            <div className="stat-label">Active Batch Assessments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="stat-val">79.2%</div>
            <div className="stat-label">Average Batch Readiness</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-val">18 Students</div>
            <div className="stat-label">Need Remedial Focus</div>
          </div>
        </div>
      </div>

      {/* Batches Overview & Weak Concepts */}
      <div className="grid-2">
        {/* Assigned Batches Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="var(--primary)" />
              Assigned Cohort Performance
            </h3>
            <span className="badge badge-info">2026 Cycle</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>2026 CSE Batch A (140 Students)</span>
                <strong style={{ color: '#10b981' }}>84.5% Readiness</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '84.5%', background: 'var(--emerald-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>2026 CSE Batch B (135 Students)</span>
                <strong style={{ color: '#818cf8' }}>78.0% Readiness</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '78%', background: 'var(--accent-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>2026 AI & Data Science (109 Students)</span>
                <strong style={{ color: '#38bdf8' }}>75.2% Readiness</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: '75.2%', background: 'var(--cyan-gradient)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Remediation Notice:</strong> 2026 CSE Batch B scored lower in Dynamic Programming and OS Concurrency. Recommended to assign targeted revision modules before Amazon OA on Oct 22.
            </div>
          </div>
        </div>

        {/* Recent Student Submissions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle2 size={18} color="#10b981" />
              Recent Assessment Submissions
            </h3>
            <button onClick={() => setActiveTab('trainer_roster')} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {sub.student} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({sub.regNo})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {sub.test} • {sub.date}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>{sub.score}</div>
                  <span className={`badge ${sub.status === 'Reviewed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem' }}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
