// src/routes/_authenticated/dashboard.tsx

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import QuizCard from '../../components/QuizCard';
import {
  Terminal,
  Shield,
  Award,
  AlertTriangle,
  Activity,
  Cpu,
  Layers,
} from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/dashboard'
)({
  component: DashboardComponent,
});

/* =========================
   TYPES
========================= */

interface Quiz {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: string;
  questionsCount: number;
  status: string;
  highScore?: number;
  attempted: boolean;
}

/* =========================
   COMPONENT
========================= */

function DashboardComponent() {
  const {
    data: quizzes,
    isLoading,
    isError,
    error,
  } = useQuery<Quiz[]>({
    queryKey: [
      'quiz',
      'dashboard',
    ],
    queryFn: () =>
      apiFetch<Quiz[]>(
        'quiz/dashboard'
      ),
  });

  /* =========================
     STATS
  ========================= */

  const totalQuizzes = quizzes?.length || 0;

  const attemptedQuizzes = quizzes?.filter(
    (q) => q.attempted
  ).length || 0;

  const quizzesWithScores = quizzes?.filter((q) => q.highScore !== undefined) || [];

  const averageScore = quizzesWithScores.length > 0
    ? Math.round(
        quizzesWithScores.reduce((acc, q) => acc + (q.highScore || 0), 0) / quizzesWithScores.length
      )
    : 0;

  /* =========================
     UI
  ========================= */

  return (
    <div className="page-container system-matrix-layout">
      {/* =========================
          CONTROL DECK HEADER
      ========================= */}

      <header className="control-deck-header">
        <div className="header-identity">
          <div className="status-indicator-row">
            <span className="live-pulse-dot" />
            <span className="editorial-label code-mono">
              COMPETITIVE STAGE ACTIVE // SECURE_NODE_LOC
            </span>
          </div>

          <h1 className="terminal-title">
            System{' '}
            <span className="accent-italic">
              Dashboard
            </span>
          </h1>

          <p className="terminal-subtitle">
            Connect to active challenge nodes, solve secure multi-select structures, and verify computational priority.
          </p>
        </div>

        {/* =========================
            TELEMETRY METRICS CONTAINER
        ========================= */}

        <div className="telemetry-grid">
          <div className="metric-panel">
            <div className="panel-corner-tag"><Layers size={10} /></div>
            <span className="editorial-label panel-title">TOTAL QUIZZES</span>
            <div className="matrix-counter">{totalQuizzes}</div>
            <div className="panel-scanline" />
          </div>

          <div className="metric-panel accent-panel">
            <div className="panel-corner-tag"><Cpu size={10} /></div>
            <span className="editorial-label panel-title">ATTEMPTED</span>
            <div className="matrix-counter dynamic-color">{attemptedQuizzes}</div>
            <div className="panel-scanline" />
          </div>

          <div className="metric-panel">
            <div className="panel-corner-tag"><Activity size={10} /></div>
            <span className="editorial-label panel-title">AVG SCORE</span>
            <div className="matrix-counter">{averageScore}<span className="percent-mark">%</span></div>
            <div className="panel-scanline" />
          </div>
        </div>
      </header>

      {/* =========================
          MAIN TERMINAL VIEWPORT
      ========================= */}

      <main className="terminal-viewport">
        {isLoading ? (
          <div className="quiz-grid">
            <div className="skeleton skeleton-card matrix-loader" />
            <div className="skeleton skeleton-card matrix-loader" />
            <div className="skeleton skeleton-card matrix-loader" />
          </div>
        ) : isError ? (
          /* =========================
              ERROR LAYER
          ========================= */
          <div className="error-panel terminal-alert-frame">
            <div className="corner-brackets" />
            <AlertTriangle
              size={40}
              className="alert-icon-glow"
              style={{ color: 'var(--accent)' }}
            />
            <h3 className="alert-heading text-italic">
              Decryption Node Malfunction
            </h3>
            <p className="alert-text">
              {(error as Error)?.message || 'Connection lost to server.'}
            </p>
            <div className="sys-status-bar code-mono">STATUS: 503_CONN_FAIL</div>
          </div>
        ) : !quizzes || quizzes.length === 0 ? (
          /* =========================
              EMPTY LAYER
          ========================= */
          <div className="editorial-card empty-terminal-frame flex-center">
            <div className="corner-brackets" />
            <Terminal
              size={40}
              style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}
            />
            <h3 className="text-italic">
              Terminal Grid Idle
            </h3>
            <p style={{ color: 'var(--text-muted)' }}>
              No quizzes currently assigned to this local module.
            </p>
            <div className="sys-status-bar code-mono">STATUS: LIST_EMPTY</div>
          </div>
        ) : (
          /* =========================
              GRID MATRIX FRAME
          ========================= */
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-wrapper matrix-node-card"
              >
                {/* Embedded Original Quiz Card */}
                <QuizCard
                  id={quiz.id}
                  title={quiz.title}
                  type={quiz.type}
                  description={quiz.description}
                  duration={quiz.duration}
                  questionsCount={quiz.questionsCount}
                  status={quiz.status}
                  highScore={quiz.highScore}
                  attempted={quiz.attempted}
                />

                {/* Overlaid Badges and Subpanels */}
                {quiz.attempted && (
                  <div className="attempted-badge matrix-glow-badge">
                    ATTEMPTED
                  </div>
                )}

                <div className="challenge-details data-subpanel">
                  <div className="detail-row subpanel-row">
                    <span className="row-label code-mono">STATUS MATRIX</span>
                    <span className={`status-pill node-pill ${quiz.attempted ? 'attempted' : 'active'}`}>
                      {quiz.attempted ? 'STABLE' : 'AVAILABLE'}
                    </span>
                  </div>

                  {quiz.highScore !== undefined && (
                    <div className="detail-row subpanel-row border-top-matrix">
                      <span className="row-label code-mono">HIGH SCORE</span>
                      <span className="node-score-value">{quiz.highScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =========================
          FOOTER INTEL SECTION
      ========================= */}

      <section className="grid-meta-row telemetry-footer">
        <div className="editorial-card terminal-intel-card">
          <div className="intel-layout-wrapper">
            <div className="intel-icon-frame">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="intel-title">Secure Quiz Sessions</h4>
              <p className="intel-description">
                All quiz attempts are tracked securely with authenticated sessions and live leaderboard updates.
              </p>
            </div>
          </div>
        </div>

        <div className="editorial-card terminal-intel-card accent-intel-card">
          <div className="intel-layout-wrapper">
            <div className="intel-icon-frame accent-icon">
              <Award size={20} />
            </div>
            <div>
              <h4 className="intel-title">Competitive Ranking</h4>
              <p className="intel-description">
                Rankings update dynamically after each submission. Improve scores to climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          THEME ENHANCEMENTS STYLES
      ========================= */}

      <style>{`
        .system-matrix-layout {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding: 2rem;
          background-color: transparent;
        }

        /* Header Setup */
        .control-deck-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
          border-bottom: 1px solid var(--border-default);
          padding-bottom: 2rem;
        }

        .header-identity {
          flex: 1;
          min-width: 300px;
        }

        .status-indicator-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
        }

        .live-pulse-dot {
          width: 6px;
          height: 6px;
          background-color: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent);
          animation: pulseGlow 2s infinite ease-in-out;
        }

        .code-mono {
          font-family: monospace;
          letter-spacing: 0.05em;
        }

        .terminal-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .accent-italic {
          font-style: italic;
          color: var(--accent);
          text-shadow: 0 0 20px rgba(115, 255, 184, 0.15);
        }

        .terminal-subtitle {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-top: 0.75rem;
          max-width: 620px;
        }

        /* Telemetry Panels Design */
        .telemetry-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          min-width: 450px;
        }

        @media (max-width: 600px) {
          .telemetry-grid {
            min-width: 100%;
          }
        }

        .metric-panel {
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-default);
          padding: 1.25rem 1.75rem;
          min-width: 140px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .metric-panel.accent-panel {
          border-color: rgba(115, 255, 184, 0.3);
          background: rgba(115, 255, 184, 0.01);
        }

        .panel-corner-tag {
          position: absolute;
          top: 4px;
          right: 6px;
          color: var(--text-muted);
          opacity: 0.4;
        }

        .panel-title {
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin: 0;
        }

        .matrix-counter {
          font-family: monospace;
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.1;
          margin-top: 0.5rem;
          color: var(--text-primary);
        }

        .matrix-counter.dynamic-color {
          color: var(--accent);
        }

        .percent-mark {
          font-size: 1.2rem;
          color: var(--text-muted);
          margin-left: 2px;
        }

        .panel-scanline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Core Grid & Matrix Nodes */
        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .matrix-node-card {
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .matrix-node-card:hover {
          transform: translateY(-2px);
        }

        .matrix-glow-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(115, 255, 184, 0.08);
          color: var(--accent);
          border: 1px solid var(--accent);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-family: monospace;
          font-weight: 700;
          letter-spacing: 0.05em;
          z-index: 10;
          box-shadow: 0 0 10px rgba(115, 255, 184, 0.1);
        }

        /* Data Drawer Section */
        .data-subpanel {
          margin-top: -0.5rem;
          padding: 1rem;
          border: 1px solid var(--border-default);
          border-top: none;
          border-radius: 0 0 12px 12px;
          background: rgba(255, 255, 255, 0.015);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .subpanel-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .row-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .border-top-matrix {
          border-top: 1px dashed var(--border-default);
          padding-top: 0.6rem;
        }

        .node-score-value {
          color: var(--accent);
          font-family: monospace;
          font-weight: 700;
          font-size: 1rem;
        }

        .node-pill {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-family: monospace;
          font-weight: 700;
        }

        .node-pill.active {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }

        .node-pill.attempted {
          background: rgba(115, 255, 184, 0.1);
          color: var(--accent);
        }

        /* Custom Shell Containers (Empty, Error, Layout Brackets) */
        .corner-brackets {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .corner-brackets::before, .corner-brackets::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: var(--border-default);
          border-style: solid;
        }
        .corner-brackets::before { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .corner-brackets::after { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

        .terminal-alert-frame, .empty-terminal-frame {
          position: relative;
          padding: 4rem;
          text-align: center;
          border: 1px dashed var(--border-default);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.005);
        }

        .alert-icon-glow {
          filter: drop-shadow(0 0 8px rgba(115, 255, 184, 0.3));
          margin-bottom: 0.5rem;
        }

        .sys-status-bar {
          margin-top: 1.5rem;
          font-size: 0.65rem;
          color: var(--text-muted);
          opacity: 0.6;
        }

        /* Footer Metadata Layout */
        .grid-meta-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .terminal-intel-card {
          border-left: 3px solid var(--border-default) !important;
          background: rgba(255, 255, 255, 0.005);
          padding: 1.25rem 1.5rem;
          transition: border-color 0.2s ease;
        }

        .terminal-intel-card:hover {
          border-left-color: var(--text-primary) !important;
        }

        .accent-intel-card:hover {
          border-left-color: var(--accent) !important;
        }

        .intel-layout-wrapper {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }

        .intel-icon-frame {
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .intel-icon-frame.accent-icon {
          color: var(--accent);
        }

        .intel-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.35rem 0;
        }

        .intel-description {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Animations */
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        @media (max-width: 768px) {
          .grid-meta-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}