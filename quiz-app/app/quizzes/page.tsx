'use client';

import { useState } from 'react';
import SearchBar from '../components/searchBar';

// Temporary mock data until API is configured
const mockQuizzes = [
  {
    id: '1',
    title: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    category: 'Programming',
    difficulty: 'medium',
    questionsCount: 10,
    timeLimit: 15,
    author: 'John Doe',
  },
  // Add more mock quizzes as needed
];

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <SearchBar
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="programming">Programming</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                {quiz.title}
              </h3>
              <p className="text-slate-400 mb-4">{quiz.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Category</p>
                  <p className="text-slate-300">{quiz.category}</p>
                </div>
                <div>
                  <p className="text-slate-500">Difficulty</p>
                  <p className="text-slate-300 capitalize">{quiz.difficulty}</p>
                </div>
                <div>
                  <p className="text-slate-500">Questions</p>
                  <p className="text-slate-300">{quiz.questionsCount}</p>
                </div>
                <div>
                  <p className="text-slate-500">Time</p>
                  <p className="text-slate-300">{quiz.timeLimit} min</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-slate-400">
                  by {quiz.author}
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No quizzes found</p>
        </div>
      )}
    </div>
  );
}