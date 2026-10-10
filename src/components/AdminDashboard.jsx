import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building,
  PlusCircle,
  Upload,
  Download,
  Filter,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  BarChart3,
  Lock,
  Globe2,
  Calendar,
  Briefcase
} from 'lucide-react';
import { USERS_PROFILES, UPCOMING_DRIVES } from '../data/mockData';

export const AdminDashboard = ({ userProfile, setActiveTab }) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('roster'); // 'roster', 'drives', 'analytics', 'security'
  const [searchQuery, setSearchQuery] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('7.5');
  const [minReadinessFilter, setMinReadinessFilter] = useState('80');

  // New Drive Form state
  const [drivesList, setDrivesList] = useState(UPCOMING_DRIVES);
  const [newDrive, setNewDrive] = useState({
    company: 'Microsoft India',
    tier: 'Tier 1 Product',
    role: 'Software Engineer',
    packageCTC: '38.5 LPA',
    location: 'Bengaluru',
    minCGPA: 7.5,
    date: '2026-11-25',
  });

  const studentsList = [
    { id: '1', name: 'Aarav Sharma', regNo: '22BCE1042', branch: 'CSE', cgpa: 8.85, readiness: 84, status: 'Amazon OA Shortlisted', phone: '+91 98765 43210' },
    { id: '2', name: 'Priya Patel', regNo: '22BIT1015', branch: 'IT', cgpa: 9.15, readiness: 96, status: 'Google L3 Interview', phone: '+91 98765 43211' },
    { id: '3', name: 'Tanmay Saxena', regNo: '22BCE1180', branch: 'CSE', cgpa: 8.92, readiness: 94, status: 'Flipkart Offer Received', phone: '+91 98765 43212' },
    { id: '4', name: 'Rohan Deshmukh', regNo: '22BAD1008', branch: 'AI-DS', cgpa: 7.95, readiness: 80, status: 'TCS Digital Shortlisted', phone: '+91 98765 43213' },
    { id: '5', name: 'Ananya Iyer', regNo: '22BEC1099', branch: 'ECE', cgpa: 8.60, readiness: 91, status: 'Qualcomm Hardware OA', phone: '+91 98765 43214' },
    { id: '6', name: 'Kavya Madhavan', regNo: '22BCE1240', branch: 'CSE', cgpa: 7.40, readiness: 78, status: 'Eligible for Mass Drives', phone: '+91 98765 43215' },
    { id: '7', name: 'Nikhil Verma', regNo: '22BCE1312', branch: 'CSE', cgpa: 7.20, readiness: 76, status: 'Needs Aptitude Booster', phone: '+91 98765 43216' },
  ];

  // Audit Logs Mock
  const auditLogs = [
    { id: 1, action: 'Published Campus Drive', detail: 'Amazon SDE-1 OA Drive published for 2026 Batch', user: 'Dr. Meenakshi R.', timestamp: 'Today, 10:14 AM' },
    { id: 2, action: 'Candidate Shortlist Export', detail: 'Exported 142 students meeting CGPA >= 8.0 for Flipkart', user: 'Dr. Meenakshi R.', timestamp: 'Today, 09:30 AM' },
    { id: 3, action: 'Role Access Changed', detail: 'Granted Prof. Rajesh Sundaram Trainer evaluation access', user: 'System Admin', timestamp: 'Yesterday, 04:15 PM' },
    { id: 4, action: '2FA Policy Enforced', detail: 'Enforced 2FA OTP security for all TPO Command Users', user: 'Security Bot', timestamp: 'Oct 08, 2026' },
  ];

  // Filtering Engine
  const filteredStudents = studentsList.filter((std) => {
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) || std.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCgpa = std.cgpa >= parseFloat(minCgpaFilter || '0');
    const matchesReadiness = std.readiness >= parseInt(minReadinessFilter || '0', 10);
    return matchesSearch && matchesCgpa && matchesReadiness;
  });

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = 'Registration No,Name,Branch,CGPA,Readiness Score,Placement Status,Phone\n';
    const rows = filteredStudents.map(s => `${s.regNo},"${s.name}",${s.branch},${s.cgpa},${s.readiness}%,"${s.status}",${s.phone}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlaceIQ_Placement_Shortlist_2026.csv`;
    a.click();
  };

  const handleAddDrive = (e) => {
    e.preventDefault();
    if (!newDrive.company.trim()) return;

    setDrivesList(prev => [
      ...prev,
      {
        id: `drive_${prev.length + 1}`,
        company: newDrive.company,
        tier: newDrive.tier,
        logo: '🏢',
        role: newDrive.role,
        packageCTC: newDrive.packageCTC,
        location: newDrive.location,
        minCGPA: newDrive.minCGPA,
        date: newDrive.date,
        status: 'Applications Open',
        applied: false,
        applicationStage: 'Not Applied',
      },
    ]);

    alert(`Successfully published campus drive for ${newDrive.company}!`);
    setNewDrive({ company: '', tier: 'Tier 1 Product', role: '', packageCTC: '', location: '', minCGPA: 7.0, date: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* TPO Command Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(34, 211, 238, 0.06) 100%)',
          borderColor: 'rgba(192, 132, 252, 0.3)',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={20} color="var(--accent-purple)" />
              <span className="badge badge-warning">TPO Office Command & Placement Operations</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', color: 'var(--text-bright)', marginBottom: '0.2rem' }}>
              Vellore Institute of Technology • TPO Command Center
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Executive Director: {userProfile.name} • 2026 Campus Placement Cycle
            </p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-primary" style={{ background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#0f172a', fontWeight: 700 }}>
            <Download size={15} /> Export Roster CSV
          </button>
        </div>
      </div>

      {/* College Placement Key Metrics */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">1,850</div>
            <div className="stat-label">Registered Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">1,320 (71.4%)</div>
            <div className="stat-label">Placed Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
            <Building size={22} />
          </div>
          <div>
            <div className="stat-val">74 Companies</div>
            <div className="stat-label">Visited Campus</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div className="stat-val">44.5 LPA</div>
            <div className="stat-label">Highest Package (Amazon)</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeAdminSubTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('roster')}
        >
          <Filter size={15} /> Candidate Roster & Shortlist Engine
        </button>
        <button
          className={`tab-btn ${activeAdminSubTab === 'drives' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('drives')}
        >
          <Briefcase size={15} /> Campus Drive Publisher
        </button>
        <button
          className={`tab-btn ${activeAdminSubTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('analytics')}
        >
          <BarChart3 size={15} /> Campus CTC Analytics
        </button>
        <button
          className={`tab-btn ${activeAdminSubTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveAdminSubTab('security')}
        >
          <Lock size={15} /> Security Audits & RBAC
        </button>
      </div>

      {/* SubTab 1: Roster Shortlisting Engine */}
      {activeAdminSubTab === 'roster' && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="card-title">
              <Filter size={18} color="var(--primary)" />
              Candidate Shortlisting & Filtering Engine
            </h3>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                placeholder="Search by student name or Reg No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <span>Min CGPA:</span>
                <select
                  className="select"
                  style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  value={minCgpaFilter}
                  onChange={(e) => setMinCgpaFilter(e.target.value)}
                >
                  <option value="6.0">6.0+</option>
                  <option value="7.0">7.0+</option>
                  <option value="7.5">7.5+ (Tier 1 Drives)</option>
                  <option value="8.0">8.0+ (Top Tier Product)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                <span>Min Readiness:</span>
                <select
                  className="select"
                  style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                  value={minReadinessFilter}
                  onChange={(e) => setMinReadinessFilter(e.target.value)}
                >
                  <option value="50">50%+</option>
                  <option value="70">70%+</option>
                  <option value="80">80%+ (High Readiness)</option>
                  <option value="90">90%+ (Top Readiness)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Reg Number</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Candidate Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Branch</th>
                  <th style={{ padding: '0.75rem 1rem' }}>CGPA</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Readiness Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Placement Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((std) => (
                  <tr key={std.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {std.regNo}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                      {std.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                      {std.branch}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {std.cgpa}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-success">{std.readiness}%</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-primary">{std.status}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => alert(`Shortlisted ${std.name} for upcoming product drive!`)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--accent-purple)', fontSize: '0.75rem' }}
                      >
                        Shortlist Candidate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Drive Publisher */}
      {activeAdminSubTab === 'drives' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <PlusCircle size={18} color="var(--primary)" />
                Publish New Campus Recruitment Drive
              </h3>
            </div>

            <form onSubmit={handleAddDrive} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Company Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Microsoft India"
                  value={newDrive.company}
                  onChange={(e) => setNewDrive({ ...newDrive, company: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Software Engineer (SDE-1)"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Package (CTC)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 38.5 LPA"
                    value={newDrive.packageCTC}
                    onChange={(e) => setNewDrive({ ...newDrive, packageCTC: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Min Cutoff CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={newDrive.minCGPA}
                    onChange={(e) => setNewDrive({ ...newDrive, minCGPA: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Drive Date</label>
                  <input
                    type="date"
                    className="input"
                    value={newDrive.date}
                    onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#0f172a', fontWeight: 700, marginTop: '0.5rem' }}>
                Publish Drive to Student Portal
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Briefcase size={18} color="var(--secondary)" />
                Active Published Campus Drives ({drivesList.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {drivesList.map((drive) => (
                <div key={drive.id} style={{ padding: '0.9rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-bright)' }}>{drive.company}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{drive.role} • {drive.packageCTC}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Date: {drive.date} • Cutoff: {drive.minCGPA} CGPA</div>
                  </div>
                  <span className="badge badge-success">{drive.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: CTC Analytics */}
      {activeAdminSubTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BarChart3 size={18} color="var(--secondary)" />
                CTC Package Distribution Brackets
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <span>Super Dream (20+ LPA)</span>
                  <strong>184 Students (14%)</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '14%', height: '100%', background: '#c084fc' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <span>Dream Tier (10 - 20 LPA)</span>
                  <strong>420 Students (32%)</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '32%', height: '100%', background: '#818cf8' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <span>Regular / Mass (5 - 10 LPA)</span>
                  <strong>716 Students (54%)</strong>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '54%', height: '100%', background: '#22d3ee' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Building size={18} color="var(--primary)" />
                Branch-Wise Placement Summary
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                <span>CSE (Computer Science)</span>
                <strong style={{ color: 'var(--success)' }}>89.2% Placed</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                <span>IT (Information Technology)</span>
                <strong style={{ color: 'var(--success)' }}>85.4% Placed</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                <span>AI & Data Science</span>
                <strong style={{ color: 'var(--success)' }}>88.0% Placed</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                <span>ECE (Electronics & Comm)</span>
                <strong style={{ color: 'var(--warning)' }}>74.5% Placed</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Security Audits */}
      {activeAdminSubTab === 'security' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Lock size={18} color="var(--danger)" />
              Security Audit Trails & RBAC Permissions Log
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.map((log) => (
              <div key={log.id} style={{ padding: '0.85rem 1rem', background: 'rgba(24, 24, 28, 0.75)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{log.action}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.detail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--secondary)' }}>By: {log.user}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
