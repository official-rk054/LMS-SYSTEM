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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Welcome Hero Banner — Premium Spacious Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(34, 211, 238, 0.1) 50%, rgba(192, 132, 252, 0.08) 100%)',
          borderColor: 'rgba(129, 140, 248, 0.3)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '1.25rem 1.75rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '0.15rem 0.6rem' }}>
                🎓 2026 Graduating Batch
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '0.15rem 0.6rem' }}>
                Active Placement Cycle
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--text-bright)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p style={{ maxWidth: '720px', fontSize: '0.88rem', margin: '0.25rem 0 0', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {userProfile.degree} at <strong>{userProfile.college}</strong>. Placement readiness is currently at{' '}
              <strong style={{ color: '#34d399' }}>{userProfile.placementReadinessScore}%</strong>. Amazon and TCS campus drives start this month!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('mcq_engine')}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <CheckCircle2 size={16} /> Take Diagnostic Test
            </button>
            <button
              onClick={() => setActiveTab('mock_interview')}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <Mic size={16} /> Start AI Interview
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights — 4 Premium Stat Cards */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        <div className="stat-card" style={{ padding: '0.9rem 1.15rem', gap: '1rem' }}>
          <div className="stat-icon" style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', background: 'rgba(52, 211, 153, 0.12)', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userProfile.placementReadinessScore}%</div>
            <div className="stat-label" style={{ fontSize: '0.78rem' }}>{t.readinessScore}</div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.15rem', gap: '1rem' }}>
          <div className="stat-icon" style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' }}>
            <Flame size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userProfile.streakDays} Days</div>
            <div className="stat-label" style={{ fontSize: '0.78rem' }}>Daily Practice Streak</div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.15rem', gap: '1rem' }}>
          <div className="stat-icon" style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', background: 'rgba(129, 140, 248, 0.12)', color: '#818cf8' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.5rem', fontWeight: 800 }}>#{userProfile.batchRank} <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ {userProfile.totalBatchStudents}</span></div>
            <div className="stat-label" style={{ fontSize: '0.78rem' }}>Batch College Ranking</div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.15rem', gap: '1rem' }}>
          <div className="stat-icon" style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', background: 'rgba(192, 132, 252, 0.12)', color: '#c084fc' }}>
            <Zap size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{userProfile.xpPoints}</div>
            <div className="stat-label" style={{ fontSize: '0.78rem' }}>Karma XP Points</div>
          </div>
        </div>
      </div>

      {/* Readiness Breakdown & AI Recommended Next Actions Grid */}
      <div className="grid-2" style={{ gap: '1rem' }}>
        {/* Placement Readiness Breakdown */}
        <div className="card" style={{ padding: '1.15rem 1.35rem' }}>
          <div className="card-header" style={{ marginBottom: '0.85rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
              <Target size={18} color="var(--primary)" />
              Placement Readiness Index Breakdown
            </h3>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem' }}>84/100 Total</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Quantitative & Logical Aptitude</span>
                <strong style={{ color: '#38bdf8' }}>{breakdown.aptitude}%</strong>
              </div>
              <div className="progress-container" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${breakdown.aptitude}%`, background: 'var(--cyan-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Coding & Problem Solving (DSA)</span>
                <strong style={{ color: '#818cf8' }}>{breakdown.coding}%</strong>
              </div>
              <div className="progress-container" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${breakdown.coding}%`, background: 'var(--accent-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>Core CS (OS / DBMS / Networks)</span>
                <strong style={{ color: '#34d399' }}>{breakdown.coreCS}%</strong>
              </div>
              <div className="progress-container" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${breakdown.coreCS}%`, background: 'var(--emerald-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>AI Mock Interview & Communication (HR/Tech)</span>
                <strong style={{ color: '#fbbf24' }}>{breakdown.interviewHR}%</strong>
              </div>
              <div className="progress-container" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${breakdown.interviewHR}%`, background: 'var(--gold-gradient)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-bright)' }}>ATS Resume Score & Impact Metrics</span>
                <strong style={{ color: '#f472b6' }}>{breakdown.resumeATS}%</strong>
              </div>
              <div className="progress-container" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${breakdown.resumeATS}%`, background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', padding: '0.55rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid var(--border-subtle)' }}>
            <AlertCircle size={16} color="var(--warning)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Detected Weak Spots: <strong>Dynamic Programming</strong>, <strong>OS Deadlocks</strong>.
            </span>
            <button
              onClick={() => setActiveTab('learning_modules')}
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 'auto', color: 'var(--primary)', padding: '0.2rem 0.5rem', fontSize: '0.78rem', fontWeight: 600 }}
            >
              View 30-Day Plan →
            </button>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="card" style={{ padding: '1.15rem 1.35rem' }}>
          <div className="card-header" style={{ marginBottom: '0.85rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
              <Sparkles size={18} color="#a855f7" />
              AI Recommended Next Actions
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem' }}>Personalized</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recommendedActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={action.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ActionIcon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1.3 }}>
                        {action.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span className={`badge ${action.badgeColor}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
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
                    style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
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
      <div className="card" style={{ padding: '1.15rem 1.35rem' }}>
        <div className="card-header" style={{ marginBottom: '0.75rem' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>
              <Building size={18} color="var(--primary)" />
              {t.upcomingDrives}
            </h3>
            <p style={{ fontSize: '0.8rem', marginTop: '0.15rem', color: 'var(--text-dim)', margin: 0 }}>
              Campus on-boarding for 2026 pass-outs. Check eligibility and round roadmaps.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('job_board')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}
          >
            {t.viewAll} (5 Drives) →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {UPCOMING_DRIVES.slice(0, 3).map((drive) => (
            <div
              key={drive.id}
              style={{
                padding: '0.9rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.65rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{drive.logo}</span>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-bright)', margin: 0, fontWeight: 700 }}>{drive.company}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{drive.tier}</span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      padding: '0.15rem 0.5rem',
                    }}
                  >
                    {drive.packageCTC}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {drive.role}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>📍 {drive.location}</span>
                  <span>•</span>
                  <span>CGPA: <strong>{drive.minCGPA}</strong></span>
                  <span>•</span>
                  <span>📅 {drive.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.55rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span className={`badge ${drive.applied ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  {drive.applied ? `Status: ${drive.applicationStage}` : 'Eligible to Apply'}
                </span>

                <button
                  onClick={() => setActiveTab('company_prep')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  Rounds Prep →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
