// src/components/AuthForm.tsx

import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from '@tanstack/react-router';
import {
  LogIn,
  
  ShieldAlert,
  Trophy,
  Terminal,
  Zap,
  Target,
  ChevronRight,
  ArrowLeft,
  Cpu,
  Layers,
  Container,
  Activity
} from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // profile
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [college, setCollege] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);

      if (isLogin) {
        await signIn(email, password);
        window.location.href = '/dashboard';
        return;
      }

      // signup step flow
      if (step === 1) {
        setStep(2);
        return;
      }

      await signUp({
        email,
        password,
        name,
        role,
        company,
        college,
        country,
        state,
        city,
        github,
        linkedin,
      });

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setStep(1);
    navigate({
      to: isLogin ? '/signup' : '/login',
    });
  };

  return (
    <div className="auth-wrapper">
      {/* LEFT SIDE: INFORMATION PANEL */}
      <div className="brand-panel">
        <div className="brand-top">
          <div className="logo-badge">
            <Terminal size={14} className="terminal-icon" />
            <span>PRACTICE ARENA PROTOCOL</span>
          </div>

          <h1 className="brand-title">
            Talent
            <br />
            <span className="accent-text">Grind</span>
          </h1>

          <p className="brand-subtitle">
            The coding arena for modern tech professionals. Choose your track, practice complex real-world challenges, and test your skills under pressure.
          </p>
        </div>

        {/* TECH TRACKS DISPLAY */}
        <div className="discipline-grid">
          <div className="class-tag"><Layers size={13} /> Frontend Arch</div>
          <div className="class-tag"><Container size={13} /> DevOps / SRE</div>
          <div className="class-tag"><Cpu size={13} /> Data Science / ML</div>
          <div className="class-tag"><Activity size={13} /> QA Automation</div>
        </div>

        <div className="brand-stats">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Trophy size={14} />
            </div>
            <div className="stat-info">
              <h4>Coding Challenges</h4>
              <p>Solve tricky bugs, optimization problems, and architecture flaws.</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Target size={14} />
            </div>
            <div className="stat-info">
              <h4>Real Production Testing</h4>
              <p>Test assertions, scaling setups, and layout rendering instantly.</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Zap size={14} />
            </div>
            <div className="stat-info">
              <h4>Global Leaderboard</h4>
              <p>Rank up against peers and showcase your production-ready skills.</p>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <span>SYSTEM STATUS: ONLINE // VERSION 2.26</span>
        </div>
      </div>

      {/* RIGHT SIDE: INPUT INTERFACE PANEL */}
      <div className="form-panel">
        <div className="form-container">
          
          {/* Back Button for Step 2 */}
          {!isLogin && step === 2 && (
            <button type="button" className="back-step-btn" onClick={() => setStep(1)}>
              <ArrowLeft size={14} /> Go Back to Account Details
            </button>
          )}

          <div className="form-header">
            <span className="editorial-label">
              {isLogin
                ? 'SECURE LOGIN Portal'
                : step === 1
                ? 'STEP 01: CREATE ACCOUNT'
                : 'STEP 02: PROFILE SETUP'}
            </span>

            <h2>
              {isLogin
                ? 'Welcome Back'
                : step === 1
                ? 'Get Started'
                : 'Select Your Track'}
            </h2>

            <p>
              {isLogin
                ? 'Enter your credentials below to access your sandbox coding workspace.'
                : step === 1
                ? 'Create an account to join specific test lobbies and track your progress.'
                : 'Choose your tech field to get challenges matched to your career path.'}
            </p>
          </div>

          {/* Clean Progress Stepper */}
          {!isLogin && (
            <div className="step-indicator-bar">
              <div className={`step-dot ${step >= 1 ? 'active' : ''}`}><span>01 ACCOUNT DETAILS</span></div>
              <div className="step-line-connect"><div className={`step-line-fill ${step === 2 ? 'filled' : ''}`}></div></div>
              <div className={`step-dot ${step === 2 ? 'active' : ''}`}><span>02 PROFESSION SPECS</span></div>
            </div>
          )}

          {error && (
            <div className="auth-error">
              <ShieldAlert size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="actual-form">
            {/* LOGIN INPUTS */}
            {isLogin && (
              <div className="fields-stack">
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* SIGNUP STEP 1 */}
            {!isLogin && step === 1 && (
              <div className="fields-stack">
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Create Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* SIGNUP STEP 2 */}
            {!isLogin && step === 2 && (
              <div className="profile-grid">
                <div className="input-group full-width-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group full-width-field">
                  <label>Your Role / Specialization</label>
                  <select 
                    className="input-field select-override"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled style={{color: 'var(--text-muted)'}}>Choose your profile type...</option>
                    <option value="Frontend Developer">Frontend Architect</option>
                    <option value="DevOps Engineer">DevOps Guardian </option>
                    <option value="Data Scientist / ML Practitioner">Data Scientist / ML Practitioner </option>
                    <option value="QA Automation Engineer">QA Automation Engineer </option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Company / Organization</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Current company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>University / College</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Education history"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Country</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>State / Region</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., California"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>GitHub Profile Link</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>

                <div className="input-group full-width-field">
                  <label>LinkedIn Profile Link</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="pulse-text">Signing In...</span>
              ) : isLogin ? (
                <>
                  <span>LOGIN TO WORKSPACE</span>
                  <LogIn size={16} />
                </>
              ) : step === 1 ? (
                <>
                  <span>CONTINUE TO SETUP</span>
                  <ChevronRight size={16} />
                </>
              ) : (
                <>
                  <span>COMPLETE ACCOUNT REGISTRATION</span>
                  <Trophy size={16} />
                </>
              )}
            </button>
          </form>

          <div className="toggle-section">
            <p>
              {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
              <button
                type="button"
                className="toggle-btn"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign Up Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --bg-primary: #040907;
          --bg-surface: #0a130f;
          --bg-surface-glow: #0d2019;
          --accent: #2dd4a8;
          --accent-glow: rgba(45, 212, 168, 0.25);
          --accent-dim: #135745;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --text-muted: #64748b;
          --border-default: #122a21;
          --border-active: #2dd4a8;
          --error-neon: #ff4d4d;
          --error-bg: rgba(255, 77, 77, 0.07);
          --panel-width-max: 620px;
        }

        .auth-wrapper {
          height: 100vh;
          max-height: 100vh;
          display: flex;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          overflow: hidden;
        }

        /* --- LEFT HUD PANEL --- */
        .brand-panel {
          flex: 1;
          padding: 3.5vh 3vw;
          border-right: 1px solid var(--border-default);
          background:
            radial-gradient(circle at 0% 0%, rgba(45, 212, 168, 0.15), transparent 50%),
            radial-gradient(circle at 100% 100%, #03140e, transparent 70%),
            var(--bg-surface);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .brand-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: linear-gradient(rgba(45, 212, 168, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(45, 212, 168, 0.015) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(45, 212, 168, 0.05);
          border: 1px solid var(--border-default);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          color: var(--accent);
          font-weight: 700;
        }

        .terminal-icon {
          animation: terminalBlink 1.8s infinite steps(2);
        }

        .brand-title {
          font-size: clamp(2.8rem, 4.5vw, 4.2rem);
          line-height: 0.85;
          margin-top: 1.5vh;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-transform: uppercase;
        }

        .accent-text {
          color: var(--accent);
          font-style: italic;
          text-shadow: 0 0 40px var(--accent-glow);
        }

        .brand-subtitle {
          margin-top: 1vh;
          max-width: 460px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .discipline-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin: 2vh 0;
          max-width: 460px;
          flex-shrink: 0;
        }

        .class-tag {
          background: rgba(18, 42, 33, 0.3);
          border: 1px solid var(--border-default);
          padding: 0.5rem 0.7rem;
          border-radius: 4px;
          font-size: 0.72rem;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 600;
        }

        .brand-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2vh;
          overflow: hidden;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem;
          border-radius: 6px;
          border: 1px solid var(--border-default);
          background: rgba(4, 9, 7, 0.4);
          backdrop-filter: blur(4px);
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: rgba(45, 212, 168, 0.06);
          color: var(--accent);
          border: 1px solid rgba(45, 212, 168, 0.12);
          flex-shrink: 0;
        }

        .stat-info h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
        }

        .stat-info p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0.1rem 0 0 0;
          line-height: 1.3;
        }

        .brand-footer {
          font-size: 0.65rem;
          color: var(--accent-dim);
          letter-spacing: 0.2em;
          flex-shrink: 0;
        }

        /* --- IMMACULATE AUTO-SCROLL INPUT INTERFACE PANEL --- */
        .form-panel {
          flex: 1;
          display: block;                  
          padding: 4vh 3vw;                
          background: var(--bg-primary);
          overflow-y: auto;                
          height: 100%;
        }

        .form-container {
          width: 100%;
          max-width: var(--panel-width-max);
          margin: 0 auto;                  
        }

        .back-step-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
          margin-bottom: 1rem;
          font-family: inherit;
        }

        .back-step-btn:hover {
          color: var(--accent);
        }

        .form-header h2 {
          font-size: clamp(1.75rem, 3vw, 2.1rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 0.3rem;
          color: #ffffff;
        }

        .form-header p {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-top: 0.3rem;
          line-height: 1.45;
        }

        .step-indicator-bar {
          display: flex;
          align-items: center;
          margin: 2vh 0;
          background: rgba(18, 42, 33, 0.2);
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          border: 1px solid var(--border-default);
        }

        .step-dot {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .step-dot.active {
          color: var(--accent);
        }

        .step-line-connect {
          flex: 1;
          height: 1px;
          background: var(--border-default);
          margin: 0 0.8rem;
          position: relative;
        }

        .step-line-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 0%;
          background: var(--accent);
          transition: width 0.25s ease;
        }

        .step-line-fill.filled {
          width: 100%;
        }

        .actual-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fields-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem 1rem;
        }

        .full-width-field {
          grid-column: span 2;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .input-group label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .input-field {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          padding: 0.75rem 0.9rem;
          border-radius: 4px;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--border-active);
          background: var(--bg-surface-glow);
        }

        .select-override {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232dd4a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .select-override option {
          background: var(--bg-surface);
          color: #ffffff;
        }

        .input-field::placeholder {
          color: rgba(148, 163, 184, 0.25);
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem;
          border-radius: 4px;
          border: 1px solid var(--error-neon);
          background: var(--error-bg);
          color: #ffffff;
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
        }

        .error-icon {
          color: var(--error-neon);
          flex-shrink: 0;
        }

        .btn-primary {
          width: 100%;
          background: var(--accent);
          color: #030806;
          border: none;
          padding: 0.85rem;
          border-radius: 4px;
          font-family: inherit;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #ffffff;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          background: var(--border-default);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .pulse-text {
          animation: textPulse 2s infinite ease-in-out;
        }

        .toggle-section {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--accent);
          margin-left: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          font-family: inherit;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @keyframes terminalBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        @keyframes textPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* --- RESPONSIVE GRIDS & RE-FLOW --- */
        @media (max-width: 1150px) {
          .auth-wrapper {
            flex-direction: column;
            overflow-y: auto;
            height: auto;
            max-height: none;
          }

          .brand-panel {
            flex: none;
            padding: 4rem 2.5rem 2rem 2.5rem;
            border-right: none;
            border-bottom: 1px solid var(--border-default);
          }

          .discipline-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 100%;
          }

          .brand-stats {
            margin: 1.5rem 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }

          .form-panel {
            padding: 3.5rem 2.5rem;
            overflow-y: visible;
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .discipline-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .full-width-field {
            grid-column: span 1;
          }
          .brand-panel {
            padding: 3rem 1.5rem 1.5rem 1.5rem;
          }
          .form-panel {
            padding: 3rem 1.5rem;
          }
          .brand-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthForm;