'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuizContext, QuizProvider } from '@/app/components/quiz/quizContext';
import { Question, QuestionType } from '@/app/components/types/quiz';
import Leaderboard from '../leaderboard';
import Comments from '../comments';

interface QuestionResult {
  question: Question;
  userAnswer: string[];
  isCorrect: boolean;
}

function QuizResult({ params: { id: quizId } }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchQuiz, currentQuiz } = useQuizContext();
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    const init = async () => {
      await fetchQuiz(quizId);

      const answersParam = searchParams.get('answers');
      const timeParam = searchParams.get('time');

      if (!answersParam || !currentQuiz) {
        return;
      }

      const userAnswers = JSON.parse(decodeURIComponent(answersParam));
      setTimeSpent(Number(timeParam) || 0);

      const questionResults = currentQuiz.questions.map(question => {
        const userAnswer = question.id !== undefined ? userAnswers[question.id] || [] : [];
        const isCorrect = checkAnswer(userAnswer, question.correctAnswer, question.type);

        return {
          question,
          userAnswer,
          isCorrect
        };
      });

      setResults(questionResults);

      const correctAnswers = questionResults.filter(r => r.isCorrect).length;
      setScore({
        correct: correctAnswers,
        total: questionResults.length
      });
      
      if (questionResults.length > 0) {
        const user = localStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          const percentage = (correctAnswers / questionResults.length) * 100;
          
          // Get existing scores
          const savedScores = localStorage.getItem(`quiz_${quizId}_leaderboard`) || '[]';
          const scores = JSON.parse(savedScores);
          
          // Add new score
          scores.push({
            userId: parsedUser.id,
            userName: parsedUser.name,
            score: percentage,
            timeSpent: Number(timeParam) || 0,
            timestamp: Date.now()
          });
          
          // Save updated scores
          localStorage.setItem(`quiz_${quizId}_leaderboard`, JSON.stringify(scores));
          // Trigger storage event manually for same-window updates
          window.dispatchEvent(new Event('storage'));
        }      
      }
    };

    init();
  }, [quizId, searchParams, currentQuiz, fetchQuiz, router]);

  if (!currentQuiz || results.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 w-1/3 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 w-5/6 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        {/* Score Overview */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Quiz Results</h1>
          <div className="text-5xl font-bold text-blue-500 mb-2">
            {((score.correct / score.total) * 100).toFixed(1)}%
          </div>
          <p className="text-slate-300">
            Score: {score.correct} / {score.total} points
          </p>
          <p className="text-slate-400">
            Time taken: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">
            Questions Review
          </h2>
          {results.map((result, index) => (
            <div 
              key={result.question.id}
              className={`p-4 rounded-lg ${
                result.isCorrect 
                  ? 'bg-green-800/20 border border-green-600/30' 
                  : 'bg-red-800/20 border border-red-600/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-slate-100">
                  Question {index + 1}
                </h3>
                <span className="text-slate-300">
                  {result.isCorrect ? '1' : '0'} point
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-slate-200 font-medium mb-2">
                  {result.question.title}
                </p>
                <p className="text-slate-300">
                  Your answer: {result.userAnswer.join(', ') || 'No answer'}
                </p>
                {!result.isCorrect && (
                  <p className="text-green-400">
                    Correct answer: {result.question.correctAnswer.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/quizzes')}
            className="px-6 py-2 bg-slate-700 text-slate-100 rounded-md 
                     hover:bg-slate-600 transition-colors"
          >
            Back to Quizzes
          </button>
          <button
            onClick={() => router.push(`/quizzes/${quizId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md 
                     hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      <Leaderboard quizId={quizId} />
      <Comments quizId={quizId} />
    </div>
  );
}

function checkAnswer(userAnswer: string[], correctAnswer: string[], type: QuestionType): boolean {
  switch (type) {
    case 'SINGLE':
      return userAnswer[0] === correctAnswer[0];

    case 'MULTIPLE':
      return (
        userAnswer.length === correctAnswer.length &&
        userAnswer.every(ans => correctAnswer.includes(ans)) &&
        correctAnswer.every(ans => userAnswer.includes(ans))
      );

    case 'OPEN':
      return correctAnswer.some(correct => 
        userAnswer[0]?.toLowerCase().trim() === correct.toLowerCase().trim()
      );

    default:
      return false;
  }
}
export default function QuizResultsPage({ 
    params: { id: quizId } 
  }: { 
    params: { id: string } 
  })
{
    return (
        <QuizProvider>
            <QuizResult params={{ id: quizId }} />
        </QuizProvider>
    );
}