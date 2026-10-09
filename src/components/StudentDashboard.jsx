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
    <div
      className="dashboard-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
      }}
    >
      {/* ============================================================== */}
      {/* 1. COMPACT EXECUTIVE COMMAND BAR & METRIC RIBBON              */}
      {/* ============================================================== */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          {/* Left: User Greet & Academic Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                  Welcome back, {userProfile.name}! 👋
                </h2>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  🎓 2026 Batch
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  Active Drives
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                {userProfile.degree} at <strong>{userProfile.college}</strong> • Readiness:{' '}
                <strong style={{ color: '#10b981' }}>{userProfile.placementReadinessScore}%</strong>. Amazon & TCS campus drives start this month!
              </p>
            </div>
          </div>

          {/* Center: 4 Compact Stat Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Readiness */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Overall Placement Readiness Index"
            >
              <Award size={16} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                  {userProfile.placementReadinessScore}%
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {t.readinessScore}
                </div>
              </div>
            </div>

            {/* Streak */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Consecutive Day Practice Streak"
            >
              <Flame size={16} color="#f59e0b" fill="#f59e0b" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                  {userProfile.streakDays} Days
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Daily Streak
                </div>
              </div>
            </div>

            {/* Rank */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Official Campus Cohort Rank"
            >
              <TrendingUp size={16} color="#6366f1" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>
                  #{userProfile.batchRank} <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-dim)' }}>/{userProfile.totalBatchStudents}</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Batch Rank
                </div>
              </div>
            </div>

            {/* Karma XP */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Preparation Karma XP Points"
            >
              <Zap size={16} color="#a855f7" fill="#a855f7" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#c084fc', lineHeight: 1 }}>
                  {userProfile.xpPoints}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Karma XP
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Launch CTAs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('mcq_engine')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', fontWeight: 700 }}
            >
              <CheckCircle2 size={14} /> Diagnostic Test
            </button>
            <button
              onClick={() => setActiveTab('mock_interview')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              <Mic size={14} /> AI Interview
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN ERGONOMIC 3-COLUMN BENTO GRID                         */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.15fr 1.2fr',
          gap: '0.85rem',
          alignItems: 'stretch',
        }}
      >
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: PLACEMENT READINESS BREAKDOWN                      */}
        {/* ------------------------------------------------------------ */}
        <div
          className="card"
          style={{
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <h3 className="card-title" style={{ fontSize: '0.98rem' }}>
                <Target size={17} color="var(--primary)" />
                Readiness Index Breakdown
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                84/100 Total
              </span>
            </div>

            {/* 5 Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Quantitative & Logical Aptitude</span>
                  <strong style={{ color: '#38bdf8' }}>{breakdown.aptitude}%</strong>
                </div>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${breakdown.aptitude}%`, background: 'var(--cyan-gradient)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Coding & Problem Solving (DSA)</span>
                  <strong style={{ color: '#818cf8' }}>{breakdown.coding}%</strong>
                </div>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${breakdown.coding}%`, background: 'var(--accent-gradient)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Core CS (OS / DBMS / Networks)</span>
                  <strong style={{ color: '#34d399' }}>{breakdown.coreCS}%</strong>
                </div>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${breakdown.coreCS}%`, background: 'var(--emerald-gradient)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>AI Mock Interview & Communication</span>
                  <strong style={{ color: '#fbbf24' }}>{breakdown.interviewHR}%</strong>
                </div>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${breakdown.interviewHR}%`, background: 'var(--gold-gradient)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>ATS Resume Score & Impact</span>
                  <strong style={{ color: '#ec4899' }}>{breakdown.resumeATS}%</strong>
                </div>
                <div className="progress-container" style={{ height: '6px' }}>
                  <div className="progress-fill" style={{ width: `${breakdown.resumeATS}%`, background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detected Weak Spots Box */}
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.55rem 0.75rem',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={15} color="var(--warning)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.25, flex: 1 }}>
              Weak Spots: <strong style={{ color: 'var(--text-main)' }}>DP, OS Deadlocks</strong>
            </div>
            <button
              onClick={() => setActiveTab('extra_suite')}
              className="btn btn-ghost btn-sm"
              style={{
                color: 'var(--primary)',
                padding: '0.15rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              30-Day Plan →
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: AI RECOMMENDED NEXT ACTIONS                        */}
        {/* ------------------------------------------------------------ */}
        <div
          className="card"
          style={{
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="card-header" style={{ marginBottom: '0.65rem' }}>
            <h3 className="card-title" style={{ fontSize: '0.98rem' }}>
              <Sparkles size={17} color="#a855f7" />
              AI Recommended Next Actions
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              Personalized
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {recommendedActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={action.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
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
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '190px',
                        }}
                        title={action.title}
                      >
                        {action.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${action.badgeColor}`} style={{ fontSize: '0.65rem', padding: '0.08rem 0.35rem' }}>
                          {action.badge}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                          ⏱️ {action.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab(action.targetTab)}
                    className="btn btn-outline btn-sm"
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '0.72rem',
                      padding: '0.25rem 0.55rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Start <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3: UPCOMING CAMPUS PLACEMENT DRIVES                   */}
        {/* ------------------------------------------------------------ */}
        <div
          className="card"
          style={{
            padding: '1rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="card-header" style={{ marginBottom: '0.65rem' }}>
            <div>
              <h3 className="card-title" style={{ fontSize: '0.98rem', marginBottom: '0.1rem' }}>
                <Building size={17} color="var(--primary)" />
                {t.upcomingDrives}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
                2026 Batch on-boarding roadmaps
              </p>
            </div>
            <button
              onClick={() => setActiveTab('job_board')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontSize: '0.72rem', padding: '0.2rem 0.45rem' }}
            >
              View All (5) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {UPCOMING_DRIVES.slice(0, 3).map((drive) => (
              <div
                key={drive.id}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                {/* Company Name & CTC Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{drive.logo}</span>
                    <div>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.1 }}>
                        {drive.company}
                      </h4>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{drive.tier}</span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.76rem',
                      padding: '0.15rem 0.45rem',
                    }}
                  >
                    {drive.packageCTC}
                  </span>
                </div>

                {/* Role & Requirements Metadata */}
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  {drive.role}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>📍 {drive.location}</span>
                  <span>•</span>
                  <span>CGPA: <strong>{drive.minCGPA}</strong></span>
                  <span>•</span>
                  <span>📅 {drive.date}</span>
                </div>

                {/* Action & Status Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.35rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    marginTop: '0.15rem',
                  }}
                >
                  <span
                    className={`badge ${drive.applied ? 'badge-success' : 'badge-primary'}`}
                    style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}
                  >
                    {drive.applied ? drive.applicationStage : 'Eligible'}
                  </span>

                  <button
                    onClick={() => setActiveTab('company_prep')}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', fontWeight: 600 }}
                  >
                    Rounds Prep →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
