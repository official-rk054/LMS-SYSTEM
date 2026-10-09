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
  Award
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export const Topbar = ({
  userProfile,
  theme,
  setTheme,
  lang,
  onToggleMobile,
  antiCheatingAlert
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
            Batch: <strong style={{ color: 'var(--text-main)' }}>2026 Campus Recruitment Drive</strong>
          </span>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
            <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }}></span>
            Drives Live
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

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-ghost btn-sm"
          title="Toggle Light / Dark Mode"
          style={{ padding: '0.4rem' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Anti-Cheating indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
          }}
          title="Proctoring System Active"
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Proctor Secure</span>
        </div>
      </div>
    </header>
  );
};
