'use client';

import { useState } from 'react';
import { Question, QuestionType } from '../types/quiz';

interface QuizFormProps {
  onSubmit: (quizData: {
    title: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
    questions: Question[];
  }) => void;
  initialData?: {
    title: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit?: number;
    questions: Question[];
  };
  isEditing?: boolean;
}

export default function QuizForm({ onSubmit, initialData, isEditing = false }: QuizFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialData?.difficulty || 'medium');
  const [timeLimit, setTimeLimit] = useState<number | undefined>(initialData?.timeLimit);
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'single',
    content: '',
    options: [''],
    correctAnswers: [],
  });

  const handleAddQuestion = () => {
    if (currentQuestion.content && currentQuestion.type) {
      const newQuestion: Question = {
        id: Math.random().toString(36).substring(7),
        type: currentQuestion.type as QuestionType,
        content: currentQuestion.content,
        options: currentQuestion.options || [],
        correctAnswers: currentQuestion.correctAnswers || [],
      };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        type: 'single',
        content: '',
        options: [''],
        correctAnswers: [],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">
        {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-200">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-200">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium text-slate-200">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="timeLimit"
                value={timeLimit || ''}
                onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Questions</h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="p-4 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-slate-400">Question {index + 1}</span>
                    <p className="text-slate-100">{question.content}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
          <h4 className="text-lg font-medium text-slate-100 mb-4">Add New Question</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  type: e.target.value as QuestionType
                })}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="open">Open Question</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Question Content</label>
              <textarea
                value={currentQuestion.content}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  content: e.target.value
                })}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200"
                rows={2}
              />
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
          >
            {isEditing ? 'Save Changes' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}