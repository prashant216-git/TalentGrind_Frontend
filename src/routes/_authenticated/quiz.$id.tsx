// src/routes/_authenticated/quiz/$id.tsx

import {
  createFileRoute,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

import {
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  AlertTriangle,
  Timer,
  Cpu,
  Layers,
  Activity,
} from 'lucide-react';

export const Route = createFileRoute(
  '/_authenticated/quiz/$id'
)({
  component: QuizPlayerComponent,
});

/* =========================
   TYPES
========================= */

interface Option {
  id: number;
  optionText: string;
}

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  marks: number;
  options: Option[];
  timerDuration?: number; // Optional dynamic time override from backend (e.g. Rapid Round configuration)
}

interface PaginatedQuestions {
  content: Question[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface SubmitResponse {
  score: number;
  attempted: number;
}

/* =========================
   SUB-COMPONENT: INDIVIDUAL QUESTION NODE
========================= */

interface QuestionNodeProps {
  question: Question;
  absoluteIndex: number;
  selectedOption: number | undefined;
  onSelectOption: (questionId: number, optionId: number) => void;
}

function QuestionNode({
  question,
  absoluteIndex,
  selectedOption,
  onSelectOption,
}: QuestionNodeProps) {
  // Determine standard execution time limit (custom or default 40s)
  const allocationLimit = question.timerDuration || 40;
  const [timeLeft, setTimeLeft] = useState(allocationLimit);

  useEffect(() => {
    // Reset individual clock only if question content changes
    setTimeLeft(allocationLimit);
  }, [question.id, allocationLimit]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const chronometer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(chronometer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(chronometer);
  }, [timeLeft, question.id]);

  const progressRatio = (timeLeft / allocationLimit) * 100;
  const isTimeCritical = timeLeft <= 10;

  return (
    <div className={`editorial-card question-matrix-frame ${isTimeCritical && timeLeft > 0 ? 'pulse-critical-border' : ''}`}>
      {/* Structural Corner Highlights */}
      <div className="card-corner-geometry" />
      
      {/* Node Header Metrics */}
      <div className="question-node-header">
        <div className="node-index-tag code-mono">
          <Cpu size={12} style={{ color: 'var(--accent)' }} /> 
          NODE STRUCTURE #{absoluteIndex.toString().padStart(2, '0')}
        </div>

        {/* Localized Telemetry Timer */}
        <div className={`node-countdown-clock code-mono ${timeLeft === 0 ? 'clock-expired' : isTimeCritical ? 'clock-critical' : ''}`}>
          <Timer size={14} className={isTimeCritical && timeLeft > 0 ? 'spin-icon' : ''} />
          <span>
            {timeLeft > 0 ? `SYS_TIME_REMAINING: ${timeLeft}s` : 'TIMELOCK_ACTIVE'}
          </span>
        </div>
      </div>

      <h2 className="question-display-text">
        {question.questionText}
      </h2>

      {/* Synchronized Micro Bar for time mapping */}
      <div className="micro-timer-bar">
        <div 
          className={`micro-timer-progress ${isTimeCritical ? 'bg-critical' : ''}`}
          style={{ width: `${progressRatio}%` }}
        />
      </div>

      {/* Option Elements Block */}
      <div className="options-matrix-grid">
        {question.options.map((option, optionIndex) => {
          const alphabetAlpha = String.fromCharCode(65 + optionIndex);
          const isSelected = selectedOption === option.id;
          const isLockedOut = timeLeft === 0;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isLockedOut}
              onClick={() => onSelectOption(question.id, option.id)}
              className={`option-terminal-button ${isSelected ? 'option-state-selected' : ''} ${isLockedOut ? 'option-state-disabled' : ''}`}
            >
              <div className="option-interactive-content">
                <span className="option-index-alpha code-mono">{alphabetAlpha}</span>
                <span className="option-core-text">{option.optionText}</span>
              </div>

              {isSelected && (
                <div className="option-checked-icon-wrapper">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   CORE COMPONENT
========================= */

function QuizPlayerComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  /* =========================
     FETCH QUESTIONS
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery<PaginatedQuestions>({
    queryKey: ['quiz', id, 'questions', page],
    queryFn: () =>
      apiFetch<PaginatedQuestions>(
        `quiz/${id}/questions?page=${page}&size=2`
      ),
    placeholderData: (previousData) => previousData,
  });

  /* =========================
     SUBMIT DATA PACKET MUTATION
  ========================= */

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        quizId: Number(id),
        answers: Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId: Number(optionId),
        })),
      };

      return await apiFetch<SubmitResponse>('quiz/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quiz'] });
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

      navigate({
        to: '/quiz/$id/score',
        params: { id },
      });
    },
  });

  /* =========================
     INTERACTION ROUTERS
  ========================= */

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (window.location.pathname.endsWith('/score')) {
    return <Outlet />;
  }

  /* =========================
     LOADING / ERROR VIEWPORTS
  ========================= */

  if (isLoading) {
    return (
      <div className="page-container system-player-loading flex-center">
        <div className="terminal-loader-box">
          <Activity className="spin-icon" size={32} style={{ color: 'var(--accent)' }} />
          <h2 className="code-mono">INITIALIZING_SECURE_ARRAY...</h2>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-container system-player-error flex-center">
        <div className="error-terminal-card">
          <AlertTriangle size={44} style={{ color: 'var(--accent)' }} />
          <h2 className="text-italic">Link Dropped: Array Frame Lost</h2>
          <p>The network layer refused or timed out execution metrics requests.</p>
          <button className="btn-outline code-mono" onClick={() => navigate({ to: '/dashboard' })}>
            RETURN_TO_DECK
          </button>
        </div>
      </div>
    );
  }

  const { content: questions, totalElements, totalPages } = data;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalElements > 0 ? Math.round((answeredCount / totalElements) * 100) : 0;
  const isLastPage = page === totalPages - 1;

  return (
    <>
      <Outlet />

      <div className="page-container player-matrix-layout">
        {/* =========================
            TOP OVERVIEW TELEMETRY PANEL
        ========================= */}
        <header className="player-telemetry-header">
          <div className="identity-block">
            <div className="status-row">
              <span className="live-pulse" />
              <span className="editorial-label code-mono">MATRIX STREAM EXECUTION IN PROGRESS</span>
            </div>
            <h1 className="main-challenge-title">Quiz Challenge Node</h1>
            <p className="main-challenge-desc">
              Complete all rapid-fire terminal modules. Option selectors map permanently upon confirmation layout metrics.
            </p>
          </div>

          {/* Centralized Progress Architecture */}
          <div className="telemetry-progress-panel">
            <div className="progress-meta-row code-mono">
              <span className="progress-label"><Layers size={12} /> VERIFIED_DATA_SETS</span>
              <span className="progress-fraction">{answeredCount} / {totalElements} NODES</span>
            </div>
            <div className="master-progress-track">
              <div className="master-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </header>

        {/* =========================
            QUESTION ARRAY MATRIX CONTAINER
        ========================= */}
        <main className="questions-viewport-flow">
          {questions.map((question, index) => {
            const absoluteIndex = page * 2 + index + 1;
            const selectedOption = selectedAnswers[question.id];

            return (
              <QuestionNode
                key={question.id}
                question={question}
                absoluteIndex={absoluteIndex}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
              />
            );
          })}
        </main>

        {/* =========================
            FOOTER DOCK CONTROLS
        ========================= */}
        <footer className="matrix-control-dock">
          <button
            className="control-dock-btn btn-secondary-terminal"
            disabled={page === 0}
            onClick={handlePrev}
          >
            <ChevronLeft size={16} />
            <span className="code-mono">PREV_BLOCK</span>
          </button>

          {isLastPage ? (
            <button
              className="control-dock-btn btn-accent-terminal"
              disabled={submitMutation.isPending}
              onClick={handleSubmit}
            >
              <span className="code-mono">
                {submitMutation.isPending ? 'TRANSMITTING...' : 'TERMINATE_&_SUBMIT'}
              </span>
              <Send size={14} />
            </button>
          ) : (
            <button
              className="control-dock-btn btn-secondary-terminal"
              onClick={handleNext}
            >
              <span className="code-mono">NEXT_BLOCK</span>
              <ChevronRight size={16} />
            </button>
          )}
        </footer>
      </div>

      {/* =========================
          THEMATIC INTERACTIVE DESIGN STYLES
      ========================= */}
      {/* =========================
          THEMATIC INTERACTIVE DESIGN STYLES
      ========================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        .player-matrix-layout {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding: 2rem 1.5rem;
        }

        .code-mono {
          font-family: monospace;
          letter-spacing: 0.05em;
        }

        /* Top Bar Design Blueprint */
        .player-telemetry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 2rem;
          border-bottom: 1px solid var(--border-default);
          padding-bottom: 2rem;
        }

        .identity-block {
          flex: 1;
          min-width: 320px;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .live-pulse {
          width: 6px;
          height: 6px;
          background-color: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent);
          animation: pulseOpacity 1.8s infinite ease-in-out;
        }

        .main-challenge-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .main-challenge-desc {
          color: var(--text-muted);
          font-size: 0.98rem;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        /* Telemetry Progress Node Block */
        .telemetry-progress-panel {
          width: 300px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-default);
          padding: 1rem;
          border-radius: 8px;
        }

        @media(max-width: 680px) {
          .telemetry-progress-panel { width: 100%; }
        }

        .progress-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          margin-bottom: 0.6rem;
        }

        .progress-label {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .progress-fraction {
          color: var(--text-primary);
          font-weight: 700;
        }

        .master-progress-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
        }

        .master-progress-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 10px rgba(115, 255, 184, 0.2);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Core Question Node Layout */
        .questions-viewport-flow {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .question-matrix-frame {
          position: relative;
          padding: 2.25rem;
          background: rgba(255, 255, 255, 0.005);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pulse-critical-border {
          border-color: rgba(239, 68, 68, 0.4) !important;
          animation: criticalPulseBorder 1.5s infinite ease-in-out;
        }

        .card-corner-geometry {
          position: absolute;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          border-left: 2px solid var(--text-muted);
          border-top: 2px solid var(--text-muted);
          opacity: 0.2;
        }

        .question-node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .node-index-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .node-countdown-clock {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-default);
          border-radius: 4px;
          color: var(--text-primary);
        }

        .clock-critical {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
          font-weight: 700;
         }

        .clock-expired {
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.02);
          border-color: var(--border-default);
          opacity: 0.6;
        }

        .question-display-text {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 1.5rem 0;
          color: var(--text-primary);
        }

        /* Micro Synchronized Timeline Bar */
        .micro-timer-bar {
          height: 2px;
          background: rgba(255, 255, 255, 0.03);
          margin-bottom: 2rem;
          border-radius: 2px;
          overflow: hidden;
        }

        .micro-timer-progress {
          height: 100%;
          background: var(--accent);
          transition: width 1s linear;
        }

        .micro-timer-progress.bg-critical {
          background: #ef4444;
        }

        /* Option Framework Structuring */
        .options-matrix-grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .option-terminal-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 1.4rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-default);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .option-terminal-button:hover:not(.option-state-disabled) {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--text-muted);
        }

        .option-interactive-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .option-index-alpha {
          font-size: 0.85rem;
          font-weight: 700;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-default);
          border-radius: 4px;
          color: var(--text-muted);
          transition: color 0.15s ease;
        }

        .option-core-text {
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Active Option State Mapping */
        .option-state-selected {
          border-color: var(--accent) !important;
          background: rgba(115, 255, 184, 0.02) !important;
        }

        .option-state-selected .option-index-alpha {
          background: rgba(115, 255, 184, 0.1);
          border-color: var(--accent);
          color: var(--accent);
        }

        .option-checked-icon-wrapper {
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Expired Time Out Disabled State */
        .option-state-disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.1);
        }

        /* Controls Bottom Panel Dock */
        .matrix-control-dock {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          border-top: 1px dashed var(--border-default);
          padding-top: 2rem;
        }

        .control-dock-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary-terminal {
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-primary);
        }

        .btn-secondary-terminal:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.03);
          border-color: var(--text-muted);
        }

        .btn-secondary-terminal:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .btn-accent-terminal {
          background: var(--accent);
          border: 1px solid var(--accent);
          color: #000;
        }

        .btn-accent-terminal:hover {
          box-shadow: 0 0 15px rgba(115, 255, 184, 0.3);
          opacity: 0.95;
        }

        /* Auxiliary Loader Components styles */
        .system-player-loading, .system-player-error {
          min-height: 75vh;
        }

        .terminal-loader-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .error-terminal-frame {
          text-align: center;
          max-width: 480px;
          border: 1px dashed var(--border-default);
          padding: 3rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        /* Animations Framework */
        .spin-icon {
          animation: spinAnimation 3s infinite linear;
        }

        @keyframes spinAnimation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes criticalPulseBorder {
          0%, 100% { border-color: rgba(239, 68, 68, 0.2); box-shadow: none; }
          50% { border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 0 10px rgba(239, 68, 68, 0.05); }
        }
      `}} />
 
  </>
);
}