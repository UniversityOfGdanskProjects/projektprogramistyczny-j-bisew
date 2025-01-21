'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '../components/searchBar';
import { quizService } from '../services/quiz';
import type { Quiz } from '../components/types/quiz';
import { User, UserRole } from '../components/types/auth';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      if (searchQuery) {
        searchQuizzes(searchQuery);
      } else {
        fetchQuizzes();
      }
    }, 300);

    return () => clearTimeout(debouncedSearch);
  }, [searchQuery]);

  async function fetchQuizzes() {
    try {
      setIsLoading(true);
      const data = await quizService.getQuizzes();
      if (data.error) {
        setError(data.error);
        return;
      } else if (data.data) {
        setQuizzes(data.data);
      }
    } catch (error) {
      setError('Failed to fetch quizzes');
    } finally {
      setIsLoading(false);
    }
  }

  const searchQuizzes = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await quizService.searchQuizzes(query);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setQuizzes(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to search quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
  
    try {
      await quizService.deleteQuiz(quizId);
      fetchQuizzes();
    } catch (err) {
      setError('Failed to delete quiz');
    }
  };

  const canDeleteQuiz = (quiz: Quiz) => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    if (user.role === UserRole.MODERATOR) return true;
    return false;
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesCategory = selectedCategory === 'all' || 
                          quiz.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'all' || 
                            quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100">Quizzes</h1>
            <p className="text-slate-400 mt-2">
              Browse through our collection of quizzes or search for specific ones
            </p>
          </div>
        <SearchBar
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={setSearchQuery}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
        />
      </div>

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
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
                    <p className="text-slate-300 capitalize">{quiz.difficulty.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Questions</p>
                    <p className="text-slate-300">{quiz.questions.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Time limit</p>
                    <p className="text-slate-300">{quiz.timeLimit ? `${quiz.timeLimit} sec` : 'No time limit'}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-slate-400">
                by {quiz.createdBy.name}
              </div>
              <div className="flex gap-2">
                {canDeleteQuiz(quiz) && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuiz(quiz.id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={() => router.push(`/quizzes/${quiz.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

      {!isLoading && !error && filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No quizzes found</p>
        </div>
      )}
    </div>
  );
}