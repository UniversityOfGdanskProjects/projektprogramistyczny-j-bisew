import { fetchApi } from './api';
import type { Quiz } from '../components/types/quiz';

export const quizService = {
  getQuizzes: () => fetchApi<Quiz[]>('/quizzes'),
  
  searchQuizzes: (pattern: string) => 
    fetchApi<Quiz[]>(`/quizzes/search?pattern=${pattern}`),

  getQuiz: (id: string) => fetchApi<Quiz>(`/quizzes/${id}`),
};