import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Building,
  Calendar,
  ExternalLink,
  Filter,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  X,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UPCOMING_DRIVES } from '../data/mockData';
import { applyToCampusDrive } from '../services/authDatabase';

export const JobBoard = ({ userProfile, onApplyDrive }) => {
  const [drives, setDrives] = useState(UPCOMING_DRIVES);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApplicationModal, setSelectedApplicationModal] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Set of applied drive IDs from user profile
  const appliedDriveMap = new Map();
  (userProfile?.appliedDrives || []).forEach(app => {
    appliedDriveMap.set(app.id || app.driveId, app);
  });

  const studentCgpa = parseFloat(userProfile?.cgpa) || 8.85;

  const handleApply = (drive) => {
    const result = applyToCampusDrive(drive);
    if (!result.success) {
      setActionNotice({
        type: 'error',
        message: result.message,
      });
      return;
    }

    // Trigger celebratory confetti for real application submission
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    setSelectedApplicationModal(result.application);
    setActionNotice({
      type: 'success',
      message: `Registration confirmed for ${drive.company}! Application ID: ${result.application.applicationId}`,
    });

    if (onApplyDrive) {
      onApplyDrive(drive, result.updatedUser);
    }
  };

  const filtered = drives.filter(d => {
    const isApplied = appliedDriveMap.has(d.id) || d.applied;
    if (activeFilter === 'applied') return isApplied;
    if (activeFilter === 'product') return d.tier.includes('Product');
    if (activeFilter === 'mass') return d.tier.includes('Mass');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Notice Banner */}
      {actionNotice && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: actionNotice.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${actionNotice.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: actionNotice.type === 'success' ? '#4ade80' : '#f87171',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {actionNotice.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.2rem 0.5rem', color: 'inherit' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase color="var(--primary)" />
              Campus Drives & Internship Notice Board
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Live 2026 Batch placement schedule directly connected to College Training & Placement Office (TPO).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Campus Drives ({drives.length})
            </button>
            <button
              onClick={() => setActiveFilter('applied')}
              className={`btn btn-sm ${activeFilter === 'applied' ? 'btn-primary' : 'btn-outline'}`}
            >
              My Applications ({drives.filter(d => appliedDriveMap.has(d.id) || d.applied).length})
            </button>
            <button
              onClick={() => setActiveFilter('product')}
              className={`btn btn-sm ${activeFilter === 'product' ? 'btn-primary' : 'btn-outline'}`}
            >
              Product Tier (20-45 LPA)
            </button>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((drive) => {
          const appliedRecord = appliedDriveMap.get(drive.id);
          const isApplied = Boolean(appliedRecord) || drive.applied;
          const currentStage = appliedRecord?.stage || drive.applicationStage || 'Registered';
          const isCgpaEligible = studentCgpa >= (parseFloat(drive.minCGPA) || 6.0);

          return (
            <div
              key={drive.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                border: isApplied ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border-glass)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-bright)', margin: 0 }}>
                      {drive.company}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{drive.tier}</span>
                  </div>

                  <span className="badge badge-success" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {drive.packageCTC}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {drive.role}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div><strong>Location:</strong> {drive.location}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <strong>Cutoff:</strong> Min CGPA {drive.minCGPA}
                    {isCgpaEligible ? (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                        Eligible (You: {studentCgpa.toFixed(2)})
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.05rem 0.35rem' }}>
                        Below Cutoff (You: {studentCgpa.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <div><strong>Drive Date:</strong> {drive.date}</div>
                  <div><strong>Eligible:</strong> {drive.eligibleBranches.join(', ')}</div>
                </div>

                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                    Recruitment Process:
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
                <span className={`badge ${isApplied ? 'badge-success' : isCgpaEligible ? 'badge-primary' : 'badge-warning'}`}>
                  {isApplied ? currentStage : isCgpaEligible ? 'Eligible for Drive' : 'CGPA Ineligible'}
                </span>

                {isApplied ? (
                  <button
                    onClick={() => setSelectedApplicationModal(appliedRecord || {
                      id: drive.id,
                      company: drive.company,
                      role: drive.role,
                      packageCTC: drive.packageCTC,
                      applicationId: `TPO-${drive.company.slice(0, 4).toUpperCase()}-2026-LIVE`,
                      stage: currentStage,
                      date: drive.date,
                    })}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#4ade80' }}
                  >
                    <CheckCircle size={14} color="#10b981" /> View Application
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(drive)}
                    disabled={!isCgpaEligible}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                  >
                    Register / Apply Now <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official TPO Application Acknowledgement Modal */}
      {selectedApplicationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-card)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} color="#22c55e" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-bright)' }}>
                    Official TPO Placement Application
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    Vellore Institute of Technology Training & Placement Cell
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicationModal(null)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Application ID:</span>
                <strong style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>
                  {selectedApplicationModal.applicationId}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Company & Role:</span>
                <strong style={{ color: 'var(--text-bright)' }}>
                  {selectedApplicationModal.company} — {selectedApplicationModal.role}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Offered Package:</span>
                <strong style={{ color: '#34d399' }}>{selectedApplicationModal.packageCTC}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Candidate:</span>
                <strong style={{ color: 'var(--text-bright)' }}>
                  {userProfile?.name || 'Aarav Sharma'} (CGPA: {studentCgpa.toFixed(2)})
                </strong>
              </div>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.25rem' }}>
                ✓ Status: {selectedApplicationModal.stage || 'Registered'}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Your resume and academic transcript have been dispatched to the {selectedApplicationModal.company} campus recruitment committee. Online assessment link will be activated 24 hours prior to drive date.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedApplicationModal(null)}
                className="btn btn-primary btn-sm"
                style={{ padding: '0.4rem 1rem' }}
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

