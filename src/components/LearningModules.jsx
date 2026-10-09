import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Award,
  Clock,
  Sparkles,
  Download,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEARNING_MODULES } from '../data/mockData';

export const LearningModules = ({ userProfile }) => {
  const [selectedModule, setSelectedModule] = useState(LEARNING_MODULES[0]);
  const [completedLessons, setCompletedLessons] = useState({
    'mod_dsa-0': true,
    'mod_dsa-1': true,
    'mod_dsa-2': true,
    'mod_apti-0': true,
    'mod_apti-1': true,
  });
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const toggleLesson = (key) => {
    setCompletedLessons(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClaimCertificate = () => {
    setShowCertificateModal(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen color="var(--primary)" />
              Structured Campus Placement Curriculum
            </h2>
            <p style={{ fontSize: '0.85rem' }}>
              Four foundational tracks: Data Structures & Algorithms, Quantitative Aptitude, Core CS Subjects, and Soft Skills.
            </p>
          </div>

          <button onClick={handleClaimCertificate} className="btn btn-primary">
            <Award size={16} /> View Earned Certificate
          </button>
        </div>

        {/* Track Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          {LEARNING_MODULES.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span className="badge badge-primary">{mod.badge}</span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                    {mod.progressPercent}% Done
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '0.4rem' }}>
                  {mod.title}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  👤 {mod.instructor} • ⏱️ {mod.duration}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Module Detail & Lessons View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem' }}>
        {/* Left: Lessons Checklist */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <PlayCircle size={18} color="var(--primary)" />
                {selectedModule.title}
              </h3>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Instructor: <strong>{selectedModule.instructor}</strong> • {selectedModule.level}
              </p>
            </div>
            <span className="badge badge-success">
              {selectedModule.completedCount} / {selectedModule.lessonsCount} Modules
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedModule.topics.map((topic, idx) => {
              const lessonKey = `${selectedModule.id}-${idx}`;
              const isDone = completedLessons[lessonKey];
              return (
                <div
                  key={idx}
                  onClick={() => toggleLesson(lessonKey)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isDone ? '2px solid #10b981' : '2px solid var(--border-card)',
                        background: isDone ? '#10b981' : 'transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                      }}
                    >
                      {isDone ? <Check size={14} /> : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {topic}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Interactive Video Lesson + Revision Cheat Sheet
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {isDone ? 'Completed' : 'Start Lesson'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Study Notes & Formula Handout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FileText size={18} color="var(--secondary)" />
                Curated Cheatsheets & Study Material
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
              Offline-friendly revision guides crafted by alumni who cracked Amazon, Flipkart, and TCS Digital.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>DSA 75 High-Frequency Patterns.pdf</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Includes Fast-Slow Pointers, Monotonic Stacks, DP State Machine</div>
                </div>
                <button onClick={() => alert('Downloaded DSA 75 High-Frequency Patterns PDF!')} className="btn btn-outline btn-sm">
                  <Download size={13} />
                </button>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>TCS NQT & Infosys Speed Math Hacks.pdf</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Vedic Math multipliers, Unit Digits, Work LCM tables</div>
                </div>
                <button onClick={() => alert('Downloaded Speed Math Hacks PDF!')} className="btn btn-outline btn-sm">
                  <Download size={13} />
                </button>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Core CS (OS/DBMS/CN) 100 Interview Q&A.pdf</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Acid properties, B+ trees, Thread safety, TCP vs UDP</div>
                </div>
                <button onClick={() => alert('Downloaded Core CS Handout!')} className="btn btn-outline btn-sm">
                  <Download size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verifiable Certificate Modal */}
      {showCertificateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#0d1322',
              border: '2px solid rgba(99, 102, 241, 0.5)',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ border: '2px dashed rgba(99, 102, 241, 0.4)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
              <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: '#818cf8', marginBottom: '0.5rem' }}>
                Certificate of Academic Excellence
              </h3>
              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                PlaceIQ Placement Readiness Certification
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                This is proudly presented to
              </p>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                {userProfile.name}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                For successfully demonstrating mastery across Data Structures, Algorithms, Quantitative Aptitude, and AI Mock Interview evaluations at <strong>{userProfile.college}</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <div>ID: <strong>PLIQ-2026-VIT-{userProfile.batchRank}94</strong></div>
                <div>Date: <strong>October 2026</strong></div>
                <div>Authorized by: <strong>TPO & Dean Academics</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary">
                <Download size={15} /> Download PDF
              </button>
              <button onClick={() => setShowCertificateModal(false)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
