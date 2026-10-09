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
  Award
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  userProfile,
  setUserRole,
  lang,
  setLang,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleRoleToggle = () => {
    if (userProfile.role === 'student') setUserRole('trainer');
    else if (userProfile.role === 'trainer') setUserRole('admin');
    else setUserRole('student');
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, badge: null, roles: ['student', 'trainer', 'admin'] },
    { id: 'resume_builder', label: t.resumeBuilder, icon: FileText, badge: 'ATS v2', roles: ['student'] },
    { id: 'resume_analyzer', label: t.resumeAnalyzer, icon: FileCheck2, badge: 'AI Score', roles: ['student'] },
    { id: 'mock_interview', label: t.mockInterview, icon: Mic, badge: 'Voice/AI', roles: ['student'] },
    { id: 'mcq_engine', label: t.mcqTestEngine, icon: CheckSquare, badge: 'Timed', roles: ['student', 'trainer'] },
    { id: 'coding_arena', label: t.codingArena, icon: Code2, badge: 'Auto-Judge', roles: ['student'] },
    { id: 'learning_modules', label: t.learningModules, icon: BookOpen, badge: '4 Tracks', roles: ['student', 'trainer'] },
    { id: 'company_prep', label: t.companyRoadmaps, icon: Building2, badge: 'TCS/Amazon', roles: ['student'] },
    { id: 'leaderboard', label: t.leaderboard, icon: Trophy, badge: '#12', roles: ['student', 'trainer', 'admin'] },
    { id: 'gd_simulator', label: t.gdSimulator, icon: Users, badge: 'Multi-AI', roles: ['student'] },
    { id: 'extra_suite', label: 'Extra Bonus Hub', icon: Sparkles, badge: '6 Tools', roles: ['student'] },
    { id: 'job_board', label: t.jobBoard, icon: Briefcase, badge: '5 Drives', roles: ['student', 'admin'] },
    { id: 'admin_panel', label: t.adminPanel, icon: ShieldCheck, badge: 'TPO View', roles: ['trainer', 'admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userProfile.role));

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

      <div style={{ padding: '0.75rem 1rem 0.25rem' }}>
        <button
          onClick={handleRoleToggle}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.75rem', borderColor: 'var(--border-subtle)' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={13} color="var(--primary)" />
            Role: <strong>{userProfile.role.toUpperCase()}</strong>
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Switch ▾</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation Hub</div>
        {filteredNavItems.map((item) => {
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
      </div>
    </aside>
  );
};
