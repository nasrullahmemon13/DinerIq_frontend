import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Mail, LockKeyhole, Eye, EyeOff, ArrowRight, ShieldCheck, Building2, BarChart3, Store, Database, BrainCircuit, Lightbulb, AlertCircle, Check, LoaderCircle } from 'lucide-react';
import './LoginPage.css';

const QUICK_ROLES = [
  {
    roleId: 'admin',
    title: 'Administrator',
    username: 'admin_user',
    password: 'admin123',
    icon: ShieldCheck,
    color: '#ec4899',
    scope: 'Full system CRUD, Spark jobs & telemetry'
  },
  {
    roleId: 'regional_manager',
    title: 'Regional Manager',
    username: 'regional_mgr',
    password: 'regional123',
    icon: Building2,
    color: '#a855f7',
    scope: 'Multi-location analytics & regional performance'
  },
  {
    roleId: 'manager',
    title: 'Store Manager',
    username: 'store_mgr',
    password: 'manager123',
    icon: Store,
    color: '#0ea5e9',
    scope: 'Shift orders, live inventory & wastage logs'
  },
  {
    roleId: 'analyst',
    title: 'Data Analyst',
    username: 'data_analyst',
    password: 'analyst123',
    icon: BarChart3,
    color: '#10b981',
    scope: 'What-If simulations, ML models & reports'
  }
];

const FEATURES = [
  { icon: Database, title: 'One clear picture', text: 'Connect performance across your locations.' },
  { icon: BrainCircuit, title: 'Plan with confidence', text: 'Forecast demand and reduce food waste.' },
  { icon: UtensilsCrossed, title: 'Know what matters', text: 'Understand your menu and your customers.' },
  { icon: Lightbulb, title: 'Make your next move', text: 'Turn everyday insights into better decisions.' }
];

export default function LoginPage() {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [usernameOrEmail, setUsernameOrEmail] = useState(() => { try { return localStorage.getItem('dineiq-remembered-username') || 'admin_user'; } catch { return 'admin_user'; } });
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuickRole, setActiveQuickRole] = useState('admin');
  const [showRecovery, setShowRecovery] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';
  const handleQuickRoleSelect = role => {
    setActiveQuickRole(role.roleId); setUsernameOrEmail(role.username); setPassword(role.password); setAuthError(null);
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await login(usernameOrEmail.trim(), password);
      if (result.success) {
        try { if (rememberMe) localStorage.setItem('dineiq-remembered-username', usernameOrEmail.trim()); else localStorage.removeItem('dineiq-remembered-username'); } catch {                            }
        navigate(from, { replace: true });
      }
    } finally { setIsSubmitting(false); }
  };
  return <main className="login-page">
    <section className="login-story" aria-label="About DineIQ Analytics">
      <div className="login-brand"><span className="login-brand-icon"><UtensilsCrossed size={25} /></span><div>DineIQ<span className="login-brand-secondary">Analytics</span><small>RESTAURANT INTELLIGENCE</small></div></div>
      <div className="login-story-content">
        <div className="login-eyebrow"><span /> INSIGHTS THAT MAKE A DIFFERENCE</div>
        <h1>Great hospitality.<br /><em>Smarter decisions.</em></h1>
        <p className="login-story-lead">Your restaurant data, brought together. Discover what’s working, see what’s next, and grow with confidence.</p>
        <div className="login-features">{FEATURES.map(({ icon: Icon, title, text }) => <div className="login-feature" key={title}><span><Icon size={20} strokeWidth={1.7} /></span><h3>{title}</h3><p>{text}</p></div>)}</div>
      </div>
      <footer className="login-story-footer"><span>Built for the people behind every great restaurant.</span><span>© {new Date().getFullYear()} DineIQ Analytics</span></footer>
    </section>
    <section className="login-form-panel" aria-label="Sign in">
      <Link to="/" className="login-home-link">← Back to home</Link>
      <div className="login-top-note"><ShieldCheck size={15} /> YOUR RESTAURANT. YOUR INTELLIGENCE.</div>
      <div className="login-form-card">
        <div className="login-form-heading"><span className="login-section-label">YOUR WORKSPACE AWAITS</span><h2>Welcome back.</h2><p>Sign in to see the bigger picture.</p></div>
        {authError && <div className="login-message login-error" role="alert"><AlertCircle size={18} /><span>{authError}</span></div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-username">Email or username</label>
          <div className="login-input-wrap"><Mail size={18} /><input id="login-username" autoComplete="username" required value={usernameOrEmail} placeholder="you@restaurant.com" onChange={e => { setUsernameOrEmail(e.target.value); setActiveQuickRole(null); }} /></div>
          <label htmlFor="login-password">Password</label>
          <div className="login-input-wrap"><LockKeyhole size={18} /><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} placeholder="Enter your password" onChange={e => { setPassword(e.target.value); setActiveQuickRole(null); }} /><button type="button" className="login-password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          <div className="login-form-options"><label className="login-remember"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />Remember username</label><button type="button" className="login-text-button" aria-expanded={showRecovery} onClick={() => setShowRecovery(!showRecovery)}>Forgot password?</button></div>
          {showRecovery && <div className="login-message" role="status">Contact your restaurant’s administrator to reset your password. For a demo account, select a role below to restore its sign-in details.</div>}
          <button className="login-submit" disabled={isSubmitting} type="submit"><span>{isSubmitting ? 'Signing in…' : 'Sign in to workspace'}</span>{isSubmitting ? <LoaderCircle className="login-spinner" size={18} /> : <ArrowRight size={18} />}</button>
        </form>
        <div className="login-demo-divider"><span />EXPLORE THE PLATFORM<span /></div>
        <div className="login-demo-heading"><h3>Take a look around</h3><span>DEMO ACCESS</span></div>
        <p className="login-demo-copy">Choose a role, then sign in to explore.</p>
        <div className="login-roles">{QUICK_ROLES.map(role => <button key={role.roleId} type="button" className={`login-role ${activeQuickRole === role.roleId ? 'is-selected' : ''}`} aria-pressed={activeQuickRole === role.roleId} title={role.scope} disabled={isSubmitting} onClick={() => handleQuickRoleSelect(role)}><role.icon size={18} strokeWidth={1.7} /><span>{role.title}</span>{activeQuickRole === role.roleId && <Check size={14} />}</button>)}</div>
        <p className="login-register">New to DineIQ? <Link to="/register">Create an account <ArrowRight size={13} /></Link></p>
      </div>
      <footer className="login-form-footer"><LockKeyhole size={13} /> Role-based access to your restaurant workspace</footer>
    </section>
  </main>;
}
