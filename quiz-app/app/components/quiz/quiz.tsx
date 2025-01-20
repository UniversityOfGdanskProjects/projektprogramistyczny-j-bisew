'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizContext, QuizProvider } from './quizContext';
import QuizQuestion from './quizQuestion';
import { type QuestionType } from '../types/quiz';

interface QuizProps {
  quizId: string;
}

interface QuizState {
  currentQuestionIndex: number;
  answers: { [key: string]: string[] };
  timeRemaining: number | null;
  isSubmitted: boolean;
  startTime: number;
}

function QuizField({ quizId }: QuizProps) {
  const router = useRouter();
  const { fetchQuiz, currentQuiz, loading, error } = useQuizContext();
  const [quizState, setQuizState] = useState<QuizState>(() => ({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: null,
    isSubmitted: false,
    startTime: Date.now()
  }));

  useEffect(() => {
    if (quizId) {
      fetchQuiz(quizId);
    }
  }, [quizId, fetchQuiz]);

  useEffect(() => {
    if (currentQuiz?.timeLimit) {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: currentQuiz.timeLimit ? currentQuiz.timeLimit : null
      }));

      const timer = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining === null || prev.timeRemaining <= 0 || prev.isSubmitted) {
            clearInterval(timer);
            return { ...prev, isSubmitted: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuiz]);

  const handleAnswerChange = (
    questionId: string, 
    answer: string, 
    questionType: QuestionType
  ) => {
    if (!questionId) return;

    setQuizState(prev => {
      const currentAnswers = prev.answers[questionId] ?? 
        (questionType === 'MULTIPLE' ? [] : ['']);
      
      let newAnswers: string[];
      
      switch (questionType) {
        case 'SINGLE':
          newAnswers = [answer];
          break;
        case 'MULTIPLE':
          newAnswers = currentAnswers.includes(answer)
            ? currentAnswers.filter(a => a !== answer)
            : [...currentAnswers, answer];
          break;
        case 'OPEN':
          newAnswers = [answer];
          break;
        default:
          newAnswers = currentAnswers;
      }
      
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: newAnswers }
      };
    });
  };

  const navigateQuestion = (direction: 'next' | 'prev') => {
    setQuizState(prev => {
      if (direction === 'next' && prev.currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      if (direction === 'prev' && prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
    
    // Pass answers and time data to results page
    router.push(`/quizzes/${quizId}/result?answers=${encodeURIComponent(JSON.stringify(quizState.answers))}&time=${timeSpent}`);
  };

  if (loading) {
    return <div className="text-white text-center">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  if (!currentQuiz) {
    return <div className="text-white text-center">Quiz not found</div>;
  }

  const currentQuestion = currentQuiz.questions[quizState.currentQuestionIndex];

  return (
    <div className="space-y-6">
      <QuizQuestion
        title={currentQuiz.title}
        questionNumber={quizState.currentQuestionIndex + 1}
        totalQuestions={currentQuiz.questions.length}
        timeRemaining={quizState.timeRemaining}
        question={currentQuestion}
        currentAnswers={quizState.answers[currentQuestion.id || ''] || []}
        onAnswerChange={handleAnswerChange}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => navigateQuestion('prev')}
          disabled={quizState.currentQuestionIndex === 0}
          className="px-6 py-2 rounded-md bg-slate-700 text-white 
                   hover:bg-slate-600 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {quizState.currentQuestionIndex === currentQuiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-green-600 text-white 
                     hover:bg-green-700 transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => navigateQuestion('next')}
            className="px-6 py-2 rounded-md bg-blue-600 text-white 
                     hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default function Quiz({ quizId }: QuizProps) {
    return (
        <QuizProvider>
            <QuizField quizId={quizId} />
        </QuizProvider>
    );
}
