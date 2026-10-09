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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Institute: <strong style={{ color: 'var(--text-main)' }}>{userProfile.college}</strong>
          </span>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
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
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: '#fbbf24',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Daily Practice Streak"
            >
              <Flame size={16} color="#f59e0b" fill="#f59e0b" />
              <span>{userProfile.streakDays || 14} {t.streak}</span>
            </div>

            {/* XP Points */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: '#c084fc',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Preparation Karma XP"
            >
              <Zap size={15} color="#c084fc" fill="#c084fc" />
              <span>{userProfile.xpPoints || 3420} XP</span>
            </div>

            {/* Placement Readiness Score Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: '#34d399',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Overall Placement Readiness Index (0-100)"
            >
              <Award size={15} color="#10b981" />
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
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#34d399',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Users size={15} color="#10b981" />
            <span>Assigned: 3 Batches (384 Students)</span>
          </div>
        )}

        {userProfile.role === 'admin' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Building size={15} color="#f59e0b" />
            <span>Placement Rate: 71.4% (1,320 Placed)</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-ghost btn-sm"
          title="Toggle Light / Dark Mode"
          style={{ padding: '0.4rem' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="btn btn-ghost btn-sm"
          title="Sign out of current account"
          style={{ color: '#f87171', padding: '0.4rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
