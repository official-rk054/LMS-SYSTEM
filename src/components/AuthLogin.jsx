import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  KeyRound,
  AlertCircle,
  ArrowRight,
  School,
  CheckCircle2
} from 'lucide-react';
import { USERS_PROFILES } from '../data/mockData';
import { apiService } from '../services/apiService';

export const AuthLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick One-Click Demo Helper
  const handleQuickDemo = (profile) => {
    setEmail(profile.email);
    setPassword('PlaceIQ@2026Secure');
    setErrorMessage('');
  };

  // Handle Form Submission with Smart Role Detection
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your institutional email address or ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Auto-detect role based on input email or dataset match
    const lowerEmail = email.toLowerCase().trim();
    let detectedRole = 'student';

    if (lowerEmail.includes('tpo') || lowerEmail.includes('director') || lowerEmail.includes('admin')) {
      detectedRole = 'admin';
    } else if (lowerEmail.includes('rajesh') || lowerEmail.includes('prof') || (lowerEmail.endsWith('@vit.ac.in') && !lowerEmail.includes('student'))) {
      detectedRole = 'trainer';
    } else {
      detectedRole = 'student';
    }

    // Try backend API login first
    const apiRes = await apiService.login(email, password, detectedRole);

    setTimeout(() => {
      setIsLoading(false);

      if (apiRes && apiRes.success && apiRes.user) {
        onLogin(apiRes.user);
      } else {
        // Fallback to local mock database match
        const matchedUser = USERS_PROFILES.find(
          (u) => u.email.toLowerCase() === lowerEmail
        ) || USERS_PROFILES.find((u) => u.role === detectedRole) || USERS_PROFILES[0];

        onLogin(matchedUser);
      }
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.03), transparent 50%), var(--bg-app)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Blur Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180, 180, 200, 0.025) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '0',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'rgba(18, 18, 22, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        }}
        className="auth-container-grid"
      >
        {/* Left Side: Brand Showcase & Auto-Detection Credentials */}
        <div
          style={{
            padding: '2.75rem 2.5rem',
            background: 'linear-gradient(145deg, rgba(24, 24, 28, 0.95) 0%, rgba(14, 14, 17, 0.98) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #71717a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
                }}
              >
                <GraduationCap size={24} color="#09090b" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
                  Place<span style={{ color: 'var(--text-muted)' }}>IQ</span>
                </h1>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Campus-to-Career LMS Security Auth
                </span>
              </div>
            </div>

            {/* Portal Info Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={18} color="#818cf8" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Unified Security Portal
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-bright)', marginBottom: '0.3rem' }}>
                One Login for All Roles
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                Enter your registered email to automatically log into your <strong>Student</strong>, <strong>Mentor</strong>, or <strong>Admin TPO</strong> dashboard.
              </p>
            </div>

            {/* One-Click Quick Demo Accounts */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                ⚡ Quick Demo Credentials
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemo(USERS_PROFILES[0])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={15} color="#818cf8" />
                    <span>Aarav Sharma (Student)</span>
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo(USERS_PROFILES[1])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <School size={15} color="#22d3ee" />
                    <span>Prof. Rajesh K. (Mentor)</span>
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Mentor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo(USERS_PROFILES[2])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={15} color="#c084fc" />
                    <span>Dr. Meenakshi (Admin TPO)</span>
                  </span>
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Admin TPO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Badge Footer */}
          <div
            style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
            }}
          >
            <ShieldCheck size={15} color="var(--success)" />
            <span>256-bit SSL Security • Auto Role Authenticator</span>
          </div>
        </div>

        {/* Right Side: Single Unified Login Form */}
        <div style={{ padding: '2.75rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.55rem', color: 'var(--text-bright)', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>
              Sign in to PlaceIQ
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(251, 113, 133, 0.15)',
                border: '1px solid rgba(251, 113, 133, 0.4)',
                borderRadius: 'var(--radius-md)',
                color: '#fda4af',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.2rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Single Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email / ID Input */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Institutional Email / User ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  color="var(--text-dim)"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
                  placeholder="aarav.sharma22@vitstudent.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Password</label>
                <button
                  type="button"
                  onClick={() => alert('Password reset verification link has been sent to your registered institutional email!')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.76rem', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  color="var(--text-dim)"
                  style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontSize: '0.88rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Keep me logged in</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={enable2FA}
                    onChange={(e) => setEnable2FA(e.target.checked)}
                    style={{ accentColor: 'var(--secondary)' }}
                  />
                  <span>Enable 2FA Code</span>
                </label>
              </div>

              {enable2FA && (
                <div style={{ marginTop: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                    2FA Security Code (6-Digit OTP)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound
                      size={16}
                      color="var(--text-dim)"
                      style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                      type="text"
                      className="input"
                      style={{ paddingLeft: '2.5rem', fontSize: '0.85rem', letterSpacing: '0.2em' }}
                      placeholder="849201"
                      value={twoFactorOtp}
                      onChange={(e) => setTwoFactorOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Single Unified Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                marginTop: '0.5rem',
                padding: '0.8rem 1.5rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 100%)',
                color: '#09090b',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              {isLoading ? (
                <span>Authenticating & Detecting Role...</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Sign In & Access Dashboard</span>
                  <ArrowRight size={17} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
