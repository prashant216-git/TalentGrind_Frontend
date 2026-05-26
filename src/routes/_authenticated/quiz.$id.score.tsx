import {
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router';

import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '../../lib/api';

import {
  Trophy,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/quiz/$id/score'
)({
  component:
    ScoreResultComponent,
});

interface ScoreResult {
  score: number;
  attempted: number;
}

function ScoreResultComponent() {
  const { id } =
    Route.useParams();

  const navigate =
    useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<ScoreResult>({
    queryKey: [
      'quiz',
      id,
      'score',
    ],

    queryFn: () =>
      apiFetch<ScoreResult>(
        `quiz/${id}/score`
      ),

    retry: false,
  });

  if (isLoading) {
    return (
      <div
        className="page-container"
        style={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent:
            'center',
          alignItems: 'center',
        }}
      >
        <h2>
          Loading Score...
        </h2>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="page-container"
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection:
            'column',
          justifyContent:
            'center',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <h2>
          Failed To Load
          Score
        </h2>

        <button
          className="btn-outline"
          onClick={() =>
            navigate({
              to: '/dashboard',
            })
          }
        >
          Back To Dashboard
        </button>
      </div>
    );
  }

  const percentage =
    data.attempted > 0
      ? Math.round(
          (data.score /
            data.attempted) *
            100
        )
      : 0;

  return (
    <div
      className="page-container"
      style={{
        minHeight: '85vh',
        display: 'flex',
        justifyContent:
          'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="editorial-card"
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        <Trophy
          size={60}
          style={{
            marginBottom:
              '1.5rem',
            color: '#4ade80',
          }}
        />

        <h1
          style={{
            marginBottom:
              '1rem',
          }}
        >
          Quiz Completed
        </h1>

        <p
          style={{
            marginBottom:
              '2rem',
            opacity: 0.8,
          }}
        >
          Your score has
          been calculated
          successfully.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: '1rem',
            marginBottom:
              '2rem',
          }}
        >
          <div>
            <h3>
              Score
            </h3>

            <div
              style={{
                fontSize:
                  '2rem',
              }}
            >
              {data.score}
            </div>
          </div>

          <div>
            <h3>
              Percentage
            </h3>

            <div
              style={{
                fontSize:
                  '2rem',
              }}
            >
              {percentage}%
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: '1rem',
          }}
        >
          <button
            className="btn-primary"
            onClick={() =>
              navigate({
                to: '/dashboard',
              })
            }
          >
            Dashboard

            <ChevronRight
              size={16}
            />
          </button>

          <button
            className="btn-outline"
            onClick={() =>
              navigate({
                to: '/quiz/$id',

                params: {
                  id,
                },
              })
            }
          >
            <RefreshCw
              size={14}
            />

            Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );
}