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

  const totalQuizzes =
    quizzes?.length || 0;

  const attemptedQuizzes =
    quizzes?.filter(
      (q) => q.attempted
    ).length || 0;

  const completedQuizzes =
    quizzes?.filter(
      (q) =>
        q.status ===
        'COMPLETED'
    ).length || 0;

  const averageScore =
    quizzes?.reduce(
      (acc, q) =>
        acc + (q.highScore || 0),
      0
    ) /
      (quizzes?.filter(
        (q) => q.highScore
      ).length || 1);

  /* =========================
     UI
  ========================= */

  return (
    <div className="page-container editorial-layout">
      {/* =========================
          HEADER
      ========================= */}

      <div
        className="flex-between"
        style={{
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <div>
          <span className="editorial-label">
            COMPETITIVE STAGE ACTIVE
          </span>

          <h1
            style={{
              marginTop: '0.5rem',
            }}
          >
            System{' '}
            <span
              style={{
                fontStyle:
                  'italic',

                color:
                  'var(--accent)',
              }}
            >
              Dashboard
            </span>
          </h1>

          <p
            style={{
              color:
                'var(--text-muted)',

              fontSize: '1.1rem',

              marginTop: '0.5rem',

              maxWidth: '600px',
            }}
          >
            Connect to active
            challenge nodes,
            solve secure
            multi-select
            structures, and
            verify computational
            priority.
          </p>
        </div>

        {/* =========================
            STATS
        ========================= */}

        <div
          style={{
            display: 'flex',

            gap: '1.5rem',

            flexWrap: 'wrap',
          }}
        >
          <div className="editorial-card stat-bubble">
            <span className="editorial-label">
              TOTAL QUIZZES
            </span>

            <div className="mono-stat stat-num">
              {totalQuizzes}
            </div>
          </div>

          <div className="editorial-card stat-bubble">
            <span className="editorial-label">
              ATTEMPTED
            </span>

            <div
              className="mono-stat stat-num"
              style={{
                color:
                  'var(--accent)',
              }}
            >
              {attemptedQuizzes}
            </div>
          </div>

          <div className="editorial-card stat-bubble">
            <span className="editorial-label">
              AVG SCORE
            </span>

            <div className="mono-stat stat-num">
              {Math.round(
                averageScore || 0
              )}
              %
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {isLoading ? (
        <div className="quiz-grid">
          <div className="skeleton skeleton-card" />

          <div className="skeleton skeleton-card" />

          <div className="skeleton skeleton-card" />
        </div>
      ) : isError ? (
        /* =========================
            ERROR
        ========================= */
        <div
          className="error-panel flex-center"
          style={{
            flexDirection:
              'column',

            gap: '1rem',

            padding: '4rem',
          }}
        >
          <AlertTriangle
            size={36}
            style={{
              color:
                'var(--accent)',
            }}
          />

          <h3
            style={{
              fontStyle:
                'italic',
            }}
          >
            Decryption Node
            Malfunction
          </h3>

          <p
            style={{
              color:
                'var(--text-muted)',
            }}
          >
            {(error as Error)
              ?.message ||
              'Connection lost to server.'}
          </p>
        </div>
      ) : !quizzes ||
        quizzes.length === 0 ? (
        /* =========================
            EMPTY
        ========================= */
        <div
          className="editorial-card flex-center"
          style={{
            minHeight: '300px',

            flexDirection:
              'column',

            gap: '1rem',
          }}
        >
          <Terminal
            size={36}
            style={{
              color:
                'var(--text-muted)',
            }}
          />

          <h3
            style={{
              fontStyle:
                'italic',
            }}
          >
            Terminal Grid Idle
          </h3>

          <p
            style={{
              color:
                'var(--text-muted)',
            }}
          >
            No quizzes available.
          </p>
        </div>
      ) : (
        /* =========================
            QUIZ GRID
        ========================= */
        <div className="quiz-grid">
          {quizzes.map(
            (quiz) => (
              <div
                key={quiz.id}
                className="quiz-wrapper"
              >
                {/* Existing Quiz Card */}
                <QuizCard
                  id={quiz.id}
                  title={quiz.title}
                  type={quiz.type}
                  description={
                    quiz.description
                  }
                  duration={
                    quiz.duration
                  }
                  questionsCount={
                    quiz.questionsCount
                  }
                  status={
                    quiz.status
                  }
                  highScore={
                    quiz.highScore
                  }
                  attempted={
                    quiz.attempted
                  }
                />

                {/* =========================
                    ATTEMPTED BADGE
                ========================= */}

                {quiz.attempted && (
                  <div className="attempted-badge">
                    ATTEMPTED
                  </div>
                )}

                {/* =========================
                    DETAILS SECTION
                ========================= */}

               
              </div>
            )
          )}
        </div>
      )}

      {/* =========================
          META SECTION
      ========================= */}

      <section className="grid-meta-row">
        <div className="editorial-card border-accent-left">
          <div
            style={{
              display: 'flex',

              gap: '1.5rem',

              alignItems:
                'flex-start',
            }}
          >
            <Shield
              size={24}
              style={{
                color:
                  'var(--text-primary)',

                marginTop: '0.2rem',
              }}
            />

            <div>
              <h4
                style={{
                  fontSize:
                    '1.25rem',

                  marginBottom:
                    '0.5rem',
                }}
              >
                Secure Quiz
                Sessions
              </h4>

              <p
                style={{
                  color:
                    'var(--text-muted)',

                  fontSize:
                    '0.9rem',

                  lineHeight:
                    '1.6',
                }}
              >
                All quiz attempts
                are tracked securely
                with authenticated
                sessions and live
                leaderboard updates.
              </p>
            </div>
          </div>
        </div>

        <div className="editorial-card border-accent-left">
          <div
            style={{
              display: 'flex',

              gap: '1.5rem',

              alignItems:
                'flex-start',
            }}
          >
            <Award
              size={24}
              style={{
                color:
                  'var(--accent)',

                marginTop: '0.2rem',
              }}
            />

            <div>
              <h4
                style={{
                  fontSize:
                    '1.25rem',

                  marginBottom:
                    '0.5rem',
                }}
              >
                Competitive Ranking
              </h4>

              <p
                style={{
                  color:
                    'var(--text-muted)',

                  fontSize:
                    '0.9rem',

                  lineHeight:
                    '1.6',
                }}
              >
                Rankings update
                dynamically after
                each submission.
                Improve scores to
                climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          STYLES
      ========================= */}

      <style>{`
        .quiz-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fill,
              minmax(320px, 1fr)
            );

          gap: 2rem;

          margin-top: 1rem;
        }

        .quiz-wrapper {
          position: relative;
        }

        .attempted-badge {
          position: absolute;

          top: 14px;

          right: 14px;

          background: rgba(
            115,
            255,
            184,
            0.12
          );

          color: var(--accent);

          border: 1px solid
            var(--accent);

          padding: 0.35rem 0.7rem;

          border-radius: 999px;

          font-size: 0.7rem;

          letter-spacing: 0.08em;

          font-weight: 700;

          z-index: 10;
        }

        .challenge-details {
          margin-top: 1rem;

          padding: 1rem;

          border: 1px solid
            var(--border-default);

          border-radius: 1rem;

          background: rgba(
            255,
            255,
            255,
            0.02
          );

          display: flex;

          flex-direction: column;

          gap: 0.8rem;
        }

        .detail-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          font-size: 0.92rem;
        }

        .status-pill {
          padding: 0.3rem 0.7rem;

          border-radius: 999px;

          font-size: 0.72rem;

          font-weight: 700;

          letter-spacing: 0.08em;
        }

        .status-pill.active {
          background: rgba(
            255,
            255,
            255,
            0.06
          );

          color: var(
            --text-primary
          );
        }

        .status-pill.attempted {
          background: rgba(
            115,
            255,
            184,
            0.12
          );

          color: var(--accent);

          border: 1px solid
            var(--accent);
        }

        .stat-bubble {
          padding: 1.5rem 2rem;

          min-width: 160px;

          flex: 1;
        }

        .stat-num {
          font-size: 2.2rem;

          margin-top: 0.5rem;

          line-height: 1;
        }

        .grid-meta-row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 2rem;

          margin-top: 2rem;
        }

        .border-accent-left {
          border-left: 2px solid
            var(--text-primary);
        }

        .border-accent-left:hover {
          border-left-color:
            var(--accent);
        }

        .error-panel {
          border: 1px solid
            var(--border-default);

          background: rgba(
            13,
            27,
            42,
            0.4
          );

          border-radius: 1.5rem;

          text-align: center;
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