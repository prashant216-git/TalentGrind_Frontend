// src/routes/_authenticated/leaderboard.tsx

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../lib/auth';

import {
  Trophy,
  Award,
  Medal,
  ShieldAlert,
  Users,
  Target,
  CheckCircle2,
} from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/leaderboard'
)({
  component: LeaderboardComponent,
});

/* =========================
   TYPES
========================= */

interface LeaderboardEntry {
  userId: number;

  name: string;

  role: string;

  totalScore: number;

  totalAttempted: number;

  totalCorrect: number;

  accuracy: number;
}

interface LeaderboardResponse {
  totalElements: number;

  totalPages: number;

  first: boolean;

  last: boolean;

  size: number;

  content: LeaderboardEntry[];

  number: number;

  numberOfElements: number;

  empty: boolean;
}

/* =========================
   COMPONENT
========================= */

function LeaderboardComponent() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard'],

    queryFn: () =>
      apiFetch<LeaderboardResponse>(
        'quiz/leaderboard'
      ),
  });

  const entries = data?.content || [];

  /* =========================
     PODIUM
  ========================= */

  const podium = entries.slice(0, 3);

  // const tableEntries = entries.slice(3);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Trophy
            size={34}
            style={{
              color: '#ffd700',
            }}
          />
        );

      case 1:
        return (
          <Award
            size={34}
            style={{
              color: '#c0c0c0',
            }}
          />
        );

      default:
        return (
          <Medal
            size={34}
            style={{
              color: '#cd7f32',
            }}
          />
        );
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div className="page-container">
        <div
          className="editorial-card"
          style={{
            padding: '3rem',
          }}
        >
          Loading leaderboard...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError) {
    return (
      <div className="page-container">
        <div
          className="editorial-card flex-center"
          style={{
            minHeight: '300px',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <ShieldAlert
            size={36}
            style={{
              color: 'var(--accent)',
            }}
          />

          <h3>Failed To Load Leaderboard</h3>

          <p
            style={{
              color: 'var(--text-muted)',
            }}
          >
            Could not connect to leaderboard
            services.
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     EMPTY
  ========================= */

  if (!entries.length) {
    return (
      <div className="page-container">
        <div
          className="editorial-card flex-center"
          style={{
            minHeight: '300px',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Users
            size={36}
            style={{
              color: 'var(--text-muted)',
            }}
          />

          <h3>No Rankings Available</h3>

          <p
            style={{
              color: 'var(--text-muted)',
            }}
          >
            No quiz attempts found yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container editorial-layout">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <span className="editorial-label">
          GLOBAL COMPETITIVE RANKINGS
        </span>

        <h1 style={{ marginTop: '0.5rem' }}>
          Leader
          <span
            style={{
              fontStyle: 'italic',
              color: 'var(--accent)',
            }}
          >
            board
          </span>
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
            maxWidth: '700px',
          }}
        >
          Live rankings generated from quiz
          performance, accuracy metrics, and
          total solved challenges.
        </p>
      </div>

      {/* =========================
          TOP PODIUM
      ========================= */}

      <div className="podium-container">
        {podium.map((entry, index) => {
          const isCurrentUser =
            user?.name &&
            entry.name.toLowerCase() ===
              user.name.toLowerCase();

          return (
            <div
              key={entry.userId}
              className={`editorial-card podium-card ${
                isCurrentUser
                  ? 'current-user-card'
                  : ''
              }`}
            >
              <div>{getRankIcon(index)}</div>

              <div style={{ marginTop: '1.5rem' }}>
                <div className="editorial-label">
                  RANK #{index + 1}
                </div>

                <h3
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '1.8rem',
                  }}
                >
                  {entry.name}
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                  }}
                >
                  {entry.role}
                </p>
              </div>

              <div className="podium-stats">
                <div>
                  <span className="editorial-label">
                    ACCURACY
                  </span>

                  <div className="mono-stat stat-value">
                    {entry.accuracy}%
                  </div>
                </div>

                <div>
                  <span className="editorial-label">
                    SCORE
                  </span>

                  <div className="mono-stat stat-value">
                    {entry.totalScore}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div
        className="editorial-card"
        style={{
          padding: 0,
          overflow: 'hidden',
          marginTop: '2rem',
        }}
      >
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>

              <th>USER</th>

              <th>ROLE</th>

              <th>ATTEMPTED</th>

              <th>CORRECT</th>

              <th>ACCURACY</th>

              <th>SCORE</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry, index) => {
              const isCurrentUser =
                user?.name &&
                entry.name.toLowerCase() ===
                  user.name.toLowerCase();

              return (
                <tr
                  key={entry.userId}
                  className={
                    isCurrentUser
                      ? 'current-user-row'
                      : ''
                  }
                >
                  <td className="mono-stat">
                    #{index + 1}
                  </td>

                  <td>
                    <div className="user-cell">
                      <div className="avatar-small">
                        {entry.name
                          ?.substring(0, 2)
                          ?.toUpperCase()}
                      </div>

                      <span>{entry.name}</span>
                    </div>
                  </td>

                  <td>{entry.role}</td>

                  <td>
                    <div className="metric-cell">
                      <Target size={15} />
                      {entry.totalAttempted}
                    </div>
                  </td>

                  <td>
                    <div className="metric-cell">
                      <CheckCircle2 size={15} />
                      {entry.totalCorrect}
                    </div>
                  </td>

                  <td className="mono-stat">
                    {entry.accuracy}%
                  </td>

                  <td className="mono-stat">
                    {entry.totalScore}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* =========================
          FOOTER STATS
      ========================= */}

      <div className="footer-grid">
        <div className="editorial-card footer-card">
          <span className="editorial-label">
            TOTAL PLAYERS
          </span>

          <div className="mono-stat footer-stat">
            {data?.totalElements || 0}
          </div>
        </div>

        <div className="editorial-card footer-card">
          <span className="editorial-label">
            TOTAL PAGES
          </span>

          <div className="mono-stat footer-stat">
            {data?.totalPages || 0}
          </div>
        </div>

        <div className="editorial-card footer-card">
          <span className="editorial-label">
            PAGE SIZE
          </span>

          <div className="mono-stat footer-stat">
            {data?.size || 0}
          </div>
        </div>
      </div>

      {/* =========================
          STYLES
      ========================= */}

      <style>{`
        .podium-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .podium-card {
          padding: 2rem;
          text-align: center;
        }

        .podium-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-default);
        }

        .stat-value {
          font-size: 1.5rem;
          margin-top: 0.5rem;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leaderboard-table th {
          text-align: left;
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          background: rgba(255,255,255,0.02);
        }

        .leaderboard-table td {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-default);
        }

        .leaderboard-table tr:hover {
          background: rgba(255,255,255,0.02);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-default);

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 0.7rem;
          font-weight: bold;
        }

        .metric-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .current-user-row {
          background: rgba(115,255,184,0.05);
        }

        .current-user-card {
          border-color: var(--accent) !important;
          box-shadow: var(--shadow-glow);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .footer-card {
          padding: 2rem;
        }

        .footer-stat {
          font-size: 2rem;
          margin-top: 0.75rem;
        }

        @media (max-width: 768px) {
          .leaderboard-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}