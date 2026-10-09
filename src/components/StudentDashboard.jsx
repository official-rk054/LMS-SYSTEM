import React from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Code2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Sparkles,
  Building,
  Briefcase,
  AlertCircle,
  FileText,
  Mic,
  BookOpen
} from 'lucide-react';
import { UPCOMING_DRIVES } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export const StudentDashboard = ({ userProfile, setActiveTab, lang }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const breakdown = userProfile.readinessBreakdown || {
    aptitude: 88,
    coding: 82,
    coreCS: 85,
    interviewHR: 78,
    resumeATS: 87,
  };

  const recommendedActions = [
    {
      id: 1,
      title: 'Take TCS NQT Full-Length Mock Test',
      category: 'MCQ Assessment',
      duration: '45 mins',
      impact: '+4 Readiness XP',
      targetTab: 'mcq_engine',
      icon: CheckCircle2,
      badge: 'Urgent: Drive in 16 Days',
      badgeColor: 'badge-warning',
    },
    {
      id: 2,
      title: 'Solve "Subarray with Given Sum" Problem',
      category: 'Coding Arena',
      duration: '20 mins',
      impact: '+5 Coding Points',
      targetTab: 'coding_arena',
      icon: Code2,
      badge: 'Infosys & TCS Classic',
      badgeColor: 'badge-primary',
    },
    {
      id: 3,
      title: 'Simulate Amazon Bar Raiser Mock Interview',
      category: 'AI Interviewer',
      duration: '25 mins',
      impact: '+8 Interview Index',
      targetTab: 'mock_interview',
      icon: Mic,
      badge: 'Tier 1 Product',
      badgeColor: 'badge-info',
    },
    {
      id: 4,
      title: 'Analyze Resume against SDE-1 Job Description',
      category: 'Resume Analyzer',
      duration: '10 mins',
      impact: 'ATS Score 87% -> 95%',
      targetTab: 'resume_analyzer',
      icon: FileText,
      badge: 'High Impact',
      badgeColor: 'badge-success',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">
                🎓 2026 Graduating Batch
              </span>
              <span className="badge badge-success">
                Active Placement Cycle
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
              {userProfile.degree} at <strong>{userProfile.college}</strong>. Your placement readiness index is currently at{' '}
              <strong style={{ color: '#10b981' }}>{userProfile.placementReadinessScore}%</strong>. Amazon and TCS campus drives start this month!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('mcq_engine')}
              className="btn btn-primary"
            >
              <CheckCircle2 size={16} /> Take Diagnostic Test
            </button>
            <button
              onClick={() => setActiveTab('mock_interview')}
              className="btn btn-outline"
            >
              <Mic size={16} /> Start AI Interview
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-val">{userProfile.placementReadinessScore}%</div>
            <div className="stat-label">{t.readinessScore}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-val">{userProfile.streakDays} Days</div>
            <div className="stat-label">Daily Practice Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-val">#{userProfile.batchRank} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>of {userProfile.totalBatchStudents}</span></div>
            <div className="stat-label">Batch College Ranking</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-val">{userProfile.xpPoints}</div>
            <div className="stat-label">Karma XP Points</div>
          </div>
        </div>
      </div>

      {/* Readiness Breakdown & Competency Radar Grid */}
      <div className="grid-2">
        {/* Placement Readiness Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Target size={20} color="var(--primary)" />
              Placement Readiness Index Breakdown
            </h3>
            <span className="badge badge-success">84/100 Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Quantitative & Logical Aptitude</span>
                <strong style={{ color: '#38bdf8' }}>{breakdown.aptitude}%</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${breakdown.aptitude}%`, background: 'var(--cyan-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Coding & Problem Solving (DSA)</span>
                <strong style={{ color: '#818cf8' }}>{breakdown.coding}%</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${breakdown.coding}%`, background: 'var(--accent-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>Core Computer Science (OS / DBMS / Networks)</span>
                <strong style={{ color: '#34d399' }}>{breakdown.coreCS}%</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${breakdown.coreCS}%`, background: 'var(--emerald-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>AI Mock Interview & Communication (HR/Tech)</span>
                <strong style={{ color: '#fbbf24' }}>{breakdown.interviewHR}%</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${breakdown.interviewHR}%`, background: 'var(--gold-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600 }}>ATS Resume Score & Impact Metrics</span>
                <strong style={{ color: '#ec4899' }}>{breakdown.resumeATS}%</strong>
              </div>
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${breakdown.resumeATS}%`, background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} color="var(--warning)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Detected Weak Spots: <strong>Dynamic Programming</strong>, <strong>OS Deadlocks</strong>.
            </span>
            <button
              onClick={() => setActiveTab('extra_suite')}
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 'auto', color: 'var(--primary)', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
            >
              View 30-Day Plan →
            </button>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={20} color="#a855f7" />
              AI Recommended Next Actions
            </h3>
            <span className="badge badge-primary">Personalized</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recommendedActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={action.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ActionIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {action.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span className={`badge ${action.badgeColor}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                          {action.badge}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          ⏱️ {action.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab(action.targetTab)}
                    className="btn btn-outline btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Start <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Campus Placement Drives */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Building size={20} color="var(--primary)" />
              {t.upcomingDrives}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Campus on-boarding for 2026 pass-outs. Check eligibility and round roadmaps.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('job_board')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)' }}
          >
            {t.viewAll} (5 Drives) →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {UPCOMING_DRIVES.slice(0, 3).map((drive) => (
            <div
              key={drive.id}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{drive.logo}</span>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>{drive.company}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{drive.tier}</span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}
                  >
                    {drive.packageCTC}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {drive.role}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>📍 {drive.location}</span>
                  <span>•</span>
                  <span>Min CGPA: <strong>{drive.minCGPA}</strong></span>
                  <span>•</span>
                  <span>📅 {drive.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span className={`badge ${drive.applied ? 'badge-success' : 'badge-primary'}`}>
                  {drive.applied ? `Status: ${drive.applicationStage}` : 'Eligible to Apply'}
                </span>

                <button
                  onClick={() => setActiveTab('company_prep')}
                  className="btn btn-outline btn-sm"
                >
                  View Rounds Prep →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
