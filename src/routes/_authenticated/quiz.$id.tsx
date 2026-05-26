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

import { useState } from 'react';

import { apiFetch } from '../../lib/api';

import {
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  AlertTriangle,
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
   COMPONENT
========================= */

function QuizPlayerComponent() {
  const { id } = Route.useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, number>>(
      {}
    );

  /* =========================
     FETCH QUESTIONS
  ========================= */

  const {
    data,
    isLoading,
    isError,
  } = useQuery<PaginatedQuestions>({
    queryKey: [
      'quiz',
      id,
      'questions',
      page,
    ],

    queryFn: () =>
      apiFetch<PaginatedQuestions>(
        `quiz/${id}/questions?page=${page}&size=2`
      ),

    placeholderData: (
      previousData
    ) => previousData,
  });

  /* =========================
     SUBMIT QUIZ
  ========================= */

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        quizId: Number(id),

        answers: Object.entries(
          selectedAnswers
        ).map(
          ([
            questionId,
            optionId,
          ]) => ({
            questionId:
              Number(questionId),

            optionId:
              Number(optionId),
          })
        ),
      };

      console.log(
        'SUBMIT PAYLOAD',
        payload
      );

      const response =
        await apiFetch<SubmitResponse>(
          'quiz/submit',
          {
            method: 'POST',

            body: JSON.stringify(
              payload
            ),
          }
        );

      console.log(
        'API RESPONSE',
        response
      );

      return response;
    },

    onSuccess: async () => {
      console.log(
        'MUTATION SUCCESS'
      );

      await queryClient.invalidateQueries(
        {
          queryKey: ['quiz'],
        }
      );

      await queryClient.invalidateQueries(
        {
          queryKey: [
            'leaderboard',
          ],
        }
      );

      navigate({
        to: '/quiz/$id/score',

        params: {
          id,
        },
      });
    },

    onError: (error) => {
      console.error(
        'SUBMIT ERROR',
        error
      );
    },
  });

  /* =========================
     HANDLERS
  ========================= */

  const handleSelectOption = (
    questionId: number,
    optionId: number
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,

      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (
      data &&
      page < data.totalPages - 1
    ) {
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

  /* =========================
     CHILD ROUTE
  ========================= */

  if (
    window.location.pathname.endsWith(
      '/score'
    )
  ) {
    return <Outlet />;
  }

  /* =========================
     LOADING
  ========================= */

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
        <h2>Loading Quiz...</h2>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

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
        <AlertTriangle
          size={40}
        />

        <h2>
          Failed To Load Quiz
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

  /* =========================
     DATA
  ========================= */

  const {
    content: questions,
    totalElements,
    totalPages,
  } = data;

  const answeredCount =
    Object.keys(
      selectedAnswers
    ).length;

  const progressPercent =
    totalElements > 0
      ? Math.round(
          (answeredCount /
            totalElements) *
            100
        )
      : 0;

  const isLastPage =
    page === totalPages - 1;

  /* =========================
     UI
  ========================= */

  return (
    <>
      <Outlet />

      <div
        className="page-container editorial-layout"
        style={{
          maxWidth: '900px',
        }}
      >
        <div
          style={{
            marginBottom: '2rem',
          }}
        >
          <h1>
            Quiz Challenge
          </h1>

          <p>
            Complete all
            questions and
            submit your
            answers.
          </p>

          <div
            style={{
              marginTop: '1rem',
            }}
          >
            <div>
              {answeredCount}/
              {totalElements}
            </div>

            <div
              style={{
                height: '8px',
                width: '100%',
                background:
                  '#222',
                borderRadius:
                  '999px',
                overflow:
                  'hidden',
              }}
            >
              <div
                style={{
                  height:
                    '100%',
                  width: `${progressPercent}%`,
                  background:
                    '#4ade80',
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: '2rem',
          }}
        >
          {questions.map(
            (
              question,
              index
            ) => {
              const selectedOption =
                selectedAnswers[
                  question.id
                ];

              const absoluteIndex =
                page * 2 +
                index +
                1;

              return (
                <div
                  key={
                    question.id
                  }
                  className="editorial-card"
                  style={{
                    padding:
                      '2rem',
                  }}
                >
                  <div
                    style={{
                      marginBottom:
                        '1rem',
                    }}
                  >
                    QUESTION #
                    {
                      absoluteIndex
                    }
                  </div>

                  <h2
                    style={{
                      marginBottom:
                        '2rem',
                    }}
                  >
                    {
                      question.questionText
                    }
                  </h2>

                  <div
                    style={{
                      display:
                        'flex',
                      flexDirection:
                        'column',
                      gap: '1rem',
                    }}
                  >
                    {question.options.map(
                      (
                        option,
                        optionIndex
                      ) => {
                        const letter =
                          String.fromCharCode(
                            65 +
                              optionIndex
                          );

                        const isSelected =
                          selectedOption ===
                          option.id;

                        return (
                          <button
                            key={
                              option.id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectOption(
                                question.id,
                                option.id
                              )
                            }
                            style={{
                              padding:
                                '1rem',
                              borderRadius:
                                '12px',
                              border:
                                isSelected
                                  ? '2px solid #4ade80'
                                  : '1px solid #333',
                              background:
                                isSelected
                                  ? 'rgba(74,222,128,0.1)'
                                  : '#111',
                              display:
                                'flex',
                              justifyContent:
                                'space-between',
                              alignItems:
                                'center',
                              cursor:
                                'pointer',
                            }}
                          >
                            <div
                              style={{
                                display:
                                  'flex',
                                gap: '1rem',
                                alignItems:
                                  'center',
                              }}
                            >
                              <div>
                                {
                                  letter
                                }
                              </div>

                              <span>
                                {
                                  option.optionText
                                }
                              </span>
                            </div>

                            {isSelected && (
                              <Check
                                size={
                                  18
                                }
                              />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            marginTop: '2rem',
          }}
        >
          <button
            className="btn-outline"
            disabled={page === 0}
            onClick={handlePrev}
          >
            <ChevronLeft
              size={16}
            />

            Previous
          </button>

          {isLastPage ? (
            <button
              className="btn-primary"
              disabled={
                submitMutation.isPending ||
                answeredCount <
                  totalElements
              }
              onClick={
                handleSubmit
              }
            >
              {submitMutation.isPending ? (
                'Submitting...'
              ) : (
                <>
                  Submit Quiz

                  <Send
                    size={15}
                  />
                </>
              )}
            </button>
          ) : (
            <button
              className="btn-outline"
              onClick={handleNext}
            >
              Next

              <ChevronRight
                size={16}
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}