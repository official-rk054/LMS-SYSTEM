import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { authenticateUser } from '../services/authDatabase';

export const LoginPage = ({ onLoginSuccess, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message);
        setIsLoading(false);
      }
    }, 400);
  };

  // Quick 1-click demo credential fillers
  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
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
        background: '#070b14',
        padding: '1.5rem',
      }}
    >
      {/* Background Floating Ambient Glow Orbs for Glassmorphism */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0) 70%)',
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '30%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphic Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '2.75rem 2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 45px rgba(99, 102, 241, 0.25)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
            }}
          >
            <GraduationCap size={32} color="#ffffff" />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem',
            }}
          >
            Place<span style={{ color: '#06b6d4' }}>IQ</span>
          </h1>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.4' }}>
            Campus-to-Career Placement LMS
            <br />
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Sign in with your institutional credentials to enter your portal
            </span>
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
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
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form: Strictly Email and Password fields */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '0.45rem',
              }}
            >
              Institutional Email
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="input"
                style={{
                  paddingLeft: '42px',
                  height: '46px',
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.9rem',
                }}
                placeholder="name@vit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '0.45rem',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input"
                style={{
                  paddingLeft: '42px',
                  paddingRight: '42px',
                  height: '46px',
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.9rem',
                }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              height: '48px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              border: 'none',
              marginTop: '0.5rem',
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                Sign In to Portal <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts Quick Filler */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Demo Logins (1-Click Fill)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Password: password123</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillCredentials('student@vit.ac.in', 'password123')}
              className="btn btn-outline btn-sm"
              style={{
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8' }}>🎓</span>
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
                padding: '0.5rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#34d399' }}>👨‍🏫</span>
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
                padding: '0.5rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24' }}>🏛️</span>
                <strong>TPO Admin Portal:</strong> Dr. Meenakshi Ramanathan
              </span>
              <span style={{ color: '#fbbf24', fontSize: '0.72rem' }}>admin@vit.ac.in</span>
            </button>
          </div>
        </div>

        {/* Footer Security Note */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Role-Based Institutional Access Control • VIT Placement Cell</span>
        </div>
      </div>
    </div>
  );
};
