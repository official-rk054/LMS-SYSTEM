import React, { useState, useEffect } from 'react';
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
import { orchestrator } from '../services/gemini';

export const Topbar = ({
  userProfile,
  onLogout,
  theme,
  setTheme,
  lang,
  onToggleMobile,
  onOpenGeminiSettings,
}) => {
  const [hasGeminiKey, setHasGeminiKey] = useState(() => orchestrator.getStatus().hasKey);

  useEffect(() => {
    return orchestrator.subscribe(status => {
      setHasGeminiKey(status.hasKey);
    });
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isLight = theme === 'light';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          onClick={onToggleMobile}
          className="btn btn-ghost btn-sm"
          style={{ display: 'none', padding: '0.4rem', color: isLight ? '#334155' : 'var(--text-main)' }}
          id="mobile-menu-toggle"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
            Institute: <strong style={{ color: isLight ? '#0f172a' : 'var(--text-main)' }}>{userProfile.college}</strong>
          </span>
          <span
            className="badge"
            style={{
              fontSize: '0.7rem',
              background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              color: isLight ? '#0f172a' : '#f4f4f5',
              border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.15)',
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
                background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
                border: isLight ? '1px solid #fde68a' : '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: isLight ? '#b45309' : 'var(--text-warning)',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Daily Practice Streak"
            >
              <Flame size={16} color={isLight ? '#d97706' : '#f59e0b'} fill="#f59e0b" />
              <span>{userProfile.streakDays || 14} {t.streak}</span>
            </div>

            {/* Placement Readiness Score Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
                border: isLight ? '1px solid #a7f3d0' : '1px solid rgba(16, 185, 129, 0.35)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                color: isLight ? '#047857' : '#34d399',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Overall Placement Readiness Index (0-100)"
            >
              <Award size={15} color={isLight ? '#059669' : '#10b981'} />
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
              background: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
              border: isLight ? '1px solid #a7f3d0' : '1px solid rgba(16, 185, 129, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: isLight ? '#047857' : '#34d399',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Users size={15} color={isLight ? '#059669' : '#10b981'} />
            <span>Assigned: 3 Batches (384 Students)</span>
          </div>
        )}

        {userProfile.role === 'admin' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
              border: isLight ? '1px solid #fde68a' : '1px solid rgba(245, 158, 11, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: isLight ? '#b45309' : 'var(--text-warning)',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Building size={15} color={isLight ? '#d97706' : '#f59e0b'} />
            <span>Placement Rate: 71.4% (1,320 Placed)</span>
          </div>
        )}

        {/* Gemini AI Status & Settings Button */}
        <button
          onClick={onOpenGeminiSettings}
          className="btn btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: hasGeminiKey
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)'
              : (isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)'),
            border: hasGeminiKey
              ? '1px solid rgba(168, 85, 247, 0.45)'
              : (isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'),
            color: hasGeminiKey ? '#c084fc' : (isLight ? '#475569' : 'var(--text-muted)'),
            cursor: 'pointer',
          }}
          title="Google Gemini AI Engine: Configure API key and test connection"
        >
          <Sparkles size={13} color={hasGeminiKey ? '#c084fc' : (isLight ? '#64748b' : '#a1a1aa')} />
          <span>{hasGeminiKey ? 'Gemini 2.5 Active' : 'Gemini AI'}</span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: hasGeminiKey ? '#34d399' : '#f59e0b',
              display: 'inline-block',
            }}
          />
        </button>

        {/* Anti-Cheating / Proctoring Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            color: isLight ? '#047857' : '#34d399',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            background: isLight ? '#ecfdf5' : 'rgba(52, 211, 153, 0.08)',
            border: isLight ? '1px solid #a7f3d0' : '1px solid rgba(52, 211, 153, 0.2)',
            fontWeight: 600,
          }}
          title="Proctoring System Active"
        >
          <ShieldCheck size={14} color={isLight ? '#059669' : '#10b981'} />
          <span>Proctor Secure</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-ghost btn-sm"
          title="Toggle Light / Dark Mode"
          style={{ padding: '0.4rem', color: isLight ? '#475569' : 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-ghost btn-sm"
            title="Sign out of current account"
            style={{ color: isLight ? '#ef4444' : 'var(--text-danger)', padding: '0.4rem' }}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
};
