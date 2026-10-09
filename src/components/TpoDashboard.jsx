import React from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  Award,
  TrendingUp,
  Download,
  Calendar,
  Briefcase,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UPCOMING_DRIVES } from '../data/mockData';

export const TpoDashboard = ({ userProfile, setActiveTab, onExportReport }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* TPO Executive Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-warning">🏛️ Chief Placement Officer (TPO) Command Suite</span>
              <span className="badge badge-primary">{userProfile.college}</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--text-bright)', marginBottom: '0.35rem' }}>
              Welcome, {userProfile.name}!
            </h1>
            <p style={{ fontSize: '0.92rem', maxWidth: '680px' }}>
              {userProfile.designation}. Managing campus placement operations, corporate relations, and candidate shortlists for the{' '}
              <strong style={{ color: '#fbbf24' }}>2026 Graduating Batch</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('tpo_shortlist')}
              className="btn btn-primary"
            >
              <Users size={16} /> Shortlist Candidates
            </button>
            <button
              onClick={onExportReport}
              className="btn btn-outline"
            >
              <Download size={16} /> Export Placement Report (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* College-Wide KPI Metrics */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">1,850</div>
            <div className="stat-label">Registered Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">1,320 (71.4%)</div>
            <div className="stat-label">Placed Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className="stat-val">₹44.5 LPA</div>
            <div className="stat-label">Highest CTC (Amazon)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-val">₹9.2 LPA</div>
            <div className="stat-label">Average Institutional CTC</div>
          </div>
        </div>
      </div>

      {/* Visiting Companies & Recruitment Schedule */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Building size={18} color="var(--primary)" />
              Corporate Recruitment Schedule (74 Visiting Partners)
            </h3>
            <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Live tracking of company slots, minimum CGPA eligibility filters, and package bands.
            </p>
          </div>
          <button onClick={() => setActiveTab('tpo_drives')} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
            Manage All Drives →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Recruiting Company</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tier / Sector</th>
                <th style={{ padding: '0.75rem 1rem' }}>Designation</th>
                <th style={{ padding: '0.75rem 1rem' }}>Package (CTC)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Min CGPA</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assessment Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Drive Status</th>
              </tr>
            </thead>
            <tbody>
              {UPCOMING_DRIVES.map((drive) => (
                <tr key={drive.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{drive.logo}</span>
                    <span>{drive.company}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                    {drive.tier}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {drive.role}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#10b981' }}>
                    {drive.packageCTC}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    {drive.minCGPA}+
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {drive.date}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-success">{drive.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
