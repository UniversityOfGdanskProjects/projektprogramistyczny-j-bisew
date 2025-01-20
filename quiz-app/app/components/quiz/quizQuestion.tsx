'use client';

import { type Question, type QuestionType } from '../types/quiz';

interface QuizQuestionProps {
  title: string;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number | null;
  question: Question;
  currentAnswers: string[];
  onAnswerChange: (questionId: string, answer: string, type: QuestionType) => void;
}

export default function QuizQuestion({
  title,
  questionNumber,
  totalQuestions,
  timeRemaining,
  question,
  currentAnswers,
  onAnswerChange
}: QuizQuestionProps) {
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = (questionNumber / totalQuestions) * 100;
  const questionId = question.id || `question-${questionNumber}`;

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl p-6">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        {timeRemaining !== null && (
          <div className="text-xl font-semibold text-red-500">
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-medium text-slate-100 mb-4">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <p className="text-slate-300 mb-6">{question.title}</p>

        {/* Question Types */}
        <div className="space-y-4">
          {question.type === 'SINGLE' && question.answers && (
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 rounded-lg hover:bg-slate-600 
                           cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${questionId}`}
                    value={answer}
                    checked={currentAnswers[0] === answer}
                    onChange={() => onAnswerChange(questionId, answer, 'SINGLE')}
                    className="form-radio mr-3"
                  />
                  <span className="text-slate-200">{answer}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'MULTIPLE' && question.answers && (
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 rounded-lg hover:bg-slate-600 
                           cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={answer}
                    checked={currentAnswers.includes(answer)}
                    onChange={() => onAnswerChange(questionId, answer, 'MULTIPLE')}
                    className="form-checkbox mr-3"
                  />
                  <span className="text-slate-200">{answer}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'OPEN' && (
            <textarea
              className="w-full p-4 bg-slate-900 border border-slate-600 rounded-lg 
                        text-slate-200 focus:border-blue-500 focus:ring-1 
                        focus:ring-blue-500 transition-colors"
              placeholder="Type your answer here..."
              value={currentAnswers[0] || ''}
              onChange={(e) => onAnswerChange(questionId, e.target.value, 'OPEN')}
              rows={4}
            />
          )}
        </div>
      </div>
    </div>
  );
}