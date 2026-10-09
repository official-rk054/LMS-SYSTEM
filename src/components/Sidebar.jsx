import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Mic,
  CheckSquare,
  Code2,
  BookOpen,
  Building2,
  Trophy,
  Users,
  MessageSquare,
  Sparkles,
  CalendarDays,
  CreditCard,
  Briefcase,
  ShieldCheck,
  Globe2,
  GraduationCap,
  Layers,
  LogOut,
  Award,
  PlusCircle,
  Filter
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  userProfile,
  onLogout,
  lang,
  setLang,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Distinct navigation sets for each role
  let navItems = [];

  if (userProfile.role === 'student') {
    navItems = [
      { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, badge: null },
      { id: 'resume_builder', label: t.resumeBuilder, icon: FileText, badge: 'ATS v2' },
      { id: 'resume_analyzer', label: t.resumeAnalyzer, icon: FileCheck2, badge: 'AI Score' },
      { id: 'mock_interview', label: t.mockInterview, icon: Mic, badge: 'Voice/AI' },
      { id: 'mcq_engine', label: t.mcqTestEngine, icon: CheckSquare, badge: 'Timed' },
      { id: 'coding_arena', label: t.codingArena, icon: Code2, badge: 'Auto-Judge' },
      { id: 'learning_modules', label: t.learningModules, icon: BookOpen, badge: '4 Tracks' },
      { id: 'company_prep', label: t.companyRoadmaps, icon: Building2, badge: 'TCS/Amazon' },
      { id: 'leaderboard', label: t.leaderboard, icon: Trophy, badge: '#4' },
      { id: 'gd_simulator', label: t.gdSimulator, icon: Users, badge: 'Multi-AI' },
      { id: 'extra_suite', label: 'Extra Bonus Hub', icon: Sparkles, badge: '6 Tools' },
      { id: 'job_board', label: t.jobBoard, icon: Briefcase, badge: '5 Drives' },
    ];
  } else if (userProfile.role === 'trainer') {
    navItems = [
      { id: 'trainer_dashboard', label: 'Trainer Dashboard', icon: LayoutDashboard, badge: null },
      { id: 'trainer_tests', label: 'Test Creator & Upload', icon: PlusCircle, badge: 'Bulk Importer' },
      { id: 'trainer_roster', label: 'Cohort Performance Roster', icon: Users, badge: '384 Students' },
      { id: 'trainer_curriculum', label: 'Learning Curriculum', icon: BookOpen, badge: '4 Tracks' },
      { id: 'trainer_leaderboard', label: 'Batch Rankings', icon: Trophy, badge: 'All Batches' },
    ];
  } else {
    // Admin / TPO
    navItems = [
      { id: 'tpo_dashboard', label: 'TPO Command Dashboard', icon: LayoutDashboard, badge: '71.4% Placed' },
      { id: 'tpo_shortlist', label: 'Candidate Shortlisting Engine', icon: Filter, badge: 'Criteria Filter' },
      { id: 'tpo_drives', label: 'Campus Placement Drives', icon: Briefcase, badge: '74 Partners' },
      { id: 'tpo_tests', label: 'Assessments & Proctoring', icon: CheckSquare, badge: 'Active' },
      { id: 'tpo_leaderboard', label: 'Institutional Rankings', icon: Trophy, badge: 'College' },
    ];
  }

  const roleLabels = {
    student: 'Student Portal',
    trainer: 'Faculty / Trainer Portal',
    admin: 'Placement Officer (TPO) Portal',
  };

  const roleColors = {
    student: '#38bdf8',
    trainer: '#34d399',
    admin: '#fbbf24',
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-icon">
            <GraduationCap size={22} color="#ffffff" />
          </div>
          <div>
            <span>Place</span><span style={{ color: '#06b6d4' }}>IQ</span>
          </div>
        </div>

        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="role-selector-pill"
          title="Toggle English / Hindi"
        >
          <Globe2 size={13} />
          {lang === 'en' ? 'हिन्दी' : 'EN'}
        </button>
      </div>

      {/* Role Indicator Banner */}
      <div style={{ padding: '0.75rem 1rem 0.25rem' }}>
        <div
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${roleColors[userProfile.role]}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: roleColors[userProfile.role], fontWeight: 700 }}>
            <Layers size={14} />
            <span>{roleLabels[userProfile.role]}</span>
          </div>
          <span
            className="badge"
            style={{
              background: `${roleColors[userProfile.role]}22`,
              color: roleColors[userProfile.role],
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
            }}
          >
            ACTIVE
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {userProfile.role === 'student' ? 'Student Workspace' : userProfile.role === 'trainer' ? 'Faculty Controls' : 'TPO Operations'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              id={`nav-${item.id}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with User Details & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar">
            {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="user-details">
            <div className="user-name">{userProfile.name}</div>
            <div className="user-college">{userProfile.college}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn btn-outline btn-sm"
          style={{
            width: '100%',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#f87171',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            fontSize: '0.78rem',
            marginTop: '0.25rem',
          }}
          title="Sign out from session"
        >
          <LogOut size={14} />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>
    </aside>
  );
};
