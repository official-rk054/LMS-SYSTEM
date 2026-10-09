import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Building,
  Calendar,
  ExternalLink,
  Filter,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { UPCOMING_DRIVES } from '../data/mockData';

export const JobBoard = ({ onApplyDrive }) => {
  const [drives, setDrives] = useState(UPCOMING_DRIVES);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleApply = (id) => {
    setDrives(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          applied: true,
          applicationStage: 'Registered (Applied)',
        };
      }
      return d;
    }));
    alert('Application successfully submitted to College TPO Portal!');
  };

  const filtered = drives.filter(d => {
    if (activeFilter === 'applied') return d.applied;
    if (activeFilter === 'product') return d.tier.includes('Product');
    if (activeFilter === 'mass') return d.tier.includes('Mass');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase color="var(--primary)" />
              Campus Drives & Internship Notice Board
            </h2>
            <p style={{ fontSize: '0.85rem' }}>
              Live hiring updates directly synced with College Training & Placement Office (TPO).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Campus Drives
            </button>
            <button
              onClick={() => setActiveFilter('applied')}
              className={`btn btn-sm ${activeFilter === 'applied' ? 'btn-primary' : 'btn-outline'}`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveFilter('product')}
              className={`btn btn-sm ${activeFilter === 'product' ? 'btn-primary' : 'btn-outline'}`}
            >
              Product Giants (20-45 LPA)
            </button>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((drive) => (
          <div
            key={drive.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>{drive.logo}</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)', margin: 0 }}>
                      {drive.company}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{drive.tier}</span>
                  </div>
                </div>

                <span className="badge badge-success" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {drive.packageCTC}
                </span>
              </div>

              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {drive.role}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div>📍 <strong>Location:</strong> {drive.location}</div>
                <div>🎓 <strong>Min CGPA:</strong> {drive.minCGPA} (Eligible Branches: {drive.eligibleBranches.join(', ')})</div>
                <div>📅 <strong>Drive Date:</strong> {drive.date}</div>
              </div>

              <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                  Hiring Rounds:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {drive.rounds.map((r, i) => (
                    <span key={i} className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                      {r.split('(')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span className={`badge ${drive.applied ? 'badge-success' : 'badge-warning'}`}>
                {drive.applied ? drive.applicationStage : 'Not Applied'}
              </span>

              {drive.applied ? (
                <button className="btn btn-outline btn-sm" disabled style={{ opacity: 0.8 }}>
                  <CheckCircle size={14} color="#10b981" /> Application Submitted
                </button>
              ) : (
                <button
                  onClick={() => handleApply(drive.id)}
                  className="btn btn-primary btn-sm"
                >
                  Register / Apply Now <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
