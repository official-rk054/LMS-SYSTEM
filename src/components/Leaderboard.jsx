import React from 'react';
import {
  Trophy,
  Award,
  Flame,
  Zap,
  TrendingUp,
  Medal,
  Crown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { BATCH_LEADERBOARD } from '../data/mockData';

export const Leaderboard = ({ userProfile }) => {
  const badgesList = [
    { title: '14-Day Streak Titan', icon: Flame, color: '#f59e0b', desc: 'Practiced consistently for 14 straight days.' },
    { title: 'ATS Resume Master', icon: Award, color: '#ec4899', desc: 'Achieved an ATS optimization score above 85%.' },
    { title: 'LeetCode Knight', icon: Zap, color: '#a855f7', desc: 'Solved 100+ Data Structures problems in Arena.' },
    { title: 'Aptitude Ace', icon: Trophy, color: '#10b981', desc: 'Scored 90th percentile in College Mock Assessments.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy color="#f59e0b" />
              Batch Rankings & Gamification Hall of Fame
            </h2>
            <p style={{ fontSize: '0.85rem' }}>
              Compete with your 2026 engineering peers across VIT, IIT, and NIT campuses. Earn Karma XP by taking tests, solving coding problems, and simulating mock interviews.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(245, 158, 11, 0.12)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--text-warning)', fontWeight: 700 }}>
              Your Rank: #4 of 420
            </div>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(168, 85, 247, 0.12)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontWeight: 700 }}>
              {userProfile.xpPoints} Karma XP
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid-3">
        {BATCH_LEADERBOARD.slice(0, 3).map((item, idx) => (
          <div
            key={item.rank}
            className={`card leaderboard-podium-card rank-${idx}`}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-bright)', marginBottom: '0.2rem' }}>
              {item.name}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
              {item.branch} • {item.college}
            </p>
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
              {item.badge}
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.8rem' }}>
              <div>
                <strong style={{ color: '#c084fc' }}>{item.xp}</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>XP Points</div>
              </div>
              <div>
                <strong style={{ color: '#10b981' }}>{item.readiness}%</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Readiness</div>
              </div>
              <div>
                <strong style={{ color: '#38bdf8' }}>{item.solvedCoding}</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Solved</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Medal size={18} color="var(--primary)" />
            All-College Batch Standings (2026 Batch)
          </h3>
          <span className="badge badge-info">Updated Daily at 00:00 IST</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
                <th style={{ padding: '0.75rem 1rem' }}>Candidate</th>
                <th style={{ padding: '0.75rem 1rem' }}>College / Institute</th>
                <th style={{ padding: '0.75rem 1rem' }}>Branch</th>
                <th style={{ padding: '0.75rem 1rem' }}>Readiness</th>
                <th style={{ padding: '0.75rem 1rem' }}>Coding Solved</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tests</th>
                <th style={{ padding: '0.75rem 1rem' }}>Karma XP</th>
              </tr>
            </thead>
            <tbody>
              {BATCH_LEADERBOARD.map((row) => {
                const isUser = row.name.includes('(You)');
                return (
                  <tr
                    key={row.rank}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isUser ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      #{row.rank}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: isUser ? '#a5b4fc' : 'var(--text-main)' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {row.college}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {row.branch}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-success">{row.readiness}%</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {row.solvedCoding}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {row.testsTaken}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#c084fc' }}>
                      {row.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earned Badges Showcase */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Sparkles size={18} color="#a855f7" />
            Your Unlocked Achievement Badges
          </h3>
          <span className="badge badge-primary">4 Unlocked</span>
        </div>

        <div className="grid-4">
          {badgesList.map((b, i) => {
            const BIcon = b.icon;
            return (
              <div
                key={i}
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: `${b.color}22`,
                    color: b.color,
                    margin: '0 auto 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BIcon size={22} />
                </div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-bright)', marginBottom: '0.25rem' }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
