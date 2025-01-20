import { fetchApi } from './api';
import type { Quiz, QuizFormData } from '../components/types/quiz';

export const quizService = {
  getQuizzes: () => fetchApi<Quiz[]>('/quizzes'),
  
  searchQuizzes: (pattern: string) => fetchApi<Quiz[]>(`/quizzes/search?pattern=${pattern}`),

  getQuiz: (id: string) => fetchApi<Quiz>(`/quizzes/${id}`),

  createQuiz: (data: QuizFormData) =>fetchApi<Quiz>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateQuiz: (id: string, quizData: Partial<QuizFormData>) => fetchApi<Quiz>(`/quizzes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(quizData),
  }),

  deleteQuiz: (id: string) => fetchApi(`/quizzes/${id}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response) {
      return { data: { success: true }, error: null };
    }
    return response;
  }),
};