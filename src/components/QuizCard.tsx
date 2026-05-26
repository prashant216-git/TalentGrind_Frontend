// src/components/QuizCard.tsx

import React from 'react';

import { Link } from '@tanstack/react-router';

import {
  Play,
  CheckCircle,
  Flame,
  Clock,
  Lock,
} from 'lucide-react';

interface QuizCardProps {
  id: string;

  title: string;

  type: string;

  description: string;

  duration: string;

  questionsCount: number;

  status:
    | 'COMPLETED'
    | 'IN PROGRESS'
    | 'NEW'
    | 'ATTEMPTED'
    | string;

  highScore?: number;

  attempted?: boolean;
}

const QuizCard: React.FC<
  QuizCardProps
> = ({
  id,
  title,
  type,
  description,
  duration,
  questionsCount,
  status,
  highScore,
  attempted,
}) => {
  /* =========================
     STATUS BADGE
  ========================= */

  const getStatusBadge = () => {
    if (attempted) {
      // return (
      //   // <span className="badge badge-disabled">
      //   //   <Lock
      //   //     size={10}
      //   //     style={{
      //   //       marginRight: '4px',
      //   //     }}
      //   //   />
      //   //   ATTEMPTED
      //   // </span>
      // );
    }

    switch (status) {
      case 'COMPLETED':
        return (
          <span className="badge badge-muted">
            <CheckCircle
              size={10}
              style={{
                marginRight: '4px',
              }}
            />
            COMPLETED
          </span>
        );

      case 'IN PROGRESS':
        return (
          <span className="badge badge-glow">
            <Flame
              size={10}
              style={{
                marginRight: '4px',
              }}
            />
            IN PROGRESS
          </span>
        );

      default:
        
    }
  };

  /* =========================
     CTA BUTTON
  ========================= */

  const renderCTA = () => {
    if (attempted) {
      return (
        <button
          disabled
          className="btn-disabled card-cta"
        >
          <Lock size={12} />

          <span>
            Already Attempted
          </span>
        </button>
      );
    }

    return (
      <Link
        to="/quiz/$id"
        params={{ id }}
        className="btn-primary card-cta"
      >
        <span>
          Enter Challenge
        </span>

        <Play
          size={12}
          fill="var(--bg-primary)"
        />
      </Link>
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="editorial-card fade-in">
      {/* =========================
          TOP
      ========================= */}

      <div className="card-top flex-between">
        <span
          className="editorial-label"
          style={{
            fontSize: '0.7rem',
          }}
        >
          {type}
        </span>

        {getStatusBadge()}
      </div>

      {/* =========================
          BODY
      ========================= */}

      <div
        className="card-body"
        style={{
          margin: '1.5rem 0',
        }}
      >
        <h3
          className="card-title"
          style={{
            marginBottom: '0.75rem',
            fontSize: '2rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color:
              'var(--text-muted)',

            fontSize: '0.9rem',

            lineHeight: '1.6',

            minHeight: '4.8rem',
          }}
        >
          {description}
        </p>
      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <div
        className="card-bottom flex-between"
        style={{
          borderTop:
            '1px solid var(--border-default)',

          paddingTop: '1.25rem',

          marginTop: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
          }}
        >
          <div
            className="mono-stat flex-center"
            style={{
              fontSize: '0.8rem',

              color:
                'var(--text-muted)',

              gap: '0.25rem',
            }}
          >
            <Clock size={12} />

            <span>{duration}</span>
          </div>

          <div
            className="mono-stat flex-center"
            style={{
              fontSize: '0.8rem',

              color:
                'var(--text-muted)',

              gap: '0.25rem',
            }}
          >
            <span>
              {questionsCount}{' '}
              QUESTIONS
            </span>
          </div>
        </div>

        {(status ===
          'COMPLETED' ||
          attempted) &&
          highScore !==
            undefined && (
            <div
              className="mono-stat"
              style={{
                fontSize: '0.8rem',

                color:
                  'var(--accent)',
              }}
            >
              HIGH SCORE:{' '}
              {highScore}%
            </div>
          )}
      </div>

      {/* =========================
          HOVER OVERLAY
      ========================= */}

      {attempted ? (
  <div className="attempted-overlay">
    <button
      disabled
      className="btn-disabled card-cta"
    >
      <Lock size={12} />

      <span>
        Already Attempted
      </span>
    </button>
  </div>
) : (
  <div className="card-hover-overlay">
    {renderCTA()}
  </div>
)}

      {/* =========================
          STYLES
      ========================= */}

      <style>{`
        .editorial-card {
          position: relative;
          overflow: hidden;
        }

        .card-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          background: rgba(
            13,
            27,
            42,
            0.92
          );

          display: flex;

          justify-content: center;

          align-items: center;

          opacity: 0;

          pointer-events: none;

          transition:
            var(
              --transition-smooth
            );

          backdrop-filter: blur(4px);
        }

        .editorial-card:hover
          .card-hover-overlay {
          opacity: 1;

          pointer-events: auto;
        }

        .always-visible {
          opacity: 1;

          pointer-events: auto;

          background: rgba(
            13,
            27,
            42,
            0.78
          );
        }

        .card-cta {
          transform: translateY(15px);

          transition:
            var(
              --transition-smooth
            );
        }

        .editorial-card:hover
          .card-cta {
          transform: translateY(0);
        }

        .badge-disabled {
          background: rgba(
            255,
            255,
            255,
            0.08
          );

          color:
            var(--text-muted);

          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .btn-disabled {
          display: flex;

          align-items: center;

          gap: 0.5rem;

          border: none;

          padding: 0.9rem
            1.3rem;

          border-radius: 999px;

          background: rgba(
            255,
            255,
            255,
            0.08
          );

          color:
            var(--text-muted);

          cursor: not-allowed;

          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default QuizCard;