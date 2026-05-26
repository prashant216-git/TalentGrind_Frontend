// src/components/NavBar.tsx

import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { LogOut, LayoutDashboard, Trophy, UserCircle, Cpu } from 'lucide-react';

const NavBar: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate({ to: '/login', replace: true });
  };

  const getLinkProps = () => ({
    style: { color: 'var(--text-primary)', textShadow: 'var(--shadow-glow)', borderBottomColor: 'var(--accent)' },
    className: 'active'
  });

  return (
    <header className="sticky-nav">
      <div className="nav-container">
        {/* Brand/Logo */}
        <Link to="/dashboard" className="nav-brand">
          <Cpu className="brand-icon" size={20} />
          <span>
            Talent<span style={{ fontStyle: 'italic', fontWeight: '400', color: 'var(--accent)' }}>Grind</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="nav-links">
          <Link 
            to="/dashboard" 
            activeProps={getLinkProps()}
            className="nav-link"
          >
            <LayoutDashboard size={15} />
            <span>Grid</span>
          </Link>
          <Link 
            to="/leaderboard" 
            activeProps={getLinkProps()}
            className="nav-link"
          >
            <Trophy size={15} />
            <span>Leaderboard</span>
          </Link>
          <Link 
            to="/profile" 
            activeProps={getLinkProps()}
            className="nav-link"
          >
            <UserCircle size={15} />
            <span>Profile</span>
          </Link>
        </nav>

        {/* User Info / Action */}
        <div className="nav-actions">
          {user && (
            <div className="user-indicator mono-stat">
              {user.username}
            </div>
          )}
          <button onClick={handleSignOut} className="btn-signout" title="Terminate Session">
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 600 }}>DISCONNECT</span>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13, 27, 42, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-default);
          transition: var(--transition-smooth);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          color: var(--text-primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          letter-spacing: 0.02em;
          transition: var(--transition-smooth);
        }

        .nav-brand:hover {
          filter: drop-shadow(0 0 6px var(--text-primary));
        }

        .brand-icon {
          color: var(--accent);
          animation: pulse-glow 2s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 1px var(--accent)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 6px var(--accent)); transform: scale(1.05); }
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-decoration: none;
          padding: 0.5rem 0.25rem;
          border-bottom: 2px solid transparent;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link.active {
          color: var(--text-primary) !important;
          border-bottom-color: var(--accent) !important;
          text-shadow: var(--shadow-glow);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-indicator {
          font-size: 0.8rem;
          color: var(--text-muted);
          border-right: 1px solid var(--border-default);
          padding-right: 1.25rem;
        }

        .btn-signout {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-fast);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
        }

        .btn-signout:hover {
          color: var(--accent);
          background: rgba(115, 255, 184, 0.05);
          filter: drop-shadow(0 0 4px var(--accent));
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 1rem;
          }
          .nav-links {
            gap: 0.75rem;
          }
          .nav-link span {
            display: none;
          }
          .user-indicator {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default NavBar;
