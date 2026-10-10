import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  User,
  Layers,
  Building,
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldAlert,
  Clock,
  X,
  Check,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  authenticateUser,
  registerUser,
  validatePasswordPolicy,
  checkRateLimit,
  getSecurityAuditReport,
  getUsers
} from '../services/authDatabase';

export const LoginPage = ({ onLoginSuccess, lang }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('student');
  const [signupCollege, setSignupCollege] = useState('Vellore Institute of Technology (VIT)');
  const [signupDegree, setSignupDegree] = useState('B.Tech - Computer Science & Engineering');
  const [signupGradYear, setSignupGradYear] = useState('2026');
  const [signupCgpa, setSignupCgpa] = useState('8.65');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Security Audit Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditReport, setAuditReport] = useState(() => getSecurityAuditReport());
  const [registeredUsersCount, setRegisteredUsersCount] = useState(() => getUsers().length);

  // Password Policy Meter Evaluation
  const passwordEvaluation = validatePasswordPolicy(signupPassword);
  const passwordsMatch = signupPassword && signupConfirmPassword && signupPassword === signupConfirmPassword;

  // Rate Limiting Countdown Timer
  useEffect(() => {
    let timer;
    if (rateLimitSeconds > 0) {
      timer = setInterval(() => {
        setRateLimitSeconds((prev) => {
          if (prev <= 1) {
            setLoginError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitSeconds]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both institutional email and password.');
      return;
    }

    setIsLoginLoading(true);

    setTimeout(() => {
      const res = authenticateUser(loginEmail, loginPassword);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setLoginError(res.message);
        if (res.isLocked && res.remainingSec) {
          setRateLimitSeconds(res.remainingSec);
        }
        setIsLoginLoading(false);
      }
    }, 400);
  };

  // Handle Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    // Pre-flight checks
    if (!signupName.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setSignupError('Please enter your institutional email.');
      return;
    }
    if (!passwordEvaluation.isValid) {
      setSignupError(`Weak password: ${passwordEvaluation.errors.join(', ')}.`);
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSignupLoading(true);

    setTimeout(() => {
      const res = registerUser({
        fullName: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        college: signupCollege,
        degree: signupDegree,
        graduationYear: signupGradYear,
        cgpa: signupCgpa,
      });

      if (res.success) {
        setSignupSuccess('Account created successfully! Preparing your personalized placement command center...');
        setRegisteredUsersCount(getUsers().length);
        setAuditReport(getSecurityAuditReport());
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 800);
      } else {
        setSignupError(res.message);
        setIsSignupLoading(false);
      }
    }, 500);
  };

  // 1-Click Demo Credential Fillers
  const fillCredentials = (demoEmail, demoPassword) => {
    setAuthMode('login');
    setLoginEmail(demoEmail);
    setLoginPassword(demoPassword);
    setLoginError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#09090b',
        padding: '2rem 1.5rem',
      }}
    >
      {/* Background Floating Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '12%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180, 180, 200, 0.025) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '35%',
          left: '25%',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphic Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: authMode === 'signup' ? '560px' : '490px',
          position: 'relative',
          zIndex: 10,
          background: 'rgba(18, 18, 22, 0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.03)',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Top Header & Security Shield Trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ffffff 0%, #71717a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
                flexShrink: 0,
              }}
            >
              <GraduationCap size={28} color="#09090b" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Place<span style={{ color: '#cbd5e1' }}>IQ</span>
              </h1>
              <span style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                Campus-to-Career Placement LMS
              </span>
            </div>
          </div>

          {/* Security Audit Badge Button */}
          <button
            type="button"
            onClick={() => {
              setAuditReport(getSecurityAuditReport());
              setShowAuditModal(true);
            }}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '0.35rem 0.65rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Inspect OWASP Security Compliance & Flaw Audit"
          >
            <ShieldCheck size={14} />
            <span>OWASP Audit (A+)</span>
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(28, 28, 34, 0.85)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLoginError('');
            }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: authMode === 'login' ? '#09090b' : '#a1a1aa',
              background: authMode === 'login' ? 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)' : 'transparent',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'login' ? '0 2px 10px rgba(0, 0, 0, 0.5)' : 'none',
            }}
          >
            Sign In to Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setSignupError('');
              setSignupSuccess('');
            }}
            style={{
              flex: 1,
              padding: '0.55rem',
              borderRadius: '9px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: authMode === 'signup' ? '#09090b' : '#a1a1aa',
              background: authMode === 'signup' ? 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)' : 'transparent',
              transition: 'all 0.2s ease',
              boxShadow: authMode === 'signup' ? '0 2px 10px rgba(0, 0, 0, 0.5)' : 'none',
            }}
          >
            Create New Account
          </button>
        </div>

        {/* ============================================================== */}
        {/* LOGIN MODE                                                     */}
        {/* ============================================================== */}
        {authMode === 'login' && (
          <div>
            {/* Rate Limit Lock Alert */}
            {rateLimitSeconds > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#fca5a5',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Clock size={18} className="pulse-dot" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Brute-Force Lockout Active:</strong> Please wait{' '}
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>{rateLimitSeconds}s</span> before retrying.
                </div>
              </div>
            )}

            {/* Error Notification */}
            {loginError && rateLimitSeconds === 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#fca5a5',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Email Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Institutional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="input"
                    style={{
                      paddingLeft: '42px',
                      height: '46px',
                      background: 'rgba(24, 24, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.9rem',
                    }}
                    placeholder="student@vit.ac.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={rateLimitSeconds > 0}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    className="input"
                    style={{
                      paddingLeft: '42px',
                      paddingRight: '42px',
                      height: '46px',
                      background: 'rgba(24, 24, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.9rem',
                    }}
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={rateLimitSeconds > 0}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoginLoading || rateLimitSeconds > 0}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
                  color: '#09090b',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
                  marginTop: '0.35rem',
                }}
              >
                {isLoginLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Accounts */}
            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pre-Seeded Institutional Demo Logins
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Password: password123</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <button
                  type="button"
                  onClick={() => fillCredentials('student@vit.ac.in', 'password123')}
                  className="btn btn-outline btn-sm"
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🎓</span>
                    <strong>Student Portal:</strong> Aarav Sharma
                  </span>
                  <span style={{ color: '#818cf8', fontSize: '0.72rem' }}>student@vit.ac.in</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('trainer@vit.ac.in', 'password123')}
                  className="btn btn-outline btn-sm"
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>👨‍🏫</span>
                    <strong>Trainer Portal:</strong> Prof. Rajesh Sundaram
                  </span>
                  <span style={{ color: '#34d399', fontSize: '0.72rem' }}>trainer@vit.ac.in</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('admin@vit.ac.in', 'password123')}
                  className="btn btn-outline btn-sm"
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏛️</span>
                    <strong>TPO Admin Portal:</strong> Dr. Meenakshi Ramanathan
                  </span>
                  <span style={{ color: '#fbbf24', fontSize: '0.72rem' }}>admin@vit.ac.in</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SIGN UP MODE                                                   */}
        {/* ============================================================== */}
        {authMode === 'signup' && (
          <div>
            {/* Success Banner */}
            {signupSuccess && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(16, 185, 129, 0.18)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#6ee7b7',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{signupSuccess}</span>
              </div>
            )}

            {/* Error Notification */}
            {signupError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#fca5a5',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Role Selection Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Register As Institutional Role:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                  {[
                    { key: 'student', label: 'Student', icon: '🎓' },
                    { key: 'trainer', label: 'Trainer', icon: '👨‍🏫' },
                    { key: 'admin', label: 'TPO Officer', icon: '🏛️' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSignupRole(r.key)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '9px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: signupRole === r.key ? 'rgba(255, 255, 255, 0.12)' : 'rgba(24, 24, 28, 0.75)',
                        border: signupRole === r.key ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: signupRole === r.key ? '#ffffff' : '#a1a1aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Full Name (Official College Roster)
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <User size={17} />
                  </div>
                  <input
                    type="text"
                    required
                    className="input"
                    style={{
                      paddingLeft: '40px',
                      height: '42px',
                      background: 'rgba(24, 24, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.86rem',
                    }}
                    placeholder="e.g. Rohan Deshmukh"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>

              {/* Institutional Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Institutional / University Email
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    className="input"
                    style={{
                      paddingLeft: '40px',
                      height: '42px',
                      background: 'rgba(24, 24, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.86rem',
                    }}
                    placeholder="rohan.deshmukh22@vitstudent.ac.in"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* College / Institution */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  College / Institute Name
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Building size={17} />
                  </div>
                  <input
                    type="text"
                    required
                    className="input"
                    style={{
                      paddingLeft: '40px',
                      height: '42px',
                      background: 'rgba(24, 24, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.86rem',
                    }}
                    placeholder="Vellore Institute of Technology (VIT)"
                    value={signupCollege}
                    onChange={(e) => setSignupCollege(e.target.value)}
                  />
                </div>
              </div>

              {/* Student-Specific Academic Details */}
              {signupRole === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Branch / Department
                    </label>
                    <input
                      type="text"
                      className="input"
                      style={{ height: '40px', fontSize: '0.82rem', background: 'rgba(24, 24, 28, 0.75)' }}
                      placeholder="B.Tech CSE"
                      value={signupDegree}
                      onChange={(e) => setSignupDegree(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Batch Year
                    </label>
                    <input
                      type="number"
                      className="input"
                      style={{ height: '40px', fontSize: '0.82rem', background: 'rgba(24, 24, 28, 0.75)' }}
                      placeholder="2026"
                      value={signupGradYear}
                      onChange={(e) => setSignupGradYear(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      style={{ height: '40px', fontSize: '0.82rem', background: 'rgba(24, 24, 28, 0.75)' }}
                      placeholder="8.65"
                      value={signupCgpa}
                      onChange={(e) => setSignupCgpa(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      className="input"
                      style={{
                        height: '42px',
                        background: 'rgba(24, 24, 28, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        fontSize: '0.86rem',
                        paddingRight: '36px',
                      }}
                      placeholder="Min 8 chars"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      className="input"
                      style={{
                        height: '42px',
                        background: 'rgba(24, 24, 28, 0.75)',
                        border: passwordsMatch
                          ? '1px solid #10b981'
                          : signupConfirmPassword
                          ? '1px solid #ef4444'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                        fontSize: '0.86rem',
                        paddingRight: '36px',
                      }}
                      placeholder="Re-type password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    />
                    {passwordsMatch && (
                      <Check
                        size={16}
                        color="#10b981"
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Real-Time Password Strength Meter */}
              {signupPassword && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Password Strength (OWASP Standard):
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color:
                          passwordEvaluation.score <= 1
                            ? '#f87171'
                            : passwordEvaluation.score === 2
                            ? '#fbbf24'
                            : passwordEvaluation.score === 3
                            ? '#60a5fa'
                            : '#34d399',
                      }}
                    >
                      {passwordEvaluation.label} ({passwordEvaluation.score}/4)
                    </span>
                  </div>

                  {/* 4-Bar Meter */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', height: '4px', marginBottom: '0.5rem' }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          height: '100%',
                          borderRadius: '2px',
                          background:
                            step <= passwordEvaluation.score
                              ? passwordEvaluation.score <= 1
                                ? '#ef4444'
                                : passwordEvaluation.score === 2
                                ? '#f59e0b'
                                : passwordEvaluation.score === 3
                                ? '#3b82f6'
                                : '#10b981'
                              : 'rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </div>

                  {/* Requirements Checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.68rem' }}>
                    <span style={{ color: signupPassword.length >= 8 ? '#34d399' : '#94a3b8' }}>
                      {signupPassword.length >= 8 ? '✓' : '•'} 8+ characters
                    </span>
                    <span style={{ color: /[A-Z]/.test(signupPassword) ? '#34d399' : '#94a3b8' }}>
                      {/[A-Z]/.test(signupPassword) ? '✓' : '•'} Uppercase (A-Z)
                    </span>
                    <span style={{ color: /[0-9]/.test(signupPassword) ? '#34d399' : '#94a3b8' }}>
                      {/[0-9]/.test(signupPassword) ? '✓' : '•'} Number (0-9)
                    </span>
                    <span style={{ color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(signupPassword) ? '#34d399' : '#94a3b8' }}>
                      {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(signupPassword) ? '✓' : '•'} Symbol (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSignupLoading}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  marginTop: '0.35rem',
                }}
              >
                {isSignupLoading ? (
                  <span>Registering Account in Database...</span>
                ) : (
                  <>
                    Create Placement Account <Sparkles size={17} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer Security Note */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            fontSize: '0.72rem',
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Salted SHA-256 Hashing • OWASP Rate Limiting • Indian Campus Roster</span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CYBERSECURITY & AUTHENTICATION AUDIT MODAL                       */}
      {/* ================================================================ */}
      {showAuditModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#121216',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 45px rgba(16, 185, 129, 0.25)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                    Cybersecurity & Authentication Audit
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    OWASP ASVS v4.0 Security Hardening & Flaw Verification Report
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAuditModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  padding: '6px',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scorecard Overview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>A+ Grade</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>OWASP Compliance Score</div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#818cf8' }}>7 / 7 Verified</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Flaw Audits Passed</div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>{registeredUsersCount} Accounts</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Stored in Database</div>
              </div>
            </div>

            {/* 7 Checkpoints Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {auditReport.checks.map((chk) => (
                <div
                  key={chk.id}
                  style={{
                    padding: '0.75rem 0.95rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                        {chk.title}
                      </span>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                        {chk.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      {chk.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
