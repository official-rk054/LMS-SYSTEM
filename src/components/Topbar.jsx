import React from 'react';
import {
  Menu,
  Flame,
  Zap,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Search,
  Sparkles,
  Award,
  LogOut,
  Users,
  Building
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const Topbar = ({
  userProfile,
  onLogout,
  theme,
  setTheme,
  lang,
  onToggleMobile
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          onClick={onToggleMobile}
          className="btn btn-ghost btn-sm"
          style={{ display: 'none', padding: '0.4rem' }}
          id="mobile-menu-toggle"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Institute: <strong style={{ color: '#0f172a' }}>{userProfile.college}</strong>
          </span>
          <span
            className="badge"
            style={{
              fontSize: '0.7rem',
              background: '#eef2ff',
              color: '#4f46e5',
              border: '1px solid #c7d2fe',
              fontWeight: 600,
            }}
          >
            <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>
            2026 Batch Active
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {userProfile.role === 'student' && (
          <>
            {/* Streak Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: '#b45309',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Daily Practice Streak"
            >
              <Flame size={16} color="#d97706" fill="#f59e0b" />
              <span>{userProfile.streakDays || 14} {t.streak}</span>
            </div>

            {/* XP Points */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: '#7e22ce',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Preparation Karma XP"
            >
              <Zap size={15} color="#9333ea" fill="#a855f7" />
              <span>{userProfile.xpPoints || 3420} XP</span>
            </div>

            {/* Placement Readiness Score Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: '#047857',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Overall Placement Readiness Index (0-100)"
            >
              <Award size={15} color="#059669" />
              <span>Readiness: {userProfile.placementReadinessScore || 84}%</span>
            </div>
          </>
        )}

        {userProfile.role === 'trainer' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#047857',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Users size={15} color="#059669" />
            <span>Assigned: 3 Batches (384 Students)</span>
          </div>
        )}

        {userProfile.role === 'admin' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#b45309',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Building size={15} color="#d97706" />
            <span>Placement Rate: 71.4% (1,320 Placed)</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-ghost btn-sm"
          title="Toggle Light / Dark Mode"
          style={{ padding: '0.4rem', color: '#475569' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="btn btn-ghost btn-sm"
          title="Sign out of current account"
          style={{ color: '#ef4444', padding: '0.4rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
