import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppIcon from '../components/AppIcon';
import './RegisterPage.css';
import {
  UtensilsCrossed,
  User,
  Mail,
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
  Database,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('analyst');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          email: email.trim(),
          full_name: fullName.trim(),
          password: password,
          role_id: role
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed. Please try again.');
      }

      setSuccessMsg('Account created. The user can sign in with their credentials.');
    } catch (err) {
      setErrorMsg(err.message || 'Unable to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role_id !== 'admin') return <main className="register-request"><h1>Request an account</h1><p>An administrator must create your account and assign access.</p><Link to="/login">Return to sign in</Link></main>;

  return (
    <div className="register-page" style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app, #07111f)',
      color: 'var(--text-primary, #f8fafc)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {                                                                    }
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 60px',
        backgroundImage: 'linear-gradient(rgba(7, 17, 31, 0.75), rgba(7, 17, 31, 0.9)), url(/images/auth_register_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRight: '1px solid var(--border, #1e3048)'
      }}>
        {                  }
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
            }}>
              <AppIcon icon={UtensilsCrossed} size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                DineIQ <span style={{ color: 'var(--primary, #168cff)' }}>Analytics</span>
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
                Restaurant Intelligence Platform
              </p>
            </div>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '16px', maxWidth: '440px', lineHeight: 1.5 }}>
            Transforming Restaurant Data into Smarter Decisions
          </p>
        </div>

        {                               }
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px', margin: '30px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(13, 26, 43, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(22, 140, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AppIcon icon={Database} size={20} tone="primary" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Data-Driven Insights</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Real-time analytics across all locations</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(13, 26, 43, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AppIcon icon={BrainCircuit} size={20} tone="model" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>AI-Powered Predictions</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Forecast demand, reduce wastage</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(13, 26, 43, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AppIcon icon={UtensilsCrossed} size={20} tone="success" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Menu & Customer Intelligence</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Understand what drives your business</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(13, 26, 43, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AppIcon icon={Lightbulb} size={20} tone="warning" />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Actionable Recommendations</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Turn insights into profit</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          &copy; 2026 DineIQ Analytics Inc. Enterprise Hospitality Platform.
        </div>
      </div>

      {                                                                    }
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: 'var(--surface, #0d1a2b)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--surface-elevated, #13243a)',
          border: '1px solid var(--border, #1e3048)',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: 'var(--card-shadow, 0 8px 30px rgba(0,0,0,0.35))'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Join DineIQ Analytics today
            </p>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'var(--danger-tint, rgba(239, 68, 68, 0.1))',
              border: '1px solid var(--danger, #ef4444)',
              borderRadius: '8px',
              marginBottom: '18px',
              color: 'var(--danger, #ef4444)',
              fontSize: '0.82rem'
            }}>
              <AppIcon icon={AlertCircle} size={16} tone="danger" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'var(--success-tint, rgba(16, 185, 129, 0.1))',
              border: '1px solid var(--success, #10b981)',
              borderRadius: '8px',
              marginBottom: '18px',
              color: 'var(--success, #10b981)',
              fontSize: '0.82rem'
            }}>
              <AppIcon icon={CheckCircle2} size={16} tone="success" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {               }
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <AppIcon icon={User} size={16} tone="muted" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {                   }
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <AppIcon icon={Mail} size={16} tone="muted" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {                    }
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              >
                <option value="analyst">Data Analyst (What-If, ML Models, Reports)</option>
                <option value="manager">Store Manager (Shift Orders, Live Inventory, Wastage)</option>
                <option value="regional_manager">Regional Manager (Multi-Location Intelligence)</option>
              </select>
            </div>

            {              }
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <AppIcon icon={LockKeyhole} size={16} tone="muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <AppIcon icon={showPassword ? EyeOff : Eye} size={16} />
                </button>
              </div>
            </div>

            {                      }
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <AppIcon icon={ShieldCheck} size={16} tone="muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {                   }
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary, #168cff)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--primary-glow)',
                transition: 'opacity 0.2s ease',
                marginTop: '6px'
              }}
            >
              <AppIcon icon={UserPlus} size={16} color="#ffffff" />
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          {                  }
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary, #168cff)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
