// src/components/AuthForm.tsx

import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from '@tanstack/react-router';
import {
  LogIn,
  UserPlus,
  ShieldAlert,
  Trophy,
  
  Building2,
  GraduationCap,
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
        },
      );

     window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.message || 'Unable to continue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);

    navigate({
      to: isLogin ? '/signup' : '/login',
    });
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT SIDE */}
      <div className="brand-panel">

        <div>
          <span className="editorial-label">
            TALENT GRIND • RANKED CHALLENGES
          </span>

          <h1 className="brand-title">
            Talent
            <br />
            <span className="accent-text">Grind</span>
          </h1>

          <p className="brand-subtitle">
            Compete in elite quiz battles, climb leaderboards,
            and prove your knowledge dominance.
          </p>
        </div>

        <div className="brand-stats">

          <div className="stat-card">
            <Trophy size={16} />
            <span>Global Ranked Arena</span>
          </div>

          <div className="stat-card">
            <Building2 size={16} />
            <span>Industry Skill Challenges</span>
          </div>

          <div className="stat-card">
            <GraduationCap size={16} />
            <span>College Competition Grid</span>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="form-panel">

        <div className="form-header">
          <span className="editorial-label">
            {isLogin
              ? 'ACCESS PORTAL'
              : step === 1
              ? 'CREATE ACCOUNT'
              : 'CHALLENGER PROFILE'}
          </span>

          <h2>
            {isLogin
              ? 'Enter the Arena'
              : step === 1
              ? 'Become a Challenger'
              : 'Complete Your Identity'}
          </h2>

          <p>
            {isLogin
              ? 'Continue your ranked journey.'
              : step === 1
              ? 'Create your account to start competing.'
              : 'Tell the arena who you are.'}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* LOGIN */}
          {isLogin && (
            <>
              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* SIGNUP STEP 1 */}
          {!isLogin && step === 1 && (
            <>
              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  className="input-field"
                  placeholder="challenger@talentgrind.dev"
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
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* SIGNUP STEP 2 */}
          {!isLogin && step === 2 && (
            <div className="profile-grid">

              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Role</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Backend Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Company</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Current Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>College</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Your College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Country</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>State</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Uttar Pradesh"
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
                  placeholder="Lucknow"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>GitHub</label>

                <input
                  type="text"
                  className="input-field"
                  placeholder="github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>LinkedIn</label>

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
              'Processing...'
            ) : isLogin ? (
              <>
                <span>Enter Arena</span>
                <LogIn size={16} />
              </>
            ) : step === 1 ? (
              <>
                <span>Continue</span>
                <UserPlus size={16} />
              </>
            ) : (
              <>
                <span>Join Talent Grind</span>
                <Trophy size={16} />
              </>
            )}
          </button>

        </form>

        <div className="toggle-section">
          <p>
            {isLogin
              ? 'New challenger?'
              : 'Already competing?'}

            <button
              type="button"
              className="toggle-btn"
              onClick={toggleMode}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>

      </div>

      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
        }

        .brand-panel {
          flex: 1.1;
          padding: 4rem;
          border-right: 1px solid var(--border-default);
          background:
            radial-gradient(circle at top left,
            rgba(45,212,168,0.12),
            transparent 35%),
            linear-gradient(
              135deg,
              var(--bg-surface),
              #091a14
            );

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-title {
          font-size: clamp(4rem, 8vw, 6rem);
          line-height: 0.9;
          margin-top: 2rem;
        }

        .accent-text {
          color: var(--accent);
          font-style: italic;
        }

        .brand-subtitle {
          margin-top: 1.5rem;
          max-width: 480px;
          line-height: 1.8;
          color: var(--text-muted);
        }

        .brand-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.2rem;
          border-radius: 1rem;
          border: 1px solid var(--border-default);
          background: rgba(255,255,255,0.02);
          color: var(--text-secondary);
        }

        .form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem;
          max-width: 760px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header h2 {
          font-size: 2.5rem;
          margin-top: 0.75rem;
        }

        .form-header p {
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 1rem;
        }

        .input-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 1rem;
          border: 1px solid var(--border-active);
          background: rgba(45,212,168,0.08);
        }

        .btn-primary {
          width: 100%;
          margin-top: 1rem;
        }

        .toggle-section {
          margin-top: 2rem;
          text-align: center;
          color: var(--text-muted);
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--accent);
          margin-left: 0.5rem;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 992px) {
          .auth-wrapper {
            flex-direction: column;
          }

          .brand-panel {
            padding: 2.5rem;
          }

          .form-panel {
            padding: 2rem;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthForm;